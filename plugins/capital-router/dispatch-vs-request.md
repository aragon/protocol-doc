---
type: concept
title: Dispatch vs. Request
tags: [automation, treasury]
source: capital-router/src/DispatcherPlugin.sol, capital-router/src/RequesterPlugin.sol, capital-router/src/base/TransferDispatchStrategyBase.sol
---

# Dispatch vs. Request

Every [Capital Router](/plugins/capital-router.md) flow is one of two directions, and the choice shapes everything else, the interfaces, who moves the money, and idempotency. It's the axis to get right first.

- **Dispatch (push):** one trigger pays *everyone* at once. `DispatcherPlugin.dispatch()` computes the whole [budget](/plugins/capital-router/budgets.md), asks the [splitter](/plugins/capital-router/splitters.md) for *all* recipients' shares, and builds a transfer for each, the DAO pushes funds out to the whole roster in a single transaction.
- **Request (pull):** each beneficiary claims their *own* slice, when they like. `RequesterPlugin.request(data)` computes the same total budget but asks the splitter for *just the caller's* share, subtracts what they've already been paid, and pays only the delta.

## Baked into the interfaces

The split isn't a convention, it's in the type system. Dispatch pieces take no caller argument; request pieces take a caller-specific `data` blob:

| | Dispatch | Request |
|---|---|---|
| Budget | `budget()` | `budget(bytes data)` |
| Splitter | `allocations(total)` → arrays for *all* recipients | `allocation(recipient, total, data)` → *one* recipient's share |

That `data` parameter is how a request carries proof of entitlement (a Merkle proof, an epoch id) that a push flow never needs, because a push already knows the whole roster.

## Idempotency: the sharp difference

- **Request is idempotent by design.** Each caller's paid amount ratchets forward (`requestedAmounts[caller]`), and a request always pays `owed − alreadyPaid`. Call it twice with nothing new due and the second is a silent no-op. Concretely: a `FixedBudget` of 10,000 split 50/30/20 means alice can `request()` any time and always nets exactly 5,000, *once*, no matter when bob or carol claim theirs.
- **Dispatch is only idempotent if the strategy makes it so.** Plain [`TransferDispatchStrategy`](/plugins/capital-router/strategies.md) re-pays whatever the budget reports *every* call, dispatch it twice with a `FullBudget` and it distributes the balance twice. Use an [epoch-gated strategy](/plugins/capital-router/strategies.md) (or a bounded budget) when repeated triggers must not double-pay.

## Who may trigger

- `dispatch()` is `auth(DISPATCH_PERMISSION_ID)`, [permissionless by default](/plugins/capital-router/plugins.md#permissions) (the outcome is fixed by config, so opening *when* to anyone is safe).
- `request()` has **no permission gate at all**, by design: anyone may call it, because the budget and splitter already decide whether the caller is entitled to anything (a non-entitled caller just gets an empty action list, not a revert). To restrict a request flow you [pause the strategy](/plugins/capital-router/strategies.md) or put the logic in the strategy, not on a permission. That pause switch is `auth(MANAGER)`, and `RequesterPluginSetup` grants the DAO `MANAGER` on **every** strategy at install (see [permissions](/plugins/capital-router/plugins.md#installation--permissions)), so a freshly installed request flow can be paused by DAO proposal with no extra grant.

## Keep in mind

- **Plain dispatch re-pays every call.** Only [epoch-gated](/plugins/capital-router/strategies.md) or bounded-budget dispatch is safe to trigger repeatedly.
- **`request()` can't be permission-gated.** Its access control lives in the budget/splitter entitlement and the strategy's `MANAGER`-gated pause switch, not in the OSx permission system. The install grants the DAO that `MANAGER` on every strategy, so pausing works out of the box.

## See also

- [The plugins](/plugins/capital-router/plugins.md), [Budgets](/plugins/capital-router/budgets.md), [Splitters](/plugins/capital-router/splitters.md), [Strategies](/plugins/capital-router/strategies.md).
- [Capital Router overview](/plugins/capital-router.md).
