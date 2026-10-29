---
type: reference
title: VE versions and upgrades
source: ve-governance/src/setup/GaugeVoterSetup.sol, ve-governance/src/setup/GaugeVoterSetup_v1_1_0.sol, ve-governance/src/setup/GaugeVoterSetup_v1_2_0.sol, ve-governance/src/setup/GaugeVoterSetup_v1_3_0.sol, ve-governance/src/setup/GaugeVoterSetup_v1_4_0.sol, ve-governance/src/setup/GaugeVoterSetupSeason.sol, ve-governance/src/factory/upgrades/UpgradeFactory_v1_0_0__v1_2_0.sol, ve-governance/src/factory/upgrades/UpgradeFactory_v1_0_0__v1_3_0.sol, ve-governance/src/factory/upgrades/UpgradeFactory_v1_0_0__Season.sol, ve-governance/src/escrow/VotingEscrowIncreasing.sol, ve-governance/src/escrow/VotingEscrowIncreasing_v1_2_0.sol, ve-governance/src/curve/QuadraticIncreasingCurve.sol, ve-governance/src/curve/LinearIncreasingCurveNoSupply.sol, ve-governance/audits/AUDIT_3.md, ve-governance/audits/AUDIT_4.md
---

# VE versions and upgrades

A setup selects component implementations, and a factory creates and connects them. The VE repository keeps several configurations together, so component filename suffixes can differ from the setup version.

For example, v1.4 imports `VotingEscrowV1_2_0`, `LockV1_2_0`, and `ClockV1_2_0` with the shared address voter and dynamic queue. The setup's imports define the component set shown below.

## Configuration map

For a new integration, evaluate v1.4 first. Use earlier configurations when maintaining or following a compatible upgrade path for an existing deployment. Season has different mechanics and should be assessed separately.

This table follows the setup imports at the [recorded source snapshot](../../repositories.md):

