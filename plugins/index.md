# Plugins

The **plugins**: ready-made functionality a DAO installs. Most are **governance** plugins, they make decisions (propose → vote → execute). The [Capital Router](/plugins/capital-router.md) is the exception: an **automation** family where governance installs a *policy* once and capital then flows without a vote each time. Either way, each is its own repo and package built on the [common building blocks](/common/index.md) and installed through the [plugin framework](/framework/index.md), so they share the same [proposal](/common/proposal.md) shape, [membership](/common/membership.md) model, and install lifecycle. Read one closely and the rest read faster.

## Token Voting Plugin

Token-weighted "one token, one vote" governance:

- [Token Voting Plugin](/plugins/token-voting-plugin.md) — the plugin overview, proposal lifecycle, and permissions. **Start here.**
- [Voting power](/plugins/token-voting-plugin/voting-power.md) — the token, the snapshot, delegation, and who may propose.
- [Governance tokens](/plugins/token-voting-plugin/governance-tokens.md) — mint a new token, reuse an `IVotes` token, or wrap an existing ERC-20.

**The shared voting model** (the Token Voting Plugin builds on it; other voting plugins can reuse it):

- [Majority voting](/plugins/majority-voting.md) — the support / participation / approval thresholds and pass-fail math.
- [Voting modes](/plugins/voting-modes.md) — Standard vs Early Execution vs Vote Replacement.

## Multisig Plugin

Approval by a fixed member set, a proposal passes once `minApprovals` members approve:

- [Multisig Plugin](/plugins/multisig-plugin.md) — the approval model, proposal lifecycle, and permissions. **Start here.**
- [Membership & eligibility](/plugins/multisig-plugin/membership.md) — managing members, the `minApprovals` invariant, and the two-speed eligibility model.

## Admin Plugin

Direct execution by a single trusted address, no vote, no window, for bootstrapping and fully-controlled DAOs:

- [Admin Plugin](/plugins/admin-plugin.md) — the zero-width proposal lifecycle, the centralization trade-off, and migrating away.

## Staged Proposal Processor (SPP)

Meta-governance: orchestrate other plugins into a multi-stage pipeline (e.g. multisig → token vote → admin):

- [Staged Proposal Processor (SPP)](/plugins/spp-plugin.md) — the model, the composition pitch, the rule condition, and setup. **Start here.**
- [Stages & bodies](/plugins/spp-plugin/stages-and-bodies.md) — the data model, and the approval / optimistic / timelock stage shapes.
- [Lifecycle & state machine](/plugins/spp-plugin/lifecycle.md) — how a proposal advances, the push/pull tally, cancel/edit.
- [Composing bodies](/plugins/spp-plugin/composing-bodies.md) — making a plugin (or an external Safe) usable as a stage body.

## Lock to Vote Plugin

Token-weighted voting where power comes from tokens you *lock* into escrow (custody), not from a balance snapshot:

- [Lock to Vote Plugin](/plugins/lock-to-vote-plugin.md) — lock-vs-snapshot, the voting model, and permissions. **Start here.**
- [The LockManager](/plugins/lock-to-vote-plugin/lock-manager.md) — the vault, and the all-important unlock rules.

## Capital Router

The one **automation** family, not governance: a DAO installs a capital-flow *policy* once, then funds move on their own (payroll, buybacks, rewards, DCA) with no per-action vote. A standard library of composable budget / splitter / strategy building blocks:

- [Capital Router](/plugins/capital-router.md) — policy-not-governance, and the Strategy = Budget + Splitter model. **Start here.**
- [Dispatch vs. request](/plugins/capital-router/dispatch-vs-request.md) — push to everyone vs. pull-your-own-slice, the central axis.
- [The plugins](/plugins/capital-router/plugins.md) — Dispatcher, Requester, DispatchHub, plus the failsafe map and permissions.
- [Budgets](/plugins/capital-router/budgets.md), [Splitters](/plugins/capital-router/splitters.md), [Strategies](/plugins/capital-router/strategies.md), [Oracles](/plugins/capital-router/oracles.md) — the composable pieces a flow is assembled from.
- [What you can build](/plugins/capital-router/use-cases.md) — payroll, vesting, DCA, buybacks, rewards, and how each maps to the blocks.

## Where to start

New to the framework? Read [what a plugin is](/framework/plugins.md) and [how installation works](/framework/plugin-setup-processor.md) first, then any plugin here.
