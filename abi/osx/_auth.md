---
type: reference
title: _auth
kind: function
source: osx/src/common/permission/auth/auth.sol
summary: "A free function checking if a caller is granted permissions on a target contract via a permission identifier that redirects the approval to a…"
---

# _auth

**Function** · [`src/common/permission/auth/auth.sol`](https://github.com/aragon/osx/blob/2c60f1252558d75fe99c414ccd2b1aedbde88f12/src/common/permission/auth/auth.sol)

**Explained in:** [Authorizing against a DAO](../../common/auth.md)

```solidity
function _auth(
    IDAO _dao,
    address _where,
    address _who,
    bytes32 _permissionId,
    bytes calldata _data
) view
```

A free function checking if a caller is granted permissions on a target contract via a permission identifier that redirects the approval to a `PermissionCondition` if this was specified in the setup.

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | [`IDAO`](./IDAO.md) |  |
| `_where` | `address` | The address of the target contract for which `who` receives permission. |
| `_who` | `address` | The address (EOA or contract) owning the permission. |
| `_permissionId` | `bytes32` | The permission identifier. |
| `_data` | `bytes` | The optional data passed to the `PermissionCondition` registered. |
