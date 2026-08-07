---
type: reference
title: _getPluginInstallationId
kind: function
source: osx/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol
summary: "Returns an ID for plugin installation by hashing the DAO and plugin address."
---

# _getPluginInstallationId

**Function** · [`src/framework/plugin/setup/PluginSetupProcessorHelpers.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol)

**Explained in:** [Install a plugin into a live DAO](../../guides/install-a-plugin.md), [The PluginSetupProcessor (PSP)](../../framework/plugin-setup-processor.md), [Update a plugin](../../guides/update-a-plugin.md)

```solidity
function _getPluginInstallationId(address _dao, address _plugin) pure returns (bytes32)
```

Returns an ID for plugin installation by hashing the DAO and plugin address.

**security-contact:** sirt@aragon.org

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `address` | The address of the DAO conducting the setup. |
| `_plugin` | `address` | The plugin address. |
