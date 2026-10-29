---
type: concept
title: VE withdrawals and exit fees
tags: [governance, voting]
source: ve-governance/src/escrow/VotingEscrowIncreasing_v1_2_0.sol, ve-governance/src/queue/DynamicExitQueue.sol
---

# VE withdrawals and exit fees

A [position](./positions.md) exits in two transactions. The holder first moves its NFT into escrow custody and receives a withdrawal ticket; the ticket holder later completes withdrawal under that ticket's terms.

## Start, complete, or cancel

1. Approve the escrow to transfer the position NFT.
2. Call `beginWithdrawal(tokenId)`. It checks the minimum lock requirement, removes the position's power, takes NFT custody, and queues the ticket for its owner.
3. Once `canExit(tokenId)` is true, the ticket holder calls `withdraw(tokenId)`. The NFT is burned and the underlying tokens are returned minus the exit fee.

The minimum lock requirement uses the recorded start plus `minLock`, rather than the deposit transaction time. Beginning withdrawal is also blocked at the creation timestamp, including when newly created tokens reach the position through a merge or split.

While withdrawal is pending, the ticket holder can call `cancelWithdrawalRequest(tokenId)`. This cancels the ticket, restores the original amount and start in curve accounting, and returns the NFT. Delegation updates on return; the delegate must recast during an open window to include restored power in [gauge votes](./gauge-voting.md).

## Ticket terms

The queue snapshots fee and waiting-period parameters into each ticket. Later administrative changes apply to subsequent tickets.

| Fee mode | Waiting period and fee |
|---|---|
| Fixed | Exit after the configured wait, at a fixed percentage |
| Tiered | Exit after a minimum wait; higher fee through the full cooldown boundary, lower fee afterward |
| Dynamic | Exit after a minimum wait; fee declines linearly toward the lower rate |

Rates use basis points: 100 means 1%, and 10,000 means 100%. Durations use seconds. The v1.4 setup starts in fixed-fee mode; the queue administrator can choose another mode for new tickets.

Use `queue(tokenId)` for stored terms, `ticketHolder(tokenId)` for the claimant, `canExit(tokenId)` for eligibility, and `calculateFee(tokenId)` for the current fee in underlying-token units. `getTimeBasedFee(elapsed)` describes the global configuration, so it can differ from an existing ticket's fee settings.

Exit fees accumulate in the queue. A caller with `WITHDRAW_ROLE` can collect them; they are not automatically distributed to position holders.
