---
type: reference
title: Bedrock reference case
tags: [governance]
reviewed: 2026-10-29
source: https://docs.bedrockdao.com/governance/bedrock-dao, https://docs.bedrockdao.com/governance/br-and-vebr
---

# Bedrock reference case

Bedrock documents an Aragon-based governance system in which BR staking produces veBR voting power. Holders allocate votes to gauges that determine emissions and rewards in two-week epochs. Voting power grows with stake duration. [Bedrock DAO documentation](https://docs.bedrockdao.com/governance/bedrock-dao).

## The design choice

Bedrock describes veBR as non-transferable and gives voting power a seasonal reset. This combines an incentive to remain staked with periodic resets of accumulated influence. [BR and veBR documentation](https://docs.bedrockdao.com/governance/br-and-vebr).

A protocol evaluating a similar design needs to decide whether accumulated voting power should survive indefinitely or reset at a season boundary. That choice affects its curve, clock, and voter together. The repository's [Season configuration](./versions-and-upgrades.md#configuration-map) is a separate component set from the v1.4 setup used in this wiki's main walkthrough. Bedrock's published description does not identify its deployed source revision.

## Applying the example

1. Define what each gauge represents and which recipients an allocation will ultimately pay. The [gauge reference](./gauge-voting.md) explains the distinction between a voting option and a payment destination.
2. Select the intended power and season model, then identify the deployed contracts and interfaces. Use the [VE walkthrough](../../guides/use-ve-governance.md) when the selected deployment matches its v1.4 component set; a seasonal deployment needs its own matching calls and timing.
3. Validate power readings around the season boundary, including positions deposited near the rollover and positions awaiting withdrawal. Use the selected deployment's season clock and withdrawal terms to define the expected results.

For a different approach to position liquidity and participant automation, compare the [Katana reference case](./katana.md).
