---
type: reference
title: LockManagerERC20
kind: contract
source: lock-to-vote-plugin/src/LockManagerERC20.sol
summary: "Helper contract acting as the vault for locked tokens used to vote on LockToGovern plugins."
---

# LockManagerERC20

**Contract** · [`src/LockManagerERC20.sol`](https://github.com/aragon/lock-to-vote-plugin/blob/5a513e3d9f1aad35d8926de87c408720e8d20a8d/src/LockManagerERC20.sol)

**Author:** Aragon X 2025

**Inherits:** [`ILockManager`](./ILockManager.md), [`LockManagerBase`](./LockManagerBase.md)

Helper contract acting as the vault for locked tokens used to vote on LockToGovern plugins.

## Constructor

### constructor

```solidity
constructor(IERC20 _token)
```

| Parameter | Type | Description |
| --- | --- | --- |
| `_token` | `IERC20` | The address of the token contract that users can lock |

## Functions

### activeProposalsCreatedBy

```solidity
function activeProposalsCreatedBy(address _creator) external view returns (uint256 _result)
```

Selector: `0x2383ff1e`

Returns how many of the known proposalID's were created by the given address

| Parameter | Type | Description |
| --- | --- | --- |
| `_creator` | `address` | The address to use for filtering |

### canVote

```solidity
function canVote(
    uint256 _proposalId,
    address _voter,
    IMajorityVoting.VoteOption _voteOption
) external view returns (bool)
```

Selector: `0x17d1b404`

Checks if an account can participate on a proposal. This can be because the proposal - has not started, - has ended, - was executed, or - the voter doesn't have any tokens locked.

> **Dev:** The function assumes that the queried proposal exists.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | Returns true if the account is allowed to vote. |

### getLockedBalance

```solidity
function getLockedBalance(address _account) external view returns (uint256)
```

Selector: `0xc4086893`

Returns the currently locked balance that the given account has on the contract.

### knownProposalIdAt

```solidity
function knownProposalIdAt(uint256 _index) external view returns (uint256)
```

Selector: `0xc110d7b4`

Returns the known proposalID at the given index

| Parameter | Type | Description |
| --- | --- | --- |
| `_index` | `uint256` | The position at which to read the proposalId |

### knownProposalIdCreators

```solidity
function knownProposalIdCreators(uint256) external view returns (address)
```

Selector: `0x81ebbcb0`

Keeps track of who created each known proposalId

### knownProposalIdsLength

```solidity
function knownProposalIdsLength() external view returns (uint256)
```

Selector: `0x4a5b3860`

Returns the number of known proposalID's

### lock()

```solidity
function lock() external
```

Selector: `0xf83d08ba`

Locks the balance currently allowed by msg.sender on this contract NOTE: Tokens locked and not allocated into a proposal are treated in the same way as the rest. They can only be unlocked when all active proposals with votes have ended.

### lock(uint256)

```solidity
function lock(uint256 _amount) external
```

Selector: `0xdd467064`

Locks the given amount from msg.sender on this contract NOTE: Tokens locked and not allocated into a proposal are treated in the same way as the rest. They can only be unlocked when all active proposals with votes have ended.

### lockAndVote(uint256,uint8,uint256)

```solidity
function lockAndVote(
    uint256 _proposalId,
    IMajorityVoting.VoteOption _voteOption,
    uint256 _amount
) external
```

Selector: `0x1adb4f63`

Locks the given amount from msg.sender on this contract and registers the given vote on the target plugin

### lockAndVote(uint256,uint8)

```solidity
function lockAndVote(uint256 _proposalId, IMajorityVoting.VoteOption _voteOption) external
```

Selector: `0x98f7aab1`

Locks the balance currently allowed by msg.sender on this contract and registers the given vote on the target plugin

### plugin

```solidity
function plugin() external view returns (ILockToGovernBase)
```

Selector: `0xef01df4f`

The address of the lock to vote plugin to use

### proposalCreated

```solidity
function proposalCreated(uint256 _proposalId, address _creator) external
```

Selector: `0x6c393965`

Called by the lock to vote plugin whenever a proposal is created. It instructs the manager to start tracking the given proposal.

### proposalSettled

```solidity
function proposalSettled(uint256 _proposalId) external
```

Selector: `0x6689ef0f`

Called by the lock to vote plugin whenever a proposal is executed (or settled). It instructs the manager to remove the proposal from the list of active proposal locks. There's no guarantee that `proposalSettled()` will be reliably called for a proposal ID. Manually checking a proposal's state may be necessary in order to verify that it has ended.

### pruneProposals

```solidity
function pruneProposals(uint256 _count) external
```

Selector: `0xbfadf8f7`

Triggers a manual cleanup of the known proposal ID's that have already ended. Settled proposals are garbage collected when they are executed or when a user unlocks his tokens. Use this method if a long list of unsettled yet ended proposals ever creates a gas bottleneck that discourages users from unlocking.

### setPluginAddress

```solidity
function setPluginAddress(ILockToGovernBase _newPluginAddress) external
```

Selector: `0x587a6b40`

Defines the given plugin address as the target for voting.

### settings

```solidity
function settings() external view returns (PluginMode pluginMode)
```

Selector: `0xe06174e4`

The current LockManager settings

### token

```solidity
function token() external view returns (address _token)
```

Selector: `0xfc0c546a`

Returns the address of the token contract used to determine the voting power.

> **Dev:** Not having `token` as a public variable because the return types would differ (address vs IERC20)

| Returns | Type | Description |
| --- | --- | --- |
| `_token` | `address` | The token used for voting. |

### unlock

```solidity
function unlock() external
```

Selector: `0xa69df4b5`

If the governance plugin allows it, releases all active locks placed on active proposals and transfers msg.sender's locked balance back. Depending on the current mode, it withdraws only if no locks are being used in active proposals.

### vote

```solidity
function vote(uint256 _proposalId, IMajorityVoting.VoteOption _voteOption) external
```

Selector: `0x943e8216`

Uses the locked balance to vote on the given proposal for the registered plugin

## Events

### BalanceLocked

```solidity
event BalanceLocked(address indexed voter, uint256 amount)
```

Emitted when a token holder locks funds into the LockManager contract.

| Parameter | Type | Description |
| --- | --- | --- |
| `voter` | `address` | The address of the account locking tokens. |
| `amount` | `uint256` | The amount of tokens being added to the existing balance. |

### BalanceUnlocked

```solidity
event BalanceUnlocked(address indexed voter, uint256 amount)
```

Emitted when a token holder unlocks funds from the manager contract

| Parameter | Type | Description |
| --- | --- | --- |
| `voter` | `address` | The address of the account unlocking tokens. |
| `amount` | `uint256` | The amount of tokens being unlocked. |

### ProposalSettled

```solidity
event ProposalSettled(uint256 indexed proposalId)
```

Emitted when the plugin reports a proposal as settled

> **Dev:** The event could be emitted with a delay, compared to the effective proposal endDate

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID the proposal where votes can no longer be submitted or cleared |

## Errors

### InvalidPlugin

```solidity
error InvalidPlugin()
```

Thrown when trying to set an invalid contract as the plugin

### InvalidPluginAddress

```solidity
error InvalidPluginAddress()
```

Thrown when the address calling proposalSettled() is not the plugin's

### LocksStillActive

```solidity
error LocksStillActive()
```

Raised when attempting to unlock while active votes are cast in strict mode

### NoBalance

```solidity
error NoBalance()
```

Raised when the caller holds no tokens or didn't lock any tokens

### ProposalCreatedStillActive

```solidity
error ProposalCreatedStillActive(uint256 proposalId)
```

Thrown when attempting to unlock with a created proposal that is still active

| Parameter | Type | Description |
| --- | --- | --- |
| `proposalId` | `uint256` | The ID the active proposal |

### SetPluginAddressForbidden

```solidity
error SetPluginAddressForbidden()
```

Thrown when trying to define the address of the plugin after it already was
