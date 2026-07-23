# Deployment

Deploying the protocol itself and the DAOs built on it.

- [Protocol Factory](./protocol-factory.md) — one-shot deployment of the whole OSx stack (framework + ENS + the governing Management DAO + core plugin repos) onto a new EVM chain (source: `protocol-factory`).
- [DAO Launchpad](./dao-launchpad.md) — the deployment workbench that drives real DAO creation on top of a deployed protocol, via a correct-from-genesis on-chain factory (source: `dao-launchpad`).

The two share one best practice, the **correct-from-genesis one-shot factory**: everything is wired in a single atomic, verifiable deployment that ends with the factory holding no power. One does it at protocol scale, the other at DAO scale.

## Key pages

- [The deployment checklist](./deployment-checklist.md) — the guarantees a safe production deployment ceremony enforces, and why each one matters.

## Where to start

Understand the [core](../core/index.md) (what gets deployed and why) before the factory (how it all gets deployed at once). Then read the [Protocol Factory](./protocol-factory.md) (standing up OSx itself) and the [DAO Launchpad](./dao-launchpad.md).
