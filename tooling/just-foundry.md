---
type: concept
title: Foundry Task Runner (just-foundry)
source: just-foundry/README.md, just-foundry/justfile, just-foundry/scripts/sync-addresses.sh
---

# Foundry Task Runner (just-foundry)

A **shared command runner for Foundry repos**: one command per action. Each repo adds it as a dependency (a submodule imported from the repo's own `justfile`) and gets the same commands to build, test, deploy and verify with Foundry, switch between networks and environments, and run maintenance tasks.

It absorbs each network's quirks (RPC, chain id, verifier and its flags, EVM-version overrides, zkSync's separate toolchain) and supplies the Aragon OSx addresses for that chain, so you select a network by name instead of managing those values by hand. Multi-step flows (simulate → broadcast → verify → log) become single commands. It's the shared tooling the Aragon repos build on: the [plugin template](./plugin-template.md) and the governance plugin repos run on it, the [DAO Launchpad](../deployment/dao-launchpad.md)'s projects inherit it, and the [Protocol Factory](../deployment/protocol-factory.md) uses it.

## Why it exists

Every repo that deploys something needs to run tests, simulate, broadcast, verify on the right explorer, select the right network, and load secrets without committing them. Maintaining separate implementations lets them drift apart, which can cause costly deployment mistakes. just-foundry centralizes this work so each project imports a shared workflow, as [launch projects do](../deployment/dao-launchpad.md#one-workbench-many-projects).

Even a single project benefits from the shared configuration and commands:

- **Network-specific settings are configured once and reused.** These include the verifier and its flags, EVM-version overrides (Chiliz wants `shanghai`), zkSync's separate toolchain, and RPC requirements. They live in the shared network config, so `just switch <network>` selects them for each project and deployment.
- **Named recipes replace repetitive Foundry commands.** The flows (simulate → broadcast → verify → log) require long `forge` invocations whose flags can be mistyped. just-foundry wraps them in commands for each task: `just predeploy`, `just deploy`, `just verify`, and more, listed by `just help`; debug helpers such as `just refund` and `just nonce` are hidden from that list but run the same way. You can look up a task's command rather than remember the full invocation.

A deployment project's configuration has three parts. just-foundry supplies the public network parameters; you provide the project-specific values and secrets.

- **Public network parameters** (RPC, chain id, verifier, and the **deployed OSx addresses**: values that change per chain and are *not* secret) — **supplied by just-foundry** for every supported network, so you don't need to assemble or hardcode them. Their public nature lets projects share the configuration. The addresses are synced from the canonical [artifacts-hub](./artifacts-hub.md) address book.
- **Project-specific parameters** (how many multisig signers, the min-approvals, metadata URIs, and other values your deployment needs) — yours to set for each deployment.
- **Secrets** (deployer key, API keys) — yours to provide. just-foundry resolves them through the `vars` encrypted store or a plain `.env`.

With the project parameters and secrets set, use `just switch <network>` and `just deploy` to deploy with that network's configuration.

## Wiring it into a project

The project's root `justfile` imports just-foundry and defines its own `init` recipe:

```just
import? 'lib/just-foundry/justfile'

default:
    @just help 2>/dev/null || echo "Run 'just init <network>' first"

# Fetch dependencies and select the active network
init network="mainnet":
    git submodule update --init
    just setup
    just switch {{ network }}
```

On a fresh clone `lib/just-foundry` is still empty, so its recipes don't exist yet. The optional `import?` lets `just` start anyway, and the project's `init` fetches the submodules before calling into just-foundry: `just setup` installs Foundry if it's missing, and `just switch` selects the network. A fresh clone then needs one command, such as `just init sepolia`. Re-running it resets every submodule to the commit the project pins. Each repo adapts its `init` (several also copy `.env.example` to `.env`), so check the repo's `justfile` for what its version does.

After the import, a project adds its own recipes on top of the shared ones. `just run <script>` broadcasts a script with verification and a log under `logs/`, `just dry-run <script>` simulates it, and a recipe that needs custom shell logic runs `source lib/just-foundry/lib.sh && env_load` to load the active network's environment first. Redefining a recipe with the same name replaces the imported one, and setting `DEPLOY_SCRIPT` picks the script that `just deploy` and `just predeploy` run.

## What it gives a project

- **Network switching** across the many supported chains, each config carrying the RPC, chain id, verifier choice, and canonical **Aragon OSx addresses** for that chain. Projects reference the network instead of hardcoding addresses. `just networks` lists the available networks with their chain ids and marks the active one; `just switch <network> override` copies a network's config to `.env.<network>` at the project root for local edits.
- **Per-network flag resolution** and an `env` view that shows the resolved environment with the *source* of each value, so you can confirm what a deploy will actually use before broadcasting.
- **Secrets management**, kept out of the repo. Optionally integrates with [`vars`](https://github.com/vars-cli/vars): an **encrypted env-var manager** with a central encrypted store. At run time, it reads what a project declares it needs and **injects** the resolved values into the environment. Foundry receives ordinary env vars, and one vault can serve every project. A plain `.env` file is the fallback requiring no extra installation; recipes work the same way with either source.
- **Deploy / test / verify helpers** with logging, available to a project's `justfile` through `import`. When an explorer's API rejects the standard-JSON verification input (zkSync Era's explorer refuses payloads carrying remappings), `just flatten` writes each concrete `src/` contract as a single file under `flat/`, plus its ABI-encoded constructor arguments when `broadcast/` holds a matching deployment on the active network, ready for the explorer's manual verification form. Run `forge build` first.

## Keep in mind

- **just-foundry runs other projects' deployments.** It doesn't deploy a protocol of its own.
- **The network config is your project's single source of Aragon addresses.** Because each chain's addresses live in the shared config, projects switch networks instead of hardcoding, which is what keeps a project portable across chains.
- **The network config follows [artifacts-hub](./artifacts-hub.md).** Maintainers run `just sync-addresses` against a local artifacts-hub checkout. It adds new plugin-repo addresses on its own, but never overwrites an existing address that disagrees with the hub (unless `--force` is passed): it reports the conflict and exits non-zero, so the same command doubles as a drift check in CI.

## See also

- [Deployed addresses and ABIs (artifacts-hub)](./artifacts-hub.md): the address book the network configs are synced from, and the ABIs to pair with those addresses.
- [DAO Launchpad](../deployment/dao-launchpad.md) — the workbench whose projects inherit this runner.
- [Plugin Template (Foundry)](./plugin-template.md): the plugin-authoring scaffold, which runs on this.
- [Protocol Factory](../deployment/protocol-factory.md) — uses this runner to drive protocol deployments.
