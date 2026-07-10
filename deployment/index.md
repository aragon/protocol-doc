# Deployment

Deploying the protocol itself and the DAOs built on it.

- [Protocol Factory](/deployment/protocol-factory.md) — one-shot deployment of the whole OSx stack (framework + ENS + the governing Management DAO + core plugin repos) onto a new EVM chain (source: `protocol-factory`).
- [DAO Launchpad](/deployment/dao-launchpad.md) — the deployment workbench that drives real DAO creation on top of a deployed protocol, via a correct-from-genesis on-chain factory (source: `dao-launchpad`).

The two share one best practice, the **correct-from-genesis one-shot factory**: everything is wired in a single atomic, verifiable deployment that ends with the factory holding no power. One does it at protocol scale, the other at DAO scale.

## Key pages

- [The deployment checklist](/deployment/deployment-checklist.md) — the guarantees a safe production deployment ceremony enforces, and why each one matters.
- [The money machine](/deployment/dao-launchpad/money-machine.md) — a worked example, end to end, and the richest illustration of the [Capital Router](/plugins/capital-router.md) in practice.

## Where to start

Understand the [core](/core/index.md) (what gets deployed and why) before the factory (how it all gets deployed at once). Then read the [Protocol Factory](/deployment/protocol-factory.md) (standing up OSx itself), the [DAO Launchpad](/deployment/dao-launchpad.md), and its [money-machine worked example](/deployment/dao-launchpad/money-machine.md).
