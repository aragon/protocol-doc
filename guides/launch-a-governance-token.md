---
type: guide
title: Launch a governance token with your DAO
source: token-voting-plugin/src/TokenVotingSetup.sol, osx/src/framework/dao/DAOFactory.sol
---

# Launch a governance token with your DAO

Install [Token Voting](../plugins/token-voting-plugin.md) with your DAO so *token holders* make its decisions. [Deploy your first DAO](./deploy-a-dao.md) installed a multisig with a fixed member set; the mechanics of `createDao` are identical here, but you also supply **the token**. Token Voting requires an [`IVotes` token](../plugins/token-voting-plugin/voting-power.md) with checkpointed, delegatable balances. Its setup gives you three ways to supply one in a single installation.

## What you need

The one-time [Setup](./setup.md), with the **token voting** plugin's remapping enabled. This guide reads the **`DAOFactory`** and **Token Voting `PluginRepo`** (`TOKEN_VOTING_PLUGIN_REPO_ADDRESS`) addresses.

## The token decision

`TokenVotingSetup` looks at the `addr` you pass in its `TokenSettings` and selects one of three paths. The [governance token](../plugins/token-voting-plugin/governance-tokens.md) choice determines the install data:

| `tokenSettings.addr` | What the setup does |
|---|---|
| `address(0)` | **Mints a new `GovernanceERC20`** from the `name`/`symbol` and `mintSettings` you provide. |
| an existing **`IVotes`** token | **Reuses it as-is** (no deployment). |
| a plain ERC-20 (not `IVotes`) | **Wraps it** in a `GovernanceWrappedERC20`; holders lock the original to get voting power. |

