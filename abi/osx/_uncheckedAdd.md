---
type: reference
title: _uncheckedAdd
kind: function
source: osx/src/common/utils/math/UncheckedMath.sol
summary: "Adds two unsigned integers without checking the result for overflow errors (using safe math)."
---

# _uncheckedAdd

**Function** · [`src/common/utils/math/UncheckedMath.sol`](https://github.com/aragon/osx/blob/2c60f1252558d75fe99c414ccd2b1aedbde88f12/src/common/utils/math/UncheckedMath.sol)

```solidity
function _uncheckedAdd(uint256 a, uint256 b) pure returns (uint256)
```

Adds two unsigned integers without checking the result for overflow errors (using safe math).

**security-contact:** sirt@aragon.org

| Parameter | Type | Description |
| --- | --- | --- |
| `a` | `uint256` | The first summand. |
| `b` | `uint256` | The second summand. |
