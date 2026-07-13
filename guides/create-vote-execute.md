---
type: guide
title: Create, vote, and execute a proposal
source: multisig-plugin/packages/contracts/src/Multisig.sol, token-voting-plugin/src/base/MajorityVotingBase.sol, token-voting-plugin/src/base/IMajorityVoting.sol, token-voting-plugin/src/TokenVoting.sol
---

# Create, vote, and execute a proposal

You've [deployed a DAO with a plugin](/guides/deploy-a-dao.md). Now make it *do* something. A DAO acts only through [proposals](/common/proposal.md): a bundle of [actions](/core/execution.md) that a governance plugin puts up for a decision and, if it passes, runs on the DAO. Every governance plugin shares the **same lifecycle**, they differ only in how the decision is made:

```
createProposal(...) -> id      // package the actions
   ...the plugin decides...    // approve (multisig) or vote (token voting)
execute(id)                    // once it passes, run the actions on the DAO
```

`execute` on the plugin is what finally calls [`dao.execute`](/core/execution.md), and it works because the plugin holds [`EXECUTE_PERMISSION_ID` on the DAO](/guides/deploy-a-dao.md) (granted at install). Both plugins below also grant `EXECUTE_PROPOSAL_PERMISSION_ID` to **anyone**, so once a proposal passes, *any* address can trigger execution. Whether it's *passed* ([`hasSucceeded`](/common/proposal.md)) is separate from whether it's *executable now* (`canExecute`, which also weighs timing).

Both examples assume the plugin is already installed (from [Deploy your first DAO](/guides/deploy-a-dao.md) / [Launch a governance token](/guides/launch-a-governance-token.md)); each casts the installed plugin address and drives it. The demo action just has the DAO update its own metadata, swap in whatever the DAO is allowed to do.

## Multisig: approve to a threshold

A [multisig](/plugins/multisig-plugin.md) proposal passes when `minApprovals` members approve. With the 2-of-3 from the deploy guide, one member creates-and-approves, a second approves with `_tryExecution` to run it in the same call:

```solidity
function test_multisigProposal() public {
    Multisig ms = Multisig(MULTISIG); // installed per "Deploy your first DAO"; alice/bob/carol are members

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

`approve(id, false)` then a separate `execute(id)` is the two-step equivalent; `_tryExecution` just fuses the last approval with execution. Only *listed* members may approve, [membership & eligibility](/plugins/multisig-plugin/membership.md) covers who counts and when.

## Token Voting: decide by weight

A [token vote](/plugins/token-voting-plugin.md) weighs each vote by the voter's power at the proposal's [snapshot](/plugins/token-voting-plugin/voting-power.md), so voters must hold *delegated* tokens before it's created. Votes are a `VoteOption` (`None`, `Abstain`, `Yes`, `No`):

```solidity
function test_tokenVote() public {
    TokenVoting tv = TokenVoting(TOKEN_VOTING); // installed per "Launch a governance token"

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

In **Standard** mode the vote runs the full duration even once the outcome is decided; **Early Execution** mode lets a passed proposal execute immediately (that's what `_tryEarlyExecution` / `vote(id, Yes, true)` is for), see [voting modes](/plugins/voting-modes.md). Whether a proposal passed depends on the support and participation [thresholds](/plugins/majority-voting.md).

## What you just saw

- One lifecycle, **create → decide → execute**; only the "decide" step changes between plugins.
- `execute` runs the proposal's actions *as the DAO*, because the plugin holds `EXECUTE` on the DAO; anyone can trigger it once the proposal passes.
- "Passed" ([`hasSucceeded`](/common/proposal.md)) and "executable now" (`canExecute`) are different questions, timing lives in the latter.

## Next

- [Manage permissions through governance](/guides/manage-permissions.md), the proposal's actions can grant/revoke permissions, letting the DAO re-wire its own authority.
- [Install a plugin into a live DAO](/guides/install-a-plugin.md), add governance to a DAO after launch.
