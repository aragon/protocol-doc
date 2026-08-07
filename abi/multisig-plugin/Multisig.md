---
type: reference
title: Multisig
kind: contract
source: multisig-plugin/packages/contracts/src/Multisig.sol
summary: "The on-chain multisig governance plugin in which a proposal passes if X out of Y approvals are met."
---

# Multisig

**Contract** · [`packages/contracts/src/Multisig.sol`](https://github.com/aragon/multisig-plugin/blob/c1b0e04919819f8fb1ec110743085dfb0dd7cc02/packages/contracts/src/Multisig.sol)

**Explained in:** [Create, vote, and execute a proposal](../../guides/create-vote-execute.md), [Multisig membership & eligibility](../../plugins/multisig-plugin/membership.md), [Multisig Plugin](../../plugins/multisig-plugin.md)

**Author:** Aragon X - 2022-2024

**Inherits:** [`IMultisig`](./IMultisig.md), `IMembership`, `MetadataExtensionUpgradeable`, `PluginUUPSUpgradeable`, `ProposalUpgradeable`, `Addresslist`

The on-chain multisig governance plugin in which a proposal passes if X out of Y approvals are met.

> **Dev:** v1.3 (Release 1, Build 3). For each upgrade, if the reinitialization step is required,
> increment the version numbers in the modifier for both the initialize and initializeFrom functions.

**security-contact:** sirt@aragon.org

## Functions

### addAddresses

```solidity
function addAddresses(address[] _members) external
```

Selector: `0x3628731c`

Adds new members to the address list. Previously, it checks if the new address list length would be greater than `type(uint16).max`, the maximal number of approvals.

> **Dev:** Requires the `UPDATE_MULTISIG_SETTINGS_PERMISSION_ID` permission.

| Parameter | Type | Description |
| --- | --- | --- |
| `_members` | `address[]` | The addresses of the members to be added. |

### addresslistLength

```solidity
function addresslistLength() external view returns (uint256)
```

Selector: `0x27f1608d`

Returns the current length of the address list.

### addresslistLengthAtBlock

```solidity
function addresslistLengthAtBlock(uint256 _blockNumber) external view returns (uint256)
```

Selector: `0x6a6b2d86`

Returns the length of the address list at a specific block number.

| Parameter | Type | Description |
| --- | --- | --- |
| `_blockNumber` | `uint256` | The specific block to get the count from. If `0`, then the latest checkpoint value is returned. |

### approve

```solidity
function approve(uint256 _proposalId, bool _tryExecution) external
```

Selector: `0x747442d3`

Records an approval for a proposal and, if specified, attempts execution if certain conditions are met.

> **Dev:** If `_tryExecution` is `true`, the function attempts execution after recording the approval.
> Execution will only proceed if the proposal is no longer open, the minimum approval requirements are met,
> and the caller has been granted execution permission. If execution conditions are not met,
> the function does not revert.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal to approve. |
| `_tryExecution` | `bool` | If `true`, attempts execution of the proposal after approval, without reverting on failure. |

### canApprove

```solidity
function canApprove(uint256 _proposalId, address _account) external view returns (bool)
```

Selector: `0x29245f56`

Checks if an account is eligible to participate in a proposal vote. Confirms that the proposal is open, the account is listed as a member, and the account has not previously voted or approved this proposal.

> **Dev:** Reverts if the proposal with the given `_proposalId` does not exist.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |
| `_account` | `address` | The address of the account to check. |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | True if the account is eligible to vote. |

### canExecute

```solidity
function canExecute(uint256 _proposalId) external view returns (bool)
```

Selector: `0xcc63604a`

Checks if a proposal can be executed.

> **Dev:** Reverts if the proposal with the given `_proposalId` does not exist.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal to be checked. |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | True if the proposal can be executed, false otherwise. |

### createProposal(bytes,(address,uint256,bytes)[],uint256,bool,bool,uint64,uint64)

```solidity
function createProposal(
    bytes _metadata,
    Action[] _actions,
    uint256 _allowFailureMap,
    bool _approveProposal,
    bool _tryExecution,
    uint64 _startDate,
    uint64 _endDate
) external returns (uint256 proposalId)
```

Selector: `0xfbd56e41`

Creates a new multisig proposal.

> **Dev:** Requires the `CREATE_PROPOSAL_PERMISSION_ID` permission.

| Parameter | Type | Description |
| --- | --- | --- |
| `_metadata` | `bytes` | The metadata of the proposal. |
| `_actions` | `Action[]` | The actions that will be executed after the proposal passes. |
| `_allowFailureMap` | `uint256` | A bitmap allowing the proposal to succeed, even if individual actions might revert. If the bit at index `i` is 1, the proposal succeeds even if the `i`th action reverts. A failure map value of 0 requires every action to not revert. |
| `_approveProposal` | `bool` | If `true`, the sender will approve the proposal. |
| `_tryExecution` | `bool` | If `true`, execution is tried after the vote cast. The call does not revert if execution is not possible. |
| `_startDate` | `uint64` | The start date of the proposal. |
| `_endDate` | `uint64` | The end date of the proposal. |

| Returns | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal. |

### createProposal(bytes,(address,uint256,bytes)[],uint64,uint64,bytes)

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

> **Dev:** Calls a public function that requires the `CREATE_PROPOSAL_PERMISSION_ID` permission.

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
function customProposalParamsABI() external pure returns (string)
```

Selector: `0x3d3f4b1b`

The human-readable abi format for extra params included in `data` of `createProposal`.

> **Dev:** Used for UI to easily detect what extra params the contract expects.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `string` | ABI of params in `data` of `createProposal`. |

### dao

```solidity
function dao() external view returns (IDAO)
```

Selector: `0x4162169f`

Returns the DAO contract.

### execute

```solidity
function execute(uint256 _proposalId) external
```

Selector: `0xfe0d94c1`

Executes a proposal if all execution conditions are met.

> **Dev:** Requires the `EXECUTE_PROPOSAL_PERMISSION_ID` permission.
> Reverts if the proposal is still open or if the minimum approval threshold has not been met.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal to be executed. |

### getCurrentTargetConfig

```solidity
function getCurrentTargetConfig() external view returns (IPlugin.TargetConfig)
```

Selector: `0xc98425ee`

Returns the currently set target contract.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | [`IPlugin.TargetConfig`](#targetconfig) |  |

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
) external view returns (bool executed, uint16 approvals, Multisig.ProposalParameters parameters, Action[] actions, uint256 allowFailureMap, IPlugin.TargetConfig targetConfig)
```

Selector: `0xc7f758a8`

Returns all information for a proposal by its ID.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |

| Returns | Type | Description |
| --- | --- | --- |
| `executed` | `bool` | Whether the proposal is executed or not. |
| `approvals` | `uint16` | The number of approvals casted. |
| `parameters` | [`Multisig.ProposalParameters`](#proposalparameters) | The parameters of the proposal. |
| `actions` | `Action[]` | The actions to be executed to the `target` contract address. |
| `allowFailureMap` | `uint256` | A bitmap allowing the proposal to succeed, even if individual actions might revert. If the bit at index `i` is 1, the proposal succeeds even if the `i`th action reverts. A failure map value of 0 requires every action to not revert. |
| `targetConfig` | [`IPlugin.TargetConfig`](#targetconfig) | Execution configuration, applied to the proposal when it was created. Added in build 3. |

### getTargetConfig

```solidity
function getTargetConfig() external view returns (IPlugin.TargetConfig)
```

Selector: `0xdd63c06f`

A convenient function to get current target config only if its target is not address(0), otherwise dao().

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | [`IPlugin.TargetConfig`](#targetconfig) |  |

### hasApproved

```solidity
function hasApproved(uint256 _proposalId, address _account) external view returns (bool)
```

Selector: `0x2358d5a8`

Returns whether the account has approved the proposal.

> **Dev:** May return false if the `_proposalId` or `_account` do not exist,
> as the function does not verify their existence.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |
| `_account` | `address` | The account address to be checked. |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | The vote option cast by a voter for a certain proposal. |

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
    address[] _members,
    Multisig.MultisigSettings _multisigSettings,
    IPlugin.TargetConfig _targetConfig,
    bytes _pluginMetadata
) external
```

Selector: `0xdc119aac`

Initializes Release 1, Build 3.

> **Dev:** This method is required to support [ERC-1822](https://eips.ethereum.org/EIPS/eip-1822).

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `IDAO` | The IDAO interface of the associated DAO. |
| `_members` | `address[]` | The addresses of the initial members to be added. |
| `_multisigSettings` | [`Multisig.MultisigSettings`](#multisigsettings) | The multisig settings. |
| `_targetConfig` | [`IPlugin.TargetConfig`](#targetconfig) | Configuration for the execution target, specifying the target address and operation type(either `Call` or `DelegateCall`). Defined by `TargetConfig` in the `IPlugin` interface of `osx-commons-contracts` package, added in build 3. |
| `_pluginMetadata` | `bytes` | The plugin specific information encoded in bytes. This can also be an ipfs cid encoded in bytes. |

### initializeFrom

```solidity
function initializeFrom(uint16 _fromBuild, bytes _initData) external
```

Selector: `0x10c83f4e`

Reinitializes the Multisig after an upgrade from a previous build version. For each
reinitialization step, use the `_fromBuild` version to decide which internal functions to call
for reinitialization.

> **Dev:** WARNING: The contract should only be upgradeable through PSP to ensure that _fromBuild is not
> incorrectly passed, and that the appropriate permissions for the upgrade are properly configured.

| Parameter | Type | Description |
| --- | --- | --- |
| `_fromBuild` | `uint16` | The build version number of the previous implementation contract this upgrade is transitioning from. |
| `_initData` | `bytes` | The initialization data to be passed to via `upgradeToAndCall` (see [ERC-1967](https://docs.openzeppelin.com/contracts/4.x/api/proxy#ERC1967Upgrade)). |

### isListed

```solidity
function isListed(address _account) external view returns (bool)
```

Selector: `0xf794062e`

Checks if an account is currently on the address list.

| Parameter | Type | Description |
| --- | --- | --- |
| `_account` | `address` | The account address being checked. |

### isListedAtBlock

```solidity
function isListedAtBlock(address _account, uint256 _blockNumber) external view returns (bool)
```

Selector: `0xb1bb8d26`

Checks if an account is on the address list at a specific block number.

| Parameter | Type | Description |
| --- | --- | --- |
| `_account` | `address` | The account address being checked. |
| `_blockNumber` | `uint256` | The block number. |

### isMember

```solidity
function isMember(address _account) external view returns (bool)
```

Selector: `0xa230c524`

Checks if an account is a member of the DAO.

> **Dev:** This function must be implemented in the plugin contract that introduces the members to the DAO.

| Parameter | Type | Description |
| --- | --- | --- |
| `_account` | `address` | The address of the account to be checked. |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | Whether the account is a member or not. |

### lastMultisigSettingsChange

```solidity
function lastMultisigSettingsChange() external view returns (uint64)
```

Selector: `0xbc208302`

Keeps track at which block number the multisig settings have been changed the last time.

> **Dev:** This variable prevents a proposal from being created in the same block in which the multisig
> settings change.

### multisigSettings

```solidity
function multisigSettings() external view returns (bool onlyListed, uint16 minApprovals)
```

Selector: `0xe097b3ff`

The current plugin settings.

### pluginType

```solidity
function pluginType() external pure returns (IPlugin.PluginType)
```

Selector: `0x41de6830`

Returns the plugin's type

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | [`IPlugin.PluginType`](#plugintype) |  |

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

### removeAddresses

```solidity
function removeAddresses(address[] _members) external
```

Selector: `0xa84eb999`

Removes existing members from the address list. Previously, it checks if the new address list length is at least as long as the minimum approvals parameter requires. Note that `minApprovals` is must be at least 1 so the address list cannot become empty.

> **Dev:** Requires the `UPDATE_MULTISIG_SETTINGS_PERMISSION_ID` permission.

| Parameter | Type | Description |
| --- | --- | --- |
| `_members` | `address[]` | The addresses of the members to be removed. |

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
| `_targetConfig` | [`IPlugin.TargetConfig`](#targetconfig) | The target Config containing the address and operation type. |

### supportsInterface

```solidity
function supportsInterface(bytes4 _interfaceId) external view returns (bool)
```

Selector: `0x01ffc9a7`

Checks if this or the parent contract supports an interface by its ID.

| Parameter | Type | Description |
| --- | --- | --- |
| `_interfaceId` | `bytes4` | The ID of the interface. |

### updateMultisigSettings

```solidity
function updateMultisigSettings(Multisig.MultisigSettings _multisigSettings) external
```

Selector: `0x303f4336`

Updates the plugin settings.

> **Dev:** Requires the `UPDATE_MULTISIG_SETTINGS_PERMISSION_ID` permission.

| Parameter | Type | Description |
| --- | --- | --- |
| `_multisigSettings` | [`Multisig.MultisigSettings`](#multisigsettings) | The new settings. |

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

### Approved

```solidity
event Approved(uint256 indexed proposalId, address indexed approver)
```

Emitted when a proposal is approve by an approver.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal. |
| `approver` | `address` | The approver casting the approve. |

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

### MembersAdded

```solidity
event MembersAdded(address[] members)
```

Emitted when members are added to the DAO plugin.

| Parameter | Type | Description |
| --- | --- | --- |
| `members` | `address[]` | The list of new members being added. |

### MembershipContractAnnounced

```solidity
event MembershipContractAnnounced(address indexed definingContract)
```

Emitted to announce the membership being defined by a contract.

| Parameter | Type | Description |
| --- | --- | --- |
| `definingContract` | `address` | The contract defining the membership. |

### MembersRemoved

```solidity
event MembersRemoved(address[] members)
```

Emitted when members are removed from the DAO plugin.

| Parameter | Type | Description |
| --- | --- | --- |
| `members` | `address[]` | The list of existing members being removed. |

### MetadataSet

```solidity
event MetadataSet(bytes metadata)
```

Emitted when metadata is updated.

### MultisigSettingsUpdated

```solidity
event MultisigSettingsUpdated(bool onlyListed, uint16 indexed minApprovals)
```

Emitted when the plugin settings are set.

| Parameter | Type | Description |
| --- | --- | --- |
| `onlyListed` | `bool` | Whether only listed addresses can create a proposal. |
| `minApprovals` | `uint16` | The minimum amount of approvals needed to pass a proposal. |

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

### TargetSet

```solidity
event TargetSet(IPlugin.TargetConfig newTargetConfig)
```

Emitted each time the TargetConfig is set.

| Parameter | Type | Description |
| --- | --- | --- |
| `newTargetConfig` | [`IPlugin.TargetConfig`](#targetconfig) |  |

### Upgraded

```solidity
event Upgraded(address indexed implementation)
```

> **Dev:** Emitted when the implementation is upgraded.

## Errors

### AddresslistLengthOutOfBounds

```solidity
error AddresslistLengthOutOfBounds(uint16 limit, uint256 actual)
```

Thrown if the address list length is out of bounds.

| Parameter | Type | Description |
| --- | --- | --- |
| `limit` | `uint16` | The limit value. |
| `actual` | `uint256` | The actual value. |

### AlreadyInitialized

```solidity
error AlreadyInitialized()
```

Thrown when initialize is called after it has already been executed.

### ApprovalCastForbidden

```solidity
error ApprovalCastForbidden(uint256 proposalId, address sender)
```

Thrown if an approver is not allowed to cast an approve. This can be because the proposal
- is not open,
- was executed, or
- the approver is not on the address list

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal. |
| `sender` | `address` | The address of the sender. |

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

### DateOutOfBounds

```solidity
error DateOutOfBounds(uint64 limit, uint64 actual)
```

Thrown if a date is out of bounds.

| Parameter | Type | Description |
| --- | --- | --- |
| `limit` | `uint64` | The limit value. |
| `actual` | `uint64` | The actual value. |

### DelegateCallFailed

```solidity
error DelegateCallFailed()
```

Thrown when `delegatecall` fails.

### FunctionDeprecated

```solidity
error FunctionDeprecated()
```

### InvalidAddresslistUpdate

```solidity
error InvalidAddresslistUpdate(address member)
```

Thrown when the address list update is invalid, which can be caused by the addition of an existing member or removal of a non-existing member.

| Parameter | Type | Description |
| --- | --- | --- |
| `member` | `address` | The array of member addresses to be added or removed. |

### InvalidTargetConfig

```solidity
error InvalidTargetConfig(IPlugin.TargetConfig targetConfig)
```

Thrown when target is of type 'IDAO', but operation is `delegateCall`.

| Parameter | Type | Description |
| --- | --- | --- |
| `targetConfig` | [`IPlugin.TargetConfig`](#targetconfig) | The target config to update it to. |

### MinApprovalsOutOfBounds

```solidity
error MinApprovalsOutOfBounds(uint16 limit, uint16 actual)
```

Thrown if the minimal approvals value is out of bounds (less than 1 or greater than the number of
members in the address list).

| Parameter | Type | Description |
| --- | --- | --- |
| `limit` | `uint16` | The maximal value. |
| `actual` | `uint16` | The actual value. |

### NonexistentProposal

```solidity
error NonexistentProposal(uint256 proposalId)
```

Thrown when a proposal doesn't exist.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal which doesn't exist. |

### ProposalAlreadyExists

```solidity
error ProposalAlreadyExists(uint256 proposalId)
```

Thrown if the proposal with the same id already exists.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The id of the proposal. |

### ProposalCreationForbidden

```solidity
error ProposalCreationForbidden(address sender)
```

Thrown when a sender is not allowed to create a proposal.

| Parameter | Type | Description |
| --- | --- | --- |
| `sender` | `address` | The sender address. |

### ProposalExecutionForbidden

```solidity
error ProposalExecutionForbidden(uint256 proposalId)
```

Thrown if the proposal execution is forbidden.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal. |

## Constants

_Public, so each is also readable through a generated getter._

### CREATE_PROPOSAL_PERMISSION_ID

```solidity
bytes32 public constant CREATE_PROPOSAL_PERMISSION_ID = keccak256("CREATE_PROPOSAL_PERMISSION");
```

Value: `0x8c433a4cd6b51969eca37f974940894297b9fcf4b282a213fea5cd8f85289c90`

The ID of the permission required to call the `createProposal` function.

### EXECUTE_PROPOSAL_PERMISSION_ID

```solidity
bytes32 public constant EXECUTE_PROPOSAL_PERMISSION_ID =
        keccak256("EXECUTE_PROPOSAL_PERMISSION");
```

Value: `0xf281525e53675515a6ba7cc7bea8a81e649b3608423ee2d73be1752cea887889`

The ID of the permission required to call the `execute` function.

### SET_METADATA_PERMISSION_ID

_Inherited from `MetadataExtensionUpgradeable`._

```solidity
bytes32 public constant SET_METADATA_PERMISSION_ID = keccak256("SET_METADATA_PERMISSION");
```

Value: `0x4707e94b25cfce1a7c363508fbb838c35864388ad77284b248282b9746982b9b`

The ID of the permission required to call the `setMetadata` function.

### SET_TARGET_CONFIG_PERMISSION_ID

_Inherited from `PluginUUPSUpgradeable`._

```solidity
bytes32 public constant SET_TARGET_CONFIG_PERMISSION_ID =
        keccak256("SET_TARGET_CONFIG_PERMISSION");
```

Value: `0x568cc693d84eb1901f8bcecba154cbdef23ca3cf67efc0a0b698528a06c660f7`

The ID of the permission required to call the `setTargetConfig` function.

### UPDATE_MULTISIG_SETTINGS_PERMISSION_ID

```solidity
bytes32 public constant UPDATE_MULTISIG_SETTINGS_PERMISSION_ID =
        keccak256("UPDATE_MULTISIG_SETTINGS_PERMISSION");
```

Value: `0xb1750e46d35a0069c8465b8643e7838d2149a842a2db8ee233d9835590040cad`

The ID of the permission required to call the
`addAddresses`, `removeAddresses` and `updateMultisigSettings` functions.

### UPGRADE_PLUGIN_PERMISSION_ID

_Inherited from `PluginUUPSUpgradeable`._

```solidity
bytes32 public constant UPGRADE_PLUGIN_PERMISSION_ID = keccak256("UPGRADE_PLUGIN_PERMISSION");
```

Value: `0x821b6e3a557148015a918c89e5d092e878a69854a2d1a410635f771bd5a8a3f5`

The ID of the permission required to call the `_authorizeUpgrade` function.

## Enums

### Operation

_Inherited from `IPlugin`._

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

### PluginType

_Inherited from `IPlugin`._

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

## Structs

### MetadataExtensionStorage

_Inherited from `MetadataExtensionUpgradeable`._

```solidity
struct MetadataExtensionStorage {
    bytes metadata;
}
```

### MultisigSettings

```solidity
struct MultisigSettings {
    bool onlyListed;
    uint16 minApprovals;
}
```

A container for the plugin settings.

| Field | Type | Description |
| --- | --- | --- |
| `onlyListed` | `bool` | Whether only listed addresses can create a proposal or not. |
| `minApprovals` | `uint16` | The minimal number of approvals required for a proposal to pass. |

### Proposal

```solidity
struct Proposal {
    bool executed;
    uint16 approvals;
    Multisig.ProposalParameters parameters;
    mapping(address => bool) approvers;
    Action[] actions;
    uint256 allowFailureMap;
    IPlugin.TargetConfig targetConfig;
}
```

A container for proposal-related information.

| Field | Type | Description |
| --- | --- | --- |
| `executed` | `bool` | Whether the proposal is executed or not. |
| `approvals` | `uint16` | The number of approvals casted. |
| `parameters` | [`Multisig.ProposalParameters`](#proposalparameters) | The proposal-specific approve settings at the time of the proposal creation. |
| `approvers` | `mapping(address => bool)` | The approves casted by the approvers. |
| `actions` | `Action[]` | The actions to be executed when the proposal passes. |
| `allowFailureMap` | `uint256` | A bitmap allowing the proposal to succeed, even if individual actions might revert. If the bit at index `i` is 1, the proposal succeeds even if the `i`th action reverts. A failure map value of 0 requires every action to not revert. |
| `targetConfig` | [`IPlugin.TargetConfig`](#targetconfig) | Configuration for the execution target, specifying the target address and operation type (either `Call` or `DelegateCall`). Defined by `TargetConfig` in the `IPlugin` interface, part of the `osx-commons-contracts` package, added in build 3. |

### ProposalParameters

```solidity
struct ProposalParameters {
    uint16 minApprovals;
    uint64 snapshotBlock;
    uint64 startDate;
    uint64 endDate;
}
```

A container for the proposal parameters.

| Field | Type | Description |
| --- | --- | --- |
| `minApprovals` | `uint16` | The number of approvals required. |
| `snapshotBlock` | `uint64` | The number of the block prior to the proposal creation. |
| `startDate` | `uint64` | The timestamp when the proposal starts. |
| `endDate` | `uint64` | The timestamp when the proposal expires. |

### TargetConfig

_Inherited from `IPlugin`._

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
| `operation` | [`IPlugin.Operation`](#operation) | The type of operation (`Call` or `DelegateCall`) to execute on the target, as defined by `Operation`. |
