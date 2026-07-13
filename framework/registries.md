---
type: concept
title: Registries and ENS names
tags: [plugin-framework, ens]
source: osx/src/framework/dao/DAORegistry.sol, osx/src/framework/plugin/repo/PluginRepoRegistry.sol, osx/src/framework/utils/InterfaceBasedRegistry.sol, osx/src/framework/utils/RegistryUtils.sol, osx/src/framework/utils/ens/ENSSubdomainRegistrar.sol
---

# Registries and ENS names

For the ecosystem to enumerate and trust DAOs and plugins, there has to be a canonical on-chain list of them. Two registries provide it, and they give each entry a human-readable ENS name:

- **`DAORegistry`** — every DAO created through the framework.
- **`PluginRepoRegistry`** — every published [plugin repo](/framework/plugin-repo.md).

They matter beyond bookkeeping: the [PSP](/framework/plugin-setup-processor.md) checks the `PluginRepoRegistry` (`entries(repo)`) before trusting a repo, so **a plugin is only installable if its repo is registered.** Registration is the trust boundary.

## One shared pattern: `InterfaceBasedRegistry`

Both registries extend `InterfaceBasedRegistry`, an abstract base that enforces one rule: **only contracts that advertise the right ERC-165 interface can register**, and none can register twice. `DAORegistry` requires registrants to be `IDAO`; `PluginRepoRegistry` requires `IPluginRepo`. This is what stops arbitrary contracts from masquerading as DAOs or repos in the canonical lists.

The base is a UUPS proxy governed by a **[Management DAO](/deployment/protocol-factory.md)** (via [`DaoAuthorizable`](/common/auth.md)): registration itself is permissioned (`REGISTER_DAO_PERMISSION_ID` / `REGISTER_PLUGIN_REPO_PERMISSION_ID`), held by the [DAOFactory](/framework/dao-factory.md) and [PluginRepoFactory](/framework/plugin-repo.md) respectively, so only the official factories can add entries.

## ENS subdomains

Each registration can claim a subdomain under a protocol-owned ENS parent (e.g. `myorg.dao.eth`, `myplugin.plugin.dao.eth`). The `ENSSubdomainRegistrar` mints these:

- It **keeps ownership of every subnode itself** and only sets the resolver's address record to point at the DAO or repo. So names can't be transferred away from the protocol, they always resolve to the registered contract.
- Subdomain characters are validated (`a-z`, `0-9`, `-`) by `RegistryUtils.isSubdomainValid`.
- It requires off-chain setup: the registrar must be made owner/operator of the ENS parent node before it can mint children.

Registering a DAO or repo without a subdomain is allowed by the registries, but the factories always pass one.

## See also

- [PluginRepo](/framework/plugin-repo.md) — what `PluginRepoRegistry` indexes.
- [DAOFactory](/framework/dao-factory.md) — holds the register permission and creates the DAOs indexed here.
- [PluginSetupProcessor](/framework/plugin-setup-processor.md) — gates installs on repo registration.
- [Member registry](/framework/member-registry.md) — a separate, member-identity ENS registry.
