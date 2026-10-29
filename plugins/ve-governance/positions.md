---
type: concept
title: VE positions and ownership
tags: [governance, voting]
source: ve-governance/src/escrow/VotingEscrowIncreasing_v1_2_0.sol, ve-governance/src/lock/Lock_v1_2_0.sol
---

# VE positions and ownership

A VE position records a deposited amount and a start timestamp. The escrow holds the underlying ERC-20; a `LockV1_2_0` NFT records who owns the position and its withdrawal rights. The token ID connects NFT ownership to escrow balances and curve history.

## Creating a position

The underlying token must have 18 decimals. A deposit must meet `minDeposit()` and increase the escrow's balance by exactly the requested amount, which excludes fee-on-transfer deposits.

`createLock(amount)` pulls tokens from the caller and mints their NFT. `createLockFor(amount, recipient)` still pulls tokens from the caller but mints to the recipient. Contract recipients must accept a safe ERC-721 mint.

Each deposit creates a new position. These methods accept no chosen unlock date, and the escrow has no direct top-up or extension method. The [curve](./voting-power.md) uses the recorded start to calculate position age.

| Query | Meaning |
|---|---|
| `locked(tokenId)` | Deposited amount and recorded start |
| `ownedTokens(account)` | Position IDs owned by an address |
| `votingPower(tokenId)` | Current power of one position |
| NFT's `ownerOf(tokenId)` | Current owner |

Owned position power and [delegated power](./delegation.md) can differ: another address may exercise the votes while the holder keeps the NFT and withdrawal rights.

## Transfers, merges, and splits

Transfers initially permit the escrow as an endpoint. Other transfers need a whitelisted sender or recipient, or globally enabled transfers. A permitted transfer updates delegation for the previous and new owners.

A merge requires approval for both positions and a common owner. Their starts must match, or both positions must be past the curve's maturity boundary. Splitting requires the owner to be split-whitelisted unless splitting is enabled globally; both resulting amounts must meet the minimum deposit. Merges and splits update position and delegation accounting together.

The holder recovers principal through [withdrawal](./withdrawals.md).
