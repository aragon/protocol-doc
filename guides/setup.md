---
type: guide
title: Setup
source: osx-plugin-template-foundry/README.md
---

# Setup

Every guide here is Foundry code you run from **your own plugin project**. Set that up once and any guide's snippets drop straight in, each guide then only calls out what's specific to it.

## 1. Start from the template

Clone the [Foundry plugin template](../tooling/plugin-template.md) and initialize it:

```sh
git clone --recurse-submodules https://github.com/aragon/osx-plugin-template.git my-plugin
cd my-plugin
just init   # installs dependencies and wires the remappings; `forge build` then works
```

(For a real project, use GitHub's **Use this template** to start your own repo and clone that instead.)

OSx is imported directly under `@aragon/osx/…`. Its shared primitives (conditions, proposals, proxies, and the rest, once the standalone `osx-commons` library) now live inside osx at `@aragon/osx/common/…`; there is no separate package to install.

## 2. Add the plugin you're integrating

The template ships **osx only**. A guide that installs or drives a specific governance plugin imports that plugin's package (e.g. `@aragon/multisig-plugin/…`), so add it as a dependency and a remapping. For the [multisig](../plugins/multisig-plugin.md) guides:

```sh
forge install aragon/multisig-plugin
echo '@aragon/multisig-plugin/=lib/multisig-plugin/packages/contracts/src/' >> remappings.txt
```

For [token voting](../plugins/token-voting-plugin.md), swap in:

```sh
forge install aragon/token-voting-plugin
echo '@aragon/token-voting-plugin/=lib/token-voting-plugin/src/' >> remappings.txt
```

Guides that touch only OSx core (the [DAO](../core/dao.md), [permissions](../core/permissions.md), the [framework](../framework/index.md)) need nothing extra.

## 3. Point at a deployed protocol

The guides run as **fork tests** against a chain where OSx is already deployed, so they read the protocol's addresses from the environment. You don't hunt these down: [just-foundry](../tooling/just-foundry.md) (which the template already runs on) ships them for every supported network. Select a network and it exports them:

```sh
just switch sepolia   # or mainnet, base, arbitrum, … (see lib/just-foundry/networks/)
just env              # confirm the resolved values and where each came from
```

That defines `RPC_URL`, `CHAIN_ID`, and the OSx addresses the guides read by name:

| Env var | Used by |
|---|---|
| `DAO_FACTORY_ADDRESS` | every guide that creates a DAO |
| `PLUGIN_SETUP_PROCESSOR_ADDRESS` | [install](./install-a-plugin.md) / [update](./update-a-plugin.md) a plugin |
| `PLUGIN_REPO_FACTORY_ADDRESS` | [publish a plugin](./publish-a-plugin.md) |
| `MULTISIG_PLUGIN_REPO_ADDRESS`, `TOKEN_VOTING_PLUGIN_REPO_ADDRESS`, … | installing that plugin |

These come from the network config (ultimately OSx's own `addresses.json`); override `RPC_URL` with a private endpoint via `.env` or `vars` if you like, see [just-foundry](../tooling/just-foundry.md).

Put the guide's test under `test/fork-tests/` and run it through just-foundry, which loads the network env before Foundry sees it:

```sh
just test-fork                          # run the fork tests in test/fork-tests/
just test-fork --match-contract MyGuide # narrow to one
```

A couple of guides build on a DAO you deployed in an earlier guide and name *its* address (e.g. `DAO`); those are your own values, set them alongside the above.

That's the whole setup. Every guide below assumes it.
