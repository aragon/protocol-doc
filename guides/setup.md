---
type: guide
title: Setup
source: osx-plugin-template-foundry/README.md
---

# Setup

Every guide here is Foundry code you run from **your own plugin project**. Set that up once and any guide's snippets drop straight in, each guide then only calls out what's specific to it.

## 1. Start from the template

Clone the [Foundry plugin template](/tooling/plugin-template.md) and initialize it:

```sh
git clone --recurse-submodules https://github.com/aragon/osx-plugin-template.git my-plugin
cd my-plugin
just init   # installs dependencies and wires the remappings; `forge build` then works
```

(For a real project, use GitHub's **Use this template** to start your own repo and clone that instead.)

OSx is imported directly under `@aragon/osx/…`. Its shared primitives (conditions, proposals, proxies, and the rest, once the standalone `osx-commons` library) now live inside osx at `@aragon/osx/common/…`; there is no separate package to install.

## 2. Enable the plugin you're integrating

Guides that install or drive a specific governance plugin, [multisig](/plugins/multisig-plugin.md) or [token voting](/plugins/token-voting-plugin.md), import that plugin's package (e.g. `@aragon/multisig-plugin/…`). The template ships **osx only**, so add that plugin as a dependency and a remapping yourself (`forge install aragon/multisig-plugin`, then a `@aragon/multisig-plugin/=…` line in `remappings.txt`). Guides that touch only OSx core, the [DAO](/core/dao.md), [permissions](/core/permissions.md), the [framework](/framework/index.md), need nothing extra.

## 3. Point at a deployed protocol

The guides run as **fork tests** against a chain where OSx is already deployed, so they read a few values from the environment:

- `RPC_URL` — an endpoint to fork.
- the factory / registry / plugin addresses the guide names (`DAO_FACTORY`, `PSP`, a plugin's `…_REPO`, …), from the [deployment artifacts](/deployment/deployment-checklist.md) for your target chain.

Set them in your shell or a `.env`, then run the guide's test:

```sh
forge test --match-path test/YourGuide.t.sol -vvv
```

That's the whole setup. Every guide below assumes it.
