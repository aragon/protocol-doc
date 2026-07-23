# Guides

Linear, task-oriented, **Foundry-based** walkthroughs that link into the [concept graph](../index.md) for depth. Read a guide top to bottom; follow its links when you want the underlying detail. (The one exception to "Foundry-based" is the narrative *Why OSx*, which has no code.)

Guides are written in the order below; each links the concepts it uses rather than re-explaining them.

**Before you start:** [Setup](./setup.md), the one-time Foundry project scaffold (start from the template, point at a deployed protocol) that every guide below assumes.

## Understand

- [Why OSx: the organization that can reinvent itself](./why-osx.md) — Why a lean core + swappable plugins + one permission layer lets an organization iterate, pivot, and endure.
- [A hands-on tour of OSx](./hands-on-tour.md) — the smallest end-to-end loop: deploy a DAO, fund it, make it execute an action, and watch a permission gate the call.

## Use and operate a DAO

- [Deploy your first DAO](./deploy-a-dao.md) — a bare DAO (you hold `EXECUTE`), then the same flow with a governance plugin installed in one transaction.
- [Launch a governance token with your DAO](./launch-a-governance-token.md) — deploy with Token Voting and the three token paths (mint new, reuse an `IVotes` token, or wrap a plain ERC-20), with the delegation and clock caveats made concrete.
- [Create, vote, and execute a proposal](./create-vote-execute.md) — the shared proposal lifecycle, then the multisig and token-voting specifics.
- [Manage permissions through governance](./manage-permissions.md) — grant/revoke as a proposal, attach a condition, rotate one safely in a single batch, and write a small custom condition.
- [Install a plugin into a live DAO](./install-a-plugin.md) — the prepare → (temporary ROOT to the PSP) → apply → revoke flow, as a governed proposal.
- [Update a plugin](./update-a-plugin.md) — prepare + apply via governance, the release/build rules, and the metadata-only fast path (and uninstalling).

## Build a plugin

- [Build a plugin](./build-a-plugin.md) — from the template: pick a base type, write the plugin's `auth`-gated logic, and write its `PluginSetup` (the permission arrays).
- [Publish a plugin to a PluginRepo](./publish-a-plugin.md) — first version 1.1, release vs build, metadata, and the registry.

## More to come

Deeper single-subsystem guides are planned: composing [multi-stage governance with the SPP](../plugins/spp-plugin.md), gating permissions with the ready-made [condition library](../helpers/condition-library.md), and [deploying the whole protocol](../deployment/protocol-factory.md) on a new chain. Until each lands, follow those concept pages for the underlying detail.
