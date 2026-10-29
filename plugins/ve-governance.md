---
type: concept
title: VE Governance
tags: [governance, voting]
source: ve-governance/src/setup/GaugeVoterSetup_v1_4_0.sol, ve-governance/src/factory/GaugesDaoFactory_v1_4_0.sol, ve-governance/src/voting/AddressGaugeVoter.sol
---

# VE Governance

VE Governance lets token holders lock tokens and assign voting power across registered destinations called gauges. A protocol can use those weights to allocate incentives, grants, or other resources under its own payout rules.

This section describes the v1.4 component set at the [recorded source snapshot](../repositories.md). It combines position NFTs, a growing voting-power curve, address delegation, gauge voting, and a withdrawal queue. Other configurations in the repository use different components; their version suffixes alone do not identify a deployment.

## What a participant does

1. Deposit tokens in the escrow and receive a [position NFT](./ve-governance/positions.md).
2. Choose a [delegate](./ve-governance/delegation.md), including their own address.
3. Assign relative weights to active [gauges](./ve-governance/gauge-voting.md) during a voting window.
4. Follow the [withdrawal process](./ve-governance/withdrawals.md) to recover the underlying tokens.

The configured [curve](./ve-governance/voting-power.md) determines how much power each position has. The DAO controls gauge eligibility, administrative settings, and upgrades through [OSx permissions](../core/permissions.md).

## From votes to payments

A gauge is an address and metadata record. Casting a vote records weights without calling that address, moving funds, or executing a DAO proposal. Your protocol defines the reward budget, snapshot block, eligible gauges, allocation calculation, and recipients.

[Capital Distributor](./capital-distributor.md) can pay a recipient list calculated from those results. Connecting them requires a process that reads the weights and publishes the resulting entitlements; neither component performs that conversion automatically.

The [user and integration walkthrough](../guides/use-ve-governance.md) follows a position from deposit through voting and exit. The [setup page](./ve-governance/setup.md) covers installation, component discovery, and administrative authority.
