---
type: guide
title: Install a plugin into a live DAO
source: osx/src/framework/plugin/setup/PluginSetupProcessor.sol, osx/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol, osx/src/common/plugin/setup/IPluginSetup.sol, osx/src/framework/dao/DAOFactory.sol, multisig-plugin/packages/contracts/src/MultisigSetup.sol
---

# Install a plugin into a live DAO

[Deploy your first DAO](./deploy-a-dao.md) installed a plugin *at creation*, the factory did the whole permission dance for you. More often you add a plugin to a DAO that's **already running**, and there's no factory to orchestrate it, so **governance does**. This guide runs the [PluginSetupProcessor (PSP)](../framework/plugin-setup-processor.md) flow by hand: **prepare** (permissionless) then **apply** (a governed proposal that wraps a temporary-ROOT window around one PSP call).

The split is the safety property: whoever *computes* an installation isn't who *authorizes* it. Prepare touches nothing; apply is what the DAO approves. See [why prepare and apply are separate](../framework/plugin-setup-processor.md#why-prepare-and-apply-are-separate).

## What you need

The one-time [Setup](./setup.md), with the **multisig** plugin's remapping enabled. This guide reads the **`DAOFactory`**, **`PluginSetupProcessor`** (`PSP`), and **Multisig `PluginRepo`** addresses.

## Step 1, the skeleton

As in [manage permissions](./manage-permissions.md), the test uses a bare DAO where you hold `EXECUTE`, so you can `dao.execute` the apply batch directly; on a governed DAO those same actions are a [proposal](./create-vote-execute.md).

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Test} from "forge-std/Test.sol";
import {DAO} from "@aragon/osx/core/dao/DAO.sol";
import {DAOFactory} from "@aragon/osx/framework/dao/DAOFactory.sol";
import {PluginRepo} from "@aragon/osx/framework/plugin/repo/PluginRepo.sol";
import {PluginSetupProcessor} from "@aragon/osx/framework/plugin/setup/PluginSetupProcessor.sol";
import {PluginSetupRef, hashHelpers} from "@aragon/osx/framework/plugin/setup/PluginSetupProcessorHelpers.sol";
import {PermissionManager} from "@aragon/osx/core/permission/PermissionManager.sol";
import {IPluginSetup} from "@aragon/osx/common/plugin/setup/IPluginSetup.sol";
import {Action} from "@aragon/osx/common/executors/IExecutor.sol";
import {IPlugin} from "@aragon/osx/common/plugin/IPlugin.sol";
import {Multisig} from "@aragon/multisig-plugin/Multisig.sol";

