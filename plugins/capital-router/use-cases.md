---
type: concept
title: What you can build with the Capital Router
tags: [automation, treasury, capital-router]
source: capital-router/src/strategies, capital-router/src/budgets, capital-router/src/splitters, capital-router/src/DispatcherPlugin.sol, capital-router/src/RequesterPlugin.sol
---

# What you can build

The point of the [Capital Router](/plugins/capital-router.md) is that most treasury "products" are not distinct contracts, they are a **configuration** of the same few [building blocks](/plugins/capital-router.md): a [budget](/plugins/capital-router/budgets.md) (how much) × a [splitter](/plugins/capital-router/splitters.md) (who) × a [strategy](/plugins/capital-router/strategies.md) (what action) × a [direction](/plugins/capital-router/dispatch-vs-request.md) (push or pull). Read the catalog below as *recipes over one pantry*, not a feature list.

The value that recurs across all of them: **governance sets the rule once, then capital moves on policy** (recurring, deterministic, auditable, with no discretionary hand on each transaction) instead of a fresh proposal per payment.

## Composes directly today

| Scenario | Composition | Direction |
|---|---|---|
| **Payroll / vendors, batch** | Fixed/Required budget + Ratio (or Equal) splitter + [EpochTransfer](/plugins/capital-router/strategies.md) (once-per-period) | dispatch |
| **Continuous streaming pay** | [Stream budget](/plugins/capital-router/budgets.md) + Ratio splitter + Transfer | dispatch or request |
| **Token vesting (linear / tranche)** | Stream budget (linear) or EpochTransfer (tranche) + Solo/Ratio splitter | request (beneficiary claims) |
| **Budget controls / spend caps** | Required or Fixed budget = hard cap; `maxBudget` on a stream = rolling cap; Tiered splitter = brackets; one strategy per asset = per-asset limits | either |
| **DCA / programmatic accumulation** | Fixed budget + [Uniswap/CowSwap](/plugins/capital-router/strategies.md) + [oracle](/plugins/capital-router/oracles.md), gated once-per-cadence by EpochTransfer-style timing | dispatch |
| **Treasury rebalancing** | swap strategies + oracle, Ratio splitter to hit target weights | dispatch |
| **Buyback + burn** | swap strategy **then** [Burn](/plugins/capital-router/strategies.md), two strategies in one Dispatcher (settle-before-next feeds the burn the swapped proceeds) | dispatch |
| **Buyback + redistribute / retain** | swap **then** Transfer+splitter (redistribute), or swap alone leaving proceeds in the treasury (retain) | dispatch |
| **Rewards / fee sharing** | [gauge splitter](/plugins/capital-router/splitters.md) (staking, LP, governance-participation weights) or Ratio splitter + Transfer | dispatch (pay all) or request (each claims) |

The recurring trick for pipelines (DCA, buyback-and-burn, rebalance) is the Dispatcher's [settle-before-next ordering](/plugins/capital-router/plugins.md): a later strategy reads the vault *after* an earlier one ran, so "swap, then act on the proceeds" just works by listing two strategies in order.

## Shaped for, but needs a new block

These fit the architecture, the plugins and interfaces anticipate them, but they need a strategy or splitter that isn't in the current shipped set. Each plugs in **without touching the plugins**, which is the design payoff: extend by adding a block, not by forking.

- **Merkle airdrops / claimable distributions.** The [request path](/plugins/capital-router/dispatch-vs-request.md) is already the right shape: `request(bytes data)` passes a caller-specific blob, and the interface docs explicitly cite *a Merkle proof* as its intended payload. What's missing is a claim splitter that verifies the proof against a root. The rest (caller-aware, pay-once) is built in.
- **Escrow / milestone release.** Compose a dispatch behind a [condition](/common/permission-conditions.md) or external attestor (release only when an authorized party confirms), milestones as a Tiered split or sequenced budgets. The gating rides the [permission system](/core/permissions.md), not a router primitive; clawback/slash is `setPaused` + governance.
- **Two-sided issuance: token sale, migration/upgrade.** Today's request strategies pay *out* one-sided; a user *exchanging* an asset for the DAO's token needs a strategy that also pulls the caller's input under a pricing rule. A natural new strategy, the caller-aware `request` plumbing is already there.
- **Pro-rata redemption ("ragequit").** Burn the caller's governance tokens and pay their proportional treasury share, a redemption strategy pairing a pro-rata budget with the caller-aware request path.
- **Yield deployment / POL / harvest.** Depositing into a vault (ERC-4626) or harvesting LP fees needs a deposit/harvest strategy beyond the current Transfer/Swap/Burn trio.

## Keep in mind

- **Most "products" are a config, not a contract.** Reach for a new strategy/splitter only when no combination of the existing blocks expresses the rule, the table above is assembled entirely from shipped pieces.
- **Push vs. pull is the first choice.** Pay *everyone on a schedule* → [dispatch](/plugins/capital-router/dispatch-vs-request.md); let *each recipient claim their own slice* → request. It dictates idempotency and who pays gas.
- **Extensions are additive.** New scenarios arrive as new strategies/splitters behind the same [`prepareActions`](/plugins/capital-router/strategies.md) interface; the Dispatcher/Requester plugins don't change. The [money-machine example](/deployment/dao-launchpad/money-machine.md) does exactly this: a custom budget, a custom strategy, and one extending CR's CowSwap, all driven by the stock Dispatcher.

## See also

- [Capital Router overview](/plugins/capital-router.md) and the [Strategy = Budget + Splitter](/plugins/capital-router.md) model.
- [Budgets](/plugins/capital-router/budgets.md), [Splitters](/plugins/capital-router/splitters.md), [Strategies](/plugins/capital-router/strategies.md), [Oracles](/plugins/capital-router/oracles.md), [Dispatch vs. request](/plugins/capital-router/dispatch-vs-request.md).
- [The money machine](/deployment/dao-launchpad/money-machine.md) — these extension points, built out as a worked example.
