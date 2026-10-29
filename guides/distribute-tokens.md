---
type: guide
title: Distribute tokens through a Merkle campaign
source: osx-capital-distributor/src/CapitalDistributorPlugin.sol, osx-capital-distributor/src/interfaces/ICapitalDistributorPlugin.sol, osx-capital-distributor/src/allocatorStrategies/MerkleDistributorStrategy.sol, osx-capital-distributor/src/CapitalDistributorPluginSetup.sol, osx-capital-distributor/script/utils/GenerateMerkleTree.s.sol, osx-capital-distributor/script/utils/GenerateProof.s.sol
---

# Distribute tokens through a Merkle campaign

Use [Capital Distributor](../plugins/capital-distributor.md) to make a recipient list claimable from a DAO treasury. The
list may come from grants, an incentive program, or [VE gauge results](./use-ve-governance.md#3-read-weights-for-an-allocation).
The protocol calculates those amounts before creating the campaign.

This walkthrough assumes Distributor is [installed](../plugins/capital-distributor/setup.md), the DAO has the payout
tokens, and its strategy factory has the included Merkle strategy registered as `bytes32("merkle-distributor-strategy")`,
the ID used by the repository deployment script. A different registry can use another ID. Read the selected factory
entry to identify the implementation and fee terms.

Use the [Distributor repository](https://github.com/aragon/osx-capital-distributor) for build and dependency setup. The Solidity fragments use that checkout's imports and belong inside your Foundry test or script.
Bind `distributor`, `condition` (installation helper `0`), and `token` to the installed plugin, helper, and payout token.

## 1. Prepare allocations and proofs

Use the [Merkle tools](../tooling/capital-distributor-merkle.md) to prepare one total entitlement per recipient, generate a root and proofs, and verify them. Publish the list and proofs so recipients can obtain data for the root you use as `merkleRoot` below.

## 2. Prepare the DAO actions

Import the plugin types, DAO action type, and execution condition:

```solidity
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {Action} from "@aragon/commons/executors/IExecutor.sol";
import {ExecuteSelectorCondition} from "@aragon/conditions/ExecuteSelectorCondition.sol";
import {CapitalDistributorPlugin} from "../src/CapitalDistributorPlugin.sol";
import {ICapitalDistributorPlugin} from "../src/interfaces/ICapitalDistributorPlugin.sol";
```

The two actions below authorize direct token transfers and create a campaign. Submit them through your DAO's governance
process, as described in [managing permissions](./manage-permissions.md). The DAO is the caller of both actions.

```solidity
ExecuteSelectorCondition.SelectorTarget memory allowed =
    ExecuteSelectorCondition.SelectorTarget({where: address(token), selectors: new bytes4[](1)});
allowed.selectors[0] = IERC20.transfer.selector;

ICapitalDistributorPlugin.StrategyConfig memory strategy =
    ICapitalDistributorPlugin.StrategyConfig({
        strategyId: bytes32("merkle-distributor-strategy"),
        strategyParams: "",
        initData: abi.encode(merkleRoot)
    });
ICapitalDistributorPlugin.PayoutConfig memory payout =
    ICapitalDistributorPlugin.PayoutConfig({
        token: token, actionEncoderId: bytes32(0), actionEncoderInitData: ""
    });
ICapitalDistributorPlugin.CampaignSettings memory settings =
    ICapitalDistributorPlugin.CampaignSettings({startTime: 0, endTime: uint64(block.timestamp + 30 days)});

Action[] memory actions = new Action[](2);
actions[0] = Action({
    to: address(condition), value: 0,
    data: abi.encodeCall(ExecuteSelectorCondition.allowSelectors, (allowed))
});
actions[1] = Action({
    to: address(distributor), value: 0,
    data: abi.encodeCall(ICapitalDistributorPlugin.createCampaign,
        (bytes("ipfs://campaign-metadata"), strategy, payout, settings))
});
```

Encoder ID `bytes32(0)` chooses a direct transfer. The strategy's fee, if configured, uses the same token transfer
selector. Creating the campaign emits `CampaignCreated` with its ID.

Tokens must be held by the DAO address for claims to succeed. Campaign creation does not reserve those funds; other
campaigns and DAO actions can spend the same treasury balance. The [payout page](../plugins/capital-distributor/payouts.md)
covers vault calls and token behavior.

## 3. Claim the allocation

A recipient or relayer submits the proof and total entitlement for `recipient`:

```solidity
bytes memory strategyData = abi.encode(merkleProof, totalEntitlement);
uint256 netAmount = distributor.claimCampaignPayout(campaignId, recipient, strategyData, "");
```

The contract verifies entitlement, subtracts prior claims and any fee, and asks the DAO to pay the remainder. A relayer
cannot redirect this method's payout. A holder who wants another destination calls `claimCampaignPayoutToAddress` with
their own proof.

Read `getClaimedAmount(campaignId, recipient)` for the gross amount consumed, and `isCampaignActive(campaignId)` for state
and timing. `getCampaignPayout` returns total entitlement, so it needs prior claims and fees subtracted to quote a net
remaining payout.

## 4. Change entitlements when needed

Through governance, pause the campaign, call `updateCampaignMerkleRoot` on its strategy with the replacement root, and
resume it. Publish replacement proofs at the same time. The [root-update rules](../plugins/capital-distributor/merkle-allocations.md#updating-a-root)
explain the required time bounds and why replacement allocations are cumulative.
