---
type: concept
title: Staged Proposal Processor (SPP)
tags: [governance]
source: staged-proposal-processor-plugin/src/StagedProposalProcessor.sol, staged-proposal-processor-plugin/src/StagedProposalProcessorSetup.sol, staged-proposal-processor-plugin/src/utils/SPPRuleCondition.sol, staged-proposal-processor-plugin/src/libraries/Permissions.sol, staged-proposal-processor-plugin/src/libraries/Errors.sol, staged-proposal-processor-plugin/src/utils/PluginSettings.sol
---

# Staged Proposal Processor (SPP)

The Staged Proposal Processor is **meta-governance**: it decides nothing on its own. It coordinates *other* governance plugins across an ordered list of **stages**. At each stage a committee of existing plugins (or plain addresses) weighs in. SPP tallies whether enough of them said yes (or too many said no) within a time window before letting the proposal move to the next stage, and finally executing it.

**At each stage, a committee of existing plugins votes on whether the proposal may advance.**

## Why it exists

Real organizations rarely govern with a single rule. They want things like *"a security council multisig pre-approves, then token holders vote, then execution happens automatically."* Rather than build a new monolithic voting contract for every such flow, SPP lets you **compose the plugins you already have**, e.g. [Multisig](./multisig-plugin.md) → [Token Voting](./token-voting-plugin.md) → [Admin](./admin-plugin.md), into exactly that pipeline, writing no new governance logic. SPP is the glue; each stage delegates the real decision to a **body**.

Because a body is an address, SPP supports both fully automated onchain plugins and *"a human signs a Safe transaction."* How a body reports its decision determines whether it is automatic or manual; see [composing bodies](./spp-plugin/composing-bodies.md).

## The pieces

- A **[stage](./spp-plugin/stages-and-bodies.md)** is one step: a set of bodies, thresholds, and a timing window.
- A **[body](./spp-plugin/stages-and-bodies.md#bodies)** is a plugin or address that renders a verdict for a stage, either an **approval** or a **veto**.
- A proposal moves through the stages according to a **[state machine](./spp-plugin/lifecycle.md)**: it becomes *advanceable* once a stage's thresholds are met inside its window, and executes when it clears the last stage.

For configuration and integration details:

- [Stages & bodies](./spp-plugin/stages-and-bodies.md) — the data model: how a stage and its bodies are configured, and the three stage shapes (approval, optimistic, timelock).
- [Lifecycle & state machine](./spp-plugin/lifecycle.md) — how a proposal advances: the states, how bodies' results are tallied, and execution rules.
- [Composing bodies](./spp-plugin/composing-bodies.md) — the integration contract for making a plugin usable as an SPP body (and which plugins already are).

It's a [`PluginUUPSUpgradeable`](../framework/plugin-types.md) plugin reusing the shared [proposal](../common/proposal.md) lifecycle. Notably, **SPP both implements and consumes [`IProposal`](../common/proposal.md)**, which is what lets an SPP instance itself be a body of another SPP (nested pipelines).

## Who can create proposals: the rule condition

Creating a proposal is permission-gated (`CREATE_PROPOSAL_PERMISSION_ID`), and most organizations don't want it open to the world, they want only certain people able to put proposals into the pipeline (a specific committee, the members of a particular plugin or Safe, and so on). SPP expresses that restriction through a dedicated [permission condition](../common/permission-conditions.md), the **`SPPRuleCondition`** (deployed per install as SPP's one helper), built on the [RuledCondition](../common/ruled-condition.md) rule engine so the restriction is *configurable* rather than baked in:

