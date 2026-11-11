---
type: reference
title: RatioOutOfBounds
kind: error
source: osx/src/common/utils/math/Ratio.sol
summary: "Thrown if a ratio value exceeds the maximal value of `10**6`."
---

# RatioOutOfBounds

**Error** · [`src/common/utils/math/Ratio.sol`](https://github.com/aragon/osx/blob/2c60f1252558d75fe99c414ccd2b1aedbde88f12/src/common/utils/math/Ratio.sol)

**Explained in:** [Ratio (threshold math)](../../common/ratio.md)

```solidity
error RatioOutOfBounds(uint256 limit, uint256 actual);
```

Thrown if a ratio value exceeds the maximal value of `10**6`.

| Parameter | Type | Description |
| --- | --- | --- |
| `limit` | `uint256` | The maximal value. |
| `actual` | `uint256` | The actual value. |
