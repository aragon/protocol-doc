---
type: concept
title: SPP stages & bodies
tags: [governance]
source: staged-proposal-processor-plugin/src/StagedProposalProcessor.sol
---

# SPP stages & bodies

An [SPP](../spp-plugin.md) pipeline is entirely defined by its list of **stages**, and each stage by its list of **bodies**. Get these two structures and you understand what SPP can express.

## A stage

A stage is one step of the pipeline: who weighs in, how many of them it takes, and the timing.

```solidity
struct Stage {
    Body[]  bodies;            // the delegates deciding this stage
    uint64  maxAdvance;        // deadline: after this, the proposal expires
    uint64  minAdvance;        // earliest the stage may become advanceable
    uint64  voteDuration;      // sub-proposal voting length (+ veto window, see below)
    uint16  approvalThreshold; // how many bodies must approve to advance
    uint16  vetoThreshold;     // how many vetoes permanently block advancing
    bool    cancelable;        // may the proposal be cancelled while in this stage?
    bool    editable;          // may its actions be edited while in this stage?
}
```

The thresholds and timings are validated when stages are set (`minAdvance < maxAdvance`, `voteDuration < maxAdvance`, each threshold `<=` the number of bodies, and no address may appear twice in one stage's bodies).

### Thresholds count bodies, not votes

`approvalThreshold` and `vetoThreshold` are **counts of bodies**, not weighted votes. Each body contributes exactly *one* unit to the stage's tally once it reports, regardless of how that body reached its own decision. A 9-signer multisig and a single EOA each count as **1**. Whatever weighting, quorum, or token math happens *inside* a body is invisible to SPP; SPP only asks "did this body approve / veto?" So "3-of-5 bodies must approve" means five bodies, three approvals, not five tokens or five voters.

### Vetoes always win

If a stage has veto bodies, reaching `vetoThreshold` **blocks the proposal outright**, no number of approvals overrides it. A veto is a hard veto, not a counterweight in a tally. A single veto body with `vetoThreshold = 1` can permanently stop a stage.

### `voteDuration`: the field that does two jobs

`voteDuration` is the subtle one:

1. It sets the voting length of the sub-proposals SPP creates on [automatic bodies](#bodies) (their `endDate = start + voteDuration`).
2. **Only if the stage has veto bodies (`vetoThreshold > 0`)**, it *also* becomes a floor on advancing: the proposal can't become advanceable until `voteDuration` has elapsed, guaranteeing vetoers a window to react even if approvals arrive instantly. This is what makes an [optimistic stage](#the-three-stage-shapes) safe.

> **Note:** when a stage has vetoes, the *effective* earliest-advance time is `max(minAdvance, voteDuration)`. It's easy to tune `minAdvance` expecting it to be the floor and be surprised advancement waits for `voteDuration` instead. For a veto stage, set `voteDuration` to the veto window you actually want.

## Bodies

A **body** is a delegate that renders a verdict for a stage:

```solidity
struct Body {
    address    addr;        // the plugin/contract/EOA that decides
    bool       isManual;    // does SPP create a sub-proposal for it, or must it report itself?
    bool       tryAdvance;  // should the body's report also try to advance the proposal?
    ResultType resultType;  // Approval or Veto (a body is configured as one; the enum's 0-value, None = "not yet reported", is the sentinel the tally keys on)
}
```

- **Automatic body** (`isManual = false`): when the proposal enters the stage, SPP creates a sub-proposal on `addr` automatically. This requires the body to support [`IProposal`](../../common/proposal.md) (checked via ERC-165). The details of writing such a body are in [composing bodies](./composing-bodies.md).
- **Manual body** (`isManual = true`): SPP creates nothing; some external process (a Safe transaction, a Governor, a person) must call `reportProposalResult` itself. Any address qualifies, no interface required, the escape hatch for bodies that can't integrate.

A body's `resultType` is set at configuration. For an **automatic** body it's binding, the auto-generated callback reports exactly that type, so the body counts as the approval or veto it was registered as. For a **manual** body it's only the *expected* type; what actually counts is whatever type the reporter passes to `reportProposalResult` (a manual body registered as Approval that reports a Veto counts as a veto). Either way, the same address can be an approval body in one stage and a veto body in another, and approval and veto bodies can be **mixed in one stage**, e.g. "token holders approve, but a security council can veto", in a single step.

## The three stage shapes

One `Stage` struct expresses three distinct governance patterns:

- **Normal stage** — bodies are `Approval`, `vetoThreshold = 0`. A plain "N of M must approve" gate.
- **Optimistic stage** — bodies are `Veto`, `approvalThreshold = 0`, `vetoThreshold > 0`. The proposal passes *automatically* unless enough bodies veto it within the [`voteDuration`](#voteduration-the-field-that-does-two-jobs) window. Good for "let it through unless someone objects."
- **Timelock stage** — *no bodies at all*. With nothing to decide, the stage becomes advanceable purely once its `minAdvance` elapses: a pure delay. Chain one before execution and you have a governance timelock.

Per stage you also choose whether it's **cancelable** and/or **editable** (a stage where actions can still be revised, or the whole proposal called off, before it advances). Those capabilities also need their [permissions granted](../spp-plugin.md#installation--permissions), which install does *not* do by default.

## Rules don't move under an in-flight proposal

Each proposal records the **configuration generation** it was created under (`stageConfigIndex`), and follows that generation for its whole life. When a DAO calls `updateStages` to evolve its governance, in-flight proposals keep the stages they started with, only new proposals use the new configuration. (Past generations stay readable via `getStages(index)`.) The same snapshot applies to the [execution target](../../framework/plugins.md#how-a-plugin-makes-the-dao-act), frozen at creation. Rules never shift beneath a proposal that's already moving.

## Keep in mind

- **`voteDuration` can override `minAdvance`.** On a veto stage the effective earliest-advance time is `max(minAdvance, voteDuration)`; tune `voteDuration` to the veto window you want, not just `minAdvance`.
- **Thresholds count bodies, not votes.** Each body contributes one unit once it reports; a 9-signer multisig and a lone EOA each count as 1.
- **A manual body counts by what it *reports*, not what it was registered as**, and no address may appear twice in one stage.

## See also

- [Lifecycle & state machine](./lifecycle.md) — how these thresholds and timings drive advancement.
- [Composing bodies](./composing-bodies.md) — making a plugin work as an automatic or manual body.
- [SPP overview](../spp-plugin.md).
