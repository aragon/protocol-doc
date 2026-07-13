---
type: guide
title: Deploy your first DAO
source: osx/src/framework/dao/DAOFactory.sol, multisig-plugin/packages/contracts/src/MultisigSetup.sol, osx/src/common/plugin/PluginUUPSUpgradeable.sol
---

# Deploy your first DAO

In [A hands-on tour of OSx](./hands-on-tour.md) you made a *bare* DAO, and you (an EOA) held `EXECUTE_PERMISSION_ID` on it. That's fine for a demo and wrong for a real organization: you don't want a person holding the keys, you want **governance** to. This guide does it properly, deploying a DAO with a [Multisig](../plugins/multisig-plugin.md) plugin so that, from block one, only a passed multisig proposal can make the DAO act, and no external address retains control.

It's still one transaction. [`DAOFactory.createDao`](../framework/dao-factory.md) creates the DAO, installs the plugin through the [PSP's temporary-ROOT window](../framework/plugin-setup-processor.md#the-temporary-root-window), and hands `EXECUTE` to the plugin, atomically.

## What you need

The one-time [Setup](./setup.md), with the **multisig** plugin's remapping enabled. This guide reads the **`DAOFactory`** and **Multisig `PluginRepo`** (`MULTISIG_REPO`) addresses, and installs a specific plugin version (a `release`/`build`, see [release vs build](../framework/plugin-repo.md#release-vs-build)).

## Step 1, the skeleton

Fork the network and wire the two addresses. Everything else happens in one test:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Test} from "forge-std/Test.sol";
import {DAO} from "@aragon/osx/core/dao/DAO.sol";
import {DAOFactory} from "@aragon/osx/framework/dao/DAOFactory.sol";
import {PluginRepo} from "@aragon/osx/framework/plugin/repo/PluginRepo.sol";
import {PluginSetupRef} from "@aragon/osx/framework/plugin/setup/PluginSetupProcessorHelpers.sol";
import {IPlugin} from "@aragon/osx/common/plugin/IPlugin.sol";
import {Multisig} from "@aragon/multisig-plugin/Multisig.sol"; // path follows your installed dependency

contract DeployWithMultisig is Test {
    DAOFactory factory = DAOFactory(vm.envAddress("DAO_FACTORY"));
    PluginRepo multisigRepo = PluginRepo(vm.envAddress("MULTISIG_REPO"));

    function setUp() public {
        vm.createSelectFork(vm.envString("RPC_URL"));
    }
}
```

## Step 2, describe the DAO and the plugin install

A DAO created *with* plugins takes a `PluginSettings[]`: each entry names a plugin version (its [repo](../framework/plugin-repo.md) + a `(release, build)` tag) and the **install data** the plugin's [setup](../framework/plugin-setup.md) expects. Multisig's `MultisigSetup` decodes its data as `(address[] members, MultisigSettings, TargetConfig, bytes metadata)`:

```solidity
function test_deployWithMultisig() public {
    // Who is on the multisig, and its rule (2-of-3, members only).
    address[] memory members = new address[](3);
    members[0] = address(0xA11CE);
    members[1] = address(0xB0B);
    members[2] = address(0xCa201);
    Multisig.MultisigSettings memory settings =
        Multisig.MultisigSettings({onlyListed: true, minApprovals: 2});

    // Where the plugin executes. target == address(0) is the sentinel for "my own DAO":
    // at runtime the plugin resolves it to TargetConfig(dao(), Call). This is what lets you
    // install in the same tx that creates the DAO, the DAO address doesn't exist yet here.
    IPlugin.TargetConfig memory targetConfig =
        IPlugin.TargetConfig({target: address(0), operation: IPlugin.Operation.Call});

    bytes memory installData = abi.encode(members, settings, targetConfig, bytes(""));

    // Point at the plugin version to install.
    PluginRepo.Tag memory versionTag = PluginRepo.Tag({release: 1, build: 3});

    DAOFactory.PluginSettings[] memory pluginSettings = new DAOFactory.PluginSettings[](1);
    pluginSettings[0] = DAOFactory.PluginSettings({
        pluginSetupRef: PluginSetupRef({versionTag: versionTag, pluginSetupRepo: multisigRepo}),
        data: installData
    });

    // ... createDao in Step 3 (same function)
}
```

The `installData` layout is dictated by the plugin's setup, not by OSx; every plugin publishes the ABI for its `data` in its build metadata. Get it wrong and `prepareInstallation` reverts on `abi.decode`.

## Step 3, create the DAO with the plugin

Continue the same function. `createDao` returns the DAO and the installed plugin(s):

```solidity
    DAOFactory.DAOSettings memory daoSettings = DAOFactory.DAOSettings({
        trustedForwarder: address(0),
        daoURI: "",
        subdomain: "",
        metadata: ""
    });

    (DAO dao, DAOFactory.InstalledPlugin[] memory installed) =
        factory.createDao(daoSettings, pluginSettings);

    address multisig = installed[0].plugin;
```

Under the hood the factory ran the whole [temporary-ROOT dance](../framework/dao-factory.md#the-permission-choreography-why-order-matters): it prepared and applied the multisig setup, and that setup's permission list [granted the plugin `EXECUTE_PERMISSION_ID` on the DAO](../plugins/multisig-plugin.md#permissions-it-sets-up). Because you passed a plugin, the factory did **not** grant you `EXECUTE`.

## Step 4, verify governance is in control

Confirm the plugin can make the DAO act and you cannot:

```solidity
    bytes32 EXECUTE = dao.EXECUTE_PERMISSION_ID();
    assertTrue(dao.hasPermission(address(dao), multisig, EXECUTE, ""));       // the plugin can
    assertFalse(dao.hasPermission(address(dao), address(this), EXECUTE, "")); // you cannot
}
```

That's the whole point: the DAO now acts only when a multisig [proposal](../common/proposal.md) passes and calls [`dao.execute`](../core/execution.md). No EOA holds the keys, and the DAO holds ROOT over itself, so even changing *that* is a governance decision.

## What you just saw

- Installing a plugin is **describing it** (version + install data) and letting the [factory](../framework/dao-factory.md) prepare/apply it, no manual ROOT juggling.
- The setup, not you, wires the permissions, here, `EXECUTE` to the plugin, [see multisig's setup](../plugins/multisig-plugin.md#permissions-it-sets-up).
- `TargetConfig.target = address(0)` means "my own DAO", the trick that makes same-transaction install possible.

## Next

- [Launch a governance token with your DAO](./launch-a-governance-token.md), the same flow with **Token Voting**, whose install data carries the trickier token choice.
- [Create, vote, and execute a proposal](./create-vote-execute.md), now drive the multisig you just installed.
- Installing **admin** instead is the same shape with simpler data (a single admin address); installing into an *already-running* DAO is [Install a plugin](./install-a-plugin.md).