The setup duck-types the token (it *probes* for `IVotes`, it doesn't trust a flag), and it rejects a non-contract or non-ERC-20 address. This guide takes the first path, minting a fresh token.

> **Voting power requires delegation.** With any `IVotes` token, a holder has **zero** voting power until their balance is *delegated*, even to themselves; see [voting power](../plugins/token-voting-plugin/voting-power.md#delegation). When you mint a new token, set `ensureDelegationOnMint: true` so recipients can vote without a separate delegation step. Otherwise, token holders still need to delegate before they can vote.

The token records historical voting power because reading current balances would let a holder vote, transfer their tokens, and vote again from another address. Every proposal instead uses the checkpoint just before it was created. Minting or delegating afterward cannot add power to that proposal, even if voting is scheduled to start later. With automatic delegation disabled, recipients must delegate before that checkpoint themselves.

## Step 1, the skeleton

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Test} from "forge-std/Test.sol";
import {DAO} from "@aragon/osx/core/dao/DAO.sol";
import {DAOFactory} from "@aragon/osx/framework/dao/DAOFactory.sol";
import {PluginRepo} from "@aragon/osx/framework/plugin/repo/PluginRepo.sol";
import {PluginSetupRef} from "@aragon/osx/framework/plugin/setup/PluginSetupProcessorHelpers.sol";
import {IPlugin} from "@aragon/osx/common/plugin/IPlugin.sol";
// The next three come from the token-voting plugin package (path follows your dependency):
import {MajorityVotingBase} from "@aragon/token-voting-plugin/base/MajorityVotingBase.sol";
import {TokenVotingSetup} from "@aragon/token-voting-plugin/TokenVotingSetup.sol";
import {GovernanceERC20} from "@aragon/token-voting-plugin/erc20/GovernanceERC20.sol";

contract DeployWithTokenVoting is Test {
    DAOFactory factory = DAOFactory(vm.envAddress("DAO_FACTORY_ADDRESS"));
    PluginRepo tokenVotingRepo = PluginRepo(vm.envAddress("TOKEN_VOTING_PLUGIN_REPO_ADDRESS"));

    function setUp() public {
        vm.createSelectFork(vm.envString("RPC_URL"));
    }
}
```

## Step 2, describe the token

Mint a new token to two holders. `addr = address(0)` selects the "mint new" path; `mintSettings` lists who gets how much:

```solidity
function test_deployWithTokenVoting() public {
    // Path 1: mint a fresh GovernanceERC20 (addr == 0 uses name/symbol + mintSettings).
    TokenVotingSetup.TokenSettings memory tokenSettings =
        TokenVotingSetup.TokenSettings({addr: address(0), name: "Acme Vote", symbol: "ACME"});

    address[] memory receivers = new address[](2);
    receivers[0] = address(0xA11CE);
    receivers[1] = address(0xB0B);
    uint256[] memory amounts = new uint256[](2);
    amounts[0] = 100e18;
    amounts[1] = 100e18;

    GovernanceERC20.MintSettings memory mintSettings = GovernanceERC20.MintSettings({
        receivers: receivers,
        amounts: amounts,
        ensureDelegationOnMint: true // so holders can vote without delegating first
    });

    // ... voting rules + createDao in Step 3 (same function)
}
```

To **reuse** an existing `IVotes` token instead, set `addr` to it and leave `name`/`symbol`/`mintSettings` empty. To **wrap** a plain ERC-20, set `addr` to it (the `name`/`symbol` name the wrapper).

## Step 3, set the rules and deploy

The rest of the install data is the [voting configuration](../plugins/majority-voting.md) (thresholds are ratios out of `1_000_000`), plus the same `target: address(0)` [own-DAO sentinel](./deploy-a-dao.md) used for multisig. To encode the seven fields, resolve the setup from the repo version and call its typed **`encodeInstallationParameters(...)`** function. This avoids a positional `abi.encode` that can break silently if a field moves. Not every setup provides this [encoder](./build-a-plugin.md): Token Voting's does, while multisig's does not.

```solidity
    MajorityVotingBase.VotingSettings memory votingSettings = MajorityVotingBase.VotingSettings({
        votingMode: MajorityVotingBase.VotingMode.Standard, // see /plugins/voting-modes.md
        supportThreshold: 500_000,   // > 50% of yes+no (ratio out of 1e6)
        minParticipation: 100_000,   // >= 10% of total voting power must vote
        minDuration: 7 days,
        minProposerVotingPower: 0    // any holder may propose
    });

    IPlugin.TargetConfig memory targetConfig =
        IPlugin.TargetConfig({target: address(0), operation: IPlugin.Operation.Call});

    address[] memory excludedAccounts = new address[](0); // subtracted from total voting power (e.g. the treasury); none here

    // Resolve the setup for the version we install, then let it encode the 7 fields in the right order.
    PluginRepo.Tag memory versionTag = PluginRepo.Tag({release: 1, build: 4}); // pick the current build from the repo
    TokenVotingSetup setup = TokenVotingSetup(tokenVotingRepo.getVersion(versionTag).pluginSetup);
    bytes memory installData = setup.encodeInstallationParameters(
        votingSettings,
        tokenSettings,
        mintSettings,
        targetConfig,
        uint256(0),        // minApprovals: a fourth ratio (min share of total voting power that must vote yes, out of 1e6); 0 disables it
        bytes(""),         // plugin metadata
        excludedAccounts
    );

    DAOFactory.PluginSettings[] memory pluginSettings = new DAOFactory.PluginSettings[](1);
    pluginSettings[0] = DAOFactory.PluginSettings({
        pluginSetupRef: PluginSetupRef({versionTag: versionTag, pluginSetupRepo: tokenVotingRepo}),
        data: installData
    });

    DAOFactory.DAOSettings memory daoSettings =
        DAOFactory.DAOSettings({trustedForwarder: address(0), daoURI: "", subdomain: "", metadata: ""});

    (DAO dao, DAOFactory.InstalledPlugin[] memory installed) =
        factory.createDao(daoSettings, pluginSettings);

    // The plugin governs the DAO; the fresh token was deployed as a setup helper.
    address tokenVoting = installed[0].plugin;
    assertTrue(dao.hasPermission(address(dao), tokenVoting, dao.EXECUTE_PERMISSION_ID(), ""));
}
```

The encoder's arguments match this build's [setup ABI](/abi/token-voting-plugin/TokenVotingSetup.md#encodeinstallationparameters), keeping the field order and types aligned with what `prepareInstallation` decodes. If you encode the bytes manually, follow the selected build's setup and metadata: an incorrect order or type can make installation revert or decode unintended values. Check those definitions when adapting to another version.

## What you just saw

- The installation follows the same steps as any plugin; only the `data` differs. Here it carries the token choice and the voting rules.
- One install decision, `tokenSettings.addr`, picks between minting, reusing, and wrapping a token, [governance tokens](../plugins/token-voting-plugin/governance-tokens.md).
- `ensureDelegationOnMint: true` delegates on mint so holders have voting power. The token is deployed as a helper of the setup, owned by the DAO.

## Next

- [Create, vote, and execute a proposal](./create-vote-execute.md), now run a token vote on the DAO you just launched.
- Governing with an existing token instead? The [reuse and wrap paths](../plugins/token-voting-plugin/governance-tokens.md) are the same call with a different `addr`.
