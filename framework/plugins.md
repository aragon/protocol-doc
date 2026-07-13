---
type: concept
title: The plugin model
tags: [plugin-framework]
source: osx/src/common/plugin/IPlugin.sol, osx/src/common/plugin/Plugin.sol
---

# The plugin model

The [DAO](../core/dao.md) is deliberately minimal: treasury, executor, permission database. **Everything else is a plugin.** Voting, multisig approval, membership, token management, spending policies, all of it is functionality installed onto a DAO rather than baked into it. This is the central bet of OSx: keep the core tiny and immutable-in-spirit, and make capability modular, versioned, and upgradeable.

A plugin is a smart contract associated with one DAO. It gates its own functions by [authorizing them against that DAO](../common/auth.md) (which resolves through the [permission system](../core/permissions.md)), and it acts on the world by having the DAO [execute](../core/execution.md) actions on its behalf. A governance plugin, for instance, is just a contract that (a) decides when a proposal has passed and (b) holds `EXECUTE_PERMISSION_ID` on the DAO so it can enact the result.

## Why a whole framework, not just "deploy a contract"

You could deploy a plugin contract and grant it permissions by hand. The framework exists because doing that *safely, cleanly and repeatably*, across many DAOs, many plugin authors, and many versions over time, is the hard part. It answers three questions the protocol can't leave to trust:

- **How is a plugin published and versioned?** → the [PluginRepo](./plugin-repo.md): one per plugin, storing every version as an immutable `release.build` tag pointing at a setup contract.
- **How does a DAO install a specific version, wiring exactly the right permissions, without handing anyone unchecked control?** → the [plugin setup](./plugin-setup.md) contract (which declares what to deploy and which permissions to grant) plus the [PluginSetupProcessor](./plugin-setup-processor.md) (which applies it under a two-step, governance-reviewable flow).
- **How does the ecosystem discover and trust DAOs and plugin repos?** → the [registries](./registries.md) and their ENS names.

The rest of this section is those pieces. If you're building a plugin, the reading order is: this page → [choosing a base](./plugin-types.md) → [plugin setup](./plugin-setup.md) → [PluginRepo](./plugin-repo.md) → [PSP](./plugin-setup-processor.md). If you're just installing plugins onto a DAO, [PSP](./plugin-setup-processor.md) and [DAOFactory](./dao-factory.md) are the pages you want.

## What every plugin shares

All plugins implement `IPlugin`, which declares one thing they must answer, `pluginType()`, telling the framework how the plugin is deployed (see [choosing a base](./plugin-types.md)):

```solidity
enum PluginType { UUPS, Cloneable, Constructable }
```

You never implement `IPlugin` directly; you extend one of the three [plugin base contracts](./plugin-types.md), which give you the DAO reference, the [`auth`](../common/auth.md) modifier, ERC-165 support, and the execution helpers below.

## How a plugin makes the DAO act

A plugin doesn't call arbitrary contracts directly; it routes actions through an executor, by default its own DAO. This routing is configurable per plugin via a `TargetConfig`:

```solidity
enum Operation { Call, DelegateCall }
struct TargetConfig { address target; Operation operation; }
```

(This `Operation` enum, `Call` / `DelegateCall`, is unrelated to [`PermissionLib.Operation`](../core/permissions.md#batch-changes-permissionlib) with `Grant` / `Revoke` / `GrantWithCondition`; they only share a name.)

- **`Call`** (the normal case) forwards to `target.execute(callId, actions, allowFailureMap)`, the DAO's [execute](../core/execution.md). Actions run as the DAO.
- **`DelegateCall`** runs the executor's logic in the plugin's own context (advanced; for plugins that embed execution rather than delegating to the DAO).

Older OSx hard-wired plugins to always execute on their `dao()`. `TargetConfig` generalizes that so a plugin can target a different [executor](../core/execution.md#the-standalone-executor). Setting it is gated by `SET_TARGET_CONFIG_PERMISSION_ID`.

> **Safety guard:** you cannot set a `TargetConfig` that both points at a contract implementing `IDAO` **and** uses `DelegateCall`, delegatecalling *into* a DAO would run DAO code in the plugin's storage and brick it. The base contract rejects that combination (`InvalidTargetConfig`).

## Keep in mind

- **Never `DelegateCall` into a DAO.** A `TargetConfig` pointing at an `IDAO` with `DelegateCall` is rejected (`InvalidTargetConfig`), it would run DAO code in the plugin's storage and brick it.
- **A plugin can only act once granted `EXECUTE_PERMISSION_ID` on its DAO.** A governance plugin that can't enact its results is almost always missing that grant.

## See also

- [Choosing a plugin base](./plugin-types.md) — Plugin vs Cloneable vs UUPS.
- [Plugin setup](./plugin-setup.md) — how a plugin declares its installation.
- [PluginSetupProcessor](./plugin-setup-processor.md) — the install/update/uninstall engine.
- [Proposals](../common/proposal.md) and [membership](../common/membership.md) — the building blocks governance plugins reuse.
