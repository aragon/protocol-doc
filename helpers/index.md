# Helpers

Protocol **helpers**: contracts that support the core and plugins without being either.

- [Condition Library](./condition-library.md): ready-made [permission conditions](../common/permission-conditions.md) for common gating patterns (selector allow-lists, including per-chain lists for actions relayed to other chains, and Safe-owner gating) so a DAO needn't write bespoke ones (source: `conditions`).

**Exact signatures:** the generated [`conditions` ABI reference](../abi/conditions/index.md) has every public function, event, error and constant of these contracts, with its NatSpec.

## Where to start

Start with [permissions and conditions](../common/permission-conditions.md) before reading about the condition library.

_Helpers are neither core nor plugin, so unrelated contracts can accumulate in this area. If a third unrelated helper is added, give it its own area._
