# Plugins

Plugins add decision-making, allocation, and distribution capabilities to a DAO through the [plugin framework](../framework/index.md). The governance plugins below use the shared [proposal](../common/proposal.md) lifecycle. VE Governance records gauge allocations, while Capital Distributor executes eligible claims against the DAO treasury.

**Exact signatures for the proposal-governance plugins:** the generated ABI references include their public functions, events, errors and constants with NatSpec: [token voting](../abi/token-voting-plugin/index.md), [multisig](../abi/multisig-plugin/index.md), [admin](../abi/admin-plugin/index.md), [SPP](../abi/staged-proposal-processor-plugin/index.md), [lock to vote](../abi/lock-to-vote-plugin/index.md).

## Token Voting Plugin

Token-weighted "one token, one vote" governance:

- [Token Voting Plugin](./token-voting-plugin.md) — the plugin overview, proposal lifecycle, and permissions. **Start here.**
- [Voting power](./token-voting-plugin/voting-power.md) — the token, the snapshot, delegation, and who may propose.
- [Governance tokens](./token-voting-plugin/governance-tokens.md) — mint a new token, reuse an `IVotes` token, or wrap an existing ERC-20.

**The shared voting model** (the Token Voting Plugin builds on it; other voting plugins can reuse it):

- [Majority voting](./majority-voting.md) — the support / participation / approval thresholds and pass-fail math.
- [Voting modes](./voting-modes.md) — Standard vs Early Execution vs Vote Replacement.

## Multisig Plugin

Approval by a fixed member set: a proposal passes once `minApprovals` members approve:

- [Multisig Plugin](./multisig-plugin.md) — the approval model, proposal lifecycle, and permissions. **Start here.**
- [Membership & eligibility](./multisig-plugin/membership.md) — managing members, the `minApprovals` invariant, and the two-speed eligibility model.

## Admin Plugin

Direct execution by a single trusted address, no vote, no window, for bootstrapping and fully-controlled DAOs:

- [Admin Plugin](./admin-plugin.md) — the zero-width proposal lifecycle, the centralization trade-off, and migrating away.

## Staged Proposal Processor (SPP)

Meta-governance: orchestrate other plugins into a multi-stage pipeline (e.g. multisig → token vote → admin):

- [Staged Proposal Processor (SPP)](./spp-plugin.md) — the model, why to compose plugins, the rule condition, and setup. **Start here.**
- [Stages & bodies](./spp-plugin/stages-and-bodies.md) — the data model, and the approval / optimistic / timelock stage shapes.
- [Lifecycle & state machine](./spp-plugin/lifecycle.md) — how a proposal advances, the push/pull tally, cancel/edit.
- [Composing bodies](./spp-plugin/composing-bodies.md) — making a plugin (or an external Safe) usable as a stage body.

## Lock to Vote Plugin

Token-weighted voting where power comes from tokens you *lock* into escrow (custody), not from a balance snapshot:

- [Lock to Vote Plugin](./lock-to-vote-plugin.md) — lock-vs-snapshot, the voting model, and permissions. **Start here.**
- [The LockManager](./lock-to-vote-plugin/lock-manager.md) — the vault and its unlock rules.

## VE Governance

Lock tokens, delegate voting power, and assign relative weights to registered gauges:

- [VE Governance](./ve-governance.md) introduces the system and its role in resource allocation.
- [Positions](./ve-governance/positions.md), [voting power](./ve-governance/voting-power.md), and [delegation](./ve-governance/delegation.md) explain how holders obtain and exercise votes.
- [Gauge results](./ve-governance/gauge-voting.md) covers the voting window, accounting modes, and reward snapshots.
- [Withdrawals](./ve-governance/withdrawals.md) covers tickets, waiting periods, and fees.
- [Setup and administration](./ve-governance/setup.md) identifies the v1.4 component set and permissions.

## Capital Distributor

Make calculated token entitlements claimable from a DAO treasury:

- [Capital Distributor](./capital-distributor.md) introduces campaigns and the payout flow.
- [Campaigns and claims](./capital-distributor/campaigns.md) covers timing, cumulative amounts, fees, and redirection.
- [Merkle allocations](./capital-distributor/merkle-allocations.md) specifies proof encoding and root updates.
- [Payout actions](./capital-distributor/payouts.md) covers direct transfers, vault deposits, funding, and execution authorization.
- [Setup and administration](./capital-distributor/setup.md) explains installation permissions and the registries.

## Where to start

New to the framework? Read [what a plugin is](../framework/plugins.md) and [how installation works](../framework/plugin-setup-processor.md) first, then any plugin here.
