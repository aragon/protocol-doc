---
type: reference
title: DaoAuthorizable
kind: abstract contract
source: osx/src/common/permission/auth/DaoAuthorizable.sol
summary: "An abstract contract providing a meta-transaction compatible modifier for non-upgradeable contracts instantiated via the `new` keyword to authorize function…"
---

# DaoAuthorizable

**Abstract contract** · [`src/common/permission/auth/DaoAuthorizable.sol`](https://github.com/aragon/osx/blob/2c60f1252558d75fe99c414ccd2b1aedbde88f12/src/common/permission/auth/DaoAuthorizable.sol)

**Explained in:** [Authorizing against a DAO](../../common/auth.md)

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

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | [`IDAO`](./IDAO.md) |  |
