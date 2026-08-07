---
type: reference
title: DaoUnauthorized
kind: error
source: osx/src/common/permission/auth/auth.sol
summary: "Thrown if a call is unauthorized in the associated DAO."
---

# DaoUnauthorized

**Error** · [`src/common/permission/auth/auth.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/permission/auth/auth.sol)

**Explained in:** [Authorizing against a DAO](../../common/auth.md)

```solidity
error DaoUnauthorized(address dao, address where, address who, bytes32 permissionId);
```

Thrown if a call is unauthorized in the associated DAO.

| Parameter | Type | Description |
| --- | --- | --- |
| `dao` | `address` | The associated DAO. |
| `where` | `address` | The context in which the authorization reverted. |
| `who` | `address` | The address (EOA or contract) missing the permission. |
| `permissionId` | `bytes32` | The permission identifier. |
