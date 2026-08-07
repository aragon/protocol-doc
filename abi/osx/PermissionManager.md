---
type: reference
title: PermissionManager
kind: abstract contract
source: osx/src/core/permission/PermissionManager.sol
summary: "The abstract permission manager used in a DAO, its associated plugins, and other framework-related components."
---

# PermissionManager

**Abstract contract** · [`src/core/permission/PermissionManager.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/core/permission/PermissionManager.sol)

**Explained in:** [Manage permissions through governance](../../guides/manage-permissions.md), [The permission system](../../core/permissions.md)

**Author:** Aragon X - 2021-2023

**Inherits:** `Initializable`

The abstract permission manager used in a DAO, its associated plugins, and other framework-related components.

**security-contact:** sirt@aragon.org

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

## Events

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

### GrantWithConditionNotSupported

```solidity
error GrantWithConditionNotSupported()
```

Thrown if `Operation.GrantWithCondition` is requested as an operation but the method does not support it.

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

## Constants

_Public, so each is also readable through a generated getter._

### ROOT_PERMISSION_ID

```solidity
bytes32 public constant ROOT_PERMISSION_ID = keccak256("ROOT_PERMISSION");
```

Value: `0x815fe80e4b37c8582a3b773d1d7071f983eacfd56b5965db654f3087c25ada33`

The ID of the permission required to call the `grant`, `grantWithCondition`, `revoke`, and `bulk` function.
