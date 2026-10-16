---
type: guide
title: Import an existing token
source: token-voting-plugin/src/TokenVotingSetup.sol, token-voting-plugin/src/TokenVoting.sol, token-voting-plugin/src/erc20/GovernanceWrappedERC20.sol, osx/src/framework/dao/DAOFactory.sol
---

# Import an existing token

If your community already has an ERC-20, you can use it to govern an OSx DAO with [Token Voting](/plugins/token-voting-plugin.md). The first decision is whether the token can supply voting power directly or holders will need to wrap it. This guide explains that choice, installs the plugin with your token, and prepares a holder to vote.

## Why a token balance is not enough

Using current balances would let a holder vote, transfer the tokens to another address, and vote again with the same tokens. Token Voting prevents this by reading **historical voting power** at a snapshot just before each proposal is created. Moving tokens afterward cannot give a second account power over that proposal.

Your token therefore needs to record voting checkpoints. OpenZeppelin's `ERC20Votes` implements this through the `IVotes` interface; equivalent implementations can also work. If your token lacks those functions, a **wrapper** can add them: holders deposit the original token and receive a voting token backed one-for-one by that deposit. The original token contract remains in place. See [governance tokens](/plugins/token-voting-plugin/governance-tokens.md) for how the two token types work.

## 1. Check whether the token can be used directly

The plugin's setup contract checks the token before installing it. It requires a token contract whose `balanceOf` call returns a `uint256`, then probes three voting functions:

| Function | Purpose |
|---|---|
| `getVotes(account)` | Current delegated voting power |
| `getPastVotes(account, timepoint)` | An account's historical voting power |
| `getPastTotalSupply(timepoint)` | Historical total supply |

Call `setup.supportsIVotesInterface(existingToken)` on the setup for your chosen plugin version to check whether the voting-function probes pass. The installation example below resolves that setup from its versioned repository. ERC-165 support is not required. Passing the probes confirms the functions are callable; also verify that the token maintains voting checkpoints.

A compatible token is reused directly. A valid ERC-20 that fails the voting probes is wrapped as `GovernanceWrappedERC20`. This guide targets Token Voting release 1, build 4, which supports block-number and timestamp-based tokens. Timestamp tokens must report a consistent [ERC-6372 clock](/plugins/token-voting-plugin/voting-power.md#block-based-vs-timestamp-based-tokens); a clock mismatch reverts installation rather than selecting a wrapper.

### If your token already supports voting

You can keep the existing token, distribution, and holders. Importing connects Token Voting to that contract; it neither mints an initial allocation nor gives the DAO minting rights over your token. Existing delegation stays in place. Check that each intended voting address has power; depending on the token's behavior, holders may need to [delegate before participating](#3-prepare-holders-to-vote).

### If your token needs wrapping

Wrapping lets you keep the original token, but changes how holders participate. They approve the wrapper, deposit tokens, and vote using the wrapped balance's delegated power. They can recover the underlying tokens by burning the wrapped tokens through `withdrawTo`.

That introduces extra transactions and a second token balance to explain to holders. Deposited underlying tokens are unavailable for trading, staking, or other uses until withdrawn. This DAO's quorum is calculated from **wrapped supply**, subject to any [excluded accounts](/plugins/token-voting-plugin/voting-power.md#whose-supply-counts-excluded-accounts), rather than the original token's entire supply. Holding the original token alone does not give someone votes in this installation.

Discuss that experience with your team and community before installing: will holders be willing and able to deposit, and does governance based on wrapped supply fit your intended participation model? If your token was only recently deployed, weigh that ongoing friction against issuing a token with voting support built in. A replacement also needs an explicit plan for existing holders and balances; importing does not migrate them automatically. The [new-token guide](/guides/launch-a-governance-token.md) covers issuing a token if you choose that route.

If you are still designing a token to deploy independently, include `ERC20Votes` or compatible historical voting support from the start to avoid needing a wrapper later. Once you have chosen direct reuse or wrapping, continue below.

## 2. Supply the existing token in the installation data

The following fork test creates a **new DAO governed by your existing token**. The setup selects direct reuse or wrapping based on the token's compatibility. For an existing DAO, the same encoded installation data goes through [Install a plugin into a live DAO](/guides/install-a-plugin.md) instead of `createDao`.

Complete the project and network steps in [Setup](/guides/setup.md). For this guide's Token Voting dependency, use these pinned packages and remappings. This build still uses the standalone commons package:

```sh
forge install aragon/osx-commons@869045b069679fad94d640a8a3e1a1b5538cf0f0
forge install aragon/token-voting-plugin@e97b783d76872d694f41dfc4bc846405019ca741
echo '@aragon/osx-commons-contracts/=lib/osx-commons/contracts/' >> remappings.txt
echo '@aragon/token-voting-plugin/=lib/token-voting-plugin/src/' >> remappings.txt
```

Keep the plugin's [pinned dependency remappings](https://github.com/aragon/token-voting-plugin/blob/e97b783d76872d694f41dfc4bc846405019ca741/remappings.txt) for its other imports. Select a network where both your token and Token Voting release 1, build 4 are deployed. The example uses `RPC_URL`, `DAO_FACTORY_ADDRESS`, and `TOKEN_VOTING_PLUGIN_REPO_ADDRESS` from Setup, plus `EXISTING_TOKEN_ADDRESS` for your token.

Set `TokenSettings.addr` to the existing address. The name and symbol below are used only if setup deploys a wrapper; they do not rename an imported token. Leave `MintSettings` empty because this path does not mint a new token allocation.

The example's [voting thresholds](/plugins/majority-voting.md) use ratios out of `1_000_000`; choose them for your community before a live installation. `target: address(0)` selects the new DAO as the execution target. The typed [setup encoder](/abi/token-voting-plugin/TokenVotingSetup.md#encodeinstallationparameters) keeps the parameter order and types aligned with this build.

Save this fixture as `test/fork-tests/ImportExistingToken.t.sol`, then add the holder test in the next section inside the contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Test} from "forge-std/Test.sol";
import {DAO} from "@aragon/osx/core/dao/DAO.sol";
import {DAOFactory} from "@aragon/osx/framework/dao/DAOFactory.sol";
import {PluginRepo} from "@aragon/osx/framework/plugin/repo/PluginRepo.sol";
import {PluginSetupRef} from "@aragon/osx/framework/plugin/setup/PluginSetupProcessorHelpers.sol";
import {IPlugin} from "@aragon/osx-commons-contracts/src/plugin/IPlugin.sol";
import {TokenVoting} from "@aragon/token-voting-plugin/TokenVoting.sol";
import {TokenVotingSetup} from "@aragon/token-voting-plugin/TokenVotingSetup.sol";
import {MajorityVotingBase} from "@aragon/token-voting-plugin/base/MajorityVotingBase.sol";
import {GovernanceERC20} from "@aragon/token-voting-plugin/erc20/GovernanceERC20.sol";
import {GovernanceWrappedERC20} from "@aragon/token-voting-plugin/erc20/GovernanceWrappedERC20.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

