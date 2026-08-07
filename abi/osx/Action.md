---
type: reference
title: Action
kind: struct
source: osx/src/common/executors/IExecutor.sol
summary: ""
---

# Action

**Struct** · [`src/common/executors/IExecutor.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/executors/IExecutor.sol)

**Explained in:** [Actions and execution](../../core/execution.md), [Create, vote, and execute a proposal](../../guides/create-vote-execute.md)

```solidity
struct Action {
    address to;
    uint256 value;
    bytes data;
}
```
