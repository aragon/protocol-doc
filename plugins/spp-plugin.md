---
type: concept
title: Staged Proposal Processor (SPP)
tags: [governance]
source: spp/src/StagedProposalProcessor.sol, spp/src/StagedProposalProcessorSetup.sol, spp/src/utils/SPPRuleCondition.sol, spp/src/libraries/Permissions.sol, spp/src/libraries/Errors.sol, spp/src/utils/PluginSettings.sol
---

# Staged Proposal Processor (SPP)

The Staged Proposal Processor is **meta-governance**: it decides nothing on its own. Instead it orchestrates *other* governance plugins into a multi-step pipeline. A proposal walks an ordered list of **stages**; at each stage a committee of already-existing plugins (or plain addresses) weighs in, and SPP just tallies whether enough of them said yes (or too many said no) within a time window before letting the proposal move to the next stage, and finally executing it.

The mental model to hold: **a proposal is a token that walks through an ordered list of stages; at each stage, a committee of existing plugins votes on whether to let it through.**

## Why it exists

Real organizations rarely govern with a single rule. They want things like *"a security council multisig pre-approves, then token holders vote, then execution happens automatically."* Rather than build a new monolithic voting contract for every such flow, SPP lets you **compose the plugins you already have**, e.g. [Multisig](/plugins/multisig-plugin.md) → [Token Voting](/plugins/token-voting-plugin.md) → [Admin](/plugins/admin-plugin.md), into exactly that pipeline, writing no new governance logic. SPP is the glue; each stage delegates the real decision to a **body**.

Because a body is just an address, SPP spans the full spectrum from fully automated on-chain plugins to *"a human signs a Safe transaction."* That automatic-vs-manual split is the plugin's central design fork, see [composing bodies](/plugins/spp-plugin/composing-bodies.md).

## The pieces

- A **[stage](/plugins/spp-plugin/stages-and-bodies.md)** is one step: a set of bodies, thresholds, and a timing window.
- A **[body](/plugins/spp-plugin/stages-and-bodies.md#bodies)** is a plugin or address that renders a verdict for a stage, either an **approval** or a **veto**.
- A proposal moves through the stages according to a **[state machine](/plugins/spp-plugin/lifecycle.md)**: it becomes *advanceable* once a stage's thresholds are met inside its window, and executes when it clears the last stage.

This folder covers each in turn:

- [Stages & bodies](/plugins/spp-plugin/stages-and-bodies.md) — the data model: how a stage and its bodies are configured, and the three stage shapes (approval, optimistic, timelock).
- [Lifecycle & state machine](/plugins/spp-plugin/lifecycle.md) — how a proposal advances: the states, how bodies' results are tallied, and executing. **The gotchas live here.**
- [Composing bodies](/plugins/spp-plugin/composing-bodies.md) — the integration contract for making a plugin usable as an SPP body (and which plugins already are).

It's a [`PluginUUPSUpgradeable`](/framework/plugin-types.md) plugin reusing the shared [proposal](/common/proposal.md) lifecycle. Notably, **SPP both implements and consumes [`IProposal`](/common/proposal.md)**, which is what lets an SPP instance itself be a body of another SPP (nested pipelines).

## Who can create proposals: the rule condition

Creating a proposal is permission-gated (`CREATE_PROPOSAL_PERMISSION_ID`), and most organizations don't want it open to the world, they want only certain people able to put proposals into the pipeline (a specific committee, the members of a particular plugin or Safe, and so on). SPP expresses that restriction through a dedicated [permission condition](/common/permission-conditions.md), the **`SPPRuleCondition`** (deployed per install as SPP's one helper), built on the [RuledCondition](/common/ruled-condition.md) rule engine so the restriction is *configurable* rather than baked in:

