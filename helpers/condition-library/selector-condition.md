---
type: concept
title: SelectorCondition
tags: [permissions]
source: conditions/src/SelectorCondition.sol
---

# SelectorCondition

`SelectorCondition` narrows a permission so it may only be used to call a **specific set of functions**. It holds an allow-list of function selectors and, when consulted, permits the call only if the function being invoked is on that list. It's part of the [condition library](../condition-library.md).

## When to use it

A single permission often gates several `auth`-protected functions on a contract. When a given holder should be able to reach only *some* of them, attach a `SelectorCondition` allow-listing just those selectors. "You hold this permission, but only for functions X and Y."

## What it checks

Its [`isGranted`](../../common/permission-conditions.md) is essentially one lookup:

```solidity
return allowedSelectors[getSelector(_data)];
```

It inspects the **selector of the call being authorized** (the first 4 bytes of that call's calldata) and returns whether it's allow-listed. Two things follow:

- **It gates the *direct* call's own function.** If you instead want to constrain the actions *inside* a DAO `execute()`, that's the sibling [ExecuteSelectorCondition](./execute-selector-condition.md).
- **It ignores who is calling.** The `where`/`who`/`permissionId` are unused; only the selector matters. So granting to [`ANY_ADDR`](../../core/permissions.md#the-wildcard-any_addr) with this condition means *anyone may call the allow-listed functions*, the gate is on **what** is called, not **who**.

The allow-list is **global** (a plain `mapping(bytes4 => bool)`, no per-target dimension), so an allowed selector is allowed wherever this condition applies.

## Configuration

| | |
|---|---|
| Constructor | `(IDAO _dao, bytes4[] _initialSelectors)` — the DAO it reads permissions from, and an initial allow-list |
| Manage | `allowSelector(bytes4)` / `disallowSelector(bytes4)` |
| Managed by | `MANAGE_SELECTORS_PERMISSION_ID` (grant it to the DAO so changes go through governance) |
| Events | `SelectorAllowed(selector)` / `SelectorDisallowed(selector)` |

## Keep in mind

- **Redundant updates revert.** `allowSelector` on an already-allowed selector reverts `AlreadyAllowed` (and the mirror for disallow). This differs from [ExecuteSelectorCondition](./execute-selector-condition.md), whose updates are idempotent, mind it when scripting list changes.
- **A selector is not its arguments.** This allow-lists *which function*, not *with what arguments*; for argument-level rules use a bespoke [condition](../../common/permission-conditions.md) or [RuledCondition](../../common/ruled-condition.md).

## See also

- [Condition Library](../condition-library.md) — the library overview and the factory.
- [ExecuteSelectorCondition](./execute-selector-condition.md) — the same idea applied *inside* a DAO `execute()`.
