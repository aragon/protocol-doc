---
type: concept
title: Voting power (Token Voting Plugin)
tags: [governance, voting]
source: token-voting-plugin/src/TokenVoting.sol, token-voting-plugin/src/condition/VotingPowerCondition.sol
---

# Voting power (Token Voting Plugin)

[Token Voting Plugin](../token-voting-plugin.md) draws every voter's weight from a token, but *how* it reads that weight is the part with real subtlety, and the part a DAO has to get right. This page is the how: the snapshot, delegation, whose supply counts, which clock the token uses, and who is allowed to propose.

The plugin itself holds no balances or vote bookkeeping. It reads power from an `IVotes` token (OpenZeppelin's `ERC20Votes` and equivalents) through three functions: `getVotes` (current power), `getPastVotes` (power at a past point), and `getPastTotalSupply` (total at a past point). Everything below follows from those.

## The snapshot

When a proposal is created it fixes a **snapshot** at the timepoint *just before* creation (`block.number - 1`, or `block.timestamp - 1` for timestamp-based tokens). Every vote on that proposal is then weighed by `getPastVotes(voter, snapshot)`, the voter's power *at that fixed point*, no matter when they actually vote.

The snapshot prevents **double voting with the same tokens**. Suppose Alice has 100 self-delegated tokens and Bob has none at the snapshot. Alice votes with 100 power, then transfers the tokens to Bob. Even if Bob self-delegates them, his power for this proposal is still zero: `getPastVotes` reads the earlier checkpoint. Transferring tokens or moving their delegation cannot make the same power count at a second address.

Using a past timepoint also prevents transactions in the proposal's creation block from changing its electorate. Acquiring or delegating tokens in response to a pending proposal is too late if both transactions enter the same block. Prepare holders **before creation**, even if the proposal's voting start is scheduled for later; waiting for that start does not refresh its snapshot.

A proposal with zero effective total supply at its snapshot reverts with `NoVotingPower`; zero delegated power at an individual account instead makes that account unable to vote.

## Delegation

With `IVotes`, **holding tokens grants zero voting power until the balance is delegated** (even to yourself), which trips up most token-voting DAOs. `getVotes` reflects *delegated* power, not raw balance. A holder who never delegates has tokens but no vote.

How each token type handles this differs, and it's the practical reason the token choice matters, see [Governance tokens → delegation](./governance-tokens.md#delegation). In short: a freshly minted `GovernanceERC20` may leave holders undelegated (unless minting auto-delegates), while the wrapped token auto-delegates on receipt.

## Whose supply counts: excluded accounts

The [participation and approval thresholds](/plugins/majority-voting.md#the-three-thresholds) are measured against effective total voting power. The plugin subtracts the historical delegated power of accounts excluded at installation:

```
totalVotingPower(snapshot) = getPastTotalSupply(snapshot) − Σ getPastVotes(excluded, snapshot)
```

Non-circulating holdings, such as a treasury, vesting contract, or the DAO's own tokens, can make quorum harder to reach if their supply counts but they do not participate. The installation can name accounts whose delegated power should be subtracted, for example a treasury that self-delegates those holdings. This subtracts **historical delegated power**, not `balanceOf`: listing an undelegated treasury does not remove its token balance from the denominator.

The exclusion list cannot be changed after installation. The [worst-case support check](/plugins/voting-modes.md#early-execution) reads the effective snapshot supply again; changing the excluded set could change that check for an existing proposal while its participation and approval amounts remain frozen. Choose the list before installing.

Exclusion adjusts the denominator; it does not prevent the listed accounts from voting. Account for their delegation and voting behavior when choosing the list.

## Block-based vs timestamp-based tokens

`ERC20Votes` tokens historically snapshot by **block number**, but some newer tokens snapshot by **timestamp** (per ERC-6372). The plugin detects which at install: it probes the token's `clock()` / `CLOCK_MODE()` and remembers whether it's timestamp-based (a token that doesn't implement ERC-6372 is treated as block-based). Every place that computes the snapshot then uses the matching unit. If a token's two clock signals disagree (it claims one mode but behaves like the other) the plugin refuses it (`TokenClockMismatch`), a guard against a token misrepresenting how its snapshots work. As a builder you don't manage this, but it's why an `IVotes` token must be *consistent* about its clock.

## Who may propose

`minProposerVotingPower` sets a floor on how much power an address needs to open a proposal, and it's enforced *outside* the voting logic, by a small [permission condition](../../common/permission-conditions.md). `TokenVotingSetup` grants `CREATE_PROPOSAL_PERMISSION_ID` to *any address* but attaches a `VotingPowerCondition`; the condition reads the plugin's current `minProposerVotingPower` and checks the caller's power at the [snapshot rule](#the-snapshot) above. A floor of zero means anyone may propose.

This is a clean illustration of the [condition](../../common/permission-conditions.md) pattern: "anyone above the bar" is expressed as an open grant plus a condition, and the bar can change (via voting settings) without touching the permission wiring.

## Membership

The Token Voting Plugin implements [`IMembership`](../../common/membership.md): `isMember` is true for any address that currently holds a balance *or* has voting power, and the token is announced as the membership-defining contract so indexers know where to look. Note that "is a member" and "can meaningfully vote" differ: someone holding but not [delegating](#delegation) is a member with zero power.

## Keep in mind

- **Delegate, or you have no power.** Power is delegated, not held. Expect to guide token holders through delegating (to themselves, at least) before they can vote.
- **Power is fixed at the snapshot.** Buying or delegating more tokens after a proposal opens does nothing for that proposal, only the snapshot balance counts.
- **The token must be consistent about its clock.** An `IVotes` token that misreports block vs timestamp snapshots is rejected at install.

## See also

- [Token Voting Plugin](../token-voting-plugin.md) — the plugin overview and lifecycle.
- [Governance tokens](./governance-tokens.md) — how each token type handles delegation.
- [Majority voting](../majority-voting.md) — the thresholds total voting power feeds.
- [Permission conditions](../../common/permission-conditions.md) — the mechanism gating proposal creation.
