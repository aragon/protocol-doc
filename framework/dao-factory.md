---
type: concept
title: DAOFactory (creating a DAO)
tags: [plugin-framework, security]
source: osx/src/framework/dao/DAOFactory.sol
---

# DAOFactory (creating a DAO)

`DAOFactory.createDao` is the front door to the protocol: in **one transaction** it deploys a [DAO](../core/dao.md), registers it, installs an initial set of [plugins](./plugins.md), and leaves the DAO safely self-governing with no external party in control. It is the canonical, and safest, way to create a DAO, and the clearest worked example of the [permission](../core/permissions.md) choreography the whole framework depends on.

## What you pass

```solidity
struct DAOSettings   { address trustedForwarder; string daoURI; string subdomain; bytes metadata; }
struct PluginSettings { PluginSetupRef pluginSetupRef; bytes data; }

function createDao(DAOSettings _daoSettings, PluginSettings[] _pluginSettings)
    external returns (DAO createdDao, InstalledPlugin[] installedPlugins);
```

Each `PluginSettings` names a plugin version (a [repo](./plugin-repo.md) + version tag) and its install `data`. The factory prepares and applies each one via the [PSP](./plugin-setup-processor.md).

## The permission choreography (why order matters)

This is the [temporary-ROOT dance](./plugin-setup-processor.md#the-temporary-root-window) made concrete. When creating a DAO with plugins:

1. **Deploy the DAO proxy**, with the factory as initial owner, so the factory transiently holds `ROOT` on the new DAO.
2. **Register** the DAO in the [DAORegistry](./dao-registry.md) (assigning its ENS subdomain).
3. **Install each plugin through the [PSP temporary-ROOT window](./plugin-setup-processor.md#the-temporary-root-window):** grant the PSP `ROOT` and the factory `APPLY_INSTALLATION`, `prepareInstallation` + `applyInstallation` each plugin, then revoke both temporary grants.
4. **Grant the DAO ROOT and its admin permissions over itself** (`UPGRADE_DAO`, `SET_METADATA`, …), so the organization self-governs.
5. **Revoke the factory's own initial ROOT, last.** After this the factory has zero control.

Because it's one transaction, if any step reverts the whole thing rolls back, **atomicity is the safety net** that guarantees no half-configured DAO with dangling ROOT is ever left behind.

> **With plugins vs without.** If you pass plugins, the caller is *not* granted `EXECUTE_PERMISSION_ID`, governance comes from the installed plugin(s). If you pass **no** plugins, the factory instead grants `EXECUTE` to `msg.sender`, otherwise the DAO would be uncontrollable. So a bare DAO is directly caller-operated until you install governance.

## The takeaway

Two invariants are worth carrying to any custom deployment: **the DAO ends up holding ROOT over itself**, and **no external address (factory, PSP, deployer) retains any elevated permission**. If you ever wire a DAO by hand instead of via the factory, reproduce exactly that end state.

## See also

- [The DAO contract](../core/dao.md) — what gets deployed and how ROOT is bootstrapped.
- [PluginSetupProcessor](./plugin-setup-processor.md) — the install engine and its temporary-ROOT window.
- [Registries](./registries.md) — where the new DAO is registered.
- [Deployment](../deployment/index.md) — deploying the whole protocol, and the DAO launchpad.
