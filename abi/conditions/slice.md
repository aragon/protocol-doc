---
type: reference
title: slice
kind: function
source: conditions/src/lib/common.sol
summary: "Copies the content of `buffer`, from `start` (included) to `end` (excluded) into a new bytes object in memory."
---

# slice

**Function** · [`src/lib/common.sol`](https://github.com/aragon/conditions/blob/7198a02ae1e62f3297416feeca64159bf69802c7/src/lib/common.sol)

**Explained in:** [Condition Library](../../helpers/condition-library.md), [ExecuteSelectorCrossChainCondition](../../helpers/condition-library/execute-selector-crosschain-condition.md)

```solidity
function slice(bytes memory buffer, uint256 start, uint256 end) pure returns (bytes memory)
```

Copies the content of `buffer`, from `start` (included) to
`end` (excluded) into a new bytes object in memory.
The `end` argument is truncated to the length of the `buffer`.

> **Dev:** This doesn't modify the original `buffer` argument.
