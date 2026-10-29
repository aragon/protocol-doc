---
type: concept
title: VE delegation
tags: [governance, voting]
source: ve-governance/src/delegation/EscrowIVotesAdapter.sol, ve-governance/src/delegation/DelegationHelper.sol, ve-governance/src/setup/GaugeVoterSetup_v1_4_0.sol
---

# VE delegation

`EscrowIVotesAdapter` aggregates [position power](./voting-power.md) by delegate address. A holder chooses who exercises their votes while retaining NFT ownership and withdrawal rights.

The normal path is `delegate(address)`: choose your own address to vote directly, another address to let it vote, or the zero address to remove delegation. Auto-delegation is enabled by default after a holder chooses a delegate. Before that choice, a new position contributes no delegated votes.

Minting, transferring, merging, splitting, and withdrawing positions update the relevant delegation accounting. Restoring or increasing delegated power does not automatically increase an existing [gauge allocation](./gauge-voting.md); the delegate includes that power by recasting during a voting window.

## Queries and clock

| Adapter method | Meaning |
|---|---|
| `getVotes(account)` | Current power delegated to the address |
| `getPastVotes(account, timestamp)` | Delegated power at a past timestamp |
| `getPastTotalSupply(timestamp)` | Historical total escrow power, including undelegated power |
| `balanceOf(account)` | Number of owned position NFTs |
| `clock()`, `CLOCK_MODE()` | Timestamp clock and its declaration |

The historical queries take timestamps. A [proposal-voting consumer](../token-voting-plugin/voting-power.md#block-based-vs-timestamp-based-tokens) must support that clock and use the adapter's vote queries for voting weight. `balanceOf` counts NFTs, and `delegateBySig` reverts.

## Selective position delegation

`setDelegateAddress`, `delegate(uint256[])`, and `undelegate(uint256[])` support selective token-ID delegation. They require `DELEGATION_TOKEN_ROLE`; the token-list methods also check ownership. The v1.4 setup grants this role to the DAO, so these are not permissionless alternatives to the normal account delegation method.

## Keep in mind

- A holder must choose a delegate before their positions contribute delegated votes.
- Total historical power includes undelegated positions, which affects a proposal plugin's quorum denominator.
- Delegation gives voting authority; the holder keeps the underlying position and exit rights.
