---
type: reference
title: Executor
kind: contract
source: osx/src/common/executors/Executor.sol
summary: "Simple Executor that loops through the actions and executes them."
---

# Executor

**Contract** · [`src/common/executors/Executor.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/executors/Executor.sol)

**Explained in:** [Actions and execution](../../core/execution.md)

**IDAO**

**Author:** Aragon X - 2024

**Inherits:** [`IExecutor`](./IExecutor.md), `ERC165`

Simple Executor that loops through the actions and executes them.

> **Dev:** This doesn't use any type of permission for execution and can be called by anyone.
> Most useful use-case is to deploy it as non-upgradeable and call from another contract via delegatecall.
> If used with delegatecall, DO NOT add state variables in sequential slots, otherwise this will overwrite
> the storage of the calling contract.

**security-contact:** sirt@aragon.org

## Constructor

### constructor

```solidity
constructor()
```

Initializes the contract with a non-entered reentrancy status.

> **Dev:** Sets the reentrancy guard status to `_NOT_ENTERED` to prevent reentrant calls from the start.

## Functions

### execute

```solidity
function execute(
    bytes32 _callId,
    Action[] _actions,
    uint256 _allowFailureMap
) external returns (bytes[] execResults, uint256 failureMap)
```

Selector: `0xc71bf324`

Executes a list of actions. If a zero allow-failure map is provided, a failing action reverts the entire execution. If a non-zero allow-failure map is provided, allowed actions can fail without the entire call being reverted.

| Parameter | Type | Description |
| --- | --- | --- |
| `_callId` | `bytes32` | The ID of the call. The definition of the value of `callId` is up to the calling contract and can be used, e.g., as a nonce. |
| `_actions` | `Action[]` | The array of actions. |
| `_allowFailureMap` | `uint256` | A bitmap allowing execution to succeed, even if individual actions might revert. If the bit at index `i` is 1, the execution succeeds even if the `i`th action reverts. A failure map value of 0 requires every action to not revert. |

| Returns | Type | Description |
| --- | --- | --- |
| `execResults` | `bytes[]` | The array of results obtained from the executed actions in `bytes`. |
| `failureMap` | `uint256` | The resulting failure map containing the actions have actually failed. |

### supportsInterface

```solidity
function supportsInterface(bytes4 _interfaceId) external view returns (bool)
```

Selector: `0x01ffc9a7`

Checks if this or the parent contract supports an interface by its ID.

| Parameter | Type | Description |
| --- | --- | --- |
| `_interfaceId` | `bytes4` | The ID of the interface. |

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

## Errors

### ActionFailed

```solidity
error ActionFailed(uint256 index)
```

Thrown if action execution has failed.

| Parameter | Type | Description |
| --- | --- | --- |
| `index` | `uint256` | The index of the action in the action array that failed. |

### InsufficientGas

```solidity
error InsufficientGas()
```

Thrown if an action has insufficient gas left.

### ReentrantCall

```solidity
error ReentrantCall()
```

Thrown if a call is reentrant.

### TooManyActions

```solidity
error TooManyActions()
```

Thrown if the action array length is larger than `MAX_ACTIONS`.
