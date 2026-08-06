---
title: IMajorityVoting
kind: interface
source: src/base/IMajorityVoting.sol
summary: "The interface of majority voting plugin."
---

# IMajorityVoting

**Interface** · [`src/base/IMajorityVoting.sol`](https://github.com/aragon/token-voting-plugin/blob/e97b783d76872d694f41dfc4bc846405019ca741/src/base/IMajorityVoting.sol)

**Author:** Aragon X - 2022-2025

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

### canVote

```solidity
function canVote(
    uint256 _proposalId,
    address _account,
    IMajorityVoting.VoteOption _voteOption
) external view returns (bool)
```

Selector: `0x17d1b404`

Checks if an account can participate on a proposal. This can be because the vote
- has not started,
- has ended,
- was executed, or
- the voter doesn't have voting powers.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The proposal Id. |
| `_account` | `address` | The account address to be checked. |
| `_voteOption` | `IMajorityVoting.VoteOption` | Whether the voter abstains, supports or opposes the proposal. |

### execute

```solidity
function execute(uint256 _proposalId) external
```

Selector: `0xfe0d94c1`

Executes a proposal.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal to be executed. |

### getVoteOption

```solidity
function getVoteOption(
    uint256 _proposalId,
    address _account
) external view returns (IMajorityVoting.VoteOption)
```

Selector: `0x970601d8`

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
$$\texttt{minApproval} = \frac{N_\text{yes}}{N_\text{total}}$$
for a proposal is greater or equal than the minimum approval value.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |

### isMinParticipationReached

```solidity
function isMinParticipationReached(uint256 _proposalId) external view returns (bool)
```

Selector: `0x8a4b00f8`

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

### isSupportThresholdReachedEarly

```solidity
function isSupportThresholdReachedEarly(uint256 _proposalId) external view returns (bool)
```

Selector: `0x0de21856`

Checks if the worst-case support value defined as:
$$\texttt{worstCaseSupport} = \frac{N_\text{yes}}{ N_\text{total}-N_\text{abstain}}$$
for a proposal is greater than the support threshold.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |

### minApproval

```solidity
function minApproval() external view returns (uint256)
```

Selector: `0x03ff90f6`

Returns the configured minimum approval value.

### minParticipation

```solidity
function minParticipation() external view returns (uint32)
```

Selector: `0x054fd2c2`

Returns the minimum participation parameter stored in the voting settings.

### supportThreshold

```solidity
function supportThreshold() external view returns (uint32)
```

Selector: `0x7c36e8e8`

Returns the support threshold parameter stored in the voting settings.

### vote

```solidity
function vote(
    uint256 _proposalId,
    IMajorityVoting.VoteOption _voteOption,
    bool _tryEarlyExecution
) external
```

Selector: `0xce6366c4`

Votes on a proposal and, optionally, executes the proposal.

> **Dev:** `_voteOption`, 1 -> abstain, 2 -> yes, 3 -> no

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |
| `_voteOption` | `IMajorityVoting.VoteOption` | The chosen vote option. |
| `_tryEarlyExecution` | `bool` | If `true`, early execution is tried after the vote cast. The call does not revert if early execution is not possible. |

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

| Option | Description |
| --- | --- |
| `None` (0) | The default option state of a voter indicating the absence from the vote. This option neither influences support nor participation. |
| `Abstain` (1) | This option does not influence the support but counts towards participation. |
| `Yes` (2) | This option increases the support and counts towards participation. |
| `No` (3) | This option decreases the support and counts towards participation. |