contract ImportExistingToken is Test {
    DAO dao;
    TokenVoting voting;
    address existingToken;

    function setUp() public {
        vm.createSelectFork(vm.envString("RPC_URL"));
        existingToken = vm.envAddress("EXISTING_TOKEN_ADDRESS");
        assertGt(existingToken.code.length, 0, "Expected an existing token contract");

        DAOFactory factory = DAOFactory(vm.envAddress("DAO_FACTORY_ADDRESS"));
        PluginRepo repo = PluginRepo(vm.envAddress("TOKEN_VOTING_PLUGIN_REPO_ADDRESS"));
        PluginRepo.Tag memory tag = PluginRepo.Tag({release: 1, build: 4});
        TokenVotingSetup setup = TokenVotingSetup(repo.getVersion(tag).pluginSetup);
        bool reuseToken = setup.supportsIVotesInterface(existingToken);

        TokenVotingSetup.TokenSettings memory tokenSettings = TokenVotingSetup.TokenSettings({
            addr: existingToken,
            name: "Wrapped Community Token",
            symbol: "wCOMM"
        });
        GovernanceERC20.MintSettings memory mintSettings = GovernanceERC20.MintSettings({
            receivers: new address[](0),
            amounts: new uint256[](0),
            ensureDelegationOnMint: false
        });
        MajorityVotingBase.VotingSettings memory votingSettings = MajorityVotingBase.VotingSettings({
            votingMode: MajorityVotingBase.VotingMode.Standard,
            supportThreshold: 500_000, // More than 50% of Yes + No power must be Yes.
            minParticipation: 100_000, // At least 10% of total voting power must participate.
            minDuration: 7 days,
            minProposerVotingPower: 0 // Anyone may propose, including non-holders.
        });
        IPlugin.TargetConfig memory targetConfig =
            IPlugin.TargetConfig({target: address(0), operation: IPlugin.Operation.Call});
        bytes memory installData = setup.encodeInstallationParameters(
            votingSettings,
            tokenSettings,
            mintSettings,
            targetConfig,
            uint256(0),       // No additional minimum Yes share of total power.
            bytes(""),        // Plugin metadata.
            new address[](0)  // No accounts excluded from the voting-power denominator.
        );

        DAOFactory.PluginSettings[] memory plugins = new DAOFactory.PluginSettings[](1);
        plugins[0] = DAOFactory.PluginSettings({
            pluginSetupRef: PluginSetupRef({versionTag: tag, pluginSetupRepo: repo}),
            data: installData
        });
        DAOFactory.DAOSettings memory settings =
            DAOFactory.DAOSettings({trustedForwarder: address(0), daoURI: "", subdomain: "", metadata: ""});
        DAOFactory.InstalledPlugin[] memory installed;
        (dao, installed) = factory.createDao(settings, plugins);
        voting = TokenVoting(installed[0].plugin);

        assertEq(address(voting.getVotingToken()) == existingToken, reuseToken);
        assertTrue(dao.hasPermission(address(dao), address(voting), dao.EXECUTE_PERMISSION_ID(), ""));
    }

    // Add test_prepareHolder from the next section here.
}
```

After installation, `voting.getVotingToken()` identifies the token holders will vote with: the original address on the reuse path, or the new wrapper address. The fixture checks that result and the plugin's permission to execute DAO actions. A fresh wrapper starts with no deposited voting supply; installing it does not wrap holders' balances for them.

## 3. Prepare holders to vote

Voting power belongs to the address a holder [delegates to](/plugins/token-voting-plugin/voting-power.md#delegation). A holder can delegate to themselves to vote directly, or to another address to vote on their behalf. Delegation does not transfer token ownership. Even a long-held balance may have no voting power until it is delegated.

Add this test inside `ImportExistingToken`. Set `TOKEN_HOLDER` to an address holding the original token on the fork. If wrapping is needed, also set `WRAP_AMOUNT` to a positive amount within that balance, in the underlying token's smallest units. The test prepares a holder who chooses to vote for themselves; `vm.prank` simulates their transactions on the fork.

```solidity
function test_prepareHolder() public {
    address votingToken = address(voting.getVotingToken());
    address holder = vm.envAddress("TOKEN_HOLDER");

    if (votingToken != existingToken) {
        uint256 amount = vm.envUint("WRAP_AMOUNT");
        vm.startPrank(holder);
        IERC20Upgradeable(existingToken).approve(votingToken, amount);
        GovernanceWrappedERC20(votingToken).depositFor(holder, amount);
        vm.stopPrank();
    }

    // This holder chooses self-delegation for either token path.
    vm.startPrank(holder);
    voting.getVotingToken().delegate(holder);
    vm.stopPrank();
    assertGt(voting.getVotingToken().getVotes(holder), 0);

    // Continue here with the snapshot check in Step 4.
}
```

The wrapper automatically self-delegates on receipt if the recipient has no existing delegate; it preserves an existing delegation otherwise. The explicit `delegate(holder)` above makes this test deterministic and intentionally replaces any prior choice. In your holder flow, preserve the person's choice: a holder who delegates elsewhere should check that delegate's voting power instead.

Holders can later call `withdrawTo(holder, amount)` on the wrapper to recover their underlying tokens. Withdrawal changes future voting power, but does not erase the power recorded for an existing proposal's snapshot.

## 4. Wait for the voting power to enter the snapshot

The holder now has current voting power. To use it on a proposal, it must exist at that proposal's earlier snapshot. A token balance held for months does not help if its delegation, or its deposit into a wrapper, happens too late.

Finish holder preparation **before creating the proposal**, not merely before voting opens. A scheduled future start does not move the snapshot. For block-based tokens, deposits and delegation must precede the creation block; for timestamp-based tokens, they must precede its timestamp.

Add this after the power assertion inside `test_prepareHolder`, before its closing brace. It advances the token's clock and checks that the holder has power at the snapshot a proposal created now would use:

```solidity
if (voting.tokenIndexedByTimestamp()) {
    vm.warp(block.timestamp + 1);
} else {
    vm.roll(block.number + 1);
}
uint256 snapshot = voting.tokenIndexedByTimestamp() ? block.timestamp - 1 : block.number - 1;
assertGt(voting.getVotingToken().getPastVotes(holder, snapshot), 0);
```

Run the assembled fixture with `just test-fork --match-contract ImportExistingToken`, using the environment configured in [Setup](/guides/setup.md). Onchain, holders submit their own transactions and wait for the appropriate block or timestamp before anyone creates the proposal.

The import and holder-preparation steps are now complete. Continue with [Create, vote, and execute](/guides/create-vote-execute.md#token-voting-decide-by-weight): add its `IMajorityVoting` import, and import `Action` from `@aragon/osx-commons-contracts/src/executors/IExecutor.sol` to match this Token Voting build. Use `voting` where that example uses `tokenVoting`, and replace `alice` and `bob` with accounts you have prepared to vote. Prepare all participating holders before advancing the clock. The deployed addresses and prepared balances exist only in this fork; append the proposal calls to the same test after the snapshot check.

If a holder cannot vote, check their chosen delegate, `getPastVotes(voter, proposalSnapshot)`, and whether the proposal is open. Current `getVotes` alone does not establish eligibility for an older proposal. Having one eligible holder also does not guarantee the proposal can pass: its [participation and approval thresholds](/plugins/majority-voting.md) still need enough power to turn out.
