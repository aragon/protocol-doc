---
type: reference
title: ILockToGovernBase
kind: interface
source: lock-to-vote-plugin/src/interfaces/ILockToGovernBase.sol
summary: "ILockToGovernBase"
---

# ILockToGovernBase

**Interface** · [`src/interfaces/ILockToGovernBase.sol`](https://github.com/aragon/lock-to-vote-plugin/blob/5a513e3d9f1aad35d8926de87c408720e8d20a8d/src/interfaces/ILockToGovernBase.sol)

**Explained in:** [Lock to Vote Plugin](../../plugins/lock-to-vote-plugin.md)

**Author:** Aragon X 2024-2025

## Functions

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

### minProposerVotingPower

```solidity
function minProposerVotingPower() external view returns (uint256)
```

Selector: `0xf60046b2`

Returns the minimum voting power required to create a proposal stored in the voting settings.

### token

```solidity
function token() external view returns (IERC20)
```

Selector: `0xfc0c546a`

Returns the address of the token contract used to determine the voting power.

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
