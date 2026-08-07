---
type: reference
title: IMajorityVoting
kind: interface
source: lock-to-vote-plugin/src/interfaces/IMajorityVoting.sol
summary: "The interface of majority voting plugin."
---

# IMajorityVoting

**Interface** · [`src/interfaces/IMajorityVoting.sol`](https://github.com/aragon/lock-to-vote-plugin/blob/5a513e3d9f1aad35d8926de87c408720e8d20a8d/src/interfaces/IMajorityVoting.sol)

**Explained in:** [Lock to Vote Plugin](../../plugins/lock-to-vote-plugin.md)

**Author:** Aragon X - 2022-2024

The interface of majority voting plugin.

**security-contact:** sirt@aragon.org

## Functions

### canExecute

```solidity
function canExecute(uint256 _proposalId) external view returns (bool)
```

Selector: `0xcc63604a`

Checks if a proposal can be executed.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal to be checked. |

### execute

```solidity
function execute(uint256 _proposalId) external
```

Selector: `0xfe0d94c1`

Executes a proposal.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal to be executed. |

### getVote

```solidity
function getVote(
    uint256 _proposalId,
    address _account
) external view returns (IMajorityVoting.VoteEntry)
```

Selector: `0xbc3f931f`

Returns whether the account has voted for the proposal.

> **Dev:** May return `none` if the `_proposalId` does not exist,
> or the `_account` does not have voting power.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |
| `_account` | `address` | The account address to be checked. |

### isMinApprovalReached

```solidity
function isMinApprovalReached(uint256 _proposalId) external view returns (bool)
```

Selector: `0x36fa9589`

Checks if the min approval value defined as:
$$\texttt{minApprovalRatio} = \frac{N_\text{yes}}{N_\text{total}}$$
for a proposal is greater or equal than the minimum approval value.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |

### isMinVotingPowerReached

```solidity
function isMinVotingPowerReached(uint256 _proposalId) external view returns (bool)
```

Selector: `0xcfd40b84`

Checks if the participation value defined as:
$$\texttt{participation} = \frac{N_\text{yes}+N_\text{no}+N_\text{abstain}}{N_\text{total}}$$
for a proposal is greater or equal than the minimum participation value.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |

### isSupportThresholdReached

```solidity
function isSupportThresholdReached(uint256 _proposalId) external view returns (bool)
```

Selector: `0xcf131149`

Checks if the support value defined as:
$$\texttt{support} = \frac{N_\text{yes}}{N_\text{yes}+N_\text{no}}$$
for a proposal is greater than the support threshold.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |

### minApprovalRatio

```solidity
function minApprovalRatio() external view returns (uint256)
```

Selector: `0x0e04be90`

Returns the configured minimum approval ratio.

### minParticipationRatio

```solidity
function minParticipationRatio() external view returns (uint32)
```

Selector: `0xb9835a17`

Returns the minimum participation parameter stored in the voting settings.

### supportThresholdRatio

```solidity
function supportThresholdRatio() external view returns (uint32)
```

Selector: `0x2e747051`

Returns the support threshold parameter stored in the voting settings.

## Events

### VoteCast

```solidity
event VoteCast(
    uint256 indexed proposalId,
    address indexed voter,
    IMajorityVoting.VoteOption voteOption,
    uint256 votingPower
)
```

Emitted when a vote is cast by a voter.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal. |
| `voter` | `address` | The voter casting the vote. |
| `voteOption` | `IMajorityVoting.VoteOption` | The casted vote option. |
| `votingPower` | `uint256` | The voting power behind this vote. |

## Enums

### VoteOption

```solidity
enum VoteOption {
    None,
    Abstain,
    Yes,
    No
}
```

Vote options that a voter can chose from.

| Option | Value | Description |
| --- | --- | --- |
| `None` | `0` | The default option state of a voter indicating the absence from the vote. This option neither influences support nor participation. |
| `Abstain` | `1` | This option does not influence the support but counts towards participation. |
| `Yes` | `2` | This option increases the support and counts towards participation. |
| `No` | `3` | This option decreases the support and counts towards participation. |

## Structs

### VoteEntry

```solidity
struct VoteEntry {
    IMajorityVoting.VoteOption voteOption;
    uint256 votingPower;
}
```

Holds the state of an account's vote

| Field | Type | Description |
| --- | --- | --- |
| `voteOption` | `IMajorityVoting.VoteOption` | 1 -> abstain, 2 -> yes, 3 -> no |
| `votingPower` | `uint256` | How many tokens the account has allocated to `voteOption` |
