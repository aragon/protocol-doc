---
type: reference
title: DaoUnauthorized
kind: error
source: osx/src/common/permission/auth/auth.sol
summary: "Thrown if a call is unauthorized in the associated DAO."
---

# DaoUnauthorized

**Error** · [`src/common/permission/auth/auth.sol`](https://github.com/aragon/osx/blob/2c60f1252558d75fe99c414ccd2b1aedbde88f12/src/common/permission/auth/auth.sol)

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
