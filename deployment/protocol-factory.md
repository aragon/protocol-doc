---
type: concept
title: Protocol Factory
source: protocol-factory/src/ProtocolFactory.sol, protocol-factory/src/helpers/DAOHelper.sol, protocol-factory/src/helpers/ENSHelper.sol, protocol-factory/src/helpers/PluginRepoHelper.sol, protocol-factory/src/helpers/PSPHelper.sol, protocol-factory/src/helpers/interfaces.sol, protocol-factory/README.md
---

# Protocol Factory

The Protocol Factory deploys **OSx itself** on a new EVM chain. Where the [DAO Launchpad](./dao-launchpad.md) deploys *one DAO* onto an existing protocol, this deploys *the protocol*: the whole framework, its ENS naming, the governing Management DAO, and the core plugin repos, configured together in one deterministic process.

## The problem it solves

OSx is a framework, not a single contract. Before anyone can create a DAO on a chain, that chain needs the entire framework live and correctly cross-permissioned: the [DAO base](../core/dao.md) implementation, the [DAO and plugin registries](../framework/registries.md), the [PluginRepoFactory](../framework/plugin-repo.md), the [PluginSetupProcessor](../framework/plugin-setup-processor.md), the [DAOFactory](../framework/dao-factory.md), an [ENS](../framework/registries.md) setup for `dao.eth` and `plugin.dao.eth`, and the core plugins published so they can be installed. That is a large graph of contracts and permissions; wiring it by hand, transaction by transaction, is both error-prone and dangerous (each intermediate state leaves the protocol's control in flux). The factory makes standing it up a **single, reviewable, deterministic** event, so every chain gets the same canonical, correctly-owned deployment.

## What it stands up

- **OSx framework** — the registries, the `DAOFactory` and `PluginRepoFactory`, the `PluginSetupProcessor`, and the shared executor, deployed as proxies over their base implementations.
- **ENS naming** — a registry + resolver and two subdomain registrars (`dao.eth` for DAOs, `plugin.dao.eth` for plugin repos), so registered DAOs and repos get resolvable names.
- **The Management DAO** — the DAO that governs the protocol (below).
- **The core plugin repos** — Admin, Multisig, Token Voting, SPP, and Lock to Vote, each published into its own [PluginRepo](../framework/plugin-repo.md) owned by the Management DAO.

## The Management DAO governs the protocol

The **Management DAO** is an ordinary OSx [DAO](../core/dao.md), governed by a [Multisig](../plugins/multisig-plugin.md), that *owns the protocol's shared infrastructure*. It holds the permissions to register upgrades on the [registries](../framework/registries.md), operate the ENS subdomain registrars, and maintain the [core plugin repos](../framework/plugin-repo.md) by publishing new versions. The protocol is therefore **self-governed by an Aragon DAO**: changing a registry implementation or publishing a new core-plugin build requires a governance action of the Management DAO rather than a privileged key.

## Deploy once, then read-only forever

The factory is also a permanent, tamper-proof **record of exactly what was deployed**. Its constructor takes and freezes the entire configuration: every implementation address, the ENS domains, each core plugin's `(release, build)` and metadata, and the Management DAO's members and approval threshold. There is **no owner, no admin, and no setter** anywhere on the contract. You run the deployment to completion exactly once, and from then on the factory exposes two reads:

- `getParameters()` — the exact configuration the deployment used.
- `getDeployment()` — every address it produced (the registries, the `DAOFactory`/`PluginRepoFactory`, the PSP, the ENS contracts, the Management DAO and its multisig, and each core plugin repo).

Nobody can change the record afterwards. The factory is the canonical source of truth for that chain's OSx deployment: anyone with its address can read both the settings used and the addresses produced, permanently and without trusting an off-chain manifest. Those records cannot be redirected later.

## Split to fit chain limits

The full graph is too big for one contract in one transaction, so the factory works around two EVM limits, without weakening the deploy-once-then-frozen guarantees:

- **Code size (EIP-170's ~24 KB).** Most deployment logic lives in separate **helper deployer factories**, `DAOHelper`, `ENSHelper`, `PluginRepoHelper`, and `PSPHelper`, passed into the ProtocolFactory's constructor. Embedding it all in one contract would exceed the bytecode cap.
- **Per-transaction gas.** The run is split into **five sequential phases**: the deployer calls `deployPhase()` repeatedly until it reports complete, because doing it in a single transaction would exceed the gas limit on many networks.

Deployment therefore uses multiple contracts *and* transactions. It still produces a frozen record and ends with the factory holding no power; the work is divided into phases to fit chain limits.

## Correct from genesis

During deployment, the factory temporarily holds `ROOT` + `EXECUTE` on the Management DAO. It configures every permission across the registries, registrars, repos, and the DAO's own multisig install, then **revokes both as the final step**. When deployment concludes, the factory has no power over anything it created; the Management DAO's multisig is the sole authority. The deployed bytecode is verified against OSx's audited source, so the running protocol provably matches reviewed code.

Granting temporary power and revoking it at completion is part of the general Aragon factory pattern, alongside one-time, atomic, verifiable onchain deployment. The [DAO Launchpad](./dao-launchpad.md)'s one-shot factory applies the same pattern to a single DAO.

**Version parity across chains.** When a core plugin's canonical version is a build > 1, the factory publishes placeholder versions for the earlier builds before the real one, so a plugin's `(release, build)` means the *same* thing on every chain.

## A fresh OSx for building plugins

The factory also deploys OSx for a plugin's test suite. A `ProtocolFactoryBuilder` (Foundry) creates a complete, fresh protocol with defaults or selected overrides, and you can read the results:

```solidity
ProtocolFactory factory = new ProtocolFactoryBuilder().build();
// ...run the deployment to completion...
ProtocolFactory.Deployment memory d = factory.getDeployment();  // daoFactory, PSP, repos, …
```

A [plugin author](../tooling/plugin-template.md) can therefore fork-test against the actual framework instead of custom mocks. The same factory deploys OSx on a chain and in CI.

## Keep in mind

- **This deploys the protocol, not a DAO.** To create a DAO on an already-deployed protocol, use the [DAO Launchpad](./dao-launchpad.md) and the [DAOFactory](../framework/dao-factory.md).
- **The Management DAO governs through its multisig.** Protocol upgrades and new core-plugin versions require that governance; there is no separate admin authority.
- **The factory keeps no power.** Its bootstrap `ROOT`/`EXECUTE` on the Management DAO is revoked as the final step. Deployment is complete only once those permissions are revoked.

## See also

- [DAO Launchpad](./dao-launchpad.md) — the DAO-scale counterpart (one DAO on an existing protocol).
- [Registries](../framework/registries.md) — the DAO/plugin registries and ENS naming this deploys and hands to the Management DAO.
- [PluginRepo](../framework/plugin-repo.md), [PluginSetupProcessor](../framework/plugin-setup-processor.md), [DAOFactory](../framework/dao-factory.md) — the framework pieces stood up here.
- [The deployment checklist](./deployment-checklist.md) — the ceremony and guarantees for actually running this deployment safely.
- [Deployment overview](./index.md).
