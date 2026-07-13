---
type: concept
title: Capital Router plugins
tags: [automation, treasury]
source: capital-router/src/DispatcherPlugin.sol, capital-router/src/RequesterPlugin.sol, capital-router/src/DispatchHubPlugin.sol, capital-router/src/setup/DispatcherPluginSetup.sol
---

# Capital Router plugins

The [Capital Router](../capital-router.md) ships three plugins. All are [`PluginCloneable`](../../framework/plugin-types.md) (cheap minimal-proxy installs) that build [actions](../../core/execution.md) and run them via the DAO; they differ in *who triggers* and *what they hold*.

## DispatcherPlugin, the push entry point

Holds an ordered list of [strategies](./strategies.md). `dispatch()` (gated by `DISPATCH_PERMISSION_ID`) walks them **in order**, and for each one calls `prepareActions()` then immediately [`dao.execute()`](../../core/execution.md) *before moving to the next*.

That **settle-before-next** ordering is load-bearing, not incidental: it's what lets a "swap, then distribute the proceeds" pipeline work, because strategy `i+1`'s budget reads the vault balance *after* strategy `i`'s actions have already executed. It's also the source of a footgun: two `FullBudget` strategies in one plugin race, the first drains the vault, the second sees nothing. Compose with bounded budgets when several strategies draw on the same token.

### The failsafe map

By default `dispatch()` is all-or-nothing: any strategy reverting reverts the whole call. A `failsafeStrategyMap` bitmap changes that per strategy, bit `i` set means "strategy `i` may fail without sinking the rest." A failsafe strategy runs through a self-call so that if its `dao.execute()` reverts, any state its `prepareActions()` already wrote is rolled back too (important, since `prepareActions` is not `view`, e.g. an epoch strategy advances `lastDispatchedEpoch`). A failure emits `StrategyFailed(...)` and the loop continues.

> The failsafe map **resets to 0 whenever `updateSettings()` replaces the strategy list** (bit positions would otherwise point at the wrong new strategies). Reconfigure it after any settings change. Both `updateSettings` and `updateFailsafeStrategyMap` are `MANAGER_PERMISSION_ID`.

## RequesterPlugin, the pull entry point

Mirror-image: an ordered list of [request strategies](./strategies.md), the same failsafe mechanics. `request(bytes data)` forwards `data` to the strategies (empty → each gets `""`; otherwise it's decoded as one blob per strategy, and the count **must match** or it reverts `DataLengthMismatch`). As noted in [dispatch vs. request](./dispatch-vs-request.md), `request()` has **no permission gate**.

## DispatchHubPlugin, cross-DAO fan-out

Holds not strategies but a list of *other* `DispatcherPlugin`s, potentially on **entirely different DAOs**. Its `dispatch()` calls each one's `dispatch()` in turn (a plain external call, not via `dao.execute`, so the hub itself needs no `EXECUTE_PERMISSION_ID` anywhere). It has its own failsafe bitmap. It even satisfies the dispatcher interface itself, so a hub can be nested inside another hub.

> **Cross-DAO permission gotcha:** the hub can only trigger a target dispatcher if that dispatcher grants it `DISPATCH_PERMISSION_ID`. It works out of the box because dispatch is [permissionless by default](#permissions); but a target DAO that locked its dispatch down must explicitly grant the hub's address, or the fan-out to it reverts.

## Installation & permissions

The router installs through the standard [PluginSetupProcessor](../../framework/plugin-setup-processor.md). Everything, budgets, splitters, strategies, and the plugin, is an [EIP-1167 clone](../../common/proxies.md) deployed by factories (a `StrategyFactory` fans out to budget/splitter sub-factories), so each piece gets its own storage (needed for per-strategy `paused`/`requestedAmounts` and per-budget streaming state). `DispatcherPluginSetup` grants:

| Permission | Holder | Target | Purpose |
|---|---|---|---|
| `EXECUTE_PERMISSION_ID` | plugin | DAO | let the plugin call `dao.execute()` |
| `DISPATCH_PERMISSION_ID` | any address (default) | plugin | trigger `dispatch()` |
| `MANAGER_PERMISSION_ID` | DAO | plugin | `updateSettings`, `updateFailsafeStrategyMap` |
| `MANAGER_PERMISSION_ID` | DAO | each strategy | `updateSettings` and `setPaused` on every strategy |
| `PREPARE_PERMISSION_ID` | plugin | each strategy | only the plugin may call `strategy.prepareActions()` |
| `SET_METADATA_PERMISSION_ID` | DAO | plugin | update the metadata URI |

`RequesterPluginSetup` is the same minus the `DISPATCH`/any-address row (no `request()` gate); `DispatchHubPluginSetup` grants only MANAGER, metadata, and the any-address DISPATCH row on the hub (it has no strategies to grant PREPARE on).

> **Pausing is wired out of the box.** `setPaused` is `auth(MANAGER_PERMISSION_ID)` on *every* strategy, and both `DispatcherPluginSetup` and `RequesterPluginSetup` grant the DAO `MANAGER` on **each** strategy at install (the same grant that enables `updateSettings`), swap and non-swap alike. So a DAO can pause any strategy by proposal with no extra setup. Note that a DAO's ROOT does not by itself satisfy a `MANAGER` check, ROOT only gates `grant`/`revoke`, not arbitrary permissions, but here the install already provides the needed `MANAGER`.

## Permissions

`dispatch()` is **permissionless by default**, `DISPATCH_PERMISSION_ID` is granted to `ANY_ADDR` at install. That's deliberate: a dispatch's outcome is fully fixed by its config, so opening the trigger to anyone only decides *when* funds move, never where or how much. To control *timing* (ops, MEV, compliance) a DAO can revoke the `ANY_ADDR` grant and grant a specific operator, or attach a [condition](../../common/permission-conditions.md) (e.g. a time window) via `grantWithCondition`, standard [permission-system](../../core/permissions.md) work, nothing router-specific. (Doing so is what breaks a hub's fan-out unless the hub is also granted.)

## Keep in mind

- **Strategy order matters and settles between steps.** Later strategies see the vault *after* earlier ones ran, powerful for pipelines, a footgun for two `FullBudget` strategies (the first drains the vault).
- **The failsafe map resets on `updateSettings()`.** Reconfigure it after changing the strategy list, or a previously-tolerated strategy will revert the whole dispatch.
- **A paused strategy without its failsafe bit reverts the whole call.** Pause *and* set the failsafe bit together for maintenance.

## See also

- [Dispatch vs. request](./dispatch-vs-request.md), [Strategies](./strategies.md).
- [Actions and execution](../../core/execution.md), [the permission system](../../core/permissions.md), [plugin setup](../../framework/plugin-setup.md).
