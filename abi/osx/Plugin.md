---
type: reference
title: Plugin
kind: abstract contract
source: osx/src/common/plugin/Plugin.sol
summary: "An abstract, non-upgradeable contract to inherit from when creating a plugin being deployed via the `new` keyword."
---

# Plugin

**Abstract contract** · [`src/common/plugin/Plugin.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/plugin/Plugin.sol)

**Explained in:** [Choosing a plugin base](../../framework/plugin-types.md), [The plugin model](../../framework/plugins.md)

**Author:** Aragon X - 2022-2024

**Inherits:** [`IPlugin`](./IPlugin.md), `ERC165`, [`DaoAuthorizable`](./DaoAuthorizable.md), [`ProtocolVersion`](./ProtocolVersion.md)

An abstract, non-upgradeable contract to inherit from when creating a plugin being deployed via the `new` keyword.

**security-contact:** sirt@aragon.org

## Functions

### dao

```solidity
function dao() external view returns (IDAO)
```

Selector: `0x4162169f`

Returns the DAO contract.

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

### pluginType

```solidity
function pluginType() external pure returns (IPlugin.PluginType)
```

Selector: `0x41de6830`

Returns the plugin's type

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

Checks if an interface is supported by this or its parent contract.

| Parameter | Type | Description |
| --- | --- | --- |
| `_interfaceId` | `bytes4` | The ID of the interface. |

## Events

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

### SET_TARGET_CONFIG_PERMISSION_ID

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
