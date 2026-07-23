---
type: concept
title: Multisig Plugin
tags: [governance]
source: multisig-plugin/packages/contracts/src/Multisig.sol, multisig-plugin/packages/contracts/src/IMultisig.sol, multisig-plugin/packages/contracts/src/MultisigSetup.sol
---

# Multisig Plugin

The Multisig Plugin is the simplest governance [plugin](../framework/plugins.md): a fixed list of members, and a proposal executes once enough of them have **approved** it. No tokens, no weights, no percentages, just "N of the M members said yes."

If you know the [Token Voting Plugin](./token-voting-plugin.md), the contrast is the quickest way in:

| | Multisig | [Token Voting](./token-voting-plugin.md) |
|---|---|---|
| Who votes | a flat [member list](./multisig-plugin/membership.md) | anyone holding an `IVotes` token |
| Weight | one member, one approval (unweighted) | proportional to token [voting power](./token-voting-plugin/voting-power.md) |
| Passing rule | `approvals >= minApprovals` | [support / participation / approval ratios](./majority-voting.md) |
| Opposition | none, you approve or you don't | `No` and `Abstain` votes |
| Voting window | creator-chosen, **no minimum duration** | a period with a `minDuration` floor |
| If it doesn't pass | it simply **expires** unexecuted | it's voted down |

## Approving, not voting

The deepest difference from [token voting](./majority-voting.md) is what a participant can *express*. A token vote carries three distinct signals: `Yes`, `No` (active opposition), and `Abstain` (present, but taking no side). Multisig collapses all of that to a single bit, **you have approved, or you have not.** There is no on-chain "no" and no "abstain".

That's a real semantic trade, not just a simpler UI:

- **Non-approval is ambiguous.** A member who hasn't approved might oppose the proposal, might not have seen it yet, or might simply be away, the contract cannot tell these apart. Only *consent* is recorded on-chain; dissent, indecision, and absence all look identical.
- **Opposition is passive.** You don't defeat a proposal by voting against it; you defeat it by withholding approval until it [expires](#the-proposal-lifecycle). There is no countervailing vote to cast and no quorum-of-turnout to measure.
- **The threshold is absolute, not relative.** Passing needs `minApprovals` yes-signals, full stop, there's no ratio of yes-to-no (there are no no's) and no participation floor. This is why the whole model reduces to one counter.

Crucially, the member list doesn't *dictate* this rule, the two are orthogonal. The same [Addresslist](../common/membership.md) can instead drive full [majority voting](./majority-voting.md), with members casting `Yes`/`No`/`Abstain`, which is exactly what the earlier Addresslist Voting plugin did (now deprecated). Multisig deliberately takes the leaner path: count approvals to a threshold, nothing more. So the real choice isn't "members vs tokens", it's *what a participant may express*. If you need members to actively reject or formally abstain, you want a majority-voting model; multisig is right when a fixed group just needs "enough of us said go."

Under the hood it's a [`PluginUUPSUpgradeable`](../framework/plugin-types.md) plugin reusing the shared [proposal](../common/proposal.md) lifecycle and [Addresslist membership](../common/membership.md). The one page of real depth, member management and the two-speed eligibility model, is [Membership & eligibility](./multisig-plugin/membership.md).

## Why on-chain approvals

A traditional multisig (Safe and its kin) collects **off-chain signatures** and submits them together once the threshold is met; a relayer or UI aggregates them. This plugin works the other way round: **each approval is its own on-chain transaction.** That's a deliberate design choice with real consequences:

- **The approval trail *is* on-chain history.** Every approval is a public transaction and an `Approved` event, not a bundle assembled somewhere off-chain, so who approved what, and when, is transparent and indexable by default.
- **No signing infrastructure to run or trust.** There's no signature-relaying service; members act on the DAO directly.
- **It composes with the rest of OSx.** Approvals and execution flow through the same [permission system](../core/permissions.md) and [conditions](../common/permission-conditions.md) as every other plugin, so the multisig isn't a separate signing scheme bolted on, it's a first-class DAO governor (it can hold [`EXECUTE_PERMISSION_ID`](../core/execution.md), be gated by conditions, and so on).

The trade-off is gas: N approvals are N transactions. For DAO governance that's usually the right call; for high-frequency signing it's a cost to weigh.

## Its two settings

```solidity
struct MultisigSettings {
    bool   onlyListed;    // may only members create proposals?
    uint16 minApprovals;  // how many approvals a proposal needs to pass
}
```

