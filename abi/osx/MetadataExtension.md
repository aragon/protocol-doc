---
type: reference
title: MetadataExtension
kind: abstract contract
source: osx/src/common/utils/metadata/MetadataExtension.sol
summary: "An abstract, non upgradeable contract for managing and retrieving metadata associated with a plugin."
---

# MetadataExtension

**Abstract contract** · [`src/common/utils/metadata/MetadataExtension.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/utils/metadata/MetadataExtension.sol)

**Explained in:** [Plugin metadata](../../framework/plugin-metadata.md)

**Author:** Aragon X - 2024

**Inherits:** `ERC165`, [`DaoAuthorizable`](./DaoAuthorizable.md)

An abstract, non upgradeable contract for managing and retrieving metadata associated with a plugin.

**security-contact:** sirt@aragon.org

## Functions

### dao

```solidity
function dao() external view returns (IDAO)
```

Selector: `0x4162169f`

Returns the DAO contract.

### getMetadata

```solidity
function getMetadata() external view returns (bytes)
```

Selector: `0x7a5b4f59`

Returns the metadata currently applied.

### setMetadata

```solidity
function setMetadata(bytes _metadata) external
```

Selector: `0xee57e36f`

Allows to set the metadata.

| Parameter | Type | Description |
| --- | --- | --- |
| `_metadata` | `bytes` | The plugin specific information encoded in bytes. |

### supportsInterface

```solidity
function supportsInterface(bytes4 _interfaceId) external view returns (bool)
```

Selector: `0x01ffc9a7`

Checks if this or the parent contract supports an interface by its ID.

| Parameter | Type | Description |
| --- | --- | --- |
| `_interfaceId` | `bytes4` | The ID of the interface. |

## Events

### MetadataSet

```solidity
event MetadataSet(bytes metadata)
```

Emitted when metadata is set.

## Errors

### DaoUnauthorized

```solidity
error DaoUnauthorized(address dao, address where, address who, bytes32 permissionId)
```

Thrown if a call is unauthorized in the associated DAO.

| Parameter | Type | Description |
| --- | --- | --- |
| `dao` | `address` | The associated DAO. |
| `where` | `address` | The context in which the authorization reverted. |
| `who` | `address` | The address (EOA or contract) missing the permission. |
| `permissionId` | `bytes32` | The permission identifier. |

## Constants

_Public, so each is also readable through a generated getter._

### SET_METADATA_PERMISSION_ID

```solidity
bytes32 public constant SET_METADATA_PERMISSION_ID = keccak256("SET_METADATA_PERMISSION");
```

Value: `0x4707e94b25cfce1a7c363508fbb838c35864388ad77284b248282b9746982b9b`

The ID of the permission required to call the `setMetadata` function.
