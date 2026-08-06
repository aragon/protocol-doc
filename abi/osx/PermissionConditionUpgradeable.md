---
title: PermissionConditionUpgradeable
kind: abstract contract
source: src/common/permission/condition/PermissionConditionUpgradeable.sol
summary: "An abstract contract for upgradeable or cloneable contracts to inherit from and to support customary permissions depending on arbitrary on-chain state."
---

# PermissionConditionUpgradeable

**Abstract contract** · [`src/common/permission/condition/PermissionConditionUpgradeable.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/permission/condition/PermissionConditionUpgradeable.sol)

**Author:** Aragon X - 2023

**Inherits:** `ERC165Upgradeable`, [`IPermissionCondition`](./IPermissionCondition.md), [`ProtocolVersion`](./ProtocolVersion.md)

An abstract contract for upgradeable or cloneable contracts to inherit from and to support customary permissions depending on arbitrary on-chain state.

**security-contact:** sirt@aragon.org

## Functions

### isGranted

```solidity
function isGranted(
    address _where,
    address _who,
    bytes32 _permissionId,
    bytes _data
) external view returns (bool isPermitted)
```

Selector: `0x2675fdd0`

Checks if a call is permitted.

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The address of the target contract. |
| `_who` | `address` | The address (EOA or contract) for which the permissions are checked. |
| `_permissionId` | `bytes32` | The permission identifier. |
| `_data` | `bytes` | Optional data passed to the `PermissionCondition` implementation. |

| Returns | Type | Description |
| --- | --- | --- |
| `isPermitted` | `bool` | Returns true if the call is permitted. |

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

## Events

### Initialized

```solidity
event Initialized(uint8 version)
```

> **Dev:** Triggered when the contract has been initialized or reinitialized.
