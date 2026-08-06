---
type: reference
title: SafeOwnerCondition
kind: contract
source: conditions/src/SafeOwnerCondition.sol
summary: "A permission that only allows Safe owners to make use of a granted permission."
---

# SafeOwnerCondition

**Contract** · [`src/SafeOwnerCondition.sol`](https://github.com/aragon/conditions/blob/33918b06b95233dd8890bef6cc60da6227fa5af1/src/SafeOwnerCondition.sol)

**Author:** AragonX 2025

**Inherits:** `ERC165`, `IPermissionCondition`

A permission that only allows Safe owners to make use of a granted permission.

## Constructor

### constructor

```solidity
constructor(IOwnerManager _safe)
```

## Functions

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

Checks if a call is permitted.

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The address of the target contract. |
| `_who` | `address` | The address (EOA or contract) for which the permissions are checked. |
| `_permissionId` | `bytes32` | The permission identifier. |
| `_data` | `bytes` | Optional data passed to the `PermissionCondition` implementation. |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | Returns true if the call is permitted. |

### safe

```solidity
function safe() external view returns (IOwnerManager)
```

Selector: `0x186f0354`

### supportsInterface

```solidity
function supportsInterface(bytes4 _interfaceId) external view returns (bool)
```

Selector: `0x01ffc9a7`

Checks if an interface is supported by this or its parent contract.

| Parameter | Type | Description |
| --- | --- | --- |
| `_interfaceId` | `bytes4` | The ID of the interface. |

## Errors

### InvalidSafe

```solidity
error InvalidSafe(address invalidAddress)
```

Thrown when given address is not a compatible Safe.

| Parameter | Type | Description |
| --- | --- | --- |
| `invalidAddress` | `address` | The address received. |
