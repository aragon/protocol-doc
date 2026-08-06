---
title: RatioOutOfBounds
kind: error
source: src/common/utils/math/Ratio.sol
summary: "Thrown if a ratio value exceeds the maximal value of `10**6`."
---

# RatioOutOfBounds

**Error** · [`src/common/utils/math/Ratio.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/utils/math/Ratio.sol)

```solidity
error RatioOutOfBounds(uint256 limit, uint256 actual);
```

Thrown if a ratio value exceeds the maximal value of `10**6`.

| Parameter | Type | Description |
| --- | --- | --- |
| `limit` | `uint256` | The maximal value. |
| `actual` | `uint256` | The actual value. |
