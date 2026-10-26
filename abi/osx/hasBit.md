---
type: reference
title: hasBit
kind: function
source: osx/src/common/utils/math/BitMap.sol
summary: ""
---

# hasBit

**Function** · [`src/common/utils/math/BitMap.sol`](https://github.com/aragon/osx/blob/2c60f1252558d75fe99c414ccd2b1aedbde88f12/src/common/utils/math/BitMap.sol)

**Explained in:** [Actions and execution](../../core/execution.md)

```solidity
function hasBit(uint256 bitmap, uint8 index) pure returns (bool)
```

**security-contact:** sirt@aragon.org

| Parameter | Type | Description |
| --- | --- | --- |
| `bitmap` | `uint256` | The `uint256` representation of bits. |
| `index` | `uint8` | The index number to check whether 1 or 0 is set. |
