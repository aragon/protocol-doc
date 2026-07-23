---
type: concept
title: Multisig membership & eligibility
tags: [governance]
source: multisig-plugin/packages/contracts/src/Multisig.sol, multisig-plugin/packages/contracts/src/ListedCheckCondition.sol
---

# Multisig membership & eligibility

The [Multisig Plugin](../multisig-plugin.md)'s member list is just the shared [Addresslist](../../common/membership.md), a checkpointed set of addresses, reused directly (the plugin adds no membership storage of its own). `isMember` is a one-liner over `isListed`. Two rules layered on top need care: the **`minApprovals` invariant** and the **two-speed eligibility** model, both easy to trip on.

## Managing members

Members are added and removed with `addAddresses` / `removeAddresses`, gated by `UPDATE_MULTISIG_SETTINGS_PERMISSION_ID` (held by the DAO, so membership changes go through governance). Because they touch the same permission and interact with `minApprovals`, membership and the threshold are really one coupled setting.

### `minApprovals` and the member count

One invariant holds at all times: **`1 ≤ minApprovals ≤ member count`.** A multisig can never require zero approvals (that would auto-pass everything), nor more approvals than it has members (that would make passing impossible). It's enforced from both directions:

- `updateMultisigSettings` rejects a `minApprovals` below 1 or above the current member count.
- `removeAddresses` rejects a removal that would drop the member count below the current `minApprovals`.

Because `minApprovals` is an **absolute** count, not a percentage, changing the roster shifts the *effective* bar: adding members keeps the same number of approvals needed (a smaller share of the group, so relatively easier to pass), while removing members makes each remaining approval weigh more (relatively harder). That's why only *removal* is threshold-constrained, adding can never breach an absolute floor.

> **Shrinking the multisig takes two actions, in order.** Each function checks against the *current* on-chain state, not against other actions queued in the same proposal. So to remove members *and* lower the threshold below where it is now, the proposal's actions must be: **(1) `updateMultisigSettings` to lower `minApprovals` first, then (2) `removeAddresses`.** The reverse order reverts, because the removal is validated against the old, higher threshold. This bites people scripting membership rotations.

## Two-speed eligibility

This is the subtle part, and the one thing to really absorb: **who may *create* a proposal and who may *approve* one are judged at different times.**

- **Approving is snapshot-based.** A proposal fixes a snapshot at the block *before* creation, and approval eligibility is checked against membership *at that snapshot* (`isListedAtBlock`), never against current membership. The frozen electorate cuts both ways, and the surprising direction is the one that matters: **a member removed *after* a proposal was created can still approve that already-open proposal**, they were listed at its snapshot, and removal never re-checks. Ejecting a compromised or departed signer does *not* stop them pushing through proposals that were already open when you removed them; only proposals created *after* the removal exclude them. (Symmetrically, a member added after creation cannot approve that proposal.) The snapshot is the *prior* block, not the current one, so nobody can flip membership in the same block they create a proposal to rig who's eligible.
- **Creating is live.** Whether you may open a proposal is checked against *current* membership at call time (see below).

The reason for the split: approvals must be counted against a stable electorate for the whole life of a proposal, but "may I even start one" is naturally a here-and-now question. Two different questions, two different mechanisms.

### Who can create vs. who can approve

Creation eligibility is enforced by a small [permission condition](../../common/permission-conditions.md), `ListedCheckCondition`, wired onto `CREATE_PROPOSAL_PERMISSION_ID` (which is granted broadly to *any address*). The condition simply asks: is `onlyListed` on, and if so, is the caller currently listed? This is the same pattern as the Token Voting Plugin's [`VotingPowerCondition`](../token-voting-plugin/voting-power.md#who-may-propose), a broad grant narrowed dynamically by a condition.

Because the condition reads `onlyListed` live, it doubles as a useful switch:

> **`onlyListed = false` decouples proposing from passing.** Turn it off and *anyone* can create a proposal, while approving and passing it stays restricted to the member list. That's a genuinely useful mode (let the public surface proposals, let members decide), just don't mistake open proposal creation for open governance: the approvals are still members-only.

## Keep in mind

- **`minApprovals` never exceeds the member count.** To shrink the multisig below the current threshold, lower `minApprovals` *before* removing members in the same proposal.
- **Removing a member doesn't lock them out of *open* proposals.** Their eligibility was frozen at each open proposal's snapshot; only proposals created after the removal exclude them. After ejecting a signer, check what's still open, they can still approve it. (Conversely, a member added later can't approve an already-open proposal.)
- **No double approval.** Each member's approval counts once; approving again reverts.

## See also

- [Multisig Plugin](../multisig-plugin.md) — the approval model and lifecycle.
- [Membership and the address list](../../common/membership.md) — the shared, checkpointed `Addresslist` this builds on.
- [Permission conditions](../../common/permission-conditions.md) — how `ListedCheckCondition` gates creation.
