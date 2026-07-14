---
type: concept
title: Plugin Template (Foundry)
source: osx-plugin-template-foundry/README.md
---

# Plugin Template (Foundry)

A GitHub template repository that scaffolds a new OSx plugin, the intended starting point when you set out to [write your own plugin](../framework/index.md). Create a repo from it and you have a tested, publishable, deployable plugin project in minutes, instead of assembling the OSx boilerplate by hand.

## Why start from it

Writing a plugin correctly is more than one contract. You need the right [plugin base type](../framework/plugin-types.md) for your upgradeability choice, a [PluginSetup](../framework/plugin-setup.md) that grants *exactly* the right permissions on install and revokes them on uninstall, tests that exercise it against a real DAO, and scripts to publish and deploy it. Getting any of that subtly wrong is where plugin bugs live. The template ships a correct, batteries-included version of all of it, so your effort goes into your plugin's actual logic.

## What it gives you

- **Contract starters** for the [plugin base types](../framework/plugin-types.md) (the non-upgradeable, cloneable, and UUPS-upgradeable variants), so you begin from the right base rather than choosing blind.
- **[PluginSetup](../framework/plugin-setup.md) scaffolding** wired to those contracts, the prepare-install / prepare-uninstall logic that the [PluginSetupProcessor](../framework/plugin-setup-processor.md) drives.
- **Deploy scripts and factories**, including the [one-shot factory](../deployment/dao-launchpad.md#correct-from-genesis) pattern for standing up a custom DAO with your plugin, and scripts for publishing to a [PluginRepo](../framework/plugin-repo.md).
- **A testing environment** for unit tests, fork tests against a live network, and use-case scenarios.
- **Multi-explorer verification** and a self-documenting **`just`** task runner (via [just-foundry](./just-foundry.md)) covering the whole build/test/deploy workflow, `just init` sets the project up out of the box.

## Which starter path to take

The template ships **examples of every variant** so each pattern is there to learn from; a real plugin keeps one of each and deletes the rest. Two choices define your path:

**1. The plugin base type** (see [choosing a plugin base](../framework/plugin-types.md)). The repo includes all three, `MyUpgradeablePlugin` (UUPS), `MyCloneablePlugin` (clone), and `MyStaticPlugin` (non-upgradeable). Keep the one you want, point [`MyPluginSetup`](../framework/plugin-setup.md)'s `constructor()` and `prepareInstallation()` at it, and drop the others. If it's upgradeable, inherit `PluginUpgradeableSetup` instead of `PluginSetup` so you can add `prepareUpdate`.

**2. The deployment flow** (set `DEPLOY_SCRIPT` in the `justfile`; it defaults to `DeploySimple`). The template's real output is a **published plugin**, but it ships three starter scripts:

- **Publish the plugin** to a [PluginRepo](../framework/plugin-repo.md) (`DeploySimple`), the main path, what makes your plugin installable by any DAO.
- **Deploy a DAO with your plugin(s) installed** (`DeployDaoWithPlugins`, trusted) or **via a one-shot factory** (`DeployViaFactory`, trustless), included so you can stand up a DAO *to exercise your plugin*: a demo, an end-to-end test, or a simple one-off.

If your goal is actually **launching a DAO** rather than building a plugin, reach for the [DAO Launchpad](../deployment/dao-launchpad.md) instead, it's the workbench for assembling a custom DAO from heterogeneous components (and it can install the plugin you published here). Rule of thumb: **build/publish a plugin → this template; launch a DAO → the Launchpad.**

For tests, two builders stand up a DAO with your plugin installed: a **SimpleBuilder** (local) and a **ForkBuilder** (against a real deployed protocol, using the configured factory addresses).

## Where it sits

The template is the plugin *author's* entry point. What you build here becomes a versioned entry in a [PluginRepo](../framework/plugin-repo.md); from there any DAO installs it through the [PSP](../framework/plugin-setup-processor.md). So this is the front door to the plugin lifecycle the [framework](../framework/index.md) pages describe from the protocol side.

## Keep in mind

- **It's a scaffold, replace the sample contracts.** The starters exist to be swapped for your plugin; keep the setup/test/deploy structure, change the logic.
- **Choose the base type deliberately.** Your upgradeability and gas trade-offs are set by which [plugin base type](../framework/plugin-types.md) you start from; the template offers all of them for that reason.
- **Template vs [DAO Launchpad](../deployment/dao-launchpad.md).** Building a (core or custom) *plugin* starts here; *launching a DAO* is the Launchpad. The template's DAO-deploy scripts exist to exercise your plugin, they aren't the home for a real DAO launch, which is why the two only *look* like they overlap.

## See also

- [Plugin base types](../framework/plugin-types.md) and [plugin setup](../framework/plugin-setup.md) — what the starters implement.
- [PluginRepo](../framework/plugin-repo.md) and [the PluginSetupProcessor](../framework/plugin-setup-processor.md) — where a finished plugin is published and how it's installed.
- [just-foundry](./just-foundry.md) — the `just`/Foundry task runner this template inits and runs with (`just init`, `just test`, …), shared across the Aragon repos.
- [Build a plugin](../guides/build-a-plugin.md) and [Publish a plugin](../guides/publish-a-plugin.md) — the step-by-step walkthroughs that use this template.
