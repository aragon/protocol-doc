---
type: reference
title: Source repositories
---

# Source repositories

Every part of the protocol is open source. The table lists each component's **canonical GitHub repository**, where you can read the code, file issues, or vendor it as a dependency. Most follow the `aragon/<the-obvious-name>` pattern.

The **Snapshot** column pins the exact commit each component's docs were generated from, the baseline to diff against when refreshing (see [Keeping the docs in sync](#keeping-the-docs-in-sync)).

| Component | Repository | Snapshot (docs generated from) |
|---|---|---|
| [OSx, core / framework / common](./core/index.md) | [`aragon/osx`](https://github.com/aragon/osx) | [`2c60f125`](https://github.com/aragon/osx/commit/2c60f12525) |
| [Token Voting](./plugins/token-voting-plugin.md) | [`aragon/token-voting-plugin`](https://github.com/aragon/token-voting-plugin) | [`e726c280`](https://github.com/aragon/token-voting-plugin/commit/e726c28061) |
| [Multisig](./plugins/multisig-plugin.md) | [`aragon/multisig-plugin`](https://github.com/aragon/multisig-plugin) | [`91410777`](https://github.com/aragon/multisig-plugin/commit/91410777e3) |
| [Admin](./plugins/admin-plugin.md) | [`aragon/admin-plugin`](https://github.com/aragon/admin-plugin) | [`c228ee0b`](https://github.com/aragon/admin-plugin/commit/c228ee0bca) |
| [Staged Proposal Processor](./plugins/spp-plugin.md) | [`aragon/staged-proposal-processor-plugin`](https://github.com/aragon/staged-proposal-processor-plugin) | [`a1d84e05`](https://github.com/aragon/staged-proposal-processor-plugin/commit/a1d84e0542) |
| [Lock to Vote](./plugins/lock-to-vote-plugin.md) | [`aragon/lock-to-vote-plugin`](https://github.com/aragon/lock-to-vote-plugin) | [`4bd0355e`](https://github.com/aragon/lock-to-vote-plugin/commit/4bd0355e36) |
| [Condition library](./helpers/condition-library.md) | [`aragon/conditions`](https://github.com/aragon/conditions) | [`7198a02a`](https://github.com/aragon/conditions/commit/7198a02ae1) |
| [Protocol Factory](./deployment/protocol-factory.md) | [`aragon/protocol-factory`](https://github.com/aragon/protocol-factory) | [`61a4d3d6`](https://github.com/aragon/protocol-factory/commit/61a4d3d6e5) |
| [DAO Launchpad](./deployment/dao-launchpad.md) | [`aragon/dao-launchpad`](https://github.com/aragon/dao-launchpad) | [`b9fb5947`](https://github.com/aragon/dao-launchpad/commit/b9fb59475a) |
| [artifacts-hub](./tooling/artifacts-hub.md) | [`aragon/artifacts-hub`](https://github.com/aragon/artifacts-hub) | [`ffcc2118`](https://github.com/aragon/artifacts-hub/commit/ffcc211894) |
| [Plugin template](./tooling/plugin-template.md) | [`aragon/osx-plugin-template`](https://github.com/aragon/osx-plugin-template) | [`fc2cc35f`](https://github.com/aragon/osx-plugin-template/commit/fc2cc35f0f) |
| [just-foundry](./tooling/just-foundry.md) | [`aragon/just-foundry`](https://github.com/aragon/just-foundry) | [`387cf295`](https://github.com/aragon/just-foundry/commit/387cf2953e) |
| [EVM Mirror](./tooling/evm-mirror.md) | [`aragon/evm-mirror`](https://github.com/aragon/evm-mirror) | [`0072576d`](https://github.com/aragon/evm-mirror/commit/0072576dbd) |

## Keeping the docs in sync

These docs are a **distillation of source at a point in time**, the Snapshot commit above. To refresh a component after its repo moves on:

1. `git -C <repo> diff <snapshot-commit> HEAD -- src/` (or the relevant paths) to see what actually changed.
2. Update the affected entries (their `source:` fields name the exact files), and re-verify examples.
3. **Bump the Snapshot commit** in the table above to the new baseline, and record the pass in log.md.

Pinning the commit (not just the repo) is what makes this a small, followable delta each time instead of a re-read from scratch.

