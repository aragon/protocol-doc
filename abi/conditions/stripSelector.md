---
type: reference
title: stripSelector
kind: function
source: conditions/src/lib/common.sol
summary: "Strips the first 4 bytes selector."
---

# stripSelector

**Function** · [`src/lib/common.sol`](https://github.com/aragon/conditions/blob/7198a02ae1e62f3297416feeca64159bf69802c7/src/lib/common.sol)

**Explained in:** [Condition Library](../../helpers/condition-library.md), [ExecuteSelectorCrossChainCondition](../../helpers/condition-library/execute-selector-crosschain-condition.md)

```solidity
function stripSelector(bytes memory data) pure returns (bytes memory)
```

> **Dev:** Strips the first 4 bytes selector.
