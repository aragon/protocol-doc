---
type: concept
title: Weight Splitter
tags: [automation, treasury]
source: capital-tree/src/splitters/WeightSplitter.sol
---

# Weight Splitter

Use fixed percentages to divide a node's output, such as 20% retained and 80% donated. **Weights** express these shares in millionths: 200,000 means 20%. Assign one positive weight per child, in child order, totaling 1,000,000.

## Configuration

The settings are an ABI-encoded `uint32[]`, in child order. For a [recipe node](../../../guides/compose-capital-tree.md#build-a-custom-recipe) with retention first and donation second, where `node` is a `Setup.RecipeNode`:

```solidity
uint32[] memory weights = new uint32[](2);
weights[0] = 200_000; // 20% to the first child
weights[1] = 800_000; // 80% to the second child
node.splitter.id = bytes32("WeightSplitter@1");
node.splitter.settings = abi.encode(weights);
```

## Small amounts and rounding

The largest share receives any rounding remainder; the first wins a tie. If a small output gives a child zero, the run reverts unless that child has [`skipWhenEmpty`](../execution.md#inputs-and-outputs). Choose amounts that keep required branches funded.

## Adjust the split

A [manager](../setup.md#roles-and-permissions) with `SET_SETTINGS_PERMISSION_ID` can call `setWeights(weights)`. The number of weights must stay the same; adding or removing children requires a flow update through `setFlow`. `childCount()` reports that number for the [splitter interface](index.md#the-splitter-interface).

## See also

- [All splitters](./index.md)
- [Execution](../execution.md) and [setup and permissions](../setup.md)
- [Contract source](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/splitters/WeightSplitter.sol) and [settings metadata](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/metadata/components/WeightSplitter.json)
