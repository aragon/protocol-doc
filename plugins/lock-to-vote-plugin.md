---
type: concept
title: Lock to Vote Plugin
tags: [governance, voting]
source: lock-to-vote-plugin/src/LockToVotePlugin.sol, lock-to-vote-plugin/src/base/LockToGovernBase.sol, lock-to-vote-plugin/src/base/MajorityVotingBase.sol, lock-to-vote-plugin/src/conditions/MinVotingPowerCondition.sol, lock-to-vote-plugin/src/setup/LockToVotePluginSetup.sol, lock-to-vote-plugin/src/interfaces/ILockToVote.sol, lock-to-vote-plugin/src/interfaces/ILockToGovernBase.sol, lock-to-vote-plugin/src/interfaces/IMajorityVoting.sol
---

# Lock to Vote Plugin

Lock to Vote is token-weighted governance, like the [Token Voting Plugin](./token-voting-plugin.md), but your voting power comes from tokens you **actively lock into escrow**, not from a snapshot of your past balance. To vote, you lock tokens into a **[LockManager](./lock-to-vote-plugin/lock-manager.md)** vault; your voting power is however much you currently have locked; and you get your tokens back by unlocking later.

## Lock vs. snapshot: the core idea

Both plugins prevent someone voting twice with the same tokens, but use different mechanisms:

