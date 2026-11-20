# Budgets

Choose a budget to decide how much a [trigger](../concepts.md#a-trigger-runs-the-flow) may use: an amount accrued over time, the treasury's whole token balance, or an account's remaining entitlement. Each budget supports one ERC20 token. Funds stay in the `DAO.sol` contract; the budget calculates availability.

## Core concepts

- **Availability:** an amount in the token's smallest unit, computed before the tree runs. These **raw units** are the integer amounts used in [`Asset`](../execution.md#inputs-and-outputs).
- **Caller and data:** the [trigger caller](../concepts.md#a-trigger-runs-the-flow) and its `budgetData`, bytes supplied to the budget for this run. A budget may use them to verify an entitlement—the amount an account is allowed to claim—or ignore them.
- **Commit:** accounting after a successful run. Restarting a stream begins the next accrual period; recording a claim prevents the same entitlement being paid again.

## The budget interface

[`IBudget`](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/interfaces/IBudget.sol) returns an [`IERC20`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.6/contracts/token/ERC20/IERC20.sol) token reference and [`Action[]`](../../../core/execution.md) calls:

```solidity
interface IBudget {
    function token() external view returns (IERC20);

    /// @notice Calculates what this caller may use in the current run.
    /// @param caller The account or contract that called the plugin's trigger function.
    /// @param data Budget-specific trigger data, such as a claim proof.
    /// @return amount Available amount in raw token units.
    function available(address caller, bytes calldata data)
        external view returns (uint256 amount);

    /// @notice Builds accounting calls for the DAO.sol contract to execute after the tree succeeds.
    /// @dev Receives the same caller and data as available; actual spend is not supplied.
    function commitActions(address caller, bytes calldata data)
        external view returns (Action[] memory);
}
```

The plugin reads `token()` and `available()`, runs the tree and checks total spend, then requests `commitActions()` with the same caller and data. All three methods are read-only; the [`DAO.sol` contract executes](../execution.md#who-executes-the-calls) the returned accounting calls. A failed commit rolls back the run.

On completion, a Stream budget restarts even if some allocation was retained, while a Merkle budget records the full entitlement processed.

## Choose a budget

| Budget | Availability | Commit |
|---|---|---|
| [Stream](./stream.md) | Grows over time, bounded by funding and an optional cap | Restart from zero |
| [Balance](./balance.md) | Current token balance | No calls |
| [Merkle Claim](./merkle-claim.md) | Caller's remaining cumulative entitlement | Record the claim |

[Stream](./stream.md#checkpoint-interface) also exposes a checkpoint interface for restarting availability. See [Execution](../execution.md) for allocation checks and [component setup](../../../guides/compose-capital-tree.md#component-initialization-and-permissions) for initialization and commit permissions.