- **Open by default.** With no rules configured the condition returns true, so a freshly installed SPP is usable right away, anyone can propose. This is deliberate: defaulting to "nobody" would leave a just-installed SPP unable to create any proposal at all. Restricting is an explicit opt-in, so remember to configure the rules if your governance should limit who proposes (see [Keep in mind](#keep-in-mind)).
- **Composable.** Because it's a rule tree, "who may propose" can defer to other conditions and combine them with boolean logic, restrict creation to the members of an existing plugin, or to any of several. Eligibility is whatever the DAO configures, not a rule fixed inside SPP.
- **Governed.** Rules change via `updateRules` (gated by `UPDATE_RULES_PERMISSION_ID`, held by the DAO), so who may propose is itself a governance decision.

> When you compose a rule that defers to another condition, `SPPRuleCondition` test-calls that condition with empty `data` and rejects it if it reverts. SPP can't predict what `data` a nested condition will need for a live `createProposal`, so only **data-independent** conditions compose safely. This check prevents a DAO from configuring a condition that would silently prevent everyone from creating proposals.

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

- **Advancing and executing are open to anyone by default.** Once the [state machine](./spp-plugin/lifecycle.md) says a proposal is advanceable, any address can move it forward. The body results determine whether it may advance, not who calls. Only proposal *creation* is condition-gated by default. The DAO can restrict who advances or executes by [replacing those public permission grants](/guides/manage-permissions.md).
- **`cancel` and `edit` are *not* granted to anyone by install.** Their permissions (`CANCEL_PERMISSION_ID` / `EDIT_PERMISSION_ID`) exist and each stage has `cancelable`/`editable` flags, but a DAO must explicitly grant the permissions before cancel/edit can be used at all. Don't assume install wired them.

The **trusted forwarder** (for [ERC-2771 meta-transactions](../core/dao.md)) is deliberately installed as `address(0)`, i.e. off: a forwarder can spoof the caller's identity, so allowing an installer to set one would be exploitable. Only the DAO can enable one later (`SET_TRUSTED_FORWARDER_PERMISSION_ID`), after vetting it.

> SPP defines its *own* `EXECUTE_PROPOSAL_PERMISSION_ID` rather than reusing the DAO's `EXECUTE_PERMISSION_ID`, so it can be granted to `ANY_ADDR`: the core [permission system](../core/permissions.md) refuses to wildcard-grant `EXECUTE_PERMISSION_ID`. This allows permissionless execution once consensus is reached while respecting that safety rule.

## Builds and updating

SPP is published in release 1 with builds 1, 2 and 3. Build 3 makes [sub-proposal creation all-or-nothing](./spp-plugin/lifecycle.md#advancing-and-executing), restricts each body to [reporting its configured result type](./spp-plugin/lifecycle.md#reporting-a-result), and hardens the stage tally against bodies that call back into SPP while their sub-proposal is being created. Its build metadata strongly recommends every existing installation to update. The installation parameters are the same in all three builds.

`StagedProposalProcessorSetup` (build 3) accepts two [update](../guides/update-a-plugin.md) paths, neither of which takes input (`SetupPayload.data` is ignored):

- **From build 1.** Deploys a fresh `SPPRuleCondition` seeded with the rules read from the current one (`getRules()` at prepare time) and returns it as the new helper. The permission diff moves `CREATE_PROPOSAL_PERMISSION_ID` on SPP (for any address) from the old condition to the new one, and `UPDATE_RULES_PERMISSION_ID` (held by the DAO) from the old condition contract to the new one. The old condition stays deployed, detached.
- **From build 2.** No helper or permission changes: the current condition is passed through as the helper.

Any other starting build reverts with `InvalidUpdatePath(fromBuild, 3)`. Both paths return empty `initData` (no reinitializer, no new storage), and both swap the proxy to the build 3 implementation, so the apply needs the PSP to hold `UPGRADE_PLUGIN_PERMISSION` on SPP for the call, as the [update guide](../guides/update-a-plugin.md#step-2-apply-the-update-governed-temporary-root-window) shows. Proposals already in flight keep their state and continue under build 3's rules once applied.

## Keep in mind

- **Remember to configure who can propose.** Out of the box (no rules set) any address can create proposals, deliberately, so the plugin works immediately rather than being unusable. If your governance should restrict proposing, configure the [rule condition](#who-can-create-proposals-the-rule-condition) at install (or right after); don't assume it's members-only by default.
- **Advancing and executing are permissionless by default, too.** Once a proposal's bodies have decided, anyone can push it forward; the body results are the gate, not the caller. Restrict `ADVANCE_PERMISSION_ID` / `EXECUTE_PROPOSAL_PERMISSION_ID` explicitly if you need to.
- **Cancel and edit don't work until granted.** Their permissions aren't wired by install; a stage's `cancelable`/`editable` flag alone isn't enough (see [permissions](#installation--permissions)).
- **Updating from build 1 snapshots the rules at prepare time.** Rules changed on the old condition between `prepareUpdate` and `applyUpdate` aren't carried over; prepare and apply in one go, or re-check the new condition's rules afterwards.

## See also

- [Stages & bodies](./spp-plugin/stages-and-bodies.md), [Lifecycle & state machine](./spp-plugin/lifecycle.md), [Composing bodies](./spp-plugin/composing-bodies.md).
- [Multisig](./multisig-plugin.md), [Token Voting](./token-voting-plugin.md), [Admin](./admin-plugin.md) — the plugins you compose as bodies.
- [RuledCondition](../common/ruled-condition.md) — the engine behind who-can-propose gating.
