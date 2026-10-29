---
type: concept
title: Capital Distributor
tags: [governance]
source: osx-capital-distributor/src/CapitalDistributorPlugin.sol, osx-capital-distributor/src/interfaces/ICapitalDistributorPlugin.sol
---

# Capital Distributor

Capital Distributor makes allocated ERC-20 tokens claimable from an OSx DAO treasury. The DAO creates a campaign with an allocation strategy, a payout token, and optional payout actions. Recipients then claim under that campaign's rules.

It suits airdrops, grants, rewards, or allocations calculated from [VE gauge results](./ve-governance/gauge-voting.md). Your protocol calculates the entitlements, supplies funds, publishes any proofs, and decides who receives each allocation.

## The claim path

1. A [campaign](./capital-distributor/campaigns.md) selects an allocation strategy and payout path.
2. The strategy reports the recipient's total entitlement. The included [Merkle strategy](./capital-distributor/merkle-allocations.md) verifies it against a root.
3. The plugin subtracts previous claims and any strategy fee, then records the claimed total.
4. The [DAO executes the payout](./capital-distributor/payouts.md), transferring treasury tokens directly or depositing them into a configured vault.

The encoder builds actions; the DAO executes them. A reverting execution rolls back the claim record and payments together.

## Funding and control

Campaign creation records configuration without transferring tokens or reserving a budget. Campaigns share the DAO treasury, and claims depend on its available balance and execution permissions.

[Installation](./capital-distributor/setup.md) creates an execution condition with no allowed calls. The DAO must authorize each token or vault call used by its campaigns. A valid Merkle proof alone does not make a payout executable.

The [walkthrough](../guides/distribute-tokens.md) creates a Merkle campaign, prepares its payout authorization, and submits a claim. These pages describe the [recorded source snapshot](../repositories.md); the included payout paths are direct token transfers and the vault deposit encoder. A payout into VE positions requires an additional compatible encoder, which is not part of this source snapshot.
