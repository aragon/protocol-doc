---
type: guide
title: Manage permissions through governance
source: osx/src/core/permission/PermissionManager.sol, osx/src/common/permission/condition/PermissionCondition.sol, osx/src/framework/dao/DAOFactory.sol, osx/src/core/dao/DAO.sol
---

# Manage permissions through governance

A DAO owns its own [permission database](../core/permissions.md), so changing who may do what is itself an action the DAO performs on itself. Because a healthy DAO [holds `ROOT` over itself](../core/dao.md#deployment-and-the-root-bootstrapping-problem), a passed proposal whose action calls `dao.grant(...)` succeeds, the action runs *as the DAO*, and the DAO is its own permission admin. This guide grants a permission, gates one with a [condition](../common/permission-conditions.md) you write, and rotates a condition safely.

`grant`, `revoke`, and `grantWithCondition` are all `auth(ROOT_PERMISSION_ID)`, so they only work when called by (or as) the ROOT holder, which is the DAO itself.

## Step 1, the skeleton

To keep the focus on permissions, this test uses a **bare DAO** where you hold `EXECUTE` (as in [the hands-on tour](./hands-on-tour.md)), so you can `dao.execute` the permission-change actions directly and see the effect. On a governed DAO these exact actions go inside a [proposal](./create-vote-execute.md) instead, either way they run as the DAO.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Test} from "forge-std/Test.sol";
import {DAO} from "@aragon/osx/core/dao/DAO.sol";
import {DAOFactory} from "@aragon/osx/framework/dao/DAOFactory.sol";
import {PermissionManager} from "@aragon/osx/core/permission/PermissionManager.sol";
import {Action} from "@aragon/osx/common/executors/IExecutor.sol";
import {IPermissionCondition} from "@aragon/osx/common/permission/condition/IPermissionCondition.sol";

contract ManagePermissions is Test {
    DAOFactory factory = DAOFactory(vm.envAddress("DAO_FACTORY_ADDRESS"));
    DAO dao;
    address alice = address(0xA11CE);

    function setUp() public {
        vm.createSelectFork(vm.envString("RPC_URL"));
        DAOFactory.DAOSettings memory s = DAOFactory.DAOSettings(address(0), "", "", "");
        DAOFactory.PluginSettings[] memory none = new DAOFactory.PluginSettings[](0);
        (dao, ) = factory.createDao(s, none); // bare DAO: this test holds EXECUTE
    }
}
```

## Step 2, grant a permission

Have the DAO grant Alice the right to set its metadata. The action targets the DAO's own `grant`:

```solidity
function test_grant() public {
    bytes32 SET_METADATA = dao.SET_METADATA_PERMISSION_ID();

    Action[] memory actions = new Action[](1);
    actions[0] = Action({
        to: address(dao),
        value: 0,
        data: abi.encodeCall(PermissionManager.grant, (address(dao), alice, SET_METADATA))
    });
    dao.execute(bytes32(0), actions, 0);

    assertTrue(dao.hasPermission(address(dao), alice, SET_METADATA, ""));
}
```

The grant reads `(where = dao, who = alice, permissionId = SET_METADATA)`, see the [permission triple](../core/permissions.md). It works because the action executes as the DAO, which holds `ROOT`. `revoke` is the mirror image with the same three arguments.

## Step 3, write a custom condition

A plain grant is a static "yes". A [condition](../common/permission-conditions.md) makes it a *dynamic* yes: the permission system calls your contract at decision time. Inherit `PermissionCondition` (it supplies the ERC-165 wiring `grantWithCondition` checks for) and implement `isGranted`. Here, a permission that only holds until a deadline:

```solidity
import {PermissionCondition} from "@aragon/osx/common/permission/condition/PermissionCondition.sol";

contract OnlyBeforeDeadline is PermissionCondition {
    uint256 public immutable deadline;

    constructor(uint256 _deadline) {
        deadline = _deadline;
    }

    function isGranted(address /*where*/, address /*who*/, bytes32 /*permissionId*/, bytes calldata /*data*/)
        external
        view
        returns (bool)
    {
        return block.timestamp <= deadline;
    }
}
```

Two things to hold onto: a condition [fails closed](../common/permission-conditions.md) (revert or garbage return counts as "denied"), and the `data` argument is the *full calldata* of the gated call, so a richer condition can decode and check the arguments. For boolean combinations of standard checks (time, block, sub-conditions) you often don't need bespoke code, [`RuledCondition`](../common/ruled-condition.md) expresses them as data, and the [condition library](../helpers/condition-library.md) ships ready-made ones.

## Step 4, gate a permission, then rotate the condition safely

Attach the condition with `grantWithCondition`. Changing it later is the subtle part: a plain `grant` over an already-*conditional* permission is a [silent no-op](../core/permissions.md) (it will **not** strip the condition), and conditions are immutable once set, so you must `revoke` then re-grant. Do both in **one batch**, otherwise the permission is denied in the gap between the two transactions:

```solidity
function test_conditionAndRotate() public {
    bytes32 SET_METADATA = dao.SET_METADATA_PERMISSION_ID();

    // Gate Alice's permission with a condition.
    IPermissionCondition cond = new OnlyBeforeDeadline(block.timestamp + 30 days);
    Action[] memory gate = new Action[](1);
    gate[0] = Action({to: address(dao), value: 0,
        data: abi.encodeCall(PermissionManager.grantWithCondition,
            (address(dao), alice, SET_METADATA, cond))});
    dao.execute(bytes32(0), gate, 0);

    // Rotate to a new condition: revoke + re-grant in ONE proposal, never two.
    IPermissionCondition cond2 = new OnlyBeforeDeadline(block.timestamp + 90 days);
    Action[] memory rotate = new Action[](2);
    rotate[0] = Action({to: address(dao), value: 0,
        data: abi.encodeCall(PermissionManager.revoke, (address(dao), alice, SET_METADATA))});
    rotate[1] = Action({to: address(dao), value: 0,
        data: abi.encodeCall(PermissionManager.grantWithCondition,
            (address(dao), alice, SET_METADATA, cond2))});
    dao.execute(bytes32(0), rotate, 0);

    // Alice still holds the permission, now under the new condition (evaluated live, before the deadline).
    assertTrue(dao.hasPermission(address(dao), alice, SET_METADATA, ""));
}
```

Batching the `revoke` and re-`grant` into one atomic [execute](../core/execution.md) is what keeps the permission from flickering off mid-flight. On a governed DAO it's the same principle: put both in the *same* proposal.

## What you just saw

- Changing authority is an ordinary DAO action, gated by `ROOT`, which the DAO holds over itself, so governance re-wires the DAO's own rules.
- A [condition](../common/permission-conditions.md) is a small contract you attach at grant time; it fails closed and can inspect the call's arguments.
- Rotate a condition with `revoke` + `grantWithCondition` in **one batch**, a plain re-grant can't strip a condition, and two transactions leave a deny-gap.

## Next

- [Install a plugin into a live DAO](./install-a-plugin.md), the permission choreography behind adding governance after launch.
- [Build a plugin](./build-a-plugin.md), whose `PluginSetup` returns exactly these grant/revoke operations for the installer to apply.
