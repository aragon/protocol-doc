---
type: reference
title: IOwnerManager
kind: interface
source: conditions/src/interfaces/IOwnerManager.sol
summary: "Interface for managing Safe owners and a threshold to authorize transactions."
---

# IOwnerManager

**Interface** · [`src/interfaces/IOwnerManager.sol`](https://github.com/aragon/conditions/blob/33918b06b95233dd8890bef6cc60da6227fa5af1/src/interfaces/IOwnerManager.sol)

**Explained in:** [SafeOwnerCondition](../../helpers/condition-library/safe-owner-condition.md)

**Owner Manager Interface**

**Author:** @safe-global/safe-protocol

Interface for managing Safe owners and a threshold to authorize transactions.

## Functions

### addOwnerWithThreshold

```solidity
function addOwnerWithThreshold(address owner, uint256 _threshold) external
```

Selector: `0x0d582f13`

Adds the owner `owner` to the Safe and updates the threshold to `_threshold`.

> **Dev:** This can only be done via a Safe transaction.
> ⚠️⚠️⚠️ A Safe can set itself as an owner which is a valid setup for EIP-7702 delegations.
> However, if address of the accounts is not an EOA and cannot sign for itself, you can
> potentially block access to the account completely. For example, if you have a `n/n`
> Safe (so `threshold == ownerCount`) and one of the owners is the Safe itself and not
> an EIP-7702 delegated account, then it will not be possible to produce a valid
> signature for the Safe. ⚠️⚠️⚠️

| Parameter | Type | Description |
| --- | --- | --- |
| `owner` | `address` | New owner address. |
| `_threshold` | `uint256` | New threshold. |

### changeThreshold

```solidity
function changeThreshold(uint256 _threshold) external
```

Selector: `0x694e80c3`

Changes the threshold of the Safe to `_threshold`.

> **Dev:** This can only be done via a Safe transaction.

| Parameter | Type | Description |
| --- | --- | --- |
| `_threshold` | `uint256` | New threshold. |

### getOwners

```solidity
function getOwners() external view returns (address[])
```

Selector: `0xa0e67e2b`

Returns a list of Safe owners.

### getThreshold

```solidity
function getThreshold() external view returns (uint256)
```

Selector: `0xe75235b8`

Returns the number of required confirmations for a Safe transaction aka the threshold.

### isOwner

```solidity
function isOwner(address owner) external view returns (bool)
```

Selector: `0x2f54bf6e`

Returns if `owner` is an owner of the Safe.

### removeOwner

```solidity
function removeOwner(address prevOwner, address owner, uint256 _threshold) external
```

Selector: `0xf8dc5dd9`

Removes the owner `owner` from the Safe and updates the threshold to `_threshold`.

> **Dev:** This can only be done via a Safe transaction.

| Parameter | Type | Description |
| --- | --- | --- |
| `prevOwner` | `address` | Owner that pointed to the `owner` to be removed in the linked list. If the owner to be removed is the first (or only) element of the list, `prevOwner` MUST be set to the sentinel address `0x1` (referred to as `SENTINEL_OWNERS` in the implementation). |
| `owner` | `address` | Owner address to be removed. |
| `_threshold` | `uint256` | New threshold. |

### swapOwner

```solidity
function swapOwner(address prevOwner, address oldOwner, address newOwner) external
```

Selector: `0xe318b52b`

Replaces the owner `oldOwner` in the Safe with `newOwner`.

> **Dev:** This can only be done via a Safe transaction.
> ⚠️⚠️⚠️ A Safe can set itself as an owner which is a valid setup for EIP-7702 delegations.
> However, if address of the accounts is not an EOA and cannot sign for itself, you can
> potentially block access to the account completely. For example, if you have a `n/n`
> Safe (so `threshold == ownerCount`) and one of the owners is the Safe itself and not
> an EIP-7702 delegated account, then it will not be possible to produce a valid
> signature for the Safe. ⚠️⚠️⚠️

| Parameter | Type | Description |
| --- | --- | --- |
| `prevOwner` | `address` | Owner that pointed to the `oldOwner` to be replaced in the linked list. If the owner to be replaced is the first (or only) element of the list, `prevOwner` MUST be set to the sentinel address `0x1` (referred to as `SENTINEL_OWNERS` in the implementation). |
| `oldOwner` | `address` | Owner address to be replaced. |
| `newOwner` | `address` | New owner address. |

## Events

### AddedOwner

```solidity
event AddedOwner(address indexed owner)
```

An owner was added.

| Parameter | Type | Description |
| --- | --- | --- |
| `owner` | `address` | The address of the new owner. |

### ChangedThreshold

```solidity
event ChangedThreshold(uint256 threshold)
```

The signature threshold changed.

| Parameter | Type | Description |
| --- | --- | --- |
| `threshold` | `uint256` | The new threshold for authorizing Safe transactions. |

### RemovedOwner

```solidity
event RemovedOwner(address indexed owner)
```

An owner was removed.

| Parameter | Type | Description |
| --- | --- | --- |
| `owner` | `address` | The address of the old owner. |
