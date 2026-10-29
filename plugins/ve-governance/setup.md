---
type: concept
title: VE setup and administration
tags: [governance, permissions, upgradeability]
source: ve-governance/src/setup/GaugeVoterSetup_v1_4_0.sol, ve-governance/src/factory/GaugesDaoFactory_v1_4_0.sol, ve-governance/src/escrow/VotingEscrowIncreasing_v1_2_0.sol, ve-governance/script/deploy/DeployGauges_v1_4_0.s.sol
---

# VE setup and administration

`GaugeVoterSetupV1_4_0` deploys a gauge-voter proxy with six helper contracts and prepares its [OSx permissions](../../core/permissions.md). The [installation process](../../framework/plugin-setup-processor.md) applies those permissions.

## Component set

| Contract | Role |
|---|---|
| `AddressGaugeVoter` | Address-based gauge allocations |
| `VotingEscrowV1_2_0` | Underlying tokens and positions |
| `LinearIncreasingCurve` | Position and total power |
| `DynamicExitQueue` | Withdrawal tickets and fees |
| `ClockV1_2_0` | Epochs, checkpoints, voting windows |
| `LockV1_2_0` | Position NFT ownership |
| `EscrowIVotesAdapter` | Address delegation and historical queries |

The helper order is curve, queue, escrow, clock, NFT, adapter. Preparing installation does not finish the escrow's component-reference wiring; the supplied factory performs those post-installation calls.

`GaugesDaoFactoryV1_4_0` creates a DAO, installs a multisig, and installs one independent VE set per configured underlying token. `getDeployment()` and `getDeploymentParameters()` record the original installation. Current proxy implementations, permissions, and mutable references can differ after DAO actions.

The factory temporarily receives the permissions needed to create and install the plugins, then revokes those permissions before returning. The checked-in script sets `daoExecutor` to zero; supplying a nonzero address through a custom script grants that address additional DAO execution authority.

## Administrative authority

The setup gives the DAO the component administration and upgrade roles. It can manage gauges, pause the voter, change the voter's adapter or hook setting, configure escrow deposits and splitting, manage NFT transfer whitelists, and configure new exit tickets. Escrow and delegation have separate pause controls.

The DAO also receives the adapter's restricted token-delegation role and the queue's fee-withdrawal role. Gauge allocations do not authorize these administrative actions; the factory's multisig initially governs the DAO.

In the escrow, curve, queue, clock, and adapter setters reject replacement once their references are nonzero; the NFT setter can be used only once. `setVoter` remains available to the escrow administrator.

## Other configurations

The [version map](./versions-and-upgrades.md) compares the retained configurations and identifies the available upgrade tooling. Use the [deployment guide](../../deployment/ve-governance.md) for the v1.4 script and verification steps.

For a proposal-voting integration, the adapter can provide timestamp-based voting power to a compatible plugin. The VE factory does not install that proposal-voting integration or a reward distributor.
