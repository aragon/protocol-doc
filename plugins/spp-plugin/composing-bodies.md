---
type: concept
title: Composing SPP bodies
tags: [governance]
source: spp/src/StagedProposalProcessor.sol
---

# Composing SPP bodies

In [SPP](../spp-plugin.md), a stage's decision-makers, its **bodies**, are *other* contracts: existing governance plugins, a Safe, even an EOA. This page is the integration contract: how a body plugs in, and how to make your own plugin usable as one.

**Acting in a body decides the parent, not the actions.** When someone votes or approves inside a body, they're voting on whether to *advance or veto the SPP proposal at that stage*, not on the proposal's underlying actions directly. The body is a gate; SPP owns the actions and the final execution.

## Automatic vs. manual bodies

Every body is one of two kinds ([configured per stage](./stages-and-bodies.md#bodies)). The split comes down to **how SPP learns the body's verdict**, which depends on whether the body speaks OSx's proposal interface:

- **Automatic** (`isManual = false`): the body is an OSx-native plugin that reports success through [`IProposal`](../../common/proposal.md). So SPP can create a sub-proposal on it when the stage begins (its single action is a callback to `reportProposalResult` pre-filled with the body's verdict), *and* SPP can [poll the body's `hasSucceeded`](./lifecycle.md#how-a-stages-results-are-tallied-push-and-pull) directly, no custom wiring either way. Requires ERC-165 `IProposal` support and that SPP holds `CREATE_PROPOSAL_PERMISSION` on the body.
- **Manual** (`isManual = true`): the body is something that *doesn't* implement OSx's proposal interface, a Safe, a vault, an external Governor, an EOA, so there's no `hasSucceeded` for SPP to poll and no sub-proposal to create. Instead the external system **pushes** its verdict in: it calls `reportProposalResult` to *notify* SPP that it has approved or vetoed. Manual mode is the **interoperability** escape hatch that lets any external address take part in a stage without adopting a single Aragon interface. The trade-off is that someone has to drive that reporting; it isn't automated for you.

## Making your plugin an automatic body

Inherit the shared [`Proposal`/`ProposalUpgradeable`](../../common/proposal.md) base (it gives you `IProposal` + ERC-165), then honor three rules:

1. **`createProposal` must accept SPP's call and add no extra gatekeeping.** SPP passes standard proposal params (metadata, actions, start/end dates, and a `data` blob for anything plugin-specific, declare its shape with `customProposalParamsABI` so SPP and UIs can encode it). Critically, **do not add bespoke eligibility checks inside `createProposal`** (token-balance requirements, allowlists, etc.). SPP relies purely on the OSx [permission system](../../core/permissions.md) to decide whether it may create the sub-proposal; any extra check can make SPP's call fail, and the body then silently drops out of the stage (a `SubProposalNotCreated` event, [no revert](./lifecycle.md#advancing-and-executing)).
2. **`hasSucceeded` must be monotonic**, once it returns `true`, it must stay `true` forever. SPP polls it (the [pull tally](./lifecycle.md#how-a-stages-results-are-tallied-push-and-pull)) possibly long after your body's own voting window closed, while other bodies in the stage are still deciding. A `hasSucceeded` that reverts to `false` after the window strands the SPP proposal.
3. **`canExecute` is yours to define.** SPP never calls it, so it's free to enforce time windows or other conditions for the body's *own* execution; that doesn't affect SPP.

## Using a manual body (a Safe)

For a body that can't be automatic, register its address with `isManual = true` and report results yourself. The canonical example is a Safe as a veto body:

```solidity
// After the SPP proposal exists, submit this as a Safe transaction:
//   to:   <SPP address>
//   data:
abi.encodeCall(
    StagedProposalProcessor.reportProposalResult,
    (proposalId, stageId, ResultType.Veto, /* tryAdvance */ false)
);
```

- `stageId` **must be the stage this body sits in.** Reporting for a stage the proposal hasn't reached yet *reverts* (`StageIdInvalid`); a report for the current or an earlier stage from an address that isn't a registered body of it is silently ignored (a wasted-gas no-op). So target the exact stage, and only where you're actually a body.
- Do it **before the stage's `maxAdvance`**, or the proposal [expires](./lifecycle.md#the-states) regardless.
- `tryAdvance: true` also advances the proposal in the same transaction *if* the reported result is enough and the caller holds `ADVANCE_PERMISSION_ID`.

## Which plugins can be bodies

Any address can be a *manual* body. For *automatic* bodies, the standard OSx governance plugins already qualify (they inherit the proposal base): [Multisig](../multisig-plugin.md), [Token Voting](../token-voting-plugin.md), and [Admin](../admin-plugin.md). A Safe or an external Governor is the typical manual body. This is what makes the canonical pitch real: *multisig approves → token holders vote → admin executes*, each an existing plugin, stitched into a pipeline by SPP.

## SPP inside SPP

Because SPP implements [`IProposal`](../../common/proposal.md), **an SPP instance can be a body of another SPP**, nesting pipelines (a whole sub-pipeline standing in as one stage's decision). It plugs in like any automatic body, with two things to remember: the inner SPP needs its own stages, bodies, and permissions configured, and its verdict reaches the outer SPP only when the inner pipeline is actually **executed** (execution fires the report callback, and since executing is permissionless anyone can trigger it once it's ready). Note the inner SPP's own `hasSucceeded` is strictly monotonic only *after* it executes, a last-stage-advanceable inner proposal that hits `maxAdvance` expires back to un-succeeded, so nesting leans on the inner pipeline being executed, not merely polled.

## Keep in mind

- **Never add custom access control to a body's `createProposal`** beyond OSx permissions, it breaks SPP's automatic sub-proposal creation, and the body silently stops counting.
- **A body's `hasSucceeded` must never go back to false**, or it can permanently stall the SPP proposal.
- **SPP needs `CREATE_PROPOSAL_PERMISSION` on each automatic body**; without it, that body degrades to `SubProposalNotCreated` and contributes nothing.

## See also

- [Lifecycle & state machine](./lifecycle.md) — the push/pull tally that consumes `hasSucceeded`.
- [Stages & bodies](./stages-and-bodies.md) — where a body's kind and result type are set.
- [Multisig](../multisig-plugin.md), [Token Voting](../token-voting-plugin.md), [Admin](../admin-plugin.md) — the composable bodies.
