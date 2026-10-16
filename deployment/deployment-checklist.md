---
type: concept
title: The deployment checklist
tags: [security, process]
source: protocol-factory/README.md
---

# The deployment checklist

A production deployment of [the protocol](./protocol-factory.md) or a [DAO launch](./dao-launchpad.md) follows a **ceremony**: a sequence of checks around `just deploy`. The canonical checklist lives in the [Protocol Factory](./protocol-factory.md)'s README; other repos adapt it with their own specifics. Deployment is effectively irreversible, so each step verifies a concrete **guarantee** before the result is accepted.

The factory deploys everything atomically and then [freezes into a read-only record](./protocol-factory.md#deploy-once-then-read-only-forever), making these guarantees checkable onchain after deployment. The off-chain checklist verifies the code, configuration, and procedure used for that deployment.

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
- [ ] Diff the verified onchain sources against the **exact commit you deployed** (and the audit it corresponds to) with [EVM Mirror](../tooling/evm-mirror.md).

**Close out**
- [ ] `just refund`, return leftover deployer funds to the address that funded the wallet.
- [ ] Publish the log, the address manifest, and the broadcast file to a shared location, and sync the addresses into the per-network config so the ecosystem can find them.

## The guarantees it enforces

- **You deploy exactly the reviewed code.** Deploy from the official repo's `main`, with a clean `git status`, and have every member of the ceremony independently confirm the *same* commit hash. Afterwards, verify the contracts on the block explorer and diff them ([EVM Mirror](../tooling/evm-mirror.md)) against the exact commit you deployed and the audit it corresponds to. These checks prove that the running code matches what was reviewed and audited, including the absence of local modifications.
- **The signing key is clean and isolated.** Use a fresh burner wallet, operated by a single person, from a trusted machine on a trusted network with no exposed ports (a disposable Docker environment is the recommended setup). This avoids a stale or shared key, and there is no lasting key to leak. The [factory revokes its own power](./protocol-factory.md#correct-from-genesis) at the end regardless.
- **The broadcast is rehearsed, funded, and tested.** Simulate the deployment first (`predeploy`), keep the test suite passing, and fund the wallet with margin over the simulated estimate.
- **The result is recorded and independently attested.** The run is logged, and it emits an address-manifest artifact. Console output, log, and artifact must agree, and every member confirms the values before they're trusted. Together they form a tamper-evident, multi-party record of what was deployed.
- **Clean exit.** Refund leftover deployer funds to their source and sync the new addresses into the canonical per-network config registries. This closes out the deployment and lets the wider ecosystem find it.

## Keep in mind

- **Each item secures a specific property.** Skipping it removes that guarantee: reviewed-code parity, key hygiene, a rehearsed broadcast, or an attested record.
- **The canonical checklist lives with the code.** Treat the [Protocol Factory README](./protocol-factory.md) as the source of truth for the exact steps. Other repos may require additional checks.

## See also

- [Protocol Factory](./protocol-factory.md) — what a protocol deployment stands up, and the immutable onchain record the ceremony produces.
- [DAO Launchpad](./dao-launchpad.md) — DAO-scale launches that follow the same discipline.
- [Deployment overview](./index.md).
