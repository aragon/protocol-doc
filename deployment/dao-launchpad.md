---
type: concept
title: DAO Launchpad
source: dao-launchpad/README.md, dao-launchpad/template/README.md
---

# DAO Launchpad

The DAO Launchpad is the **deployment workbench** for launching DAOs on top of an already-deployed [OSx protocol](./index.md). It contains deployment projects with a prescribed structure; each deploys one DAO, its plugins, and any custom contracts the launch needs through a single, auditable onchain factory.

## Where it fits

The Launchpad handles the third of these related deployment jobs:

- **Publishing a plugin** (authoring one and creating a [PluginRepo](../framework/plugin-repo.md) version) makes a plugin *available* to any DAO before a launch.
- **Deploying OSx itself** onto a chain is the [Protocol Factory](./protocol-factory.md)'s job; it stands up the framework a launch then targets.
- **Standing up one custom DAO** that combines standard plugins, your own customized plugins, standard [conditions](../helpers/condition-library.md) and custom ones, plus any bespoke contracts, into a single organization. This is the Launchpad's role.

Those components come from **different repos**. Assembling them into one DAO with the correct permissions must be **atomic, deterministic, and verifiable**.

## The problem it solves

Deploying a governed DAO takes several steps: create the [DAO](../core/dao.md), [install each plugin](../framework/plugin-setup-processor.md), set every [permission](../core/permissions.md), then hand control to whoever should own it. Separate transactions leave a **partially configured DAO** between steps that someone could exploit, while the deployer **temporarily holds power** over funds and governance. The launchpad makes the whole sequence a single, reviewable, all-or-nothing event.

## Correct from genesis

All deployment logic lives in a **one-shot onchain factory**, a Solidity contract whose `deployOnce()` performs the whole sequence atomically: create the DAO, configure each component, hand governance to its permanent owner, and finally **revoke its own bootstrap power**. Because it's one transaction, the DAO is either deployed with its full configuration and correct permissions or is never deployed at all. There is no window in which it exists but is misconfigured or still under the deployer's control. This also gives the deployment two properties:

- **Verifiable** — what was deployed is auditable from the factory's verified onchain source, without trusting a local script.
- **Idempotent** — a second `deployOnce()` reverts, so a launch can't be run twice by accident.

## One workbench, many projects

The launchpad is a **monorepo** hosting self-contained deployment projects, one per launch. They share a single set of dependencies and one task runner (from [just-foundry](../tooling/just-foundry.md)), so each launch reuses the Foundry setup, remappings, network configs, and secrets handling. Each project owns what's specific to *its* launch: the factory, the custom contracts, and the parameters.

A **template** provides a minimal working DAO that demonstrates the configuration end to end. Use it as a scaffold, replacing its factory, custom contracts, and parameters with those for your launch.

## Keep in mind

- **The factory makes deployment atomic.** The scripts deploy and invoke it; the correctness guarantees come from completing setup onchain in one call.
- **Replace the template with your launch's own contracts.** It is a scaffold for building your deployment.

## See also

- [DAOFactory](../framework/dao-factory.md) and [the PluginSetupProcessor](../framework/plugin-setup-processor.md) — the OSx machinery every launch factory drives.
- [Deployment overview](./index.md); the [Protocol Factory](./protocol-factory.md) deploys the protocol a launch targets.
