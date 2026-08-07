---
type: reference
title: _getAppliedSetupId
kind: function
source: osx/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol
summary: "Returns an identifier for applied installations."
---

# _getAppliedSetupId

**Function** · [`src/framework/plugin/setup/PluginSetupProcessorHelpers.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol)

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
| `_pluginSetupRef` | `PluginSetupRef` | The reference of the plugin setup containing plugin setup repo and version tag. |
| `_helpersHash` | `bytes32` | The hash of the helper contract addresses. |
