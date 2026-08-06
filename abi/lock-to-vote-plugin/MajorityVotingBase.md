---
type: reference
title: MajorityVotingBase
kind: abstract contract
source: lock-to-vote-plugin/src/base/MajorityVotingBase.sol
summary: "The abstract implementation of majority voting plugins."
---

# MajorityVotingBase

**Abstract contract** · [`src/base/MajorityVotingBase.sol`](https://github.com/aragon/lock-to-vote-plugin/blob/5a513e3d9f1aad35d8926de87c408720e8d20a8d/src/base/MajorityVotingBase.sol)

**Author:** Aragon X - 2022-2025

**Inherits:** [`IMajorityVoting`](./IMajorityVoting.md), `Initializable`, `ERC165Upgradeable`, `MetadataExtensionUpgradeable`, [`PluginUUPSUpgradeable`](./PluginUUPSUpgradeable.md), `ProposalUpgradeable`

The abstract implementation of majority voting plugins.

#### Parameterization

We define 3 parameters:
$$\texttt{support} = \frac{N_\text{yes}}{N_\text{yes} + N_\text{no}} \in [0,1]$$
$$\texttt{participation} = \frac{N_\text{yes} + N_\text{no} + N_\text{abstain}}{N_\text{total}} \in [0,1],$$
where $N_\text{yes}$, $N_\text{no}$, and $N_\text{abstain}$ are the yes, no, and abstain votes that have been
cast and $N_\text{total}$ is the total voting power available at proposal creation time.
and
$$\texttt{approval} = \frac{N_\text{yes}}{N_\text{total}} \in [0,1]$$

##### Limit Values: Support Threshold & Minimum Participation

Two limit values are associated with these parameters and decide if a proposal execution should be possible:
$\texttt{supportThresholdRatio} \in [0,1)$ and $\texttt{minParticipationRatio} \in [0,1]$.

For threshold values, $>$ comparison is used. This **does not** include the threshold value.
E.g., for $\texttt{supportThresholdRatio} = 50\%$,
the criterion is fulfilled if there is at least one more yes than no votes ($N_\text{yes} = N_\text{no} + 1$).
For minimum values, $\ge{}$ comparison is used. This **does** include the minimum participation value.
E.g., for $\texttt{minParticipationRatio} = 40\%$ and $N_\text{total} = 10$,
the criterion is fulfilled if 4 out of 10 votes were casted.

Majority voting implies that the support threshold is set with
$$\texttt{supportThresholdRatio} \ge 50\% .$$
However, this is not enforced by the contract code and developers can make unsafe parameters and
only the frontend will warn about bad parameter settings.

#### Execution Criteria

After the vote is closed, two criteria decide if the proposal passes.

##### The Support Criterion

For a proposal to pass, the required ratio of yes and no votes must be met:
$$(1- \texttt{supportThresholdRatio}) \cdot N_\text{yes} > \texttt{supportThresholdRatio} \cdot N_\text{no}.$$
Note, that the inequality yields the simple majority voting condition for $\texttt{supportThresholdRatio}=\frac{1}{2}$.

##### The Participation Criterion

For a proposal to pass, the minimum voting power must have been cast:
$$N_\text{yes} + N_\text{no} + N_\text{abstain} \ge \texttt{minVotingPower},$$
where $\texttt{minVotingPower} = \texttt{minParticipationRatio} \cdot N_\text{total}$.

#### Vote Replacement

The contract allows votes to be replaced. Voters can vote multiple times
and only the latest voteOption is tallied.

> **Dev:** This contract implements the `IMajorityVoting` interface.

**security-contact:** sirt@aragon.org

## Functions

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

### currentTokenSupply

```solidity
function currentTokenSupply() external view returns (uint256)
```

Selector: `0xd9779fbe`

Returns the current token supply.
NOTE: It includes any non circulating supply that might be vesting, locked or undistributed.

### customProposalParamsABI

```solidity
function customProposalParamsABI() external view returns (string)
```

Selector: `0x3d3f4b1b`

The human-readable abi format for extra params included in `data` of `createProposal`.

> **Dev:** Used for UI to easily detect what extra params the contract expects.

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

Executes a proposal.

> **Dev:** Requires the `EXECUTE_PROPOSAL_PERMISSION_ID` permission.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal to be executed. |

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
) external view returns (bool open, bool executed, MajorityVotingBase.ProposalParameters parameters, MajorityVotingBase.Tally tally, Action[] actions, uint256 allowFailureMap, IPlugin.TargetConfig targetConfig)
```

Selector: `0xc7f758a8`

Returns all information for a proposal by its ID.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |

| Returns | Type | Description |
| --- | --- | --- |
| `open` | `bool` | Whether the proposal is open or not. |
| `executed` | `bool` | Whether the proposal is executed or not. |
| `parameters` | `MajorityVotingBase.ProposalParameters` | The parameters of the proposal. |
| `tally` | `MajorityVotingBase.Tally` | The current tally of the proposal. |
| `actions` | `Action[]` | The actions to be executed to the `target` contract address. |
| `allowFailureMap` | `uint256` | The bit map representations of which actions are allowed to revert so tx still succeeds. |
| `targetConfig` | `IPlugin.TargetConfig` | Execution configuration, applied to the proposal when it was created. Added in build 3. |

### getTargetConfig

```solidity
function getTargetConfig() external view returns (IPlugin.TargetConfig)
```

Selector: `0xdd63c06f`

A convenient function to get current target config only if its target is not address(0), otherwise dao().

### getVote

```solidity
function getVote(
    uint256 _proposalId,
    address _voter
) external view returns (IMajorityVoting.VoteEntry)
```

Selector: `0xbc3f931f`

Returns whether the account has voted for the proposal.

> **Dev:** May return `none` if the `_proposalId` does not exist, or the `_account` does not have voting power.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |
| `_voter` | `address` |  |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `IMajorityVoting.VoteEntry` | The vote option cast by a voter for a certain proposal. |

### getVotingSettings

```solidity
function getVotingSettings() external view returns (MajorityVotingBase.VotingSettings)
```

Selector: `0xf6832643`

Returns the current voting settings.

### hasSucceeded

```solidity
function hasSucceeded(uint256 _proposalId) external view returns (bool)
```

Selector: `0xc218c132`

Whether proposal succeeded or not.

> **Dev:** Reverts if the proposal with the given `_proposalId` does not exist.

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

### isMinApprovalReached

```solidity
function isMinApprovalReached(uint256 _proposalId) external view returns (bool)
```

Selector: `0x36fa9589`

Checks if the min approval value defined as: $$\texttt{minApprovalRatio} = \frac{N_\text{yes}}{N_\text{total}}$$ for a proposal is greater or equal than the minimum approval value.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | Returns `true` if the approvals is greater or equal than the minimum approval and `false` otherwise. |

### isMinVotingPowerReached

```solidity
function isMinVotingPowerReached(uint256 _proposalId) external view returns (bool)
```

Selector: `0xcfd40b84`

Checks if the participation value defined as: $$\texttt{participation} = \frac{N_\text{yes}+N_\text{no}+N_\text{abstain}}{N_\text{total}}$$ for a proposal is greater or equal than the minimum participation value.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | Returns `true` if the participation is greater or equal than the minimum participation, and `false` otherwise. |

### isSupportThresholdReached

```solidity
function isSupportThresholdReached(uint256 _proposalId) external view returns (bool)
```

Selector: `0xcf131149`

Checks if the support value defined as: $$\texttt{support} = \frac{N_\text{yes}}{N_\text{yes}+N_\text{no}}$$ for a proposal is greater than the support threshold.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | Returns `true` if the support is greater than the support threshold and `false` otherwise. |

### minApprovalRatio

```solidity
function minApprovalRatio() external view returns (uint256)
```

Selector: `0x0e04be90`

Returns the configured minimum approval ratio.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `uint256` | The minimal approval ratio. |

### minParticipationRatio

```solidity
function minParticipationRatio() external view returns (uint32)
```

Selector: `0xb9835a17`

Returns the minimum participation parameter stored in the voting settings.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `uint32` | The minimum participation parameter. |

### minProposerVotingPower

```solidity
function minProposerVotingPower() external view returns (uint256)
```

Selector: `0xf60046b2`

Returns the minimum voting power required to create a proposal stored in the voting settings.

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

### proposalDuration

```solidity
function proposalDuration() external view returns (uint64)
```

Selector: `0x30109962`

Returns the proposal duration parameter stored in the voting settings.

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

### supportsInterface

```solidity
function supportsInterface(bytes4 _interfaceId) external view returns (bool)
```

Selector: `0x01ffc9a7`

Checks if this or the parent contract supports an interface by its ID.

| Parameter | Type | Description |
| --- | --- | --- |
| `_interfaceId` | `bytes4` | The ID of the interface. |

### supportThresholdRatio

```solidity
function supportThresholdRatio() external view returns (uint32)
```

Selector: `0x2e747051`

Returns the support threshold parameter stored in the voting settings.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `uint32` | The support threshold parameter. |

### updateVotingSettings

```solidity
function updateVotingSettings(MajorityVotingBase.VotingSettings _votingSettings) external
```

Selector: `0x3f8b32d9`

Updates the voting settings.

> **Dev:** Requires the `UPDATE_SETTINGS_PERMISSION_ID` permission.

| Parameter | Type | Description |
| --- | --- | --- |
| `_votingSettings` | `MajorityVotingBase.VotingSettings` | The new voting settings. |

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

### votingMode

```solidity
function votingMode() external view returns (MajorityVotingBase.VotingMode)
```

Selector: `0x23d07188`

Returns the vote mode stored in the voting settings.

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

### Upgraded

```solidity
event Upgraded(address indexed implementation)
```

> **Dev:** Emitted when the implementation is upgraded.

### VoteCast

```solidity
event VoteCast(
    uint256 indexed proposalId,
    address indexed voter,
    IMajorityVoting.VoteOption voteOption,
    uint256 votingPower
)
```

Emitted when a vote is cast by a voter.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal. |
| `voter` | `address` | The voter casting the vote. |
| `voteOption` | `IMajorityVoting.VoteOption` | The casted vote option. |
| `votingPower` | `uint256` | The voting power behind this vote. |

### VotingSettingsUpdated

```solidity
event VotingSettingsUpdated(
    MajorityVotingBase.VotingMode votingMode,
    uint32 supportThresholdRatio,
    uint32 minParticipationRatio,
    uint32 minApprovalRatio,
    uint64 proposalDuration,
    uint256 minProposerVotingPower
)
```

Emitted when the voting settings are updated.

| Parameter | Type | Description |
| --- | --- | --- |
| `votingMode` | `MajorityVotingBase.VotingMode` | A parameter to select the vote mode. |
| `supportThresholdRatio` | `uint32` | The support threshold ratio. |
| `minParticipationRatio` | `uint32` | The minimum participation ratio. |
| `minApprovalRatio` | `uint32` | The minimum ratio of yes votes over the token supply needed for the proposal advance. |
| `proposalDuration` | `uint64` | The duration of the proposal in seconds. |
| `minProposerVotingPower` | `uint256` | The minimum voting power required to create a proposal. |

## Errors

### AlreadyInitialized

```solidity
error AlreadyInitialized()
```

Thrown when initialize is called after it has already been executed.

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

### EmptyDAOAddress

```solidity
error EmptyDAOAddress()
```

Thrown when the given DAO address is empty.

### FunctionDeprecated

```solidity
error FunctionDeprecated()
```

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

### ProposalAlreadyExists

```solidity
error ProposalAlreadyExists(uint256 proposalId)
```

Thrown if the proposal with same actions and metadata already exists.

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

### ProposalDurationOutOfBounds

```solidity
error ProposalDurationOutOfBounds(uint64 limit, uint64 actual)
```

Thrown if the proposal duration value is out of bounds (less than one hour or greater than 1 month).

| Parameter | Type | Description |
| --- | --- | --- |
| `limit` | `uint64` | The limit value. |
| `actual` | `uint64` | The actual value. |

### ProposalExecutionForbidden

```solidity
error ProposalExecutionForbidden(uint256 proposalId)
```

Thrown if the proposal execution is forbidden.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal. |

### RatioOutOfBounds

```solidity
error RatioOutOfBounds(uint256 limit, uint256 actual)
```

Thrown if a ratio value exceeds the maximal value of `10**6`.

| Parameter | Type | Description |
| --- | --- | --- |
| `limit` | `uint256` | The maximal value. |
| `actual` | `uint256` | The actual value. |

### VoteCallForbidden

```solidity
error VoteCallForbidden(address caller)
```

Thrown when the address calling vote() is not the LockManager.

| Parameter | Type | Description |
| --- | --- | --- |
| `caller` | `address` | The address calling vote(). |

### VoteCastForbidden

```solidity
error VoteCastForbidden(uint256 proposalId, address account)
```

Thrown if an account is not allowed to cast a vote. This can be because the vote
- has not started,
- has ended,
- was executed, or
- the account doesn't have voting powers.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal. |
| `account` | `address` | The address of the _account. |

## Constants

_Public, so each is also readable through a generated getter._

### EXECUTE_PROPOSAL_PERMISSION_ID

```solidity
bytes32 public constant EXECUTE_PROPOSAL_PERMISSION_ID = keccak256("EXECUTE_PROPOSAL_PERMISSION");
```

Value: `0xf281525e53675515a6ba7cc7bea8a81e649b3608423ee2d73be1752cea887889`

The ID of the permission required to call the `execute` function.

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

### UPDATE_SETTINGS_PERMISSION_ID

```solidity
bytes32 public constant UPDATE_SETTINGS_PERMISSION_ID = keccak256("UPDATE_SETTINGS_PERMISSION");
```

Value: `0x371f7eb46741163a91bb271e73a2a58ae7a0b6bc80c10a8c7e03ae2e4bc0e425`

The ID of the permission required to call the `updateVotingSettings` function.

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

### VoteOption _(from IMajorityVoting)_

```solidity
enum VoteOption {
    None,
    Abstain,
    Yes,
    No
}
```

Vote options that a voter can chose from.

| Option | Value | Description |
| --- | --- | --- |
| `None` | `0` | The default option state of a voter indicating the absence from the vote. This option neither influences support nor participation. |
| `Abstain` | `1` | This option does not influence the support but counts towards participation. |
| `Yes` | `2` | This option increases the support and counts towards participation. |
| `No` | `3` | This option decreases the support and counts towards participation. |

### VotingMode

```solidity
enum VotingMode {
    Standard,
    VoteReplacement
}
```

The different voting modes available.

| Option | Value | Description |
| --- | --- | --- |
| `Standard` | `0` | In standard mode, the voting power can be increased but votes cannot be replaced. |
| `VoteReplacement` | `1` | In vote replacement mode, voters can change their vote multiple times and only the latest vote option is tallied. |

## Structs

### MetadataExtensionStorage _(from MetadataExtensionUpgradeable)_

```solidity
struct MetadataExtensionStorage {
    bytes metadata;
}
```

### Proposal

```solidity
struct Proposal {
    bool executed;
    MajorityVotingBase.ProposalParameters parameters;
    MajorityVotingBase.Tally tally;
    mapping(address => IMajorityVoting.VoteEntry) votes;
    Action[] actions;
    uint256 allowFailureMap;
    IPlugin.TargetConfig targetConfig;
}
```

A container for proposal-related information.

| Field | Type | Description |
| --- | --- | --- |
| `executed` | `bool` | Whether the proposal is executed or not. |
| `parameters` | `MajorityVotingBase.ProposalParameters` | The proposal parameters at the time of the proposal creation. |
| `tally` | `MajorityVotingBase.Tally` | The vote tally of the proposal. |
| `votes` | `mapping(address => IMajorityVoting.VoteEntry)` | The voting power cast by each voter. |
| `actions` | `Action[]` | The actions to be executed when the proposal passes. |
| `allowFailureMap` | `uint256` | A bitmap allowing the proposal to succeed, even if individual actions might revert. If the bit at index `i` is 1, the proposal succeeds even if the `i`th action reverts. A failure map value of 0 requires every action to not revert. |
| `targetConfig` | `IPlugin.TargetConfig` | Configuration for the execution target, specifying the target address and operation type (either `Call` or `DelegateCall`). Defined by `TargetConfig` in the `IPlugin` interface, part of the `osx-commons-contracts` package, added in build 3. |

### ProposalParameters

```solidity
struct ProposalParameters {
    MajorityVotingBase.VotingMode votingMode;
    uint32 supportThresholdRatio;
    uint64 startDate;
    uint64 endDate;
    uint256 minParticipationRatio;
    uint256 minApprovalRatio;
}
```

A container for the proposal parameters at the time of proposal creation.

| Field | Type | Description |
| --- | --- | --- |
| `votingMode` | `MajorityVotingBase.VotingMode` | A parameter to select the vote mode. |
| `supportThresholdRatio` | `uint32` | The support threshold ratio. Its value has to be in the interval [0, 10^6) defined by `RATIO_BASE = 10**6`. This is intended as the primary metric for proposals to pass. |
| `startDate` | `uint64` | The timestamp on which a proposal starts accepting votes. Range: `[startDate, endDate)` |
| `endDate` | `uint64` | The timestamp on which a proposal no longer accepts votes. |
| `minParticipationRatio` | `uint256` | The minimum voting power ratio needed for a proposal to reach the minimum participation. Its value has to be in the interval [0, 10^6] defined by `RATIO_BASE = 10**6`. This is a intended as secondary metric to prevent noise or spam from passing unadvertedly. Relatively high ratios are not encouraged. |
| `minApprovalRatio` | `uint256` | Minimum ratio of allocated YES votes. Its value has to be in the interval [0, 10^6] defined by `RATIO_BASE = 10**6`. This is a intended as secondary metric to prevent noise or spam from passing unadvertedly. Relatively high ratios are not encouraged. |

### Tally

```solidity
struct Tally {
    uint256 abstain;
    uint256 yes;
    uint256 no;
}
```

A container for the proposal vote tally.

| Field | Type | Description |
| --- | --- | --- |
| `abstain` | `uint256` | The number of abstain votes casted. |
| `yes` | `uint256` | The number of yes votes casted. |
| `no` | `uint256` | The number of no votes casted. |

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

### VoteEntry _(from IMajorityVoting)_

```solidity
struct VoteEntry {
    IMajorityVoting.VoteOption voteOption;
    uint256 votingPower;
}
```

Holds the state of an account's vote

| Field | Type | Description |
| --- | --- | --- |
| `voteOption` | `IMajorityVoting.VoteOption` | 1 -> abstain, 2 -> yes, 3 -> no |
| `votingPower` | `uint256` | How many tokens the account has allocated to `voteOption` |

### VotingSettings

```solidity
struct VotingSettings {
    MajorityVotingBase.VotingMode votingMode;
    uint32 supportThresholdRatio;
    uint32 minParticipationRatio;
    uint32 minApprovalRatio;
    uint64 proposalDuration;
    uint256 minProposerVotingPower;
}
```

A container for the majority voting settings that will be applied as parameters on proposal creation.

| Field | Type | Description |
| --- | --- | --- |
| `votingMode` | `MajorityVotingBase.VotingMode` | A parameter to select the vote mode. In standard mode (0), the voting power can be increased but votes cannot be replaced. In vote replacement mode (1), voters can change their vote multiple times and only the latest vote option is tallied. |
| `supportThresholdRatio` | `uint32` | The support threshold ratio. Its value has to be in the interval [0, 10^6) defined by `RATIO_BASE = 10**6`. This is intended as the primary metric for proposals to pass. |
| `minParticipationRatio` | `uint32` | The minimum voting power ratio needed for a proposal to reach the minimum participation. Its value has to be in the interval [0, 10^6] defined by `RATIO_BASE = 10**6`. This is a intended as secondary metric to prevent noise or spam from passing unadvertedly. Relatively high ratios are not encouraged. |
| `minApprovalRatio` | `uint32` | Minimum ratio of allocated YES votes. Its value has to be in the interval [0, 10^6] defined by `RATIO_BASE = 10**6`. This is a intended as secondary metric to prevent noise or spam from passing unadvertedly. Relatively high ratios are not encouraged. |
| `proposalDuration` | `uint64` | The duration of the proposal vote in seconds. |
| `minProposerVotingPower` | `uint256` | The minimum voting power required to create a proposal. |
