---
type: reference
title: Katana reference case
tags: [governance]
reviewed: 2026-10-29
source: https://github.com/katana-network/katana-docs/blob/7c044eb1b3bf3e97e75ec298775463cc56bc5ded/docs/katana/katana-staking.md, https://github.com/katana-network/katana-docs/blob/7c044eb1b3bf3e97e75ec298775463cc56bc5ded/docs/katana/how-to/kat-token-overview.md, https://github.com/katana-network/katana-docs/blob/7c044eb1b3bf3e97e75ec298775463cc56bc5ded/docs/katana/how-to/kat-convert-vkat-to-avkat.md, https://github.com/katana-network/katana-docs/blob/7c044eb1b3bf3e97e75ec298775463cc56bc5ded/docs/katana/how-to/kat-vote-on-gauges.md
---

# Katana reference case

Katana is a reference for adding liquid vault shares and automated voting around a VE position. Its [staking documentation](https://docs.katana.network/katana/katana-staking/) credits Aragon with building staking, voting, claiming, and automation infrastructure. This assessment follows the [published documentation snapshot](../../repositories.md#integration-documentation), reviewed on 29 October 2026. It does not establish the deployed contracts' source revisions.

## Positions and vault shares

Katana describes two participation paths:

| Path | What the participant holds | Who manages participation |
|---|---|---|
| Lock KAT directly | A non-transferable vKAT position NFT | The holder votes on gauges and claims rewards. |
| Deposit KAT into the avKAT vault | Transferable ERC-4626 vault shares | A strategy manages the underlying vKAT position, votes, collects rewards, and compounds them. |

The liquid asset is avKAT. Transferring a vault share transfers an interest in the managed position; the underlying vKAT NFT remains non-transferable. Selling shares depends on market liquidity. It is a different operation from withdrawing the underlying KAT. [Katana token overview](https://docs.katana.network/katana/how-to/kat-token-overview/).

Katana also documents depositing an existing vKAT NFT into the vault with `depositTokenId(tokenId, receiver)`. Redeeming vault shares returns a vKAT position, which then follows the escrow's exit process. A protocol adopting this pattern needs to account for both vault-share redemption and escrow withdrawal. [Conversion walkthrough](https://docs.katana.network/katana/how-to/kat-convert-vkat-to-avkat/).

## Voting and reward payments

Direct holders choose gauge allocations; the vault's strategy makes those choices for its managed position. Katana documents recurring voter reward claims through Merkl, with the vault handling claims and compounding for avKAT holders. Those payments are separate from recording gauge weights. [Staking and reward flow](https://docs.katana.network/katana/katana-staking/).

## Deployment details to establish

Katana publishes a [contract address table](https://docs.katana.network/katana/how-to/kat-token-overview/#contract-addresses-reference). The official RPC endpoints and explorer rejected read requests during this review, so the published addresses, contract wiring, and settings were not independently checked onchain.

Before adapting the integration, resolve these specific points:

- Katana's [voting tutorial](https://docs.katana.network/katana/how-to/kat-vote-on-gauges/) passes a token ID to `vote` and `reset`. This wiki's v1.4 [address voter](./gauge-voting.md) uses address-based calls. Obtain the deployed voter's verified ABI and implementation before selecting either interface.
- Read the deployed vault's redemption behavior and the escrow queue's current withdrawal terms before presenting an exit estimate. Share transferability alone does not guarantee immediate redemption into KAT.
