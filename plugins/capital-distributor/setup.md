---
type: concept
title: Distributor setup and administration
tags: [permissions, upgradeability]
source: osx-capital-distributor/src/CapitalDistributorPluginSetup.sol, osx-capital-distributor/src/factories/AllocatorStrategyFactory.sol, osx-capital-distributor/src/factories/ActionEncoderFactory.sol, osx-capital-distributor/src/factories/FactoryBase.sol, osx-capital-distributor/src/allocatorStrategies/AllocatorStrategyBase.sol, osx-capital-distributor/src/payoutActionEncoders/PayoutActionEncoderBase.sol
---

# Distributor setup and administration

`CapitalDistributorPluginSetup` deploys an upgradeable plugin and a dedicated execution-condition helper. It uses an allocator-strategy factory and action-encoder factory supplied at installation.

## Installation

Installation data is `abi.encode(strategyFactory, actionEncoderFactory)`. Both addresses must be nonzero. `prepareInstallation` returns the plugin, the helper at index `0`, and five [permission changes](../../core/permissions.md):

| Target | Grantee | Permission |
|---|---|---|
| Distributor plugin | DAO | `CAMPAIGN_MANAGER_PERMISSION_ID` |
| Distributor plugin | DAO | `SET_METADATA_PERMISSION_ID` |
| Distributor plugin | DAO | `UPGRADE_PLUGIN_PERMISSION_ID` |
| DAO | Distributor, with the execution condition | `EXECUTE_PERMISSION_ID` |
| Execution condition | DAO | `MANAGE_SELECTORS_PERMISSION_ID` |

The [PluginSetupProcessor flow](../../framework/plugin-setup-processor.md) applies those changes. Preparing the installation alone does not grant them. The execution condition initially allows no calls; the DAO then authorizes the [payout targets and selectors](./payouts.md#execution-authorization) its campaigns use.

The DAO receives upgrade authority over the proxy. This setup's `prepareUpdate` reverts with `NotImplemented`.

## Strategy and encoder registries

Both factories register implementation contracts under `bytes32` IDs. Registration is permissionless, requires interface support, and cannot replace an ID already registered. Strategy registration also records the fee recipient and rate, capped at 10%.

The factory lookup determines which implementation and fee configuration an ID selects. A descriptive ID alone does not identify who registered it.

Instances are keyed by type ID, DAO, calling plugin, and initialization parameters. Matching campaigns can reuse an instance, which stores campaign-specific roots or vault addresses by campaign ID. The supplied bases initially make the calling plugin the instance owner and also permit management calls from the DAO.

The [deployment guide](../../deployment/capital-distributor.md) covers the supplied script for a new DAO. An existing DAO can install Distributor through its current governance process.
