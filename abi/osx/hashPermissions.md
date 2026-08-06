---
title: hashPermissions
kind: function
source: src/framework/plugin/setup/PluginSetupProcessorHelpers.sol
summary: "Returns a hash of an array of multi-targeted permission operations."
---

# hashPermissions

**Function** · [`src/framework/plugin/setup/PluginSetupProcessorHelpers.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol)

```solidity
function hashPermissions(
    PermissionLib.MultiTargetPermission[] memory _permissions
) pure returns (bytes32)
```

Returns a hash of an array of multi-targeted permission operations.

**security-contact:** sirt@aragon.org

| Parameter | Type | Description |
| --- | --- | --- |
| `_permissions` | `PermissionLib.MultiTargetPermission[]` | The array of of multi-targeted permission operations. |
