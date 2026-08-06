---
title: hashHelpers
kind: function
source: src/framework/plugin/setup/PluginSetupProcessorHelpers.sol
summary: "Returns a hash of an array of helper addresses (contracts or EOAs)."
---

# hashHelpers

**Function** · [`src/framework/plugin/setup/PluginSetupProcessorHelpers.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol)

```solidity
function hashHelpers(address[] memory _helpers) pure returns (bytes32)
```

Returns a hash of an array of helper addresses (contracts or EOAs).

**security-contact:** sirt@aragon.org

| Parameter | Type | Description |
| --- | --- | --- |
| `_helpers` | `address[]` | The array of helper addresses (contracts or EOAs) to be hashed. |
