---
type: concept
title: The LockManager
tags: [governance, voting]
source: lock-to-vote-plugin/src/base/LockManagerBase.sol, lock-to-vote-plugin/src/LockManagerERC20.sol, lock-to-vote-plugin/src/interfaces/ILockManager.sol
---

# The LockManager

The `LockManager` is the vault at the centre of the [Lock to Vote Plugin](../lock-to-vote-plugin.md). It does two jobs: it **custodies locked tokens** (this is what makes voting power tamper-proof, you can't move tokens you don't hold), and it is the **sole address allowed to relay votes** into the plugin. Users interact with the LockManager, not the plugin directly.

Each plugin install gets its **own** LockManager, bound to it **1:1 and permanently**: the vault is told its plugin exactly once (checked to support the right interfaces) and can never be repointed, and the plugin likewise accepts exactly one LockManager at initialization. One vault, one plugin, for life.

## Locking

After approving the vault to spend your ERC-20, `lock()` (your full available balance) or `lock(amount)` pulls the tokens in and credits `lockedBalances[you]`. There are two things to internalize:

- **Your locked balance isn't "spent" by voting or proposing.** The same locked amount backs your voting power on *every* proposal simultaneously, and keeps proving your eligibility to propose. It's a standing stake, not a per-proposal deposit.
- **Voting power is read live from this balance.** Lock more and your weight goes up immediately, even on proposals already open (subject to the [mode rules](../lock-to-vote-plugin.md#the-voting-model-and-how-it-differs)).

## Unlocking: the crux

`unlock()` returns your tokens, but it is **gated** and **all-or-nothing** (it releases your *entire* locked balance, there is no partial unlock). Whether you can unlock *early* (while you still have live votes) is the vault's two-regime question, driven by the plugin's [voting mode](../voting-modes.md). Before releasing, `unlock` walks every proposal the vault knows about and, for each one still open, enforces:

1. **Did you create it?** If you created *any* still-open proposal, unlock reverts, full stop, whether or not you voted. This keeps a proposer's stake committed for as long as their proposal lives (otherwise you could lock the minimum, propose, and immediately withdraw).
2. **Did you vote on it?** If you have voting power counted on a still-open proposal, what happens depends on the [voting mode](../voting-modes.md):
   - **Vote Replacement mode, unlock early:** unlock *auto-clears* your vote first (removing your weight from the tally), then releases your tokens. You can leave whenever you want.
   - **Standard mode, strict:** a cast vote **cannot** be cleared while the proposal is open, so **unlock is blocked** until every proposal you voted on has ended. Your capital is frozen for the life of those proposals.

So "when can I unlock?" is: only when you have no open proposal you created, and (in Standard mode) no open proposal you voted on. To reduce your locked amount you must clear all obligations, unlock everything, then re-lock the smaller amount.

## Proposal bookkeeping, and a gas gotcha

To know which proposals to check at unlock time, the LockManager keeps its own set of **known proposal ids**: the plugin notifies it on each `createProposal`, and removes an id when a proposal is **executed**. The catch: a proposal that's *defeated or simply expires unexecuted* is **never automatically removed**, it lingers in the set.

Because `unlock()` (and the proposer check) loop over that whole set, an install that accumulates many defeated/expired-but-unexecuted proposals makes unlocking **progressively more expensive for every locker**. `pruneProposals` is the manual cleanup that drops ended proposals, and it's also done opportunistically as unlocks walk past them, but nothing runs it automatically. High-proposal-volume DAOs should prune periodically.

## Trust boundaries

The vault and plugin trust each other through **hard-coded address checks**, not (only) DAO permissions: the plugin accepts `vote`/`clearVote` calls only from its LockManager, and the LockManager accepts the proposal notifications only from its plugin. That's deliberate belt-and-suspenders, the relaying between these two contracts can't be redirected even if a permission is misconfigured, because the pairing is fixed in **write-once storage** (set once at install and never repointable, guarded by `SetPluginAddressForbidden` / `LockManagerAlreadyDefined`; these are upgradeable proxies, so the fields are ordinary storage, not the `immutable` keyword).

## Keep in mind

- **Standard-mode voting freezes your capital until the proposal ends**, you cannot un-vote to reclaim it early (only Vote Replacement mode can). Plan liquidity accordingly.
- **No partial unlock**: it's all your locked tokens or none; reduce by fully unlocking and re-locking less.
- **A proposer can't unlock while any proposal they created is still open.**
- **Prune ended proposals.** Defeated/expired proposals linger in the known-proposal set and make every `unlock()` costlier until `pruneProposals` clears them.

## See also

- [Lock to Vote Plugin](../lock-to-vote-plugin.md) — the plugin overview, voting model, and permissions.
- [Voting modes](../voting-modes.md) — why Standard vs Vote Replacement changes whether you can unlock.
