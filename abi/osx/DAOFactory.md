---
type: reference
title: DAOFactory
kind: contract
source: osx/src/framework/dao/DAOFactory.sol
summary: "This contract is used to create a DAO."
---

# DAOFactory

**Contract** · [`src/framework/dao/DAOFactory.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/framework/dao/DAOFactory.sol)

**Explained in:** [A hands-on tour of OSx](../../guides/hands-on-tour.md), [DAOFactory (creating a DAO)](../../framework/dao-factory.md), [Deploy your first DAO](../../guides/deploy-a-dao.md), [Install a plugin into a live DAO](../../guides/install-a-plugin.md), [Launch a governance token with your DAO](../../guides/launch-a-governance-token.md), [Manage permissions through governance](../../guides/manage-permissions.md)

**Author:** Aragon X - 2022-2023

**Inherits:** `ERC165`, [`ProtocolVersion`](./ProtocolVersion.md)

This contract is used to create a DAO.

**security-contact:** sirt@aragon.org

## Constructor

### constructor

```solidity
constructor(DAORegistry _registry, PluginSetupProcessor _pluginSetupProcessor)
```

The constructor setting the registry and plugin setup processor and creating the base contracts for the factory.

| Parameter | Type | Description |
| --- | --- | --- |
| `_registry` | `DAORegistry` | The DAO registry to register the DAO by its name. |
| `_pluginSetupProcessor` | `PluginSetupProcessor` | The address of PluginSetupProcessor. |

## Functions

### createDao

```solidity
function createDao(
    DAOFactory.DAOSettings _daoSettings,
    DAOFactory.PluginSettings[] _pluginSettings
) external returns (DAO createdDao, DAOFactory.InstalledPlugin[] installedPlugins)
```

Selector: `0xb5568838`

Creates a new DAO, registers it in the DAO registry, and optionally installs plugins via the plugin setup processor.

> **Dev:** If `_pluginSettings` is empty, the caller is granted `EXECUTE_PERMISSION` on the DAO.

| Parameter | Type | Description |
| --- | --- | --- |
| `_daoSettings` | `DAOFactory.DAOSettings` | The settings to configure during DAO initialization. |
| `_pluginSettings` | `DAOFactory.PluginSettings[]` | An array containing plugin references and settings. If provided, each plugin is installed after the DAO creation. |

| Returns | Type | Description |
| --- | --- | --- |
| `createdDao` | `DAO` | The address of the newly created DAO instance. |
| `installedPlugins` | `DAOFactory.InstalledPlugin[]` | An array of `InstalledPlugin` structs, each containing the plugin address and associated helper contracts and permissions, if plugins were installed; otherwise, an empty array. |

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

### NoPluginProvided

```solidity
error NoPluginProvided()
```

Thrown if `PluginSettings` array is empty, and no plugin is provided.

## Constants

_Public, so each is also readable through a generated getter._

### daoBase

```solidity
address public immutable daoBase;
```

The DAO base contract, to be used for creating new `DAO`s via `createERC1967Proxy` function.

### daoRegistry

```solidity
DAORegistry public immutable daoRegistry;
```

The DAO registry listing the `DAO` contracts created via this contract.

### pluginSetupProcessor

```solidity
PluginSetupProcessor public immutable pluginSetupProcessor;
```

The plugin setup processor for installing plugins on the newly created `DAO`s.

## Structs

### DAOSettings

```solidity
struct DAOSettings {
    address trustedForwarder;
    string daoURI;
    string subdomain;
    bytes metadata;
}
```

### InstalledPlugin

```solidity
struct InstalledPlugin {
    address plugin;
    IPluginSetup.PreparedSetupData preparedSetupData;
}
```

### PluginSettings

```solidity
struct PluginSettings {
    PluginSetupRef pluginSetupRef;
    bytes data;
}
```
