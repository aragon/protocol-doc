---
type: reference
title: IProposal
kind: interface
source: osx/src/common/plugin/extensions/proposal/IProposal.sol
summary: "An interface to be implemented by DAO plugins that create and execute proposals."
---

# IProposal

**Interface** · [`src/common/plugin/extensions/proposal/IProposal.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/plugin/extensions/proposal/IProposal.sol)

**Explained in:** [Proposals](../../common/proposal.md)

**Author:** Aragon X - 2022-2024

An interface to be implemented by DAO plugins that create and execute proposals.

**security-contact:** sirt@aragon.org

## Functions

### canExecute

```solidity
function canExecute(uint256 _proposalId) external view returns (bool)
```

Selector: `0xcc63604a`

Checks if a proposal can be executed.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal to be checked. |

### createProposal

```solidity
function createProposal(
    bytes _metadata,
    Action[] _actions,
    uint64 _startDate,
    uint64 _endDate,
    bytes _data
) external returns (uint256 proposalId)
```

Selector: `0xea65ab82`

Creates a new proposal.

| Parameter | Type | Description |
| --- | --- | --- |
| `_metadata` | `bytes` | The metadata of the proposal. |
| `_actions` | `Action[]` | The actions that will be executed after the proposal passes. |
| `_startDate` | `uint64` | The start date of the proposal. |
| `_endDate` | `uint64` | The end date of the proposal. |
| `_data` | `bytes` | The additional abi-encoded data to include more necessary fields. |

| Returns | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The id of the proposal. |

### customProposalParamsABI

```solidity
function customProposalParamsABI() external view returns (string)
```

Selector: `0x3d3f4b1b`

The human-readable abi format for extra params included in `data` of `createProposal`.

> **Dev:** Used for UI to easily detect what extra params the contract expects.

### execute

```solidity
function execute(uint256 _proposalId) external
```

Selector: `0xfe0d94c1`

Executes a proposal.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal to be executed. |

### hasSucceeded

```solidity
function hasSucceeded(uint256 _proposalId) external view returns (bool)
```

Selector: `0xc218c132`

Whether proposal succeeded or not.

> **Dev:** Note that this must not include time window checks and only make a decision based on the thresholds.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The id of the proposal. |

### proposalCount

```solidity
function proposalCount() external view returns (uint256)
```

Selector: `0xda35c664`

Returns the proposal count which determines the next proposal ID.

> **Dev:** This function is deprecated but remains in the interface for backward compatibility.
> It now reverts to prevent ambiguity.

## Events

### ProposalCreated

```solidity
event ProposalCreated(
    uint256 indexed proposalId,
    address indexed creator,
    uint64 startDate,
    uint64 endDate,
    bytes metadata,
    Action[] actions,
    uint256 allowFailureMap
)
```

Emitted when a proposal is created.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal. |
| `creator` | `address` | The creator of the proposal. |
| `startDate` | `uint64` | The start date of the proposal in seconds. |
| `endDate` | `uint64` | The end date of the proposal in seconds. |
| `metadata` | `bytes` | The metadata of the proposal. |
| `actions` | `Action[]` | The actions that will be executed if the proposal passes. |
| `allowFailureMap` | `uint256` | A bitmap allowing the proposal to succeed, even if individual actions might revert. If the bit at index `i` is 1, the proposal succeeds even if the `i`th action reverts. A failure map value of 0 requires every action to not revert. |

### ProposalExecuted

```solidity
event ProposalExecuted(uint256 indexed proposalId)
```

Emitted when a proposal is executed.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal. |