contract InstallPlugin is Test {
    DAOFactory factory = DAOFactory(vm.envAddress("DAO_FACTORY"));
    PluginSetupProcessor psp = PluginSetupProcessor(vm.envAddress("PSP"));
    PluginRepo multisigRepo = PluginRepo(vm.envAddress("MULTISIG_REPO"));
    DAO dao;

    function setUp() public {
        vm.createSelectFork(vm.envString("RPC_URL"));
        DAOFactory.DAOSettings memory s = DAOFactory.DAOSettings(address(0), "", "", "");
        DAOFactory.PluginSettings[] memory none = new DAOFactory.PluginSettings[](0);
        (dao, ) = factory.createDao(s, none); // bare DAO: this test holds EXECUTE
    }
}
```

## Step 2, prepare (permissionless)

Anyone may call `prepareInstallation`. It runs the plugin's [setup](../framework/plugin-setup.md), deploying the plugin and any helpers and returning the **exact permissions** the install wants, without touching the DAO. Here we prepare the same multisig as the deploy guide:

```solidity
function test_installMultisig() public {
    // Multisig install data (see "Deploy your first DAO").
    address[] memory members = new address[](3);
    members[0] = address(0xA11CE); members[1] = address(0xB0B); members[2] = address(0xCa201);
    Multisig.MultisigSettings memory settings = Multisig.MultisigSettings({onlyListed: true, minApprovals: 2});
    IPlugin.TargetConfig memory targetConfig =
        IPlugin.TargetConfig({target: address(0), operation: IPlugin.Operation.Call});
    bytes memory data = abi.encode(members, settings, targetConfig, bytes(""));

    PluginSetupRef memory ref = PluginSetupRef({
        versionTag: PluginRepo.Tag({release: 1, build: 3}),
        pluginSetupRepo: multisigRepo
    });

    // Prepare: deploys the plugin + helpers, returns the requested permissions. Nothing on the DAO changes yet.
    (address plugin, IPluginSetup.PreparedSetupData memory prepared) =
        psp.prepareInstallation(address(dao), PluginSetupProcessor.PrepareInstallationParams(ref, data));

    // ... apply in Step 3 (same function)
}
```

A `…Prepared` event is **not** an installation, a griefer can prepare all day and change nothing. See [preparing is cheap and permissionless](../framework/plugin-setup-processor.md#keep-in-mind).

## Step 3, apply (governed, inside a temporary-ROOT window)

Applying actually grants the permissions, so the PSP needs `ROOT` on the DAO for the duration, and no longer. The proposal is just **three actions**: open the window, apply, close it. You must apply *exactly* what was prepared (the same `plugin`, `permissions`, and a hash of the `helpers`), a [setup-id check](../framework/plugin-setup-processor.md#setup-ids-what-keeps-apply-honest) enforces it.

```solidity
    bytes32 ROOT = dao.ROOT_PERMISSION_ID();

    PluginSetupProcessor.ApplyInstallationParams memory applyParams = PluginSetupProcessor.ApplyInstallationParams({
        pluginSetupRef: ref,
        plugin: plugin,
        permissions: prepared.permissions,
        helpersHash: hashHelpers(prepared.helpers)
    });

    Action[] memory actions = new Action[](3);
    // 1. Grant the PSP ROOT on the DAO (so it can apply the plugin's permission changes).
    actions[0] = Action(address(dao), 0,
        abi.encodeCall(PermissionManager.grant, (address(dao), address(psp), ROOT)));
    // 2. Apply: the PSP grants the plugin its permissions (incl. EXECUTE on the DAO).
    actions[1] = Action(address(psp), 0,
        abi.encodeCall(PluginSetupProcessor.applyInstallation, (address(dao), applyParams)));
    // 3. Close the window: revoke the PSP's ROOT.
    actions[2] = Action(address(dao), 0,
        abi.encodeCall(PermissionManager.revoke, (address(dao), address(psp), ROOT)));

    dao.execute(bytes32(0), actions, 0);

    // The multisig now governs the DAO.
    assertTrue(dao.hasPermission(address(dao), plugin, dao.EXECUTE_PERMISSION_ID(), ""));
}
```

Note what's **not** here: the DAO needs no `APPLY_INSTALLATION_PERMISSION`. `applyInstallation` runs *as the DAO* (`msg.sender == dao`), which the PSP's `canApply` check accepts directly, so that permission is only for a caller *other than* the DAO. That's exactly why the [DAOFactory grants it to itself](../framework/dao-factory.md#the-permission-choreography-why-order-matters): the factory, not the DAO, calls the PSP, so it needs the extra grant that a self-executing proposal doesn't. Otherwise this is the same temporary-ROOT window, and it's atomic: if any step reverts, the whole install rolls back and the PSP never keeps ROOT.

## What you just saw

- **Prepare** is permissionless and mutates nothing; **apply** is the governed step, and the only thing that changes the DAO.
- Apply runs inside a **temporary-ROOT window** the same batch opens and closes, [never leave the PSP with ROOT](../framework/plugin-setup-processor.md#keep-in-mind).
- You apply *exactly* what was prepared (`plugin` + `permissions` + `hashHelpers(helpers)`); the [setup-id binding](../framework/plugin-setup-processor.md#setup-ids-what-keeps-apply-honest) rejects anything else.

## Next

- [Update a plugin](./update-a-plugin.md), the same prepare/apply rhythm for moving an installed plugin to a new version.
- [Build a plugin](./build-a-plugin.md), write the `PluginSetup` whose prepared permissions this flow applies.
