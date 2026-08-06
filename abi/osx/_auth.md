---
title: _auth
kind: function
source: src/common/permission/auth/auth.sol
summary: "A free function checking if a caller is granted permissions on a target contract via a permission identifier that redirects the approval to a `PermissionConditi"
---

# _auth

**Function** · [`src/common/permission/auth/auth.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/permission/auth/auth.sol)

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
| `_dao` | `IDAO` |  |
| `_where` | `address` | The address of the target contract for which `who` receives permission. |
| `_who` | `address` | The address (EOA or contract) owning the permission. |
| `_permissionId` | `bytes32` | The permission identifier. |
| `_data` | `bytes` | The optional data passed to the `PermissionCondition` registered. |
