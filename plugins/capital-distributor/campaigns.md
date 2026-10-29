---
type: concept
title: Distributor campaigns and claims
tags: [governance]
source: osx-capital-distributor/src/CapitalDistributorPlugin.sol, osx-capital-distributor/src/interfaces/ICapitalDistributorPlugin.sol, osx-capital-distributor/src/utils/RatioUtils.sol
---

# Distributor campaigns and claims

A [Distributor](../capital-distributor.md) campaign records metadata, an allocation strategy, a token, an optional action encoder, state, and time bounds. Campaign IDs start at zero.

`createCampaign` requires `CAMPAIGN_MANAGER_PERMISSION_ID`. It takes the structs `StrategyConfig`, `PayoutConfig`, and `CampaignSettings` alongside nonempty metadata bytes. Creating one does not fund or reserve its allocations.

## State and time

A campaign starts in `ACTIVE`. Claims require both that state and a timestamp within its bounds. The start is inclusive and the end exclusive; zero disables the corresponding bound. A configured start cannot precede creation, and a configured end must be in the future and after the start.

A campaign manager can pause, resume, or permanently end a campaign before its end time. `ENDED` has no resume path. Expiration stops claims through the time check without rewriting stored state to `ENDED`.

`isCampaignActive` and `isCampaignPaused` include time bounds. A stored `PAUSED` state can therefore coexist with `isCampaignPaused` returning false before the start or after expiry.

## Entitlements and fees

A strategy returns a total entitlement. The plugin subtracts the account's gross amount already claimed; any fee applies to the resulting difference.

```text
newly claimable = total entitlement - previously claimed
fee = ceil(newly claimable × fee basis points / 10,000)
recipient payout = newly claimable - fee
```

For 1,000 newly claimable units at 250 basis points, the recipient gets 975 and the fee recipient gets 25. The claimed record consumes 1,000. The [strategy factory](./setup.md#strategy-and-encoder-registries) sets fee terms at registration and caps the rate at 1,000 basis points (10%).

`getCampaignPayout(id, recipient, strategyData)` returns the strategy's total entitlement, before subtracting prior claims and fees. `getClaimedAmount(id, recipient)` returns the gross amount already consumed. A payout quote also needs campaign availability, DAO funds, and [execution authorization](./payouts.md).

## Claim callers and destinations

Anyone can call `claimCampaignPayout(id, recipient, strategyData, encoderData)`. It verifies entitlement for `recipient` and pays that recipient. To redirect their own allocation, its holder calls `claimCampaignPayoutToAddress`; that method verifies the caller's entitlement and uses the supplied payout address.

`PayoutClaimed` identifies the entitlement holder and net amount, including for redirected claims. The destination address is not a field in that event.

`batchClaimCampaignPayout` accepts four equal-length arrays: campaign IDs, recipients, strategy data, and encoder data, with a maximum of 50 entries. Any reverting entry rolls back the entire batch.
