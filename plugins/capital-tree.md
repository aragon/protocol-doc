---
type: concept
title: Capital Tree
tags: [automation, treasury]
source: capital-tree/src/CapitalTreePlugin.sol, capital-tree/src/lib/types.sol, capital-tree/script/Recipes.sol
---

# Capital Tree

Capital Tree is an [OSx plugin](../framework/plugins.md) for recurring capital flows. Each tree combines a budget, nodes with actions, and optional splitters to define where capital goes.

**Funds are held by the [`DAO.sol`](../core/dao.md) contract, which executes the calls.** Budgets determine how much is available; node actions build calls and check their results. The Capital Tree plugin coordinates the flow, asking `DAO.sol` to execute those calls using its funds and authority. See [OSx actions and execution](../core/execution.md) for the underlying mechanism.

Governance installs the flow and its permissions once. Authorized callers can [trigger the flow](./capital-tree/concepts.md#a-trigger-runs-the-flow) without a new proposal for each execution. One installation runs one flow.

**We recommend one tree per `DAO.sol` contract, holding the assets dedicated to that flow.** This keeps assets ringfenced and makes accounting and permissions easier to follow than sharing a treasury across multiple flows and governance processes.

A [multisig](multisig-plugin.md) can handle flow administration. For voting-based governance, keep voting and protocol administration in a main `DAO.sol` contract, with a dedicated `DAO.sol` contract for each capital flow. A [Transfer action](capital-tree/actions/transfer.md) can pass funds to the contract for the next stage, whose tree runs on its own trigger.

## Where to start

- [Concepts](./capital-tree/concepts.md): understand the parts of a tree and how they fit together.
- [Execution](./capital-tree/execution.md): understand how a trigger runs the tree.
- [Budgets](./capital-tree/budgets/index.md), [actions](./capital-tree/actions/index.md) and [splitters](./capital-tree/splitters/index.md): choose the building blocks.
- [Setup and permissions](./capital-tree/setup.md): review the policy, install it and manage who can change it.
- [Solvers](./capital-tree/examples/buyback/openfill.md): build a bot and contract to fill Open Fill orders.
- [Examples](./capital-tree/examples/index.md): start with a [recurring buyback](./capital-tree/examples/buyback.md), then explore other flows.
