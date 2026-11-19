---
type: concept
title: Burn
tags: [automation, treasury]
source: capital-tree/src/actions/BurnAction.sol
---

# Burn

Use Burn to destroy the tokens assigned to a branch, such as the proceeds of a [buyback](../examples/buy-and-burn.md). It builds a `burn(amount)` call for the `DAO.sol` contract, so the token must support burning the caller's own balance, as `ERC20Burnable` does. This [leaf](../concepts.md#leaves-complete-the-flow) has no further output.

- **Check**: the `DAO.sol` contract's balance dropped by the amount.

## See also

- [All actions](./index.md)
- [Execution](../execution.md) and [setup and permissions](../setup.md)
- [Contract source](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/actions/BurnAction.sol) and [settings metadata](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/metadata/components/BurnAction.json)
