---
type: reference
title: ExecuteSelectorCondition
kind: contract
source: conditions/src/ExecuteSelectorCondition.sol
summary: "A permission that only allows a specified group of function selectors to be invoked within DAO.execute()"
---

# ExecuteSelectorCondition

**Contract** · [`src/ExecuteSelectorCondition.sol`](https://github.com/aragon/conditions/blob/33918b06b95233dd8890bef6cc60da6227fa5af1/src/ExecuteSelectorCondition.sol)

**Author:** AragonX 2025

**Inherits:** `ERC165`, `IPermissionCondition`, `DaoAuthorizable`

A permission that only allows a specified group of function selectors to be invoked within DAO.execute()

## Constructor

### constructor

```solidity
constructor(IDAO _dao, ExecuteSelectorCondition.SelectorTarget[] _initialEntries)
```

Configures a new instance with the given set of allowed selectors

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `IDAO` | The address of the DAO where the contract should read the permissions from |
| `_initialEntries` | `ExecuteSelectorCondition.SelectorTarget[]` | The list of allowed selectors and the addresses where they can be invoked |

## Functions

### allowedNativeTransfers

```solidity
function allowedNativeTransfers(address) external view returns (bool)
```

Selector: `0x50093e83`

Stores whether native transfers are allowed to the given target address

### allowedSelectors

```solidity
function allowedSelectors(address, bytes4) external view returns (bool)
```

Selector: `0xbba013aa`

Stores whether the given address and selector are allowed

> **Dev:** allowedSelectors[where][selector]

### allowNativeTransfers

```solidity
function allowNativeTransfers(address _where) external
```

Selector: `0x5e593df6`

Allows actions with a non-zero `value` to pass for the given target address

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The target address |

### allowSelectors

```solidity
function allowSelectors(ExecuteSelectorCondition.SelectorTarget _newEntry) external
```

Selector: `0x32c9ea3e`

Marks the given selectors as allowed on the given where address

| Parameter | Type | Description |
| --- | --- | --- |
| `_newEntry` | `ExecuteSelectorCondition.SelectorTarget` | The new selectors and the address where they can be invoked |

### dao

```solidity
function dao() external view returns (IDAO)
```

Selector: `0x4162169f`

Returns the DAO contract.

### disallowNativeTransfers

```solidity
function disallowNativeTransfers(address _where) external
```

Selector: `0x4746831e`

Restricts actions with a non-zero `value` for the given target address

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The target address |

### disallowSelectors

```solidity
function disallowSelectors(ExecuteSelectorCondition.SelectorTarget _entry) external
```

Selector: `0x6cf0ca63`

Marks the given selector(s) as disallowed

| Parameter | Type | Description |
| --- | --- | --- |
| `_entry` | `ExecuteSelectorCondition.SelectorTarget` | The selectors to remove and the address where they can no longer be invoked |

### isGranted

```solidity
function isGranted(
    address _where,
    address _who,
    bytes32 _permissionId,
    bytes _data
) external view returns (bool isPermitted)
```

Selector: `0x2675fdd0`

Checks if a call is permitted.

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The address of the target contract. |
| `_who` | `address` | The address (EOA or contract) for which the permissions are checked. |
| `_permissionId` | `bytes32` | The permission identifier. |
| `_data` | `bytes` | Optional data passed to the `PermissionCondition` implementation. |

| Returns | Type | Description |
| --- | --- | --- |
| `isPermitted` | `bool` | Returns true if the call is permitted. |

### supportsInterface

```solidity
function supportsInterface(bytes4 _interfaceId) external view returns (bool)
```

Selector: `0x01ffc9a7`

Checks if an interface is supported by this or its parent contract.

| Parameter | Type | Description |
| --- | --- | --- |
| `_interfaceId` | `bytes4` | The ID of the interface. |

## Events

### NativeTransfersAllowed

```solidity
event NativeTransfersAllowed(address where)
```

Emitted when native transfers are allowed to the given address

### NativeTransfersDisallowed

```solidity
event NativeTransfersDisallowed(address where)
```

Emitted when native transfers are disallowed to the given address

### SelectorAllowed

```solidity
event SelectorAllowed(bytes4 selector, address where)
```

Emitted when a new selector is allowed.

### SelectorDisallowed

```solidity
event SelectorDisallowed(bytes4 selector, address where)
```

Emitted when a selector is disallowed.

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

### MANAGE_SELECTORS_PERMISSION_ID

```solidity
bytes32 public constant MANAGE_SELECTORS_PERMISSION_ID = keccak256("MANAGE_SELECTORS_PERMISSION");
```

Value: `0x485a22b473de7ee3091c71c5ce05019fd1466a1650b1228784a9bcd5b7bed510`

## Structs

### SelectorTarget

```solidity
struct SelectorTarget {
    address where;
    bytes4[] selectors;
}
```

Contains a list of selectors for the given target (where) address
