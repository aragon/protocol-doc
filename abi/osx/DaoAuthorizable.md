---
type: reference
title: DaoAuthorizable
kind: abstract contract
source: osx/src/common/permission/auth/DaoAuthorizable.sol
summary: "An abstract contract providing a meta-transaction compatible modifier for non-upgradeable contracts instantiated via the `new` keyword to authorize function…"
---

# DaoAuthorizable

**Abstract contract** · [`src/common/permission/auth/DaoAuthorizable.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/permission/auth/DaoAuthorizable.sol)

**Author:** Aragon X - 2022-2023

**Inherits:** `Context`

An abstract contract providing a meta-transaction compatible modifier for non-upgradeable contracts instantiated via the `new` keyword to authorize function calls through an associated DAO.

**security-contact:** sirt@aragon.org

## Functions

### dao

```solidity
function dao() external view returns (IDAO)
```

Selector: `0x4162169f`

Returns the DAO contract.
