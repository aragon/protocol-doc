# Common

The **shared cross-cutting primitives** of Aragon OSx. These were once a separate `osx-commons` library; they now live **within osx itself**, at `src/common` in the [`osx`](https://github.com/aragon/osx) repo, there is no separate osx-commons package to install. (In Solidity you import them directly from osx, `@aragon/osx/common/…`.) They are the reusable pieces the [core](/core/index.md), the [framework](/framework/index.md), and every [plugin](/plugins/index.md) draw on: authorization, governance primitives, and low-level utilities.

_What it means to *be* a plugin, the base contracts, the setup, and the plugin model, lives in the [framework](/framework/index.md), since a plugin is defined by using the framework to operate a DAO. This area is the primitives it reuses._

## Authorization building blocks

- [Authorizing against a DAO](/common/auth.md) — `DaoAuthorizable` and the `auth` modifier: how any contract defers access control to a DAO.
- [Permission conditions](/common/permission-conditions.md) — dynamic, on-chain authorization logic (`IPermissionCondition`).
- [RuledCondition](/common/ruled-condition.md) — a declarative rule engine for composing conditions.

## Governance primitives

- [Proposals](/common/proposal.md) — the shared proposal shape and lifecycle every governance plugin reuses.
- [Membership and the address list](/common/membership.md) — snapshot-safe membership.
- [Ratio](/common/ratio.md) — fixed-point threshold math (`RATIO_BASE`).

## Low-level utilities

- [Proxy deployment](/common/proxies.md) — UUPS and minimal-proxy mechanics, and the storage-layout discipline they require.
- [Protocol version](/common/protocol-version.md) — the protocol-version convention (distinct from a plugin's release/build).

## Where these are used

The [core](/core/index.md), the [framework](/framework/index.md), and every [plugin](/plugins/index.md) build on these, deferring access control to a DAO, reusing the governance primitives, and wiring conditions from here.
