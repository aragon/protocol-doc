---
title: _applyRatioCeiled
kind: function
source: src/common/utils/math/Ratio.sol
summary: "Applies a ratio to a value and ceils the remainder."
---

# _applyRatioCeiled

**Function** · [`src/common/utils/math/Ratio.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/utils/math/Ratio.sol)

```solidity
function _applyRatioCeiled(uint256 _value, uint256 _ratio) pure returns (uint256 result)
```

Applies a ratio to a value and ceils the remainder.

**security-contact:** sirt@aragon.org

| Parameter | Type | Description |
| --- | --- | --- |
| `_value` | `uint256` | The value to which the ratio is applied. |
| `_ratio` | `uint256` | The ratio that must be in the interval `[0, 10**6]`. |

| Returns | Type | Description |
| --- | --- | --- |
| `result` | `uint256` | The resulting value. |
