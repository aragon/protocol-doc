---
type: concept
title: Distributor payout actions
tags: [permissions, security]
source: osx-capital-distributor/src/CapitalDistributorPlugin.sol, osx-capital-distributor/src/payoutActionEncoders/VaultDepositPayoutActionEncoder.sol
---

# Distributor payout actions

A [Distributor](../capital-distributor.md) payout is a list of DAO actions. The plugin builds a direct token transfer or asks an encoder to build the recipient's actions, adds a fee transfer when needed, and calls the [DAO executor](../../core/execution.md) with no failed actions allowed.

## Included paths

| Path | Configuration | Actions executed by the DAO |
|---|---|---|
| Direct transfer | Encoder ID `bytes32(0)` | Token `transfer(recipient, netAmount)` |
| Vault deposit | Registered vault encoder; initialization data `abi.encode(vault)` | Token `approve(vault, netAmount)`, then vault `deposit(netAmount, recipient)` |

A configured strategy fee adds a token transfer to the fee recipient in either path. It is deducted from the gross claim, rather than charged on top of it.

The vault encoder assumes the vault accepts the configured token and credits the supplied recipient. It does not verify the asset or enforce a minimum share output. Its owner or DAO can call `setupCampaign` again to replace a campaign's vault for subsequent deposits.

## Execution authorization

The [setup](./setup.md) installs an `ExecuteSelectorCondition` helper whose allowed-call set starts empty. The DAO manages it through `allowSelectors` and `disallowSelectors`.

| Payout path | Targets and selectors to allow |
|---|---|
| Direct transfer | `transfer(address,uint256)` on the payout token |
| Vault deposit | `approve(address,uint256)` on the token and `deposit(uint256,address)` on the vault |
| Vault deposit with fees | Both vault calls plus `transfer(address,uint256)` on the token |

These permissions authorize target/selector pairs. They do not impose a per-campaign budget or reserve treasury funds. The [permission condition](../../common/permission-conditions.md) and the allocation strategy perform different checks: one authorizes execution, while the other supplies the entitlement.

## Token behavior

Direct payouts encode `IERC20.transfer` as a DAO action without decoding its boolean return value. To keep the claimed record aligned with payment, the token must revert when the transfer fails. Campaign creation rejects a token whose static `transferFrom` call from the zero address succeeds, but that probe does not establish every payout failure will revert.
