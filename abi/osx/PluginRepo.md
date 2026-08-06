---
title: PluginRepo
kind: contract
source: src/framework/plugin/repo/PluginRepo.sol
summary: "The plugin repository contract required for managing and publishing different plugin versions within the Aragon DAO framework."
---

# PluginRepo

**Contract** · [`src/framework/plugin/repo/PluginRepo.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/framework/plugin/repo/PluginRepo.sol)

**Author:** Aragon X - 2020 - 2023

**Inherits:** `Initializable`, `ERC165Upgradeable`, [`IPluginRepo`](./IPluginRepo.md), `UUPSUpgradeable`, [`ProtocolVersion`](./ProtocolVersion.md), [`PermissionManager`](./PermissionManager.md)

The plugin repository contract required for managing and publishing different plugin versions within the Aragon DAO framework.

**security-contact:** sirt@aragon.org

## Constructor

### constructor

```solidity
constructor()
```

> **Dev:** Used to disallow initializing the implementation contract by an attacker for extra safety.

## Functions

### applyMultiTargetPermissions

```solidity
function applyMultiTargetPermissions(PermissionLib.MultiTargetPermission[] _items) external
```

Selector: `0xe978afe5`

Applies an array of permission operations on multiple target contracts `items[i].where`.

| Parameter | Type | Description |
| --- | --- | --- |
| `_items` | `PermissionLib.MultiTargetPermission[]` | The array of multi-targeted permission operations to apply. |

### applySingleTargetPermissions

```solidity
function applySingleTargetPermissions(
    address _where,
    PermissionLib.SingleTargetPermission[] items
) external
```

Selector: `0x22844d04`

Applies an array of permission operations on a single target contracts `_where`.

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The address of the single target contract. |
| `items` | `PermissionLib.SingleTargetPermission[]` | The array of single-targeted permission operations to apply. |

### buildCount

```solidity
function buildCount(uint8 _release) external view returns (uint256)
```

Selector: `0xdf1d6c44`

Gets the total number of builds for a given release number.

| Parameter | Type | Description |
| --- | --- | --- |
| `_release` | `uint8` | The release number. |

### createVersion

```solidity
function createVersion(
    uint8 _release,
    address _pluginSetup,
    bytes _buildMetadata,
    bytes _releaseMetadata
) external
```

Selector: `0xfc054427`

Creates a new plugin version as the latest build for an existing release number or the first build for a new release number for the provided `PluginSetup` contract address and metadata.

| Parameter | Type | Description |
| --- | --- | --- |
| `_release` | `uint8` | The release number. |
| `_pluginSetup` | `address` |  |
| `_buildMetadata` | `bytes` | The build metadata URI. |
| `_releaseMetadata` | `bytes` | The release metadata URI. |

### getLatestVersion(address)

```solidity
function getLatestVersion(address _pluginSetup) external view returns (PluginRepo.Version)
```

Selector: `0x50abe910`

Returns the latest version for a given plugin setup.

| Parameter | Type | Description |
| --- | --- | --- |
| `_pluginSetup` | `address` | The plugin setup address |

### getLatestVersion(uint8)

```solidity
function getLatestVersion(uint8 _release) external view returns (PluginRepo.Version)
```

Selector: `0xe0589bd3`

Returns the latest version for a given release number.

| Parameter | Type | Description |
| --- | --- | --- |
| `_release` | `uint8` | The release number. |

### getVersion((uint8,uint16))

```solidity
function getVersion(PluginRepo.Tag _tag) external view returns (PluginRepo.Version)
```

Selector: `0x9af3e909`

Returns the version associated with a tag.

| Parameter | Type | Description |
| --- | --- | --- |
| `_tag` | `PluginRepo.Tag` | The version tag. |

### getVersion(bytes32)

```solidity
function getVersion(bytes32 _tagHash) external view returns (PluginRepo.Version)
```

Selector: `0x9aaf9f08`

Returns the version for a tag hash.

| Parameter | Type | Description |
| --- | --- | --- |
| `_tagHash` | `bytes32` | The tag hash. |

### grant

```solidity
function grant(address _where, address _who, bytes32 _permissionId) external
```

Selector: `0xd68bad2c`

Grants permission to an address to call methods in a contract guarded by an auth modifier with the specified permission identifier.

> **Dev:** Requires the `ROOT_PERMISSION_ID` permission.
> Note, that granting permissions with `_who` or `_where` equal to `ANY_ADDR` does not replace other permissions with specific `_who` and `_where` addresses that exist in parallel.

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The address of the target contract for which `_who` receives permission. |
| `_who` | `address` | The address (EOA or contract) receiving the permission. |
| `_permissionId` | `bytes32` | The permission identifier. |

### grantWithCondition

```solidity
function grantWithCondition(
    address _where,
    address _who,
    bytes32 _permissionId,
    IPermissionCondition _condition
) external
```

Selector: `0xc9dbc2a4`

Grants permission to an address to call methods in a target contract guarded by an auth modifier with the specified permission identifier if the referenced condition permits it.

> **Dev:** Requires the `ROOT_PERMISSION_ID` permission
> Note, that granting permissions with `_who` or `_where` equal to `ANY_ADDR` does not replace other permissions with specific `_who` and `_where` addresses that exist in parallel.

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The address of the target contract for which `_who` receives permission. |
| `_who` | `address` | The address (EOA or contract) receiving the permission. |
| `_permissionId` | `bytes32` | The permission identifier. |
| `_condition` | `IPermissionCondition` | The `PermissionCondition` that will be asked for authorization on calls connected to the specified permission identifier. |

### initialize

```solidity
function initialize(address initialOwner) external
```

Selector: `0xc4d66de8`

Initializes the contract by
- initializing the permission manager
- granting the `MAINTAINER_PERMISSION_ID` permission to the initial owner.

> **Dev:** This method is required to support [ERC-1822](https://eips.ethereum.org/EIPS/eip-1822).

### initializeFrom

```solidity
function initializeFrom(uint8[3] _previousProtocolVersion, bytes _initData) external
```

Selector: `0x42d8e99e`

Initializes the pluginRepo after an upgrade from a previous protocol version.

> **Dev:** This function is a placeholder until we require reinitialization.

| Parameter | Type | Description |
| --- | --- | --- |
| `_previousProtocolVersion` | `uint8[3]` | The semantic protocol version number of the previous DAO implementation contract this upgrade is transitioning from. |
| `_initData` | `bytes` | The initialization data to be passed to via `upgradeToAndCall` (see [ERC-1967](https://docs.openzeppelin.com/contracts/4.x/api/proxy#ERC1967Upgrade)). |

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

Checks if the caller address has permission on the target contract via a permission identifier and relays the answer to a condition contract if this was declared during the granting process.

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The address of the target contract for which `_who` receives permission. |
| `_who` | `address` | The address (EOA or contract) for which the permission is checked. |
| `_permissionId` | `bytes32` | The permission identifier. |
| `_data` | `bytes` | Optional data to be passed to the set `PermissionCondition`. |

### latestRelease

```solidity
function latestRelease() external view returns (uint8)
```

Selector: `0x7be0ca5e`

The ID of the latest release.

> **Dev:** The maximum release number is 255.

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

### revoke

```solidity
function revoke(address _where, address _who, bytes32 _permissionId) external
```

Selector: `0xd96054c4`

Revokes permission from an address to call methods in a target contract guarded by an auth modifier with the specified permission identifier.

> **Dev:** Requires the `ROOT_PERMISSION_ID` permission.
> Note, that revoking permissions with `_who` or `_where` equal to `ANY_ADDR` does not revoke other permissions with specific `_who` and `_where` addresses that exist in parallel.

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The address of the target contract for which `_who` loses permission. |
| `_who` | `address` | The address (EOA or contract) losing the permission. |
| `_permissionId` | `bytes32` | The permission identifier. |

### supportsInterface

```solidity
function supportsInterface(bytes4 _interfaceId) external view returns (bool)
```

Selector: `0x01ffc9a7`

Checks if this or the parent contract supports an interface by its ID.

| Parameter | Type | Description |
| --- | --- | --- |
| `_interfaceId` | `bytes4` | The ID of the interface. |

### updateReleaseMetadata

```solidity
function updateReleaseMetadata(uint8 _release, bytes _releaseMetadata) external
```

Selector: `0x28375f67`

Updates the metadata for release with content `@fromHex(_releaseMetadata)`.

| Parameter | Type | Description |
| --- | --- | --- |
| `_release` | `uint8` | The release number. |
| `_releaseMetadata` | `bytes` | The release metadata URI. |

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

### Granted

```solidity
event Granted(
    bytes32 indexed permissionId,
    address indexed here,
    address where,
    address indexed who,
    address condition
)
```

Emitted when a permission `permission` is granted in the context `here` to the address `_who` for the contract `_where`.

| Parameter | Type | Description |
| --- | --- | --- |
| `permissionId` | `bytes32` | The permission identifier. |
| `here` | `address` | The address of the context in which the permission is granted. |
| `where` | `address` | The address of the target contract for which `_who` receives permission. |
| `who` | `address` | The address (EOA or contract) receiving the permission. |
| `condition` | `address` | The address `ALLOW_FLAG` for regular permissions or, alternatively, the `IPermissionCondition` contract implementation to be used. |

### Initialized

```solidity
event Initialized(uint8 version)
```

> **Dev:** Triggered when the contract has been initialized or reinitialized.

### ReleaseMetadataUpdated

```solidity
event ReleaseMetadataUpdated(uint8 release, bytes releaseMetadata)
```

Emitted when a release's metadata was updated.

| Parameter | Type | Description |
| --- | --- | --- |
| `release` | `uint8` | The release number. |
| `releaseMetadata` | `bytes` | The release metadata URI. |

### Revoked

```solidity
event Revoked(
    bytes32 indexed permissionId,
    address indexed here,
    address where,
    address indexed who
)
```

Emitted when a permission `permission` is revoked in the context `here` from the address `_who` for the contract `_where`.

| Parameter | Type | Description |
| --- | --- | --- |
| `permissionId` | `bytes32` | The permission identifier. |
| `here` | `address` | The address of the context in which the permission is revoked. |
| `where` | `address` | The address of the target contract for which `_who` loses permission. |
| `who` | `address` | The address (EOA or contract) losing the permission. |

### Upgraded

```solidity
event Upgraded(address indexed implementation)
```

> **Dev:** Emitted when the implementation is upgraded.

### VersionCreated

```solidity
event VersionCreated(
    uint8 release,
    uint16 build,
    address indexed pluginSetup,
    bytes buildMetadata
)
```

Emitted if the same plugin setup exists in previous releases.

| Parameter | Type | Description |
| --- | --- | --- |
| `release` | `uint8` | The release number. |
| `build` | `uint16` | The build number. |
| `pluginSetup` | `address` | The address of the plugin setup contract. |
| `buildMetadata` | `bytes` | The build metadata URI. |

## Errors

### AnyAddressDisallowedForWhoAndWhere

```solidity
error AnyAddressDisallowedForWhoAndWhere()
```

Thrown for permission grants where `who` and `where` are both `ANY_ADDR`.

### ConditionInterfaceNotSupported

```solidity
error ConditionInterfaceNotSupported(IPermissionCondition condition)
```

Thrown if a condition contract does not support the `IPermissionCondition` interface.

| Parameter | Type | Description |
| --- | --- | --- |
| `condition` | `IPermissionCondition` | The address that is not a contract. |

### ConditionNotAContract

```solidity
error ConditionNotAContract(IPermissionCondition condition)
```

Thrown if a condition address is not a contract.

| Parameter | Type | Description |
| --- | --- | --- |
| `condition` | `IPermissionCondition` | The address that is not a contract. |

### EmptyReleaseMetadata

```solidity
error EmptyReleaseMetadata()
```

Thrown if the metadata URI is empty.

### GrantWithConditionNotSupported

```solidity
error GrantWithConditionNotSupported()
```

Thrown if `Operation.GrantWithCondition` is requested as an operation but the method does not support it.

### InvalidPluginSetupInterface

```solidity
error InvalidPluginSetupInterface()
```

Thrown if a plugin setup contract does not inherit from `PluginSetup`.

### InvalidReleaseIncrement

```solidity
error InvalidReleaseIncrement(uint8 latestRelease, uint8 newRelease)
```

Thrown if a release number is incremented by more than one.

| Parameter | Type | Description |
| --- | --- | --- |
| `latestRelease` | `uint8` | The latest release number. |
| `newRelease` | `uint8` | The new release number. |

### PermissionAlreadyGrantedForDifferentCondition

```solidity
error PermissionAlreadyGrantedForDifferentCondition(
    address where,
    address who,
    bytes32 permissionId,
    address currentCondition,
    address newCondition
)
```

Thrown if a permission has been already granted with a different condition.

> **Dev:** This makes sure that condition on the same permission can not be overwriten by a different condition.

| Parameter | Type | Description |
| --- | --- | --- |
| `where` | `address` | The address of the target contract to grant `_who` permission to. |
| `who` | `address` | The address (EOA or contract) to which the permission has already been granted. |
| `permissionId` | `bytes32` | The permission identifier. |
| `currentCondition` | `address` | The current condition set for permissionId. |
| `newCondition` | `address` | The new condition it tries to set for permissionId. |

### PermissionsForAnyAddressDisallowed

```solidity
error PermissionsForAnyAddressDisallowed()
```

Thrown for `ROOT_PERMISSION_ID` or `EXECUTE_PERMISSION_ID` permission grants where `who` or `where` is `ANY_ADDR`.

### PluginSetupAlreadyInPreviousRelease

```solidity
error PluginSetupAlreadyInPreviousRelease(uint8 release, uint16 build, address pluginSetup)
```

Thrown if the same plugin setup contract exists already in a previous releases.

| Parameter | Type | Description |
| --- | --- | --- |
| `release` | `uint8` | The release number of the already existing plugin setup. |
| `build` | `uint16` | The build number of the already existing plugin setup. |
| `pluginSetup` | `address` | The plugin setup contract address. |

### ReleaseDoesNotExist

```solidity
error ReleaseDoesNotExist()
```

Thrown if release does not exist.

### ReleaseZeroNotAllowed

```solidity
error ReleaseZeroNotAllowed()
```

Thrown if a release number is zero.

### Unauthorized

```solidity
error Unauthorized(address where, address who, bytes32 permissionId)
```

Thrown if a call is unauthorized.

| Parameter | Type | Description |
| --- | --- | --- |
| `where` | `address` | The context in which the authorization reverted. |
| `who` | `address` | The address (EOA or contract) missing the permission. |
| `permissionId` | `bytes32` | The permission identifier. |

### VersionHashDoesNotExist

```solidity
error VersionHashDoesNotExist(bytes32 versionHash)
```

Thrown if a version does not exist.

| Parameter | Type | Description |
| --- | --- | --- |
| `versionHash` | `bytes32` | The tag hash. |

## Constants

_Public, so each is also readable through a generated getter._

### MAINTAINER_PERMISSION_ID

```solidity
bytes32 public constant MAINTAINER_PERMISSION_ID = keccak256("MAINTAINER_PERMISSION");
```

Selector: `0xafe5eb78`

The ID of the permission required to call the `createVersion` function.

### ROOT_PERMISSION_ID _(from PermissionManager)_

```solidity
bytes32 public constant ROOT_PERMISSION_ID = keccak256("ROOT_PERMISSION");
```

Selector: `0x09e56b14`

The ID of the permission required to call the `grant`, `grantWithCondition`, `revoke`, and `bulk` function.

### UPGRADE_REPO_PERMISSION_ID

```solidity
bytes32 public constant UPGRADE_REPO_PERMISSION_ID = keccak256("UPGRADE_REPO_PERMISSION");
```

Selector: `0xcc98b8f5`

The ID of the permission required to call the `createVersion` function.

## Structs

### Tag

```solidity
struct Tag {
    uint8 release;
    uint16 build;
}
```

### Version

```solidity
struct Version {
    PluginRepo.Tag tag;
    address pluginSetup;
    bytes buildMetadata;
}
```
