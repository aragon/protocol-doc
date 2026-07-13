---
type: concept
title: RuledCondition (the rule engine)
tags: [permissions]
source: osx/src/common/permission/condition/extensions/RuledCondition.sol
---

# RuledCondition (the rule engine)

Many [permission conditions](/common/permission-conditions.md) are just boolean combinations of small checks: "after this timestamp", "before this block", "the argument equals X", "and also this other condition passes". `RuledCondition` lets you express that logic as **data**, a list of rules, instead of writing and auditing bespoke Solidity for each one.

It's an abstract base (inherit it, populate the rules, expose your own `isGranted` that evaluates them). The reusable conditions in the [condition library](/helpers/index.md) are built on it.

## The rule

```solidity
struct Rule {
    uint8   id;           // what value this rule reads
    uint8   op;           // the operator (see Op)
    uint240 value;        // literal / address / packed operand indices
    bytes32 permissionId; // optional per-rule permission override
}
```

The `id` selects where the rule's value comes from:

| `id` | Meaning |
|---|---|
| `200` `BLOCK_NUMBER_RULE_ID` | current `block.number` |
| `201` `TIMESTAMP_RULE_ID` | current `block.timestamp` |
| `202` `CONDITION_RULE_ID` | delegate to another `IPermissionCondition` (address packed in `value`) |
| `203` `LOGIC_OP_RULE_ID` | a boolean operator combining other rules by index |
| `204` `VALUE_RULE_ID` | a literal constant in `value` |
| `< 200` | index into a runtime `_compareList` (values decoded from the call `_data`) |

The `op` is one of `NONE, EQ, NEQ, GT, LT, GTE, LTE, RET, NOT, AND, OR, XOR, IF_ELSE`. `RET` returns whether the value is truthy; the logic ops (`AND`/`OR`/`NOT`/`XOR`/`IF_ELSE`) combine *other rules by index*, letting a flat `Rule[]` array encode a small boolean expression tree. `AND`/`OR` short-circuit to save gas.

Helper encoders pack operand indices into the 240-bit `value`: `encodeLogicalOperator(idx1, idx2)` and `encodeIfElse(cond, onTrue, onFalse)`.

## How evaluation runs

A subclass typically decodes the call's `_data` into a `uint256[] _compareList` (the runtime operands), then evaluates a top-level rule against block/timestamp/literals/delegated-conditions and the compare list. Rules are set once via `_updateRules` (emits `RulesUpdated`) and read with `getRules()`.

## Keep in mind

- **`value` is `uint240`, and compare-list entries are truncated to 240 bits** (the source even comments "force lost precision"). Comparing certain `uint256`s or raw `address` values can silently lose the top bits.
- **Delegated conditions fail closed.** A `CONDITION_RULE_ID` rule calls the other condition via a raw `staticcall`; a revert, a non-contract, or a wrong-sized return is treated as `false`, same fail-closed philosophy as the [permission system](/core/permissions.md).
- **A delegated sub-condition does *not* see the original calldata.** When a rule delegates via `CONDITION_RULE_ID`, `RuledCondition` passes `abi.encode(_compareList)` as the sub-condition's `_data`, the parent's already-decoded operands, re-encoded, not the raw `msg.data`. So a [condition](/common/permission-conditions.md) that normally re-parses call arguments can only observe what the parent decoded into the compare list. Feed it every operand it needs; it cannot reach back to the original call.
- Rules are trusted input. A malformed rule set (bad indices) can recurse deeply; only set rules you control via `_updateRules`.

Reach for `RuledCondition` when your logic is a composition of standard comparisons; write a plain [condition](/common/permission-conditions.md) when it's simpler to express directly in Solidity.

## See also

- [Permission conditions](/common/permission-conditions.md) — the interface `RuledCondition` implements.
- [Condition library](/helpers/index.md) — ready-made conditions built on this engine.
