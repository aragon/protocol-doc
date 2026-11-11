---
type: reference
title: PreparationType
kind: enum
source: osx/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol
summary: ""
---

# PreparationType

**Enum** · [`src/framework/plugin/setup/PluginSetupProcessorHelpers.sol`](https://github.com/aragon/osx/blob/2c60f1252558d75fe99c414ccd2b1aedbde88f12/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol)

**Explained in:** [Install a plugin into a live DAO](../../guides/install-a-plugin.md), [The PluginSetupProcessor (PSP)](../../framework/plugin-setup-processor.md), [Update a plugin](../../guides/update-a-plugin.md)

```solidity
enum PreparationType {
    None,
    Installation,
    Update,
    Uninstallation
}
```

| Option | Value |
| --- | --- |
| `None` | `0` |
| `Installation` | `1` |
| `Update` | `2` |
| `Uninstallation` | `3` |
