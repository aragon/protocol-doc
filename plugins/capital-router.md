---
type: concept
title: Capital Router
tags: [automation, treasury]
source: capital-router/src/DispatcherPlugin.sol, capital-router/src/RequesterPlugin.sol, capital-router/src/DispatchHubPlugin.sol
---

# Capital Router

The Capital Router is a framework of OSx plugins for **automated treasury flows**: payroll, epoch rewards, DCA swaps, buyback-and-burn, streaming grants, gauge-directed emissions ([the full catalogue of what you can build](/plugins/capital-router/use-cases.md)). It is **not a governance plugin**, and that distinction is the first thing to hold onto.

## It's a policy, not a vote

The [governance plugins](/plugins/index.md) exist to *make a decision each time*: draft a proposal, vote, execute. That's right for one-off actions, but wrong for anything recurring or rule-based, re-proposing "send this month's payroll" every month is friction with no governance value, because the *rule* was already decided; only the date and amounts change.

Capital Router inverts that. A DAO **encodes the capital-flow rule once, as a policy**: it installs and configures a router plugin through its normal governance (a single proposal, via the [PluginSetupProcessor](/framework/plugin-setup-processor.md)). From then on the flow **executes automatically, with no new vote each time**. The one-time governance act is *adopting the policy*; the recurring execution is just anyone (or a permissioned operator) pulling the trigger. Nobody votes on each payout.

Crucially, opening execution to "anyone" is safe here precisely because **the outcome is predetermined by the policy**, the budget, the recipients, and the split are all fixed at configuration; a trigger only controls *when* funds move, never *where* or *how much*.

Like every plugin, it **never holds funds**: it builds an [`Action[]`](/core/execution.md) and asks the DAO to [`execute`](/core/execution.md) it *as the DAO*. The novelty is entirely in the layer above `execute()`: deciding which actions to build, on which trigger, gated by which rule.

## The model: Strategy = Budget + Splitter

Every flow decomposes into two questions, answered by two pluggable pieces, glued by a third:

- A **[Budget](/plugins/capital-router/budgets.md)** answers *"how much is available?"* (the whole balance, a fixed amount, a streaming unlock).
- A **[Splitter](/plugins/capital-router/splitters.md)** answers *"who gets what share?"* (equal, by ratio, tiered, gauge-weighted).
- A **[Strategy](/plugins/capital-router/strategies.md)** composes a Budget with (optionally) a Splitter and turns the numbers into DAO actions (transfer, swap, burn).

Think of the whole framework as a **standard library of composable building blocks**: a handful of budgets, splitters, and strategies you mix, match, and configure to suit your needs. Because "how much" and "who" are pluggable dependencies wired together at install time, that small set of primitives powers a very wide range of scenarios and automations, no new contract per use case. Swap and burn strategies need only a Budget (there's one implicit destination); transfer strategies need both.

## Two flow directions: dispatch vs. request

The framework's central axis, everything else hangs off it:

| | **Dispatch** (push) | **Request** (pull) |
|---|---|---|
| Trigger | anyone calls `dispatch()`, once, for everyone | each beneficiary calls `request()` for themselves |
| State | atomic, no per-caller memory | caller-aware: tracks what each address already claimed |
| Pays | all recipients in one transaction | just the caller's slice, on their own schedule |
| Analogy | the DAO *pushes* funds out to everyone | each beneficiary *pulls* their own slice |

[Dispatch vs. Request](/plugins/capital-router/dispatch-vs-request.md) is worth its own read: the split is baked into the interfaces (dispatch budgets/splitters take no caller argument; request ones take caller-specific `data`), and it determines idempotency and who moves the money.

## The pieces

- [The plugins](/plugins/capital-router/plugins.md) — `DispatcherPlugin` (push), `RequesterPlugin` (pull), and `DispatchHubPlugin` (fan a dispatch out across many dispatchers, even on other DAOs). Plus the failsafe map, sequential execution, and the permission table.
- [Dispatch vs. request](/plugins/capital-router/dispatch-vs-request.md) — the push/pull axis in depth.
- [Budgets](/plugins/capital-router/budgets.md) — Full, Required, Fixed, Streaming.
- [Splitters](/plugins/capital-router/splitters.md) — Solo, Equal, Ratio, Tiered, gauge-weighted.
- [Strategies](/plugins/capital-router/strategies.md) — transfer, epoch-gated, burn, and the oracle-protected swaps.
- [Oracles](/plugins/capital-router/oracles.md) — the price feeds the swap strategies use for slippage protection.
- [What you can build](/plugins/capital-router/use-cases.md) — the composition catalogue: payroll, vesting, DCA, buybacks, rewards, and the extension points.

## Keep in mind

- **The policy is a one-time approval; the flow then recurs on its own.** Governance approves *installing/configuring* the router; after that, dispatches happen with no vote each time. Getting the policy right up front is the whole safety model.
- **Triggering is open by default, and that's fine.** `dispatch()` is permissionless out of the box because the config, not the caller, decides where funds go; a trigger only picks the moment. Restrict it (via [permissions](/core/permissions.md)/[conditions](/common/permission-conditions.md)) only if *timing* itself needs controlling.
- **The router holds nothing.** It composes actions the DAO runs; underfunded budgets or bad recipients surface as `execute()` reverts, not as lost custody.

## See also

- [The plugin framework](/framework/plugins.md) and [plugin setup](/framework/plugin-setup.md) — how these install (as cloneable plugins) and act on the DAO.
- [Actions and execution](/core/execution.md) and [permissions](/core/permissions.md) — the `execute`/`auth` model every flow rides on.
- [Governance plugins](/plugins/index.md) — the vote-each-proposal counterpart Capital Router deliberately isn't.
