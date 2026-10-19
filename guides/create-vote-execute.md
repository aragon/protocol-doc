---
type: guide
title: Create, vote, and execute a proposal
source: osx/src/core/dao/DAO.sol, osx/src/common/executors/IExecutor.sol, multisig-plugin/packages/contracts/src/Multisig.sol, token-voting-plugin/src/base/MajorityVotingBase.sol, token-voting-plugin/src/base/IMajorityVoting.sol, token-voting-plugin/src/TokenVoting.sol
---

# Create, vote, and execute a proposal

After [deploying a DAO with a plugin](./deploy-a-dao.md), create, approve, and execute a proposal to make the DAO act. A DAO runs actions when a caller holding [`EXECUTE_PERMISSION_ID`](./deploy-a-dao.md) calls its [`execute`](../core/execution.md#the-execute-function). The usual and recommended caller is a governance plugin enacting a [**proposal**](../common/proposal.md): a bundle of [actions](../core/execution.md) put up for a decision and, if it passes, run on the DAO. The [Admin plugin](../plugins/admin-plugin.md) can execute without a vote; the examples below use multisig approval and token voting. Governance plugins share the **same lifecycle**, differing in how the decision is made:

```
createProposal(...) -> id      // package the actions
   ...the plugin decides...    // approve (multisig) or vote (token voting)
execute(id)                    // once it passes, run the actions on the DAO
```

`execute` on the plugin is what finally calls [`dao.execute`](../core/execution.md), and it works because the plugin holds [`EXECUTE_PERMISSION_ID` on the DAO](./deploy-a-dao.md) (granted at install). Both plugins below also grant `EXECUTE_PROPOSAL_PERMISSION_ID` to **anyone**, so once a proposal passes, *any* address can trigger execution. Whether it's *passed* ([`hasSucceeded`](../common/proposal.md)) is separate from whether it's *executable now* (`canExecute`, which also weighs timing).

Both examples assume the plugin is already installed (from [Deploy your first DAO](./deploy-a-dao.md) / [Launch a governance token](./launch-a-governance-token.md)). The demo action has the DAO update its own metadata. You can replace it with any action the DAO is allowed to perform.

## The skeleton

Both functions below are methods of one test contract that holds the installed plugin handles and the members/voters:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Test} from "forge-std/Test.sol";
import {DAO} from "@aragon/osx/core/dao/DAO.sol";
import {Action} from "@aragon/osx/common/executors/IExecutor.sol";
import {Multisig} from "@aragon/multisig-plugin/Multisig.sol";
import {TokenVoting} from "@aragon/token-voting-plugin/TokenVoting.sol";
import {IMajorityVoting} from "@aragon/token-voting-plugin/base/IMajorityVoting.sol";

