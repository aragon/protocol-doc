---
type: guide
title: Update a plugin
source: osx/src/framework/plugin/setup/PluginSetupProcessor.sol, osx/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol, osx/src/common/plugin/setup/IPluginSetup.sol, osx/src/common/plugin/PluginUUPSUpgradeable.sol
---

# Update a plugin

Moving an installed plugin to a newer version runs the **same prepare → governed apply** rhythm as [installing one](./install-a-plugin.md), with three things specific to updates: it is **release-locked**, there's a **metadata-only fast path** that skips the ROOT window entirely, and **uninstalling** is the mirror image. This guide assumes you already installed a plugin (see [Install a plugin](./install-a-plugin.md)); `plugin`, `dao`, and the original `currentHelpers` (from that install's `preparedSetupData.helpers`) are known, and the test holds `EXECUTE` on a bare DAO so it can `dao.execute` the apply batch directly.

## Step 1, prepare the update (release-locked)

`prepareUpdate` is permissionless like `prepareInstallation`, but it enforces the [versioning rule](../framework/plugin-repo.md#release-vs-build): the **release must stay the same and the build must strictly increase**, or it reverts `InvalidUpdateVersion`. (Crossing a release is an incompatible change, so that's an [uninstall + reinstall](../framework/plugin-setup-processor.md#the-three-lifecycles), not an update.)

```solidity
function test_update() public {
    PluginRepo.Tag memory currentTag = PluginRepo.Tag({release: 1, build: 3});
    PluginRepo.Tag memory newTag     = PluginRepo.Tag({release: 1, build: 4}); // same release, higher build

    IPluginSetup.SetupPayload memory payload = IPluginSetup.SetupPayload({
        plugin: plugin,
        currentHelpers: currentHelpers, // exactly what the last setup returned, in order
        data: bytes("")                 // update input the new build's setup expects (often empty)
    });

    (bytes memory initData, IPluginSetup.PreparedSetupData memory prepared) =
        psp.prepareUpdate(address(dao), PluginSetupProcessor.PrepareUpdateParams({
            currentVersionTag: currentTag,
            newVersionTag: newTag,
            pluginSetupRepo: repo,
            setupPayload: payload
        }));
    // ... apply in Step 2 (same function)
}
```

`currentHelpers` must be passed in the **exact order** the previous setup returned them, or the [applied-setup-id check](../framework/plugin-setup-processor.md#setup-ids-what-keeps-apply-honest) fails.

## Step 2, apply the update (governed, temporary-ROOT window)

Like the [install apply window](./install-a-plugin.md#step-3-apply-governed-inside-a-temporary-root-window), but with one crucial difference: `applyUpdate` performs the **UUPS proxy upgrade** (using `initData` from prepare), and that upgrade is authorized by `UPGRADE_PLUGIN_PERMISSION` on the *plugin*, which **`ROOT` does not confer** ([`isGranted`](../core/permissions.md) has no ROOT bypass). So for an implementation-changing update the PSP needs **two** temporary grants: `ROOT` on the DAO (for the permission diff) and `UPGRADE_PLUGIN_PERMISSION` on the plugin (for the upgrade). As with install, no `APPLY_UPDATE_PERMISSION` is needed, the DAO calls the PSP itself:

```solidity
    bytes32 ROOT = dao.ROOT_PERMISSION_ID();
    bytes32 UPGRADE_PLUGIN = keccak256("UPGRADE_PLUGIN_PERMISSION"); // PluginUUPSUpgradeable.UPGRADE_PLUGIN_PERMISSION_ID

    PluginSetupProcessor.ApplyUpdateParams memory applyParams = PluginSetupProcessor.ApplyUpdateParams({
        plugin: plugin,
        pluginSetupRef: PluginSetupRef({versionTag: newTag, pluginSetupRepo: repo}),
        initData: initData,
        permissions: prepared.permissions,
        helpersHash: hashHelpers(prepared.helpers)
    });

    Action[] memory actions = new Action[](5);
    // Open the window: PSP needs ROOT (permission diff) AND UPGRADE on the plugin (the proxy upgrade).
    actions[0] = Action(address(dao), 0, abi.encodeCall(PermissionManager.grant,  (address(dao), address(psp), ROOT)));
    actions[1] = Action(address(dao), 0, abi.encodeCall(PermissionManager.grant,  (plugin, address(psp), UPGRADE_PLUGIN)));
    actions[2] = Action(address(psp), 0, abi.encodeCall(PluginSetupProcessor.applyUpdate, (address(dao), applyParams)));
    // Close it: revoke both.
    actions[3] = Action(address(dao), 0, abi.encodeCall(PermissionManager.revoke, (plugin, address(psp), UPGRADE_PLUGIN)));
    actions[4] = Action(address(dao), 0, abi.encodeCall(PermissionManager.revoke, (address(dao), address(psp), ROOT)));
    dao.execute(bytes32(0), actions, 0);
}
```

That `UPGRADE_PLUGIN_PERMISSION` grant is exactly what separates update from install: `applyInstallation` only *deploys*, it never upgrades a proxy, so it needs `ROOT` alone. (Some plugin setups instead grant the PSP a *standing* upgrade permission at install; then the window drops back to ROOT-only. Granting it per-update, as here, works regardless.)

## The metadata-only shortcut

If a new build changes **only** the off-chain [metadata](../framework/plugin-metadata.md) (docs, the params schema) and reuses the *same setup contract*, so the implementation address is unchanged, the update touches no permissions and no code. `prepareUpdate` returns an empty permission set, and `applyUpdate` then skips both the proxy upgrade and the permission apply. Self-executed by the DAO it needs **no** temporary grants at all (no ROOT, no upgrade permission); handed to a keeper it needs only `APPLY_UPDATE_PERMISSION_ID`. Either way it's the cheapest lifecycle step.

## Uninstalling: the mirror

Uninstalling is the same shape, `prepareUninstallation` returns the permissions to **revoke** (not grant), and `applyUninstallation` runs in the same governed window (with `APPLY_UNINSTALLATION_PERMISSION_ID`):

```solidity
function test_uninstall() public {
    PluginSetupRef memory ref =
        PluginSetupRef({versionTag: PluginRepo.Tag({release: 1, build: 4}), pluginSetupRepo: repo});
    IPluginSetup.SetupPayload memory payload =
        IPluginSetup.SetupPayload({plugin: plugin, currentHelpers: currentHelpers, data: bytes("")});

    // Prepare (permissionless): returns the permissions to REVOKE, the mirror of install's grants.
    PermissionLib.MultiTargetPermission[] memory toRevoke =
        psp.prepareUninstallation(address(dao), PluginSetupProcessor.PrepareUninstallationParams(ref, payload));

    PluginSetupProcessor.ApplyUninstallationParams memory applyParams =
        PluginSetupProcessor.ApplyUninstallationParams({plugin: plugin, pluginSetupRef: ref, permissions: toRevoke});

    // Apply in a temporary-ROOT window. Simpler than update: uninstall only revokes permissions,
    // there's no proxy upgrade (no UPGRADE grant) and, self-executed by the DAO, no APPLY_UNINSTALLATION_PERMISSION.
    bytes32 ROOT = dao.ROOT_PERMISSION_ID();
    Action[] memory actions = new Action[](3);
    actions[0] = Action(address(dao), 0, abi.encodeCall(PermissionManager.grant,  (address(dao), address(psp), ROOT)));
    actions[1] = Action(address(psp), 0, abi.encodeCall(PluginSetupProcessor.applyUninstallation, (address(dao), applyParams)));
    actions[2] = Action(address(dao), 0, abi.encodeCall(PermissionManager.revoke, (address(dao), address(psp), ROOT)));
    dao.execute(bytes32(0), actions, 0);

    // The plugin can no longer make the DAO act.
    assertFalse(dao.hasPermission(address(dao), plugin, dao.EXECUTE_PERMISSION_ID(), ""));
}
```

After it applies, the plugin's applied-setup id is cleared, so the same plugin *could* later be reinstalled fresh.

## What you just saw

- Update is prepare → apply like install, but **release-locked**: same release, strictly higher build (`InvalidUpdateVersion` otherwise). Its apply does the UUPS upgrade, which needs the PSP to hold `UPGRADE_PLUGIN_PERMISSION` on the plugin, **`ROOT` alone doesn't authorize the upgrade**.
- A **metadata-only** update changes nothing on-chain, so it skips the ROOT window and needs only `APPLY_UPDATE`.
- **Uninstall** is the same window with the setup's *revoke* list; a cross-release migration is uninstall + reinstall.

## Next

- [Build a plugin](./build-a-plugin.md), write the `PluginSetup` (and its `prepareUpdate`) that all of this drives.
- [Publish a plugin to a PluginRepo](./publish-a-plugin.md), cut the new build this update installs.
