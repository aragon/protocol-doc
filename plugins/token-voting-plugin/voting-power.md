---
type: concept
title: Voting power (Token Voting Plugin)
tags: [governance, voting]
source: token-voting-plugin/src/TokenVoting.sol, token-voting-plugin/src/condition/VotingPowerCondition.sol
---

# Voting power (Token Voting Plugin)

[Token Voting Plugin](/plugins/token-voting-plugin.md) draws every voter's weight from a token, but *how* it reads that weight is the part with real subtlety, and the part a DAO has to get right. This page is the how: the snapshot, delegation, whose supply counts, which clock the token uses, and who is allowed to propose.

The plugin itself holds no balances or vote bookkeeping. It reads power from an `IVotes` token (OpenZeppelin's `ERC20Votes` and equivalents) through three functions: `getVotes` (current power), `getPastVotes` (power at a past point), and `getPastTotalSupply` (total at a past point). Everything below follows from those.

## The snapshot

When a proposal is created it fixes a **snapshot** at the timepoint *just before* creation (`block.number - 1`, or `block.timestamp - 1` for timestamp-based tokens). Every vote on that proposal is then weighed by `getPastVotes(voter, snapshot)`, the voter's power *at that fixed point*, no matter when they actually vote.

Two things make this the right design, not an implementation detail:

- **It defeats double voting.** Without historical snapshots, a holder could vote, transfer the tokens to a fresh address, and vote again with the same tokens. Because power is read at a frozen past point, moving tokens after the snapshot changes nothing.
- **Using the *prior* block blocks same-block manipulation.** If the snapshot were the current block, someone could watch a proposal enter the mempool and, in the same block, acquire or delegate tokens to inflate their weight for it. The prior block is already finalized before the proposal transaction is mined, so it can't be gamed.

A proposal whose snapshot total is zero reverts (`NoVotingPower`), a governance token that nobody can vote with is almost certainly a misconfiguration.

## Delegation

The single most common surprise for token-voting DAOs: with `IVotes`, **holding tokens grants zero voting power until the balance is delegated** (even to yourself). `getVotes` reflects *delegated* power, not raw balance. A holder who never delegates has tokens but no vote.

How each token type handles this differs, and it's the practical reason the token choice matters, see [Governance tokens → delegation](/plugins/token-voting-plugin/governance-tokens.md#delegation). In short: a freshly minted `GovernanceERC20` may leave holders undelegated (unless minting auto-delegates), while the wrapped token auto-delegates on receipt.

## Whose supply counts: excluded accounts

The [participation and approval thresholds](/plugins/majority-voting.md#the-three-thresholds) are measured against *total voting power*. Some balances aren't really part of the electorate, a treasury, a vesting contract, the DAO's own holdings, and counting them would make quorum artificially hard to reach. The plugin lets an install list **excluded accounts** whose balances are subtracted from the total:

```
totalVotingPower(snapshot) = getPastTotalSupply(snapshot) − Σ getPastVotes(excluded, snapshot)
```

The exclusion list is set once at install and deliberately not changeable afterward: because each proposal freezes its participation/approval requirements against the total at *its* snapshot, quietly changing the excluded set later would make in-flight proposals' quorum math inconsistent.

## Block-based vs timestamp-based tokens

`ERC20Votes` tokens historically snapshot by **block number**, but some newer tokens snapshot by **timestamp** (per ERC-6372). The plugin detects which at install: it probes the token's `clock()` / `CLOCK_MODE()` and remembers whether it's timestamp-based (a token that doesn't implement ERC-6372 is treated as block-based). Every place that computes the snapshot then uses the matching unit. If a token's two clock signals disagree (it claims one mode but behaves like the other) the plugin refuses it (`TokenClockMismatch`), a guard against a token misrepresenting how its snapshots work. As a builder you don't manage this, but it's why an `IVotes` token must be *consistent* about its clock.

## Who may propose

`minProposerVotingPower` sets a floor on how much power an address needs to open a proposal, and it's enforced *outside* the voting logic, by a small [permission condition](/common/permission-conditions.md). `TokenVotingSetup` grants `CREATE_PROPOSAL_PERMISSION_ID` to *any address* but attaches a `VotingPowerCondition`; the condition reads the plugin's current `minProposerVotingPower` and checks the caller's power at the [snapshot rule](#the-snapshot) above. A floor of zero means anyone may propose.

This is a clean illustration of the [condition](/common/permission-conditions.md) pattern: "anyone above the bar" is expressed as an open grant plus a condition, and the bar can change (via voting settings) without touching the permission wiring.

## Membership

The Token Voting Plugin implements [`IMembership`](/common/membership.md): `isMember` is true for any address that currently holds a balance *or* has voting power, and the token is announced as the membership-defining contract so indexers know where to look. Note that "is a member" and "can meaningfully vote" differ: someone holding but not [delegating](#delegation) is a member with zero power.

## Keep in mind

- **Delegate, or you have no power.** Power is delegated, not held. Expect to guide token holders through delegating (to themselves, at least) before they can vote.
- **Power is fixed at the snapshot.** Buying or delegating more tokens after a proposal opens does nothing for that proposal, only the snapshot balance counts.
- **The token must be consistent about its clock.** An `IVotes` token that misreports block vs timestamp snapshots is rejected at install.

## See also

- [Token Voting Plugin](/plugins/token-voting-plugin.md) — the plugin overview and lifecycle.
- [Governance tokens](/plugins/token-voting-plugin/governance-tokens.md) — how each token type handles delegation.
- [Majority voting](/plugins/majority-voting.md) — the thresholds total voting power feeds.
- [Permission conditions](/common/permission-conditions.md) — the mechanism gating proposal creation.
