---
type: concept
title: Capital Router strategies
tags: [automation, treasury, capital-router]
source: capital-router/src/base/DispatchStrategyBase.sol, capital-router/src/base/RequestStrategyBase.sol, capital-router/src/base/TransferDispatchStrategyBase.sol, capital-router/src/strategies/EpochTransferDispatchStrategy.sol, capital-router/src/strategies/BurnDispatchStrategy.sol, capital-router/src/strategies/UniswapDispatchStrategy.sol, capital-router/src/strategies/CowSwapDispatchStrategy.sol, capital-router/src/strategies/TransferRequestStrategy.sol, capital-router/src/strategies/EpochTransferRequestStrategy.sol
---

# Capital Router strategies

A **strategy** is the glue of a [Capital Router](/plugins/capital-router.md) flow: it composes a [budget](/plugins/capital-router/budgets.md) with (for transfers) a [splitter](/plugins/capital-router/splitters.md), and turns the numbers into the [actions](/core/execution.md) the DAO executes. The [plugin](/plugins/capital-router/plugins.md) only ever calls a strategy's `prepareActions()`, which (in the base contract) checks the `PREPARE_PERMISSION`, refuses if the strategy is `paused`, and delegates to the strategy's own logic. Every strategy also exposes a `strategyId()` string for off-chain discovery.

Each is either a [dispatch or a request](/plugins/capital-router/dispatch-vs-request.md) strategy.

## Dispatch strategies (push)

- **Transfer** — the base pattern: read the budget, ask the splitter for all recipients' shares, build one transfer per recipient. Native coin and plain ERC-20s are one action each; a `useSafeTransfer` mode (for tokens like USDT) instead **batches** into a fixed 3 actions (`approve(0)` → `approve(total)` → one `batchSafeTransferFrom` via a helper), plus a streaming checkpoint action if the budget streams. This matters for scale: the plain path spends one of the DAO's [256 actions](/core/execution.md) per recipient (so a few hundred max), while the safe-transfer path is batched into a single helper call regardless of recipient count.
- **Epoch Transfer** — Transfer, gated to *once per epoch*: if the current epoch was already dispatched it's a no-op, otherwise it records the epoch and distributes. It doesn't replay missed epochs, if several pass, the next dispatch pays out whatever the *budget* has accumulated (e.g. a [streaming budget](/plugins/capital-router/budgets.md)) in one catch-up shot.
- **Burn** — budget-only (no splitter): a single `ERC20Burnable.burn(total)` action. Reverts on native coin (`CannotBurnNativeToken`), and depends on the token actually implementing `burn`, if it doesn't, the failure surfaces at `execute()` time.
- **Uniswap / CowSwap** — swap strategies, budget-only (the "recipient" is the DAO's own treasury receiving the output). Uniswap builds an approve + `exactInputSingle` and swaps atomically on-chain; CowSwap posts a pre-signed order and emits an event for off-chain solvers to fill (async). Both compute a minimum output from a [price oracle](/plugins/capital-router/oracles.md) and slippage tolerance, and **both require a non-zero oracle** (they revert `NoPriceOracle` otherwise), there's no "unprotected swap" configuration.

## Request strategies (pull)

- **Transfer** — the caller's paid amount ratchets (`requestedAmounts[caller]`); a request pays `splitter.allocation(caller, total, data) − alreadyPaid`, a single recipient's transfer (1 action, or 3 with safe-transfer). Nothing new due → a silent no-op.
- **Epoch Transfer** — the richest strategy: a caller claims across *multiple past epochs* in one request (up to `MAX_EPOCHS_PER_REQUEST = 15`), starting from their first unclaimed epoch. Each epoch's budget/splitter are called with `abi.encode(epoch, userData)`. It carries an explicit **invariant**: the budget and splitter *must* return stable, immutable values for any finalized epoch, if a value can still move (a not-yet-finalized epoch, a live vote count), claims are wrong. Helpful views `previewRequest` and `getRequestableEpochRange` let a UI show "you can claim X" before spending gas.

## Keep in mind

- **Swaps need an oracle, period.** Both swap strategies revert without a price oracle; "no slippage protection" is not a configurable state here.
- **Replacing a strategy clone resets its state.** Strategies are immutable clones; swapping one in via [`updateSettings`](/plugins/capital-router/plugins.md) gives the new clone fresh state (`lastDispatchedEpoch` / `requestedAmounts` / `lastRequestedEpoch` all zero). That can double-pay or reopen a gate if you didn't intend it, treat a strategy swap as a reset.
- **Epoch strategies demand finalized, immutable epoch data.** Only let an epoch become requestable once its budget/splitter values are settled.
- **Choose the transfer mode for the token.** `useSafeTransfer` for non-standard ERC-20s (USDT); it also changes the action-count math (batched vs one-per-recipient).

## See also

- [Budgets](/plugins/capital-router/budgets.md) and [Splitters](/plugins/capital-router/splitters.md) — what a strategy composes.
- [Oracles](/plugins/capital-router/oracles.md) — the price feeds the swap strategies require.
- [The plugins](/plugins/capital-router/plugins.md) and [dispatch vs. request](/plugins/capital-router/dispatch-vs-request.md).
