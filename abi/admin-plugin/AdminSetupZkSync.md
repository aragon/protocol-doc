---
type: reference
title: AdminSetupZkSync
kind: contract
source: admin-plugin/packages/contracts/src/zkSync/AdminSetupZkSync.sol
summary: "The setup contract of the `Admin` plugin."
---

# AdminSetupZkSync

**Contract** · [`packages/contracts/src/zkSync/AdminSetupZkSync.sol`](https://github.com/aragon/admin-plugin/blob/ef1727abafe42022373ef14e933653cdc9a10f05/packages/contracts/src/zkSync/AdminSetupZkSync.sol)

**AdminAddressSetup**

**Author:** Aragon X - 2022-2024

**Inherits:** `PluginSetup`

The setup contract of the `Admin` plugin.

> **Dev:** v1.2 (Release 1, Build 2)

**security-contact:** sirt@aragon.org

## Constructor

### constructor

```solidity
constructor()
```

The constructor setting the `Admin` implementation contract to clone from.

> **Dev:** Since this is only ment to be used for zkSync we pass address(0) as implementation

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
| `preparedSetupData` | [`IPluginSetup.PreparedSetupData`](#preparedsetupdata) | The deployed plugin's relevant data which consists of helpers and permissions. |

### prepareUninstallation

```solidity
function prepareUninstallation(
    address _dao,
    IPluginSetup.SetupPayload _payload
) external pure returns (PermissionLib.MultiTargetPermission[] permissions)
```

Selector: `0x9cb0a124`

Prepares the uninstallation of a plugin.

> **Dev:** Currently, there is no reliable way to revoke the `ADMIN_EXECUTE_PERMISSION_ID` from all addresses
> it has been granted to. Accordingly, only the `EXECUTE_PERMISSION_ID` is revoked for this uninstallation.

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `address` | The address of the uninstalling DAO. |
| `_payload` | [`IPluginSetup.SetupPayload`](#setuppayload) | The relevant data necessary for the `prepareUninstallation`. See above. |

| Returns | Type | Description |
| --- | --- | --- |
| `permissions` | `PermissionLib.MultiTargetPermission[]` | The array of multi-targeted permission operations to be applied by the `PluginSetupProcessor` to the uninstalling DAO. |

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

### AdminAddressInvalid

```solidity
error AdminAddressInvalid(address admin)
```

Thrown if the admin address is zero.

| Parameter | Type | Description |
| --- | --- | --- |
| `admin` | `address` | The admin address. |

### NonUpgradeablePlugin

```solidity
error NonUpgradeablePlugin()
```

Thrown when attempting to prepare an update on a non-upgradeable plugin.

## Constants

_Public, so each is also readable through a generated getter._

### EXECUTE_PROPOSAL_PERMISSION_ID

```solidity
bytes32 public constant EXECUTE_PROPOSAL_PERMISSION_ID =
        keccak256("EXECUTE_PROPOSAL_PERMISSION");
```

Value: `0xf281525e53675515a6ba7cc7bea8a81e649b3608423ee2d73be1752cea887889`

The ID of the permission required to call the `executeProposal` function.

## Structs

### PreparedSetupData

_Inherited from `IPluginSetup`._

```solidity
struct PreparedSetupData {
    address[] helpers;
    PermissionLib.MultiTargetPermission[] permissions;
}
```

The data associated with a prepared setup.

| Field | Type | Description |
| --- | --- | --- |
| `helpers` | `address[]` | The address array of helpers (contracts or EOAs) associated with this plugin version after the installation or update. |
| `permissions` | `PermissionLib.MultiTargetPermission[]` | The array of multi-targeted permission operations to be applied by the `PluginSetupProcessor` to the installing or updating DAO. |

### SetupPayload

_Inherited from `IPluginSetup`._

```solidity
struct SetupPayload {
    address plugin;
    address[] currentHelpers;
    bytes data;
}
```

The payload for plugin updates and uninstallations containing the existing contracts as well as optional data to be consumed by the plugin setup.

| Field | Type | Description |
| --- | --- | --- |
| `plugin` | `address` | The address of the `Plugin`. |
| `currentHelpers` | `address[]` | The address array of all current helpers (contracts or EOAs) associated with the plugin to update from. |
| `data` | `bytes` | The bytes-encoded data containing the input parameters for the preparation of update/uninstall as specified in the corresponding ABI on the version's metadata. |