contract Proposals is Test {
    DAO dao;
    Multisig multisig;       // installed per "Deploy your first DAO"
    TokenVoting tokenVoting; // installed per "Launch a governance token"
    address alice = address(0xA11CE); // a member / delegated voter
    address bob = address(0xB0B);

    function setUp() public {
        vm.createSelectFork(vm.envString("RPC_URL"));
        dao = DAO(payable(vm.envAddress("DAO")));
        multisig = Multisig(vm.envAddress("MULTISIG"));
        tokenVoting = TokenVoting(vm.envAddress("TOKEN_VOTING"));
    }

    // ... the two functions below live here
}
```

## Multisig: approve to a threshold

A [multisig](../plugins/multisig-plugin.md) proposal passes when `minApprovals` members approve. With the 2-of-3 from the deploy guide, one member creates and approves the proposal. A second approves with `_tryExecution` to run it in that same call:

```solidity
function test_multisigProposal() public {
    Multisig ms = multisig; // the 2-of-3 from "Deploy your first DAO"; alice/bob/carol are members

    Action[] memory actions = new Action[](1);
    actions[0] = Action({
        to: address(dao),
        value: 0,
        data: abi.encodeCall(DAO.setMetadata, (bytes("ipfs://Qm...new")))
    });

    // Note the multisig arg order: (metadata, actions, allowFailureMap, approveProposal, tryExecution, start, end).
    vm.prank(alice);
    uint256 id = ms.createProposal(
        "", actions, 0,
        true,   // alice approves as she creates (approval #1)
        false,  // don't try to execute yet (threshold not met)
        uint64(block.timestamp),
        uint64(block.timestamp + 7 days)
    );

    // Second approval reaches minApprovals (2); _tryExecution runs it immediately.
    vm.prank(bob);
    ms.approve(id, true);

    assertFalse(ms.canExecute(id)); // already executed, so no longer executable
}
```

`approve(id, false)` followed by a separate `execute(id)` is the two-step equivalent; `_tryExecution` combines the last approval with execution. Only *listed* members may approve; see [membership & eligibility](../plugins/multisig-plugin/membership.md) for who counts and when.

## Token Voting: decide by weight

A [token vote](/plugins/token-voting-plugin.md) uses delegated voting power at a fixed [snapshot](/plugins/token-voting-plugin/voting-power.md#the-snapshot). The snapshot is taken just before proposal creation: the previous block for block-based tokens, or the previous second for timestamp-based tokens. Scheduling voting to start later does not move that snapshot.

**Snapshots prevent double voting with the same tokens.** Suppose Alice has 100 self-delegated tokens at the snapshot and Bob has none. Alice votes, then transfers those 100 tokens to Bob. If the plugin used current balances, Bob could vote with the same tokens again. Instead, it reads their historical power: Alice has 100 and Bob has zero for this proposal. Delegating that power to another address after the snapshot cannot duplicate it either. Token Voting does not lock the tokens; the snapshot fixes which accounts can use their voting power on this proposal.

Holding tokens alone is not sufficient. Holders [delegate](/plugins/token-voting-plugin/voting-power.md#delegation) to themselves to vote directly, or to another address to vote on their behalf. An undelegated balance gives its holder no voting power. Complete delegation and allow the token's clock to advance before creating the proposal. The [launch guide](/guides/launch-a-governance-token.md) enables self-delegation on mint; [imported and wrapped tokens](/guides/import-existing-tokens.md#3-prepare-holders-to-vote) have their own delegation behavior. The example below assumes Alice and Bob both have power at the snapshot.

Votes use `VoteOption` (`Abstain`, `Yes`, or `No`); `None` lets a creator submit without an initial vote:

```solidity
function test_tokenVote() public {
    TokenVoting tv = tokenVoting; // the plugin from "Launch a governance token"

    Action[] memory actions = new Action[](1);
    actions[0] = Action({
        to: address(dao),
        value: 0,
        data: abi.encodeCall(DAO.setMetadata, (bytes("ipfs://Qm...new")))
    });

    // Token-voting arg order differs: (metadata, actions, allowFailureMap, start, end, voteOption, tryEarlyExecution).
    vm.prank(alice);
    uint256 id = tv.createProposal(
        "", actions, 0,
        uint64(block.timestamp),
        uint64(block.timestamp + 7 days),
        IMajorityVoting.VoteOption.None, // create without voting yet
        false
    );

    vm.prank(alice);
    tv.vote(id, IMajorityVoting.VoteOption.Yes, false);
    vm.prank(bob);
    tv.vote(id, IMajorityVoting.VoteOption.Yes, false);

    // Standard mode: the vote must run its full duration before it can execute.
    vm.warp(block.timestamp + 7 days + 1);

    tv.execute(id);
}
```

In **Standard** mode, the vote runs the full duration even once the outcome is decided. **Early Execution** mode lets a passed proposal execute immediately through `_tryEarlyExecution` / `vote(id, Yes, true)`; see [voting modes](../plugins/voting-modes.md). Whether a proposal passed depends on the support and participation [thresholds](../plugins/majority-voting.md).

## What you just saw

- One lifecycle, **create → decide → execute**; only the "decide" step changes between plugins.
- `execute` runs the proposal's actions *as the DAO*, because the plugin holds `EXECUTE` on the DAO; anyone can trigger it once the proposal passes.
- "Passed" ([`hasSucceeded`](../common/proposal.md)) and "executable now" (`canExecute`) are different questions; `canExecute` also checks timing.

## Next

- [Manage permissions through governance](./manage-permissions.md), the proposal's actions can grant/revoke permissions, letting the DAO re-wire its own authority.
- [Install a plugin into a live DAO](./install-a-plugin.md), add governance to a DAO after launch.
