---
type: concept
title: Capital Router splitters
tags: [automation, treasury]
source: capital-router/src/splitters/RatioSplitter.sol, capital-router/src/splitters/EqualSplitter.sol, capital-router/src/splitters/TieredSplitter.sol, capital-router/src/splitters/SoloSplitter.sol, capital-router/src/splitters/AddressGaugeSplitter.sol, capital-router/src/splitters/TokenGaugeSplitter.sol, capital-router/src/lib/ratio.sol
---

# Capital Router splitters

A **splitter** answers the second half of a distributing [Capital Router](/plugins/capital-router.md) flow: given a total (from a [budget](/plugins/capital-router/budgets.md)), *who gets what share?* A [dispatch](/plugins/capital-router/dispatch-vs-request.md) splitter returns all recipients' amounts at once (`allocations(total)`); a request splitter returns one caller's share (`allocation(caller, total, data)`). Only *transfer* strategies use a splitter, swaps and burns have a single implicit destination.

| Splitter | Rule |
|---|---|
| **Solo** | 100% to one address. Useful as a leaf inside a Tiered splitter, or to force a single sink. |
| **Equal** | `total / n`, integer division. The remainder (dust) simply stays in the vault, recoverable on a later distribution, nothing is lost. |
| **Ratio** | each recipient gets `total × ratio / RATIO_BASE`. Ratios must sum to exactly `RATIO_BASE` (1,000,000), validated once at setup (`InvalidRatios`). |
| **Tiered** | progressive brackets: the first `cap₀` tokens flow through tier 0's sub-splitter, the next `cap₁ − cap₀` through tier 1's, and so on. Caps must strictly increase; each sub-splitter must support *both* splitter interfaces (`IDispatchSplitter` **and** `IRequestSplitter`, checked by ERC-165 at setup), so Solo/Equal/Ratio, and Tiered itself, qualify. A Tiered splitter **can** nest inside another Tiered; what's excluded is the dispatch-only gauge splitters (they implement `IDispatchSplitter` only). |
| **Address / Token gauge** | shares proportional to voting weights read from an external gauge voter. **Dispatch-only** (a "live protocol weight" has no per-user claim semantics). |

## Ratios round *down* here (the opposite of OSx core)

`RatioSplitter` (and the framework's `applyRatio`) **floor**: `total × ratio / RATIO_BASE`, truncated. This is deliberate and the *opposite* of [OSx's core `Ratio`](/common/ratio.md), which *ceils*. The reason is the reverse situation: core ratios express a *minimum requirement* (a quorum), where rounding down would silently weaken it; here a ratio splits a *finite budget*, where rounding any share *up* could push the sum of all shares past the actual balance and make the last transfer in the batch revert. Same `RATIO_BASE` convention, opposite direction, for the opposite reason. If you know the core convention, don't assume it carries over.

## Gauge splitters read live weights, be careful

`AddressGaugeSplitter` / `TokenGaugeSplitter` weight the split by votes from an external gauge voter, but they source those weights **differently**, and the difference is a safety property. `AddressGaugeSplitter` reads a *finalized prior epoch* (via the voter's `getWriteEpochId()` snapshot), so its weights are settled before the current block and can't be moved within the triggering transaction. `TokenGaugeSplitter` instead reads the voter's **live** `totalVotingPowerCast()` / `gaugeVotes()`, so it's only as snapshot-safe as that voter is: if the live weights are manipulable within a transaction (borrow, vote, dispatch, return, all in one call), the split can be skewed toward the caller. The general rule for any custom splitter: only read state committed *before* the current block, never state the caller can move within the same call. Also note a gauge splitter **reverts** if the gauge call reverts, if that shouldn't block other strategies, isolate it behind a [failsafe bit](/plugins/capital-router/plugins.md#the-failsafe-map).

## Keep in mind

- **Ratio splitters floor** (unlike [core ratios](/common/ratio.md), which ceil), to keep the sum within the budget.
- **Equal-split dust stays in the vault**, no funds lost, just not distributed this round.
- **Gauge weights must be settled before the current block.** The Address gauge reads a finalized epoch snapshot; the Token gauge reads live, so its safety rides entirely on whether its voter can be moved within a transaction. A reverting gauge reverts the strategy unless failsafe-isolated.

## See also

- [Budgets](/plugins/capital-router/budgets.md) — the total a splitter divides.
- [Ratio](/common/ratio.md) — the OSx-wide `RATIO_BASE` convention (which rounds the other way).
- [Strategies](/plugins/capital-router/strategies.md), [the plugins](/plugins/capital-router/plugins.md).