- **[Token Voting](./token-voting-plugin.md)** defeats double-voting with **time**: it reads your balance at a [past snapshot](./token-voting-plugin/voting-power.md#the-snapshot), so moving tokens afterward changes nothing. Tokens stay liquid.
- **Lock to Vote** defeats it with **custody**: your tokens stay locked in the LockManager, so you can't move them to another address to vote again. There is no snapshot anywhere.

That single substitution drives every difference:

- **Any ERC-20 works.** No `IVotes`, no checkpointing, no delegation, custody replaces the interface requirement. (Token Voting needs an `IVotes` token or a [wrapper](./token-voting-plugin/governance-tokens.md).)
- **Voting power is live, and can grow mid-vote.** It's your *current* locked balance, so you can lock more during an open proposal and immediately have more say, something a snapshot-based vote can never do.
- **Getting liquidity back is gated.** Because there's no "the vote already happened, your balance now is irrelevant", unlocking has to be actively restricted against your outstanding votes, see the [LockManager](./lock-to-vote-plugin/lock-manager.md).

## Why lock at all, and when to reach for it

The choice affects *when* you need to hold your tokens. [Token Voting](./token-voting-plugin.md) only counts tokens you hold **in your own wallet at the proposal's snapshot**, a past moment you can't predict. To remain able to vote on any proposal, you'd have to keep tokens **idle in your wallet indefinitely**: once you stake, lend, or LP them, they're no longer "yours at snapshot time" and your voting power is lost. You can't foresee which proposal you'll care about, so remaining ready to vote means keeping that capital available.

Lock to Vote lets you lock in response to a proposal. Because power comes from an explicit lock rather than a passive snapshot, you can keep your tokens **productively deployed elsewhere** (staked, in a vault, earning yield), lock them when a proposal you care about appears, vote, then unlock and use them elsewhere again. You can acquire voting power when needed instead of keeping tokens idle continuously.

The trade-off is committing specific tokens while you vote, rather than keeping capital idle continuously in case you need it.

The plugin is designed for **exceptional intervention, not routine governance**: emergency stops or last-line vetoes, where holders lock to weigh in on one proposal, then unlock and return to earning. Its mechanics also favor this pattern. Thresholds read `totalSupply` live right up to `execute` (see [below](#the-voting-model-and-how-it-differs)), so the safe operating rule is *veto quickly, then commit quickly*. Choose Lock to Vote when holders' tokens are normally deployed elsewhere and participation is exceptional. For steady day-to-day governance where a stable quorum threshold matters, [Token Voting](./token-voting-plugin.md) fits better; avoid Lock to Vote when its model doesn't fit the use case.

## The lifecycle

1. **Approve** the LockManager to spend your ERC-20.
2. **Lock** tokens into it (`lock` / `lock(amount)`), **at any time**: before any proposal exists, or while one is already open. Your locked balance *is* your voting power, and one locked balance backs your vote on *every* proposal at once, it isn't "spent" per proposal. You can always **add** to your locked position (raising your power), but you can't shave a slice off: the only way down is a full [unlock](#getting-your-tokens-back-two-unlock-regimes) and a re-lock of less.
3. **Vote** through the LockManager (`vote`, or `lockAndVote` to do both in one transaction). Users always vote via the LockManager, never by calling the plugin directly.
4. **[Unlock](#getting-your-tokens-back-two-unlock-regimes)** to reclaim your tokens, when nothing is blocking it (see below).

## The voting model, and how it differs

Lock to Vote uses the same [majority-voting engine](./majority-voting.md) as Token Voting: full `Yes`/`No`/`Abstain` votes and the same support / participation / approval thresholds. Two deltas matter, both flowing from live voting power:

- **No Early Execution mode.** Only `Standard` and `VoteReplacement` exist ([not the three modes](./voting-modes.md)). Early execution needs an outcome to be *provably final before the deadline*, which requires a fixed ceiling on total possible voting power to bound the worst case. Here there's no such ceiling, more can be locked (and the supply itself minted) at any moment, so no outcome is ever provably final early and the mode can't exist soundly.
- **"Standard" means the direction is locked, not the weight.** In Token Voting, Standard = your vote is fixed once cast (power was snapshotted). Here, because you can lock more, Standard mode lets you **top up the same option** (vote Yes again with more locked power) but never switch option or reduce weight. Vote Replacement lets you change option too.

> The participation/approval bar is measured against the token's **current** total supply (read live, not frozen at creation), so with a mintable or burnable token the quorum bar can move **while a proposal is open *and* after it closes, right up to the moment someone triggers `execute`**. Both directions bite: a mint after voting ends can push a passing proposal back under quorum, and a burn can push a failing one over. And the denominator is the *whole supply*, not the locked portion, so a `minParticipation` set against 100% of supply can be near-unreachable when only a small fraction of holders ever lock. Size participation/approval thresholds against realistic lock participation, not total supply.

Two operating rules follow from this design. **Never treat `minParticipation` failing as "no-quorum, therefore rejected"**: always cast an explicit `No` to reject a malicious proposal, because supply can be reduced to make quorum reachable even after voting ends. **Execute passing proposals as soon as the end date passes**: any delay gives supply changes time to flip the outcome. These rules fit the participants' incentives: holders want their tokens back to redeploy them, and beneficiaries of a passed proposal want the decision finalized. That is why the plugin fits exceptional/veto use rather than routine governance where a stable quorum threshold is expected.

## Getting your tokens back: two unlock regimes

Unlocking is **all-or-nothing** (it returns your entire locked balance, there's no partial unlock), and whether you can unlock *early* depends on the plugin's [voting mode](./voting-modes.md):

- **Vote Replacement mode, unlock early.** You can unlock whenever you like. Unlocking first **withdraws your votes** from any still-open proposals (your weight leaves their tallies), then returns your tokens.
- **Standard mode, strict.** A cast vote **cannot be withdrawn**, so once you've voted on a Standard-mode proposal, the tokens you voted with are committed until that proposal **ends**. To unlock you must wait out *every* open proposal you allocated voting power to.

In **both** regimes, a **proposal's creator can't unlock while a proposal they created is still open** (whether or not they voted), their stake stays committed for its life. The full mechanics and a gas caveat are on [the LockManager](./lock-to-vote-plugin/lock-manager.md#unlocking-the-crux).

## Who can create proposals

Like Token Voting, creation is permission-gated and narrowed by a [condition](../common/permission-conditions.md), `MinVotingPowerCondition`, but with a twist unique to locking. Because a locked balance isn't consumed by proposing (the same tokens keep proving eligibility for every proposal at once), a flat minimum would let someone lock once and spam proposals. So the required lock **scales with how many open proposals you already have**: the bar is `minProposerVotingPower × (your open proposals + 1)`. Your second concurrent proposal needs twice the locked tokens, your third three times, and so on, anti-spam that fits the lock model.

## Installation & permissions

`LockToVotePluginSetup` deploys the plugin, a **fresh `LockManagerERC20` vault** for it (there's no "reuse an existing LockManager" path, one dedicated vault per install), and the `MinVotingPowerCondition`. It validates the token is an ERC-20 by duck-typing, that's the whole bar, any plain ERC-20 qualifies. It grants:

| Permission | On (where) | Granted to (who) | Condition | Gates |
|---|---|---|---|---|
| `EXECUTE_PERMISSION_ID` | DAO | plugin | none | the plugin calling `dao.execute` |
| `CREATE_PROPOSAL_PERMISSION_ID` | plugin | the configured creator (often any address) | `MinVotingPowerCondition` | `createProposal` |
| `EXECUTE_PROPOSAL_PERMISSION_ID` | plugin | the configured executor (often any address) | none | `execute` |
| `LOCK_MANAGER_PERMISSION_ID` | plugin | **the LockManager contract** | none | `vote` |
| `UPDATE_SETTINGS_PERMISSION_ID` | plugin | DAO | none | `updateVotingSettings` |
| `SET_TARGET_CONFIG_PERMISSION_ID` | plugin | DAO | none | `setTargetConfig` |
| `SET_METADATA_PERMISSION_ID` | plugin | DAO | none | `setMetadata` |
| `UPGRADE_PLUGIN_PERMISSION_ID` | plugin | DAO | none | upgrading the plugin |

Note `LOCK_MANAGER_PERMISSION_ID` is granted to a **contract** (the vault), not to users, a machine-to-machine permission: only the LockManager may relay votes into the plugin. As defense in depth, the plugin *also* hard-codes that the caller of `vote` must be its LockManager, so even a permission misconfiguration can't let anyone else vote. A proposal's actions can't target the **LockManager** (nor the zero address), so a passed proposal can't reach in and corrupt the vault, though they *can* target the plugin itself (e.g. to `updateVotingSettings`, run as the DAO).

## Keep in mind

- **In Standard mode, voting locks up your capital until the proposal ends.** You can't un-vote to reclaim tokens early (only Vote Replacement mode allows that), so locked tokens you voted with are frozen for the proposal's whole life. See [unlocking](./lock-to-vote-plugin/lock-manager.md#unlocking-the-crux).
- **A proposal's creator can't unlock while that proposal is open**, whether or not they voted.
- **Voting power can grow but never shrink on a cast vote**, and there's **no Early Execution mode**, both consequences of power being live rather than snapshotted.
- **Thresholds stay dynamic until `execute`.** Participation and approval are measured against live `totalSupply`, so with a mintable/burnable token a proposal's outcome can flip *after* voting closes: mint to defeat a passing one, burn to pass a failing one. Don't rely on `minParticipation` failing to reject a malicious proposal (cast `No` explicitly), and execute passing proposals as soon as the end date passes. See [the voting model](#the-voting-model-and-how-it-differs).
- **Choose the token carefully.** Locking credits the *requested* amount while the vault receives whatever actually transfers, so a fee-on-transfer or rebasing token leaves credited balances exceeding the vault's real holdings. The vault then can't cover every withdrawal, and because unlock is all-or-nothing, later unlockers' transfers simply revert. Prefer a plain, well-behaved ERC-20.

## See also

- [The LockManager](./lock-to-vote-plugin/lock-manager.md) — the vault and its unlock rules.
- [Token Voting Plugin](./token-voting-plugin.md) — the snapshot-based counterpart; the contrast is the fastest way to understand both.
- [Majority voting](./majority-voting.md) and [Voting modes](./voting-modes.md) — the shared voting model (mind the two deltas above).
