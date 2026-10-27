---
type: reference
title: _getAppliedSetupId
kind: function
source: osx/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol
summary: "Returns an identifier for applied installations."
---

# _getAppliedSetupId

**Function** · [`src/framework/plugin/setup/PluginSetupProcessorHelpers.sol`](https://github.com/aragon/osx/blob/2c60f1252558d75fe99c414ccd2b1aedbde88f12/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol)

**Explained in:** [Install a plugin into a live DAO](../../guides/install-a-plugin.md), [The PluginSetupProcessor (PSP)](../../framework/plugin-setup-processor.md), [Update a plugin](../../guides/update-a-plugin.md)

```solidity
function _getAppliedSetupId(
    PluginSetupRef memory _pluginSetupRef,
    bytes32 _helpersHash
) pure returns (bytes32)
```

Returns an identifier for applied installations.

**security-contact:** sirt@aragon.org

| Parameter | Type | Description |
| --- | --- | --- |
| `_pluginSetupRef` | [`PluginSetupRef`](./PluginSetupRef.md) | The reference of the plugin setup containing plugin setup repo and version tag. |
| `_helpersHash` | `bytes32` | The hash of the helper contract addresses. |
