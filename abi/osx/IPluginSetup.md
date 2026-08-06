---
title: IPluginSetup
kind: interface
source: src/common/plugin/setup/IPluginSetup.sol
summary: "The interface required for a plugin setup contract to be consumed by the `PluginSetupProcessor` for plugin installations, updates, and uninstallations."
---

# IPluginSetup

**Interface** · [`src/common/plugin/setup/IPluginSetup.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/plugin/setup/IPluginSetup.sol)

**Author:** Aragon X - 2022-2023

The interface required for a plugin setup contract to be consumed by the `PluginSetupProcessor` for plugin installations, updates, and uninstallations.

**security-contact:** sirt@aragon.org

## Functions

### implementation

```solidity
function implementation() external view returns (address)
```

Selector: `0x5c60da1b`

Returns the plugin implementation address.

> **Dev:** The implementation can be instantiated via the `new` keyword, cloned via the minimal proxy pattern (see [ERC-1167](https://eips.ethereum.org/EIPS/eip-1167)), or proxied via the UUPS proxy pattern (see [ERC-1822](https://eips.ethereum.org/EIPS/eip-1822)).

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

## Structs

### PreparedSetupData

```solidity
struct PreparedSetupData {
    address[] helpers;
    PermissionLib.MultiTargetPermission[] permissions;
}
```

### SetupPayload

```solidity
struct SetupPayload {
    address plugin;
    address[] currentHelpers;
    bytes data;
}
```
