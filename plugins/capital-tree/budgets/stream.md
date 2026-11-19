---
type: concept
title: Stream budget
tags: [automation, treasury]
source: capital-tree/src/budgets/StreamBudget.sol
---

# Stream budget

A Stream budget makes a token amount available gradually, up to its funding limit and configured cap. Use it for recurring distributions or as the growing offer in a [buyback auction](../examples/buyback.md). Funds stay in the `DAO.sol` contract.

## Core concepts

- **Availability:** the amount the next run may use. Growth is bounded by the current treasury balance, its last recorded balance, and the configured cap.
- **Rate and epoch:** `amountPerEpoch` is the growth over `epochInterval` seconds. An **epoch** is this interval; growth accrues throughout it. At 10 tokens per day, half a day adds 5.
- **Cap:** `maxBudget` limits availability. Zero removes the cap; supplied auction recipes require a nonzero cap to limit their offer.
- **Sync:** `sync()` updates the recorded balance and carries current availability forward. Use it after funding changes.
- **Checkpoint:** `writeCheckpoint()` records the balance and resets availability to zero. Use it to start or deliberately restart the stream; each successful flow checkpoints automatically.

## Configuration

In a [recipe builder](../../../guides/compose-capital-tree.md), `recipe` is a `Setup.InstallParams` and `usdc` is an [`IERC20`](index.md#the-budget-interface) reference. This streams 1 USDC per hour, capped at 10 USDC:

```solidity
recipe.budget.id = bytes32("StreamBudget@1");
recipe.budget.settings = abi.encode(
    usdc,
    uint256(1_000_000),  // amountPerEpoch: 1 USDC
    uint256(10_000_000), // maxBudget: 10 USDC
    uint256(1 hours)     // epochInterval
);
```

Amounts use [raw token units](index.md#core-concepts). The interval must be positive; `amountPerEpoch` is at most `type(uint128).max`. Each instance belongs to one flow.

## Checkpoint interface

Stream implements [IBudget](index.md#the-budget-interface): `available(caller, data)` reads availability and ignores caller and data. Its `commitActions()` returns a checkpoint call for the `DAO.sol` contract to execute after success, including when some tokens were retained.

It also implements [`ICheckpointedBudget`](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/interfaces/IBudget.sol):

```solidity
interface ICheckpointedBudget is IBudget {
    /// @notice Restarts availability from zero and records the current balance.
    /// @dev StreamBudget requires CHECKPOINT_PERMISSION_ID.
    function writeCheckpoint() external;
}
```

Setup grants the `DAO.sol` contract `CHECKPOINT_PERMISSION_ID`. Anyone may call `sync()`.

## Operate the stream

| Situation | What to do |
|---|---|
| Start | Include `writeCheckpoint()` in the installation proposal. Availability stays at zero until then. |
| Add funds | Send tokens to the `DAO.sol` contract, then call `sync()` to let the new funding support growth. |
| Spend through another proposal or flow | End that transaction with `sync()` to record the reduced balance. |
| Complete a run | The flow checkpoints automatically, starting the next accrual period from zero. |

Sync prevents funding changes from releasing a backlog. For example, a stream growing by 10 per day with only 30 funded stops at 30. A later deposit and sync resume growth from 30; a checkpoint would restart from zero.

Sync immediately after an outside spend: waiting until funds return can let availability jump when replenished. A sync during a temporary balance dip can slow growth. See the [calculation](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/budgets/StreamBudget.sol) for balance tracking and rounding.

## Change settings and pause

The [manager](../setup.md#roles-and-permissions) can call `setAmountPerEpoch`, `setEpochInterval` or `setMaxBudget` with `SET_SETTINGS_PERMISSION_ID`. Each setter syncs automatically. Rate changes preserve accrued availability; lowering the cap can reduce it.

Pausing the plugin leaves accrual running. To resume from zero, unpause and checkpoint in the same governance proposal. The `DAO.sol` contract needs `PAUSE_PERMISSION_ID` on the plugin and `CHECKPOINT_PERMISSION_ID` on the budget.

## See also

- [Recurring buybacks](../examples/buyback.md): combine Stream with Open Fill and solvers.
- [All budgets](index.md) and [Execution](../execution.md).
- [Contract source](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/budgets/StreamBudget.sol) and [settings metadata](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/metadata/components/StreamBudget.json).
