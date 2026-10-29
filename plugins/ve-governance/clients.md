---
type: reference
title: VE client examples
tags: [governance]
reviewed: 2026-10-29
source: https://docs.bedrockdao.com/governance/bedrock-dao, https://docs.katana.network/katana/katana-staking/
---

# VE client examples

These protocols have publicly documented integrations with Aragon's VE contracts. Their designs illustrate different uses of locked voting power. Publication dates identify the evidence behind each entry; they do not establish the contracts or settings running today.

| Protocol | Documented implementation | Useful reference for | Primary evidence |
|---|---|---|---|
| Bedrock | BR staking produces veBR voting power that grows with stake duration. Gauges determine emissions and reward allocation in two-week epochs. | Recurring incentive allocation using growing voting power. | [Bedrock's governance documentation](https://docs.bedrockdao.com/governance/bedrock-dao), reviewed 29 October 2026; [reference case](./bedrock.md) |
| Katana | Direct participation through vKAT positions, or automated participation through the transferable avKAT vault token. | Combining a non-transferable position with a liquid vault and an automated voting strategy. | [Katana's staking documentation](https://docs.katana.network/katana/katana-staking/), reviewed 29 October 2026; [reference case](./katana.md) |

## Choosing a reference

Bedrock illustrates recurring incentive allocation using growing voting power. Katana adds a vault and automation around the participant's position.

These integrations span different contract generations. The [v1.4 walkthrough](../../guides/use-ve-governance.md) documents the component set pinned in this wiki; it is not a deployment recipe for every client above. For an existing integration, identify its escrow, voter, curve, queue, NFT, and adapter before choosing interfaces. The [version reference](./versions-and-upgrades.md) explains the differences that affect that choice.
