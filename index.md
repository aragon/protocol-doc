---
okf_version: "0.1"
---

# Aragon OSx Protocol

The developer knowledge base for the EVM protocol behind Aragon: the **OSx** core, the **governance plugins**, and the **helpers and tooling** that make them run. It is written for developers building on and integrating with the protocol in Solidity.

## What the protocol is

**Aragon OSx is a framework for building DAOs as smart contracts.** No two organizations are the same, and even a single organization is not the same over time, its needs change. So OSx makes a DAO a *lean, lasting core*, one contract that holds assets, executes arbitrary actions, and owns its own permission database, and lets you **iterate** the organization by adding and removing capability around that core. Two ideas do the heavy lifting:

- **Plugins** add functionality to a DAO (governance, asset management, membership, anything). A DAO installs the plugins it needs and can add, update, or remove them over its lifetime, so the organization evolves without ever being redeployed.
- **A permission system** governs who is allowed to do what, on which contract. It is the single authorization layer the DAO and its plugins share, and it can defer decisions to on-chain **conditions**.

The point is to make that iteration both **flexible and safe**: a plugin never arrives loose, it comes with a **setup** that encapsulates exactly what to deploy and which permissions to grant or revoke, applied as one reviewable, all-or-nothing step. Around this sit a versioned **plugin registry** and an installation **framework** that make plugins safe to publish, install, and upgrade, plus **factories** that deploy the whole stack and a **launchpad** that drives real DAO creation.

## Start here

**New to OSx?** The [guides](./guides/index.md) are the way in, hands-on, Foundry-based, followed start to finish:

- [Why OSx](./guides/why-osx.md) — the short "what this is and why," no code.
- [A hands-on tour of OSx](./guides/hands-on-tour.md) — deploy a DAO and make it act, in one short test.
- Then the path that fits you: [deploy a DAO](./guides/deploy-a-dao.md) → [launch a governance token](./guides/launch-a-governance-token.md) → [create, vote, execute](./guides/create-vote-execute.md), or, to author your own plugin, [build a plugin](./guides/build-a-plugin.md) → [publish it](./guides/publish-a-plugin.md). Full list and reading order in [guides](./guides/index.md).

**Prefer the reference?** Two concepts underpin everything, read them first:

1. [The DAO contract](./core/dao.md) — what a DAO actually *is*.
2. [The permission system](./core/permissions.md) — how OSx decides who may do what.

From there follow a path through the graph, [actions & execution](./core/execution.md) → [the plugin model](./framework/plugins.md) → the [governance plugins](./plugins/index.md), or for authoring, [base types](./framework/plugin-types.md) → [plugin setup](./framework/plugin-setup.md) → [PluginRepo](./framework/plugin-repo.md) → [the PluginSetupProcessor](./framework/plugin-setup-processor.md), or just browse by area below.

Browse by area:

- **[Core](./core/index.md)** — the DAO contract and its permission system: what a DAO is and how it authorizes actions.
- **[Common](./common/index.md)** — the shared cross-cutting primitives (now part of osx at `src/common`, formerly the standalone osx-commons): conditions, proposals, membership, ratio, auth, proxies, versioning.
- **[Framework](./framework/index.md)** — what a plugin *is* and how it's built, published, and installed: the plugin model, base types, setup, PluginRepo, the PluginSetupProcessor, the factories, the registries.
- **[Plugins](./plugins/index.md)** — the governance plugins (token voting, multisig, admin, staged proposals, lock-to-vote).
- **[Helpers](./helpers/index.md)** — protocol helpers: the condition library.
- **[Deployment](./deployment/index.md)** — deploying the protocol and DAOs: the protocol factory and the DAO launchpad.
- **[Tooling](./tooling/index.md)** — the tooling for building on OSx: the Foundry plugin template and the `just`/Foundry task runner.

**Looking up an exact signature?** The [ABI reference](./abi/index.md) is the generated lookup layer: every public function, event, error, enum and constant of every contract, with its NatSpec, straight from the source. Read the area pages to understand a thing; go there to check its precise surface.

**The code:** every component's GitHub repository is listed in [Source repositories](./repositories.md).

---

_Operated with the `wiki` CLI: [AGENTS.md](./AGENTS.md) is how to drive it, [WORKFLOW.md](./WORKFLOW.md) is this base's conventions. Both are for **maintaining** the base, not for learning the protocol, a reader can skip them._
