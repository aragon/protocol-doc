---
type: concept
title: Plugin Template (Foundry)
source: osx-plugin-template-foundry/README.md
---

# Plugin Template (Foundry)

A GitHub template repository that scaffolds a new OSx plugin, the intended starting point when you set out to [write your own plugin](/framework/index.md). Create a repo from it and you have a tested, publishable, deployable plugin project in minutes, instead of assembling the OSx boilerplate by hand.

## Why start from it

Writing a plugin correctly is more than one contract. You need the right [plugin base type](/framework/plugin-types.md) for your upgradeability choice, a [PluginSetup](/framework/plugin-setup.md) that grants *exactly* the right permissions on install and revokes them on uninstall, tests that exercise it against a real DAO, and scripts to publish and deploy it. Getting any of that subtly wrong is where plugin bugs live. The template ships a correct, batteries-included version of all of it, so your effort goes into your plugin's actual logic.

## What it gives you

- **Contract starters** for the [plugin base types](/framework/plugin-types.md) (the non-upgradeable, cloneable, and UUPS-upgradeable variants), so you begin from the right base rather than choosing blind.
- **[PluginSetup](/framework/plugin-setup.md) scaffolding** wired to those contracts, the prepare-install / prepare-uninstall logic that the [PluginSetupProcessor](/framework/plugin-setup-processor.md) drives.
- **Deploy scripts and factories**, including the [one-shot factory](/deployment/dao-launchpad.md#correct-from-genesis) pattern for standing up a custom DAO with your plugin, and scripts for publishing to a [PluginRepo](/framework/plugin-repo.md).
- **A testing environment** for unit tests, fork tests against a live network, and use-case scenarios.
- **Multi-explorer verification** and a self-documenting task runner covering the whole build/test/deploy workflow.

## Where it sits

The template is the plugin *author's* entry point. What you build here becomes a versioned entry in a [PluginRepo](/framework/plugin-repo.md); from there any DAO installs it through the [PSP](/framework/plugin-setup-processor.md). So this is the front door to the plugin lifecycle the [framework](/framework/index.md) pages describe from the protocol side.

## Keep in mind

- **It's a scaffold, replace the sample contracts.** The starters exist to be swapped for your plugin; keep the setup/test/deploy structure, change the logic.
- **Choose the base type deliberately.** Your upgradeability and gas trade-offs are set by which [plugin base type](/framework/plugin-types.md) you start from; the template offers all of them for that reason.

## See also

- [Plugin base types](/framework/plugin-types.md) and [plugin setup](/framework/plugin-setup.md) — what the starters implement.
- [PluginRepo](/framework/plugin-repo.md) and [the PluginSetupProcessor](/framework/plugin-setup-processor.md) — where a finished plugin is published and how it's installed.
- [just-foundry](/tooling/just-foundry.md) — the `just`/Foundry task runner the Aragon repos are standardizing on.
- [Guides](/guides/index.md) — a step-by-step "write your own plugin" walkthrough is planned here (not yet written).
