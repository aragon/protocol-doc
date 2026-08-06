---
title: IExecutor
kind: interface
source: src/common/executors/IExecutor.sol
summary: "The interface required for Executors within the Aragon App DAO framework."
---

# IExecutor

**Interface** · [`src/common/executors/IExecutor.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/executors/IExecutor.sol)

**Author:** Aragon X - 2024

The interface required for Executors within the Aragon App DAO framework.

**security-contact:** sirt@aragon.org

## Functions

### execute

```solidity
function execute(
    bytes32 _callId,
    Action[] _actions,
    uint256 _allowFailureMap
) external returns (bytes[], uint256)
```

Selector: `0xc71bf324`

Executes a list of actions. If a zero allow-failure map is provided, a failing action reverts the entire execution. If a non-zero allow-failure map is provided, allowed actions can fail without the entire call being reverted.

| Parameter | Type | Description |
| --- | --- | --- |
| `_callId` | `bytes32` | The ID of the call. The definition of the value of `callId` is up to the calling contract and can be used, e.g., as a nonce. |
| `_actions` | `Action[]` | The array of actions. |
| `_allowFailureMap` | `uint256` | A bitmap allowing execution to succeed, even if individual actions might revert. If the bit at index `i` is 1, the execution succeeds even if the `i`th action reverts. A failure map value of 0 requires every action to not revert. |

## Events

### Executed

```solidity
event Executed(
    address indexed actor,
    bytes32 callId,
    Action[] actions,
    uint256 allowFailureMap,
    uint256 failureMap,
    bytes[] execResults
)
```

Emitted when a proposal is executed.

> **Dev:** The value of `callId` is defined by the component/contract calling the execute function.
> A `Plugin` implementation can use it, for example, as a nonce.

| Parameter | Type | Description |
| --- | --- | --- |
| `actor` | `address` | The address of the caller. |
| `callId` | `bytes32` | The ID of the call. |
| `actions` | `Action[]` | The array of actions executed. |
| `allowFailureMap` | `uint256` | The allow failure map encoding which actions are allowed to fail. |
| `failureMap` | `uint256` | The failure map encoding which actions have failed. |
| `execResults` | `bytes[]` | The array with the results of the executed actions. |
