---
type: concept
title: Transfer
tags: [automation, treasury]
source: capital-tree/src/actions/TransferAction.sol
---

# Transfer

Use Transfer for a fixed recipient, such as a fee destination. The `DAO.sol` contract sends this branch's full allocation to that address, completing the [leaf](../concepts.md#leaves-complete-the-flow). For a caller-selected recipient, use [Transfer to Beneficiary](transfer-to-beneficiary.md).

- **Check**: the recipient's balance rose by the amount. This catches tokens that return `false`
  instead of reverting. Tokens that deduct a transfer fee or change balances during the transfer can fail this exact-receipt check.
- **Recipient**: set at initialization, with no setter. Changing it means a new flow (`setFlow`).

## Configuration

Encode the recipient in the action declaration. This is a [recipe-building](../../../guides/compose-capital-tree.md#build-a-custom-recipe) excerpt; `node` is a `Setup.RecipeNode`:

```solidity
node.action.id = bytes32("TransferAction@1");
node.action.settings = abi.encode(recipient); // recipient is an address
```

The action builds the transfer using the node's allocated token and amount, and checks the recipient's balance afterward. See the [action lifecycle](./index.md#building-and-checking-a-node).

## See also

- [All actions](./index.md)
- [Execution](../execution.md) and [setup and permissions](../setup.md)
- [Contract source](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/actions/TransferAction.sol) and [settings metadata](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/metadata/components/TransferAction.json)
