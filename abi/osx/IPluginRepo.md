---
title: IPluginRepo
kind: interface
source: src/framework/plugin/repo/IPluginRepo.sol
summary: "The interface required for a plugin repository."
---

# IPluginRepo

**Interface** · [`src/framework/plugin/repo/IPluginRepo.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/framework/plugin/repo/IPluginRepo.sol)

**Author:** Aragon X - 2022-2023

The interface required for a plugin repository.

**security-contact:** sirt@aragon.org

## Functions

### createVersion

```solidity
function createVersion(
    uint8 _release,
    address _pluginSetupAddress,
    bytes _buildMetadata,
    bytes _releaseMetadata
) external
```

Selector: `0xfc054427`

Creates a new plugin version as the latest build for an existing release number or the first build for a new release number for the provided `PluginSetup` contract address and metadata.

| Parameter | Type | Description |
| --- | --- | --- |
| `_release` | `uint8` | The release number. |
| `_pluginSetupAddress` | `address` | The address of the plugin setup contract. |
| `_buildMetadata` | `bytes` | The build metadata URI. |
| `_releaseMetadata` | `bytes` | The release metadata URI. |

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

## Events

### ReleaseMetadataUpdated

```solidity
event ReleaseMetadataUpdated(uint8 release, bytes releaseMetadata)
```

Emitted when a release's metadata was updated.

| Parameter | Type | Description |
| --- | --- | --- |
| `release` | `uint8` | The release number. |
| `releaseMetadata` | `bytes` | The release metadata URI. |

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
