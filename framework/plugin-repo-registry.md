---
type: concept
title: PluginRepo Registry
tags: [plugin-framework, ens]
source: osx/src/framework/plugin/repo/PluginRepoRegistry.sol, osx/src/framework/utils/InterfaceBasedRegistry.sol
---

# PluginRepo Registry

The `PluginRepoRegistry` is the canonical on-chain list of every published [plugin repo](./plugin-repo.md), and it's **load-bearing at install time**: the [PSP](./plugin-setup-processor.md) checks `entries(repo)` before it will install from a repo, so **a plugin is only installable if its repo is registered here.** Registration is the protocol's trust boundary for plugins.

## What it holds and enables

The [PluginRepoFactory](./plugin-repo.md) calls `registerPluginRepo(subdomain, repo)` when a repo is created, which:

- records the repo so `entries(repo)` reads true, exactly what the PSP checks,
- emits `PluginRepoRegistered(subdomain, repo)` for explorers and indexers, and
- optionally assigns a `<name>.plugin.dao.eth` ENS subdomain.

Registration is **permissioned** (`REGISTER_PLUGIN_REPO_PERMISSION_ID`), held only by the PluginRepoFactory, so nothing but the official factory can make a repo installable. Like the [DAO Registry](./dao-registry.md), it's built on the shared [`InterfaceBasedRegistry`](./registries.md#one-shared-pattern-interfacebasedregistry) pattern: it admits only `IPluginRepo` contracts, and none twice.

## Keep in mind

- **Registered = trusted = installable.** The PSP's `entries(repo)` gate is what counts: an unregistered repo can't be installed from, no matter how valid its contracts are.
- **The subdomain requirement is version-dependent.** Through v1.3.0 a name was required (an empty one reverts `EmptyPluginRepoSubdomain`); v1.4.0 made it optional. See the [subdomain rules](./registries.md#ens-subdomains).

## See also

- [Registries and ENS names](./registries.md) — the shared registry pattern and ENS naming (overview).
- [PluginRepo](./plugin-repo.md) — what each entry is (per-plugin versioning).
- [The PluginSetupProcessor](./plugin-setup-processor.md) — gates installs on registration here.
- [DAO Registry](./dao-registry.md) — the sibling registry, for DAOs.
