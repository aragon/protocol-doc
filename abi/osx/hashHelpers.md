---
type: reference
title: hashHelpers
kind: function
source: osx/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol
summary: "Returns a hash of an array of helper addresses (contracts or EOAs)."
---

# hashHelpers

**Function** · [`src/framework/plugin/setup/PluginSetupProcessorHelpers.sol`](https://github.com/aragon/osx/blob/2c60f1252558d75fe99c414ccd2b1aedbde88f12/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol)

**Explained in:** [Install a plugin into a live DAO](../../guides/install-a-plugin.md), [The PluginSetupProcessor (PSP)](../../framework/plugin-setup-processor.md), [Update a plugin](../../guides/update-a-plugin.md)

```solidity
function hashHelpers(address[] memory _helpers) pure returns (bytes32)
```

Returns a hash of an array of helper addresses (contracts or EOAs).

**security-contact:** sirt@aragon.org

| Parameter | Type | Description |
| --- | --- | --- |
| `_helpers` | `address[]` | The array of helper addresses (contracts or EOAs) to be hashed. |
