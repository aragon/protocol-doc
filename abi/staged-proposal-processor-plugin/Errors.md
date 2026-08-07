---
type: reference
title: Errors
kind: library
source: staged-proposal-processor-plugin/src/libraries/Errors.sol
summary: "Library containing all custom errors the plugin may revert with."
---

# Errors

**Library** · [`src/libraries/Errors.sol`](https://github.com/aragon/staged-proposal-processor-plugin/blob/96b83dd5da22930e8d9bcc211cf4e57aaf5270f2/src/libraries/Errors.sol)

**Explained in:** [Staged Proposal Processor (SPP)](../../plugins/spp-plugin.md)

**Author:** Aragon X - 2024

Library containing all custom errors the plugin may revert with.

## Errors

### BodyResultTypeNotSet

```solidity
error BodyResultTypeNotSet(address body)
```

Thrown if the body result type is not set.

| Parameter | Type | Description |
| --- | --- | --- |
| `body` | `address` | The address of the body. |

### DuplicateBodyAddress

```solidity
error DuplicateBodyAddress(uint256 stageId, address body)
```

Thrown if a body address is duplicated in the same stage.

| Parameter | Type | Description |
| --- | --- | --- |
| `stageId` | `uint256` | The stage id that contains the duplicated body address. |
| `body` | `address` | The address that is duplicated in `stageId`. |

### EmptyMetadata

```solidity
error EmptyMetadata()
```

Thrown when the metadata is empty.

### IncorrectActionCount

```solidity
error IncorrectActionCount()
```

Thrown when trusted forwarder can not execute the actions.

### InsufficientGas

```solidity
error InsufficientGas()
```

### InterfaceNotSupported

```solidity
error InterfaceNotSupported()
```

Thrown when a body doesn't support IProposal interface.

### InvalidCustomParamsForFirstStage

```solidity
error InvalidCustomParamsForFirstStage()
```

Thrown if first stage's params don't match the count of the current first stage's bodies' count.

### NonexistentProposal

```solidity
error NonexistentProposal(uint256 proposalId)
```

Thrown when a proposal doesn't exist.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal which doesn't exist. |

### ProposalAdvanceForbidden

```solidity
error ProposalAdvanceForbidden(uint256 proposalId)
```

Thrown if the proposal advance is forbidden.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal. |

### ProposalAlreadyCancelled

```solidity
error ProposalAlreadyCancelled(uint256 proposalId)
```

Thrown if the proposal has already been cancelled.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The id of the proposal. |

### ProposalAlreadyExists

```solidity
error ProposalAlreadyExists(uint256 proposalId)
```

Thrown if the proposal with same actions and metadata already exists.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The id of the proposal. |

### ProposalCanNotBeCancelled

```solidity
error ProposalCanNotBeCancelled(uint256 proposalId, uint16 stageId)
```

Thrown if the proposal is not cancelable in the `stageId`.

### ProposalCanNotBeEdited

```solidity
error ProposalCanNotBeEdited(uint256 proposalId, uint16 stageId)
```

Thrown if the proposal is not editable.

> **Dev:** This can happen in 2 cases:
> either Proposal can not yet be advanced or,
> The stage has `editable:false` in the configuration.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The id of the proposal. |
| `stageId` | `uint16` |  |

### ProposalExecutionForbidden

```solidity
error ProposalExecutionForbidden(uint256 proposalId)
```

Thrown if the proposal execution is forbidden.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal. |

### StageCountZero

```solidity
error StageCountZero()
```

Thrown when the stages length is zero.

### StageDurationsInvalid

```solidity
error StageDurationsInvalid()
```

Thrown if stage durations are invalid.

### StageIdInvalid

```solidity
error StageIdInvalid(uint64 currentStageId, uint64 reportedStageId)
```

Thrown when the body tries to submit report for the stage id that has not yet become active.

| Parameter | Type | Description |
| --- | --- | --- |
| `currentStageId` | `uint64` | The stage id that proposal is currently at. |
| `reportedStageId` | `uint64` | The stage id for which the report is being submitted. |

### StageThresholdsInvalid

```solidity
error StageThresholdsInvalid()
```

Thrown if the thresholds are invalid.

### StartDateInvalid

```solidity
error StartDateInvalid(uint64)
```

Thrown if the start date is less than current timestamp.

### Uint16MaxSizeExceeded

```solidity
error Uint16MaxSizeExceeded()
```

Thrown if `_proposalParams`'s length exceeds `type(uint16).max`.

### UnexpectedProposalState

```solidity
error UnexpectedProposalState(uint256 proposalId, uint8 currentState, bytes32 allowedStates)
```

Thrown if the proposal's state doesn't match the allowed state.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The id of the proposal. |
| `currentState` | `uint8` | The current state of the proposal. |
| `allowedStates` | `bytes32` | The allowed state that must match the `currentState`, otherwise the error is thrown. |
