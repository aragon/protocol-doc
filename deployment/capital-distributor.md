---
type: guide
title: Deploy Capital Distributor
source: osx-capital-distributor/script/Deploy.s.sol, osx-capital-distributor/src/CapitalDistributorPluginSetup.sol, osx-capital-distributor/Makefile, osx-capital-distributor/foundry.toml
---

# Deploy Capital Distributor

This guide follows [Deploy.s.sol](https://github.com/aragon/osx-capital-distributor/blob/8577c133be83b5a95176581752e0b391f65dc3c5/script/Deploy.s.sol) and
[CapitalDistributorPluginSetup](https://github.com/aragon/osx-capital-distributor/blob/8577c133be83b5a95176581752e0b391f65dc3c5/src/CapitalDistributorPluginSetup.sol). The script publishes a plugin repository and
creates a new DAO with Capital Distributor and an Admin plugin. Its `ADMIN_OWNER` controls that Admin plugin.

## Configure the script

Install the dependencies and build as described in the [README](https://github.com/aragon/osx-capital-distributor/blob/development/README.md#local-development), then copy
[.env.example](https://github.com/aragon/osx-capital-distributor/blob/development/.env.example) to a local `.env`. Required addresses must refer to the selected chain's OSx and Admin
plugin deployments; this repository does not maintain a verified deployment-address registry.

| Variable              | Use                                                                       |
| --------------------- | ------------------------------------------------------------------------- |
| `CHAIN_NAME`          | RPC URL or alias passed to `vm.createSelectFork`                          |
| `PLUGIN_REPO_FACTORY` | Existing OSx plugin-repository factory                                    |
| `DAO_FACTORY`         | Existing OSx DAO factory                                                  |
| `ADMIN_REPO`          | Existing Admin plugin repository; the script selects release 1, build 2   |
| `ADMIN_OWNER`         | Initial owner of the installed Admin plugin                               |
| `PLUGIN_MAINTAINER`   | Maintainer of the new Capital Distributor plugin repository               |
| `PLUGIN_NAME`         | Optional repository subdomain; defaults to a timestamp-based name         |
| `DAO_NAME`, `DAO_URI` | Optional DAO subdomain and URI; defaults are generated from the timestamp |
| `FEE_RECIPIENT`       | Optional strategy fee recipient; defaults to zero                         |
| `FEE_BASIS_POINTS`    | Optional fee rate; defaults to zero, maximum 1,000 (10%)                  |

A nonzero fee requires a nonzero recipient. The script casts the fee rate to `uint32` before registration; configure it
within the documented range of 0 through 1,000. Keep signing credentials out of committed configuration.

[foundry.toml](https://github.com/aragon/osx-capital-distributor/blob/8577c133be83b5a95176581752e0b391f65dc3c5/foundry.toml) defines RPC aliases. Its `mainnet` and `sepolia` aliases require `API_KEY_ALCHEMY`;
source verification uses `API_KEY_ETHERSCAN`. The script selects its fork from `CHAIN_NAME` in both setup and execution,
so that variable must identify the intended chain even when a command also supplies `--rpc-url`.

## Simulate before broadcasting

Create the directory used for deployment records. Export the variables referenced by shell arguments; Foundry reads the
remaining script variables from `.env`.

```sh
mkdir -p deployments
export CHAIN_NAME=sepolia
export DEPLOYER_ADDRESS=0xYourDeployerAddress
forge script script/Deploy.s.sol:Deploy \
  --rpc-url "$CHAIN_NAME" \
  --sender "$DEPLOYER_ADDRESS" \
  -vvv
```

Replace the address placeholder with the account that will broadcast. The simulation checks the configured dependencies,
repository publication, and both plugin installations against the selected network.

The script deploys two registries, registers the Merkle strategy and vault encoder, deploys the plugin setup, publishes
release 1/build 1, and asks the DAO factory to create the organization. It writes its result to
`deployments/deployment-<chainId>-<timestamp>.json`, including during a simulation. A simulation record describes
predicted addresses; broadcast receipts establish what was deployed.

To broadcast the same reviewed configuration with an account stored in a Foundry keystore:

```sh
forge script script/Deploy.s.sol:Deploy \
  --rpc-url "$CHAIN_NAME" \
  --account deployer \
  --broadcast \
  -vvv
```

Here `deployer` is the name of the configured keystore account. The Makefile also provides `deploy-dry` and `deploy`
targets, which pass `PRIVATE_KEY` on the command line; they use `CHAIN_NAME` through the script rather than the
Makefile's `RPC_URL` variable.

## Install into an existing DAO

Use the [Distributor setup reference](../plugins/capital-distributor/setup.md#installation) for installation data, helper discovery, and the permission changes. Apply them through the [OSx plugin installation flow](../guides/install-a-plugin.md). The [campaign walkthrough](../guides/distribute-tokens.md) then authorizes the payout calls and creates a campaign.

## Confirm the deployment

Record the repository commit, chain, deployment transactions, DAO, plugin proxy and implementation, setup, factories,
and execution-condition helper. Compare the installed permissions with the [setup reference](../plugins/capital-distributor/setup.md#installation) and confirm who controls the
Admin plugin or other governance mechanism.

Read the selected [factory registrations](../plugins/capital-distributor/setup.md#strategy-and-encoder-registries) and compare their implementation and fee terms with the intended configuration.

Before funding a campaign, simulate its creation and claim with the intended token, recipient proof, fees, and allowed calls. For a vault campaign, include approval, deposit, and any fee transfer. The [payout reference](../plugins/capital-distributor/payouts.md) documents token-failure handling, vault assumptions, and the calls to authorize.

Tests for these paths are in [the plugin tests](https://github.com/aragon/osx-capital-distributor/blob/8577c133be83b5a95176581752e0b391f65dc3c5/tests/CapitalDistributorPluginTest.t.sol),
[execution-condition tests](https://github.com/aragon/osx-capital-distributor/blob/8577c133be83b5a95176581752e0b391f65dc3c5/tests/integration/ExecuteConditionIntegrationTest.t.sol), and
[vault encoder tests](https://github.com/aragon/osx-capital-distributor/blob/8577c133be83b5a95176581752e0b391f65dc3c5/tests/payoutActionEncoders/VaultDepositPayoutActionEncoderTest.t.sol).
