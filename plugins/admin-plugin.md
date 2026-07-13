---
type: concept
title: Admin Plugin
tags: [governance]
source: admin-plugin/packages/contracts/src/Admin.sol, admin-plugin/packages/contracts/src/AdminSetup.sol
---

# Admin Plugin

The Admin Plugin gives **one address** the power to make the DAO execute any actions **immediately, with no vote and no waiting**. It's the degenerate case of governance: no proposals to gather support, no members to count, no window, just "the admin says do this, and the DAO does it, now."

Use it when a DAO is, deliberately, under a single trusted controller: a solo founder, a migration script, or a [Multisig](/plugins/multisig-plugin.md)/Safe acting as that one address. A common pattern is **bootstrapping**: run a DAO under Admin while it's being set up, then install real governance and remove Admin (which the admin can do itself, see [migrating away](#migrating-away)).

## Why a plugin, not just a permission?

You could skip Admin entirely: grant a trusted address [`EXECUTE_PERMISSION_ID`](/core/execution.md) on the DAO directly, and it could call `dao.execute(...)` itself. So why does this plugin exist? Two practical reasons:

1. **Easy, disposable setup.** Admin is a first-class [plugin](/framework/plugins.md), so it plugs into the standard install/uninstall lifecycle: install it to run a DAO under one controller while you bootstrap it, then [swap in real governance and remove it](#migrating-away), rather than hand-wiring a raw permission grant and having to remember to unwind it later. Setting up (and tearing down) a DAO is a first-class operation, not a manual permission dance.
2. **Every action becomes an auditable proposal.** Because actions flow through `createProposal`/`executeProposal`, each one emits the standard `ProposalCreated` / `ProposalExecuted` events and lands in the DAO's proposal history next to real governance, reviewable by the same UIs and indexers, after the fact. A bare `dao.execute` from an EOA is just an opaque transaction with no proposal-shaped record to audit later. **Admin gives an unrestricted operator a paper trail.**

In short, Admin is *direct execution wrapped in the accountability and lifecycle of a plugin*, which is why it's worth having even though a raw permission grant would technically do the same execution.

## The zero-width proposal lifecycle

Every OSx governance plugin implements the shared [`IProposal`](/common/proposal.md) interface, which was designed for plugins that *store* proposals and decide over time. Admin implements it too, but collapses the whole lifecycle into a single atomic call, and understanding that is the key to the plugin:

**`createProposal` and `executeProposal` are the same call.** Creating a proposal *is* executing it; nothing is ever written to storage. In one transaction, `executeProposal`:

1. computes a `proposalId` (the same [deterministic hash](/common/proposal.md) other plugins use, here only for event traceability, never as a storage key),
2. runs the [actions](/core/execution.md) immediately against the live [execution target](/framework/plugins.md#how-a-plugin-makes-the-dao-act),
3. emits `ProposalCreated` and then `ProposalExecuted`, back-to-back.

Those two events exist purely so **indexers and tooling built for the normal proposal lifecycle keep working**: a subgraph watching for `ProposalCreated → ProposalExecuted` sees a proposal that's created and instantly passes, with no Admin-specific code path. The `startDate`/`endDate` parameters of the standard `createProposal` signature are simply **ignored**, there is no time window at all.

Because nothing persists, there's no proposal storage, no existence check, and no "already exists" guard: **the same actions can be executed through Admin any number of times** (contrast [Multisig](/plugins/multisig-plugin.md), where a proposal id is a storage key and identical proposals collide).

The two entry points differ only in how they carry `allowFailureMap` (the [failsafe action map](/core/execution.md#failsafe-actions)): `executeProposal` takes it as a typed `uint256` argument, while the generic `createProposal` expects it abi-encoded in its trailing `data` (as `customProposalParamsABI` advertises).

> **The trap: `canExecute` lies, and `execute(id)` always reverts.** For `IProposal` compatibility Admin has to expose `canExecute`, `hasSucceeded`, and `execute(uint256)`. The first two ignore their argument and always return `true`; **`execute(uint256)` always reverts with `FunctionNotSupported`** (it's dead code, there kept only so the contract compiles against `IProposal`). Generic tooling that does "if `canExecute` then `execute`" will get a revert on Admin. The only real entry points are `createProposal` / `executeProposal`, which execute atomically, there is never a separate `execute()` step to call.

## Who is "the admin"

There is no dedicated admin role. **Being the admin is defined as holding `EXECUTE_PROPOSAL_PERMISSION_ID`** on the plugin, `isMember(addr)` is literally "does `addr` hold that permission?". Two consequences:

- **Singularity is a convention, not an invariant.** The [setup](#installation) grants the permission to exactly one address, but nothing stops the DAO later granting it to more, turning Admin into an "any of N" controller with no code change.
- **Rotating the admin is just a permission change**, done through the DAO's [permission system](/core/permissions.md), there's no plugin-specific "transfer adminship" function.

## Installation

`AdminSetup` (a [plugin setup](/framework/plugin-setup.md)) deploys the plugin and wires three permissions:

| Permission | On (where) | Granted to (who) | Condition | Gates |
|---|---|---|---|---|
| `EXECUTE_PROPOSAL_PERMISSION_ID` | plugin | the admin address | none | `createProposal`, `executeProposal` |
| `EXECUTE_PERMISSION_ID` | DAO | plugin | none | the plugin calling `dao.execute` |
| `SET_TARGET_CONFIG_PERMISSION_ID` | plugin | DAO | none | `setTargetConfig` |

No conditions, no helper contracts, every grant is a direct 1:1 relationship (contrast [Multisig's `ListedCheckCondition`](/plugins/multisig-plugin/membership.md#who-can-create-vs-who-can-approve)). The admin address is passed in the install data (a zero address reverts).

**Admin is a [`PluginCloneable`](/framework/plugin-types.md), not UUPS.** It holds essentially no per-instance state and is typically short-lived, so a cheap [minimal-proxy clone](/common/proxies.md) fits better than the heavier UUPS machinery, at the cost that an installed instance can't be upgraded in place (you'd install a new build instead). A separate zkSync variant deploys the full contract per install rather than cloning, purely a deployment-mechanics difference for that chain, the governance behavior is identical.

## Migrating away

Because the admin can make the DAO execute *any* action, and a DAO holds [`ROOT`](/core/permissions.md) over itself, the admin can hand power over without any special function: submit an action batch that installs a real governance plugin (grant it its permissions) and then removes Admin. That's a typical end state for a bootstrapped DAO: Admin gets you running, then steps aside.

> **Uninstalling Admin leaves one dangling grant.** `prepareUninstallation` revokes the two DAO-side grants (`EXECUTE_PERMISSION_ID` and `SET_TARGET_CONFIG_PERMISSION_ID`) but **not** the admin's `EXECUTE_PROPOSAL_PERMISSION_ID` (the setup can't reliably enumerate every address it was granted to). It's inert, without `EXECUTE_PERMISSION_ID` the orphaned plugin can no longer reach the DAO, but it's leftover on-chain state worth knowing about when auditing permissions after an Admin removal.

## Keep in mind

- **Never call `execute(id)` on Admin.** It always reverts; execution happens inside `createProposal`/`executeProposal`. `canExecute` returning `true` is meaningless here.
- **Single point of control, by design.** No timelock, no quorum, no veto: whoever holds `EXECUTE_PROPOSAL_PERMISSION_ID` can drain or reconfigure the DAO in one transaction. Admin adds no safety net of its own, its safety is entirely the safety of that one key or contract.
- **Nothing enforces one admin.** "Single admin" is how it's installed, not a rule the code guarantees.

## See also

- [Multisig Plugin](/plugins/multisig-plugin.md) and [Token Voting Plugin](/plugins/token-voting-plugin.md) — governance plugins that *do* store proposals and decide over time; the contrast is the fastest way to understand what Admin strips away.
- [Proposals](/common/proposal.md) — the `IProposal` interface Admin degenerates.
- [The permission system](/core/permissions.md) — how "the admin" is just a grant, and how the admin can grant its own successor.
