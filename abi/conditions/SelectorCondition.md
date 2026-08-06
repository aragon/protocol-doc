---
type: reference
title: SelectorCondition
kind: contract
source: conditions/src/SelectorCondition.sol
summary: "A permission that only allows a specified group of function selectors to be invoked within DAO.execute()"
---

# SelectorCondition

**Contract** · [`src/SelectorCondition.sol`](https://github.com/aragon/conditions/blob/33918b06b95233dd8890bef6cc60da6227fa5af1/src/SelectorCondition.sol)

**Author:** AragonX 2025

**Inherits:** `ERC165`, `IPermissionCondition`, `DaoAuthorizable`

A permission that only allows a specified group of function selectors to be invoked within DAO.execute()

## Constructor

### constructor

```solidity
constructor(IDAO _dao, bytes4[] _initialSelectors)
```

## Functions

### allowedSelectors

```solidity
function allowedSelectors(bytes4) external view returns (bool)
```

Selector: `0x85f168eb`

### allowSelector

```solidity
function allowSelector(bytes4 _selector) external
```

Selector: `0x932b3d68`

Marks the given selector as allowed

| Parameter | Type | Description |
| --- | --- | --- |
| `_selector` | `bytes4` | The function selector to start allowing |

### dao

```solidity
function dao() external view returns (IDAO)
```

Selector: `0x4162169f`

Returns the DAO contract.

### disallowSelector

```solidity
function disallowSelector(bytes4 _selector) external
```

Selector: `0x1611ce60`

Marks the given selector as disallowed

| Parameter | Type | Description |
| --- | --- | --- |
| `_selector` | `bytes4` | The function selector to stop allowing |

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

### SelectorAllowed

```solidity
event SelectorAllowed(bytes4 selector)
```

### SelectorDisallowed

```solidity
event SelectorDisallowed(bytes4 selector)
```

## Errors

### AlreadyAllowed

```solidity
error AlreadyAllowed(bytes4 selector)
```

### AlreadyDisallowed

```solidity
error AlreadyDisallowed(bytes4 selector)
```

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
