---
title: IProtocolVersion
kind: interface
source: src/common/utils/versioning/IProtocolVersion.sol
summary: "An interface defining the semantic Aragon OSx protocol version number."
---

# IProtocolVersion

**Interface** · [`src/common/utils/versioning/IProtocolVersion.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/utils/versioning/IProtocolVersion.sol)

**Author:** Aragon X - 2022-2023

An interface defining the semantic Aragon OSx protocol version number.

**security-contact:** sirt@aragon.org

## Functions

### protocolVersion

```solidity
function protocolVersion() external view returns (uint8[3] _version)
```

Selector: `0x2ae9c600`

Returns the semantic Aragon OSx protocol version number that the implementing contract is associated with.

> **Dev:** This version number is not to be confused with the `release` and `build` numbers found in the `Version.Tag` struct inside the `PluginRepo` contract being used to version plugin setup and associated plugin implementation contracts.

| Returns | Type | Description |
| --- | --- | --- |
| `_version` | `uint8[3]` | Returns the semantic Aragon OSx protocol version number. |
