---
type: concept
title: The PluginSetupProcessor (PSP)
tags: [core, plugin-framework, security]
source: osx/src/framework/plugin/setup/PluginSetupProcessor.sol, osx/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol
---

# The PluginSetupProcessor (PSP)

The PSP is the engine that installs, updates, and uninstalls plugins on a DAO. It is the **only** contract that changes a DAO's permissions on behalf of a [plugin setup](/framework/plugin-setup.md), which makes it the most security-critical piece of the framework: to do its job it must be *temporarily* granted `ROOT_PERMISSION_ID` on the DAO. Understanding the PSP is understanding how OSx keeps that power safe.

## Why prepare and apply are separate

Every lifecycle operation is **two steps**:

1. **`prepare…`** — *permissionless*. Anyone can call it. It runs the setup's [`prepare…`](/framework/plugin-setup.md) function, which deploys the plugin and helpers and returns the requested permission changes. It **does not touch the DAO**; it only records that a specific preparation is now pending.
2. **`apply…`** — *permission-gated*. It calls the DAO's [`applyMultiTargetPermissions`](/core/permissions.md#batch-changes-permissionlib) to actually grant/revoke, which is why the PSP needs ROOT on the DAO here.

Why split them? Because the party who *computes* an installation (permissionless, could be anyone, could be malicious) must not be the party who *authorizes* it. Splitting lets a DAO's governance review the **exact** permission set a preparation would apply, and approve it through a proposal, before any state changes. The preparer can grant themselves nothing; only a DAO-authorized `apply` mutates anything. A [hashing scheme](#setup-ids-what-keeps-apply-honest) binds what gets applied to what was prepared, so nothing can be swapped in between.

This is the core safety property: **permissionless preparation, governed application.**

## The apply permissions

Calling an `apply…` requires the caller to hold, *on the PSP*, the matching permission granted by the target DAO (or to be the DAO itself):

- `APPLY_INSTALLATION_PERMISSION_ID`
- `APPLY_UPDATE_PERMISSION_ID`
- `APPLY_UNINSTALLATION_PERMISSION_ID`

## The temporary-ROOT window

Because `apply…` calls the DAO's permission functions, **the PSP must hold `ROOT_PERMISSION_ID` on the DAO for the duration of the apply**, and must not keep it. Leaving the PSP with ROOT is a critical vulnerability (it could then change any permission on the DAO). The safe pattern, which the [DAOFactory](/framework/dao-factory.md) performs atomically in one transaction:

```
grant PSP  ROOT on DAO
grant caller APPLY_INSTALLATION on PSP
  PSP.applyInstallation(...)          // PSP grants the plugin's permissions
revoke caller APPLY_INSTALLATION on PSP
revoke PSP ROOT on DAO
```

### Installing onto a live DAO

Creating a DAO isn't the only time you install a plugin, more often you add one to a DAO that's already running. The mechanism is the same grant→apply→revoke, but there's no factory to orchestrate it, so **governance does.** The install becomes a [proposal](/common/proposal.md) whose [actions](/core/execution.md) are exactly:

1. grant the PSP `ROOT` on the DAO,
2. call `PSP.applyInstallation(...)` (against a preparation someone already made permissionlessly),
3. revoke the PSP's `ROOT`.

When that proposal passes and the DAO [executes](/core/execution.md) it, the plugin is installed, its permissions wired, and the temporary ROOT gone, all in the one transaction the DAO's own governance authorized. This is the mental model for every "add a plugin" integration: **a proposal that wraps the ROOT window around an apply.** Updates and uninstalls work the same way, with the matching `APPLY_*` permission and `apply…` call.

## Setup IDs: what keeps apply honest

The PSP tracks per-plugin state keyed by `pluginInstallationId = keccak256(dao, plugin)`. Two hashes do the load-bearing work:

- **prepared setup id** — fingerprints a *preparation*: the version, the exact permissions, the helpers, the extra data, **and** the operation type (`Installation` / `Update` / `Uninstallation`). Mixing the type in means an install preparation can't be replayed as an update. At `apply`, the PSP recomputes this from the arguments you pass and requires a match, so you must apply *exactly* what was prepared.
- **applied setup id** — fingerprints the *live state*: version + helpers (no permissions). It's what `prepareUpdate`/`prepareUninstallation` recompute from the payload you supply, which is how the PSP verifies you actually know the plugin's true current version and helper set (`InvalidAppliedSetupId` otherwise).

> **The block-number invariant.** A preparation is applicable only if it was prepared *after* the last applied action for that plugin. Every `apply…` stamps the plugin's state with the current block, which **invalidates all other pending preparations** for that plugin. So if two competing installations are prepared, applying one automatically makes the other un-appliable (`SetupNotApplicable`). This prevents stale or racing preparations from landing after the fact.

## The three lifecycles

- **Install** — `prepareInstallation` deploys + records; `applyInstallation` grants the permissions. Fails if the plugin is already installed.
- **Update** (UUPS plugins only) — `prepareUpdate` is **release-locked**: the release number must stay the same and the build must strictly increase (`InvalidUpdateVersion` otherwise). `applyUpdate` performs the actual UUPS proxy upgrade (using the `initData` from prepare) and applies any permission diff. There's a **metadata-only update** fast path (often called "UI-only" because only the off-chain [metadata](/framework/plugin-metadata.md), display text, docs, the params schema, changed while the on-chain setup/implementation is identical): the proxy isn't upgraded and nothing is redeployed, the version pointer just moves. Because it changes no permissions, `applyUpdate` skips the DAO's `applyMultiTargetPermissions` call entirely (and skips the proxy upgrade, since the implementation is unchanged), so a metadata-only update needs only `APPLY_UPDATE_PERMISSION_ID` on the PSP, **not** the [temporary-ROOT window](#the-temporary-root-window) a real update requires. It is the one lifecycle step that touches neither permissions nor code, which makes it cheap to authorize.
- **Uninstall** — `prepareUninstallation` returns the permissions to revoke; `applyUninstallation` revokes them and clears the plugin's applied-setup id (so it could later be reinstalled).

Because updates can't cross releases, **migrating across a release is an uninstall + reinstall**, by design: a new release signals an incompatible change (see [PluginRepo](/framework/plugin-repo.md#release-vs-build)).

## Keep in mind

- **Helper order matters.** You must pass `currentHelpers` in the exact order a prior prepare returned them, or the applied-setup-id check fails.
- **Preparing is cheap and permissionless**, so a griefer can deploy plugin instances at will, but can never apply them. Don't treat a `…Prepared` event as an installation.
- **Never leave the PSP with ROOT.** If you script installs manually, revoke ROOT in the same transaction.

## See also

- [Plugin setup](/framework/plugin-setup.md) — the setups the PSP runs.
- [The permission system](/core/permissions.md) — `applyMultiTargetPermissions` and ROOT.
- [DAOFactory](/framework/dao-factory.md) — the reference implementation of the temporary-ROOT dance.
- [PluginRepo](/framework/plugin-repo.md) — where the PSP looks up which setup to run.
