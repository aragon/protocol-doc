---
type: reference
title: IResolver
kind: interface
source: osx/src/framework/utils/ens/IResolver.sol
summary: "Minimal resolver interface for MemberRegistry."
---

# IResolver

**Interface** · [`src/framework/utils/ens/IResolver.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/framework/utils/ens/IResolver.sol)

Minimal resolver interface for MemberRegistry.
Covers what the registry calls during subnode lifecycle and record migration.
Members call the full PublicResolver directly for additional record management.

**security-contact:** sirt@aragon.org

## Functions

### approve

```solidity
function approve(bytes32 node, address delegate, bool approved) external
```

Selector: `0xa4b91a01`

Approve a delegate to manage resolver records for a specific node.

> **Dev:** Per-node delegation. Available in ens-contracts >= v0.0.19.

### clearRecords

```solidity
function clearRecords(bytes32 node) external
```

Selector: `0x3603d758`

Invalidate all resolver records for a node by incrementing the version counter.

### isApprovedFor

```solidity
function isApprovedFor(
    address owner,
    bytes32 node,
    address delegate
) external view returns (bool)
```

Selector: `0xa9784b3e`

Check if a delegate is approved for a node by a given owner.

### setAddr

```solidity
function setAddr(bytes32 node, address addr) external
```

Selector: `0xd5fa2b00`

Set the address record for a node.

### setContenthash

```solidity
function setContenthash(bytes32 node, bytes hash) external
```

Selector: `0x304e6ade`

Set the contenthash for a node.

### setText

```solidity
function setText(bytes32 node, string key, string value) external
```

Selector: `0x10f13a8c`

Set a text record for a node.
