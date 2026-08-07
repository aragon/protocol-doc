---
type: reference
title: _uncheckedAdd
kind: function
source: osx/src/common/utils/math/UncheckedMath.sol
summary: "Adds two unsigned integers without checking the result for overflow errors (using safe math)."
---

# _uncheckedAdd

**Function** · [`src/common/utils/math/UncheckedMath.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/utils/math/UncheckedMath.sol)

```solidity
function _uncheckedAdd(uint256 a, uint256 b) pure returns (uint256)
```

Adds two unsigned integers without checking the result for overflow errors (using safe math).

**security-contact:** sirt@aragon.org

| Parameter | Type | Description |
| --- | --- | --- |
| `a` | `uint256` | The first summand. |
| `b` | `uint256` | The second summand. |
