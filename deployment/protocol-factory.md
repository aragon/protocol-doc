---
type: concept
title: Protocol Factory
tags: [deployment, tooling]
source: protocol-factory/src/ProtocolFactory.sol, protocol-factory/src/helpers/DAOHelper.sol, protocol-factory/src/helpers/ENSHelper.sol, protocol-factory/src/helpers/PluginRepoHelper.sol, protocol-factory/src/helpers/PSPHelper.sol, protocol-factory/src/helpers/interfaces.sol, protocol-factory/README.md
---

# Protocol Factory

The Protocol Factory brings **OSx itself** up on a new EVM chain. Where the [DAO Launchpad](/deployment/dao-launchpad.md) deploys *one DAO* onto an existing protocol, this deploys *the protocol*: the whole framework, its ENS naming, the governing Management DAO, and the core plugin repos, wired together in one deterministic orchestration.

## The problem it solves

OSx is a framework, not a single contract. Before anyone can create a DAO on a chain, that chain needs the entire framework live and correctly cross-permissioned: the [DAO base](/core/dao.md) implementation, the [DAO and plugin registries](/framework/registries.md), the [PluginRepoFactory](/framework/plugin-repo.md), the [PluginSetupProcessor](/framework/plugin-setup-processor.md), the [DAOFactory](/framework/dao-factory.md), an [ENS](/framework/registries.md) setup for `dao.eth` and `plugin.dao.eth`, and the core plugins published so they can be installed. That is a large graph of contracts and permissions; wiring it by hand, transaction by transaction, is both error-prone and dangerous (each intermediate state leaves the protocol's control in flux). The factory makes standing it up a **single, reviewable, deterministic** event, so every chain gets the same canonical, correctly-owned deployment.

## What it stands up

- **OSx framework** — the registries, the `DAOFactory` and `PluginRepoFactory`, the `PluginSetupProcessor`, and the shared executor, deployed as proxies over their base implementations.
- **ENS naming** — a registry + resolver and two subdomain registrars (`dao.eth` for DAOs, `plugin.dao.eth` for plugin repos), so registered DAOs and repos get resolvable names.
- **The Management DAO** — the DAO that governs the protocol (below).
- **The core plugin repos** — Admin, Multisig, Token Voting, SPP, and Lock to Vote, each published into its own [PluginRepo](/framework/plugin-repo.md) owned by the Management DAO.

## The Management DAO governs the protocol

The linchpin is the **Management DAO**: an ordinary OSx [DAO](/core/dao.md), governed by a [Multisig](/plugins/multisig-plugin.md), that *owns the protocol's shared infrastructure*. It holds the permissions to register upgrades on the [registries](/framework/registries.md), operate the ENS subdomain registrars, and maintain the [core plugin repos](/framework/plugin-repo.md) (publishing new versions). In other words, the protocol is **self-governed by an Aragon DAO**: changing a registry implementation or shipping a new core-plugin build is itself a governance action of the Management DAO, not a privileged key. OSx runs on OSx.

## Deploy once, then read-only forever

The factory is also a permanent, tamper-proof **record of exactly what was deployed**. Its constructor takes the entire configuration, every implementation address, the ENS domains, each core plugin's `(release, build)` and metadata, the Management DAO's members and approval threshold, and freezes it. There is **no owner, no admin, and no setter** anywhere on the contract. You run the deployment to completion exactly once, and from then on the factory exposes just two reads:

- `getParameters()` — the exact configuration the deployment used.
- `getDeployment()` — every address it produced (the registries, the `DAOFactory`/`PluginRepoFactory`, the PSP, the ENS contracts, the Management DAO and its multisig, and each core plugin repo).

Nobody can touch it afterwards. So the factory *is* the canonical source of truth for that chain's OSx deployment: point anyone at its address and they can read, trustlessly and permanently, both the settings used and the addresses produced, no off-chain manifest to trust, nothing that can be quietly re-pointed later. (The run is split into sequential phases, an external `deployPhase()` the deployer calls repeatedly until it reports complete, because on some chains doing it all in one transaction would exceed code-size and gas limits; that externality is exactly why the run is multi-transaction, and the deploy-once-then-frozen semantics are unchanged.)

## Correct from genesis

As it builds, the factory holds a temporary `ROOT` + `EXECUTE` handle on the Management DAO, wires every permission across the registries, registrars, repos, and the DAO's own multisig install, and then **revokes both as the final step**. When the deployment concludes the factory has no power over anything it created; the Management DAO's multisig is the sole authority. The deployed bytecode is verified against OSx's audited source, so the running protocol provably matches reviewed code.

**Version parity across chains.** When a core plugin's canonical version is a build > 1, the factory publishes placeholder versions for the earlier builds before the real one, so a plugin's `(release, build)` means the *same* thing on every chain.

## A fresh OSx for building plugins

The factory doubles as the cleanest way to get a *realistic* OSx into a plugin's test suite. A `ProtocolFactoryBuilder` (Foundry) stands up a complete, fresh protocol, defaults or selectively overridden, and you read the results straight back:

```solidity
ProtocolFactory factory = new ProtocolFactoryBuilder().build();
// ...run the deployment to completion...
ProtocolFactory.Deployment memory d = factory.getDeployment();  // daoFactory, PSP, repos, …
```

So a [plugin author](/tooling/plugin-template.md) can fork-test against the actual framework instead of hand-rolled mocks, the very factory that ships OSx to a chain also spins it up in CI.

## Keep in mind

- **This deploys the protocol, not a DAO.** To create a DAO on an already-deployed protocol, that's the [DAO Launchpad](/deployment/dao-launchpad.md) and the [DAOFactory](/framework/dao-factory.md), not this.
- **The Management DAO is a real DAO, with real governance.** Protocol upgrades and new core-plugin versions flow through its multisig; there's no separate admin backdoor.
- **The factory keeps no power.** Its bootstrap `ROOT`/`EXECUTE` on the Management DAO is revoked as the final step, the deployment isn't "done" until the factory is powerless.

## See also

- [DAO Launchpad](/deployment/dao-launchpad.md) — the DAO-scale counterpart (one DAO on an existing protocol).
- [Registries](/framework/registries.md) — the DAO/plugin registries and ENS naming this deploys and hands to the Management DAO.
- [PluginRepo](/framework/plugin-repo.md), [PluginSetupProcessor](/framework/plugin-setup-processor.md), [DAOFactory](/framework/dao-factory.md) — the framework pieces stood up here.
- [The deployment checklist](/deployment/deployment-checklist.md) — the ceremony and guarantees for actually running this deployment safely.
- [Deployment overview](/deployment/index.md).
