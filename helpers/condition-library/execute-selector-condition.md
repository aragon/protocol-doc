---
type: concept
title: ExecuteSelectorCondition
tags: [permissions]
source: conditions/src/ExecuteSelectorCondition.sol
---

# ExecuteSelectorCondition

`ExecuteSelectorCondition` scopes a DAO's [`EXECUTE_PERMISSION_ID`](../../core/execution.md) so the holder can only make the DAO run a **specific set of `(target, function)` calls**. It's the [condition library](../condition-library.md) member that checks actions *inside* an `execute()` batch. Compare it with [SelectorCondition](./selector-condition.md), which checks the direct call's selector.

## When to use it

You want to grant a plugin (or any address) the ability to make the DAO [execute](../../core/execution.md) actions, but **only certain ones**. For example: "this rewards plugin may make the DAO execute, but only `transfer` calls to the USDC contract." Attach this condition to the DAO's `EXECUTE_PERMISSION_ID` grant and a blanket "can move anything" becomes a tightly-scoped "can only do these calls."

## What it checks

Unlike [SelectorCondition](./selector-condition.md), which looks at the *direct call's* selector, this one only fires when the call **is** `execute()`, then **reaches inside the batch**:

```solidity
if (getSelector(_data) != IExecutor.execute.selector) return false;   // must be execute()
(, Action[] memory actions,) = abi.decode(_data[4:], ...);            // unpack the batch
// for each action: check its (to, selector) against the allow-lists
```

For every [action](../../core/execution.md) it checks the target-and-selector pair against a **per-target** allow-list (`allowedSelectors[target][selector]`), plus a separate per-target flag for native-coin movements (`allowedNativeTransfers[target]`). So it constrains *the selectors of the actions the DAO is asked to run*, not the direct call.

There are two rules to get right:

- **All-or-nothing across the batch.** If *any* action's target/selector isn't allowed, the whole `execute` is denied.
- **Value needs clearing, even for a function call.** An action carrying a non-zero `value` is denied unless its target is native-transfer-cleared, *on top of* its selector being allow-listed. Allow-listing a payable `deposit()` but not clearing native transfers to that target still rejects a value-bearing call. A plain transfer (an action with no calldata) likewise needs the target cleared.

## Configuration

| | |
|---|---|
| Constructor | `(IDAO _dao, SelectorTarget[] _initialEntries)` where `SelectorTarget { address where; bytes4[] selectors; }` |
| Manage selectors | `allowSelectors(SelectorTarget)` / `disallowSelectors(SelectorTarget)` |
| Manage native transfers | `allowNativeTransfers(address)` / `disallowNativeTransfers(address)` |
| Managed by | `MANAGE_SELECTORS_PERMISSION_ID` (grant to the DAO) |
| Events | `SelectorAllowed/Disallowed(selector, where)`, `NativeTransfersAllowed/Disallowed(where)` |

**Native transfers use their own switch, not a selector.** A value-bearing action with empty calldata is authorized by `allowNativeTransfers(target)` (the `allowedNativeTransfers` map), never by a zero-selector entry. `isGranted` routes empty-calldata actions there and never reads `allowedSelectors[target][0]`. (The source struct comment suggesting a zero selector is misleading; ignore it.)

This switch has **no constructor path**: `_initialEntries` only seeds selectors, so a condition that must allow native transfers needs a separate governed `allowNativeTransfers` call after deployment. Plan for that extra action if you configure the condition in a one-shot genesis deployment.

## Keep in mind

- **Attach it to the right permission.** It's built for the DAO's `EXECUTE_PERMISSION_ID` (the grant to the executing plugin); on any other permission it denies, since the call won't be `execute()`.
- **Management is idempotent** (a redundant `allowSelectors`/`allowNativeTransfers` is a no-op), unlike [SelectorCondition](./selector-condition.md), which reverts on redundant changes.
- **A selector is not its arguments.** It allow-lists *which* calls, not their arguments; for value/argument caps use a bespoke [condition](../../common/permission-conditions.md) or [RuledCondition](../../common/ruled-condition.md).
- **It doesn't look inside relays.** Allow-listing a function that relays actions elsewhere, such as a CrossChainController's `forwardMessage`, lets any relayed payload through. To check what a relay carries, use [ExecuteSelectorCrossChainCondition](./execute-selector-crosschain-condition.md).
- **A no-op action denies the whole batch.** An action with empty calldata *and* zero value returns `false`. Adding such an action to an otherwise-allowed `execute()` rejects the entire call.

## See also

- [Condition Library](../condition-library.md) — the library overview and the factory.
- [SelectorCondition](./selector-condition.md) — the direct-call counterpart.
- [ExecuteSelectorCrossChainCondition](./execute-selector-crosschain-condition.md): the same check with per-chain allow-lists, for a DAO that relays actions to other chains.
- [Actions and execution](../../core/execution.md) — the `execute`/`Action` shape this inspects.
