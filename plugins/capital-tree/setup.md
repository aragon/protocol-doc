---
type: guide
title: Setup and permissions
tags: [automation, treasury]
source: capital-tree/src/setup/CapitalTreePluginSetup.sol, capital-tree/src/registry/ComponentRegistry.sol, capital-tree/script/Recipes.sol, capital-tree/script/Install.s.sol, capital-tree/script/Deploy.s.sol
---

# Setup and permissions

Deploying a capital flow means installing a Capital Tree plugin and its budget, actions and optional splitters into an existing **`DAO.sol` contract**. That contract holds the funds and executes the flow. We recommend a dedicated contract for each tree.

## Deploy a flow

1. **Choose the flow and its settings.** For a buyback and burn, choose the tokens, spending rate, maximum offer and amount to buy. Choose a **manager** to change settings and a **guardian** to pause or resume the flow.
2. **Prepare the installation.** Run the repository's installer against a published Capital Tree version on your network. It deploys your plugin and components, connects them, and produces the calls governance must approve.
3. **Approve the installation.** Submit those calls through your `DAO.sol` contract's governance or multisig. Executing the proposal grants the plugin permission to run the flow.
4. **Fund the flow.** Send the spending token to the `DAO.sol` contract. For a Stream budget, call `sync()` after funding; solvers can then trigger buybacks as the offer grows.

The [repository installation guide](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/README.md#install-a-flow) provides the commands and [buy-and-burn configuration](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/config/buy-and-burn.example.json).

## How installation works

### What must already exist

You need a [governed `DAO.sol` contract](../../framework/dao-factory.md), the network's [PluginSetupProcessor](../../framework/plugin-setup-processor.md), and a published Capital Tree version in a [PluginRepo](../../framework/plugin-repo.md). A PluginRepo is an onchain catalogue of installable versions.

The Capital Tree publisher deploys the shared component implementations, their registry and the setup contract, then publishes the setup as a plugin version. The **registry** associates names such as `StreamBudget@1` with implementation addresses. Each flow reuses these implementations through separate instances with its own settings and state.

If Capital Tree has not been published on your network, follow the [deployment runbook](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/README.md#deploy) first. This shared deployment is separate from installing each client's flow.

### What you supply

A **recipe** tells setup which budget, actions and splitters to create, how to connect them, and which settings and permissions to apply. The supplied `buyAndBurn` recipe already connects Stream, Open Fill and Burn; you supply:

| Input | Example |
|---|---|
| Treasury contract | Your `DAO.sol` contract address |
| Stream settings | USDC; offer grows by 1 USDC/hour, capped at 10 USDC |
| Purchase settings | Buy 100 MYTOKEN per fill; MYTOKEN supports `burn(uint256)` |
| Management | Manager and guardian addresses, which can be the same |

[`Recipes.buyAndBurn`](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/script/Recipes.sol) turns those inputs into the complete recipe. The installer encodes it as `abi.encode(recipe)` for preparation. Token amounts use their smallest units.

### What preparation deploys

Anyone can pay to prepare an installation. [`Install.s.sol`](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/script/Install.s.sol) calls the processor's `prepareInstallation` with the treasury address, plugin version and encoded recipe. The current script selects release 1, build 1.

The processor calls Capital Tree's setup contract. Setup looks up each component in the registry, deploys separate instances, applies their settings and connects the tree. A buy-and-burn installation creates four contracts: the plugin, Stream budget, Open Fill action and Burn action.

Preparation returns the plugin address, component addresses and permissions to grant. The installer uses these to print the approval calls. The contracts now exist; the next step authorizes them to operate through the `DAO.sol` contract.

### The install proposal

Follow the OSx guide to [install a plugin into an existing contract](../../guides/install-a-plugin.md) using the calls printed by the Capital Tree installer.

For a Stream budget, the installer adds `writeCheckpoint()` after installation to start accrual at zero when the proposal executes. Review the flow's settings, role holders and complete permission list before approval.

## Roles and permissions

The supplied buy-and-burn recipe installs these [permissions](../../core/permissions.md):

| Holder | Permission and target | Effect |
|---|---|---|
| Plugin | `EXECUTE_PERMISSION_ID` on `DAO.sol` contract | Submits the flow's calls for execution |
| `DAO.sol` contract | `CONFIGURE_PERMISSION_ID` on plugin | Replaces the flow with `setFlow` |
| Any address (`ANY_ADDR`) | `TRIGGER_PERMISSION_ID` on plugin | Makes triggering permissionless |
| Manager | `SET_SETTINGS_PERMISSION_ID` on Stream budget and Open Fill | Changes stream and purchase settings |
| Guardian | `PAUSE_PERMISSION_ID` on plugin | Pauses or resumes runs |
| `DAO.sol` contract | `CHECKPOINT_PERMISSION_ID` on Stream budget | Starts or restarts the stream |

## Fund and run

Funds belong in the `DAO.sol` contract. Read `budget()` on the plugin to find its Stream budget, then call `sync()` after depositing USDC. See [operating the stream](budgets/stream.md#operate-the-stream) for later deposits and withdrawals.

For buybacks, a [solver](examples/buyback/openfill.md) triggers each exchange. The `DAO.sol` contract executes the purchase and burn, and successful completion restarts the offer from zero.

## Uninstalling

Follow the [OSx uninstallation guide](../../guides/update-a-plugin.md#uninstalling-the-mirror). For Capital Tree, supply `abi.encode(originalPermissions)` as the uninstall data: the complete [`PermissionLib.MultiTargetPermission[]`](../../abi/osx/PermissionLib.md) returned during installation preparation.
