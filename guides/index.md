# Guides

Linear, task-oriented, **Foundry-based** walkthroughs that link into the [concept graph](/index.md) for depth. Read a guide top to bottom; follow its links when you want the underlying detail. (The one exception to "Foundry-based" is the narrative *Why OSx*, which has no code.)

Guides are written in the order below; each links the concepts it uses rather than re-explaining them. Unwritten entries below are the to-write list (`wiki unresolved`).

## Understand

- [Why OSx: the organization that can reinvent itself](/guides/why-osx.md) — Why a lean core + swappable plugins + one permission layer lets an organization iterate, pivot, and endure.
- [A hands-on tour of OSx](/guides/hands-on-tour.md) — the smallest end-to-end loop: deploy a DAO, fund it, make it execute an action, and watch a permission gate the call. The hands-on on-ramp.

## Use and operate a DAO

- [Deploy your first DAO](/guides/deploy-a-dao.md) — a bare DAO (you hold `EXECUTE`), then the same flow with a governance plugin installed in one transaction.
- [Launch a governance token with your DAO](/guides/launch-a-governance-token.md) — deploy with Token Voting and the three token paths (mint new, reuse an `IVotes` token, or wrap a plain ERC-20), with the delegation and clock caveats made concrete.
- [Create, vote, and execute a proposal](/guides/create-vote-execute.md) — the shared proposal lifecycle, then the multisig and token-voting specifics.
- [Manage permissions through governance](/guides/manage-permissions.md) — grant/revoke as a proposal, attach a condition, rotate one safely in a single batch, and write a small custom condition.
- [Install a plugin into a live DAO](/guides/install-a-plugin.md) — the prepare → (temporary ROOT to the PSP) → apply → revoke flow, as a governed proposal.
- [Update a plugin](/guides/update-a-plugin.md) — prepare + apply via governance, the release/build rules, and the metadata-only fast path (and uninstalling).

## Build a plugin

- [Build a plugin](/guides/build-a-plugin.md) — from the template: pick a base type, write the plugin's `auth`-gated logic, and write its `PluginSetup` (the permission arrays).
- [Publish a plugin to a PluginRepo](/guides/publish-a-plugin.md) — first version 1.1, release vs build, metadata, and the registry.

## Advanced (candidates, not yet written)

Deeper single-subsystem guides, deferred pending confirmation (tracked in the [guides backlog](/backlog/use-cases.md)):

- **Compose multi-stage governance (SPP)** — stage plugins into a pipeline (multisig → token vote, with a council veto): [stages & bodies](/plugins/spp-plugin/stages-and-bodies.md), the rule condition, advancing.
- **Automate a capital flow (Capital Router)** — assemble a [Strategy](/plugins/capital-router/strategies.md) (budget + splitter) and install a Dispatcher/Requester policy ([dispatch vs request](/plugins/capital-router/dispatch-vs-request.md)); worked as payroll or buyback.
- **Gate permissions with the condition library** — use ready-made [conditions](/helpers/condition-library.md) (scope `EXECUTE` to specific calls, bridge a Safe's owners) instead of writing your own; extends [Manage permissions](/guides/manage-permissions.md).
- **Deploy the whole protocol (Protocol Factory)** — bring OSx up on a new chain (framework + ENS + [Management DAO](/deployment/protocol-factory.md) + core plugin repos). For protocol operators.

---

_Progress and scope are tracked in the [guides backlog](/backlog/use-cases.md)._
