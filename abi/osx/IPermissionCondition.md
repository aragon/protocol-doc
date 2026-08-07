---
type: reference
title: IPermissionCondition
kind: interface
source: osx/src/common/permission/condition/IPermissionCondition.sol
summary: "An interface to be implemented to support custom permission logic."
---

# IPermissionCondition

**Interface** · [`src/common/permission/condition/IPermissionCondition.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/permission/condition/IPermissionCondition.sol)

**Explained in:** [Permission conditions](../../common/permission-conditions.md)

**Author:** Aragon X - 2021-2023

An interface to be implemented to support custom permission logic.

> **Dev:** To attach a condition to a permission, the `grantWithCondition` function must be used and refer to the implementing contract's address with the `condition` argument.

**security-contact:** sirt@aragon.org

## Functions

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
