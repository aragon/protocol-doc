---
type: reference
title: Proxy deployment (UUPS & minimal proxies)
tags: [upgradeability, proxy]
source: osx/src/common/utils/deployment/ProxyLib.sol, osx/src/common/utils/deployment/ProxyFactory.sol
---

# Proxy deployment (UUPS & minimal proxies)

OSx deploys almost everything behind a proxy, so that a cheap-to-deploy front contract delegates to a shared logic contract, and (for UUPS) can be upgraded. `ProxyLib` is the small library that does both proxy flavors; it's what [plugin setups](../framework/plugin-setup.md) and factories call to instantiate contracts.

```solidity
using ProxyLib for address;

// UUPS proxy (ERC-1967): upgradeable in place.
address p = logic.deployUUPSProxy(abi.encodeCall(MyPlugin.initialize, (dao)));

// Minimal proxy (EIP-1167 clone): cheapest, not individually upgradeable.
address c = logic.deployMinimalProxy(abi.encodeCall(MyPlugin.initialize, (dao)));
```

The two map directly onto the [plugin types](../framework/plugin-types.md):

- **UUPS proxy** — an ERC-1967 proxy that runs `_initCalldata` against the logic during construction. Backs `PluginUUPSUpgradeable`. Upgradeable (the proxy can point at new logic later).
- **Minimal proxy (clone)** — an ~45-byte EIP-1167 proxy hard-wired to one logic address. Backs `PluginCloneable`. Cheapest to deploy; a clone's logic can never change (EIP-1167 clones have no constructor, so initialization is a regular call after cloning).

`ProxyFactory` is a thin contract wrapper around the same two functions that additionally emits a `ProxyCreated` event, useful when you want proxy deployments to be indexable off-chain. Setups can use either the library directly or the factory.

## Keep in mind

- **A clone has no constructor.** EIP-1167 minimal proxies can't run constructor logic, so initialization is a *separate call* after cloning. Pass `_initCalldata` so it happens atomically; an uninitialized proxy is a live-but-unconfigured contract.
- **Clones are not individually upgradeable.** A clone's logic address is fixed forever. "Upgrading" a cloneable plugin means publishing a new version and installing a fresh instance, not changing existing ones.
- **UUPS storage discipline.** New state in an upgradeable implementation must respect the reserved `__gap` (see [protocol version](./protocol-version.md)); shifting the layout corrupts every existing proxy.

## See also

- [Choosing a plugin base](../framework/plugin-types.md) — which proxy flavor each plugin type uses.
- [Plugin setup](../framework/plugin-setup.md) — the main caller of `ProxyLib`.
- [Protocol version](./protocol-version.md) — the storage-gap discipline upgradeable proxies rely on.
