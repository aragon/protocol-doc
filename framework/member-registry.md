---
type: concept
title: Member registry
tags: [ens]
source: osx/src/framework/member/MemberRegistry.sol, osx/src/framework/member/IMemberRegistry.sol
---

# Member registry

The `MemberRegistry` is a **convenience fallback** for DAO members who want a human-friendly ENS name but would rather not buy one. Instead of registering a name on the open market, any address can claim a **free subdomain** under the parent the registry manages (an `initialize` parameter, not hardcoded; Aragon's deployment binds it to **`aragon.eth`**, so members claim `alice.aragon.eth`) and attach a profile to it (avatar, text records, contenthash). It's self-service and member-owned: you claim, manage, and give up your own name, nobody issues it to you. The point is simply that members can be addressable by name rather than a hex address, without the cost or hassle of their own ENS domain. It's the people-facing counterpart to the protocol's component [registries](./registries.md).

> A newer addition to the codebase (authored 2026, on a later compiler), layered onto the v1.4.0 core.

## How it works

- **Self-service, no permission.** Claiming (`register`), giving up (`release`), and renaming (`move`) are open to anyone. The only governed action is `evict` (gated by `EVICT_SUBDOMAIN_PERMISSION_ID`), a DAO's escape hatch to reclaim or reassign a name.
- **Members own their records.** The registry keeps ownership of each ENS subnode (the same custody pattern as the [ENSSubdomainRegistrar](./registries.md#ens-subdomains)) but grants each member *per-node resolver approval*, so a member sets their own avatar/text/contenthash directly on the resolver, no intermediary.
- **Name rules.** Subdomains are 3–50 characters, lowercase alphanumeric and dashes, with no leading or trailing dash.
- **Clean handover.** Releasing or moving a name clears its resolver records and address first, so a relinquished name never resolves to stale data.

## See also

- [Registries and ENS names](./registries.md) — the DAO/plugin registries and the shared subnode-custody pattern.
