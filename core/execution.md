---
type: concept
title: Actions and execution
tags: [core, security]
source: osx/src/common/executors/IExecutor.sol, osx/src/core/dao/DAO.sol, osx/src/common/executors/Executor.sol, osx/src/common/utils/math/BitMap.sol
---

# Actions and execution

Everything a DAO *does* on-chain, send funds, call another contract, change its own permissions, it does by executing **actions**. An action is one external call:

```solidity
struct Action {
    address to;     // the target contract (or EOA)
    uint256 value;  // native coin to send
    bytes data;     // calldata: selector + arguments
}
```

A DAO executes a *batch* of actions atomically through [`execute`](#the-execute-function). This is the single channel by which a passed proposal takes effect: a [governance plugin](/framework/plugins.md) holding `EXECUTE_PERMISSION_ID` calls `execute` with the actions the proposal approved.

## The `execute` function

```solidity
function execute(bytes32 _callId, Action[] calldata _actions, uint256 _allowFailureMap)
    external
    returns (bytes[] memory execResults, uint256 failureMap);
```

On the [DAO](/core/dao.md) this is gated by `EXECUTE_PERMISSION_ID` and is `nonReentrant`. It loops over `_actions` and performs each as a low-level call:

```solidity
(bool success, bytes memory result) = to.call{value: value}(data);
```

Key facts:

- **It's a `call`, not a `delegatecall`.** Actions run *as the DAO*: `msg.sender` at the target is the DAO's address, and value comes from the DAO's balance. This is why a DAO can call *itself* (e.g. an action targeting the DAO's own `grant`) to self-govern.
- **`_callId`** is caller-defined and only echoed in the `Executed` event, governance plugins typically set it to the proposal id for traceability. The DAO does not interpret it.
- **`MAX_ACTIONS = 256`** per call (bounded by the 256-bit failure bitmap); more reverts `TooManyActions`.
- **`execute` is `nonReentrant`, but self-governance still works.** An action may freely call back into the DAO's *other* functions, and that is exactly how a DAO governs itself: an action targeting the DAO's own `grant`/`revoke` runs as the DAO, which holds ROOT over itself, and succeeds. What an action may *not* do is re-enter `execute`. The guard is a `_reentrancyStatus` flag on the function itself, not tied to the caller or their permissions, so *even a plugin holding `EXECUTE_PERMISSION_ID`* re-enters the same guarded function and reverts `ReentrantCall`. Genuinely nested execution therefore has to run on a *different* executor: target another DAO, or `delegatecall` the standalone [`Executor`](#the-standalone-executor), which keeps its guard in a separate storage slot. The guard scopes to `execute` alone, so permission changes and metadata updates mid-batch are unaffected.

## Failsafe actions

By default, if any action reverts the whole batch reverts. Sometimes you want an action to be **failsafe**: permitted to fail without sinking the rest of the proposal. The `_allowFailureMap` parameter, the **failsafe action map**, is a bitmap where **bit `i` set marks action `i` as failsafe**:

- A failsafe action that reverts is recorded (its bit is set in the returned `failureMap`) and execution continues.
- A *non-failsafe* action that reverts throws `ActionFailed(i)` and rolls back the whole batch.

The returned `failureMap` reports which failsafe actions actually failed. (Bit helpers live in `BitMap`: `hasBit`, `flipBit`.)

```solidity
// Actions 0 and 2 must succeed; action 1 is failsafe (may fail without reverting the batch).
uint256 allowFailureMap = 1 << 1; // set bit 1
(bytes[] memory results, uint256 failures) = dao.execute(callId, actions, allowFailureMap);
// failures now has bit 1 set iff action 1 reverted.
```

> **Security: the 63/64 gas-griefing guard.** When a failsafe action fails, `execute` checks it wasn't merely starved of gas (`gasleft` after the call must be at least 1/64 of before) and reverts `InsufficientGas` otherwise. Without this, an attacker could hand-tune the gas limit so a subcall runs out of gas (EIP-150 keeps 1/64 for the caller), letting `execute` finish and record a *real* failure as a harmless failsafe skip. So a failure recorded in `failureMap` is guaranteed genuine, not gas starvation.

## The standalone `Executor`

`Action` and the `execute` signature are defined in `IExecutor`, and there is a second implementation: `Executor`, a **permissionless, standalone** executor.

- It runs the *same* action-loop (same `MAX_ACTIONS`, same failsafe semantics, same gas guard) but has **no permission check**, anyone can call it.
- It is meant to be used via **`delegatecall`** from another contract, lending its execute-loop logic while running in the caller's context. To stay `delegatecall`-safe it stores its reentrancy guard in a fixed namespaced storage slot (via assembly) rather than a normal state variable, so it never collides with the caller's storage layout.

`DAO.execute` (permissioned, called directly) and `Executor` (permissionless, delegatecalled) share the `IExecutor` interface but are different tools, don't confuse them. Plugins can target either, see [how plugins execute](/framework/plugins.md#how-a-plugin-makes-the-dao-act).

## Keep in mind

- **Actions run as the DAO** (`call`, not `delegatecall`): at the target, `msg.sender` is the DAO and value comes from its balance. Plan targets and their access control around that.
- **A recorded failsafe failure is genuine.** The 63/64 gas guard means a failure in `failureMap` was a real revert, not gas starvation, so you can trust it.

## See also

- [The DAO contract](/core/dao.md) — holds `EXECUTE_PERMISSION_ID` and the assets actions spend.
- [Permissions](/core/permissions.md) — what gates `execute`.
- [Plugins](/framework/plugins.md) — who calls `execute`, and how a proposal's actions get here.
