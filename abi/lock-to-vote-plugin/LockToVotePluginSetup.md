---
type: reference
title: LockToVotePluginSetup
kind: contract
source: lock-to-vote-plugin/src/setup/LockToVotePluginSetup.sol
summary: "The setup contract of the `LockToVotePlugin` contract."
---

# LockToVotePluginSetup

**Contract** · [`src/setup/LockToVotePluginSetup.sol`](https://github.com/aragon/lock-to-vote-plugin/blob/5a513e3d9f1aad35d8926de87c408720e8d20a8d/src/setup/LockToVotePluginSetup.sol)

**Explained in:** [Lock to Vote Plugin](../../plugins/lock-to-vote-plugin.md)

**Author:** Aragon X - 2022-2025

**Inherits:** `PluginSetup`

The setup contract of the `LockToVotePlugin` contract.

**security-contact:** sirt@aragon.org

## Constructor

### constructor

```solidity
constructor()
```

The contract constructor deploying the implementation contracts to use.

## Functions

### decodeInstallationParams

```solidity
function decodeInstallationParams(
    bytes _data
) external pure returns (LockToVotePluginSetup.InstallationParameters installationParams)
```

Selector: `0x64e074a5`

Decodes the given byte array into the original installation parameters

| Returns | Type | Description |
| --- | --- | --- |
| `installationParams` | [`LockToVotePluginSetup.InstallationParameters`](#installationparameters) |  |

### encodeInstallationParams

```solidity
function encodeInstallationParams(
    LockToVotePluginSetup.InstallationParameters installationParams
) external pure returns (bytes)
```

Selector: `0xc65ba11e`

Encodes the given installation parameters into a byte array

| Parameter | Type | Description |
| --- | --- | --- |
| `installationParams` | [`LockToVotePluginSetup.InstallationParameters`](#installationparameters) |  |

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
    bytes _installParameters
) external returns (address plugin, IPluginSetup.PreparedSetupData preparedSetupData)
```

Selector: `0xf10832f1`

Prepares the installation of a plugin.

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `address` | The address of the installing DAO. |
| `_installParameters` | `bytes` |  |

| Returns | Type | Description |
| --- | --- | --- |
| `plugin` | `address` | The address of the `Plugin` contract being prepared for installation. |
| `preparedSetupData` | [`IPluginSetup.PreparedSetupData`](#preparedsetupdata) | The deployed plugin's relevant data which consists of helpers and permissions. |

### prepareUninstallation

```solidity
function prepareUninstallation(
    address _dao,
    IPluginSetup.SetupPayload _payload
) external view returns (PermissionLib.MultiTargetPermission[] permissions)
```

Selector: `0x9cb0a124`

Prepares the uninstallation of a plugin.

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

### NonUpgradeablePlugin

```solidity
error NonUpgradeablePlugin()
```

Thrown when attempting to prepare an update on a non-upgradeable plugin.

### TokenNotContract

```solidity
error TokenNotContract(address token)
```

Thrown if token address is passed which is not a token.

| Parameter | Type | Description |
| --- | --- | --- |
| `token` | `address` | The token address |

### TokenNotERC20

```solidity
error TokenNotERC20(address token)
```

Thrown if token address is not ERC20.

| Parameter | Type | Description |
| --- | --- | --- |
| `token` | `address` | The token address |

### WrongHelpersArrayLength

```solidity
error WrongHelpersArrayLength(uint256 length)
```

Thrown if passed helpers array is of wrong length.

| Parameter | Type | Description |
| --- | --- | --- |
| `length` | `uint256` | The array length of passed helpers. |

## Structs

### InstallationParameters

```solidity
struct InstallationParameters {
    IERC20 token;
    MajorityVotingBase.VotingSettings votingSettings;
    bytes pluginMetadata;
    address createProposalCaller;
    address executeCaller;
    IPlugin.TargetConfig targetConfig;
}
```

Struct containing all the parameters to set up the plugin, helpers and permissions

| Field | Type | Description |
| --- | --- | --- |
| `token` | `IERC20` | The address of the token that users can lock for voting (staking token in most cases) |
| `votingSettings` | `MajorityVotingBase.VotingSettings` | The voting plugin settings |
| `pluginMetadata` | `bytes` | An IPFS URI pointing to a pinned JSON file with the plugin's details |
| `createProposalCaller` | `address` | The address that can call createProposal (can be ANY_ADDR) |
| `executeCaller` | `address` | The address that can call execute (can be ANY_ADDR) |
| `targetConfig` | `IPlugin.TargetConfig` | Where and how the plugin will execute actions |

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
