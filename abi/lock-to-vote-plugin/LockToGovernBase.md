---
type: reference
title: LockToGovernBase
kind: abstract contract
source: lock-to-vote-plugin/src/base/LockToGovernBase.sol
summary: "LockToGovernBase"
---

# LockToGovernBase

**Abstract contract** · [`src/base/LockToGovernBase.sol`](https://github.com/aragon/lock-to-vote-plugin/blob/5a513e3d9f1aad35d8926de87c408720e8d20a8d/src/base/LockToGovernBase.sol)

**Explained in:** [Lock to Vote Plugin](../../plugins/lock-to-vote-plugin.md)

**Author:** Aragon X 2024-2025

**Inherits:** [`ILockToGovernBase`](./ILockToGovernBase.md), `IMembership`, `ERC165Upgradeable`

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

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | Whether the account is a member or not. |

### isProposalEnded

```solidity
function isProposalEnded(uint256 _proposalId) external view returns (bool)
```

Selector: `0xf3dfd559`

Returns wether a proposal has ended or not.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |

### isProposalOpen

```solidity
function isProposalOpen(uint256 _proposalId) external view returns (bool)
```

Selector: `0x780e19c1`

Returns wether a proposal is open for submitting votes or not.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |

### lockManager

```solidity
function lockManager() external view returns (ILockManager)
```

Selector: `0xacca30a2`

Returns the address of the manager contract, which holds the locked balances and the allocated vote balances.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | [`ILockManager`](./ILockManager.md) | The address of the LockManager contract associated with the plugin. |

### minProposerVotingPower

```solidity
function minProposerVotingPower() external view returns (uint256)
```

Selector: `0xf60046b2`

Returns the minimum voting power required to create a proposal stored in the voting settings.

### supportsInterface

```solidity
function supportsInterface(bytes4 _interfaceId) external view returns (bool)
```

Selector: `0x01ffc9a7`

Checks if this or the parent contract supports an interface by its ID.

| Parameter | Type | Description |
| --- | --- | --- |
| `_interfaceId` | `bytes4` | The ID of the interface. |

### token

```solidity
function token() external view returns (IERC20)
```

Selector: `0xfc0c546a`

Returns the address of the token contract used to determine the voting power.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `IERC20` | The address of the token used for voting. |

### usedVotingPower

```solidity
function usedVotingPower(uint256 proposalId, address voter) external view returns (uint256)
```

Selector: `0xeff759a8`

Returns whether the account has voted for the proposal.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal. |
| `voter` | `address` | The account address to be checked. |

## Events

### Initialized

```solidity
event Initialized(uint8 version)
```

> **Dev:** Triggered when the contract has been initialized or reinitialized.

### LockManagerDefined

```solidity
event LockManagerDefined(ILockManager indexed lockManager)
```

Emitted when the address of the LockManager is set.

| Parameter | Type | Description |
| --- | --- | --- |
| `lockManager` | [`ILockManager`](./ILockManager.md) | The address of the LockManager contract |

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

## Errors

### LockManagerAlreadyDefined

```solidity
error LockManagerAlreadyDefined()
```

Thrown when attempting to define the address of the LockManager after it was already set.

### NoVotingPower

```solidity
error NoVotingPower()
```

Thrown when creating a proposal without any locked tokens.
