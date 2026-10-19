---
type: concept
title: Foundry Task Runner (just-foundry)
source: just-foundry/README.md
---

# Foundry Task Runner (just-foundry)

A **task runner and environment manager** for Foundry projects. Add it as a submodule and write a two-line `justfile` to use the same workflow across every supported chain. It turns multi-step Foundry flows (simulate → broadcast → verify → log) into single commands and resolves each network's environment variables: RPC, chain id, verifier, and Aragon OSx addresses. Switching networks selects the corresponding configuration without requiring you to manage those values by hand. It's the shared tooling the Aragon repos build on: the [plugin template](./plugin-template.md) initializes and runs with it (`just init`), the [DAO Launchpad](../deployment/dao-launchpad.md)'s projects inherit it, and the [Protocol Factory](../deployment/protocol-factory.md) uses it.

## Why it exists

Every repo that deploys something needs to run tests, simulate, broadcast, verify on the right explorer, select the right network, and load secrets without committing them. Maintaining separate implementations lets them drift apart, which can cause costly deployment mistakes. just-foundry centralizes this work so each project imports a shared workflow, as [launch projects do](../deployment/dao-launchpad.md#one-workbench-many-projects).

Even a single project benefits from the shared configuration and commands:

- **Network-specific settings are configured once and reused.** These include the verifier and its flags, EVM-version overrides (Chiliz wants `shanghai`), zkSync's separate toolchain, and RPC requirements. They live in the shared network config, so `just switch <network>` selects them for each project and deployment.
- **Named recipes replace repetitive Foundry commands.** The flows (simulate → broadcast → verify → log) require long `forge` invocations whose flags can be mistyped. just-foundry wraps them in commands for each task: `just predeploy`, `just deploy`, `just verify`, and `just refund`, all listed by `just help`. You can look up a task's command rather than remember the full invocation.

A deployment project's configuration has three parts. just-foundry supplies the public network parameters; you provide the project-specific values and secrets.

- **Public network parameters** (RPC, chain id, verifier, and the **deployed OSx addresses**: values that change per chain and are *not* secret) — **supplied by just-foundry** for every supported network, so you don't need to assemble or hardcode them. Their public nature lets projects share the configuration.
- **Project-specific parameters** (how many multisig signers, the min-approvals, metadata URIs, and other values your deployment needs) — yours to set for each deployment.
- **Secrets** (deployer key, API keys) — yours to provide. just-foundry resolves them through the `vars` encrypted store or a plain `.env`.

With the project parameters and secrets set, use `just switch <network>` and `just deploy` to deploy with that network's configuration.

## What it gives a project

- **Network switching** across the many supported chains, each config carrying the RPC, chain id, verifier choice, and canonical **Aragon OSx addresses** for that chain. Projects reference the network instead of hardcoding addresses.
- **Per-network flag resolution** and an `env` view that shows the resolved environment with the *source* of each value, so you can confirm what a deploy will actually use before broadcasting.
- **Secrets management**, kept out of the repo. Optionally integrates with [`vars`](https://github.com/vars-cli/vars): an **encrypted env-var manager** with a central encrypted store. At run time, it reads what a project declares it needs and **injects** the resolved values into the environment. Foundry receives ordinary env vars, and one vault can serve every project. A plain `.env` file is the fallback requiring no extra installation; recipes work the same way with either source.
- **Deploy / test / verify helpers** with logging, available to a project's `justfile` through `import`.

## Keep in mind

- **just-foundry runs other projects' deployments.** It doesn't deploy a protocol of its own.
- **The network config is the single source of Aragon addresses.** Because each chain's addresses live in the shared config, projects switch networks instead of hardcoding, which is what keeps a project portable across chains.

## See also

- [DAO Launchpad](../deployment/dao-launchpad.md) — the workbench whose projects inherit this runner.
- [Plugin Template (Foundry)](./plugin-template.md) — the plugin-authoring scaffold, which inits and runs with this (`just init`).
- [Protocol Factory](../deployment/protocol-factory.md) — uses this runner to drive protocol deployments.
