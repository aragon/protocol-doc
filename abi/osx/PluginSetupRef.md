---
type: reference
title: PluginSetupRef
kind: struct
source: osx/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol
summary: ""
---

# PluginSetupRef

**Struct** · [`src/framework/plugin/setup/PluginSetupProcessorHelpers.sol`](https://github.com/aragon/osx/blob/2c60f1252558d75fe99c414ccd2b1aedbde88f12/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol)

**Explained in:** [Install a plugin into a live DAO](../../guides/install-a-plugin.md), [The PluginSetupProcessor (PSP)](../../framework/plugin-setup-processor.md), [Update a plugin](../../guides/update-a-plugin.md)

```solidity
struct PluginSetupRef {
    PluginRepo.Tag versionTag;
    PluginRepo pluginSetupRepo;
}
```

| Field | Type | Description |
| --- | --- | --- |
| `versionTag` | `PluginRepo.Tag` |  |
| `pluginSetupRepo` | [`PluginRepo`](./PluginRepo.md) |  |
