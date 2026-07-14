---
type: concept
title: The deployment checklist
tags: [security, process]
source: protocol-factory/README.md
---

# The deployment checklist

A production deployment, standing up [the protocol](./protocol-factory.md) on a chain, or running any high-stakes [launch](./dao-launchpad.md), is done as a deliberate **ceremony**, not an ad-hoc `just deploy`. The fullest, canonical version of the checklist lives in the [Protocol Factory](./protocol-factory.md)'s README; other repos adapt it with their own specifics. The steps look like bureaucracy, but each one buys a concrete **guarantee**, and that's the point: a deployment is effectively irreversible, so "did we do this right?" has to become a set of things that are *verified*, not hoped.

The on-chain half of this, the factory that deploys everything atomically and then [freezes into a read-only record](./protocol-factory.md#deploy-once-then-read-only-forever), is what makes these guarantees checkable after the fact. The checklist is the off-chain half that makes sure the right thing goes in.

## The ceremony, step by step

A recommended run, in order, using the [just-foundry](../tooling/just-foundry.md) recipes the repos ship. Each box maps to a [guarantee below](#the-guarantees-it-enforces). This mirrors the canonical checklist in the [Protocol Factory README](./protocol-factory.md); treat **each repo's README as authoritative** for its exact steps (some, e.g. token-voting, expose the same recipes as `make` targets rather than `just`).

**Prepare, reviewed code + a clean key**
- [ ] Clone the official repo and check out `main`; `git status` reports no local changes and matches `origin/main`.
- [ ] Work inside a **disposable Docker environment** (e.g. `docker run --rm -it -v .:/deployment … debian:trixie-slim`), install `just` + `git` + Foundry, then `just init <network>`.
- [ ] Create a fresh burner wallet with `cast wallet new` and use its key as `DEPLOYER_KEY`; you are the **sole operator**.
- [ ] Set secrets via [`vars`](../tooling/just-foundry.md) (optional, recommended) or the root `.env`: `vars set DEPLOYER_KEY`, `vars set ETHERSCAN_API_KEY`.
- [ ] Set the deployment parameters in the root `.env` (e.g. management-DAO min-approvals, members file, metadata URIs).
- [ ] `just env`, confirm every resolved value and its source is correct.
- [ ] The machine is on a trusted network with **no exposed ports**.

**Rehearse, no surprises at broadcast**
- [ ] `just test`, the suite runs clean.
- [ ] `just predeploy`, the simulation completes with no errors.
- [ ] `just balance`, the wallet holds **≥15% over** the simulated gas estimate.
- [ ] Every member pulls `main` and reports the **same `git log -n 1` commit hash**.

**Broadcast**
- [ ] `just deploy`, runs the tests, broadcasts, verifies, and tees to `logs/` (the factory deploys atomically and revokes its own power as the final step).

**Verify & attest**
- [ ] Contracts are verified on the target network's block explorer.
- [ ] The `logs/deployment-<network>-<date>.log`, the console output, and the `artifacts/addresses-<network>-<timestamp>.json` manifest **all agree**; every member confirms the addresses.
- [ ] Diff the verified on-chain sources against the **exact commit you deployed** (and the audit it corresponds to) with [EVM Mirror](../tooling/evm-mirror.md).

**Close out**
- [ ] `just refund`, return leftover deployer funds to the address that funded the wallet.
- [ ] Publish the log, the address manifest, and the broadcast file to a shared location, and sync the addresses into the per-network config so the ecosystem can find them.

## The guarantees it enforces

- **You deploy exactly the reviewed code.** Deploy from the official repo's `main`, with a clean `git status`, and have every member of the ceremony independently confirm the *same* commit hash. Afterwards, verify the contracts on the block explorer and diff them ([EVM Mirror](../tooling/evm-mirror.md)) against the exact commit you deployed and the audit it corresponds to. → the code that ends up running provably matches what was reviewed and audited, not a local tweak.
- **The signing key is clean and isolated.** Use a fresh burner wallet, operated by a single person, from a trusted machine on a trusted network with no exposed ports (a disposable Docker environment is the recommended setup). → the deployment can't be contaminated by a stale or shared key, and there's no lasting key to leak (the [factory revokes its own power](./protocol-factory.md#correct-from-genesis) at the end regardless).
- **No surprises at broadcast.** Simulate the whole thing first (`predeploy`), keep the test suite green, and fund the wallet with margin over the simulated estimate. → the real broadcast is a rehearsed, funded, tested action rather than a gamble.
- **The result is recorded and independently attested.** The run is logged, and it emits an address-manifest artifact; console output, log, and artifact must agree, and every member confirms the values before they're trusted. → a tamper-evident, multi-party record of precisely what landed.
- **Clean exit.** Leftover deployer funds are refunded to their source, and the new addresses are synced into the canonical per-network config registries so the wider ecosystem can find them. → nothing dangling, and the deployment is discoverable.

## Keep in mind

- **Each item is a guarantee, not a formality.** Skipping one doesn't just skip a step, it removes the property that step secured (reviewed-code parity, key hygiene, a rehearsed broadcast, an attested record).
- **The canonical checklist lives with the code.** Treat the [Protocol Factory README](./protocol-factory.md) as the source of truth for the exact steps; this page is the *why* behind them, and other repos may add details this one omits.

## See also

- [Protocol Factory](./protocol-factory.md) — what a protocol deployment stands up, and the immutable on-chain record the ceremony produces.
- [DAO Launchpad](./dao-launchpad.md) — DAO-scale launches that follow the same discipline.
- [Deployment overview](./index.md).
