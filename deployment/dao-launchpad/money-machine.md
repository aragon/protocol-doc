---
type: example
title: Money machine (worked example)
tags: [treasury]
source: dao-launchpad/lido/PRD.md, dao-launchpad/lido/src/factory/LidoMoneyMachineFactory.sol, dao-launchpad/lido/src/StreamUntilBudget.sol, dao-launchpad/lido/src/UniV2LiquidityDispatchStrategy.sol, dao-launchpad/lido/src/GatedCowSwapDispatchStrategy.sol, dao-launchpad/lido/src/WrapDispatchStrategy.sol, dao-launchpad/lido/src/PriceFloorGate.sol, dao-launchpad/lido/src/EpochProvider.sol
---

# Money machine (worked example)

A worked, illustrative example, not a production system, of what the [launchpad's one-shot factory](../dao-launchpad.md) and the [Capital Router](../../plugins/capital-router.md) let you build together. It's the single best tour of the Capital Router in action.

**The outcome it demonstrates:** a DAO that turns a recurring treasury *inflow* into productive positions automatically, with no governance vote per cycle. Concretely here: every hour it converts incoming staked ETH into (a) protocol-owned Uniswap-V2 liquidity and (b) opportunistic governance-token buybacks (via CowSwap) when the ETH price is healthy, each conversion **streamed over time** so no single tick is large enough to move the market. Adopting the policy is the only governance act; the conversions then run hands-off. It's the [buyback / protocol-owned-liquidity / DCA use cases](../../plugins/capital-router/use-cases.md) composed into one flow.

Two things make it instructive: it deploys through the [correct-from-genesis factory](../dao-launchpad.md#correct-from-genesis), and it reuses most of the Capital Router while adding a few *custom* pieces, the clearest demonstration of how the framework is meant to be extended.

## The shape

```
   owner DAO ──inflow refill + retarget the stream──▶  money-machine DAO (one DAO)
                                                        DispatcherPlugin, 3 strategies
   cron (hourly) ──▶ DispatcherPlugin.dispatch() ──▶  run in order, settle-before-next:
        0. Wrap            stETH → wstETH
        1. UniV2 Liquidity Full(gov-token) + Stream(wstETH) → LP → owner DAO
        2. Gated CowSwap   Stream(wstETH), ETH ≥ floor gate → buy gov-token → back to DAO
```

A permissionless cron triggers [`dispatch()`](../../plugins/capital-router/dispatch-vs-request.md) each hour; each strategy either does its work or returns *empty actions*. The Dispatcher runs them in order and [settles each before the next](../../plugins/capital-router/plugins.md), so strategy 2 reads the wstETH balance *after* strategy 1 has spent its share.

## What it reuses from the Capital Router

- The [`DispatcherPlugin`](../../plugins/capital-router/plugins.md) (push flow), installed via the standard [PSP](../../framework/plugin-setup-processor.md) with its three strategies.
- [`FullBudget`](../../plugins/capital-router/budgets.md) instances, deployed through CR's `BudgetFactory`.
- A CR [price oracle](../../plugins/capital-router/oracles.md) for slippage math, and CR's [`CowSwapDispatchStrategy`](../../plugins/capital-router/strategies.md), which strategy 2 *extends* rather than reimplements.
- The [settle-before-next](../../plugins/capital-router/plugins.md) execution order, the whole mechanism behind the sequential drain below.

## What it adds (the extension points, made concrete)

Every custom piece plugs into a Capital Router interface, so the stock `DispatcherPlugin` drives them unchanged, the "extend by adding a block, not forking" promise from [what you can build](../../plugins/capital-router/use-cases.md):

- **An epoch provider** (`IEpochProvider`) — `getEpoch() = block.timestamp / epochLength`. One shared instance so every strategy agrees on "what tick is this."
- **A stream-until budget** (`IDispatchBudget`) — an operator-paced stream denominated in *epochs*: `budget() = min(balance, balance / max(targetEpoch − currentEpoch, floorEpochs))`. Pure read, no checkpoints. In steady operation each tick releases a constant share that drains to ~0 at `targetEpoch`; if ticks are missed the reading climbs, and `floorEpochs` caps that climb. (A *custom* budget, distinct from CR's seconds-based [`StreamBudget`](../../plugins/capital-router/budgets.md), sharing the strategies' epoch clock so budget "tick" and dispatch "epoch" can't drift.)
- **A wrap strategy** — `stETH.approve(wstETH) + wstETH.wrap()`. Not epoch-gated (wrapping is idempotent).
- **A UniV2 liquidity strategy** — takes *two* budgets (a strategy needn't be one-budget-one-splitter). It prices the pair from the **oracle, not the pool**, derives symmetric `amountMin` floors, then does a same-transaction **pool-state pre-check** so the router's own slippage revert can never actually fire (it returns empty instead). Uses the zero-first approve (`approve(0)` then `approve(n)`) for tokens that reject nonzero→nonzero allowance changes.
- **A gated CowSwap strategy** — extends CR's CowSwap by *inheritance*, overriding `_prepareActions` to add a once-per-epoch lockout and a soft price-floor gate; when the gate is closed it returns empty and the Dispatcher moves on.
- **A price-floor gate** — `passes()` is a `try/catch` around the oracle: it returns *false* (never reverts) on a sub-threshold price, stale data, or an oracle that itself reverted.

## The patterns worth stealing

- **Self-guarding strategies, not failsafe reverts.** Every strategy returns empty actions when its preconditions aren't met (already fired this epoch, stale oracle, empty budget, pool out of band, gate closed). So the DAO needs no [failsafe bitmap](../../plugins/capital-router/plugins.md); nothing reverts as a guard.
- **Epoch lockout makes permissionless dispatch safe.** Each rate-limited strategy stores `lastEpoch` and consumes it *on entry* (even when it then returns empty), so a second `dispatch()` in the same epoch is a guaranteed no-op. That's why opening the trigger to anyone (a cron) is safe, the [permissionless-by-design](../../plugins/capital-router/dispatch-vs-request.md) argument, enforced in the strategy.
- **Sequential drain of one shared read-only budget.** Two strategies read the *same* stream budget; because the Dispatcher settles between them, strategy 2's `budget()` reflects strategy 1's spend, no share-ratio, no per-strategy ledger. Accepted trade-off: if both saturate in one tick they can spend up to ~2× the linear share, absorbed by setting the stream target with a buffer.
- **Oracle-anchored pricing + a same-tx pool pre-check** so the AMM's slippage revert never fires in practice, the strategy no-ops first instead.
- **Cross-DAO control without a plugin.** An owner DAO holds plain [`EXECUTE_PERMISSION_ID`](../../core/permissions.md) on the money-machine DAO. That's its sweep/emergency authority *and* how it refills: one owner-side proposal atomically transfers the inflow token and retargets the stream (an `onlyVault` setter, vault = the money-machine DAO) in a single `dao.execute`.

## The atomic deploy

The factory's `deployOnce()` is the [one-shot pattern](../dao-launchpad.md#correct-from-genesis) in full. Implementations are deployed once in the constructor and [cloned as EIP-1167 minimal proxies](../../common/proxies.md) during `deployOnce()`; the [DAO](../../core/dao.md) is created bare, then a single `dao.execute` of five [actions](../../core/execution.md) finishes everything:

```solidity
// inside deployOnce(), after createDao(...) + cloning the primitives/strategies
// + PSP.prepareInstallation(dispatcher, [wrap, univ2, cowswap]):
actions[0] = grant(dao, PSP, ROOT_PERMISSION)             // let PSP write the plugin's permissions
actions[1] = PSP.applyInstallation(...)                   // install the DispatcherPlugin
actions[2] = revoke(dao, PSP, ROOT_PERMISSION)            // PSP keeps no power
actions[3] = grant(dao, ownerDao, EXECUTE_PERMISSION_ID)     // hand over governance
actions[4] = revoke(dao, address(this), EXECUTE_PERMISSION_ID) // factory drops its bootstrap handle
dao.execute(callId, actions, 0);
```

Note what's *absent*: no `APPLY_INSTALLATION_PERMISSION` grant. The DAO is calling `PSP.applyInstallation` **on itself**, and the PSP short-circuits its apply-permission check when the caller is the target DAO (see [the PSP page](../../framework/plugin-setup-processor.md)), so only the PSP's temporary `ROOT` window is needed. When this transaction returns, the DAO is fully wired, the owner governs it, and the factory holds nothing, or, if any step had failed, none of it happened.

## Keep in mind

- **A custom budget/strategy/gate is just an interface implementation.** Nothing here modifies the `DispatcherPlugin`; the extension points are the Capital Router interfaces (`IDispatchBudget`, `IDispatchStrategy`, `IEpochProvider`, `IPriceOracle`).
- **Gates and guards must fail closed.** The gate and every strategy precondition return "do nothing" on any doubt, never revert the whole dispatch.
- **Share an epoch source.** Driving both the dispatch lockout and the stream denominator from one `IEpochProvider` keeps "budget tick" and "dispatch epoch" from drifting.

## See also

- [Capital Router](../../plugins/capital-router.md) and [what you can build](../../plugins/capital-router/use-cases.md) — the framework this extends, and the use-case catalogue it makes concrete.
- [Strategies](../../plugins/capital-router/strategies.md), [budgets](../../plugins/capital-router/budgets.md), [oracles](../../plugins/capital-router/oracles.md), [the plugins](../../plugins/capital-router/plugins.md).
- [DAO Launchpad](../dao-launchpad.md) — the workbench and the one-shot factory pattern.
- [PluginSetupProcessor](../../framework/plugin-setup-processor.md), [DAOFactory](../../framework/dao-factory.md), [permissions](../../core/permissions.md), [execution](../../core/execution.md).
