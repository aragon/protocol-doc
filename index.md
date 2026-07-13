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

New to OSx? Read these two first, everything else builds on them:

1. [The DAO contract](/core/dao.md) — what a DAO actually *is*.
2. [The permission system](/core/permissions.md) — how OSx decides who may do what.

Then follow the path for what you're doing:

- **Build on / integrate with a DAO:** [actions & execution](/core/execution.md) → [the plugin model](/framework/plugins.md) → the [governance plugins](/plugins/index.md) you'll install.
- **Write your own plugin:** [the plugin model](/framework/plugins.md) → [choosing a base type](/framework/plugin-types.md) → [plugin setup](/framework/plugin-setup.md) → [PluginRepo](/framework/plugin-repo.md) → [the PluginSetupProcessor](/framework/plugin-setup-processor.md), then scaffold from the [plugin template](/tooling/plugin-template.md).
- **Deploy the protocol or a DAO:** the [deployment area](/deployment/index.md), the protocol factory (whole stack) and the DAO launchpad (individual DAOs).

_Step-by-step [guides](/guides/index.md) (the linear way in, with copy-adaptable Solidity) are still being written; until then, the ordered paths above walk the concept graph in sequence._

Browse by area:

- **[Core](/core/index.md)** — the DAO contract and its permission system: what a DAO is and how it authorizes actions.
- **[Common](/common/index.md)** — the shared cross-cutting primitives (now part of osx at `src/common`, formerly the standalone osx-commons): conditions, proposals, membership, ratio, auth, proxies, versioning.
- **[Framework](/framework/index.md)** — what a plugin *is* and how it's built, published, and installed: the plugin model, base types, setup, PluginRepo, the PluginSetupProcessor, the factories, the registries.
- **[Plugins](/plugins/index.md)** — the governance plugins (token voting, multisig, admin, staged proposals, lock-to-vote) and the automation-focused Capital Router.
- **[Helpers](/helpers/index.md)** — protocol helpers: the condition library.
- **[Deployment](/deployment/index.md)** — deploying the protocol and DAOs: the protocol factory and the DAO launchpad.
- **[Tooling](/tooling/index.md)** — the tooling for building on OSx: the Foundry plugin template and the `just`/Foundry task runner.

---

_Operated with the `wiki` CLI: [CLAUDE.md](/CLAUDE.md) is how to drive it, [WORKFLOW.md](/WORKFLOW.md) is this base's conventions. Work in progress is tracked in the [backlog](/backlog/index.md). These three are for **maintaining** the base, not for learning the protocol, a reader can skip them._
