---
type: concept
title: Balance budget
tags: [automation, treasury]
source: capital-tree/src/budgets/BalanceBudget.sol
---

# Balance budget

Use a Balance budget when a flow should process the `DAO.sol` contract's entire balance of a token, including existing holdings. The [root](../concepts.md#a-budget-supplies-the-flow) receives all of it each run. Choose a [Stream budget](stream.md) instead to limit how much becomes available over time.

## Configuration

The component takes one setting: the ERC20 token whose balance supplies the flow. In a [recipe builder](../../../guides/compose-capital-tree.md), `recipe` is a `Setup.InstallParams`:

```solidity
recipe.budget.id = bytes32("BalanceBudget@1");
recipe.budget.settings = abi.encode(token); // token is an IERC20
```

`available(caller, data)` reads `token.balanceOf(address(dao()))`; caller and data are ignored. `commitActions` returns an empty array. See the [budget interface](./index.md#the-budget-interface).

## See also

- [All budgets](./index.md)
- [Execution](../execution.md) and [setup and permissions](../setup.md)
- [Contract source](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/budgets/BalanceBudget.sol) and [settings metadata](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/metadata/components/BalanceBudget.json)
