---
type: reference
title: StagedProposalProcessor
kind: contract
source: staged-proposal-processor-plugin/src/StagedProposalProcessor.sol
summary: "A multi-stage proposal processor where proposals progress through defined stages."
---

# StagedProposalProcessor

**Contract** · [`src/StagedProposalProcessor.sol`](https://github.com/aragon/staged-proposal-processor-plugin/blob/96b83dd5da22930e8d9bcc211cf4e57aaf5270f2/src/StagedProposalProcessor.sol)

**Explained in:** [Composing SPP bodies](../../plugins/spp-plugin/composing-bodies.md), [SPP lifecycle & state machine](../../plugins/spp-plugin/lifecycle.md), [SPP stages & bodies](../../plugins/spp-plugin/stages-and-bodies.md), [Staged Proposal Processor (SPP)](../../plugins/spp-plugin.md)

**Author:** Aragon X - 2024

**Inherits:** `ProposalUpgradeable`, `MetadataExtensionUpgradeable`, `PluginUUPSUpgradeable`

A multi-stage proposal processor where proposals progress through defined stages.
Each stage is evaluated by the responsible bodies, determining whether the proposal advances
to the next stage. Once a proposal successfully passes all stages, it can be executed.

## Functions

### advanceProposal

```solidity
function advanceProposal(uint256 _proposalId) external
```

Selector: `0xfdbd7eb3`

Advances the specified proposal to the next stage if allowed.

> **Dev:** This function checks whether the proposal exists and can advance based on its current state.
> If the proposal is in the final stage, the caller must have the
> `EXECUTE_PERMISSION_ID` permission to execute it.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |

### cancel

```solidity
function cancel(uint256 _proposalId) external
```

Selector: `0x40e58ee5`

Cancels the proposal.

> **Dev:** The proposal can be canceled only if it's allowed in the stage configuration.
> The caller must have the `CANCEL_PERMISSION_ID` permission to cancel it.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The id of the proposal. |

### canExecute

```solidity
function canExecute(uint256 _proposalId) external view returns (bool)
```

Selector: `0xcc63604a`

Checks if a proposal can be executed.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal to be checked. |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | True if the proposal can be executed, false otherwise. |

### canProposalAdvance

```solidity
function canProposalAdvance(uint256 _proposalId) external view returns (bool)
```

Selector: `0x5c23bfb7`

Determines whether the specified proposal can be advanced to the next stage.

> **Dev:** Reverts if the proposal with the given `_proposalId` does not exist.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The unique identifier of the proposal to check. |

### createProposal(bytes,(address,uint256,bytes)[],uint128,uint64,bytes[][])

```solidity
function createProposal(
    bytes _metadata,
    Action[] _actions,
    uint128 _allowFailureMap,
    uint64 _startDate,
    bytes[][] _proposalParams
) external returns (uint256 proposalId)
```

Selector: `0x35ade049`

Creates a new proposal in this `StagedProposalProcessor` plugin.

> **Dev:** Requires the caller to have the `CREATE_PROPOSAL_PERMISSION_ID` permission.
> Also creates proposals for non-manual bodies in the first stage of the proposal process.

| Parameter | Type | Description |
| --- | --- | --- |
| `_metadata` | `bytes` | The metadata of the proposal. |
| `_actions` | `Action[]` | The actions that will be executed after the proposal passes. |
| `_allowFailureMap` | `uint128` | Allows proposal to succeed even if an action reverts. Uses bitmap representation. If the bit at index `x` is 1, the tx succeeds even if the action at `x` failed. Passing 0 will be treated as atomic execution. |
| `_startDate` | `uint64` | The date at which first stage's bodies' proposals must be started at. |
| `_proposalParams` | `bytes[][]` | The extra abi encoded parameters for each sub-body's createProposal function. |

| Returns | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal. |

### createProposal(bytes,(address,uint256,bytes)[],uint64,uint64,bytes)

```solidity
function createProposal(
    bytes _metadata,
    Action[] _actions,
    uint64 _startDate,
    uint64,
    bytes _data
) external returns (uint256 proposalId)
```

Selector: `0xea65ab82`

Creates a new proposal.

> **Dev:** Calls a public function that requires the `CREATE_PERMISSION_ID` permission.

| Parameter | Type | Description |
| --- | --- | --- |
| `_metadata` | `bytes` | The metadata of the proposal. |
| `_actions` | `Action[]` | The actions that will be executed after the proposal passes. |
| `_startDate` | `uint64` | The start date of the proposal. |
| `[3]` | `uint64` |  |
| `_data` | `bytes` | The additional abi-encoded data to include more necessary fields. |

| Returns | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The id of the proposal. |

### customProposalParamsABI

```solidity
function customProposalParamsABI() external pure returns (string)
```

Selector: `0x3d3f4b1b`

The human-readable abi format for extra params included in `data` of `createProposal`.

> **Dev:** This plugin inherits from `IProposal`, requiring an override for this function.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `string` | ABI of params in `data` of `createProposal`. |

### dao

```solidity
function dao() external view returns (IDAO)
```

Selector: `0x4162169f`

Returns the DAO contract.

### edit

```solidity
function edit(uint256 _proposalId, bytes _metadata, Action[] _actions) external
```

Selector: `0x0b47808d`

Edits the proposal.

> **Dev:** The proposal can be editable only if it's allowed in the stage configuration.
> The caller must have the `EDIT_PERMISSION_ID` permission to edit
> and stage must be advanceable.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The id of the proposal. |
| `_metadata` | `bytes` | The metadata of the proposal. |
| `_actions` | `Action[]` | The actions that will be executed after the proposal passes. |

### execute

```solidity
function execute(uint256 _proposalId) external
```

Selector: `0xfe0d94c1`

Executes a proposal.

> **Dev:** Requires the `EXECUTE_PERMISSION_ID` permission.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal to be executed. |

### getBodyProposalId

```solidity
function getBodyProposalId(
    uint256 _proposalId,
    uint16 _stageId,
    address _body
) external view returns (uint256)
```

Selector: `0x1c622dea`

Retrieves the sub proposal id.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |
| `_stageId` | `uint16` | The stage index. |
| `_body` | `address` | The address of the sub-body. |

### getBodyResult

```solidity
function getBodyResult(
    uint256 _proposalId,
    uint16 _stageId,
    address _body
) external view returns (StagedProposalProcessor.ResultType)
```

Selector: `0x761f8acb`

Retrieves the result type submitted by a body for a specific proposal and stage.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |
| `_stageId` | `uint16` | The stage index. |
| `_body` | `address` | The address of the sub-body. |

### getCreateProposalParams

```solidity
function getCreateProposalParams(
    uint256 _proposalId,
    uint16 _stageId,
    uint256 _index
) external view returns (bytes)
```

Selector: `0x1f3cb5b4`

Retrieves the `data` parameter encoded for a sub-body's `createProposal` function in a specific stage.
Excludes sub-bodies from the first stage, as their parameters are not stored for efficiency.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |
| `_stageId` | `uint16` | The stage index. |
| `_index` | `uint256` | The index of the body within the stage. |

### getCurrentConfigIndex

```solidity
function getCurrentConfigIndex() external view returns (uint16)
```

Selector: `0x1abf3f11`

Retrieves the current configuration index at which the current configurations of stages are stored.

### getCurrentTargetConfig

```solidity
function getCurrentTargetConfig() external view returns (IPlugin.TargetConfig)
```

Selector: `0xc98425ee`

Returns the currently set target contract.

### getMetadata

```solidity
function getMetadata() external view returns (bytes)
```

Selector: `0x7a5b4f59`

Returns the metadata currently applied.

### getProposal

```solidity
function getProposal(
    uint256 _proposalId
) external view returns (StagedProposalProcessor.Proposal)
```

Selector: `0xc7f758a8`

Retrieves all information associated with a proposal by its ID.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |

### getProposalTally

```solidity
function getProposalTally(
    uint256 _proposalId,
    uint16 _stageId
) external view returns (uint256 approvals, uint256 vetoes)
```

Selector: `0x4e3ed5e9`

Calculates and retrieves the number of approvals and vetoes for a proposal on the stage.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The proposal ID. |
| `_stageId` | `uint16` | The stage index. |

| Returns | Type | Description |
| --- | --- | --- |
| `approvals` | `uint256` | The total number of approvals for the proposal. |
| `vetoes` | `uint256` | The total number of vetoes for the proposal. |

### getStages

```solidity
function getStages(uint256 _index) external view returns (StagedProposalProcessor.Stage[])
```

Selector: `0xef8cccb0`

Retrieves the stages stored on the `_index` in the `stages` configuration.

| Parameter | Type | Description |
| --- | --- | --- |
| `_index` | `uint256` | The index from which to get the stages configuration. |

### getTargetConfig

```solidity
function getTargetConfig() external view returns (IPlugin.TargetConfig)
```

Selector: `0xdd63c06f`

A convenient function to get current target config only if its target is not address(0), otherwise dao().

### getTrustedForwarder

```solidity
function getTrustedForwarder() external view returns (address)
```

Selector: `0xce1b815f`

Retrieves the address of the trusted forwarder.

### hasAdvancePermission

```solidity
function hasAdvancePermission(address _account) external view returns (bool)
```

Selector: `0x7e3f1353`

Checks whether the caller has the required permission to advance a proposal.

| Parameter | Type | Description |
| --- | --- | --- |
| `_account` | `address` | The address on which the `ADVANCE_PERMISSION_ID` is checked. |

### hasExecutePermission

```solidity
function hasExecutePermission(address _account) external view returns (bool)
```

Selector: `0xfd8d2d36`

Checks whether the caller has the required permission to execute a proposal at the last stage.

| Parameter | Type | Description |
| --- | --- | --- |
| `_account` | `address` | The address on which the `EXECUTE_PERMISSION_ID` is checked. |

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

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | Returns if proposal has been succeeded or not without including time window checks. |

### implementation

```solidity
function implementation() external view returns (address)
```

Selector: `0x5c60da1b`

Returns the address of the implementation contract in the [proxy storage slot](https://eips.ethereum.org/EIPS/eip-1967) slot the [UUPS proxy](https://eips.ethereum.org/EIPS/eip-1822) is pointing to.

### initialize

```solidity
function initialize(
    IDAO _dao,
    address _trustedForwarder,
    StagedProposalProcessor.Stage[] _stages,
    bytes _pluginMetadata,
    IPlugin.TargetConfig _targetConfig
) external
```

Selector: `0xbfde57c3`

Initializes the component.

> **Dev:** This method is required to support [ERC-1822](https://eips.ethereum.org/EIPS/eip-1822).

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `IDAO` | The IDAO interface of the associated DAO. |
| `_trustedForwarder` | `address` | The trusted forwarder responsible for extracting the original sender. |
| `_stages` | `StagedProposalProcessor.Stage[]` | The stages configuration. |
| `_pluginMetadata` | `bytes` | The utf8 bytes of a content addressing cid that stores plugin's information. |
| `_targetConfig` | `IPlugin.TargetConfig` | The target to which this contract will pass actions with an operation type. |

### isTrustedForwarder

```solidity
function isTrustedForwarder(address _forwarder) external view returns (bool)
```

Selector: `0x572b6c05`

Indicates whether any particular address is the trusted forwarder.

| Parameter | Type | Description |
| --- | --- | --- |
| `_forwarder` | `address` | The address of the Forwarder contract that is being used. |

### pluginType

```solidity
function pluginType() external pure returns (IPlugin.PluginType)
```

Selector: `0x41de6830`

Returns the plugin's type

### proposalCount

```solidity
function proposalCount() external view returns (uint256)
```

Selector: `0xda35c664`

Returns the proposal count which determines the next proposal ID.

> **Dev:** This function is deprecated but remains in the interface for backward compatibility. It now reverts to prevent ambiguity.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `uint256` | The proposal count. |

### protocolVersion

```solidity
function protocolVersion() external pure returns (uint8[3])
```

Selector: `0x2ae9c600`

Returns the semantic Aragon OSx protocol version number that the implementing contract is associated with.

> **Dev:** This version number is not to be confused with the `release` and `build` numbers found in the `Version.Tag` struct inside the `PluginRepo` contract being used to version plugin setup and associated plugin implementation contracts.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `uint8[3]` | Returns the semantic Aragon OSx protocol version number. |

### proxiableUUID

```solidity
function proxiableUUID() external view returns (bytes32)
```

Selector: `0x52d1902d`

> **Dev:** Implementation of the ERC1822 {proxiableUUID} function. This returns the storage slot used by the
> implementation. It is used to validate the implementation's compatibility when performing an upgrade.
> 
> IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks
> bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this
> function revert if invoked through a proxy. This is guaranteed by the `notDelegated` modifier.

### reportProposalResult

```solidity
function reportProposalResult(
    uint256 _proposalId,
    uint16 _stageId,
    StagedProposalProcessor.ResultType _resultType,
    bool _tryAdvance
) external
```

Selector: `0x52303962`

Reports and records the result for a proposal at a specific stage.

> **Dev:** This function can be called by any address even if it is not included in the stage configuration.
> `_canProposalAdvance` function ensures that only records from addresses
> in the stage configuration are used.
> If `_tryAdvance` is true, the proposal will attempt to advance to the next stage if eligible.
> Requires the caller to have the `EXECUTE_PERMISSION_ID` permission to execute the final stage.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |
| `_stageId` | `uint16` | The index of the stage, being reported on. Must not exceed the current stage of the proposal. |
| `_resultType` | `StagedProposalProcessor.ResultType` | The result type being reported (`Approval` or `Veto`). |
| `_tryAdvance` | `bool` | Whether to attempt advancing the proposal to the next stage if conditions are met. |

### setMetadata

```solidity
function setMetadata(bytes _metadata) external
```

Selector: `0xee57e36f`

Allows to update only the metadata.

| Parameter | Type | Description |
| --- | --- | --- |
| `_metadata` | `bytes` | The utf8 bytes of a content addressing cid that stores plugin's information. |

### setTargetConfig

```solidity
function setTargetConfig(IPlugin.TargetConfig _targetConfig) external
```

Selector: `0xbb225da2`

> **Dev:** Sets the target to a new target (`newTarget`).
> The caller must have the `SET_TARGET_CONFIG_PERMISSION_ID` permission.

| Parameter | Type | Description |
| --- | --- | --- |
| `_targetConfig` | `IPlugin.TargetConfig` | The target Config containing the address and operation type. |

### setTrustedForwarder

```solidity
function setTrustedForwarder(address _forwarder) external
```

Selector: `0xda742228`

Sets a new trusted forwarder address.

> **Dev:** Requires the caller to have the `SET_TRUSTED_FORWARDER_PERMISSION_ID` permission.

| Parameter | Type | Description |
| --- | --- | --- |
| `_forwarder` | `address` | The new trusted forwarder address. |

### state

```solidity
function state(
    uint256 _proposalId
) external view returns (StagedProposalProcessor.ProposalState)
```

Selector: `0x3e4f49e6`

Current state of a proposal.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The proposal id. |

### supportsInterface

```solidity
function supportsInterface(bytes4 _interfaceId) external view returns (bool)
```

Selector: `0x01ffc9a7`

Checks if this or the parent contract supports an interface by its ID.

| Parameter | Type | Description |
| --- | --- | --- |
| `_interfaceId` | `bytes4` | The ID of the interface. |

### updateStages

```solidity
function updateStages(StagedProposalProcessor.Stage[] _stages) external
```

Selector: `0x30196ab9`

Allows to update stage configuration.

> **Dev:** Requires the caller to have the `UPDATE_STAGES_PERMISSION_ID` permission.
> Reverts if the provided `_stages` array is empty.

| Parameter | Type | Description |
| --- | --- | --- |
| `_stages` | `StagedProposalProcessor.Stage[]` | The new stage configuration as an array of `Stage` structs. |

### upgradeTo

```solidity
function upgradeTo(address newImplementation) external
```

Selector: `0x3659cfe6`

> **Dev:** Upgrade the implementation of the proxy to `newImplementation`.
> 
> Calls {_authorizeUpgrade}.
> 
> Emits an {Upgraded} event.

**oz-upgrades-unsafe-allow-reachable:** delegatecall

### upgradeToAndCall

```solidity
function upgradeToAndCall(address newImplementation, bytes data) external payable
```

Selector: `0x4f1ef286`

> **Dev:** Upgrade the implementation of the proxy to `newImplementation`, and subsequently execute the function call
> encoded in `data`.
> 
> Calls {_authorizeUpgrade}.
> 
> Emits an {Upgraded} event.

**oz-upgrades-unsafe-allow-reachable:** delegatecall

## Events

### AdminChanged

```solidity
event AdminChanged(address previousAdmin, address newAdmin)
```

> **Dev:** Emitted when the admin account has changed.

### BeaconUpgraded

```solidity
event BeaconUpgraded(address indexed beacon)
```

> **Dev:** Emitted when the beacon is changed.

### Initialized

```solidity
event Initialized(uint8 version)
```

> **Dev:** Triggered when the contract has been initialized or reinitialized.

### MetadataSet

```solidity
event MetadataSet(bytes metadata)
```

Emitted when metadata is updated.

### ProposalAdvanced

```solidity
event ProposalAdvanced(
    uint256 indexed proposalId,
    uint16 indexed stageId,
    address indexed sender
)
```

Emitted when the proposal is advanced to the next stage.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The proposal id. |
| `stageId` | `uint16` | The stage index. |
| `sender` | `address` | The address that advanced the proposal. |

### ProposalCanceled

```solidity
event ProposalCanceled(
    uint256 indexed proposalId,
    uint16 indexed stageId,
    address indexed sender
)
```

Emitted when the proposal gets cancelled.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | the proposal id. |
| `stageId` | `uint16` | The stage index in which the proposal was cancelled. |
| `sender` | `address` | The sender that canceled the proposal. |

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

### ProposalEdited

```solidity
event ProposalEdited(
    uint256 indexed proposalId,
    uint16 indexed stageId,
    address indexed sender,
    bytes metadata,
    Action[] actions
)
```

Emitted when the proposal gets edited.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | the proposal id. |
| `stageId` | `uint16` | The stage index in which the proposal was edited. |
| `sender` | `address` | The sender that edited the proposal. |
| `metadata` | `bytes` | The new metadata that replaces old metadata. |
| `actions` | `Action[]` | The new actions that replaces old actions. |

### ProposalExecuted

```solidity
event ProposalExecuted(uint256 indexed proposalId)
```

Emitted when a proposal is executed.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal. |

### ProposalResultReported

```solidity
event ProposalResultReported(
    uint256 indexed proposalId,
    uint16 indexed stageId,
    address indexed body
)
```

Emitted when a body reports results by calling `reportProposalResult`.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The proposal id. |
| `stageId` | `uint16` | The stage index. |
| `body` | `address` | The sender that reported the result. |

### StagesUpdated

```solidity
event StagesUpdated(StagedProposalProcessor.Stage[] stages)
```

Emitted when the stage configuration is updated for a proposal process.

| Parameter | Type | Description |
| --- | --- | --- |
| `stages` | `StagedProposalProcessor.Stage[]` | The array of `Stage` structs representing the updated stage configuration. |

### SubProposalCreated

```solidity
event SubProposalCreated(
    uint256 indexed proposalId,
    uint16 indexed stageId,
    address indexed body,
    uint256 bodyProposalId
)
```

Emitted when this plugin successfully creates a proposal on sub-body.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The proposal id. |
| `stageId` | `uint16` | The stage index. |
| `body` | `address` | The sub-body on which sub-proposal has been created. |
| `bodyProposalId` | `uint256` | The proposal id that sub-body returns for later usage by this plugin. |

### SubProposalNotCreated

```solidity
event SubProposalNotCreated(
    uint256 indexed proposalId,
    uint16 indexed stageId,
    address indexed body,
    bytes reason
)
```

Emitted when this plugin fails in creating a proposal on sub-body.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The proposal id. |
| `stageId` | `uint16` | The stage index. |
| `body` | `address` | The sub-body on which sub-proposal failed to be created. |
| `reason` | `bytes` | The reason why it was failed. |

### TargetSet

```solidity
event TargetSet(IPlugin.TargetConfig newTargetConfig)
```

Emitted each time the TargetConfig is set.

### TrustedForwarderUpdated

```solidity
event TrustedForwarderUpdated(address indexed forwarder)
```

Emitted when the trusted forwarder is updated.

| Parameter | Type | Description |
| --- | --- | --- |
| `forwarder` | `address` | The new trusted forwarder address. |

### Upgraded

```solidity
event Upgraded(address indexed implementation)
```

> **Dev:** Emitted when the implementation is upgraded.

## Errors

### AlreadyInitialized

```solidity
error AlreadyInitialized()
```

Thrown when initialize is called after it has already been executed.

### BodyResultTypeNotSet

```solidity
error BodyResultTypeNotSet(address body)
```

Thrown if the body result type is not set.

| Parameter | Type | Description |
| --- | --- | --- |
| `body` | `address` | The address of the body. |

### DaoUnauthorized

```solidity
error DaoUnauthorized(address dao, address where, address who, bytes32 permissionId)
```

Thrown if a call is unauthorized in the associated DAO.

| Parameter | Type | Description |
| --- | --- | --- |
| `dao` | `address` | The associated DAO. |
| `where` | `address` | The context in which the authorization reverted. |
| `who` | `address` | The address (EOA or contract) missing the permission. |
| `permissionId` | `bytes32` | The permission identifier. |

### DelegateCallFailed

```solidity
error DelegateCallFailed()
```

Thrown when `delegatecall` fails.

### DuplicateBodyAddress

```solidity
error DuplicateBodyAddress(uint256 stageId, address body)
```

Thrown if a body address is duplicated in the same stage.

| Parameter | Type | Description |
| --- | --- | --- |
| `stageId` | `uint256` | The stage id that contains the duplicated body address. |
| `body` | `address` | The address that is duplicated in `stageId`. |

### FunctionDeprecated

```solidity
error FunctionDeprecated()
```

### InsufficientGas

```solidity
error InsufficientGas()
```

### InterfaceNotSupported

```solidity
error InterfaceNotSupported()
```

Thrown when a body doesn't support IProposal interface.

### InvalidTargetConfig

```solidity
error InvalidTargetConfig(IPlugin.TargetConfig targetConfig)
```

Thrown when target is of type 'IDAO', but operation is `delegateCall`.

| Parameter | Type | Description |
| --- | --- | --- |
| `targetConfig` | `IPlugin.TargetConfig` | The target config to update it to. |

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

> **Dev:** This can happen in 2 cases: either Proposal can not yet be advanced or, The stage has `editable:false` in the configuration.

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

## Constants

_Public, so each is also readable through a generated getter._

### SET_METADATA_PERMISSION_ID _(from MetadataExtensionUpgradeable)_

```solidity
bytes32 public constant SET_METADATA_PERMISSION_ID = keccak256("SET_METADATA_PERMISSION");
```

Value: `0x4707e94b25cfce1a7c363508fbb838c35864388ad77284b248282b9746982b9b`

The ID of the permission required to call the `setMetadata` function.

### SET_TARGET_CONFIG_PERMISSION_ID _(from PluginUUPSUpgradeable)_

```solidity
bytes32 public constant SET_TARGET_CONFIG_PERMISSION_ID =
        keccak256("SET_TARGET_CONFIG_PERMISSION");
```

Value: `0x568cc693d84eb1901f8bcecba154cbdef23ca3cf67efc0a0b698528a06c660f7`

The ID of the permission required to call the `setTargetConfig` function.

### UPGRADE_PLUGIN_PERMISSION_ID _(from PluginUUPSUpgradeable)_

```solidity
bytes32 public constant UPGRADE_PLUGIN_PERMISSION_ID = keccak256("UPGRADE_PLUGIN_PERMISSION");
```

Value: `0x821b6e3a557148015a918c89e5d092e878a69854a2d1a410635f771bd5a8a3f5`

The ID of the permission required to call the `_authorizeUpgrade` function.

## Enums

### Operation _(from IPlugin)_

```solidity
enum Operation {
    Call,
    DelegateCall
}
```

Specifies the type of operation to perform.

| Option | Value |
| --- | --- |
| `Call` | `0` |
| `DelegateCall` | `1` |

### PluginType _(from IPlugin)_

```solidity
enum PluginType {
    UUPS,
    Cloneable,
    Constructable
}
```

Types of plugin implementations available within OSx.

| Option | Value |
| --- | --- |
| `UUPS` | `0` |
| `Cloneable` | `1` |
| `Constructable` | `2` |

### ProposalState

```solidity
enum ProposalState {
    Active,
    Canceled,
    Executed,
    Advanceable,
    Expired
}
```

The states of the proposal.

| Option | Value | Description |
| --- | --- | --- |
| `Active` | `0` | Whether the proposal is not advanceable. |
| `Canceled` | `1` | Whether the proposal is canceled. |
| `Executed` | `2` | Whether the proposal is executed. |
| `Advanceable` | `3` | Whether the proposal can be advanced to the next stage. |
| `Expired` | `4` | Whether the proposal's stage maxAdvance time has passed. |

### ResultType

```solidity
enum ResultType {
    None,
    Approval,
    Veto
}
```

The different types that bodies can be registered as.

| Option | Value | Description |
| --- | --- | --- |
| `None` | `0` | Used to check if the body reported the result or not. |
| `Approval` | `1` | Used to allow a body to report approval result. |
| `Veto` | `2` | Used to allow a body to report veto result. |

## Structs

### Body

```solidity
struct Body {
    address addr;
    bool isManual;
    bool tryAdvance;
    StagedProposalProcessor.ResultType resultType;
}
```

A container for Body-related information.

| Field | Type | Description |
| --- | --- | --- |
| `addr` | `address` | The address responsible for reporting results. For automatic bodies, it is also where the SPP creates proposals. |
| `isManual` | `bool` | Whether SPP should create a proposal on a body. If true, it will not create. |
| `tryAdvance` | `bool` | Whether to try to automatically advance the stage when a body reports results. |
| `resultType` | `StagedProposalProcessor.ResultType` | The type(`Approval` or `Veto`) this body is registered with. |

### MetadataExtensionStorage _(from MetadataExtensionUpgradeable)_

```solidity
struct MetadataExtensionStorage {
    bytes metadata;
}
```

### Proposal

```solidity
struct Proposal {
    uint128 allowFailureMap;
    uint64 lastStageTransition;
    uint16 currentStage;
    uint16 stageConfigIndex;
    bool executed;
    bool canceled;
    address creator;
    Action[] actions;
    IPlugin.TargetConfig targetConfig;
}
```

A container for proposal-related information.

| Field | Type | Description |
| --- | --- | --- |
| `allowFailureMap` | `uint128` | A bitmap allowing the proposal to succeed, even if individual actions might revert. |
| `lastStageTransition` | `uint64` | The timestamp at which proposal's current stage has started. |
| `currentStage` | `uint16` | Which stage the proposal is at. |
| `stageConfigIndex` | `uint16` | The stage configuration that this proposal uses. |
| `executed` | `bool` | Whether the proposal is executed or not. |
| `canceled` | `bool` | Whether the proposal is canceled or not. |
| `creator` | `address` | The creator of the proposal. |
| `actions` | `Action[]` | The actions to be executed when the proposal passes. |
| `targetConfig` | `IPlugin.TargetConfig` | The target to which this contract will pass actions with an operation type. |

### Stage

```solidity
struct Stage {
    StagedProposalProcessor.Body[] bodies;
    uint64 maxAdvance;
    uint64 minAdvance;
    uint64 voteDuration;
    uint16 approvalThreshold;
    uint16 vetoThreshold;
    bool cancelable;
    bool editable;
}
```

A container for stage-related information.

| Field | Type | Description |
| --- | --- | --- |
| `bodies` | `StagedProposalProcessor.Body[]` | The bodies that are responsible for advancing the stage. |
| `maxAdvance` | `uint64` | The maximum duration after which stage can not be advanced. |
| `minAdvance` | `uint64` | The minimum duration until when stage can not be advanced. |
| `voteDuration` | `uint64` | The time to give vetoing bodies to make decisions in optimistic stage. Note that this also is used as an endDate time for bodies, see `_createBodyProposals`. |
| `approvalThreshold` | `uint16` | The number of bodies that are required to pass to advance the proposal. |
| `vetoThreshold` | `uint16` | If this number of bodies veto, the proposal can never advance even if `approvalThreshold` is satisfied. |
| `cancelable` | `bool` | If the proposal can be cancelled in the stage. |
| `editable` | `bool` | If the proposal can be edited in the stage. |

### TargetConfig _(from IPlugin)_

```solidity
struct TargetConfig {
    address target;
    IPlugin.Operation operation;
}
```

Configuration for the target contract that the plugin will interact with, including the address and operation type.

> **Dev:** By default, the plugin typically targets the associated DAO and performs a `Call` operation. However, this
> configuration allows the plugin to specify a custom executor and select either `Call` or `DelegateCall` based on
> the desired execution context.

| Field | Type | Description |
| --- | --- | --- |
| `target` | `address` | The address of the target contract, typically the associated DAO but configurable to a custom executor. |
| `operation` | `IPlugin.Operation` | The type of operation (`Call` or `DelegateCall`) to execute on the target, as defined by `Operation`. |
