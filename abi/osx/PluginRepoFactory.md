---
type: reference
title: PluginRepoFactory
kind: contract
source: osx/src/framework/plugin/repo/PluginRepoFactory.sol
summary: "This contract creates `PluginRepo` proxies and registers them on a `PluginRepoRegistry` contract."
---

# PluginRepoFactory

**Contract** · [`src/framework/plugin/repo/PluginRepoFactory.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/framework/plugin/repo/PluginRepoFactory.sol)

**Explained in:** [PluginRepo (versioning & publishing)](../../framework/plugin-repo.md), [Publish a plugin to a PluginRepo](../../guides/publish-a-plugin.md)

**Author:** Aragon X - 2022-2023

**Inherits:** `ERC165`, [`ProtocolVersion`](./ProtocolVersion.md)

This contract creates `PluginRepo` proxies and registers them on a `PluginRepoRegistry` contract.

**security-contact:** sirt@aragon.org

## Constructor

### constructor

```solidity
constructor(PluginRepoRegistry _pluginRepoRegistry)
```

Initializes the addresses of the Aragon plugin registry and `PluginRepo` base contract to proxy to.

| Parameter | Type | Description |
| --- | --- | --- |
| `_pluginRepoRegistry` | [`PluginRepoRegistry`](./PluginRepoRegistry.md) | The aragon plugin registry address. |

## Functions

### createPluginRepo

```solidity
function createPluginRepo(
    string _subdomain,
    address _initialOwner
) external returns (PluginRepo)
```

Selector: `0x49b19d08`

Creates a plugin repository proxy pointing to the `pluginRepoBase` implementation and registers it in the Aragon plugin registry.

| Parameter | Type | Description |
| --- | --- | --- |
| `_subdomain` | `string` | The plugin repository subdomain. |
| `_initialOwner` | `address` | The plugin maintainer address. |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | [`PluginRepo`](./PluginRepo.md) |  |

### createPluginRepoWithFirstVersion

```solidity
function createPluginRepoWithFirstVersion(
    string _subdomain,
    address _pluginSetup,
    address _maintainer,
    bytes _releaseMetadata,
    bytes _buildMetadata
) external returns (PluginRepo pluginRepo)
```

Selector: `0x7bd3e8ac`

Creates and registers a `PluginRepo` with an ENS subdomain and publishes an initial version `1.1`.

> **Dev:** After the creation of the `PluginRepo` and release of the first version by the factory, ownership is transferred to the `_maintainer` address.

| Parameter | Type | Description |
| --- | --- | --- |
| `_subdomain` | `string` | The plugin repository subdomain. |
| `_pluginSetup` | `address` | The plugin factory contract associated with the plugin version. |
| `_maintainer` | `address` | The maintainer of the plugin repo. This address has permission to update metadata, upgrade the repo logic, and manage the repo permissions. |
| `_releaseMetadata` | `bytes` | The release metadata URI. |
| `_buildMetadata` | `bytes` | The build metadata URI. |

| Returns | Type | Description |
| --- | --- | --- |
| `pluginRepo` | [`PluginRepo`](./PluginRepo.md) |  |

### pluginRepoBase

```solidity
function pluginRepoBase() external view returns (address)
```

Selector: `0xd222cb1e`

The address of the `PluginRepo` base contract to proxy to..

### pluginRepoRegistry

```solidity
function pluginRepoRegistry() external view returns (PluginRepoRegistry)
```

Selector: `0x0b36f03c`

The Aragon plugin registry contract.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | [`PluginRepoRegistry`](./PluginRepoRegistry.md) |  |

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
