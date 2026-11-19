---
type: concept
title: Keep
tags: [automation, treasury]
source: capital-tree/src/actions/KeepAction.sol
---

# Keep

Use Keep to retain a branch's share in the treasury, such as 20% of a buyback. It builds no calls: the tokens already belong to the `DAO.sol` contract. Keeping funds explicitly completes that [leaf](../concepts.md#leaves-complete-the-flow).

## Implementation

Keep extends [`LeafAction`](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/actions/base/LeafAction.sol), the shared base for leaves. Its `build` method uses the [`Asset` and `Action` types](./index.md#core-concepts) to declare zero output and no calls. The allocation stays in the `DAO.sol` contract:

```solidity
// Inside a contract extending LeafAction.
function build(address, bytes calldata, Asset calldata input)
    external pure returns (Asset memory, Action[] memory)
{
    return (_consume(input), new Action[](0));
}
```

`_consume` returns `Asset(input.token, 0)`. Other leaves can return calls that transfer, burn or donate the allocation while still declaring zero output. Their postconditions must verify the intended effect.

## See also

- [All actions](./index.md)
- [Execution](../execution.md) and [setup and permissions](../setup.md)
- [Contract source](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/actions/KeepAction.sol) and [settings metadata](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/metadata/components/KeepAction.json)
