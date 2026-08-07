---
type: reference
title: MinVotingPowerCondition
kind: contract
source: lock-to-vote-plugin/src/conditions/MinVotingPowerCondition.sol
summary: "Checks if an account's voting power or token balance meets the threshold defined on the given plugin."
---

# MinVotingPowerCondition

**Contract** · [`src/conditions/MinVotingPowerCondition.sol`](https://github.com/aragon/lock-to-vote-plugin/blob/5a513e3d9f1aad35d8926de87c408720e8d20a8d/src/conditions/MinVotingPowerCondition.sol)

**Explained in:** [Lock to Vote Plugin](../../plugins/lock-to-vote-plugin.md)

**Author:** Aragon X - 2024

**Inherits:** `PermissionCondition`

Checks if an account's voting power or token balance meets the threshold defined on the given plugin.

**security-contact:** sirt@aragon.org

## Constructor

### constructor

```solidity
constructor(ILockToGovernBase _plugin)
```

Initializes the contract with the `ILockToGovernBase` plugin address and caches the associated token.

| Parameter | Type | Description |
| --- | --- | --- |
| `_plugin` | `ILockToGovernBase` | The address of the `ILockToGovernBase` plugin. |

## Functions

### getRequiredLockAmount

```solidity
function getRequiredLockAmount(address _who) external view returns (uint256)
```

Selector: `0x0e14d0d6`

### isGranted

```solidity
function isGranted(
    address _where,
    address _who,
    bytes32 _permissionId,
    bytes _data
) external view returns (bool)
```

Selector: `0x2675fdd0`

Checks if a call is permitted.

> **Dev:** The function checks both the voting power and token balance to ensure `_who` meets the minimum voting
> threshold defined in the `TokenVoting` plugin. Returns `false` if the minimum requirement is unmet.

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The address of the target contract. |
| `_who` | `address` | The address (EOA or contract) for which the permissions are checked. |
| `_permissionId` | `bytes32` | The permission identifier. |
| `_data` | `bytes` | Optional data passed to the `PermissionCondition` implementation. |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | Returns true if the call is permitted. |

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

### supportsInterface

```solidity
function supportsInterface(bytes4 _interfaceId) external view returns (bool)
```

Selector: `0x01ffc9a7`

Checks if an interface is supported by this or its parent contract.

| Parameter | Type | Description |
| --- | --- | --- |
| `_interfaceId` | `bytes4` | The ID of the interface. |

## Constants

_Public, so each is also readable through a generated getter._

### lockManager

```solidity
ILockManager public immutable lockManager;
```

The address of the LockManager used by the plugin.

### plugin

```solidity
ILockToGovernBase public immutable plugin;
```

The address of the `ILockToGovernBase` plugin used to fetch the settings from.

### token

```solidity
IERC20 public immutable token;
```

The `IERC20` token interface used to check token balance.
