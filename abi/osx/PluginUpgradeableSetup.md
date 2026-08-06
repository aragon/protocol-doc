---
type: reference
title: PluginUpgradeableSetup
kind: abstract contract
source: osx/src/common/plugin/setup/PluginUpgradeableSetup.sol
summary: "An abstract contract to inherit from to implement the plugin setup for upgradeable plugins, i.e, `PluginUUPSUpgradeable` being deployed via the UUPS pattern…"
---

# PluginUpgradeableSetup

**Abstract contract** · [`src/common/plugin/setup/PluginUpgradeableSetup.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/plugin/setup/PluginUpgradeableSetup.sol)

**Author:** Aragon X - 2022-2024

**Inherits:** `ERC165`, [`IPluginSetup`](./IPluginSetup.md), [`ProtocolVersion`](./ProtocolVersion.md)

An abstract contract to inherit from to implement the plugin setup for upgradeable plugins, i.e, `PluginUUPSUpgradeable` being deployed via the UUPS pattern (see [ERC-1822](https://eips.ethereum.org/EIPS/eip-1822) and [ERC-1967](https://eips.ethereum.org/EIPS/eip-1967)).

**security-contact:** sirt@aragon.org

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
    address _dao,
    bytes _data
) external returns (address plugin, IPluginSetup.PreparedSetupData preparedSetupData)
```

Selector: `0xf10832f1`

Prepares the installation of a plugin.

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `address` | The address of the installing DAO. |
| `_data` | `bytes` | The bytes-encoded data containing the input parameters for the installation as specified in the plugin's build metadata JSON file. |

| Returns | Type | Description |
| --- | --- | --- |
| `plugin` | `address` | The address of the `Plugin` contract being prepared for installation. |
| `preparedSetupData` | `IPluginSetup.PreparedSetupData` | The deployed plugin's relevant data which consists of helpers and permissions. |

### prepareUninstallation

```solidity
function prepareUninstallation(
    address _dao,
    IPluginSetup.SetupPayload _payload
) external returns (PermissionLib.MultiTargetPermission[] permissions)
```

Selector: `0x9cb0a124`

Prepares the uninstallation of a plugin.

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `address` | The address of the uninstalling DAO. |
| `_payload` | `IPluginSetup.SetupPayload` | The relevant data necessary for the `prepareUninstallation`. See above. |

| Returns | Type | Description |
| --- | --- | --- |
| `permissions` | `PermissionLib.MultiTargetPermission[]` | The array of multi-targeted permission operations to be applied by the `PluginSetupProcessor` to the uninstalling DAO. |

### prepareUpdate

```solidity
function prepareUpdate(
    address _dao,
    uint16 _fromBuild,
    IPluginSetup.SetupPayload _payload
) external returns (bytes initData, IPluginSetup.PreparedSetupData preparedSetupData)
```

Selector: `0xa8a9c29e`

Prepares the update of a plugin.

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `address` | The address of the updating DAO. |
| `_fromBuild` | `uint16` | The build number of the plugin to update from. |
| `_payload` | `IPluginSetup.SetupPayload` | The relevant data necessary for the `prepareUpdate`. See above. |

| Returns | Type | Description |
| --- | --- | --- |
| `initData` | `bytes` | The initialization data to be passed to upgradeable contracts when the update is applied in the `PluginSetupProcessor`. |
| `preparedSetupData` | `IPluginSetup.PreparedSetupData` | The deployed plugin's relevant data which consists of helpers and permissions. |

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

### InvalidUpdatePath

```solidity
error InvalidUpdatePath(uint16 fromBuild, uint16 thisBuild)
```

Thrown when an update path is not available, for example, if this is the initial build.

| Parameter | Type | Description |
| --- | --- | --- |
| `fromBuild` | `uint16` | The build number to update from. |
| `thisBuild` | `uint16` | The build number of this setup to update to. |

## Structs

### PreparedSetupData _(from IPluginSetup)_

```solidity
struct PreparedSetupData {
    address[] helpers;
    PermissionLib.MultiTargetPermission[] permissions;
}
```

### SetupPayload _(from IPluginSetup)_

```solidity
struct SetupPayload {
    address plugin;
    address[] currentHelpers;
    bytes data;
}
```
