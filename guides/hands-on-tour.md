---
type: guide
title: A hands-on tour of OSx
source: osx/src/framework/dao/DAOFactory.sol, osx/src/core/dao/DAO.sol
---

# A hands-on tour of OSx

The fastest way to *feel* how OSx works: in one Foundry test you'll deploy a real [DAO](/core/dao.md), fund it, make it perform an on-chain action, and then watch the [permission system](/core/permissions.md) reject the same action from the wrong caller. Fifteen minutes, and the mental model sticks.

By the end you'll have seen the three things a DAO *is*, a treasury, an [executor](/core/execution.md), and its own permission database, in motion, and you'll know exactly what the later guides build on.

## What you need

Do the one-time [Setup](/guides/setup.md) first, a plugin project pointed at a chain where OSx is deployed. This guide reads just the **`DAOFactory`** address (`DAO_FACTORY`); nothing plugin-specific.

We fork rather than deploy the whole protocol locally: standing up OSx from scratch is the [Protocol Factory](/deployment/protocol-factory.md)'s job, not something you need for a first look.

## Step 1, deploy a bare DAO

[`DAOFactory.createDao`](/framework/dao-factory.md) creates, registers, and self-governs a DAO in one transaction. Pass an **empty** plugin array and the factory grants **you** (`msg.sender`) `EXECUTE_PERMISSION_ID` on the new DAO, so a plugin-less DAO is yours to drive directly until you install governance.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Test} from "forge-std/Test.sol";
import {DAO} from "@aragon/osx/core/dao/DAO.sol";
import {DAOFactory} from "@aragon/osx/framework/dao/DAOFactory.sol";
import {Action} from "@aragon/osx/common/executors/IExecutor.sol";

contract OsxInOneSitting is Test {
    DAOFactory factory = DAOFactory(vm.envAddress("DAO_FACTORY")); // from the deployment artifacts
    DAO dao;

    function setUp() public {
        vm.createSelectFork(vm.envString("RPC_URL"));

        // No plugins -> the caller (this test) receives EXECUTE_PERMISSION_ID on the DAO.
        DAOFactory.DAOSettings memory daoSettings = DAOFactory.DAOSettings({
            trustedForwarder: address(0),
            daoURI: "",
            subdomain: "", // empty = skip ENS registration
            metadata: ""
        });
        DAOFactory.PluginSettings[] memory noPlugins = new DAOFactory.PluginSettings[](0);

        (dao, ) = factory.createDao(daoSettings, noPlugins);
    }
}
```

You now hold the most consequential permission in the protocol. That is fine for a demo and dangerous as an end state, in a real DAO, governance (a plugin) holds `EXECUTE`, not a person. See the [ROOT bootstrapping problem](/core/dao.md#deployment-and-the-root-bootstrapping-problem).

## Step 2, fund it, then make it act

A DAO holds assets like any account, and *does* things by running a batch of [actions](/core/execution.md) (one `Action` is a single external call `(to, value, data)`). In one test, fund the DAO, then have it transfer 1 ETH back out. Add this function to the contract:

```solidity
function test_fundAndSpend() public {
    // Fund the treasury. Native coin sent directly hits receive(), which just records it.
    vm.deal(address(this), 10 ether);
    (bool funded, ) = address(dao).call{value: 5 ether}("");
    assertTrue(funded);
    assertEq(address(dao).balance, 5 ether);

    // Ask the DAO to send 1 ETH to Bob.
    address payable bob = payable(address(0xB0B));
    Action[] memory actions = new Action[](1);
    actions[0] = Action({to: bob, value: 1 ether, data: ""});

    // callId is a caller-defined tag (a proposal id, normally); allowFailureMap = 0 = all must succeed.
    dao.execute({_callId: bytes32(0), _actions: actions, _allowFailureMap: 0});

    assertEq(bob.balance, 1 ether);
    assertEq(address(dao).balance, 4 ether);
}
```

Two things to notice. Funding is **permissionless**, anyone can pay a DAO, but assets leave *only* through [`execute`](/core/execution.md), which is permission-gated: open in, governed out. And the transfer runs **as the DAO**, at Bob's address `msg.sender` is the DAO and the ether is the DAO's, because `execute` uses `call`, not `delegatecall` (the same reason a DAO can call *itself* to change its own permissions, see [why it's a `call`](/core/execution.md#the-execute-function)).

## Step 3, watch the permission gate

The transfer worked only because *you* hold `EXECUTE_PERMISSION_ID`. The same call from any other address is denied by the [permission system](/core/permissions.md) before a single action runs:

```solidity
function test_strangerCannotExecute() public {
    Action[] memory actions = new Action[](1);
    actions[0] = Action({to: address(0xB0B), value: 0, data: ""});

    vm.prank(address(0xDEAD));   // an address with no permission
    vm.expectRevert();           // reverts with an Unauthorized-family error before executing
    dao.execute(bytes32(0), actions, 0);
}
```

That revert *is* OSx's access control. Every privileged call in the protocol, on the DAO and on every plugin, resolves through this one check: is `(where, who, permissionId)` granted? See [how a decision is made](/core/permissions.md#how-a-decision-is-made).

## What you just saw

- A DAO is **one contract** that holds assets, executes actions, and owns the rules for who may do what, [the DAO](/core/dao.md).
- Actions are how it acts, atomically and *as itself*, [actions and execution](/core/execution.md).
- Nothing privileged happens without a matching grant, [permissions](/core/permissions.md).

## Next

- [Deploy your first DAO](/guides/deploy-a-dao.md), do this properly: hand `EXECUTE` to a governance **plugin** in the same transaction, so the organization, not you, is in control.
- [Manage permissions through governance](/guides/manage-permissions.md), grant, revoke, and condition permissions the right way.
