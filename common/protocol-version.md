---
type: reference
title: Protocol version
tags: [upgradeability]
source: osx/src/common/utils/versioning/ProtocolVersion.sol, osx/src/common/utils/versioning/VersionComparisonLib.sol, osx/src/common/utils/versioning/IProtocolVersion.sol
---

# Protocol version

There are **two different "versions"** in OSx, and conflating them causes confusion:

- **Protocol version** — which version of the OSx *protocol* a contract was built against (e.g. `[1, 4, 0]`). Reported by `protocolVersion()`, defined here.
- **Plugin release/build** — which version of a *specific plugin* an install is, tracked by [PluginRepo](/framework/plugin-repo.md) as `release.build`. Unrelated to the protocol version.

## `protocolVersion()`

Contracts across the protocol (every plugin, every plugin setup, the DAO, registries) mix in `ProtocolVersion` and expose:

```solidity
function protocolVersion() external view returns (uint8[3] memory); // e.g. [1, 4, 0]
```

This makes the protocol version discoverable on-chain for tooling and compatibility checks. `ProtocolVersion` is intentionally **stateless** (`pure`, zero storage): the source even warns not to add storage variables to it, so it can be safely mixed into any inheritance chain, upgradeable or not, without disturbing storage layout or needing its own `__gap`.

`VersionComparisonLib` provides the obvious lexicographic comparisons (`eq`, `lt`, `gte`, …) over the `uint8[3]` triple for code that gates on protocol version.

## Why versioning discipline matters

The DAO's [`initializeFrom`](/core/dao.md#upgrades-across-versions) uses the protocol version to decide which storage migrations to run on upgrade, and refuses to cross a major version. More broadly, every upgradeable contract in OSx follows the same storage-safety discipline (reserved `__gap` slots, renamed-not-removed fields) so that a new implementation never corrupts an existing proxy's storage. See [proxies](/common/proxies.md) and [choosing a plugin base](/framework/plugin-types.md).

## See also

- [PluginRepo](/framework/plugin-repo.md) — the *other* versioning axis (release/build).
- [The DAO contract](/core/dao.md) — uses protocol version for upgrade migrations.
