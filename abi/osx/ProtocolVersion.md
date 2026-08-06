---
title: ProtocolVersion
kind: abstract contract
source: src/common/utils/versioning/ProtocolVersion.sol
summary: "An abstract, stateless, non-upgradeable contract providing the current Aragon OSx protocol version number."
---

# ProtocolVersion

**Abstract contract** · [`src/common/utils/versioning/ProtocolVersion.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/utils/versioning/ProtocolVersion.sol)

**Author:** Aragon X - 2023

**Inherits:** [`IProtocolVersion`](./IProtocolVersion.md)

An abstract, stateless, non-upgradeable contract providing the current Aragon OSx protocol version number.

> **Dev:** Do not add any new variables to this contract that would shift down storage in the inheritance chain.

**security-contact:** sirt@aragon.org

## Functions

### protocolVersion

```solidity
function protocolVersion() external pure returns (uint8[3])
```

Selector: `0x2ae9c600`

Returns the semantic Aragon OSx protocol version number that the implementing contract is associated with.

> **Dev:** This version number is not to be confused with the `release` and `build` numbers found in the `Version.Tag` struct inside the `PluginRepo` contract being used to version plugin setup and associated plugin implementation contracts.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `uint8[3]` | Returns the semantic Aragon OSx protocol version number. |
