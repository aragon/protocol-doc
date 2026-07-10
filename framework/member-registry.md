---
type: concept
title: Member registry
tags: [core, ens]
source: osx/src/framework/member/MemberRegistry.sol, osx/src/framework/member/IMemberRegistry.sol
---

# Member registry

The `MemberRegistry` gives the people who participate in DAOs a **self-sovereign on-chain identity**: any address can claim a human-readable ENS subdomain (e.g. `alice.members.dao.eth`) and attach a profile to it (avatar, text records, contenthash). It exists so that members are addressable by name, not just by a hex address, and so that identity is something a person owns and controls directly rather than something an admin issues. It's the identity counterpart to the protocol's [DAO and plugin registries](/framework/registries.md).

> A newer addition to the codebase (authored 2026, on a later compiler), layered onto the v1.4.0 core.

## How it works

- **Self-service, no permission.** Claiming (`register`), giving up (`release`), and renaming (`move`) are open to anyone. The only governed action is `evict` (gated by `EVICT_SUBDOMAIN_PERMISSION_ID`), a DAO's escape hatch to reclaim or reassign a name.
- **Members own their records.** The registry keeps ownership of each ENS subnode (the same custody pattern as the [ENSSubdomainRegistrar](/framework/registries.md#ens-subdomains)) but grants each member *per-node resolver approval*, so a member sets their own avatar/text/contenthash directly on the resolver, no intermediary.
- **Name rules.** Subdomains are 3–50 characters, lowercase alphanumeric and dashes, with no leading or trailing dash.
- **Clean handover.** Releasing or moving a name clears its resolver records and address first, so a relinquished name never resolves to stale data.

## See also

- [Registries and ENS names](/framework/registries.md) — the DAO/plugin registries and the shared subnode-custody pattern.
