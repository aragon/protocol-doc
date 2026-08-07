---
type: reference
title: CallbackHandler
kind: abstract contract
source: osx/src/core/utils/CallbackHandler.sol
summary: "This contract handles callbacks by registering a magic number together with the callback function's selector."
---

# CallbackHandler

**Abstract contract** · [`src/core/utils/CallbackHandler.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/core/utils/CallbackHandler.sol)

**Explained in:** [The DAO contract](../../core/dao.md)

**Author:** Aragon X - 2022-2023

This contract handles callbacks by registering a magic number together with the callback function's selector. It provides the `_handleCallback` function that inheriting contracts have to call inside their `fallback()` function (`_handleCallback(msg.callbackSelector, msg.data)`). This allows to adaptively register ERC standards (e.g., [ERC-721](https://eips.ethereum.org/EIPS/eip-721), [ERC-1115](https://eips.ethereum.org/EIPS/eip-1155), or future versions of [ERC-165](https://eips.ethereum.org/EIPS/eip-165)) and returning the required magic numbers for the associated callback functions for the inheriting contract so that it doesn't need to be upgraded.

> **Dev:** This callback handling functionality is intended to be used by executor contracts (i.e., `DAO.sol`).

**security-contact:** sirt@aragon.org

## Events

### CallbackReceived

```solidity
event CallbackReceived(address sender, bytes4 indexed sig, bytes data)
```

Emitted when `_handleCallback` is called.

| Parameter | Type | Description |
| --- | --- | --- |
| `sender` | `address` | Who called the callback. |
| `sig` | `bytes4` | The function signature. |
| `data` | `bytes` | The calldata. |

## Errors

### UnknownCallback

```solidity
error UnknownCallback(bytes4 callbackSelector, bytes4 magicNumber)
```

Thrown if the callback function is not registered.

| Parameter | Type | Description |
| --- | --- | --- |
| `callbackSelector` | `bytes4` | The selector of the callback function. |
| `magicNumber` | `bytes4` | The magic number to be registered for the callback function selector. |
