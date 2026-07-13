---
type: concept
title: Capital Router budgets
tags: [automation, treasury]
source: capital-router/src/budgets/FullBudget.sol, capital-router/src/budgets/RequiredBudget.sol, capital-router/src/budgets/FixedBudget.sol, capital-router/src/budgets/StreamBudget.sol, capital-router/src/base/StreamClock.sol
---

# Capital Router budgets

A **budget** answers the first half of a [Capital Router](/plugins/capital-router.md) flow: *how much is available to move right now?* A [strategy](/plugins/capital-router/strategies.md) reads it, then (if it distributes) hands the total to a [splitter](/plugins/capital-router/splitters.md). Budgets hold no state beyond their configuration (except the streaming one), the amount is computed fresh each call.

| Budget | Flow | Answers |
|---|---|---|
| **Full** | [dispatch](/plugins/capital-router/dispatch-vs-request.md) | 100% of the vault's current balance of the token, recomputed each call |
| **Required** | dispatch | a fixed configured amount, but **reverts** if the vault holds less (all-or-nothing: exactly that amount, or the dispatch fails) |
| **Fixed** | [request](/plugins/capital-router/dispatch-vs-request.md) | a constant amount, regardless of vault state (request-only, since a push couldn't trust the balance to be there) |
| **Streaming** | both | an amount that unlocks over time (below) |

## Streaming budgets

`StreamBudget` unlocks `amountPerEpoch` tokens per `epochInterval` seconds since its last checkpoint, on top of a small reusable clock (`StreamClock`) that just measures "how many epochs' worth of time has elapsed" as a fraction of [`RATIO_BASE`](/common/ratio.md). Two design points worth understanding:

- **The clock is uncapped by time, but the payout is capped.** If three epochs pass with no dispatch, the elapsed ratio is 300%, and the streamable amount accumulates accordingly. A `maxBudget` (0 = unlimited) bounds the most a single call can release, set it, or a long idle period followed by one dispatch pays out a lump sum.
- **Dispatch caps at the vault balance; request does not.** On the [dispatch](/plugins/capital-router/dispatch-vs-request.md) path the streamable amount is also capped at what the vault actually holds, so the built actions can't revert at `execute()` for insufficient funds. On the request path it isn't, because each caller's entitlement must be computed against their *full* theoretical share (capping at a live, shrinking balance would make early requesters' math depend on later requesters' timing). If the vault is genuinely short on the request path, the transfer simply reverts at execution, a funding problem, not a budget miscalculation.

Resetting the clock (`writeCheckpoint`) is callable **only by the vault (the DAO)**: it happens because strategies append a checkpoint [action](/core/execution.md) whose target is the budget, executed *by* the DAO. Nothing else can reset a stream's window.

## Keep in mind

- **A `StreamBudget` clone belongs to one strategy.** Sharing one across strategies would let one strategy's dispatch reset another's streaming window; the factory always deploys a fresh clone per strategy.
- **Cap streaming exposure with `maxBudget`.** Uncapped + infrequent dispatch = one large payout after idle time.
- **`FullBudget` reads a moving target for rebasing/fee-on-transfer tokens.** Prefer `Required`/`Fixed` when the token's balance doesn't equal what you intend to distribute.

## See also

- [Splitters](/plugins/capital-router/splitters.md) — the "who gets what" half a transfer strategy pairs with a budget.
- [Strategies](/plugins/capital-router/strategies.md) and [dispatch vs. request](/plugins/capital-router/dispatch-vs-request.md).
