---
type: concept
title: The deployment checklist
tags: [security, process]
source: protocol-factory/README.md
---

# The deployment checklist

A production deployment, standing up [the protocol](/deployment/protocol-factory.md) on a chain, or running any high-stakes [launch](/deployment/dao-launchpad.md), is done as a deliberate **ceremony**, not an ad-hoc `just deploy`. The fullest, canonical version of the checklist lives in the [Protocol Factory](/deployment/protocol-factory.md)'s README; other repos adapt it with their own specifics. The steps look like bureaucracy, but each one buys a concrete **guarantee**, and that's the point: a deployment is effectively irreversible, so "did we do this right?" has to become a set of things that are *verified*, not hoped.

The on-chain half of this, the factory that deploys everything atomically and then [freezes into a read-only record](/deployment/protocol-factory.md#deploy-once-then-read-only-forever), is what makes these guarantees checkable after the fact. The checklist is the off-chain half that makes sure the right thing goes in.

## The guarantees it enforces

- **You deploy exactly the reviewed code.** Deploy from the official repo's `main`, with a clean `git status`, and have every member of the ceremony independently confirm the *same* commit hash. Afterwards, verify the contracts on the block explorer and diff them against OSx's audited commits. → the protocol that ends up running provably matches code that was reviewed and audited, not a local tweak.
- **The signing key is clean and isolated.** Use a fresh burner wallet, operated by a single person, from a trusted machine on a trusted network with no exposed ports (a disposable Docker environment is the recommended setup). → the deployment can't be contaminated by a stale or shared key, and there's no lasting key to leak (the [factory revokes its own power](/deployment/protocol-factory.md#correct-from-genesis) at the end regardless).
- **No surprises at broadcast.** Simulate the whole thing first (`predeploy`), keep the test suite green, and fund the wallet with margin over the simulated estimate. → the real broadcast is a rehearsed, funded, tested action rather than a gamble.
- **The result is recorded and independently attested.** The run is logged, and it emits an address-manifest artifact; console output, log, and artifact must agree, and every member confirms the values before they're trusted. → a tamper-evident, multi-party record of precisely what landed.
- **Clean exit.** Leftover deployer funds are refunded to their source, and the new addresses are synced into the canonical per-network config registries so the wider ecosystem can find them. → nothing dangling, and the deployment is discoverable.

## Keep in mind

- **Each item is a guarantee, not a formality.** Skipping one doesn't just skip a step, it removes the property that step secured (reviewed-code parity, key hygiene, a rehearsed broadcast, an attested record).
- **The canonical checklist lives with the code.** Treat the [Protocol Factory README](/deployment/protocol-factory.md) as the source of truth for the exact steps; this page is the *why* behind them, and other repos may add details this one omits.

## See also

- [Protocol Factory](/deployment/protocol-factory.md) — what a protocol deployment stands up, and the immutable on-chain record the ceremony produces.
- [DAO Launchpad](/deployment/dao-launchpad.md) — DAO-scale launches that follow the same discipline.
- [Deployment overview](/deployment/index.md).
