---
type: concept
title: DAO Registry
tags: [plugin-framework, ens]
source: osx/src/framework/dao/DAORegistry.sol, osx/src/framework/utils/InterfaceBasedRegistry.sol
---

# DAO Registry

The `DAORegistry` is the canonical on-chain list of every DAO the framework has created, the answer to "is this address a genuine OSx DAO, and what is it called?"

## What it holds and enables

The [DAOFactory](./dao-factory.md) calls `register(dao, creator, subdomain)` as it creates a DAO, which:

- records the DAO so `entries(dao)` reads true, the on-chain membership check other contracts and tools rely on,
- emits a `DAORegistered(dao, creator, subdomain)` event, the signal explorers and indexers use to discover and list DAOs, and
- optionally assigns the DAO a `<name>.dao.eth` ENS subdomain.

Registration is **permissioned** (`REGISTER_DAO_PERMISSION_ID`), and that permission is held only by the DAOFactory, so nothing can slip an arbitrary contract into the canonical list by self-registering. It's one of the two component registries built on the shared [`InterfaceBasedRegistry`](./registries.md#one-shared-pattern-interfacebasedregistry) pattern: it admits only `IDAO` contracts, and none twice.

## Keep in mind

- **The DAO's ENS name is optional.** `register` skips the ENS step when the subdomain is empty; the DAO is still registered. See the [subdomain rules](./registries.md#ens-subdomains).
- **Only the factory writes here.** There is no self-registration path, being in the registry means the official DAOFactory created the DAO.

## See also

- [Registries and ENS names](./registries.md) — the shared registry pattern and ENS naming (overview).
- [DAOFactory](./dao-factory.md) — creates DAOs and holds the register permission.
- [PluginRepo Registry](./plugin-repo-registry.md) — the sibling registry, for plugin repos.
