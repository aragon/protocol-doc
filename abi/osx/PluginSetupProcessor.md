---
type: reference
title: PluginSetupProcessor
kind: contract
source: osx/src/framework/plugin/setup/PluginSetupProcessor.sol
summary: "This contract processes the preparation and application of plugin setups (installation, update, uninstallation) on behalf of a requesting DAO."
---

# PluginSetupProcessor

**Contract** · [`src/framework/plugin/setup/PluginSetupProcessor.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/framework/plugin/setup/PluginSetupProcessor.sol)

**Author:** Aragon X - 2022-2023

**Inherits:** [`ProtocolVersion`](./ProtocolVersion.md)

This contract processes the preparation and application of plugin setups (installation, update, uninstallation) on behalf of a requesting DAO.

> **Dev:** This contract is temporarily granted the `ROOT_PERMISSION_ID` permission on the applying DAO and therefore is highly security critical.

**security-contact:** sirt@aragon.org

## Constructor

### constructor

```solidity
constructor(PluginRepoRegistry _repoRegistry)
```

Constructs the plugin setup processor by setting the associated plugin repo registry.

| Parameter | Type | Description |
| --- | --- | --- |
| `_repoRegistry` | `PluginRepoRegistry` | The plugin repo registry contract. |

## Functions

### applyInstallation

```solidity
function applyInstallation(
    address _dao,
    PluginSetupProcessor.ApplyInstallationParams _params
) external
```

Selector: `0xfe6c3474`

Applies the permissions of a prepared installation to a DAO.

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `address` | The address of the installing DAO. |
| `_params` | `PluginSetupProcessor.ApplyInstallationParams` | The struct containing the parameters for the `applyInstallation` function. |

### applyUninstallation

```solidity
function applyUninstallation(
    address _dao,
    PluginSetupProcessor.ApplyUninstallationParams _params
) external
```

Selector: `0x851d11f8`

Applies the permissions of a prepared uninstallation to a DAO.

> **Dev:** The list of `_params.setupPayload.currentHelpers` has to be specified in the same order as they were returned from previous setups preparation steps (the latest `prepareInstallation` or `prepareUpdate` step that has happened) on which the uninstallation was prepared for.

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `address` | The address of the uninstalling DAO. |
| `_params` | `PluginSetupProcessor.ApplyUninstallationParams` | The struct containing the parameters for the `applyUninstallation` function. |

### applyUpdate

```solidity
function applyUpdate(address _dao, PluginSetupProcessor.ApplyUpdateParams _params) external
```

Selector: `0x22e12c63`

Applies the permissions of a prepared update of an UUPS upgradeable proxy contract to a DAO.

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `address` | The address of the updating DAO. |
| `_params` | `PluginSetupProcessor.ApplyUpdateParams` | The struct containing the parameters for the `applyUpdate` function. |

### prepareInstallation

```solidity
function prepareInstallation(
    address _dao,
    PluginSetupProcessor.PrepareInstallationParams _params
) external returns (address plugin, IPluginSetup.PreparedSetupData preparedSetupData)
```

Selector: `0x3c8c01d1`

Prepares the installation of a plugin.

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `address` | The address of the installing DAO. |
| `_params` | `PluginSetupProcessor.PrepareInstallationParams` | The struct containing the parameters for the `prepareInstallation` function. |

| Returns | Type | Description |
| --- | --- | --- |
| `plugin` | `address` | The prepared plugin contract address. |
| `preparedSetupData` | `IPluginSetup.PreparedSetupData` | The data struct containing the array of helper contracts and permissions that the setup has prepared. |

### prepareUninstallation

```solidity
function prepareUninstallation(
    address _dao,
    PluginSetupProcessor.PrepareUninstallationParams _params
) external returns (PermissionLib.MultiTargetPermission[] permissions)
```

Selector: `0x2fb04336`

Prepares the uninstallation of a plugin.

> **Dev:** The list of `_params.setupPayload.currentHelpers` has to be specified in the same order as they were returned from previous setups preparation steps (the latest `prepareInstallation` or `prepareUpdate` step that has happened) on which the uninstallation was prepared for.

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `address` | The address of the uninstalling DAO. |
| `_params` | `PluginSetupProcessor.PrepareUninstallationParams` | The struct containing the parameters for the `prepareUninstallation` function. |

| Returns | Type | Description |
| --- | --- | --- |
| `permissions` | `PermissionLib.MultiTargetPermission[]` | The list of multi-targeted permission operations to be applied to the uninstalling DAO. |

### prepareUpdate

```solidity
function prepareUpdate(
    address _dao,
    PluginSetupProcessor.PrepareUpdateParams _params
) external returns (bytes initData, IPluginSetup.PreparedSetupData preparedSetupData)
```

Selector: `0xd7598122`

Prepares the update of an UUPS upgradeable plugin.

> **Dev:** The list of `_params.setupPayload.currentHelpers` has to be specified in the same order as they were returned from previous setups preparation steps (the latest `prepareInstallation` or `prepareUpdate` step that has happened) on which the update is prepared for.

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `address` | The address of the DAO For which preparation of update happens. |
| `_params` | `PluginSetupProcessor.PrepareUpdateParams` | The struct containing the parameters for the `prepareUpdate` function. |

| Returns | Type | Description |
| --- | --- | --- |
| `initData` | `bytes` | The initialization data to be passed to upgradeable contracts when the update is applied |
| `preparedSetupData` | `IPluginSetup.PreparedSetupData` | The data struct containing the array of helper contracts and permissions that the setup has prepared. |

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

### repoRegistry

```solidity
function repoRegistry() external view returns (PluginRepoRegistry)
```

Selector: `0x483d209e`

The plugin repo registry listing the `PluginRepo` contracts versioning the `PluginSetup` contracts.

### states

```solidity
function states(
    bytes32
) external view returns (uint256 blockNumber, bytes32 currentAppliedSetupId)
```

Selector: `0xfbdc1ef1`

A mapping between the plugin installation ID (obtained from the DAO and plugin address) and the plugin state information.

> **Dev:** This variable is public on purpose to allow future versions to access and migrate the storage.

### validatePreparedSetupId

```solidity
function validatePreparedSetupId(
    bytes32 pluginInstallationId,
    bytes32 preparedSetupId
) external view
```

Selector: `0xfafc79da`

Validates that a setup ID can be applied for `applyInstallation`, `applyUpdate`, or `applyUninstallation`.

> **Dev:** If the block number stored in `states[pluginInstallationId].blockNumber` exceeds the one stored in `pluginState.preparedSetupIdToBlockNumber[preparedSetupId]`, the prepared setup with `preparedSetupId` is outdated and not applicable anymore.

| Parameter | Type | Description |
| --- | --- | --- |
| `pluginInstallationId` | `bytes32` | The plugin installation ID obtained from the hash of `abi.encode(daoAddress, pluginAddress)`. |
| `preparedSetupId` | `bytes32` | The prepared setup ID to be validated. |

## Events

### InstallationApplied

```solidity
event InstallationApplied(
    address indexed dao,
    address indexed plugin,
    bytes32 preparedSetupId,
    bytes32 appliedSetupId
)
```

Emitted after a plugin installation was applied.

| Parameter | Type | Description |
| --- | --- | --- |
| `dao` | `address` | The address of the DAO to which the plugin belongs. |
| `plugin` | `address` | The address of the plugin contract. |
| `preparedSetupId` | `bytes32` | The prepared setup ID. |
| `appliedSetupId` | `bytes32` | The applied setup ID. |

### InstallationPrepared

```solidity
event InstallationPrepared(
    address indexed sender,
    address indexed dao,
    bytes32 preparedSetupId,
    PluginRepo indexed pluginSetupRepo,
    PluginRepo.Tag versionTag,
    bytes data,
    address plugin,
    IPluginSetup.PreparedSetupData preparedSetupData
)
```

Emitted with a prepared plugin installation to store data relevant for the application step.

| Parameter | Type | Description |
| --- | --- | --- |
| `sender` | `address` | The sender that prepared the plugin installation. |
| `dao` | `address` | The address of the DAO to which the plugin belongs. |
| `preparedSetupId` | `bytes32` | The prepared setup ID obtained from the supplied data. |
| `pluginSetupRepo` | `PluginRepo` | The repository storing the `PluginSetup` contracts of all versions of a plugin. |
| `versionTag` | `PluginRepo.Tag` | The version tag of the plugin setup of the prepared installation. |
| `data` | `bytes` | The bytes-encoded data containing the input parameters for the preparation as specified in the corresponding ABI on the version's metadata. |
| `plugin` | `address` | The address of the plugin contract. |
| `preparedSetupData` | `IPluginSetup.PreparedSetupData` | The deployed plugin's relevant data which consists of helpers and permissions. |

### UninstallationApplied

```solidity
event UninstallationApplied(
    address indexed dao,
    address indexed plugin,
    bytes32 preparedSetupId
)
```

Emitted after a plugin installation was applied.

| Parameter | Type | Description |
| --- | --- | --- |
| `dao` | `address` | The address of the DAO to which the plugin belongs. |
| `plugin` | `address` | The address of the plugin contract. |
| `preparedSetupId` | `bytes32` | The prepared setup ID. |

### UninstallationPrepared

```solidity
event UninstallationPrepared(
    address indexed sender,
    address indexed dao,
    bytes32 preparedSetupId,
    PluginRepo indexed pluginSetupRepo,
    PluginRepo.Tag versionTag,
    IPluginSetup.SetupPayload setupPayload,
    PermissionLib.MultiTargetPermission[] permissions
)
```

Emitted with a prepared plugin uninstallation to store data relevant for the application step.

| Parameter | Type | Description |
| --- | --- | --- |
| `sender` | `address` | The sender that prepared the plugin uninstallation. |
| `dao` | `address` | The address of the DAO to which the plugin belongs. |
| `preparedSetupId` | `bytes32` | The prepared setup ID. |
| `pluginSetupRepo` | `PluginRepo` | The repository storing the `PluginSetup` contracts of all versions of a plugin. |
| `versionTag` | `PluginRepo.Tag` | The version tag of the plugin to used for install preparation. |
| `setupPayload` | `IPluginSetup.SetupPayload` | The payload containing the plugin and helper contract addresses deployed in a preparation step as well as optional data to be consumed by the plugin setup. |
| `permissions` | `PermissionLib.MultiTargetPermission[]` | The list of multi-targeted permission operations to be applied to the installing DAO. |

### UpdateApplied

```solidity
event UpdateApplied(
    address indexed dao,
    address indexed plugin,
    bytes32 preparedSetupId,
    bytes32 appliedSetupId
)
```

Emitted after a plugin update was applied.

| Parameter | Type | Description |
| --- | --- | --- |
| `dao` | `address` | The address of the DAO to which the plugin belongs. |
| `plugin` | `address` | The address of the plugin contract. |
| `preparedSetupId` | `bytes32` | The prepared setup ID. |
| `appliedSetupId` | `bytes32` | The applied setup ID. |

### UpdatePrepared

```solidity
event UpdatePrepared(
    address indexed sender,
    address indexed dao,
    bytes32 preparedSetupId,
    PluginRepo indexed pluginSetupRepo,
    PluginRepo.Tag versionTag,
    IPluginSetup.SetupPayload setupPayload,
    IPluginSetup.PreparedSetupData preparedSetupData,
    bytes initData
)
```

Emitted with a prepared plugin update to store data relevant for the application step.

| Parameter | Type | Description |
| --- | --- | --- |
| `sender` | `address` | The sender that prepared the plugin update. |
| `dao` | `address` | The address of the DAO to which the plugin belongs. |
| `preparedSetupId` | `bytes32` | The prepared setup ID. |
| `pluginSetupRepo` | `PluginRepo` | The repository storing the `PluginSetup` contracts of all versions of a plugin. |
| `versionTag` | `PluginRepo.Tag` | The version tag of the plugin setup of the prepared update. |
| `setupPayload` | `IPluginSetup.SetupPayload` | The payload containing the plugin and helper contract addresses deployed in a preparation step as well as optional data to be consumed by the plugin setup. |
| `preparedSetupData` | `IPluginSetup.PreparedSetupData` | The deployed plugin's relevant data which consists of helpers and permissions. |
| `initData` | `bytes` | The initialization data to be passed to the upgradeable plugin contract. |

## Errors

### InvalidAppliedSetupId

```solidity
error InvalidAppliedSetupId(bytes32 currentAppliedSetupId, bytes32 appliedSetupId)
```

Thrown if the applied setup ID resulting from the supplied setup payload does not match with the current applied setup ID.

| Parameter | Type | Description |
| --- | --- | --- |
| `currentAppliedSetupId` | `bytes32` | The current applied setup ID with which the data in the supplied payload must match. |
| `appliedSetupId` | `bytes32` | The applied setup ID obtained from the data in the supplied setup payload. |

### InvalidUpdateVersion

```solidity
error InvalidUpdateVersion(PluginRepo.Tag currentVersionTag, PluginRepo.Tag newVersionTag)
```

Thrown if the update version is invalid.

| Parameter | Type | Description |
| --- | --- | --- |
| `currentVersionTag` | `PluginRepo.Tag` | The tag of the current version to update from. |
| `newVersionTag` | `PluginRepo.Tag` | The tag of the new version to update to. |

### IPluginNotSupported

```solidity
error IPluginNotSupported(address plugin)
```

Thrown if a contract does not support the `IPlugin` interface.

| Parameter | Type | Description |
| --- | --- | --- |
| `plugin` | `address` | The address of the contract. |

### PluginAlreadyInstalled

```solidity
error PluginAlreadyInstalled()
```

Thrown if plugin is already installed and one tries to prepare or apply install on it.

### PluginNonupgradeable

```solidity
error PluginNonupgradeable(address plugin)
```

Thrown if a plugin is not upgradeable.

| Parameter | Type | Description |
| --- | --- | --- |
| `plugin` | `address` | The address of the plugin contract. |

### PluginProxyUpgradeFailed

```solidity
error PluginProxyUpgradeFailed(address proxy, address implementation, bytes initData)
```

Thrown if the upgrade of an `UUPSUpgradeable` proxy contract (see [ERC-1822](https://eips.ethereum.org/EIPS/eip-1822)) failed.

| Parameter | Type | Description |
| --- | --- | --- |
| `proxy` | `address` | The address of the proxy. |
| `implementation` | `address` | The address of the implementation contract. |
| `initData` | `bytes` | The initialization data to be passed to the upgradeable plugin contract via `upgradeToAndCall`. |

### PluginRepoNonexistent

```solidity
error PluginRepoNonexistent()
```

Thrown if a plugin repository does not exist on the plugin repo registry.

### SetupAlreadyPrepared

```solidity
error SetupAlreadyPrepared(bytes32 preparedSetupId)
```

Thrown if a plugin setup was already prepared indicated by the prepared setup ID.

| Parameter | Type | Description |
| --- | --- | --- |
| `preparedSetupId` | `bytes32` | The prepared setup ID. |

### SetupApplicationUnauthorized

```solidity
error SetupApplicationUnauthorized(address dao, address caller, bytes32 permissionId)
```

Thrown if a setup is unauthorized and cannot be applied because of a missing permission of the associated DAO.

> **Dev:** This is thrown if the `APPLY_INSTALLATION_PERMISSION_ID`, `APPLY_UPDATE_PERMISSION_ID`, or APPLY_UNINSTALLATION_PERMISSION_ID is missing.

| Parameter | Type | Description |
| --- | --- | --- |
| `dao` | `address` | The address of the DAO to which the plugin belongs. |
| `caller` | `address` | The address (EOA or contract) that requested the application of a setup on the associated DAO. |
| `permissionId` | `bytes32` | The permission identifier. |

### SetupNotApplicable

```solidity
error SetupNotApplicable(bytes32 preparedSetupId)
```

Thrown if a prepared setup ID is not eligible to be applied. This can happen if another setup has been already applied or if the setup wasn't prepared in the first place.

| Parameter | Type | Description |
| --- | --- | --- |
| `preparedSetupId` | `bytes32` | The prepared setup ID. |

## Constants

_Public, so each is also readable through a generated getter._

### APPLY_INSTALLATION_PERMISSION_ID

```solidity
bytes32 public constant APPLY_INSTALLATION_PERMISSION_ID =
        keccak256("APPLY_INSTALLATION_PERMISSION");
```

Value: `0xf796b89427c6552c1ac705d833bfb7909f8eb5ce502c1db97f85fabc6ad83548`

The ID of the permission required to call the `applyInstallation` function.

### APPLY_UNINSTALLATION_PERMISSION_ID

```solidity
bytes32 public constant APPLY_UNINSTALLATION_PERMISSION_ID =
        keccak256("APPLY_UNINSTALLATION_PERMISSION");
```

Value: `0xbd4dbacf5ba6d9793f600403b3293d6ecd695fcc703a2b5edcf245f45fda6cfa`

The ID of the permission required to call the `applyUninstallation` function.

### APPLY_UPDATE_PERMISSION_ID

```solidity
bytes32 public constant APPLY_UPDATE_PERMISSION_ID = keccak256("APPLY_UPDATE_PERMISSION");
```

Value: `0xb03cf3d518f6d49560b7f5bece1ccb8fd50ea7370f02f5e5210edba04be3c4f7`

The ID of the permission required to call the `applyUpdate` function.

## Structs

### ApplyInstallationParams

```solidity
struct ApplyInstallationParams {
    PluginSetupRef pluginSetupRef;
    address plugin;
    PermissionLib.MultiTargetPermission[] permissions;
    bytes32 helpersHash;
}
```

### ApplyUninstallationParams

```solidity
struct ApplyUninstallationParams {
    address plugin;
    PluginSetupRef pluginSetupRef;
    PermissionLib.MultiTargetPermission[] permissions;
}
```

### ApplyUpdateParams

```solidity
struct ApplyUpdateParams {
    address plugin;
    PluginSetupRef pluginSetupRef;
    bytes initData;
    PermissionLib.MultiTargetPermission[] permissions;
    bytes32 helpersHash;
}
```

### PluginState

```solidity
struct PluginState {
    uint256 blockNumber;
    bytes32 currentAppliedSetupId;
    mapping(bytes32 => uint256) preparedSetupIdToBlockNumber;
}
```

### PrepareInstallationParams

```solidity
struct PrepareInstallationParams {
    PluginSetupRef pluginSetupRef;
    bytes data;
}
```

### PrepareUninstallationParams

```solidity
struct PrepareUninstallationParams {
    PluginSetupRef pluginSetupRef;
    IPluginSetup.SetupPayload setupPayload;
}
```

### PrepareUpdateParams

```solidity
struct PrepareUpdateParams {
    PluginRepo.Tag currentVersionTag;
    PluginRepo.Tag newVersionTag;
    PluginRepo pluginSetupRepo;
    IPluginSetup.SetupPayload setupPayload;
}
```
