---
type: concept
title: Membership and the address list
tags: [governance-primitive]
source: osx/src/common/plugin/extensions/membership/IMembership.sol, osx/src/common/plugin/extensions/governance/Addresslist.sol
---

# Membership and the address list

Most governance [plugins](../framework/plugins.md) need a notion of "who counts": multisig signers, addresslist voters, token holders. Two reusable pieces standardize that.

## `IMembership`: the discovery interface

Any plugin that defines membership should implement `IMembership`, a tiny interface, `isMember(address)` plus `MembersAdded` / `MembersRemoved` events. Its real value is **discoverability**: UIs and indexers can query and track membership uniformly across every plugin.

It also allows *delegated* membership via `MembershipContractAnnounced`: a plugin can point at a **different** contract as the authority on membership (e.g. an external token) instead of maintaining a list itself. That's how a token-voting plugin says "membership = holders of this token", the token is the membership source, and the event tells indexers where to look.

## `Addresslist`: a snapshot-safe member list

When a plugin *does* maintain its own member set (multisig, addresslist voting), `Addresslist` is the building block. Its defining feature is that it's **checkpointed**: membership and the total member count are recorded per block, so you can ask "was this address a member *at block N*?" and "how many members were there *at block N*?".

Why that matters: governance must compute eligibility and thresholds against the state **as of a proposal's snapshot block**, not the current block. Otherwise someone could join right before voting, or the member count could shift mid-vote, opening the door to flash-membership manipulation. Checkpointing (the same technique OpenZeppelin's `ERC20Votes` uses) makes those queries historical and therefore tamper-resistant.

```solidity
isListed(account)                       // member right now
isListedAtBlock(account, blockNumber)   // member as of a past block (snapshot)
addresslistLength()                     // current member count
addresslistLengthAtBlock(blockNumber)   // count as of a past block
```

`_addAddresses` / `_removeAddresses` maintain the list (rejecting double-adds and removing non-members). Combined with [`Ratio`](./ratio.md) for threshold math, this is the backbone of the addresslist-based voting and multisig plugins.

## Keep in mind

- **Decide against the snapshot block, not "now".** Query membership and counts with the `…AtBlock` variants at a proposal's snapshot; using current state lets membership changes mid-vote distort eligibility or thresholds.

## See also

- [Ratio](./ratio.md) — turning a member count into a required threshold.
- [Proposals](./proposal.md) — the other half of a governance plugin.
- The [plugins](../plugins/index.md) area — where these are put to use.
