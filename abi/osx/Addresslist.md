---
type: reference
title: Addresslist
kind: abstract contract
source: osx/src/common/plugin/extensions/governance/Addresslist.sol
summary: "The majority voting implementation using a list of member addresses."
---

# Addresslist

**Abstract contract** · [`src/common/plugin/extensions/governance/Addresslist.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/plugin/extensions/governance/Addresslist.sol)

**Explained in:** [Membership and the address list](../../common/membership.md)

**Author:** Aragon X - 2021-2023

The majority voting implementation using a list of member addresses.

> **Dev:** This contract inherits from `MajorityVotingBase` and implements the `IMajorityVoting` interface.

**security-contact:** sirt@aragon.org

## Functions

### addresslistLength

```solidity
function addresslistLength() external view returns (uint256)
```

Selector: `0x27f1608d`

Returns the current length of the address list.

### addresslistLengthAtBlock

```solidity
function addresslistLengthAtBlock(uint256 _blockNumber) external view returns (uint256)
```

Selector: `0x6a6b2d86`

Returns the length of the address list at a specific block number.

| Parameter | Type | Description |
| --- | --- | --- |
| `_blockNumber` | `uint256` | The specific block to get the count from. If `0`, then the latest checkpoint value is returned. |

### isListed

```solidity
function isListed(address _account) external view returns (bool)
```

Selector: `0xf794062e`

Checks if an account is currently on the address list.

| Parameter | Type | Description |
| --- | --- | --- |
| `_account` | `address` | The account address being checked. |

### isListedAtBlock

```solidity
function isListedAtBlock(address _account, uint256 _blockNumber) external view returns (bool)
```

Selector: `0xb1bb8d26`

Checks if an account is on the address list at a specific block number.

| Parameter | Type | Description |
| --- | --- | --- |
| `_account` | `address` | The account address being checked. |
| `_blockNumber` | `uint256` | The block number. |

## Errors

### InvalidAddresslistUpdate

```solidity
error InvalidAddresslistUpdate(address member)
```

Thrown when the address list update is invalid, which can be caused by the addition of an existing member or removal of a non-existing member.

| Parameter | Type | Description |
| --- | --- | --- |
| `member` | `address` | The array of member addresses to be added or removed. |
