---
type: concept
title: Capital Router oracles
tags: [automation, treasury]
source: capital-router/src/interfaces/IPriceOracle.sol, capital-router/src/oracles/ChainlinkPriceOracle.sol, capital-router/src/oracles/UniswapV3TWAPOracle.sol, capital-router/src/oracles/MultiPriceOracle.sol
---

# Capital Router oracles

The [swap strategies](./strategies.md) (Uniswap, CowSwap) need a notion of *fair price* to compute a minimum acceptable output and refuse a bad fill, without it, a swap dispatch is a sandwich/MEV target. A **price oracle** provides that, behind one interface:

```solidity
interface IPriceOracle {
    function getPrice(address tokenA, address tokenB) external view returns (uint256 price, uint256 updatedAt);
    function supportsPair(address tokenA, address tokenB) external view returns (bool);
    function oracleId() external pure returns (string memory);
}
```

`price` is scaled by `1e18` and applies to **raw (wei) amounts** directly (`out = in * price / 1e18`), each oracle normalizes its own feed's decimals into that convention, so callers never juggle decimals.

## Three implementations

- **Chainlink** — resolves a price three ways, in order: the mainnet Feed Registry (zero-config, auto-lookup), then manually-configured direct pair feeds, then USD routing (`tokenA/USD ÷ tokenB/USD`). Admin-gated feed configuration (`setDirectFeed`/`setUsdFeed`). It guards against bad/stale rounds (`answer > 0`, `answeredInRound >= roundId`) but the *freshness window* (max staleness) is enforced by the swap strategy, not here. The Feed Registry is mainnet-only; on L2s you configure feeds manually.
- **Uniswap V3 TWAP** — a time-weighted average from a pool's observation history over a fixed interval (30 minutes is the usual choice), resistant to single-block/flash-loan manipulation by construction. Fully **immutable** (factory, fee tier, interval fixed at deploy, no admin); needs the pool to have enough observation history (`InsufficientObservationHistory` otherwise). Its `updatedAt` is the pool's last-observation time, i.e. how stale the underlying activity is.
- **Multi** — an ordered **fallback chain** of other oracles: it returns the first that both supports the pair and yields a non-zero price. It is *not* a consensus or averaging mechanism, it's redundancy (a common setup is Chainlink first, TWAP as backup). Admin-gated oracle list.

Chainlink and Multi are typically deployed as **network-wide singletons administered by Aragon's Management DAO** (one shared oracle registry serving every DAO), rather than each DAO deploying its own; the TWAP oracle has no admin at all.

## Revert-or-protect

The key security property, shared by both swap strategies: if an oracle is configured it **must** return a valid, fresh price or the swap **reverts** entirely, there is no silent degrade to zero protection. And in the current code an oracle is **mandatory** (both swap strategies revert `NoPriceOracle` on a zero address), so "swap without price protection" simply isn't a reachable configuration. A `Multi` chain that exhausts all its members reverts `AllOraclesFailed`, which likewise blocks the swap rather than filling blind.

## Keep in mind

- **A swap strategy without a working oracle doesn't swap, it reverts.** That's intentional: better a failed dispatch than a sandwiched one.
- **`Multi` is fallback, not consensus.** It returns the first working oracle's price; it does not cross-check or average, so the chain is only as trustworthy as its first responder for a given pair.
- **TWAP quality depends on the pool.** Thin liquidity or too short an interval weakens the guarantee; ensure the pool has sufficient observation cardinality.

## See also

- [Strategies](./strategies.md) — the swap strategies that consume these and enforce the staleness window.
- [Capital Router overview](../capital-router.md).
