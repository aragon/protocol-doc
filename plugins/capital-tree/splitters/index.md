# Splitters

Use a splitter to send a [node's output](../execution.md#inputs-and-outputs) down multiple branches. For example, split purchased tokens between retention and donation. The shares apply to this flow's proceeds, rather than the treasury's whole balance; each [child action](../concepts.md#nodes-define-the-structure) uses its assigned share.

## Core concepts

- **Output:** the [`Asset`](../execution.md#inputs-and-outputs) being divided: a token and an amount.
- **Child order:** returned amounts follow the configured child indexes.
- **Child count:** a splitter supports a fixed count or any count. Only nodes with two or more children use one.

## The splitter interface

[`ISplitter`](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/interfaces/ISplitter.sol) is read-only:

```solidity
interface ISplitter {
    /// @notice Divides the parent's output without moving funds.
    /// @param caller The trigger caller, available for caller-dependent rules.
    /// @return amounts One amount per child, in child order, summing to output.amount.
    function split(address caller, Asset calldata output, uint256 childCount)
        external view returns (uint256[] memory amounts);

    /// @return A fixed child count, or zero for any count.
    function childCount() external view returns (uint256);
}
```

`childCount()` is checked when configuring the tree; zero means any count. `split()` runs after the parent's output is established and before its children execute. `caller` is the [trigger caller](../concepts.md#a-trigger-runs-the-flow).

Splitting assigns amounts without moving funds. Returned amounts must sum to `output.amount`. For small outputs, a share may round to zero: that child reverts unless [`skipWhenEmpty`](../execution.md#inputs-and-outputs) allows its subtree to be skipped.

## Choose a splitter

[Weight Splitter](./weight.md) is the supplied implementation, with fixed weights and explicit rounding. Custom caps, top-ups or changing shares need a new implementation behind the same interface. See [composing flows](../../../guides/compose-capital-tree.md) for how registered implementations become recipe components.
