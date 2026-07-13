---
type: reference
title: Source repositories
---

# Source repositories

Every part of the protocol is open source. This maps each component to its **canonical GitHub repository**, where to read the code, file issues, or vendor it as a dependency. Most are `aragon/<the-obvious-name>`; three are **not** what you'd guess, the SPP, the condition library, and the plugin template.

| Component | Repository |
|---|---|
| [OSx, core / framework / common](./core/index.md) | [`aragon/osx`](https://github.com/aragon/osx) |
| [Token Voting](./plugins/token-voting-plugin.md) | [`aragon/token-voting-plugin`](https://github.com/aragon/token-voting-plugin) |
| [Multisig](./plugins/multisig-plugin.md) | [`aragon/multisig-plugin`](https://github.com/aragon/multisig-plugin) |
| [Admin](./plugins/admin-plugin.md) | [`aragon/admin-plugin`](https://github.com/aragon/admin-plugin) |
| [Staged Proposal Processor](./plugins/spp-plugin.md) | [`aragon/staged-proposal-processor-plugin`](https://github.com/aragon/staged-proposal-processor-plugin) |
| [Lock to Vote](./plugins/lock-to-vote-plugin.md) | [`aragon/lock-to-vote-plugin`](https://github.com/aragon/lock-to-vote-plugin) |
| [Capital Router](./plugins/capital-router.md) | [`aragon/capital-router`](https://github.com/aragon/capital-router) |
| [Condition library](./helpers/condition-library.md) | [`aragon/conditions`](https://github.com/aragon/conditions) |
| [Protocol Factory](./deployment/protocol-factory.md) | [`aragon/protocol-factory`](https://github.com/aragon/protocol-factory) |
| [DAO Launchpad](./deployment/dao-launchpad.md) | [`aragon/dao-launchpad`](https://github.com/aragon/dao-launchpad) |
| [Plugin template](./tooling/plugin-template.md) | [`aragon/osx-plugin-template`](https://github.com/aragon/osx-plugin-template) |
| [just-foundry](./tooling/just-foundry.md) | [`aragon/just-foundry`](https://github.com/aragon/just-foundry) |

The three non-obvious ones: the **SPP** repo is `staged-proposal-processor-plugin` (not `spp`), the **condition library** is `conditions` (not `condition-library`), and the **plugin template** is `osx-plugin-template` (it dropped the `-foundry` suffix). osx-commons is not a repo, it folded into `osx` at `src/common`.
