---
type: reference
title: ICrossChainController
kind: interface
source: conditions/src/ExecuteSelectorCrossChainCondition.sol
summary: ""
---

# ICrossChainController

**Interface** · [`src/ExecuteSelectorCrossChainCondition.sol`](https://github.com/aragon/conditions/blob/7198a02ae1e62f3297416feeca64159bf69802c7/src/ExecuteSelectorCrossChainCondition.sol)

**Explained in:** [ExecuteSelectorCrossChainCondition](../../helpers/condition-library/execute-selector-crosschain-condition.md)

## Functions

### forwardMessage

```solidity
function forwardMessage(
    uint256 _destinationChainId,
    uint256 _gasLimit,
    bytes _message
) external returns (bytes32 txId)
```

Selector: `0x9942eeb4`

### receiveMessage

```solidity
function receiveMessage(
    uint256 _messageId,
    bytes _encodedTx,
    uint256 _originChainId
) external returns (bytes32 txId)
```

Selector: `0xdec41274`

### retryMessage

```solidity
function retryMessage(bytes _encodedTx) external
```

Selector: `0x705f0b9e`
