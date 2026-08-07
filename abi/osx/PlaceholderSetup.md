---
type: reference
title: PlaceholderSetup
kind: contract
source: osx/src/framework/plugin/repo/placeholder/PlaceholderSetup.sol
summary: "A placeholder setup contract for outdated plugin builds."
---

# PlaceholderSetup

**Contract** · [`src/framework/plugin/repo/placeholder/PlaceholderSetup.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/framework/plugin/repo/placeholder/PlaceholderSetup.sol)

**Author:** Aragon X - 2023

**Inherits:** [`PluginSetup`](./PluginSetup.md)

A placeholder setup contract for outdated plugin builds. When moving plugin repos to new chains or layers, where only the latest release and build should be available, this placeholder can be used to populate previous builds.

**security-contact:** sirt@aragon.org

## Constructor

### constructor

```solidity
constructor()
```

## Functions

### implementation

```solidity
function implementation() external view returns (address)
```

Selector: `0x5c60da1b`

Returns the plugin implementation address.

> **Dev:** The implementation can be instantiated via the `new` keyword, cloned via the minimal proxy pattern (see [ERC-1167](https://eips.ethereum.org/EIPS/eip-1167)), or proxied via the UUPS proxy pattern (see [ERC-1822](https://eips.ethereum.org/EIPS/eip-1822)).

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `address` | The address of the plugin implementation contract. |

### prepareInstallation

```solidity
function prepareInstallation(
    address,
    bytes
) external pure returns (address, IPluginSetup.PreparedSetupData)
```

Selector: `0xf10832f1`

Prepares the installation of a plugin.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `address` | The address of the `Plugin` contract being prepared for installation. |
| `[1]` | [`IPluginSetup.PreparedSetupData`](#preparedsetupdata) | The deployed plugin's relevant data which consists of helpers and permissions. |

### prepareUninstallation

```solidity
function prepareUninstallation(
    address,
    IPluginSetup.SetupPayload
) external pure returns (PermissionLib.MultiTargetPermission[])
```

Selector: `0x9cb0a124`

Prepares the uninstallation of a plugin.

| Parameter | Type | Description |
| --- | --- | --- |
| `[0]` | `address` |  |
| `[1]` | [`IPluginSetup.SetupPayload`](#setuppayload) |  |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `PermissionLib.MultiTargetPermission[]` | The array of multi-targeted permission operations to be applied by the `PluginSetupProcessor` to the uninstalling DAO. |

### prepareUpdate

```solidity
function prepareUpdate(
    address _dao,
    uint16 _fromBuild,
    IPluginSetup.SetupPayload _payload
) external returns (bytes, IPluginSetup.PreparedSetupData)
```

Selector: `0xa8a9c29e`

Prepares the update of a plugin.

> **Dev:** Since the underlying plugin is non-upgradeable, this non-virtual function must always revert.

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `address` | The address of the updating DAO. |
| `_fromBuild` | `uint16` | The build number of the plugin to update from. |
| `_payload` | [`IPluginSetup.SetupPayload`](#setuppayload) | The relevant data necessary for the `prepareUpdate`. See above. |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bytes` | The initialization data to be passed to upgradeable contracts when the update is applied in the `PluginSetupProcessor`. |
| `[1]` | [`IPluginSetup.PreparedSetupData`](#preparedsetupdata) | The deployed plugin's relevant data which consists of helpers and permissions. |

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

Checks if this or the parent contract supports an interface by its ID.

| Parameter | Type | Description |
| --- | --- | --- |
| `_interfaceId` | `bytes4` | The ID of the interface. |

## Errors

### NonUpgradeablePlugin

```solidity
error NonUpgradeablePlugin()
```

Thrown when attempting to prepare an update on a non-upgradeable plugin.

### PlaceholderSetupCannotBeUsed

```solidity
error PlaceholderSetupCannotBeUsed()
```

Thrown if the dummy is used.

## Structs

### PreparedSetupData

_Inherited from `IPluginSetup`._

```solidity
struct PreparedSetupData {
    address[] helpers;
    PermissionLib.MultiTargetPermission[] permissions;
}
```

### SetupPayload

_Inherited from `IPluginSetup`._

```solidity
struct SetupPayload {
    address plugin;
    address[] currentHelpers;
    bytes data;
}
```
