---
okf_version: "0.1"
---

# Aragon OSx Protocol

The developer knowledge base for the EVM protocol behind Aragon: the **OSx** core, the **governance plugins**, and the **helpers and tooling** that make them run. It is written for developers building on and integrating with the protocol in Solidity.

## What the protocol is

**Aragon OSx is a framework for building DAOs as smart contracts.** Organizations have different needs, and those needs change over time. OSx keeps the DAO's core small: one contract holds assets, executes arbitrary actions, and owns its own permission database. You can add and remove capabilities around that core as the organization evolves. This relies on two parts:

- **Plugins** add functionality to a DAO (governance, asset management, membership, anything). A DAO installs the plugins it needs and can add, update, or remove them over its lifetime, so the organization evolves without ever being redeployed.
- **A permission system** governs who is allowed to do what, on which contract. It is the single authorization layer the DAO and its plugins share, and it can defer decisions to onchain **conditions**.

Each plugin comes with a **setup** that specifies exactly what to deploy and which permissions to grant or revoke. These changes are reviewable and applied as one all-or-nothing step, so the organization can change its capabilities safely. A versioned **plugin registry** and an installation **framework** support safe publishing, installation, and upgrades. **Factories** deploy the whole stack, and a **launchpad** handles DAO creation.

## Start here

**New to OSx?** Start with the [guides](./guides/index.md): hands-on, Foundry-based walkthroughs to follow from start to finish.

- [Why OSx](./guides/why-osx.md) — the short "what this is and why," no code.
- [A hands-on tour of OSx](./guides/hands-on-tour.md) — deploy a DAO and make it act, in one short test.
- Then the path that fits you: [deploy a DAO](./guides/deploy-a-dao.md) → [launch a governance token](./guides/launch-a-governance-token.md) → [create, vote, execute](./guides/create-vote-execute.md), or, to author your own plugin, [build a plugin](./guides/build-a-plugin.md) → [publish it](./guides/publish-a-plugin.md). Full list and reading order in [guides](./guides/index.md).

**Prefer the reference?** Read these two concepts first; everything else builds on them:

1. [The DAO contract](./core/dao.md) — what a DAO actually *is*.
2. [The permission system](./core/permissions.md) — how OSx decides who may do what.

From there, follow [actions & execution](./core/execution.md) → [the plugin model](./framework/plugins.md) → the [governance plugins](./plugins/index.md). For plugin authoring, follow [base types](./framework/plugin-types.md) → [plugin setup](./framework/plugin-setup.md) → [PluginRepo](./framework/plugin-repo.md) → [the PluginSetupProcessor](./framework/plugin-setup-processor.md). You can also browse by area below.

Browse by area:

- **[Core](./core/index.md)** — the DAO contract and its permission system: what a DAO is and how it authorizes actions.
- **[Common](./common/index.md)** — the shared cross-cutting primitives (now part of osx at `src/common`, formerly the standalone osx-commons): conditions, proposals, membership, ratio, auth, proxies, versioning.
- **[Framework](./framework/index.md)** — what a plugin *is* and how it's built, published, and installed: the plugin model, base types, setup, PluginRepo, the PluginSetupProcessor, the factories, the registries.
- **[Plugins](./plugins/index.md)** — the governance plugins (token voting, multisig, admin, staged proposals, lock-to-vote).
- **[Helpers](./helpers/index.md)** — protocol helpers: the condition library.
- **[Deployment](./deployment/index.md)** — deploying the protocol and DAOs: the protocol factory and the DAO launchpad.
- **[Tooling](./tooling/index.md)** — the tooling for building on OSx: the Foundry plugin template, the `just`/Foundry task runner, and the deployed addresses and ABIs.

**Coming from another system?** [OSx compared](./osx-compared.md) puts the permission model side by side with OpenZeppelin, Safe + Zodiac and Hats: where each keeps its authorization state, what that buys, what it costs, and how to express each one's patterns in OSx.

**Looking up an exact signature?** The [ABI reference](./abi/index.md) is the generated lookup layer: every public function, event, error, enum and constant of every contract, with its NatSpec, straight from the source. Read the area pages to understand a component; use the ABI reference to check its exact interface.

**Need a deployed address or a JSON ABI?** [artifacts-hub](./tooling/artifacts-hub.md) is the canonical address book for every chain Aragon is deployed on, with a versioned, machine-readable ABI for every contract.

**The code:** every component's GitHub repository is listed in [Source repositories](./repositories.md).

These docs are **agent friendly** by design, but you can also load the full knowledge base in one go from [https://docs.aragon.org/llms-full.txt](https://docs.aragon.org/llms-full.txt).

---

_Operated with the `wiki` CLI: [AGENTS.md](./AGENTS.md) explains how to use it, and [WORKFLOW.md](./WORKFLOW.md) describes this base's conventions. Both are for **maintaining** the base. You can skip them if you're here to learn the protocol._