Changed via `updateMultisigSettings` (gated by `UPDATE_MULTISIG_SETTINGS_PERMISSION_ID`, held by the DAO). Like every setting in OSx governance, `minApprovals` is **frozen into each proposal at creation**, changing it later never moves the bar on an open proposal. `minApprovals` is always kept within `[1, member count]`, see the [invariant](./multisig-plugin/membership.md#minapprovals-and-the-member-count).

## The proposal lifecycle

**Create.** Records a membership [snapshot](./multisig-plugin/membership.md#two-speed-eligibility) (the prior block), freezes `minApprovals` and the [execution target](../framework/plugins.md#how-a-plugin-makes-the-dao-act), stores the [actions](../core/execution.md) and start/end dates. Who may create depends on `onlyListed` (enforced by a [condition](./multisig-plugin/membership.md#who-can-create-vs-who-can-approve)). Unlike [token voting](./majority-voting.md), there's **no minimum duration**: a proposal can start immediately, and its window is just a deadline for gathering approvals, which also bounds how long the proposal's stored actions stay executable, so a stale proposal can't sit around and fire much later under changed circumstances. The creator can approve (and even try to execute) in the same transaction, so a small multisig can create, approve, and execute a proposal in one go.

**Approve.** Each eligible member calls `approve` once, `approvals` ticks up by one. A member can't approve twice, and eligibility is judged against the proposal's snapshot (below). Passing `tryExecution: true` executes immediately if the proposal has just reached the threshold, best-effort: if it can't execute, the approval still succeeds silently.

**Execute.** Once `approvals >= minApprovals` and the proposal is still within its window, anyone with `EXECUTE_PROPOSAL_PERMISSION_ID` calls `execute`; the plugin hands the actions to the DAO (it holds [`EXECUTE_PERMISSION_ID`](../core/execution.md) on the DAO). By default that permission is open to **anyone**, the approval threshold is the real gate, so letting any address trigger a passed proposal just stops it getting stuck.

> **Succeeded is not the same as executable.** `hasSucceeded` is a pure "did it reach `minApprovals`?" check, it stays true forever once met. `execute`, though, also requires being inside the voting window. So a proposal that reached its approvals but wasn't executed before `endDate` is **permanently stuck**: succeeded, but no longer executable. Execute passed multisig proposals before they expire.

## Permissions it sets up

`MultisigSetup` wires these on install:

| Permission | On (where) | Granted to (who) | Condition | Gates |
|---|---|---|---|---|
| `EXECUTE_PERMISSION_ID` | DAO | plugin | none | the plugin calling `dao.execute` |
| `CREATE_PROPOSAL_PERMISSION_ID` | plugin | any address | `ListedCheckCondition` | `createProposal` |
| `EXECUTE_PROPOSAL_PERMISSION_ID` | plugin | any address | none | `execute` |
| `UPDATE_MULTISIG_SETTINGS_PERMISSION_ID` | plugin | DAO | none | `updateMultisigSettings`, `addAddresses`, `removeAddresses` |
| `SET_TARGET_CONFIG_PERMISSION_ID` | plugin | DAO | none | `setTargetConfig` |
| `SET_METADATA_PERMISSION_ID` | plugin | DAO | none | `setMetadata` |

Note the asymmetry: **create is conditioned, execute is not.** Proposal creation is opened to any address but narrowed by [`ListedCheckCondition`](./multisig-plugin/membership.md#who-can-create-vs-who-can-approve) (when `onlyListed` is on); execution is deliberately open, gated only by the approval count.

## Installing it

`MultisigSetup` (a [plugin setup](../framework/plugin-setup.md)) deploys the plugin proxy from your install data (the initial members, the settings, the target), deploys a fresh `ListedCheckCondition` (returned as its helper), and returns the permission set above for the [PluginSetupProcessor](../framework/plugin-setup-processor.md) to apply.

## Keep in mind

- **There's no rejection, only expiry.** A proposal that can't gather `minApprovals` before `endDate` dies unexecuted; nobody "votes no".
- **Execute a passed proposal before it expires**, or it's stuck forever (you'd have to recreate it with *different* metadata, since [the id hashes actions + metadata](../common/proposal.md)).
- **Execution is open to anyone by default.** The approval threshold is the security boundary, not who calls `execute`.

## See also

- [Membership & eligibility](./multisig-plugin/membership.md) — managing members, the `minApprovals` invariant, and the two-speed eligibility model.
- [Token Voting Plugin](./token-voting-plugin.md) — the token-weighted alternative.
- [Admin Plugin](./admin-plugin.md) — direct execution with no vote at all (the single-controller exception, for getting a DAO started).
- [Proposals](../common/proposal.md) and [Membership](../common/membership.md) — the shared primitives it builds on.
