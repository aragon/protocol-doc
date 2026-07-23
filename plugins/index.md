# Plugins

The **plugins**: ready-made functionality a DAO installs. They are **governance** plugins, they make decisions (propose → vote → execute). Each is its own repo and package built on the [common building blocks](../common/index.md) and installed through the [plugin framework](../framework/index.md), so they share the same [proposal](../common/proposal.md) shape, [membership](../common/membership.md) model, and install lifecycle. Read one closely and the rest read faster.

## Token Voting Plugin

Token-weighted "one token, one vote" governance:

- [Token Voting Plugin](./token-voting-plugin.md) — the plugin overview, proposal lifecycle, and permissions. **Start here.**
- [Voting power](./token-voting-plugin/voting-power.md) — the token, the snapshot, delegation, and who may propose.
- [Governance tokens](./token-voting-plugin/governance-tokens.md) — mint a new token, reuse an `IVotes` token, or wrap an existing ERC-20.

**The shared voting model** (the Token Voting Plugin builds on it; other voting plugins can reuse it):

- [Majority voting](./majority-voting.md) — the support / participation / approval thresholds and pass-fail math.
- [Voting modes](./voting-modes.md) — Standard vs Early Execution vs Vote Replacement.

## Multisig Plugin

Approval by a fixed member set, a proposal passes once `minApprovals` members approve:

- [Multisig Plugin](./multisig-plugin.md) — the approval model, proposal lifecycle, and permissions. **Start here.**
- [Membership & eligibility](./multisig-plugin/membership.md) — managing members, the `minApprovals` invariant, and the two-speed eligibility model.

## Admin Plugin

Direct execution by a single trusted address, no vote, no window, for bootstrapping and fully-controlled DAOs:

- [Admin Plugin](./admin-plugin.md) — the zero-width proposal lifecycle, the centralization trade-off, and migrating away.

## Staged Proposal Processor (SPP)

Meta-governance: orchestrate other plugins into a multi-stage pipeline (e.g. multisig → token vote → admin):

- [Staged Proposal Processor (SPP)](./spp-plugin.md) — the model, the composition pitch, the rule condition, and setup. **Start here.**
- [Stages & bodies](./spp-plugin/stages-and-bodies.md) — the data model, and the approval / optimistic / timelock stage shapes.
- [Lifecycle & state machine](./spp-plugin/lifecycle.md) — how a proposal advances, the push/pull tally, cancel/edit.
- [Composing bodies](./spp-plugin/composing-bodies.md) — making a plugin (or an external Safe) usable as a stage body.

## Lock to Vote Plugin

Token-weighted voting where power comes from tokens you *lock* into escrow (custody), not from a balance snapshot:

- [Lock to Vote Plugin](./lock-to-vote-plugin.md) — lock-vs-snapshot, the voting model, and permissions. **Start here.**
- [The LockManager](./lock-to-vote-plugin/lock-manager.md) — the vault, and the all-important unlock rules.

## Where to start

New to the framework? Read [what a plugin is](../framework/plugins.md) and [how installation works](../framework/plugin-setup-processor.md) first, then any plugin here.
