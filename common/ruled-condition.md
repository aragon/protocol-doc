---
type: concept
title: RuledCondition (the rule engine)
tags: [permissions]
source: osx/src/common/permission/condition/extensions/RuledCondition.sol
---

# RuledCondition (the rule engine)

Many [permission conditions](./permission-conditions.md) are just boolean combinations of small checks: "after this timestamp", "the argument equals X", "and this other condition also passes". `RuledCondition` lets you express that logic as **data**, an array of rules, instead of writing and auditing bespoke Solidity for each one.

It's an abstract base: you inherit it, set the rules, and expose your own `isGranted` that evaluates them. The reusable conditions in the [condition library](../helpers/index.md) are built this way.

## One rule

```solidity
struct Rule {
    uint8   id;           // where the LEFT operand comes from
    uint8   op;           // the operator
    uint240 value;        // the RIGHT operand (its meaning depends on id/op, see below)
    bytes32 permissionId; // optional per-rule permission override (delegated conditions)
}
```

A rule computes a **left value** from `id`, then applies `op`: a comparison op compares that left value against `value` (the **right operand**); `RET` just returns whether the left value is truthy. `id` selects where the left value comes from:

| `id` | Left value is… |
|---|---|
| `< 200` | `_compareList[id]` — a runtime operand the subclass decoded from the call `_data` (truncated to 240 bits) |
| `200` `BLOCK_NUMBER_RULE_ID` | `block.number` |
| `201` `TIMESTAMP_RULE_ID` | `block.timestamp` |
| `204` `VALUE_RULE_ID` | the literal in `value` itself (used with `RET`, or as a constant operand) |
| `202` `CONDITION_RULE_ID` | the boolean result of **another** `IPermissionCondition` (its address packed in `value`); the rule then tests whether it passed |
| `203` `LOGIC_OP_RULE_ID` | not a comparison — combines other rules (below) |

`op` is one of `NONE, EQ, NEQ, GT, LT, GTE, LTE, RET, NOT, AND, OR, XOR, IF_ELSE`. The comparison ops (`EQ`…`LTE`) test `leftValue <op> value`; `RET` returns `leftValue > 0`; the rest are logic operators.

## Combining rules

A logic-op rule (`id = LOGIC_OP_RULE_ID`) reads no value, it references **other rules by their array index**, so a flat `Rule[]` encodes a boolean expression tree. The index operands are packed into `value` with the helpers `encodeLogicalOperator(idxA, idxB)` (for `AND`/`OR`/`XOR`; `NOT` uses only `idxA`) and `encodeIfElse(condIdx, thenIdx, elseIdx)`.

Evaluation starts at **rule 0**, the root (usually the top combinator). `AND`/`OR` short-circuit to save gas.

## A worked example

"Allow only while `block.timestamp ≤ deadline` **and** the first decoded argument equals `expected`":

| index | `id` | `op` | `value` |
|---|---|---|---|
| **0** (root) | `LOGIC_OP_RULE_ID` | `AND` | `encodeLogicalOperator(1, 2)` |
| 1 | `TIMESTAMP_RULE_ID` | `LTE` | `deadline` |
| 2 | `0` (i.e. `_compareList[0]`) | `EQ` | `expected` |

The subclass decodes the call's `_data` into `_compareList` (here `[firstArg]`) and evaluates rule 0. Rule 0 is `rule1 AND rule2`; rule 1 is `block.timestamp ≤ deadline`; rule 2 is `_compareList[0] == expected`. Rules are set once via `_updateRules` (emits `RulesUpdated`) and read with `getRules()`.

## Keep in mind

- **`value` is `uint240`, and compare-list entries are truncated to 240 bits** (the source even comments "force lost precision"). Comparing certain `uint256`s or raw `address` values can silently lose the top bits.
- **Delegated conditions fail closed.** A `CONDITION_RULE_ID` rule calls the other condition via a raw `staticcall`; a revert, a non-contract, or a wrong-sized return is treated as `false`, the same fail-closed philosophy as the [permission system](../core/permissions.md).
- **A delegated sub-condition does *not* see the original calldata.** `RuledCondition` passes `abi.encode(_compareList)` as the sub-condition's `_data`, the parent's already-decoded operands re-encoded, not the raw `msg.data`. So a [condition](./permission-conditions.md) that normally re-parses call arguments can only observe what the parent decoded into the compare list. Feed it every operand it needs; it cannot reach back to the original call.
- **Rules are trusted input.** A malformed rule set (bad indices) can recurse deeply; only set rules you control, via `_updateRules`.

Reach for `RuledCondition` when your logic is a composition of standard comparisons; write a plain [condition](./permission-conditions.md) when it's simpler to express directly in Solidity.

## See also

- [Permission conditions](./permission-conditions.md) — the interface `RuledCondition` implements.
- [Condition library](../helpers/index.md) — ready-made conditions built on this engine.
