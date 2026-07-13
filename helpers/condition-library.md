---
type: concept
title: Condition Library
tags: [permissions]
source: condition-library/src/factory/ConditionFactory.sol, condition-library/src/lib/common.sol
---

# Condition Library

The Condition Library is a set of **ready-made [permission conditions](/common/permission-conditions.md)** for common gating patterns, so a DAO doesn't have to write and audit a bespoke condition contract every time it wants to constrain a permission. You deploy one (via the [factory](#the-conditionfactory)) and attach it with [`grantWithCondition`](/core/permissions.md#granting-and-revoking); from then on the permission is allowed only when the condition says so. All three are audited.

## The three conditions

Each is its own tool with its own use case, the first thing to get right is *what each one inspects*:

- **[SelectorCondition](/helpers/condition-library/selector-condition.md)** — allow only a set of function **selectors** on the *direct call* being authorized. "This permission, but only to call functions X and Y."
- **[ExecuteSelectorCondition](/helpers/condition-library/execute-selector-condition.md)** — scope the DAO's [`EXECUTE_PERMISSION_ID`](/core/execution.md) by reaching *inside* an `execute()` batch and allow-listing each action's `(target, selector)`. "This plugin may make the DAO execute, but only these calls."
- **[SafeOwnerCondition](/helpers/condition-library/safe-owner-condition.md)** — allow only the current owners of a given [Safe](https://safe.global), a live bridge from a Safe's membership to a DAO permission.

The distinction that trips people: **`SelectorCondition` gates the direct call's own selector; `ExecuteSelectorCondition` gates the selectors of the actions *inside* an `execute()`.** Pick by which call the permission you're guarding actually receives.

## The `ConditionFactory`

`ConditionFactory` deploys instances of the three conditions (`deploySelectorCondition`, `deployExecuteSelectorCondition`, `deploySafeOwnerCondition`) and emits an event for each. It's plain deployment (no deterministic addresses or clones); the value is a single, audited, discoverable deployment path, one known factory address per network from which every condition instance can be traced via its events.

## Using one

The flow is always the same:

1. Deploy the condition (via the factory) with its initial configuration.
2. Grant the permission with it attached: `dao.grantWithCondition(where, who, permissionId, condition)`, often with `who` = [`ANY_ADDR`](/core/permissions.md#the-wildcard-any_addr). What that means depends on the condition: `SafeOwnerCondition` reads `who`, so `ANY_ADDR` + it = "only Safe owners"; the selector conditions **ignore `who`**, so `ANY_ADDR` + them = "anyone, but only these functions/actions" (they gate *what*, not *who*).
3. Manage the allow-list over time (for the selector conditions) via their `MANAGE_SELECTORS_PERMISSION_ID`, typically held by the DAO.

## Keep in mind

- **A selector is not its arguments.** These conditions allow-list *which function/action* may run, not *with what arguments*; for argument-level rules, write a bespoke [condition](/common/permission-conditions.md) or use [RuledCondition](/common/ruled-condition.md).
- **All conditions [fail closed](/common/permission-conditions.md).** A malformed call, or a Safe that doesn't answer, resolves to "denied", never a surfaced error.

## See also

- [SelectorCondition](/helpers/condition-library/selector-condition.md), [ExecuteSelectorCondition](/helpers/condition-library/execute-selector-condition.md), [SafeOwnerCondition](/helpers/condition-library/safe-owner-condition.md) — the three, each in depth.
- [Permission conditions](/common/permission-conditions.md) and [RuledCondition](/common/ruled-condition.md) — what a condition is, and how to build ones these fixed patterns don't cover.
- [The permission system](/core/permissions.md) — `grantWithCondition` and `ANY_ADDR`.
