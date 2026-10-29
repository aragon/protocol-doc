# Guides

Linear, task-oriented, **Foundry-based** walkthroughs that link into the [concept graph](../index.md) for depth. Read a guide top to bottom; follow its links when you want the underlying detail. (The one exception to "Foundry-based" is the narrative *Why OSx*, which has no code.)

Follow the reading order below, with links to the concepts each guide uses.

**Before you start:** [Setup](./setup.md), the one-time Foundry project scaffold (start from the template, point at a deployed protocol) used by the DAO and plugin-authoring guides below.

## Understand

- [Why OSx: the organization that can reinvent itself](./why-osx.md) — how a small core, replaceable plugins, and one permission layer let an organization change over time.
- [A hands-on tour of OSx](./hands-on-tour.md) — deploy a DAO, fund it, make it execute an action, and see how a permission controls the call.

## Use and operate a DAO

- [Deploy your first DAO](./deploy-a-dao.md) — a bare DAO (you hold `EXECUTE`), then the same flow with a governance plugin installed in one transaction.
- [Launch a governance token with your DAO](./launch-a-governance-token.md) — deploy with Token Voting and the three token paths (mint new, reuse an `IVotes` token, or wrap a plain ERC-20), accounting for delegation and clock requirements.
- [Import an existing token](/guides/import-existing-tokens.md) — choose direct reuse or wrapping, install Token Voting, and prepare holders to vote.
- [Create, vote, and execute a proposal](./create-vote-execute.md) — the shared proposal lifecycle, then the multisig and token-voting specifics.
- [Manage permissions through governance](./manage-permissions.md) — grant/revoke as a proposal, attach a condition, rotate one safely in a single batch, and write a small custom condition.
- [Install a plugin into a live DAO](./install-a-plugin.md) — the prepare → (temporary ROOT to the PSP) → apply → revoke flow, as a governed proposal.
- [Update a plugin](./update-a-plugin.md) — prepare + apply via governance, the release/build rules, and the metadata-only fast path (and uninstalling).

## Allocate and distribute resources

- [Lock, delegate, and vote with VE](./use-ve-governance.md) follows the holder's transactions, reads gauge results for a chosen block, and completes an exit.
- [Distribute tokens through a Merkle campaign](./distribute-tokens.md) turns a recipient list into a campaign, authorizes the DAO's payout calls, and submits a claim.

These walkthroughs use the component repositories' build environments and an installed component set. Their compiler and dependency requirements are described in those repositories.

## Build a plugin

- [Build a plugin](./build-a-plugin.md) — from the template: pick a base type, write the plugin's `auth`-gated logic, and write its `PluginSetup` (the permission arrays).
- [Publish a plugin to a PluginRepo](./publish-a-plugin.md) — first version 1.1, release vs build, metadata, and the registry.

<a id="more-to-come"></a>

## Related concepts

For details on composing [multi-stage governance with the SPP](../plugins/spp-plugin.md), gating permissions with the ready-made [condition library](../helpers/condition-library.md), and [deploying the whole protocol](../deployment/protocol-factory.md) on a new chain, follow the linked concepts.