- **Open by default.** With no rules configured the condition returns true, so a freshly installed SPP is usable right away, anyone can propose. This is deliberate: defaulting to "nobody" would leave a just-installed SPP unable to create any proposal at all. Restricting is an explicit opt-in, so remember to configure the rules if your governance should limit who proposes (see [Keep in mind](#keep-in-mind)).
- **Composable.** Because it's a rule tree, "who may propose" can defer to other conditions and combine them with boolean logic, restrict creation to the members of an existing plugin, or to any of several. Eligibility is whatever the DAO configures, not a rule fixed inside SPP.
- **Governed.** Rules change via `updateRules` (gated by `UPDATE_RULES_PERMISSION_ID`, held by the DAO), so who may propose is itself a governance decision.

> A guard-rail worth knowing: when you compose a rule that defers to another condition, `SPPRuleCondition` test-calls that condition with empty `data` and rejects it if it reverts. SPP can't predict what `data` a nested condition will need for a live `createProposal`, so only **data-independent** conditions compose safely; this check stops a DAO from wiring in a condition that would silently brick proposal creation for everyone.

## Installation & permissions

`StagedProposalProcessorSetup` deploys the SPP proxy and an `SPPRuleCondition` (its one helper), and wires these permissions:

| Permission | On (where) | Granted to (who) | Condition | Gates |
|---|---|---|---|---|
| `CREATE_PROPOSAL_PERMISSION_ID` | SPP | any address | `SPPRuleCondition` | `createProposal` |
| `ADVANCE_PERMISSION_ID` | SPP | any address | none | `advanceProposal` (and try-advance) |
| `EXECUTE_PROPOSAL_PERMISSION_ID` | SPP | any address | none | `execute` (clearing the last stage) |
| `UPDATE_STAGES_PERMISSION_ID` | SPP | DAO | none | `updateStages` |
| `SET_TARGET_CONFIG_PERMISSION_ID` | SPP | DAO | none | `setTargetConfig` |
| `SET_METADATA_PERMISSION_ID` | SPP | DAO | none | `setMetadata` |
| `SET_TRUSTED_FORWARDER_PERMISSION_ID` | SPP | DAO | none | `setTrustedForwarder` |
| `UPDATE_RULES_PERMISSION_ID` | SPPRuleCondition | DAO | none | `updateRules` (who-can-propose rules) |
| `EXECUTE_PERMISSION_ID` | DAO | SPP | none | SPP calling `dao.execute` |

Two things stand out, and both are intentional:

- **Advancing and executing are open to anyone by default.** Once the [state machine](/plugins/spp-plugin/lifecycle.md) already says a proposal is advanceable, letting any address push it forward is a permissionless "flush", the real gate is the body results, not who calls. Only proposal *creation* is condition-gated by default.
- **`cancel` and `edit` are *not* granted to anyone by install.** Their permissions (`CANCEL_PERMISSION_ID` / `EDIT_PERMISSION_ID`) exist and each stage has `cancelable`/`editable` flags, but a DAO must explicitly grant the permissions before cancel/edit can be used at all. Don't assume install wired them.

The **trusted forwarder** (for [ERC-2771 meta-transactions](/core/dao.md)) is deliberately installed as `address(0)`, i.e. off: a forwarder can spoof the caller's identity, so allowing an installer to set one would be exploitable. Only the DAO can enable one later (`SET_TRUSTED_FORWARDER_PERMISSION_ID`), after vetting it.

> SPP defines its *own* `EXECUTE_PROPOSAL_PERMISSION_ID` rather than reusing the DAO's `EXECUTE_PERMISSION_ID`, precisely so it can be granted to `ANY_ADDR`: the core [permission system](/core/permissions.md) refuses to wildcard-grant `EXECUTE_PERMISSION_ID`, and SPP wants permissionless execution once consensus is reached. A neat example of working *with* that safety rule rather than around it.

## Keep in mind

- **Remember to configure who can propose.** Out of the box (no rules set) any address can create proposals, deliberately, so the plugin works immediately rather than being unusable. If your governance should restrict proposing, configure the [rule condition](#who-can-create-proposals-the-rule-condition) at install (or right after); don't assume it's members-only by default.
- **Advancing and executing are permissionless by default, too.** Once a proposal's bodies have decided, anyone can push it forward; the body results are the gate, not the caller. Restrict `ADVANCE_PERMISSION_ID` / `EXECUTE_PROPOSAL_PERMISSION_ID` explicitly if you need to.
- **Cancel and edit don't work until granted.** Their permissions aren't wired by install; a stage's `cancelable`/`editable` flag alone isn't enough (see [permissions](#installation--permissions)).

## See also

- [Stages & bodies](/plugins/spp-plugin/stages-and-bodies.md), [Lifecycle & state machine](/plugins/spp-plugin/lifecycle.md), [Composing bodies](/plugins/spp-plugin/composing-bodies.md).
- [Multisig](/plugins/multisig-plugin.md), [Token Voting](/plugins/token-voting-plugin.md), [Admin](/plugins/admin-plugin.md) — the plugins you compose as bodies.
- [RuledCondition](/common/ruled-condition.md) — the engine behind who-can-propose gating.
