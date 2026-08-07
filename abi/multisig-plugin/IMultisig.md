---
type: reference
title: IMultisig
kind: interface
source: multisig-plugin/packages/contracts/src/IMultisig.sol
summary: "An interface for an on-chain multisig governance plugin in which a proposal passes if X out of Y approvals are met."
---

# IMultisig

**Interface** · [`packages/contracts/src/IMultisig.sol`](https://github.com/aragon/multisig-plugin/blob/c1b0e04919819f8fb1ec110743085dfb0dd7cc02/packages/contracts/src/IMultisig.sol)

**Explained in:** [Multisig Plugin](../../plugins/multisig-plugin.md)

**Author:** Aragon X - 2022-2024

An interface for an on-chain multisig governance plugin in which a proposal passes
if X out of Y approvals are met.

**security-contact:** sirt@aragon.org

## Functions

### addAddresses

```solidity
function addAddresses(address[] _members) external
```

Selector: `0x3628731c`

Adds new members to the address list. Previously, it checks if the new address
list length would be greater than `type(uint16).max`, the maximal number of approvals.

| Parameter | Type | Description |
| --- | --- | --- |
| `_members` | `address[]` | The addresses of the members to be added. |

### approve

```solidity
function approve(uint256 _proposalId, bool _tryExecution) external
```

Selector: `0x747442d3`

Records an approval for a proposal and, if specified, attempts execution if certain conditions are met.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal to approve. |
| `_tryExecution` | `bool` | If `true`, attempts execution of the proposal after approval, without reverting on failure. |

### canApprove

```solidity
function canApprove(uint256 _proposalId, address _account) external view returns (bool)
```

Selector: `0x29245f56`

Checks if an account is eligible to participate in a proposal vote.
Confirms that the proposal is open, the account is listed as a member,
and the account has not previously voted or approved this proposal.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |
| `_account` | `address` | The address of the account to check. |

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

Executes a proposal if all execution conditions are met.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal to be executed. |

### hasApproved

```solidity
function hasApproved(uint256 _proposalId, address _account) external view returns (bool)
```

Selector: `0x2358d5a8`

Returns whether the account has approved the proposal.

| Parameter | Type | Description |
| --- | --- | --- |
| `_proposalId` | `uint256` | The ID of the proposal. |
| `_account` | `address` | The account address to be checked. |

### removeAddresses

```solidity
function removeAddresses(address[] _members) external
```

Selector: `0xa84eb999`

Removes existing members from the address list. Previously, it checks if the
new address list length is at least as long as the minimum approvals parameter requires.
Note that `minApprovals` is must be at least 1 so the address list cannot become empty.

| Parameter | Type | Description |
| --- | --- | --- |
| `_members` | `address[]` | The addresses of the members to be removed. |