| Setup | Voter | Curve | Exit queue | Other relevant components |
| --- | --- | --- | --- | --- |
| [v1.0](https://github.com/aragon/ve-governance/blob/408ad144cf33c016b9ef1a2a6118f394a7ff439c/src/setup/GaugeVoterSetup.sol) | `TokenGaugeVoter` | `QuadraticIncreasingEscrow` | `ExitQueue` | Original escrow, NFT, and clock; configurable warmup |
| [v1.1](https://github.com/aragon/ve-governance/blob/408ad144cf33c016b9ef1a2a6118f394a7ff439c/src/setup/GaugeVoterSetup_v1_1_0.sol) | `TokenGaugeVoterV1_1_0` | `QuadraticIncreasingEscrow` | `ExitQueue` | Original escrow, NFT, and clock; configurable warmup |
| [v1.2](https://github.com/aragon/ve-governance/blob/408ad144cf33c016b9ef1a2a6118f394a7ff439c/src/setup/GaugeVoterSetup_v1_2_0.sol) | `AddressGaugeVoter` | `LinearIncreasingCurveNoSupply` | `ExitQueue` | v1.2 escrow, NFT, and clock; `EscrowIVotesAdapter` |
| [v1.3](https://github.com/aragon/ve-governance/blob/408ad144cf33c016b9ef1a2a6118f394a7ff439c/src/setup/GaugeVoterSetup_v1_3_0.sol) | `AddressGaugeVoter` | `LinearIncreasingCurve` | `ExitQueue` | v1.2 escrow, NFT, and clock; adapter; total-power accounting |
| [v1.4](https://github.com/aragon/ve-governance/blob/408ad144cf33c016b9ef1a2a6118f394a7ff439c/src/setup/GaugeVoterSetup_v1_4_0.sol) | `AddressGaugeVoter` | `LinearIncreasingCurve` | `DynamicExitQueue` | v1.2 escrow, NFT, and clock; adapter; updated factory integration |
| [Season](https://github.com/aragon/ve-governance/blob/408ad144cf33c016b9ef1a2a6118f394a7ff439c/src/setup/GaugeVoterSetupSeason.sol) | `TokenGaugeVoterSeason` | `QuadraticIncreasingCurveSeason` | `ExitQueue` | Original escrow and NFT with `ClockSeason` |

The v1.2 no-supply curve's `supplyAt` reverts, so a governance consumer cannot use it to calculate quorum from total historical escrow voting power.

Season uses its own clock, curve, and voter; the v1.4 timing and voting rules in these guides do not describe that configuration.

## Identifying an existing deployment

Record:

- The chain, factory, DAO, and selected component set.
- The proxy addresses and their current implementations.
- The setup and repository revision used for deployment or the latest upgrade.
- Curve and adapter construction parameters, clock behavior, and withdrawal terms.
- DAO execution, component administration, pause, and upgrade permissions.

The factory getters identify the original deployment. Current proxy implementations and settings reflect later changes. The npm package version and Antora publication version do not identify the implementations a DAO is running.

Shared source changes affect more than one setup configuration. When reviewing an older setup on a newer branch, compare the complete source revision and dependency commits with the deployment's originals.

## Upgrade tooling

The repository includes factories for specific transitions:

| Factory | Intended transition |
| --- | --- |
| [UpgradeFactory_v1_0_0__v1_2_0.sol](https://github.com/aragon/ve-governance/blob/408ad144cf33c016b9ef1a2a6118f394a7ff439c/src/factory/upgrades/UpgradeFactory_v1_0_0__v1_2_0.sol) | Original configuration to v1.2 |
| [UpgradeFactory_v1_0_0__v1_3_0.sol](https://github.com/aragon/ve-governance/blob/408ad144cf33c016b9ef1a2a6118f394a7ff439c/src/factory/upgrades/UpgradeFactory_v1_0_0__v1_3_0.sol) | Original configuration to v1.3 |
| [UpgradeFactory_v1_0_0__Season.sol](https://github.com/aragon/ve-governance/blob/408ad144cf33c016b9ef1a2a6118f394a7ff439c/src/factory/upgrades/UpgradeFactory_v1_0_0__Season.sol) | Original configuration to Season |

Each factory targets a specific migration. There is no v1.0-to-v1.4 factory in this source tree. The regression test under `test/v1_4_0/upgrade/` imports the v1.3 upgrade factory.

For a proposed migration, inspect the factory's imported components, permission changes, helper wiring, and storage compatibility. Verify how existing positions, queued exits, curve history, and delegation will be represented afterward. Rehearse the exact transaction sequence against a recorded fork of the actual deployment.

## Migration timing

The original escrow records new positions at the next weekly checkpoint. The v1.2-and-later escrow records them at the preceding checkpoint. The original quadratic curve also has a warmup gate that the newer linear curves do not use.

These changes matter for positions created near an upgrade. A pre-upgrade position can have a recorded start in the future while newer code normally receives starts in the past.

The migration rehearsal must cover positions with future recorded starts, positions still subject to the original warmup, and deposits around checkpoint boundaries. It must also exercise pending withdrawals and delegation under the pause permissions available to the DAO.

Sources: [original escrow](https://github.com/aragon/ve-governance/blob/408ad144cf33c016b9ef1a2a6118f394a7ff439c/src/escrow/VotingEscrowIncreasing.sol), [newer escrow](https://github.com/aragon/ve-governance/blob/408ad144cf33c016b9ef1a2a6118f394a7ff439c/src/escrow/VotingEscrowIncreasing_v1_2_0.sol), [original curve](https://github.com/aragon/ve-governance/blob/408ad144cf33c016b9ef1a2a6118f394a7ff439c/src/curve/QuadraticIncreasingCurve.sol), [Audit 4 scope notes](https://github.com/aragon/ve-governance/blob/408ad144cf33c016b9ef1a2a6118f394a7ff439c/audits/AUDIT_4.md).

## Review evidence

The [`audits/`](https://github.com/aragon/ve-governance/tree/408ad144cf33c016b9ef1a2a6118f394a7ff439c/audits) directory contains reports, scope notes, internal review material, and post-audit findings. The [Audit 3 scope](https://github.com/aragon/ve-governance/blob/408ad144cf33c016b9ef1a2a6118f394a7ff439c/audits/AUDIT_3.md) and [Audit 4 scope](https://github.com/aragon/ve-governance/blob/408ad144cf33c016b9ef1a2a6118f394a7ff439c/audits/AUDIT_4.md) describe different changes and explicitly distinguish some excluded components.

An audit report covers the code revision, components, and assumptions named in its scope. A deployment using different curve coefficients, implementation changes, or a different migration path needs a separate assessment of those differences.

Build and test commands are in the [repository README](https://github.com/aragon/ve-governance/blob/develop/README.md); script configuration and deployment validation are in the [deployment guide](../../deployment/ve-governance.md).
