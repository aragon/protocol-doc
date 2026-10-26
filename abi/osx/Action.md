---
type: reference
title: Action
kind: struct
source: osx/src/common/executors/IExecutor.sol
summary: ""
---

# Action

**Struct** · [`src/common/executors/IExecutor.sol`](https://github.com/aragon/osx/blob/2c60f1252558d75fe99c414ccd2b1aedbde88f12/src/common/executors/IExecutor.sol)

**Explained in:** [Actions and execution](../../core/execution.md), [Create, vote, and execute a proposal](../../guides/create-vote-execute.md)

```solidity
struct Action {
    address to;
    uint256 value;
    bytes data;
}
```
