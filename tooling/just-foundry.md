---
type: concept
title: Foundry Task Runner (just-foundry)
source: just-foundry/README.md
---

# Foundry Task Runner (just-foundry)

A drop-in **task runner and environment manager** for Foundry projects. Add it as a submodule and write a two-line `justfile`, and your project inherits a consistent one-stop workflow across every supported chain. Two wins in one: it turns multi-step Foundry flows (simulate → broadcast → verify → log) into single commands, *and* it **abstracts network configuration away entirely**, you never hand-manage the pile of per-network environment variables (RPC, chain id, verifier, and the Aragon OSx addresses) that Foundry projects otherwise accumulate. You switch network, and everything resolves. It's the shared tooling the Aragon repos build on: the [plugin template](./plugin-template.md) inits and runs with it (`just init`), the [DAO Launchpad](../deployment/dao-launchpad.md)'s projects inherit it, and the [Protocol Factory](../deployment/protocol-factory.md) uses it.

## Why it exists

Every repo that deploys something needs the same operational surface: run the tests, simulate, broadcast, verify on the right explorer, point at the right network, and pull in secrets without committing them. Rebuilding that per repo is boilerplate that drifts, and drift in *deployment* tooling is where mistakes get expensive. just-foundry centralizes it once so each project imports a known-good workflow instead of reinventing one, the same reason a launch [starts batteries-included](../deployment/dao-launchpad.md#one-workbench-many-projects).

Two payoffs make it worth adopting even for a single project:

- **Each network's quirks are solved once, then reused forever.** Every chain has exotic corners, the right verifier and its flags, an EVM-version override (Chiliz wants `shanghai`), zkSync's separate toolchain, an RPC peculiarity. Working those out is a **one-time** job that lives in the shared network config; from then on you `just switch <network>` and they're already handled, you never rediscover them per project or per deploy.
- **Repetitive, fat-finger-prone Foundry commands become self-documented recipes.** The real flows (simulate → broadcast → verify → log) are long `forge` invocations with flags that are easy to get wrong. just-foundry wraps them as a handful of named commands for the actual use cases, `just predeploy`, `just deploy`, `just verify`, `just refund`, all listed by `just help`. One obvious command per task instead of a remembered incantation.

The clarifying way to see it: a deployment project's configuration falls into exactly three buckets, and just-foundry's job is to erase the biggest and most error-prone one for you.

- **Public network parameters** (RPC, chain id, verifier, and, crucially, the **deployed OSx addresses**, everything that changes per chain and is *not* secret) — **handled entirely by just-foundry**. It ships every supported network's settings, so you never hand-assemble or hardcode them. They're public, which is exactly why they can live in shared config.
- **Project-specific parameters** (yours: how many multisig signers, the min-approvals, metadata URIs, whatever your deployment needs) — yours to set; they're what makes *your* deployment yours.
- **Secrets** (deployer key, API keys) — yours to provide; just-foundry wires up the resolution (optionally through the `vars` encrypted store, or a plain `.env`), you supply the values.

The upshot is that the entire network dimension disappears from your mental load: you `just switch <network>` and `just deploy`, and it works. All you ever think about is the two buckets that are genuinely your project's.

## What it gives a project

- **Network switching** across the many supported chains, each config carrying the RPC, chain id, verifier choice, and, crucially, the canonical **Aragon OSx addresses** for that chain. So projects reference the network, not hardcoded addresses.
- **Per-network flag resolution** and an `env` view that shows the resolved environment with the *source* of each value, so you can confirm what a deploy will actually use before broadcasting.
- **Secrets management**, kept out of the repo. Optionally integrates with [`vars`](https://github.com/vars-cli/vars): an **encrypted env-var manager** that keeps a central encrypted store and, at run time, reads what a project declares it needs and **injects** the resolved values into the environment, so a Foundry repo just sees ordinary env vars and one vault serves every project. A plain `.env` file is the zero-install fallback, and nothing in a recipe changes based on which of the two a value comes from.
- **Deploy / test / verify helpers** with logging, the shared recipes a project's `justfile` gets for free on `import`.

## Keep in mind

- **It's tooling, not protocol.** just-foundry doesn't deploy anything of its own; it's the harness other projects run their deployments through.
- **The network config is the single source of Aragon addresses.** Because each chain's addresses live in the shared config, projects switch networks instead of hardcoding, which is what keeps a project portable across chains.

## See also

- [DAO Launchpad](../deployment/dao-launchpad.md) — the workbench whose projects inherit this runner.
- [Plugin Template (Foundry)](./plugin-template.md) — the plugin-authoring scaffold, which inits and runs with this (`just init`).
- [Protocol Factory](../deployment/protocol-factory.md) — uses this runner to drive protocol deployments.
