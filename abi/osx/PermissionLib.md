---
type: reference
title: PermissionLib
kind: library
source: osx/src/common/permission/PermissionLib.sol
summary: "A library containing objects for permission processing."
---

# PermissionLib

**Library** · [`src/common/permission/PermissionLib.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/permission/PermissionLib.sol)

**Author:** Aragon X - 2021-2023

A library containing objects for permission processing.

**security-contact:** sirt@aragon.org

## Constants

_Public, so each is also readable through a generated getter._

### NO_CONDITION

```solidity
address public constant NO_CONDITION = address(0);
```

A constant expressing that no condition is applied to a permission.

## Enums

### Operation

```solidity
enum Operation {
    Grant,
    Revoke,
    GrantWithCondition
}
```

| Option | Value |
| --- | --- |
| `Grant` | `0` |
| `Revoke` | `1` |
| `GrantWithCondition` | `2` |

## Structs

### MultiTargetPermission

```solidity
struct MultiTargetPermission {
    PermissionLib.Operation operation;
    address where;
    address who;
    address condition;
    bytes32 permissionId;
}
```

### SingleTargetPermission

```solidity
struct SingleTargetPermission {
    PermissionLib.Operation operation;
    address who;
    bytes32 permissionId;
}
```
