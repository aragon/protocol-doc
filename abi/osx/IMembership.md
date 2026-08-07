---
type: reference
title: IMembership
kind: interface
source: osx/src/common/plugin/extensions/membership/IMembership.sol
summary: "An interface to be implemented by DAO plugins that define membership."
---

# IMembership

**Interface** · [`src/common/plugin/extensions/membership/IMembership.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/plugin/extensions/membership/IMembership.sol)

**Explained in:** [Membership and the address list](../../common/membership.md)

**Author:** Aragon X - 2022-2023

An interface to be implemented by DAO plugins that define membership.

**security-contact:** sirt@aragon.org

## Functions

### isMember

```solidity
function isMember(address _account) external view returns (bool)
```

Selector: `0xa230c524`

Checks if an account is a member of the DAO.

> **Dev:** This function must be implemented in the plugin contract that introduces the members to the DAO.

| Parameter | Type | Description |
| --- | --- | --- |
| `_account` | `address` | The address of the account to be checked. |

## Events

### MembersAdded

```solidity
event MembersAdded(address[] members)
```

Emitted when members are added to the DAO plugin.

| Parameter | Type | Description |
| --- | --- | --- |
| `members` | `address[]` | The list of new members being added. |

### MembershipContractAnnounced

```solidity
event MembershipContractAnnounced(address indexed definingContract)
```

Emitted to announce the membership being defined by a contract.

| Parameter | Type | Description |
| --- | --- | --- |
| `definingContract` | `address` | The contract defining the membership. |

### MembersRemoved

```solidity
event MembersRemoved(address[] members)
```

Emitted when members are removed from the DAO plugin.

| Parameter | Type | Description |
| --- | --- | --- |
| `members` | `address[]` | The list of existing members being removed. |
