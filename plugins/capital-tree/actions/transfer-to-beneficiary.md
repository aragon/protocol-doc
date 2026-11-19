---
type: concept
title: Transfer to Beneficiary
tags: [automation, treasury]
source: capital-tree/src/actions/TransferToBeneficiaryAction.sol
---

# Transfer to Beneficiary

A [leaf action](../concepts.md#leaves-complete-the-flow) that pays a **beneficiary**, the recipient selected by the [caller through node data](../concepts.md#a-trigger-runs-the-flow). It sends the whole allocation and declares zero output.

- **Check**: the beneficiary's balance rose by the amount. This catches tokens that return `false`
  instead of reverting. As with [Transfer](./transfer.md), tokens that change the amount received can fail this exact-receipt check.
- **Who picks the address**: the caller. Use it only where the caller may direct the funds: under a
  [`MerkleClaimBudget`](../budgets/merkle-claim.md) (only the claiming account can trigger) or on a flow
  whose trigger is restricted. On a flow anyone can trigger with a stream or balance budget, anyone
  could pay themselves.

## Trigger data

The recipient is encoded at the action's node index in the trigger data. Here `plugin` is the installed CapitalTreePlugin, `nodeCount` is its node-array length, and `budgetData` is the selected budget's input:

```solidity
bytes[] memory nodeData = new bytes[](nodeCount);
nodeData[beneficiaryNodeIndex] = abi.encode(beneficiary);
plugin.trigger(budgetData, nodeData);
```

Here `beneficiary` is a nonzero address and the array has one entry per node. Call from the entitled account for a Merkle flow; changing the recipient does not change which account must prove entitlement. The action rejects missing or malformed recipient data.

## See also

- [All actions](./index.md)
- [Execution](../execution.md) and [setup and permissions](../setup.md)
- [Contract source](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/actions/TransferToBeneficiaryAction.sol) and [settings metadata](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/metadata/components/TransferToBeneficiaryAction.json)
