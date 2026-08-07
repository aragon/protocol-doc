# Core

The heart of Aragon **OSx**: the [DAO](./dao.md) contract and the authorization model it runs on. Source: [`osx`](https://github.com/aragon/osx) `src/core`.

This is the smallest, most fundamental layer, what a DAO *is* and how it decides who may do what. Read it first; everything else builds on it.

**Exact signatures:** the generated [`osx` ABI reference](../abi/osx/index.md) has every public function, event, error and constant of these contracts, with its NatSpec.

- [The DAO contract](./dao.md) — one contract that *is* the organization: treasury, executor, permission database, signer.
- [The permission system](./permissions.md) — the `(where, who, permissionId)` model that gates every privileged action. **The keystone concept.**
- [Actions and execution](./execution.md) — how a DAO acts on the world: the `Action` batch, `execute`, and partial-failure handling.
- [DAO signature validation (EIP-1271)](./signature-validation.md) — how a DAO "signs", by delegating to its permissions.
- [DAO metadata](./dao-metadata.md) — the name/description/avatar/links JSON and the EIP-4824 `daoURI`, and why the app-facing blob isn't stored on-chain.

## The other two layers

The rest of the `osx` repo sits in two sibling areas:

- **[Common](../common/index.md)** — the shared cross-cutting primitives (now within osx at `src/common`, formerly the standalone osx-commons library) that the core, framework, and plugins reuse: conditions, proposals, membership, ratio, auth, and low-level utilities.
- **[Framework](../framework/index.md)** — what a plugin *is* and how it's built and installed: the plugin model, base types, and setup, plus the PluginRepo, the PluginSetupProcessor, the factories, and the registries.

From there, [plugins](../plugins/index.md) are the concrete governance modules built on all three.
