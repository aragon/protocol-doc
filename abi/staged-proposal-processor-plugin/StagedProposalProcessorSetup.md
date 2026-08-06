---
title: StagedProposalProcessorSetup
kind: contract
source: src/StagedProposalProcessorSetup.sol
summary: "The setup contract of the `StagedProposalProcessor` plugin."
---

# StagedProposalProcessorSetup

**Contract** · [`src/StagedProposalProcessorSetup.sol`](https://github.com/aragon/staged-proposal-processor-plugin/blob/96b83dd5da22930e8d9bcc211cf4e57aaf5270f2/src/StagedProposalProcessorSetup.sol)

**Author:** Aragon X - 2024

**Inherits:** `PluginUpgradeableSetup`

The setup contract of the `StagedProposalProcessor` plugin.

> **Dev:** Release 1, Build 2

## Constructor

### constructor

```solidity
constructor(StagedProposalProcessor _spp)
```

Constructs the `PluginUpgradeableSetup` by storing the `SPP` implementation address.

> **Dev:** The implementation address is used to deploy UUPS proxies referencing it and
> to verify the plugin on the respective block explorers.

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
    bytes _installationParams
) external returns (address spp, IPluginSetup.PreparedSetupData preparedSetupData)
```

Selector: `0xf10832f1`

Prepares the installation of a plugin.

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `address` | The address of the installing DAO. |
| `_installationParams` | `bytes` |  |

| Returns | Type | Description |
| --- | --- | --- |
| `spp` | `address` | The address of the `Plugin` contract being prepared for installation. |
| `preparedSetupData` | `IPluginSetup.PreparedSetupData` | The deployed plugin's relevant data which consists of helpers and permissions. |

### prepareUninstallation

```solidity
function prepareUninstallation(
    address _dao,
    IPluginSetup.SetupPayload _payload
) external pure returns (PermissionLib.MultiTargetPermission[] permissions)
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

> **Dev:** v1.1 → v1.2: deploys a fresh `SPPRuleCondition` seeded with the existing rules and migrates
> `CREATE_PROPOSAL_PERMISSION` (on the plugin) and `UPDATE_RULES_PERMISSION` (on the helper) from
> the old condition to the new one. The plugin proxy itself is upgraded to the new implementation
> by the `PluginSetupProcessor` automatically; no reinitializer is required because no new storage
> is introduced in build 2. Existing rules are read from the old helper, so no caller-supplied data
> is required — `_payload.data` is ignored.

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

## Constants

_Public, so each is also readable through a generated getter._

### CLONES_SUPPORTED

```solidity
bool public immutable CLONES_SUPPORTED;
```

Selector: `0x0e2679d2`

Whether the network supports EIP-1167 minimal proxies (clones).

> **Dev:** False on networks like ZkSync that lack CREATE2 clone support; falls back to UUPS.

### CONDITION_IMPLEMENTATION

```solidity
address public immutable CONDITION_IMPLEMENTATION;
```

Selector: `0x7da5dd7c`

The address of the condition implementation contract.

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
