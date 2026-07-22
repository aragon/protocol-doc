---
type: concept
title: DAO Launchpad
source: dao-launchpad/README.md, dao-launchpad/template/README.md
---

# DAO Launchpad

The DAO Launchpad is the **deployment workbench** for launching real DAOs on top of an already-deployed [OSx protocol](./index.md): a home for opinionated deployment projects, each of which stands up one DAO (with its plugins, and any custom contracts a specific launch needs) through a single, auditable on-chain factory.

## Where it fits

Three deployment jobs are easy to conflate; the Launchpad is only the third:

- **Publishing a plugin** (authoring one, cutting a [PluginRepo](../framework/plugin-repo.md) version) makes a plugin *available* to any DAO. Upstream of a launch.
- **Deploying OSx itself** onto a chain is the [Protocol Factory](./protocol-factory.md)'s job; it stands up the framework a launch then targets.
- **Standing up one custom DAO** that *assembles* those pieces, standard plugins, your own customized plugins, standard [conditions](../helpers/condition-library.md) and custom ones, plus any bespoke contracts, into a single organization. That's the Launchpad.

Its reason to exist is that last case: the pieces come from **heterogeneous repos**, and assembling them into one correctly-permissioned DAO has to be **atomic, deterministic, and verifiable** (the *how* is the rest of this page).

## The problem it solves

Standing up a governed DAO is not one step, it's a sequence: create the [DAO](../core/dao.md), [install each plugin](../framework/plugin-setup-processor.md), set every [permission](../core/permissions.md), then hand control to whoever should own it. Run that as a string of separate transactions and two bad things happen: every intermediate state is a **half-configured DAO** someone could exploit, and the deployer **transiently holds power** over funds and governance. The launchpad exists to make that whole sequence a single, reviewable, all-or-nothing event.

## Correct from genesis

Its answer, and the best practice it encodes, is the **one-shot on-chain factory**: all the deployment logic lives in one Solidity contract whose `deployOnce()` does everything atomically, create the DAO, wire every piece, hand governance to its permanent owner, and finally **revoke its own bootstrap power**. Because it's one transaction, the DAO either emerges fully-formed and correctly-permissioned or is never deployed at all; there is no window in which it exists but is misconfigured or still under the deployer's control. Two properties follow for free:

- **Verifiable** — what was deployed is auditable from the factory's verified on-chain source, not from trusting a local script.
- **Idempotent** — a second `deployOnce()` reverts, so a launch can't be run twice by accident.

## One workbench, many projects

The launchpad is a **monorepo**: one workbench hosting many self-contained deployment projects, one per launch. They share a single set of dependencies and one inherited task runner (from [just-foundry](../tooling/just-foundry.md)), so a new launch starts batteries-included instead of re-bootstrapping Foundry, remappings, network configs, and secrets every time. Each project then owns only what's specific to *its* launch: the factory, the custom contracts, the parameters.

A **template** is the starting point, a minimal working DAO that proves the wiring end to end, but it's only a scaffold: the substance lives in the real projects you build from it, each replacing the template with its own factory, custom contracts, and parameters.

## Keep in mind

- **The value is the atomic factory, not the scripts.** The scripts just deploy the factory and pull the trigger; the correctness guarantees all come from doing the setup on-chain in one call.
- **The template is a scaffold, not the product.** You start from it and replace it with your launch's own contracts.

## See also

- [DAOFactory](../framework/dao-factory.md) and [the PluginSetupProcessor](../framework/plugin-setup-processor.md) — the OSx machinery every launch factory drives.
- [Deployment overview](./index.md); the [Protocol Factory](./protocol-factory.md) deploys the protocol a launch targets.
