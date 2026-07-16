---
type: concept
title: Registries and ENS names
tags: [plugin-framework, ens]
source: osx/src/framework/dao/DAORegistry.sol, osx/src/framework/plugin/repo/PluginRepoRegistry.sol, osx/src/framework/utils/InterfaceBasedRegistry.sol, osx/src/framework/utils/RegistryUtils.sol, osx/src/framework/utils/ens/ENSSubdomainRegistrar.sol
---

# Registries and ENS names

For the ecosystem to enumerate and trust DAOs and plugins, there has to be a canonical on-chain list of each. Two registries provide exactly that, and give every entry a human-readable ENS name:

- **[DAO Registry](./dao-registry.md)** (`DAORegistry`) — the canonical list of every DAO the framework creates. The [DAOFactory](./dao-factory.md) registers each one (optionally as `<name>.dao.eth`); it's the "is this a genuine framework DAO?" index.
- **[PluginRepo Registry](./plugin-repo-registry.md)** (`PluginRepoRegistry`) — the canonical list of every published [plugin repo](./plugin-repo.md). The [PSP](./plugin-setup-processor.md) will only install from a repo registered here, so **registration is the trust boundary.**

## One shared pattern: `InterfaceBasedRegistry`

Both registries extend `InterfaceBasedRegistry`, an abstract base that enforces one rule: **only contracts that advertise the right ERC-165 interface can register**, and none can register twice. `DAORegistry` requires registrants to be `IDAO`; `PluginRepoRegistry` requires `IPluginRepo`. This is what stops arbitrary contracts from masquerading as DAOs or repos in the canonical lists.

The base is a UUPS proxy governed by a **[Management DAO](../deployment/protocol-factory.md)** (via [`DaoAuthorizable`](../common/auth.md)): registration itself is permissioned (`REGISTER_DAO_PERMISSION_ID` / `REGISTER_PLUGIN_REPO_PERMISSION_ID`), held by the [DAOFactory](./dao-factory.md) and [PluginRepoFactory](./plugin-repo.md) respectively, so only the official factories can add entries.

## ENS subdomains

Each registration can claim a subdomain under a protocol-owned ENS parent (e.g. `myorg.dao.eth`, `myplugin.plugin.dao.eth`). The `ENSSubdomainRegistrar` mints these:

- It **keeps ownership of every subnode itself** and only sets the resolver's address record to point at the DAO or repo. So names can't be transferred away from the protocol, they always resolve to the registered contract.
- Subdomain characters are validated (`a-z`, `0-9`, `-`) by `RegistryUtils.isSubdomainValid`.
- It requires off-chain setup: the registrar must be made owner/operator of the ENS parent node before it can mint children.

Whether a name is **required** depends on the registry and the release, so this bites in practice:

- **DAOs, always optional.** `DAORegistry` registers the DAO whether or not you pass a subdomain; an empty one just skips the ENS step.
- **Plugin repos, version-dependent.** Through **v1.3.0** a subdomain was **required**, an empty one reverts `EmptyPluginRepoSubdomain`. **v1.4.0 relaxed it to optional.** So on older deployments a name is mandatory; treat providing one as the norm regardless. (`PluginRepoFactory` still carries a stale `@dev` comment claiming empty reverts, a leftover from the v1.3.0 rule.)
- **Duplicates always revert** (`AlreadyRegistered`): a subdomain can be claimed once, and a contract can't register twice.

## A third registry, deliberately separate

A [`MemberRegistry`](./member-registry.md) also mints ENS names (Aragon's binds to `aragon.eth`, so `alice.aragon.eth`), so it's tempting to file all three together. It's kept apart on purpose, because it isn't the same *kind* of thing:

- The **DAO and plugin registries** register **protocol components** (contracts), share the `InterfaceBasedRegistry` base, and are **permissioned**, only the official factories may add entries, which is exactly what makes them a trust boundary.
- The **member registry** gives **members an optional, free ENS handle** (a fallback for those who don't want to buy one), is **permissionless** (anyone self-registers), and is built on a different base entirely (no `InterfaceBasedRegistry`). It shares only the ENS subnode-custody pattern.

So the grouping is two near-identical component registries plus one identity registry that merely rhymes with them, which is why this page covers the first two and the [member registry](./member-registry.md) stands alone.

## See also

- [DAO Registry](./dao-registry.md) and [PluginRepo Registry](./plugin-repo-registry.md) — the two component registries, each in detail.
- [PluginRepo](./plugin-repo.md) — what `PluginRepoRegistry` indexes.
- [DAOFactory](./dao-factory.md) — holds the register permission and creates the DAOs indexed here.
- [PluginSetupProcessor](./plugin-setup-processor.md) — gates installs on repo registration.
- [Member registry](./member-registry.md) — a separate, member-identity ENS registry.
