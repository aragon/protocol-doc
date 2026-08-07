---
type: reference
title: _getPreparedSetupId
kind: function
source: osx/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol
summary: "Returns an ID for prepared setup obtained from hashing characterizing elements."
---

# _getPreparedSetupId

**Function** · [`src/framework/plugin/setup/PluginSetupProcessorHelpers.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol)

**Explained in:** [Install a plugin into a live DAO](../../guides/install-a-plugin.md), [The PluginSetupProcessor (PSP)](../../framework/plugin-setup-processor.md), [Update a plugin](../../guides/update-a-plugin.md)

```solidity
function _getPreparedSetupId(
    PluginSetupRef memory _pluginSetupRef,
    bytes32 _permissionsHash,
    bytes32 _helpersHash,
    bytes memory _data,
    PreparationType _preparationType
) pure returns (bytes32)
```

Returns an ID for prepared setup obtained from hashing characterizing elements.

**security-contact:** sirt@aragon.org

| Parameter | Type | Description |
| --- | --- | --- |
| `_pluginSetupRef` | `PluginSetupRef` | The reference of the plugin setup containing plugin setup repo and version tag. |
| `_permissionsHash` | `bytes32` | The hash of the permission operations requested by the setup. |
| `_helpersHash` | `bytes32` | The hash of the helper contract addresses. |
| `_data` | `bytes` | The bytes-encoded initialize data for the upgrade that is returned by `prepareUpdate`. |
| `_preparationType` | `PreparationType` | The type of preparation the plugin is currently undergoing. Without this, it is possible to call `applyUpdate` even after `applyInstallation` is called. |
