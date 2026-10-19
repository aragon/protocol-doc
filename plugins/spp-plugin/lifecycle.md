---
type: concept
title: SPP lifecycle & state machine
tags: [governance, security]
source: staged-proposal-processor-plugin/src/StagedProposalProcessor.sol
---

# SPP lifecycle & state machine

An [SPP](../spp-plugin.md) proposal moves from creation through each [stage](./stages-and-bodies.md) to execution. Its state determines whether it may advance, based on the stage's timing and body results.

## The states

At any moment a proposal is in one of these states, computed live from timestamps and tallies (only `Executed` and `Canceled` are stored flags; even `Expired` is derived, from `maxAdvance`):

- **Active** — exists, but not yet advanceable (too early, or the current stage's thresholds aren't met).
- **Advanceable** — the current stage's thresholds are met, within its timing window; the proposal can advance (or, on the last stage, execute).
- **Executed** — terminal, the actions ran.
- **Canceled** — terminal.
- **Expired** — the stage's `maxAdvance` passed without becoming advanceable. **Terminal and unrecoverable**: nothing un-expires a proposal.

The `state(proposalId)` function decides this, in order (each check short-circuits):

1. executed → **Executed**; canceled → **Canceled** (sticky, checked first).
2. past `maxAdvance` → **Expired**.
3. before `minAdvance` → **Active** (too early, regardless of how many bodies already reported).
4. veto stage and `voteDuration` not yet elapsed → **Active** (the [veto-window floor](./stages-and-bodies.md#voteduration-the-field-that-does-two-jobs)).
5. thresholds met → **Advanceable**; otherwise → **Active**.

"Thresholds met" applies the [hard-veto rule](./stages-and-bodies.md#vetoes-always-win): enough vetoes → not met; otherwise, enough approvals → met.

From `state`, the rest follows: `canProposalAdvance` is "state is Advanceable"; `canExecute` is "Advanceable *and* on the last stage"; and `hasSucceeded` (the [`IProposal`](../../common/proposal.md) signal other plugins poll) is "on the last stage and Advanceable **or** already Executed". It stays true after execution, which matters for [nesting SPP as a body](./composing-bodies.md).

## How a stage's results are tallied: push and pull

A stage's tally, how many bodies have approved or vetoed, is computed two ways per body:

- **Push (a body reports).** A body (or anyone acting for it) calls `reportProposalResult`, which records its verdict in storage. Once recorded, that verdict is **cached permanently and trusted**, SPP never re-checks it. This is how [automatic bodies](./composing-bodies.md) feed back: the sub-proposal SPP created on them has a single action that calls `reportProposalResult` when the body's own process executes it.
- **Pull (SPP asks).** If a body hasn't reported but is automatic and had a sub-proposal created, SPP does a read-only `hasSucceeded` call on that sub-proposal on the fly; if it succeeded, the body's registered [`resultType`](./stages-and-bodies.md#bodies) (approval or veto) is credited. SPP doesn't ask *which way* the body voted, it decided at config time what "this body succeeded" means.

Why both? Push requires someone to actually execute the body's sub-proposal; pull lets SPP treat a stage as decided the moment the body's internal vote passed, without waiting for that extra execution. Whichever happens first wins (a cached push skips the pull). The pull call is deliberately hardened, a body that reverts or returns garbage simply contributes nothing rather than breaking the whole tally.

> This is why an automatic body's `hasSucceeded` **must be monotonic** (true forever once true): SPP may poll it long after the body's own voting window closed, while still waiting on other bodies. A body whose `hasSucceeded` flips back to false would silently strand the SPP proposal. See [composing bodies](./composing-bodies.md).

## Reporting a result

```solidity
reportProposalResult(uint256 proposalId, uint16 stageId, ResultType resultType, bool tryAdvance)
```

- **Anyone may call it**, but it's safe: SPP only ever *reads* the recorded verdict for addresses actually registered as bodies in that stage. A report from a non-body is simply never counted (it just wastes the caller's gas, worth a UI guard, not a contract one).
- **A report overwrites.** There's no "first report is final", a body can flip its own verdict (approval ↔ veto) any time before the proposal actually advances past the stage.
- **`tryAdvance: true`** also advances when the proposal is advanceable and the caller has `ADVANCE_PERMISSION_ID`, or `EXECUTE_PROPOSAL_PERMISSION_ID` on the last stage. Missing permission or unsuitable state skips the attempt, so the body's report and other actions in its transaction can still succeed when SPP is not ready. If advancement actually runs, an execution failure can still revert the transaction.

## Advancing and executing

`advanceProposal` moves an advanceable proposal to the next stage (creating that stage's sub-proposals) or, on the last stage, executes it. **Advancing past the last stage *is* executing**; there's no separate "finished" step. Advancing needs `ADVANCE_PERMISSION_ID`; executing needs `EXECUTE_PROPOSAL_PERMISSION_ID`. Both are [granted to anyone by default](../spp-plugin.md#installation--permissions), so once the state machine says advanceable, anyone can move the proposal forward; the body results, not the caller, determine whether it may advance. Execution runs the proposal's [actions](../../core/execution.md) against the snapshotted target, honoring the [failsafe action map](../../core/execution.md#failsafe-actions) set at creation (individual actions may be allowed to fail without reverting the batch).

When a stage begins, SPP creates a sub-proposal on each of its automatic bodies through a guarded low-level call (with a gas-griefing check). If a body's `createProposal` reverts, or the body rejects SPP, that body contributes nothing to the tally (a `SubProposalNotCreated` event) instead of blocking the other bodies or the whole pipeline. A misconfigured body therefore doesn't cause sub-proposal creation for the rest of the stage to fail.

## Cancelling and editing

Two optional interventions, each gated *both* by a per-stage flag and a permission:

- **`cancel`** (needs `CANCEL_PERMISSION_ID`, and the current stage's `cancelable`) ends the proposal permanently.
- **`edit`** (needs `EDIT_PERMISSION_ID`, and the current stage's `editable`) replaces the proposal's actions before it advances. If the current stage has bodies, editing is only allowed once the stage is *advanceable* (you can't rewrite what bodies are actively voting on); a bodyless [timelock stage](./stages-and-bodies.md#the-three-stage-shapes) can be edited while merely active.

Neither is possible on a terminal proposal (executed, canceled, expired). **Install grants neither permission by default**: a DAO must grant `CANCEL_PERMISSION_ID`/`EDIT_PERMISSION_ID` explicitly for these to work at all, on top of setting the per-stage flags.

## Keep in mind

- **Vetoes trump approvals.** Meeting the veto threshold blocks a stage no matter how many approvals it has. A lone `vetoThreshold = 1` body is an absolute veto.
- **Expired is a dead end.** Miss `maxAdvance` and the proposal is permanently stuck; the only way forward is a fresh proposal. Advance/execute passed proposals in time.
- **`voteDuration` can override `minAdvance`.** On a veto stage the effective floor is `max(minAdvance, voteDuration)` (see [stages](./stages-and-bodies.md#voteduration-the-field-that-does-two-jobs)).
- **Reports are overwritable, not final**, until the proposal advances past the stage.
- **Cancel/edit need explicit permission grants** *and* the per-stage flag, both, or they silently can't be used.

## See also

- [Stages & bodies](./stages-and-bodies.md) — the thresholds and timings this machine runs on.
- [Composing bodies](./composing-bodies.md) — the `hasSucceeded` contract the pull-tally depends on.
- [SPP overview](../spp-plugin.md).
