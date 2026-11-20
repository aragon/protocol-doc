---
type: concept
title: Merkle Claim budget
tags: [automation, treasury]
source: capital-tree/src/budgets/MerkleClaimBudget.sol
---

# Merkle Claim budget

Use this [budget](index.md) to publish account entitlements and let each account claim its unpaid amount. If an account has already claimed 40 and its new total entitlement is 100, the next flow receives 60.

## Entitlements and proofs

**Cumulative** means the total entitlement across rounds. Updating that total pays only `cumulative − claimed`; it does not reset previous claims.

A **Merkle root** is a hash committing to the entitlements; a **proof** shows an account belongs to that set. Each Merkle **leaf** is an `(account, cumulative amount)` entry in OpenZeppelin's StandardMerkleTree format. These terms describe the proof, separately from Capital Tree nodes.

## Claim and record

The entitled account calls `trigger()` with `abi.encode(account, cumulative, proof)` as budget data. With [Transfer to Beneficiary](../actions/transfer-to-beneficiary.md), it supplies the payout address in node data. See the [claim example](../examples/merkle-claims.md) for the complete call.

One trigger processes one account's remaining entitlement. After the tree succeeds, the `DAO.sol` contract executes `recordClaim`; setup grants it `RECORD_CLAIM_PERMISSION_ID`. A failed payment rolls everything back. No new entitlement means `NothingToClaim`.

## Publish another round

An authorized manager calls `setRoot` with `SET_SETTINGS_PERMISSION_ID`. This controls who can receive the treasury's tokens. Review the entitlements and fund the `DAO.sol` contract for the payouts.

Keep one flow per budget instance. Sharing it could allow a second flow to claim before the first records completion. Replacing the budget with a fresh clone loses its claim history.

A claim can feed a split or other processing before payout. Adding a swap needs a compatible action: the supplied Open Fill requires a [checkpointed budget](stream.md#checkpoint-interface).

## See also

- [All budgets](./index.md)
- [Execution](../execution.md) and [setup and permissions](../setup.md)
- [Contract source](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/budgets/MerkleClaimBudget.sol) and [settings metadata](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/metadata/components/MerkleClaimBudget.json)
