# conditions — ABI reference

Generated from [`conditions`](https://github.com/aragon/conditions) at commit [`7198a02a`](https://github.com/aragon/conditions/commit/7198a02ae1e62f3297416feeca64159bf69802c7).

10 entries. Regenerate with `just abi`.

## Contracts

- [`ConditionFactory`](./ConditionFactory.md) — A factory used to deploy new condition instances
- [`ExecuteSelectorCondition`](./ExecuteSelectorCondition.md) — A permission that only allows a specified group of function selectors to be invoked within DAO.execute()
- [`ExecuteSelectorCrossChainCondition`](./ExecuteSelectorCrossChainCondition.md) — A permission condition that restricts which function selectors (and native transfers) can be invoked through DAO.execute(), with allowlists scoped per chain —…
- [`SafeOwnerCondition`](./SafeOwnerCondition.md) — A permission that only allows Safe owners to make use of a granted permission.
- [`SelectorCondition`](./SelectorCondition.md) — A permission that only allows a specified group of function selectors to be invoked within DAO.execute()

## Interfaces

- [`ICrossChainController`](./ICrossChainController.md)
- [`IOwnerManager`](./IOwnerManager.md) — Interface for managing Safe owners and a threshold to authorize transactions.

## Functions

- [`getSelector`](./getSelector.md) — Extracts the selector given the calldata.
- [`slice`](./slice.md) — Copies the content of `buffer`, from `start` (included) to `end` (excluded) into a new bytes object in memory.
- [`stripSelector`](./stripSelector.md) — Strips the first 4 bytes selector.
