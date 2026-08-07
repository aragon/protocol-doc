---
type: reference
title: LockManagerSettings
kind: struct
source: lock-to-vote-plugin/src/interfaces/ILockManager.sol
summary: "The struct containing the LockManager helper settings."
---

# LockManagerSettings

**Struct** · [`src/interfaces/ILockManager.sol`](https://github.com/aragon/lock-to-vote-plugin/blob/5a513e3d9f1aad35d8926de87c408720e8d20a8d/src/interfaces/ILockManager.sol)

**Explained in:** [The LockManager](../../plugins/lock-to-vote-plugin/lock-manager.md)

```solidity
struct LockManagerSettings {
    PluginMode pluginMode;
}
```

The struct containing the LockManager helper settings. They are immutable after deployed.

| Field | Type | Description |
| --- | --- | --- |
| `pluginMode` | [`PluginMode`](./PluginMode.md) |  |
