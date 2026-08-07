# conditions — ABI reference

Generated from [`conditions`](https://github.com/aragon/conditions) at commit [`33918b06`](https://github.com/aragon/conditions/commit/33918b06b95233dd8890bef6cc60da6227fa5af1).

6 entries. Regenerate with `just abi`.

## Contracts

- [`ConditionFactory`](./ConditionFactory.md) — A factory used to deploy new condition instances
- [`ExecuteSelectorCondition`](./ExecuteSelectorCondition.md) — A permission that only allows a specified group of function selectors to be invoked within DAO.execute()
- [`SafeOwnerCondition`](./SafeOwnerCondition.md) — A permission that only allows Safe owners to make use of a granted permission.
- [`SelectorCondition`](./SelectorCondition.md) — A permission that only allows a specified group of function selectors to be invoked within DAO.execute()

## Interfaces

- [`IOwnerManager`](./IOwnerManager.md) — Interface for managing Safe owners and a threshold to authorize transactions.

## Functions

- [`getSelector`](./getSelector.md) — Extracts the selector given the calldata.
