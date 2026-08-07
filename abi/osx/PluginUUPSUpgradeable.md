---
type: reference
title: PluginUUPSUpgradeable
kind: abstract contract
source: osx/src/common/plugin/PluginUUPSUpgradeable.sol
summary: "An abstract, upgradeable contract to inherit from when creating a plugin being deployed via the UUPS pattern (see…"
---

# PluginUUPSUpgradeable

**Abstract contract** · [`src/common/plugin/PluginUUPSUpgradeable.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/plugin/PluginUUPSUpgradeable.sol)

**Explained in:** [Choosing a plugin base](../../framework/plugin-types.md), [Deploy your first DAO](../../guides/deploy-a-dao.md), [Update a plugin](../../guides/update-a-plugin.md)

**Author:** Aragon X - 2022-2024

**Inherits:** [`IPlugin`](./IPlugin.md), `ERC165Upgradeable`, `UUPSUpgradeable`, [`DaoAuthorizableUpgradeable`](./DaoAuthorizableUpgradeable.md), [`ProtocolVersion`](./ProtocolVersion.md)

An abstract, upgradeable contract to inherit from when creating a plugin being deployed via the UUPS pattern (see [ERC-1822](https://eips.ethereum.org/EIPS/eip-1822)).

**security-contact:** sirt@aragon.org

## Functions

### dao

```solidity
function dao() external view returns (IDAO)
```

Selector: `0x4162169f`

Returns the DAO contract.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | [`IDAO`](./IDAO.md) |  |

### getCurrentTargetConfig

```solidity
function getCurrentTargetConfig() external view returns (IPlugin.TargetConfig)
```

Selector: `0xc98425ee`

Returns the currently set target contract.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | [`IPlugin.TargetConfig`](#targetconfig) |  |

### getTargetConfig

```solidity
function getTargetConfig() external view returns (IPlugin.TargetConfig)
```

Selector: `0xdd63c06f`

A convenient function to get current target config only if its target is not address(0), otherwise dao().

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | [`IPlugin.TargetConfig`](#targetconfig) |  |

### implementation

```solidity
function implementation() external view returns (address)
```

Selector: `0x5c60da1b`

Returns the address of the implementation contract in the [proxy storage slot](https://eips.ethereum.org/EIPS/eip-1967) slot the [UUPS proxy](https://eips.ethereum.org/EIPS/eip-1822) is pointing to.

### pluginType

```solidity
function pluginType() external pure returns (IPlugin.PluginType)
```

Selector: `0x41de6830`

Returns the plugin's type

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | [`IPlugin.PluginType`](#plugintype) |  |

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

Checks if an interface is supported by this or its parent contract.

| Parameter | Type | Description |
| --- | --- | --- |
| `_interfaceId` | `bytes4` | The ID of the interface. |

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
| `targetConfig` | [`IPlugin.TargetConfig`](#targetconfig) | The target config to update it to. |

## Constants

_Public, so each is also readable through a generated getter._

### SET_TARGET_CONFIG_PERMISSION_ID

```solidity
bytes32 public constant SET_TARGET_CONFIG_PERMISSION_ID =
        keccak256("SET_TARGET_CONFIG_PERMISSION");
```

Value: `0x568cc693d84eb1901f8bcecba154cbdef23ca3cf67efc0a0b698528a06c660f7`

The ID of the permission required to call the `setTargetConfig` function.

### UPGRADE_PLUGIN_PERMISSION_ID

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

| Option | Value |
| --- | --- |
| `UUPS` | `0` |
| `Cloneable` | `1` |
| `Constructable` | `2` |

## Structs

### TargetConfig

_Inherited from `IPlugin`._

```solidity
struct TargetConfig {
    address target;
    IPlugin.Operation operation;
}
```

| Field | Type | Description |
| --- | --- | --- |
| `target` | `address` |  |
| `operation` | [`IPlugin.Operation`](#operation) |  |
