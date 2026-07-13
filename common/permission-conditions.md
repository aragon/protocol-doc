---
type: concept
title: Permission conditions
tags: [permissions, security]
source: osx/src/common/permission/condition/IPermissionCondition.sol, osx/src/common/permission/condition/PermissionCondition.sol, osx/src/common/permission/condition/PermissionConditionUpgradeable.sol
---

# Permission conditions

A plain grant is a static yes. A **condition** turns a permission into a *dynamic* yes: the [permission system](../core/permissions.md) consults an on-chain contract at call time to decide whether to allow the action, and that contract can look at the caller, the target, the permission, and the exact call arguments.

Use a condition whenever "who may do this" isn't a fixed address list: spending caps, time windows, per-argument restrictions ("may call this function but only with argument X"), allow-listed targets, or [signature validation](../core/signature-validation.md).

## The interface

A condition is any contract implementing `IPermissionCondition`:

```solidity
function isGranted(
    address _where,
    address _who,
    bytes32 _permissionId,
    bytes calldata _data
) external view returns (bool isPermitted);
```

`_data` is the context the check runs against, when the condition backs an `auth`-gated function, it is the full `msg.data` of the call, so the condition can decode the arguments. Inherit `PermissionCondition` (non-upgradeable) or `PermissionConditionUpgradeable` to get the required ERC-165 wiring:

```solidity
contract OnlyBeforeDeadline is PermissionCondition {
    uint256 public immutable deadline;
    constructor(uint256 _deadline) { deadline = _deadline; }

    function isGranted(address, address, bytes32, bytes calldata)
        external view returns (bool)
    {
        return block.timestamp <= deadline;
    }
}
```

## Attaching a condition

Attach it when granting:

```solidity
dao.grantWithCondition(where, who, permissionId, address(condition));
```

`grantWithCondition` verifies the condition is a contract and advertises `IPermissionCondition` via ERC-165 (else it reverts). Then, during [`isGranted`](../core/permissions.md#how-a-decision-is-made), a grant whose stored value is a condition address defers the decision to that contract.

Because only `grantWithCondition` may set `where == ANY_ADDR`, conditions are also how you express "this caller, on any contract, but only when the condition holds" (the [any-target tier](../core/permissions.md#how-a-decision-is-made)).

## Keep in mind

- **Conditions fail closed.** If a condition reverts, runs out of gas, or returns the wrong type, the permission system treats the result as `false`, not as an error. Throwing is equivalent to "denied." Never rely on a revert to signal something to the caller; it just denies.
- **A condition on a specific grant does not fall through.** If the specific `(where, who)` slot holds a condition and it returns `false`, the answer is `false`, even if a broader wildcard grant exists that would have said yes. See the [non-merging tiers](../core/permissions.md#how-a-decision-is-made).

## Composing conditions without writing Solidity

For conditions that are boolean combinations of simple checks (time, block, delegated sub-conditions, literal comparisons), you often don't need bespoke code: [`RuledCondition`](./ruled-condition.md) lets you express the logic as a data-driven rule list. Reusable ready-made conditions live in the [condition library](../helpers/index.md).

## See also

- [The permission system](../core/permissions.md) — where conditions are consulted.
- [RuledCondition](./ruled-condition.md) — declarative rule engine for building conditions.
- [Signature validation](../core/signature-validation.md) — a condition-driven use of the same machinery.
