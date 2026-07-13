---
type: concept
title: Proposals
tags: [governance-primitive]
source: osx/src/common/plugin/extensions/proposal/IProposal.sol, osx/src/common/plugin/extensions/proposal/Proposal.sol, osx/src/common/plugin/extensions/proposal/ProposalUpgradeable.sol
---

# Proposals

A **proposal** is a bundle of [actions](../core/execution.md) that a governance [plugin](../framework/plugins.md) puts up for a decision and, if it passes, executes on the DAO. Token voting, multisig, admin, and staged proposals all differ in *how they decide*, but they share the same proposal shape and lifecycle, defined by the reusable `IProposal` interface and its `Proposal` base. If you're building a governance plugin, you inherit this rather than reinventing it.

## The lifecycle interface

```solidity
function createProposal(bytes metadata, Action[] actions,
                        uint64 startDate, uint64 endDate, bytes data)
    external returns (uint256 proposalId);

function canExecute(uint256 proposalId)  external view returns (bool);
function hasSucceeded(uint256 proposalId) external view returns (bool);
function execute(uint256 proposalId)     external;
```

A subtlety worth internalizing: **`hasSucceeded` must reflect only the *outcome* (did it reach threshold / approval), not the time window.** Whether the voting period is over is a separate axis, folded into `canExecute`. Keeping "did it win" apart from "is it executable now" is what lets, say, an early-execution rule work cleanly. Honor that separation when you implement a governance plugin.

`customProposalParamsABI()` lets a plugin advertise, as a human-readable ABI string, the extra fields it packs into `createProposal`'s `data`, so a UI can render the right form without hard-coding per-plugin knowledge.

## Proposal IDs are derived, not sequential

`Proposal` computes ids like this:

```solidity
proposalId = uint256(keccak256(abi.encode(block.chainid, block.number, address(this), salt)));
```

Not an incrementing counter. This is deliberate: it's collision-free across chains (chain id is mixed in) and avoids the storage cost of a counter. The trade-off lands on you: **if your plugin creates two proposals in the same block, you must vary the `salt` yourself**, the base doesn't track anything to guarantee uniqueness.

> Legacy note: `proposalCount()` is deprecated and now **always reverts** (`FunctionDeprecated`). Don't build on it. The `Proposal` base also answers `supportsInterface` for both the current and an older `IProposal` interface id, for backward compatibility with pre-1.4.0 tooling.

## Keep in mind

- **Identical proposals collide, by plugin convention, not by the base.** The *base* id mixes only chain id, block number, plugin address, and a caller-supplied salt, never the proposal's contents. But concrete governance plugins set that salt to `keccak256(actions, metadata)` (Token Voting does), so a byte-identical proposal in the same block hashes to the same id and reverts as a duplicate. Change the actions, metadata, or salt to resubmit within a block.
- **"Succeeded" isn't "executable".** `hasSucceeded` is outcome-only; timing and the governing plugin's rules decide `canExecute` separately.

## See also

- [Actions and execution](../core/execution.md) — what a proposal carries and how it enacts.
- [Plugins](../framework/plugins.md) — governance plugins implement this interface.
- [Membership](./membership.md) — who is eligible to propose/vote.
- The [plugins](../plugins/index.md) area — concrete decision rules (voting, multisig, …).
