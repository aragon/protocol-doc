---
type: concept
title: Choosing a plugin base
tags: [plugin-framework, upgradeability]
source: osx/src/common/plugin/Plugin.sol, osx/src/common/plugin/PluginCloneable.sol, osx/src/common/plugin/PluginUUPSUpgradeable.sol
---

# Choosing a plugin base

Every plugin extends one of three base contracts. They give you the same developer-facing surface, a `dao()` reference, the [`auth`](../common/auth.md) modifier, ERC-165, and the [execution helpers](./plugins.md#how-a-plugin-makes-the-dao-act), so your plugin logic reads the same regardless. What differs is **how the plugin is deployed and whether it can be upgraded**, and that choice has real consequences for gas, trust, and how updates work. Pick deliberately; it's baked into the plugin (`pluginType()`) and determines which [setup base](./plugin-setup.md) you pair with.

## The three options

| | `Plugin` | `PluginCloneable` | `PluginUUPSUpgradeable` |
|---|---|---|---|
| `pluginType()` | `Constructable` | `Cloneable` | `UUPS` |
| Deploy mechanism | `new` (full bytecode) | [EIP-1167 minimal proxy](../common/proxies.md) | [ERC-1967 UUPS proxy](../common/proxies.md) |
| Upgradeable in place | No | No | **Yes** |
| Deploy gas per install | High | Very low | Low (proxy) + one-time logic deploy |
| Extra permission | none | none | `UPGRADE_PLUGIN_PERMISSION_ID` |
| Pair with setup base | [`PluginSetup`](./plugin-setup.md) | [`PluginSetup`](./plugin-setup.md) | [`PluginUpgradeableSetup`](./plugin-setup.md) |
| Stores DAO as | `immutable` (constructor) | initializer | initializer |

## How to choose

**`PluginUUPSUpgradeable`** — the default for most real plugins. It's a UUPS proxy, so you can ship bug fixes and compatible features to already-installed instances via the [update flow](./plugin-setup-processor.md) without redeploying and reinstalling. The cost: proxy call overhead, and an upgrade authority. Whoever holds `UPGRADE_PLUGIN_PERMISSION_ID` (normally the DAO itself, acting through the PSP) can replace the plugin's entire logic, a trust assumption your users are accepting.

**`PluginCloneable`** — cheapest to deploy, an [EIP-1167 minimal proxy](../common/proxies.md) pointing at a shared logic contract. Best when a plugin is installed many times and you *don't* want per-instance upgradeability. Existing clones can never change logic; to "upgrade" you publish a new version and users install a fresh instance. Great for simple, high-volume, trust-minimized plugins.

**`Plugin`** — non-upgradeable, deployed with `new` as full bytecode per install. Highest deploy gas, no proxy indirection at call time. Choose it when immutability is a *feature*, a governance-critical plugin whose code should be provably unchangeable is more trustworthy when it literally cannot be upgraded.

The rule of thumb: **UUPS unless you have a specific reason to want immutability (`Plugin`) or ultra-cheap disposable instances (`Cloneable`).**

## Initialization

The two proxy-based bases disable initializers in their constructor (so the shared logic contract can't be initialized directly, only through a proxy/clone's own storage) and expose an internal init you call from your `initialize`:

```solidity
// UUPS
function initialize(IDAO _dao, /* your params */) external initializer {
    __PluginUUPSUpgradeable_init(_dao);
    // ...your setup
}

// PluginCloneable, same shape, its own base init (you must call it; it isn't automatic)
function initialize(IDAO _dao, /* your params */) external initializer {
    __PluginCloneable_init(_dao);
    // ...your setup
}
```

`Plugin` (non-upgradeable) instead takes the DAO in its constructor. See [authorizing against a DAO](../common/auth.md) for what the DAO reference is used for.

> If you add storage to an upgradeable plugin, follow the [storage-layout discipline](../common/proxies.md#keep-in-mind) (reserved `__gap`, no reordering), the same rule every UUPS contract in OSx follows.

## See also

- [Plugins](./plugins.md) — the shared plugin model.
- [Plugin setup](./plugin-setup.md) — the matching setup base for each type.
- [Proxies](../common/proxies.md) — the clone vs UUPS deployment mechanics.
