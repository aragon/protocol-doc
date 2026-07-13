---
type: guide
title: Build a plugin
source: osx-plugin-template-foundry/src/MyUpgradeablePlugin.sol, osx-plugin-template-foundry/src/setup/MyPluginSetup.sol
---

# Build a plugin

A plugin is **two artifacts**: the **plugin contract** (your logic, gated by [permissions](../core/permissions.md)) and its **[`PluginSetup`](../framework/plugin-setup.md)** (the recipe that deploys the plugin and declares exactly which permissions to grant on install and revoke on uninstall). The setup is what the [PSP applies](./install-a-plugin.md) in the temporary-ROOT window; get it right and your plugin installs, updates, and uninstalls cleanly everywhere.

Start from the [Foundry plugin template](../tooling/plugin-template.md) (the [Setup](./setup.md) scaffold): it gives you starter contracts for all three [base types](../framework/plugin-types.md) (`MyStaticPlugin`, `MyCloneablePlugin`, `MyUpgradeablePlugin`), a `MyPluginSetup`, tests, and deploy scripts. This guide uses the **UUPS-upgradeable** variant. (Imports below are the template's.)

## Step 1, the plugin contract

Inherit [`PluginUUPSUpgradeable`](../framework/plugin-types.md) (it gives you `dao()`, the `auth` modifier, and UUPS upgrade authorization), initialize with `__PluginUUPSUpgradeable_init(_dao)`, declare your permission ids, and gate privileged functions with `auth`:

```solidity
// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.17;

import {DAO, IDAO, Action} from "@aragon/osx/core/dao/DAO.sol";
import {PluginUUPSUpgradeable} from "@aragon/osx/common/plugin/PluginUUPSUpgradeable.sol";

contract MyUpgradeablePlugin is PluginUUPSUpgradeable {
    bytes32 public constant MANAGER_PERMISSION_ID = keccak256("MANAGER_PERMISSION");

    uint256 public number; // added in build 1

    function initialize(IDAO _dao, uint256 _initialNumber) external initializer {
        __PluginUUPSUpgradeable_init(_dao);
        number = _initialNumber;
    }

    /// Caller must hold MANAGER_PERMISSION_ID *on this plugin*, resolved against the DAO.
    function setNumber(uint256 _number) external auth(MANAGER_PERMISSION_ID) {
        number = _number;
    }

    /// Make the DAO act. Requires the plugin to hold EXECUTE_PERMISSION_ID on the DAO.
    function resetDaoMetadata() external {
        Action[] memory actions = new Action[](1);
        actions[0].to = address(dao());
        actions[0].data = abi.encodeCall(IDAO.setMetadata, (""));
        DAO(payable(address(dao()))).execute(bytes32(block.timestamp), actions, 0);
    }

    uint256[49] private __gap; // storage gap for safe upgrades
}
```

Three things to internalize. `auth(MANAGER_PERMISSION_ID)` doesn't check a local list, it asks the DAO "does the caller hold this on *this plugin*" (the [plugin is the `where`](../common/auth.md)). A plugin makes the DAO act by building [actions](../core/execution.md) and calling `dao.execute`, which only works if the plugin holds `EXECUTE_PERMISSION_ID` on the DAO, and *that* grant comes from the setup below. The `__gap` preserves storage layout across [upgrades](../framework/plugin-types.md).

## Step 2, the PluginSetup

The setup deploys the plugin and returns the **exact permissions** the install needs. `prepareInstallation` decodes its install `data`, deploys the proxy, and lists the grants; `prepareUninstallation` lists the matching revokes. This is the ABI and the permission set that [Deploy your first DAO](./deploy-a-dao.md) and [Install a plugin](./install-a-plugin.md) feed to the PSP:

```solidity
// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.17;

import {IDAO, DAO} from "@aragon/osx/core/dao/DAO.sol";
import {PluginSetup} from "@aragon/osx/common/plugin/setup/PluginSetup.sol";
import {IPluginSetup} from "@aragon/osx/common/plugin/setup/IPluginSetup.sol";
import {PermissionLib} from "@aragon/osx/common/permission/PermissionLib.sol";
import {ProxyLib} from "@aragon/osx/common/utils/deployment/ProxyLib.sol";
import {MyUpgradeablePlugin} from "../MyUpgradeablePlugin.sol";

contract MyPluginSetup is PluginSetup {
    constructor() PluginSetup(address(new MyUpgradeablePlugin())) {} // the implementation to clone/proxy

    function prepareInstallation(address _dao, bytes memory _data)
        external
        returns (address plugin, PreparedSetupData memory preparedSetupData)
    {
        (address manager, uint256 initialNumber) = abi.decode(_data, (address, uint256));

        plugin = ProxyLib.deployUUPSProxy(
            implementation(),
            abi.encodeCall(MyUpgradeablePlugin.initialize, (IDAO(_dao), initialNumber))
        );

        PermissionLib.MultiTargetPermission[] memory permissions = new PermissionLib.MultiTargetPermission[](2);
        // 1) The manager may call setNumber on the plugin.
        permissions[0] = PermissionLib.MultiTargetPermission({
            operation: PermissionLib.Operation.Grant,
            where: plugin,
            who: manager,
            condition: PermissionLib.NO_CONDITION,
            permissionId: MyUpgradeablePlugin(implementation()).MANAGER_PERMISSION_ID()
        });
        // 2) The plugin may make the DAO execute.
        permissions[1] = PermissionLib.MultiTargetPermission({
            operation: PermissionLib.Operation.Grant,
            where: _dao,
            who: plugin,
            condition: PermissionLib.NO_CONDITION,
            permissionId: DAO(payable(_dao)).EXECUTE_PERMISSION_ID()
        });

        preparedSetupData.permissions = permissions;
    }

    function prepareUninstallation(address _dao, SetupPayload calldata _payload)
        external
        view
        returns (PermissionLib.MultiTargetPermission[] memory permissions)
    {
        address manager = abi.decode(_payload.data, (address));
        permissions = new PermissionLib.MultiTargetPermission[](2);
        permissions[0] = PermissionLib.MultiTargetPermission({
            operation: PermissionLib.Operation.Revoke, where: _payload.plugin, who: manager,
            condition: PermissionLib.NO_CONDITION, permissionId: keccak256("MANAGER_PERMISSION")
        });
        permissions[1] = PermissionLib.MultiTargetPermission({
            operation: PermissionLib.Operation.Revoke, where: _dao, who: _payload.plugin,
            condition: PermissionLib.NO_CONDITION, permissionId: DAO(payable(_dao)).EXECUTE_PERMISSION_ID()
        });
    }
}
```

The install `data` layout (`(address manager, uint256 initialNumber)` here) is your plugin's public contract with installers, publish it in the build [metadata](../framework/plugin-metadata.md), and expose an `encodeInstallationParams(...)` helper on your setup so callers get a typed encoder instead of hand-packing bytes. Two rules the [permission system](../core/permissions.md) enforces on this array: a **conditional** grant must use `Operation.GrantWithCondition` (a plain `Grant` carrying a non-zero condition reverts), and uninstall should return the *mirror* of what install granted, so nothing is stranded.

## What you just saw

- A plugin is your **logic + a setup recipe**; the recipe, not the plugin, wires permissions.
- `auth` defers to the DAO (the plugin is the `where`); to make the DAO act, the setup grants the plugin `EXECUTE` on the DAO.
- `prepareUninstallation` mirrors `prepareInstallation`'s grants as revokes. For an **updatable** plugin, extend [`PluginUpgradeableSetup`](../framework/plugin-setup.md) and add `prepareUpdate` (see [Update a plugin](./update-a-plugin.md)).

## Next

- [Publish a plugin to a PluginRepo](./publish-a-plugin.md), turn this setup into an installable, versioned release.
- [Write a custom condition](./manage-permissions.md) if your plugin's permissions need dynamic rules.
