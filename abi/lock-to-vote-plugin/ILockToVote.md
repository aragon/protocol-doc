---
type: reference
title: ILockToVote
kind: interface
source: lock-to-vote-plugin/src/interfaces/ILockToVote.sol
summary: "Governance plugin allowing token holders to use tokens locked without a snapshot requirement and engage in proposals immediately"
---

# ILockToVote

**Interface** · [`src/interfaces/ILockToVote.sol`](https://github.com/aragon/lock-to-vote-plugin/blob/5a513e3d9f1aad35d8926de87c408720e8d20a8d/src/interfaces/ILockToVote.sol)

**Author:** Aragon X

**Inherits:** [`ILockToGovernBase`](./ILockToGovernBase.md)

Governance plugin allowing token holders to use tokens locked without a snapshot requirement and engage in proposals immediately

## Functions

### canVote

```solidity
function canVote(
    uint256 proposalId,
    address voter,
    IMajorityVoting.VoteOption voteOption
) external view returns (bool)
```

Selector: `0x17d1b404`

Checks if an account can participate on a proposal. This can fail because the vote
- has not started,
- has ended,
- was executed, or
- the voter doesn't have voting powers.
- the voter can increase the amount of tokens assigned

> **Dev:** `voteOption`, 1 -> abstain, 2 -> yes, 3 -> no

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The proposal Id. |
| `voter` | `address` | The account address to be checked. |
| `voteOption` | `IMajorityVoting.VoteOption` | The value of the new vote to register. If an existing vote existed, it will be replaced. |

### clearVote

```solidity
function clearVote(uint256 proposalId, address voter) external
```

Selector: `0x2098be15`

Reverts if the vote cannot be cleared due to the voting settings. This can be because:
- The plugin is in Standard votingMode and the voter has votes registered on active proposals

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal. |
| `voter` | `address` | The voter's address. |

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

### vote

```solidity
function vote(
    uint256 proposalId,
    address voter,
    IMajorityVoting.VoteOption voteOption,
    uint256 votingPower
) external
```

Selector: `0x483f50f8`

Votes on a proposal and, depending on the mode, executes it.

> **Dev:** `voteOption`, 1 -> abstain, 2 -> yes, 3 -> no
> votingPower updates any prior voting power, it does not add to the existing amount.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal to vote on. |
| `voter` | `address` | The address of the account whose vote will be registered |
| `voteOption` | `IMajorityVoting.VoteOption` | The value of the new vote to register. If an existing vote existed, it will be replaced. |
| `votingPower` | `uint256` | The new balance that should be allocated to the voter. It can only be bigger. |
