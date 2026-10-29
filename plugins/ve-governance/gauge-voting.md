---
type: concept
title: VE gauge voting and result accounting
tags: [governance, voting]
source: ve-governance/src/voting/AddressGaugeVoter.sol, ve-governance/src/voting/IAddressGaugeVoter.sol, ve-governance/src/clock/Clock_v1_2_0.sol
---

# VE gauge voting and result accounting

A gauge identifies an allocation option by address and metadata. A delegate calls `vote(GaugeVote[])` with relative weights; weights of 3 and 1 allocate approximately 75% and 25% of their available voting power, subject to rounding. Voting transfers no tokens.

Gauges must exist and be active. Duplicate gauges and weights that normalize to zero are rejected. Calling `vote` again replaces the address's earlier allocation; `reset()` removes it. Both methods require an open voting window and an unpaused voter.

## The voting window

`ClockV1_2_0` uses two-week epochs on a Unix timestamp grid. For an epoch starting at `E`, voting is open during:

```text
E + 1 hour <= timestamp < E + 1 week - 1 hour
```

`votingActive()` reports the time condition; pausing is a separate check. Deployment and pauses do not shift the epoch boundaries.

## Two accounting modes

The v1.4 setup enables `enableUpdateVotingPowerHook`:

| Behavior | Hook enabled | Hook disabled |
|---|---|---|
| Power used when casting | Current `getVotes(account)` | `getPastVotes(account, currentEpochStart())` |
| `getWriteEpochId()` | `0` | Current epoch ID |
| Allocation lifetime | Persists across epochs | Stored separately by epoch |
| Position/delegation changes | Hook can reduce allocations | Uses the epoch-start power snapshot |

With the hook enabled, time-based growth and increases do not continuously expand stored allocations. Recasting includes the delegate's current power. Reductions can reach the voter through the escrow hook even after voting closes.

The DAO can change the mode, but the setter does not migrate allocations between buckets. An indexer must interpret each historical read using the mode at that block.

## Read results for a payout

At a chosen block, read `getWriteEpochId()`, then use that bucket for `epochGaugeVotes(bucket, gauge)` and `epochTotalVotingPowerCast(bucket)`. `votes(account, gauge)` selects the active bucket internally. Events carry a wall-clock epoch identifier even when storage uses bucket `0`.

For a fixed reward snapshot, read all values at the same historical block through an RPC or indexer. Later queries can return reduced totals. Deactivating a gauge blocks new votes without removing its existing weights, so the allocation policy also needs to identify eligible gauges.

Your protocol supplies the budget, rounding rules, recipients, and payout mechanism. [Capital Distributor](../capital-distributor.md) can consume a recipient list calculated from those weights.

## Keep in mind

- Closing the voting window does not freeze hook-enabled totals.
- A gauge address identifies a voting option; your allocation policy identifies who gets paid.
