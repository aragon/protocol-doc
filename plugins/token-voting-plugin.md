---
type: concept
title: Token Voting Plugin
tags: [governance, voting]
source: token-voting-plugin/src/TokenVoting.sol, token-voting-plugin/src/TokenVotingSetup.sol
---

# Token Voting Plugin

The Token Voting Plugin is the "one token, one vote" governance [plugin](../framework/plugins.md), the most common way an OSx DAO governs itself. Members' influence is proportional to the governance tokens they hold (or that others delegate to them), and a proposal passes when it meets a configurable [majority-voting rule](./majority-voting.md). It also puts the protocol's [shared building blocks](../common/index.md) to work: it reuses the [proposal](../common/proposal.md), [membership](../common/membership.md), and [ratio](../common/ratio.md) primitives, adds token-based [voting power](./token-voting-plugin/voting-power.md), and is installed through the standard [framework](../framework/plugin-setup-processor.md).

This folder covers it in four pages:

- **This page** — what it is, the proposal lifecycle, and the permissions it sets up.
- [Voting power](./token-voting-plugin/voting-power.md) — where power comes from: the token, the snapshot, delegation, and who may propose.
- [Governance tokens](./token-voting-plugin/governance-tokens.md) — mint a new token, reuse an `IVotes` token, or wrap an existing ERC-20.
- The shared voting model: [majority voting](./majority-voting.md) (the thresholds) and [voting modes](./voting-modes.md) (Standard / Early Execution / Vote Replacement).

## Why it needs a special token

The problem any token vote must solve is **double voting**: hold tokens, vote, transfer them to a fresh address, vote again, the same tokens counted twice. The plugin sidesteps this by only accepting tokens that support historical, per-account snapshots (`IVotes` / `ERC20Votes`). Every proposal fixes a **snapshot block** at creation and weighs each vote by the holder's balance *at that block*, so moving tokens after a proposal opens changes nothing. This one requirement, and everything that follows from it (delegation, snapshots, wrapping a plain ERC-20), is the subject of [Voting power](./token-voting-plugin/voting-power.md).

## The proposal lifecycle

**Create.** A proposal records its snapshot block, freezes the voting settings and its [execution target](../framework/plugins.md#how-a-plugin-makes-the-dao-act) (where its approved actions are sent, normally the DAO), stores the [actions](../core/execution.md) to run if it passes, and its start and end dates (the end must be at least `minDuration` after the start). The creator may cast their vote in the same transaction ("propose and vote yes"). Who may create is gated, see [gating proposal creation](./token-voting-plugin/voting-power.md#who-may-propose).

**Vote.** Eligible holders call `vote` with `Yes`, `No`, or `Abstain`, weighted by their snapshot power. Whether a voter can later change their vote depends on the [voting mode](./voting-modes.md). A voter may also ask to execute in the same call (`tryEarlyExecution`) if the mode and thresholds allow and they hold execute permission.

**Execute.** Once the proposal has passed (all [thresholds](./majority-voting.md#the-three-thresholds) met, and the timing allowed by the mode), anyone with `EXECUTE_PROPOSAL_PERMISSION_ID` calls `execute`. The plugin hands the approved actions to the DAO (via [`execute`](../core/execution.md), which is why it holds `EXECUTE_PERMISSION_ID` on the DAO) and marks the proposal executed. A passed proposal stays executable until someone runs it, there's no expiry.

Voting settings (`supportThreshold`, `minParticipation`, `minDuration`, `minProposerVotingPower`, the voting mode, and `minApproval`) are changed through `updateVotingSettings` / `updateMinApprovals`, gated by `UPDATE_VOTING_SETTINGS_PERMISSION_ID` (held by the DAO, so tuning governance is itself a governance decision). Changes only affect proposals created *after* them; each proposal keeps the settings frozen at its creation.

## Permissions it sets up

`TokenVotingSetup` wires these on install (verified against the plugin's own docs):

| Permission | On (where) | Granted to (who) | Condition | Gates |
|---|---|---|---|---|
| `EXECUTE_PERMISSION_ID` | DAO | plugin | none | the plugin calling `dao.execute` |
| `CREATE_PROPOSAL_PERMISSION_ID` | plugin | any address | `VotingPowerCondition` | `createProposal` |
| `EXECUTE_PROPOSAL_PERMISSION_ID` | plugin | any address | none | `execute` |
| `UPDATE_VOTING_SETTINGS_PERMISSION_ID` | plugin | DAO | none | `updateVotingSettings`, `updateMinApprovals` |
| `SET_TARGET_CONFIG_PERMISSION_ID` | plugin | DAO | none | `setTargetConfig` |
| `SET_METADATA_PERMISSION_ID` | plugin | DAO | none | `setMetadata` |
| `MINT_PERMISSION_ID` | governance token | DAO | none | `mint` (only when a new token is minted) |

The two `any address` grants are intentional: proposal creation is opened to everyone but narrowed by the [`VotingPowerCondition`](./token-voting-plugin/voting-power.md#who-may-propose) to holders above a minimum, and execution is opened to everyone because the [threshold math](./majority-voting.md) already decides *whether* a proposal may execute, letting anyone trigger it just stops a passed proposal getting stuck.

## Installing it

You never wire this by hand. `TokenVotingSetup` (a [plugin setup](../framework/plugin-setup.md)) deploys the plugin proxy, arranges the [governance token](./token-voting-plugin/governance-tokens.md), deploys the `VotingPowerCondition`, and returns the permission set above for the [PluginSetupProcessor](../framework/plugin-setup-processor.md) to apply. Its helpers are the condition and the token, so an update or uninstall can find them again. The token decision is the substance of that step, see [Governance tokens](./token-voting-plugin/governance-tokens.md).

## Keep in mind

- **Delegate, or you have no power.** Holding the token isn't enough; voting power is zero until delegated. The most common "why can't I vote?" is an undelegated balance. See [voting power](./token-voting-plugin/voting-power.md#delegation).
- **Power is fixed at the snapshot.** Acquiring or delegating more tokens after a proposal opens does nothing for that proposal.
- **Identical proposals collide.** The proposal id hashes the actions and metadata, so a byte-identical resubmission reverts; vary the metadata to resubmit.

## See also

- [Lock to Vote Plugin](./lock-to-vote-plugin.md) — token voting powered by *locked* tokens instead of a balance snapshot; the closest cousin, and an instructive contrast.
- [Multisig Plugin](./multisig-plugin.md) (approval by a fixed member set) and [Admin Plugin](./admin-plugin.md) (direct execution by one address), the non-token alternatives.
- [Majority voting](./majority-voting.md) and [Voting modes](./voting-modes.md) — the shared voting model this plugin builds on.
