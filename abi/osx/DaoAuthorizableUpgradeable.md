---
type: reference
title: DaoAuthorizableUpgradeable
kind: abstract contract
source: osx/src/common/permission/auth/DaoAuthorizableUpgradeable.sol
summary: "An abstract contract providing a meta-transaction compatible modifier for upgradeable or cloneable contracts to authorize function calls through an associated…"
---

# DaoAuthorizableUpgradeable

**Abstract contract** · [`src/common/permission/auth/DaoAuthorizableUpgradeable.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/permission/auth/DaoAuthorizableUpgradeable.sol)

**Explained in:** [Authorizing against a DAO](../../common/auth.md)

**Author:** Aragon X - 2022-2023

**Inherits:** `ContextUpgradeable`

An abstract contract providing a meta-transaction compatible modifier for upgradeable or cloneable contracts to authorize function calls through an associated DAO.

> **Dev:** Make sure to call `__DaoAuthorizableUpgradeable_init` during initialization of the inheriting contract.

**security-contact:** sirt@aragon.org

## Functions

### dao

```solidity
function dao() external view returns (IDAO)
```

Selector: `0x4162169f`

Returns the DAO contract.

## Events

### Initialized

```solidity
event Initialized(uint8 version)
```

> **Dev:** Triggered when the contract has been initialized or reinitialized.
