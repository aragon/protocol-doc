---
type: guide
title: Import an existing token
source: token-voting-plugin/src/TokenVotingSetup.sol, token-voting-plugin/src/TokenVoting.sol, token-voting-plugin/src/erc20/GovernanceWrappedERC20.sol
---

# Import an existing token

Use your community's existing ERC-20 to govern an OSx DAO with [Token Voting](/plugins/token-voting-plugin.md). A token with compatible voting checkpoints can be used directly. Otherwise, the setup deploys a wrapper and holders deposit their tokens to obtain voting power.

This guide adapts the Foundry example in [Launch a governance token](/guides/launch-a-governance-token.md). Use its setup and DAO deployment code, replacing the initial token distribution with the settings below. It targets Token Voting release 1, build 4, the [documented snapshot](/repositories.md).

## 1. Check whether the token can be used directly

The setup requires a token contract whose `balanceOf` call returns a `uint256`. It then probes three voting functions:

| Function | Purpose |
|---|---|
| `getVotes(account)` | Current delegated voting power |
| `getPastVotes(account, timepoint)` | An account's historical voting power |
| `getPastTotalSupply(timepoint)` | Historical total supply |

Call `setup.supportsIVotesInterface(existingToken)` to check whether the voting-function probes pass. ERC-165 support is not required. Passing the probes confirms the functions are callable; also verify that the token maintains voting checkpoints.

A compatible token is reused. A token that fails the voting probes is wrapped as `GovernanceWrappedERC20`. Block-number and timestamp-based tokens are supported; timestamp tokens must report a consistent [ERC-6372 clock](/plugins/token-voting-plugin/voting-power.md#block-based-vs-timestamp-based-tokens). A clock mismatch reverts installation rather than selecting a wrapper.

If wrapping is required, holders need extra approval and deposit transactions. Their deposited underlying tokens are unavailable for other uses until withdrawn, and this DAO's quorum uses **wrapped supply**, not all underlying tokens. Confirm that participation model before installing.

## 2. Supply the existing token in the installation data

In the launch guide's deployment function, replace its token and mint settings with:

```solidity
address existingToken = vm.envAddress("EXISTING_TOKEN_ADDRESS");
TokenVotingSetup.TokenSettings memory tokenSettings = TokenVotingSetup.TokenSettings({
    addr: existingToken,
    name: "Wrapped Community Token", // Used only if a wrapper is deployed.
    symbol: "wCOMM"
});
GovernanceERC20.MintSettings memory mintSettings = GovernanceERC20.MintSettings({
    receivers: new address[](0),
    amounts: new uint256[](0),
    ensureDelegationOnMint: false
});
```

Continue with [Step 3 of the launch guide](/guides/launch-a-governance-token.md#step-3-set-the-rules-and-deploy): choose voting rules, pass these settings to `encodeInstallationParameters`, and call `createDao`. No initial tokens are minted when `addr` is nonzero; importing does not grant the DAO mint rights over the existing token.

For an existing DAO, use the same installation data with [Install a plugin](/guides/install-a-plugin.md).

## 3. Prepare holders to vote

Add these imports to the launch guide's test:

```solidity
import {TokenVoting} from "@aragon/token-voting-plugin/TokenVoting.sol";
import {GovernanceWrappedERC20} from "@aragon/token-voting-plugin/erc20/GovernanceWrappedERC20.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
```

After `createDao`, read `getVotingToken()` to find the token voters will use. The following fork-test fragment prepares one holder who intends to vote for themselves. Set `TOKEN_HOLDER` to a funded holder on the fork; `WRAP_AMOUNT` is in the underlying token's smallest units.

```solidity
TokenVoting voting = TokenVoting(installed[0].plugin);
address votingToken = address(voting.getVotingToken());
address holder = vm.envAddress("TOKEN_HOLDER");

if (votingToken == existingToken) {
    // Reused token: activate this holder's voting power by self-delegating.
    vm.prank(holder);
    voting.getVotingToken().delegate(holder);
} else {
    // Wrapped token: approve the wrapper, then deposit underlying tokens.
    uint256 amount = vm.envUint("WRAP_AMOUNT");
    vm.startPrank(holder);
    IERC20Upgradeable(existingToken).approve(votingToken, amount);
    GovernanceWrappedERC20(votingToken).depositFor(holder, amount);
    vm.stopPrank();
}
assertGt(voting.getVotingToken().getVotes(holder), 0);
```

The wrapper self-delegates to a recipient without an existing delegate. If that recipient already delegates elsewhere, their delegate receives the power; check that address instead. Holders can later call `withdrawTo(holder, amount)` on the wrapper to recover their underlying tokens. Withdrawal does not erase votes available at an existing proposal's snapshot.

## 4. Wait for the voting power to enter the snapshot

Snapshots prevent **double voting**: after a holder votes, transferring the tokens or delegating them to another address does not give that address another vote with the same power. Every vote reads historical power just before proposal creation, rather than current balances. For an existing token, balances held for a long time still need delegation before that checkpoint; for a wrapper, holders must deposit before it too.

Depositing or delegating in the proposal's creation block is too late for its snapshot. Onchain, create the proposal in a later block or timestamp. In the fork test, advance the appropriate clock before following [Create, vote, and execute](/guides/create-vote-execute.md#token-voting-decide-by-weight):

```solidity
if (voting.tokenIndexedByTimestamp()) {
    vm.warp(block.timestamp + 1);
} else {
    vm.roll(block.number + 1);
}
```

If a holder still cannot vote, check `getPastVotes(holder, proposalSnapshot)`, their chosen delegate, and whether the proposal is open. Current `getVotes` alone does not establish eligibility for an older proposal.

A future voting start does not delay the snapshot. Finish holder preparation before **creating** the proposal, not merely before voting opens.
