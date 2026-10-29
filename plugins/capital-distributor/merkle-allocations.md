---
type: concept
title: Merkle allocations
tags: [governance]
source: osx-capital-distributor/src/allocatorStrategies/MerkleDistributorStrategy.sol, osx-capital-distributor/src/allocatorStrategies/AllocatorStrategyBase.sol
---

# Merkle allocations

`MerkleDistributorStrategy` verifies a recipient and their total entitlement against a campaign-specific Merkle root. The [campaign](./campaigns.md) supplies the payout token and keeps the claimed-amount record.

## Leaf and proof encoding

The leaf is:

```solidity
bytes32 leaf = keccak256(abi.encodePacked(recipient, totalEntitlement));
```

The strategy uses OpenZeppelin's sorted-pair `MerkleProof` verification. A tree using a different leaf encoding, including a double-hashed leaf, produces incompatible proofs.

Campaign creation passes `abi.encode(merkleRoot)` as the strategy's `initData`. A claim passes `abi.encode(merkleProof, totalEntitlement)` as strategy auxiliary data, where the proof is a `bytes32[]`.

The leaf commits to the address and amount. It does not include the token, chain, or campaign ID. Reusing the same root in another campaign makes the same entitlements available under that campaign's separate claim record.

## Updating a root

The strategy owner or DAO can call `updateCampaignMerkleRoot(campaignId, abi.encode(newRoot))`. The new root must be nonzero and different from the current one, and the plugin's `isCampaignPaused(campaignId)` must return true. That query includes the campaign's time bounds: pausing before the start is not enough to update a root before the start, and an expired campaign cannot use this update path.

Claimed amounts remain recorded across root changes. A replacement list therefore expresses cumulative total entitlements. If an account has claimed 1,000 and the new root assigns 1,200, the next claim consumes another 200 before fees. Reducing an entitlement below the already-claimed amount does not recover a payment; it prevents another claim while that recorded amount is at least the new entitlement.

Use the [Merkle tools](../../tooling/capital-distributor-merkle.md) to generate compatible data, then follow the [campaign walkthrough](../../guides/distribute-tokens.md) to create a campaign and claim.

## Keep in mind

- A root update changes entitlements but preserves prior claims.
- Publish replacement proofs together with the cumulative recipient list, so claimants can submit proofs for the current root.
