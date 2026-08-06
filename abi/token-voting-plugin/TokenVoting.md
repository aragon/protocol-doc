---
title: TokenVoting
kind: contract
source: src/TokenVoting.sol
summary: "The majority voting implementation using an [OpenZeppelin `Votes`](https://docs.openzeppelin.com/contracts/4.x/api/governance#Votes) compatible governance token."
---

# TokenVoting

**Contract** · [`src/TokenVoting.sol`](https://github.com/aragon/token-voting-plugin/blob/e97b783d76872d694f41dfc4bc846405019ca741/src/TokenVoting.sol)

**Author:** Aragon X - 2021-2025

**Inherits:** `IMembership`, [`MajorityVotingBase`](./MajorityVotingBase.md)

The majority voting implementation using an
[OpenZeppelin `Votes`](https://docs.openzeppelin.com/contracts/4.x/api/governance#Votes)
compatible governance token.

> **Dev:** v1.4 (Release 1, Build 4). For each upgrade, if the reinitialization step is required,
> increment the version numbers in the modifier for both the initialize and initializeFrom functions.

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

### canVote

```solidity
function canVote(
    uint256 _proposalId,
    address _account,
    IMajorityVoting.VoteOption _voteOption
) external view returns (bool)
```

Selector: `0x17d1b404`

Checks if an account can participate on a proposal. This can be because the vote - has not started, - has ended, - was executed, or - the voter doesn't have voting powers.

> **Dev:** Reverts if the proposal with the given `_proposalId` does not exist.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The proposal Id. |
| `_account` | `address` | The account address to be checked. |
| `_voteOption` | `IMajorityVoting.VoteOption` | Whether the voter abstains, supports or opposes the proposal. |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | Returns true if the account is allowed to vote. |

### createProposal(bytes,(address,uint256,bytes)[],uint256,uint64,uint64,uint8,bool)

```solidity
function createProposal(
    bytes _metadata,
    Action[] _actions,
    uint256 _allowFailureMap,
    uint64 _startDate,
    uint64 _endDate,
    IMajorityVoting.VoteOption _voteOption,
    bool _tryEarlyExecution
) external returns (uint256 proposalId)
```

Selector: `0x9cba3021`

Creates a new majority voting proposal.

> **Dev:** Requires the `CREATE_PROPOSAL_PERMISSION_ID` permission.

| Parameter | Type | Description |
| --- | --- | --- |
| `_metadata` | `bytes` | The metadata of the proposal. |
| `_actions` | `Action[]` | The actions that will be executed after the proposal passes. |
| `_allowFailureMap` | `uint256` | Allows proposal to succeed even if an action reverts. Uses bitmap representation. If the bit at index `x` is 1, the tx succeeds even if the action at `x` failed. Passing 0 will be treated as atomic execution. |
| `_startDate` | `uint64` | The start date of the proposal vote. If 0, the current timestamp is used and the vote starts immediately. |
| `_endDate` | `uint64` | The end date of the proposal vote. If 0, `_startDate + minDuration` is used. |
| `_voteOption` | `IMajorityVoting.VoteOption` | The chosen vote option to be casted on proposal creation. |
| `_tryEarlyExecution` | `bool` | If `true`, early execution is tried after the vote cast. The call does not revert if early execution is not possible. |

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

### getVoteOption

```solidity
function getVoteOption(
    uint256 _proposalId,
    address _voter
) external view returns (IMajorityVoting.VoteOption)
```

Selector: `0x970601d8`

Returns whether the account has voted for the proposal.

> **Dev:** May return `none` if the `_proposalId` does not exist, or the `_account` does not have voting power.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |
| `_voter` | `address` |  |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `IMajorityVoting.VoteOption` | The vote option cast by a voter for a certain proposal. |

### getVotingToken

```solidity
function getVotingToken() external view returns (IVotesUpgradeable)
```

Selector: `0xe28c3b19`

getter function for the voting token.

> **Dev:** public function also useful for registering interfaceId
> and for distinguishing from majority voting interface.

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

### initialize

```solidity
function initialize(
    IDAO _dao,
    MajorityVotingBase.VotingSettings _votingSettings,
    IVotesUpgradeable _token,
    IPlugin.TargetConfig _targetConfig,
    uint256 _minApprovals,
    bytes _pluginMetadata,
    address[] _excludedAccounts
) external
```

Selector: `0xc502c97c`

Initializes the component.

> **Dev:** This method is required to support [ERC-1822](https://eips.ethereum.org/EIPS/eip-1822).

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `IDAO` | The IDAO interface of the associated DAO. |
| `_votingSettings` | `MajorityVotingBase.VotingSettings` | The voting settings. |
| `_token` | `IVotesUpgradeable` | The [ERC-20](https://eips.ethereum.org/EIPS/eip-20) token to use for voting. If the given token implements https://eips.ethereum.org/EIPS/eip-6372, then `CLOCK_MODE()` or `clock()` will determine the clock type used by the plugin. The token will be assumed to use a block number based clock otherwise. |
| `_targetConfig` | `IPlugin.TargetConfig` | Configuration for the execution target, specifying the target address and operation type (either `Call` or `DelegateCall`). Defined by `TargetConfig` in the `IPlugin` interface, part of the `osx-commons-contracts` package, added in build 3. |
| `_minApprovals` | `uint256` | The minimal amount of approvals the proposal needs to succeed. |
| `_pluginMetadata` | `bytes` | The plugin specific information encoded in bytes. This can also be an ipfs cid encoded in bytes. |
| `_excludedAccounts` | `address[]` |  |

### initializeFrom

```solidity
function initializeFrom(uint16 _fromBuild, bytes _initData) external
```

Selector: `0x10c83f4e`

Reinitializes the TokenVoting after an upgrade from a previous build version. For each
reinitialization step, use the `_fromBuild` version to decide which internal functions to
call for reinitialization.

> **Dev:** WARNING: The contract should only be upgradeable through PSP to ensure that _fromBuild is not
> incorrectly passed, and that the appropriate permissions for the upgrade are properly configured.

| Parameter | Type | Description |
| --- | --- | --- |
| `_fromBuild` | `uint16` | Build version number of previous implementation contract this upgrade is transitioning from. |
| `_initData` | `bytes` | The initialization data to be passed to via `upgradeToAndCall` (see [ERC-1967](https://docs.openzeppelin.com/contracts/4.x/api/proxy#ERC1967Upgrade)). |

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

### isMinApprovalReached

```solidity
function isMinApprovalReached(uint256 _proposalId) external view returns (bool)
```

Selector: `0x36fa9589`

Checks if the min approval value defined as: $$\texttt{minApproval} = \frac{N_\text{yes}}{N_\text{total}}$$ for a proposal is greater or equal than the minimum approval value.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | Returns `true` if the approvals is greater or equal than the minimum approval and `false` otherwise. |

### isMinParticipationReached

```solidity
function isMinParticipationReached(uint256 _proposalId) external view returns (bool)
```

Selector: `0x8a4b00f8`

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

### isSupportThresholdReachedEarly

```solidity
function isSupportThresholdReachedEarly(uint256 _proposalId) external view returns (bool)
```

Selector: `0x0de21856`

Checks if the worst-case support value defined as: $$\texttt{worstCaseSupport} = \frac{N_\text{yes}}{ N_\text{total}-N_\text{abstain}}$$ for a proposal is greater than the support threshold.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | Returns `true` if the worst-case support is greater than the support threshold and `false` otherwise. |

### minApproval

```solidity
function minApproval() external view returns (uint256)
```

Selector: `0x03ff90f6`

Returns the configured minimum approval value.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `uint256` | The minimal approval value. |

### minDuration

```solidity
function minDuration() external view returns (uint64)
```

Selector: `0x56715761`

Returns the minimum duration parameter stored in the voting settings.

### minParticipation

```solidity
function minParticipation() external view returns (uint32)
```

Selector: `0x054fd2c2`

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

### supportThreshold

```solidity
function supportThreshold() external view returns (uint32)
```

Selector: `0x7c36e8e8`

Returns the support threshold parameter stored in the voting settings.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `uint32` | The support threshold parameter. |

### tokenIndexedByTimestamp

```solidity
function tokenIndexedByTimestamp() external view returns (bool)
```

Selector: `0x029dc439`

Wether the token contract indexes past voting power by timestamp.

### totalVotingPower

```solidity
function totalVotingPower(uint256 _timePoint) external view returns (uint256)
```

Selector: `0x536f9f42`

Returns the total voting power checkpointed for a specific timestamp or block number, subtracting the balance of excluded addresses.

| Parameter | Type | Description |
| --- | --- | --- |
| `_timePoint` | `uint256` | The block number or timestamp. |

### updateMinApprovals

```solidity
function updateMinApprovals(uint256 _minApprovals) external
```

Selector: `0xaac91e46`

Updates the minimal approval value.

> **Dev:** Requires the `UPDATE_VOTING_SETTINGS_PERMISSION_ID` permission.

| Parameter | Type | Description |
| --- | --- | --- |
| `_minApprovals` | `uint256` | The new minimal approval value. |

### updateVotingSettings

```solidity
function updateVotingSettings(MajorityVotingBase.VotingSettings _votingSettings) external
```

Selector: `0x0dfb278e`

Updates the voting settings.

> **Dev:** Requires the `UPDATE_VOTING_SETTINGS_PERMISSION_ID` permission.

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

### vote

```solidity
function vote(
    uint256 _proposalId,
    IMajorityVoting.VoteOption _voteOption,
    bool _tryEarlyExecution
) external
```

Selector: `0xce6366c4`

Votes on a proposal and, optionally, executes the proposal.

> **Dev:** `_voteOption`, 1 -> abstain, 2 -> yes, 3 -> no

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |
| `_voteOption` | `IMajorityVoting.VoteOption` | The chosen vote option. |
| `_tryEarlyExecution` | `bool` | If `true`, early execution is tried after the vote cast. The call does not revert if early execution is not possible. |

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

### ExcludedFromSupply

```solidity
event ExcludedFromSupply(address[] accounts)
```

Emitted when an account's balance is considered as non-circulating supply. Its balance will be excluded from the token supply computation.

| Parameter | Type | Description |
| --- | --- | --- |
| `accounts` | `address[]` | The addresses whose balance is considered as not circulating |

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

### VotingMinApprovalUpdated

```solidity
event VotingMinApprovalUpdated(uint256 minApprovals)
```

Emitted when the min approval value is updated.

| Parameter | Type | Description |
| --- | --- | --- |
| `minApprovals` | `uint256` | The minimum amount of yes votes needed for a proposal succeed. |

### VotingSettingsUpdated

```solidity
event VotingSettingsUpdated(
    MajorityVotingBase.VotingMode votingMode,
    uint32 supportThreshold,
    uint32 minParticipation,
    uint64 minDuration,
    uint256 minProposerVotingPower
)
```

Emitted when the voting settings are updated.

| Parameter | Type | Description |
| --- | --- | --- |
| `votingMode` | `MajorityVotingBase.VotingMode` | A parameter to select the vote mode. |
| `supportThreshold` | `uint32` | The support threshold value. |
| `minParticipation` | `uint32` | The minimum participation value. |
| `minDuration` | `uint64` | The minimum duration of the proposal vote in seconds. |
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

### MinDurationOutOfBounds

```solidity
error MinDurationOutOfBounds(uint64 limit, uint64 actual)
```

Thrown if the minimal duration value is out of bounds (less than one hour or greater than 1 year).

| Parameter | Type | Description |
| --- | --- | --- |
| `limit` | `uint64` | The limit value. |
| `actual` | `uint64` | The actual value. |

### NonexistentProposal

```solidity
error NonexistentProposal(uint256 proposalId)
```

Thrown when a proposal doesn't exist.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal which doesn't exist. |

### NoVotingPower

```solidity
error NoVotingPower()
```

Thrown if the voting power is zero

### ProposalAlreadyExists

```solidity
error ProposalAlreadyExists(uint256 proposalId)
```

Thrown if the proposal with same actions and metadata already exists.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The id of the proposal. |

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

### TokenClockMismatch

```solidity
error TokenClockMismatch()
```

Thrown if the token reports an inconsistent clock mode and clock value

### VoteCastForbidden

```solidity
error VoteCastForbidden(
    uint256 proposalId,
    address account,
    IMajorityVoting.VoteOption voteOption
)
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
| `voteOption` | `IMajorityVoting.VoteOption` | The chosen vote option. |

## Constants

_Public, so each is also readable through a generated getter._

### CREATE_PROPOSAL_PERMISSION_ID _(from MajorityVotingBase)_

```solidity
bytes32 public constant CREATE_PROPOSAL_PERMISSION_ID = keccak256("CREATE_PROPOSAL_PERMISSION");
```

Selector: `0x11ce2438`

The ID of the permission required to call the `createProposal` functions.

### EXECUTE_PROPOSAL_PERMISSION_ID _(from MajorityVotingBase)_

```solidity
bytes32 public constant EXECUTE_PROPOSAL_PERMISSION_ID = keccak256("EXECUTE_PROPOSAL_PERMISSION");
```

Selector: `0xcfceb588`

The ID of the permission required to call the `execute` function.

### SET_METADATA_PERMISSION_ID _(from MetadataExtensionUpgradeable)_

```solidity
bytes32 public constant SET_METADATA_PERMISSION_ID = keccak256("SET_METADATA_PERMISSION");
```

Selector: `0xe306bee7`

The ID of the permission required to call the `setMetadata` function.

### SET_TARGET_CONFIG_PERMISSION_ID _(from PluginUUPSUpgradeable)_

```solidity
bytes32 public constant SET_TARGET_CONFIG_PERMISSION_ID =
        keccak256("SET_TARGET_CONFIG_PERMISSION");
```

Selector: `0x8cb75059`

The ID of the permission required to call the `setTargetConfig` function.

### UPDATE_VOTING_SETTINGS_PERMISSION_ID _(from MajorityVotingBase)_

```solidity
bytes32 public constant UPDATE_VOTING_SETTINGS_PERMISSION_ID = keccak256("UPDATE_VOTING_SETTINGS_PERMISSION");
```

Selector: `0x1befc405`

The ID of the permission required to call the `updateVotingSettings` function.

### UPGRADE_PLUGIN_PERMISSION_ID _(from PluginUUPSUpgradeable)_

```solidity
bytes32 public constant UPGRADE_PLUGIN_PERMISSION_ID = keccak256("UPGRADE_PLUGIN_PERMISSION");
```

Selector: `0xc9c4bfca`

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

### PluginType _(from IPlugin)_

```solidity
enum PluginType {
    UUPS,
    Cloneable,
    Constructable
}
```

Types of plugin implementations available within OSx.

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

| Option | Description |
| --- | --- |
| `None` (0) | The default option state of a voter indicating the absence from the vote. This option neither influences support nor participation. |
| `Abstain` (1) | This option does not influence the support but counts towards participation. |
| `Yes` (2) | This option increases the support and counts towards participation. |
| `No` (3) | This option decreases the support and counts towards participation. |

### VotingMode _(from MajorityVotingBase)_

```solidity
enum VotingMode {
    Standard,
    EarlyExecution,
    VoteReplacement
}
```

The different voting modes available.

| Option | Description |
| --- | --- |
| `Standard` (0) | In standard mode, early execution and vote replacement are disabled. |
| `EarlyExecution` (1) | In early execution mode, a proposal can be executed early before the end date if the vote outcome cannot mathematically change by more voters voting. |
| `VoteReplacement` (2) | In vote replacement mode, voters can change their vote multiple times and only the latest vote option is tallied. |

## Structs

### MetadataExtensionStorage _(from MetadataExtensionUpgradeable)_

```solidity
struct MetadataExtensionStorage {
    bytes metadata;
}
```

### Proposal _(from MajorityVotingBase)_

```solidity
struct Proposal {
    bool executed;
    MajorityVotingBase.ProposalParameters parameters;
    MajorityVotingBase.Tally tally;
    mapping(address => IMajorityVoting.VoteOption) voters;
    Action[] actions;
    uint256 allowFailureMap;
    uint256 minApprovalPower;
    IPlugin.TargetConfig targetConfig;
}
```

A container for proposal-related information.

| Field | Type | Description |
| --- | --- | --- |
| `executed` | `bool` | Whether the proposal is executed or not. |
| `parameters` | `MajorityVotingBase.ProposalParameters` | The proposal parameters at the time of the proposal creation. |
| `tally` | `MajorityVotingBase.Tally` | The vote tally of the proposal. |
| `voters` | `mapping(address => IMajorityVoting.VoteOption)` | The votes casted by the voters. |
| `actions` | `Action[]` | The actions to be executed when the proposal passes. |
| `allowFailureMap` | `uint256` | A bitmap allowing the proposal to succeed, even if individual actions might revert. If the bit at index `i` is 1, the proposal succeeds even if the `i`th action reverts. A failure map value of 0 requires every action to not revert. |
| `minApprovalPower` | `uint256` | The minimum amount of yes votes power needed for the proposal advance. |
| `targetConfig` | `IPlugin.TargetConfig` | Configuration for the execution target, specifying the target address and operation type (either `Call` or `DelegateCall`). Defined by `TargetConfig` in the `IPlugin` interface, part of the `osx-commons-contracts` package, added in build 3. |

### ProposalParameters _(from MajorityVotingBase)_

```solidity
struct ProposalParameters {
    MajorityVotingBase.VotingMode votingMode;
    uint32 supportThreshold;
    uint64 startDate;
    uint64 endDate;
    uint64 snapshotTimepoint;
    uint256 minVotingPower;
}
```

A container for the proposal parameters at the time of proposal creation.

| Field | Type | Description |
| --- | --- | --- |
| `votingMode` | `MajorityVotingBase.VotingMode` | A parameter to select the vote mode. |
| `supportThreshold` | `uint32` | The support threshold value. The value has to be in the interval [0, 10^6) defined by `RATIO_BASE = 10**6`. |
| `startDate` | `uint64` | The start date of the proposal vote. |
| `endDate` | `uint64` | The end date of the proposal vote. |
| `snapshotTimepoint` | `uint64` | The number of the block prior to the proposal creation. |
| `minVotingPower` | `uint256` | The minimum voting power needed for a proposal to reach minimum participation. |

### Tally _(from MajorityVotingBase)_

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

### VotingSettings _(from MajorityVotingBase)_

```solidity
struct VotingSettings {
    MajorityVotingBase.VotingMode votingMode;
    uint32 supportThreshold;
    uint32 minParticipation;
    uint64 minDuration;
    uint256 minProposerVotingPower;
}
```

A container for the majority voting settings that will be applied as parameters on proposal creation.

| Field | Type | Description |
| --- | --- | --- |
| `votingMode` | `MajorityVotingBase.VotingMode` | A parameter to select the vote mode. In standard mode (0), early execution and vote replacement are disabled. In early execution mode (1), a proposal can be executed early before the end date if the vote outcome cannot mathematically change by more voters voting. In vote replacement mode (2), voters can change their vote multiple times and only the latest vote option is tallied. |
| `supportThreshold` | `uint32` | The support threshold value. Its value has to be in the interval [0, 10^6) defined by `RATIO_BASE = 10**6`. |
| `minParticipation` | `uint32` | The minimum participation value. Its value has to be in the interval [0, 10^6] defined by `RATIO_BASE = 10**6`. |
| `minDuration` | `uint64` | The minimum duration of the proposal vote in seconds. |
| `minProposerVotingPower` | `uint256` | The minimum voting power required to create a proposal. |
