---
type: guide
title: Lock, delegate, and vote with VE
source: ve-governance/src/escrow/VotingEscrowIncreasing_v1_2_0.sol, ve-governance/src/delegation/EscrowIVotesAdapter.sol, ve-governance/src/voting/AddressGaugeVoter.sol, ve-governance/src/voting/IAddressGaugeVoter.sol, ve-governance/src/queue/DynamicExitQueue.sol
---

# Lock, delegate, and vote with VE

This walkthrough follows a holder using the [v1.4 VE component set](../plugins/ve-governance/setup.md). It also shows which
queries an application needs to present voting and withdrawal state. Build instructions and dependency remappings live
in the [VE repository](https://github.com/aragon/ve-governance).

The Solidity snippets belong inside a Foundry test using `Test` and its `vm` helper. Bind `escrow`, `adapter`, `voter`, and
`queue` to contracts from the same deployed component set. Use a funded `holder`, a deposit `amount` at least as large as
`minDeposit()`, and two gauges already registered and active. The `vm.startPrank` calls model transactions from that
holder; a wallet integration sends those transactions from the holder directly.

```solidity
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {VotingEscrowV1_2_0} from "@escrow/VotingEscrowIncreasing_v1_2_0.sol";
import {EscrowIVotesAdapter} from "@delegation/EscrowIVotesAdapter.sol";
import {AddressGaugeVoter} from "@voting/AddressGaugeVoter.sol";
import {IAddressGaugeVote} from "@voting/IAddressGaugeVoter.sol";
import {DynamicExitQueue} from "@queue/DynamicExitQueue.sol";
```

## 1. Deposit and choose a delegate

Approve the underlying token, create the position, and self-delegate to vote directly:

```solidity
vm.startPrank(holder);
IERC20(escrow.token()).approve(address(escrow), amount);
uint256 tokenId = escrow.createLock(amount);
adapter.delegate(holder);
vm.stopPrank();
```

The holder owns the resulting NFT. An application can read `locked(tokenId)` for the amount and recorded start,
`votingPower(tokenId)` for position power, and `adapter.getVotes(holder)` for delegated power. Those values measure
[different parts of the position and delegation model](../plugins/ve-governance/delegation.md).

## 2. Cast relative weights

When `voter.votingActive()` is true and `voter.paused()` is false:

```solidity
IAddressGaugeVote.GaugeVote[] memory weights = new IAddressGaugeVote.GaugeVote[](2);
weights[0] = IAddressGaugeVote.GaugeVote({weight: 3, gauge: gaugeA});
weights[1] = IAddressGaugeVote.GaugeVote({weight: 1, gauge: gaugeB});
vm.prank(holder);
voter.vote(weights);
```

This divides the holder's available delegated power approximately 75% to A and 25% to B. A later vote replaces the
holder's previous allocation. In the standard hook-enabled setup, the allocation persists across epochs; recasting in an
open window includes increased power.

## 3. Read weights for an allocation

At the block selected by your allocation policy:

```solidity
uint256 bucket = voter.getWriteEpochId();
uint256 weightA = voter.epochGaugeVotes(bucket, gaugeA);
uint256 weightB = voter.epochGaugeVotes(bucket, gaugeB);
```

For an application or indexer, set the same historical block on all three RPC reads. This Solidity fragment reads the
state of its execution block. The [accounting page](../plugins/ve-governance/gauge-voting.md) explains why an epoch number
alone does not identify a frozen reward result.

For example, if eligible weights are 300 and 100, a policy distributing 10,000 reward tokens proportionally assigns
7,500 and 2,500. The protocol identifies the actual recipients and publishes their amounts through its payout process.
[Create a Merkle campaign](./distribute-tokens.md) to make such calculated allocations claimable with Capital Distributor.

## 4. Begin an exit

Once the position meets the minimum lock requirement:

```solidity
vm.startPrank(holder);
IERC721(escrow.lockNFT()).approve(address(escrow), tokenId);
escrow.beginWithdrawal(tokenId);
vm.stopPrank();
```

The position stops contributing power and the holder receives a queue ticket. Read `queue.queue(tokenId)` for its terms,
`queue.calculateFee(tokenId)` for the fee, and `queue.canExit(tokenId)` for completion eligibility.

When eligible, the ticket holder calls `escrow.withdraw(tokenId)` to receive the underlying tokens minus the fee. They can
instead call `escrow.cancelWithdrawalRequest(tokenId)` while the request is pending. Cancellation restores the position;
including its restored power in gauge votes requires recasting during a voting window.

The [withdrawal page](../plugins/ve-governance/withdrawals.md) covers ticket-specific fees and waiting periods.
