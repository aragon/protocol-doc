---
type: reference
title: _uncheckedSub
kind: function
source: osx/src/common/utils/math/UncheckedMath.sol
summary: "Subtracts two unsigned integers without checking the result for overflow errors (using safe math)."
---

# _uncheckedSub

**Function** · [`src/common/utils/math/UncheckedMath.sol`](https://github.com/aragon/osx/blob/2c60f1252558d75fe99c414ccd2b1aedbde88f12/src/common/utils/math/UncheckedMath.sol)

```solidity
function _uncheckedSub(uint256 a, uint256 b) pure returns (uint256)
```

Subtracts two unsigned integers without checking the result for overflow errors (using safe math).

**security-contact:** sirt@aragon.org

| Parameter | Type | Description |
| --- | --- | --- |
| `a` | `uint256` | The minuend. |
| `b` | `uint256` | The subtrahend. |
