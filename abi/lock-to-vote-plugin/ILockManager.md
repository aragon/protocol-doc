---
title: ILockManager
kind: interface
source: src/interfaces/ILockManager.sol
summary: "Helper contract acting as the vault for locked tokens used to vote on LockToGovern plugins."
---

# ILockManager

**Interface** · [`src/interfaces/ILockManager.sol`](https://github.com/aragon/lock-to-vote-plugin/blob/5a513e3d9f1aad35d8926de87c408720e8d20a8d/src/interfaces/ILockManager.sol)

**Author:** Aragon X 2025

Helper contract acting as the vault for locked tokens used to vote on LockToGovern plugins.

## Functions

### activeProposalsCreatedBy

```solidity
function activeProposalsCreatedBy(address _creator) external view returns (uint256 _result)
```

Selector: `0x2383ff1e`

Returns how many active proposalID's were created by the given address

| Parameter | Type | Description |
| --- | --- | --- |
| `_creator` | `address` | The address to use for filtering |

### canVote

```solidity
function canVote(
    uint256 proposalId,
    address voter,
    IMajorityVoting.VoteOption voteOption
) external view returns (bool)
```

Selector: `0x17d1b404`

Checks if an account can participate on a proposal. This can be because the proposal
- has not started,
- has ended,
- was executed, or
- the voter doesn't have any tokens locked.

> **Dev:** The function assumes that the queried proposal exists.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The proposal Id. |
| `voter` | `address` | The account address to be checked. |
| `voteOption` | `IMajorityVoting.VoteOption` | The value of the new vote to register. |

### getLockedBalance

```solidity
function getLockedBalance(address account) external view returns (uint256)
```

Selector: `0xc4086893`

Returns the currently locked balance that the given account has on the contract.

| Parameter | Type | Description |
| --- | --- | --- |
| `account` | `address` | The address whose locked balance is returned. |

### lock()

```solidity
function lock() external
```

Selector: `0xf83d08ba`

Locks the balance currently allowed by msg.sender on this contract
NOTE: Tokens locked and not allocated into a proposal are treated in the same way as the rest.
They can only be unlocked when all active proposals with votes have ended.

### lock(uint256)

```solidity
function lock(uint256 amount) external
```

Selector: `0xdd467064`

Locks the given amount from msg.sender on this contract
NOTE: Tokens locked and not allocated into a proposal are treated in the same way as the rest.
They can only be unlocked when all active proposals with votes have ended.

| Parameter | Type | Description |
| --- | --- | --- |
| `amount` | `uint256` | How many tokens the contract should lock |

### lockAndVote(uint256,uint8,uint256)

```solidity
function lockAndVote(
    uint256 proposalId,
    IMajorityVoting.VoteOption vote,
    uint256 amount
) external
```

Selector: `0x1adb4f63`

Locks the given amount from msg.sender on this contract and registers the given vote on the target plugin

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal where the vote will be registered |
| `vote` | `IMajorityVoting.VoteOption` | The vote to cast (Yes, No, Abstain) |
| `amount` | `uint256` | How many tokens the contract should lock and use for voting |

### lockAndVote(uint256,uint8)

```solidity
function lockAndVote(uint256 proposalId, IMajorityVoting.VoteOption vote) external
```

Selector: `0x98f7aab1`

Locks the balance currently allowed by msg.sender on this contract and registers the given vote on the target plugin

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal where the vote will be registered |
| `vote` | `IMajorityVoting.VoteOption` | The vote to cast (Yes, No, Abstain) |

### plugin

```solidity
function plugin() external view returns (ILockToGovernBase)
```

Selector: `0xef01df4f`

Returns the address of the voting plugin.

### proposalCreated

```solidity
function proposalCreated(uint256 proposalId, address creator) external
```

Selector: `0x6c393965`

Called by the lock to vote plugin whenever a proposal is created. It instructs the manager to start tracking the given proposal.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal that msg.sender is reporting as created. |
| `creator` | `address` | The address creating the proposal. |

### proposalSettled

```solidity
function proposalSettled(uint256 proposalId) external
```

Selector: `0x6689ef0f`

Called by the lock to vote plugin whenever a proposal is executed (or settled).
It instructs the manager to remove the proposal from the list of active proposal locks.
There's no guarantee that `proposalSettled()` will be reliably called for a proposal ID.
Manually checking a proposal's state may be necessary in order to verify that it has ended.

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal that msg.sender is reporting as done. |

### pruneProposals

```solidity
function pruneProposals(uint256 count) external
```

Selector: `0xbfadf8f7`

Triggers a manual cleanup of the known proposal ID's that have already ended.
Settled proposals are garbage collected when they are executed or when a user unlocks his tokens.
Use this method if a long list of unsettled yet ended proposals ever creates a gas bottleneck that discourages users from unlocking.

| Parameter | Type | Description |
| --- | --- | --- |
| `count` | `uint256` | How many proposals should be cleaned up, at most. |

### setPluginAddress

```solidity
function setPluginAddress(ILockToGovernBase plugin) external
```

Selector: `0x587a6b40`

Defines the given plugin address as the target for voting.

| Parameter | Type | Description |
| --- | --- | --- |
| `plugin` | `ILockToGovernBase` | The address of the contract to use as the plugin. |

### settings

```solidity
function settings() external view returns (PluginMode pluginMode)
```

Selector: `0xe06174e4`

Returns the current settings of the LockManager.

| Returns | Type | Description |
| --- | --- | --- |
| `pluginMode` | `PluginMode` | The plugin mode (currently, voting only) |

### token

```solidity
function token() external view returns (address)
```

Selector: `0xfc0c546a`

Returns the address of the token contract used to determine the voting power.

### unlock

```solidity
function unlock() external
```

Selector: `0xa69df4b5`

If the governance plugin allows it, releases all active locks placed on active proposals and transfers msg.sender's locked balance back. Depending on the current mode, it withdraws only if no locks are being used in active proposals.

### vote

```solidity
function vote(uint256 proposalId, IMajorityVoting.VoteOption vote) external
```

Selector: `0x943e8216`

Uses the locked balance to vote on the given proposal for the registered plugin

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID of the proposal where the vote will be registered |
| `vote` | `IMajorityVoting.VoteOption` | The vote to cast (Yes, No, Abstain) |
