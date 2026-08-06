---
title: TokenVotingSetup
kind: contract
source: src/TokenVotingSetup.sol
summary: "The setup contract of the `TokenVoting` plugin."
---

# TokenVotingSetup

**Contract** · [`src/TokenVotingSetup.sol`](https://github.com/aragon/token-voting-plugin/blob/e97b783d76872d694f41dfc4bc846405019ca741/src/TokenVotingSetup.sol)

**Author:** Aragon X - 2022-2025

**Inherits:** `PluginUpgradeableSetup`

The setup contract of the `TokenVoting` plugin.

> **Dev:** v1.4 (Release 1, Build 4)

**security-contact:** sirt@aragon.org

## Constructor

### constructor

```solidity
constructor(
    TokenVoting _tokenVotingBase,
    GovernanceERC20 _governanceERC20Base,
    GovernanceWrappedERC20 _governanceWrappedERC20Base
)
```

The contract constructor deploying the plugin implementation contract
and receiving the governance token base contracts to clone from.

| Parameter | Type | Description |
| --- | --- | --- |
| `_tokenVotingBase` | `TokenVoting` | The base `TokenVoting` contract to create proxies for. |
| `_governanceERC20Base` | `GovernanceERC20` | The base `GovernanceERC20` contract to create clones from. |
| `_governanceWrappedERC20Base` | `GovernanceWrappedERC20` | The base `GovernanceWrappedERC20` contract to create clones from. |

## Functions

### decodeInstallationParameters

```solidity
function decodeInstallationParameters(
    bytes _data
) external pure returns (MajorityVotingBase.VotingSettings votingSettings, TokenVotingSetup.TokenSettings tokenSettings, GovernanceERC20.MintSettings mintSettings, IPlugin.TargetConfig targetConfig, uint256 minApprovals, bytes pluginMetadata, address[] excludedAccounts)
```

Selector: `0xf2ad76f9`

Decodes the given byte array into the original installation parameters

### encodeInstallationParameters

```solidity
function encodeInstallationParameters(
    MajorityVotingBase.VotingSettings votingSettings,
    TokenVotingSetup.TokenSettings tokenSettings,
    GovernanceERC20.MintSettings mintSettings,
    IPlugin.TargetConfig targetConfig,
    uint256 minApprovals,
    bytes pluginMetadata,
    address[] excludedAccounts
) external pure returns (bytes)
```

Selector: `0xb37edb51`

Encodes the given installation parameters into a byte array

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
) external view returns (PermissionLib.MultiTargetPermission[] permissions)
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

> **Dev:** Revoke the upgrade plugin permission to the DAO for all builds prior the current one (3).

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

### supportsIVotesInterface

```solidity
function supportsIVotesInterface(address token) external view returns (bool)
```

Selector: `0x1c5d4013`

Unsatisfiably determines if the token is an IVotes interface.

> **Dev:** Many tokens don't use ERC165 even though they still support IVotes.

## Errors

### InvalidImplementation

```solidity
error InvalidImplementation()
```

Thrown if the implementation address is empty.

### InvalidUpdatePath

```solidity
error InvalidUpdatePath(uint16 fromBuild, uint16 thisBuild)
```

Thrown when an update path is not available, for example, if this is the initial build.

| Parameter | Type | Description |
| --- | --- | --- |
| `fromBuild` | `uint16` | The build number to update from. |
| `thisBuild` | `uint16` | The build number of this setup to update to. |

### TokenNotContract

```solidity
error TokenNotContract(address token)
```

Thrown if the passed token address is not a token contract.

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

## Constants

_Public, so each is also readable through a generated getter._

### governanceERC20Base

```solidity
address public immutable governanceERC20Base;
```

Selector: `0x599cb1a6`

The address of the `GovernanceERC20` base contract.

### governanceWrappedERC20Base

```solidity
address public immutable governanceWrappedERC20Base;
```

Selector: `0xe89b6b91`

The address of the `GovernanceWrappedERC20` base contract.

## Structs

### PreparedSetupData _(from IPluginSetup)_

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

### SetupPayload _(from IPluginSetup)_

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

### TokenSettings

```solidity
struct TokenSettings {
    address addr;
    string name;
    string symbol;
}
```

Configuration settings for a token used within the governance system.

| Field | Type | Description |
| --- | --- | --- |
| `addr` | `address` | The token address. If set to `address(0)`, a new `GovernanceERC20` token is deployed. If the address implements `IVotes`, it will be used directly; otherwise, it is wrapped as `GovernanceWrappedERC20`. |
| `name` | `string` | The name of the token. |
| `symbol` | `string` | The symbol of the token. |
