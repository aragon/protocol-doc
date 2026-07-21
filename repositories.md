---
type: reference
title: Source repositories
---

# Source repositories

Every part of the protocol is open source. This maps each component to its **canonical GitHub repository**, where to read the code, file issues, or vendor it as a dependency. Most follow the `aragon/<the-obvious-name>` pattern.

The **Snapshot** column pins the exact commit each component's docs were generated from, the baseline to diff against when refreshing (see [Keeping the docs in sync](#keeping-the-docs-in-sync)).

| Component | Repository | Snapshot (docs generated from) |
|---|---|---|
| [OSx, core / framework / common](./core/index.md) | [`aragon/osx`](https://github.com/aragon/osx) | [`4100bcf0`](https://github.com/aragon/osx/commit/4100bcf0bc) |
| [Token Voting](./plugins/token-voting-plugin.md) | [`aragon/token-voting-plugin`](https://github.com/aragon/token-voting-plugin) | [`e97b783d`](https://github.com/aragon/token-voting-plugin/commit/e97b783d76) |
| [Multisig](./plugins/multisig-plugin.md) | [`aragon/multisig-plugin`](https://github.com/aragon/multisig-plugin) | [`d0342706`](https://github.com/aragon/multisig-plugin/commit/d034270646) |
| [Admin](./plugins/admin-plugin.md) | [`aragon/admin-plugin`](https://github.com/aragon/admin-plugin) | [`ef1727ab`](https://github.com/aragon/admin-plugin/commit/ef1727abaf) |
| [Staged Proposal Processor](./plugins/spp-plugin.md) | [`aragon/staged-proposal-processor-plugin`](https://github.com/aragon/staged-proposal-processor-plugin) | [`676617a9`](https://github.com/aragon/staged-proposal-processor-plugin/commit/676617a9ca) |
| [Lock to Vote](./plugins/lock-to-vote-plugin.md) | [`aragon/lock-to-vote-plugin`](https://github.com/aragon/lock-to-vote-plugin) | [`5a513e3d`](https://github.com/aragon/lock-to-vote-plugin/commit/5a513e3d9f) |
| [Capital Router](./plugins/capital-router.md) | [`aragon/capital-router`](https://github.com/aragon/capital-router) | [`75fb97d4`](https://github.com/aragon/capital-router/commit/75fb97d4d2) |
| [Condition library](./helpers/condition-library.md) | [`aragon/conditions`](https://github.com/aragon/conditions) | [`7a9bb0df`](https://github.com/aragon/conditions/commit/7a9bb0dfb1) |
| [Protocol Factory](./deployment/protocol-factory.md) | [`aragon/protocol-factory`](https://github.com/aragon/protocol-factory) | [`444bc98a`](https://github.com/aragon/protocol-factory/commit/444bc98a4b) |
| [DAO Launchpad](./deployment/dao-launchpad.md) | [`aragon/dao-launchpad`](https://github.com/aragon/dao-launchpad) | [`b9fb5947`](https://github.com/aragon/dao-launchpad/commit/b9fb59475a) |
| [Plugin template](./tooling/plugin-template.md) | [`aragon/osx-plugin-template`](https://github.com/aragon/osx-plugin-template) | [`e43cf300`](https://github.com/aragon/osx-plugin-template/commit/e43cf30032) |
| [just-foundry](./tooling/just-foundry.md) | [`aragon/just-foundry`](https://github.com/aragon/just-foundry) | [`885dea0d`](https://github.com/aragon/just-foundry/commit/885dea0d8e) |
| [EVM Mirror](./tooling/evm-mirror.md) | [`aragon/evm-mirror`](https://github.com/aragon/evm-mirror) | [`0072576d`](https://github.com/aragon/evm-mirror/commit/0072576dbd) |

## Keeping the docs in sync

These docs are a **distillation of source at a point in time**, the Snapshot commit above. To refresh a component after its repo moves on:

1. `git -C <repo> diff <snapshot-commit> HEAD -- src/` (or the relevant paths) to see what actually changed.
2. Update the affected entries (their `source:` fields name the exact files), and re-verify examples.
3. **Bump the Snapshot commit** in the table above to the new baseline, and record the pass in log.md.

Pinning the commit (not just the repo) is what makes this a small, followable delta each time instead of a re-read from scratch.

