---
type: reference
title: getSelector
kind: function
source: conditions/src/lib/common.sol
summary: "Extracts the selector given the calldata."
---

# getSelector

**Function** · [`src/lib/common.sol`](https://github.com/aragon/conditions/blob/7198a02ae1e62f3297416feeca64159bf69802c7/src/lib/common.sol)

**Explained in:** [Condition Library](../../helpers/condition-library.md), [ExecuteSelectorCrossChainCondition](../../helpers/condition-library/execute-selector-crosschain-condition.md)

```solidity
function getSelector(bytes memory _data) pure returns (bytes4 selector)
```

Extracts the selector given the calldata. If no calldata is passed, it returns zero
