---
type: reference
title: Admin
kind: contract
source: admin-plugin/packages/contracts/src/Admin.sol
summary: "The admin governance plugin giving execution permission on the DAO to a single address."
---

# Admin

**Contract** · [`packages/contracts/src/Admin.sol`](https://github.com/aragon/admin-plugin/blob/ef1727abafe42022373ef14e933653cdc9a10f05/packages/contracts/src/Admin.sol)

**Explained in:** [Admin Plugin](../../plugins/admin-plugin.md)

**Author:** Aragon X - 2022-2024

**Inherits:** `IMembership`, `PluginCloneable`, `ProposalUpgradeable`

The admin governance plugin giving execution permission on the DAO to a single address.

> **Dev:** v1.2 (Release 1, Build 2)

**security-contact:** sirt@aragon.org

## Functions

### canExecute

```solidity
function canExecute(uint256) external view returns (bool)
```

Selector: `0xcc63604a`

Checks if a proposal can be executed.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | True if the proposal can be executed, false otherwise. |

### createProposal

```solidity
function createProposal(
    bytes _metadata,
    Action[] _actions,
    uint64,
    uint64,
    bytes _data
) external returns (uint256 proposalId)
```

Selector: `0xea65ab82`

Creates a new proposal.

| Parameter | Type | Description |
| --- | --- | --- |
| `_metadata` | `bytes` | The metadata of the proposal. |
| `_actions` | `Action[]` | The actions that will be executed after the proposal passes. |
| `[2]` | `uint64` |  |
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
function execute(uint256) external view
```

Selector: `0xfe0d94c1`

Executes a proposal.

> **Dev:** Note that this function will always revert since this contract doesn't store
> proposals and only executes the actions at run-time. This function is still
> necessary to allow compiling the contract as `Admin` inherits from `IProposal`.

### executeProposal

```solidity
function executeProposal(
    bytes _metadata,
    Action[] _actions,
    uint256 _allowFailureMap
) external returns (uint256 proposalId)
```

Selector: `0x61af5ebe`

Creates and executes a new proposal.

| Parameter | Type | Description |
| --- | --- | --- |
| `_metadata` | `bytes` | The metadata of the proposal. |
| `_actions` | `Action[]` | The actions to be executed. |
| `_allowFailureMap` | `uint256` | A bitmap allowing the proposal to succeed, even if individual actions might revert. If the bit at index `i` is 1, the proposal succeeds even if the `i`th action reverts. A failure map value of 0 requires every action to not revert. |

### getCurrentTargetConfig

```solidity
function getCurrentTargetConfig() external view returns (IPlugin.TargetConfig)
```

Selector: `0xc98425ee`

Returns the currently set target contract.

### getTargetConfig

```solidity
function getTargetConfig() external view returns (IPlugin.TargetConfig)
```

Selector: `0xdd63c06f`

A convenient function to get current target config only if its target is not address(0), otherwise dao().

### hasSucceeded

```solidity
function hasSucceeded(uint256) external view returns (bool)
```

Selector: `0xc218c132`

Whether proposal succeeded or not.

> **Dev:** Note that this must not include time window checks and only make a decision based on the thresholds.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | Returns if proposal has been succeeded or not without including time window checks. |

### initialize

```solidity
function initialize(IDAO _dao, IPlugin.TargetConfig _targetConfig) external
```

Selector: `0x22105785`

Initializes the contract.

> **Dev:** This method is required to support [ERC-1167](https://eips.ethereum.org/EIPS/eip-1167).

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `IDAO` | The associated DAO. |
| `_targetConfig` | `IPlugin.TargetConfig` | Configuration for the execution target, specifying the target address and operation type (either `Call` or `DelegateCall`). Defined by `TargetConfig` in the `IPlugin` interface, part of the `osx-commons-contracts` package, added in build 2. |

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

## Events

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

## Errors

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

### FunctionDeprecated

```solidity
error FunctionDeprecated()
```

### FunctionNotSupported

```solidity
error FunctionNotSupported()
```

> **Dev:** Thrown if the `execute` function is called.

### InvalidTargetConfig

```solidity
error InvalidTargetConfig(IPlugin.TargetConfig targetConfig)
```

Thrown when target is of type 'IDAO', but operation is `delegateCall`.

| Parameter | Type | Description |
| --- | --- | --- |
| `targetConfig` | `IPlugin.TargetConfig` | The target config to update it to. |

## Constants

_Public, so each is also readable through a generated getter._

### EXECUTE_PROPOSAL_PERMISSION_ID

```solidity
bytes32 public constant EXECUTE_PROPOSAL_PERMISSION_ID =
        keccak256("EXECUTE_PROPOSAL_PERMISSION");
```

Value: `0xf281525e53675515a6ba7cc7bea8a81e649b3608423ee2d73be1752cea887889`

The ID of the permission required to call the `executeProposal` function.

### SET_TARGET_CONFIG_PERMISSION_ID _(from PluginCloneable)_

```solidity
bytes32 public constant SET_TARGET_CONFIG_PERMISSION_ID =
        keccak256("SET_TARGET_CONFIG_PERMISSION");
```

Value: `0x568cc693d84eb1901f8bcecba154cbdef23ca3cf67efc0a0b698528a06c660f7`

The ID of the permission required to call the `setTargetConfig` function.

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

## Structs

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
