# Framework

The **plugin framework**: everything about *being* a plugin, what a plugin is, how you build one, and how it's published, installed, updated, and uninstalled on a DAO, safely and repeatably. Source: [`osx`](https://github.com/aragon/osx) `src/framework`, plus the plugin base contracts from osx-commons.

The [core](/core/index.md) DAO is deliberately minimal and [common](/common/index.md) is cross-cutting primitives; the framework is what turns "a contract can operate a DAO" into "a specific plugin version is installed on this DAO with exactly the right permissions, and nobody was left with unchecked control." A plugin isn't part of the core, it's a contract that *uses this framework* to operate a DAO.

New to plugins? Read the model, then how you build one, then the publish/install machinery.

**What a plugin is, and building one**

- [The plugin model](/framework/plugins.md) — what a plugin *is* and how it acts on a DAO. **Start here.**
- [Choosing a plugin base](/framework/plugin-types.md) — Plugin vs Cloneable vs UUPS, and how to decide.
- [Plugin setup](/framework/plugin-setup.md) — the per-version contract that deploys a plugin and declares its permissions.
- [Plugin metadata](/framework/plugin-metadata.md) — the release/build JSON a version points to (incl. the install-params schema), and on-chain instance metadata.

**Publishing and installing**

- [PluginRepo](/framework/plugin-repo.md) — per-plugin versioning (`release.build`) and publishing.
- [The PluginSetupProcessor (PSP)](/framework/plugin-setup-processor.md) — the two-step prepare→apply install/update/uninstall engine.
- [DAOFactory](/framework/dao-factory.md) — one-transaction DAO creation and its permission choreography.
- [Registries and ENS names](/framework/registries.md) — the canonical DAO and plugin-repo registries and their ENS naming.
- [Member registry](/framework/member-registry.md) — permissionless member-identity ENS names.

## A note on the word "factory"

OSx reuses "factory" for several distinct things; keep them apart by *what they produce*:

- **[Plugin setup](/framework/plugin-setup.md)** — assembles **one plugin installation** (deploys the plugin + declares its permissions). A "factory" only in the sense of producing a single install.
- **[DAOFactory](/framework/dao-factory.md)** — deploys **one DAO** (optionally with plugins) in a transaction.
- **PluginRepoFactory** (see [PluginRepo](/framework/plugin-repo.md)) — deploys **one plugin repo**.
- **[Protocol Factory](/deployment/protocol-factory.md)** — deploys **the whole OSx stack** onto a new chain.
- The **[DAO Launchpad](/deployment/dao-launchpad.md)**'s one-shot factory — a project-specific contract that deploys **one fully-configured DAO** atomically.

Rule of thumb: *setup* = one install; *DAOFactory* / *launchpad* = one DAO; *PluginRepoFactory* = one repo; *Protocol Factory* = the whole protocol.

## Builds on

Plugins reuse the cross-cutting primitives in [common](/common/index.md) (conditions, proposals, membership, auth, proxies) and act on the [DAO](/core/dao.md) and its [permission system](/core/permissions.md) from the core.
