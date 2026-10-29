---
type: guide
title: Deploy VE Governance
source: ve-governance/script/deploy/DeployGauges_v1_4_0.s.sol, ve-governance/src/factory/GaugesDaoFactory_v1_4_0.sol, ve-governance/src/setup/GaugeVoterSetup_v1_4_0.sol, ve-governance/Makefile, ve-governance/test/v1_4_0/fork/e2e.t.sol
---

# Deploy VE Governance

This guide covers [`DeployGauges_v1_4_0.s.sol`](https://github.com/aragon/ve-governance/blob/408ad144cf33c016b9ef1a2a6118f394a7ff439c/script/deploy/DeployGauges_v1_4_0.s.sol). The [version map](../plugins/ve-governance/versions-and-upgrades.md) identifies the components used by each retained configuration.

Build and test the checkout using the [repository instructions](https://github.com/aragon/ve-governance/blob/develop/README.md#local-development) before running this script.

## Configure the v1.4 script

If you do not have a local `.env`, copy [`.env.example`](https://github.com/aragon/ve-governance/blob/develop/.env.example) and configure the variables below. The file also contains variables used only by older scripts. Keep private keys out of commits and logs.

The v1.4 script reads these variables:

| Variable | Use and units |
| --- | --- |
| `DEPLOYMENT_PRIVATE_KEY` | Account used by the script's broadcast modifier, including during simulation |
| `MULTISIG_MEMBERS_JSON_FILE_NAME` | Path appended to the project root, such as `/script/multisig-members.json`; JSON must contain a nonempty `members` array |
| `MIN_APPROVALS` | Initial multisig approval threshold |
| `MULTISIG_METADATA_URI` | Metadata string passed to the multisig installation |
| `TOKEN1_ADDRESS` | First underlying ERC-20 token |
| `VE_TOKEN1_NAME`, `VE_TOKEN1_SYMBOL` | Name and symbol of its position NFT |
| `TOKEN2_ADDRESS` | Second underlying token, or the zero address to use only the first |
| `VE_TOKEN2_NAME`, `VE_TOKEN2_SYMBOL` | Metadata for the second position NFT, when enabled |
| `FEE_PERCENT` | Initial fixed withdrawal fee, in basis points: `100` means 1% |
| `COOLDOWN_PERIOD` | Initial withdrawal wait, in seconds |
| `MIN_LOCK_DURATION` | Nonzero minimum age of the recorded lock, in seconds, before exit can be queued |
| `MIN_DEPOSIT` | Minimum lock amount in the token's smallest units |
| `VOTING_PAUSED` | Whether each gauge voter starts paused |
| `MULTISIG_PLUGIN_REPO_ADDRESS` | Existing OSx multisig plugin repository on the target chain |
| `MULTISIG_PLUGIN_RELEASE`, `MULTISIG_PLUGIN_BUILD` | Multisig plugin version tag |
| `SIMPLE_GAUGE_VOTER_REPO_ENS_SUBDOMAIN` | Subdomain used when publishing the gauge-voter plugin repository |
| `DAO_FACTORY` | OSx DAO factory used for the new organization |
| `PLUGIN_SETUP_PROCESSOR` | OSx installation processor |
| `PLUGIN_REPO_FACTORY` | OSx plugin-repository factory |
| `MINT_TEST_TOKENS` | Optional, defaults to false; when true the script creates two mock tokens instead of using configured underlying tokens |

The Makefile's v1.4 preview and deployment targets also use `RPC_URL`. The broadcast target uses `ETHERSCAN_API_KEY` for verification. Foundry can load script variables from `.env`; shell command arguments such as `--rpc-url "$RPC_URL"` require `RPC_URL` to be exported in that shell.

The v1.4 script does not read `WARMUP_PERIOD` or `MULTISIG_PROPOSAL_EXPIRATION_PERIOD`. Editing them does not change this configuration. Its token-handling path still reads `TOKEN2_ADDRESS` when mock-token mode is off, so set it explicitly to zero for a single-token deployment.

The example contains historical network settings and contract addresses. Each OSx and multisig dependency must exist on the chain served by `RPC_URL`; the example addresses are not a deployment registry.

### Script settings and contract authority

The table above lists the deployment script's inputs. The [setup reference](../plugins/ve-governance/setup.md#administrative-authority) identifies which settings the DAO can change afterward. [Voting-power implementation choices](../plugins/ve-governance/voting-power.md#implementation-choices) cover constructor parameters and the script's curve selection; [the clock reference](../plugins/ve-governance/gauge-voting.md#the-voting-window) defines its compiled timing rules.

## Simulate a deployment

After completing the environment configuration, the existing Makefile target runs the v1.4 script without broadcasting:

```sh
make deploy-preview-1-4-sepolia
```

The target name does not select the chain: the simulation runs against whichever network `RPC_URL` serves.

The equivalent direct simulation, with `RPC_URL` exported, is:

```sh
forge script script/deploy/DeployGauges_v1_4_0.s.sol:DeployGaugesV1_4_0 \
  --rpc-url "$RPC_URL" \
  -vvvv
```

Compare the simulated multisig members and threshold, token addresses, implementation construction parameters, plugin dependencies, fee units, and pause state with the intended configuration. With `MINT_TEST_TOKENS=true`, the simulation deploys mock tokens and does not exercise the configured underlying token contracts.

## Installation and wiring

The script constructs the implementations and setup, creates a one-time `GaugesDaoFactoryV1_4_0`, and calls `deployOnce()`. The [setup reference](../plugins/ve-governance/setup.md) describes the installed components, helper order, wiring, and authority. Using the setup directly requires completing the wiring the factory normally performs.

## Fork validation

Earlier configurations have active fork suites. The v1.4 [`fork/e2e.t.sol`](https://github.com/aragon/ve-governance/blob/408ad144cf33c016b9ef1a2a6118f394a7ff439c/test/v1_4_0/fork/e2e.t.sol) is commented out, so filtering for that file will not test v1.4 on a target network.

An active fork test must use the selected factory, setup, dependencies, and real token at a recorded chain and block. It should exercise the full position lifecycle: create, delegate, vote, begin withdrawal, wait, and withdraw or cancel, with the chosen transfer, split, merge, and fee settings.

For migration test coverage and supported transition tooling, see [VE versions and upgrades](../plugins/ve-governance/versions-and-upgrades.md#upgrade-tooling).

## Broadcast and verify

The existing broadcast target is:

```sh
make deploy-1-4-sepolia
```

It adds broadcast and verification flags to the v1.4 script and uses `RPC_URL`. Run it only after the configured chain, token, dependencies, signer, and deployment terms have been reviewed and the matching simulation succeeds.

After deployment:

- Record the chain, repository commit, factory, deployment transaction, proxy addresses, and implementation addresses.
- Read `getDeployment()` and `getDeploymentParameters()` from the factory and compare them with the reviewed configuration.
- Verify the component wiring and permissions, including the removal of temporary factory authority.
- Verify source code and constructor arguments for the exact implementations and proxies deployed.
- Check gauge-voter, escrow, and delegation pause states separately. `VOTING_PAUSED` initializes the voter; it does not pause every component.
- Register the intended gauges through an authorized DAO action and validate the application against the deployed component set.

Later upgrades and permission or reference changes do not update the factory's original deployment record.
