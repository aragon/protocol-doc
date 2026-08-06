---
title: getSelector
kind: function
source: src/lib/common.sol
summary: "Extracts the selector given the calldata."
---

# getSelector

**Function** · [`src/lib/common.sol`](https://github.com/aragon/conditions/blob/33918b06b95233dd8890bef6cc60da6227fa5af1/src/lib/common.sol)

```solidity
function getSelector(bytes memory _data) pure returns (bytes4 selector)
```

Extracts the selector given the calldata. If no calldata is passed, it returns zero
