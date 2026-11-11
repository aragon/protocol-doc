---
type: concept
title: ExecuteSelectorCrossChainCondition
tags: [permissions, security]
source: conditions/src/ExecuteSelectorCrossChainCondition.sol, conditions/src/lib/common.sol
---

# ExecuteSelectorCrossChainCondition

`ExecuteSelectorCrossChainCondition` scopes a DAO's [`EXECUTE_PERMISSION_ID`](../../core/execution.md) like [ExecuteSelectorCondition](./execute-selector-condition.md), with allow-lists **keyed by chain**. It checks the actions the DAO runs on its own chain, and it also checks the actions the DAO relays to **other chains** through a CrossChainController. It's the [condition library](../condition-library.md) member for DAOs that govern contracts on more than one chain from a single home chain.

## When to use it

Your DAO lives on one chain and sends proposals to other chains: a passed proposal calls `forwardMessage` on a CrossChainController, which bridges a batch of actions to an executor on the destination chain. With [ExecuteSelectorCondition](./execute-selector-condition.md) you can allow-list `forwardMessage`, but the condition cannot see the payload, so every relayed batch passes whatever it does remotely. This condition decodes that payload and checks each relayed action against the allow-list for its destination chain. "This plugin may make the DAO execute, but only `transfer` on USDC here, and only `setRewardRate` on the staking contract on chain 10."

If the DAO never relays to other chains, use [ExecuteSelectorCondition](./execute-selector-condition.md).

## What it checks

As with its sibling, the condition only fires when the call **is** `execute()`, then checks every [action](../../core/execution.md) in the batch:

```solidity
if (getSelector(_data) != IExecutor.execute.selector) return false;   // must be execute()
(, Action[] memory actions,) = abi.decode(_data[4:], ...);            // unpack the batch
for each action:
    require allowed on (block.chainid, action.to)                     // local check, always
    if action's selector is forwardMessage:
        (dstChainId, , message) = decode forwardMessage args
        inner = abi.decode(message, (Action[]))                       // the relayed batch
        require inner.length > 0
        for each inner action: require allowed on (dstChainId, inner.to)
```

The per-action rule is the one [ExecuteSelectorCondition](./execute-selector-condition.md#what-it-checks) applies, evaluated against one chain's lists:

| Action shape | Allowed when |
|---|---|
| Empty calldata, non-zero `value` (plain native transfer) | `allowedNativeTransfers[chain][to]` |
| Empty calldata, zero `value` | never |
| 1 to 3 bytes of calldata | never |
| Calldata with a selector, zero `value` | `allowedSelectors[chain][to][selector]` |
| Calldata with a selector, non-zero `value` | the selector is allowed **and** `allowedNativeTransfers[chain][to]` |

Three properties of the relay check matter in practice:

- **The controller is an ordinary local target.** A relay is itself an action on this chain, so `forwardMessage` must be allow-listed on `(block.chainid, controller)`. A controller missing from the list is rejected even if every relayed action would pass.
- **Relays are detected by selector, not by target.** Any action whose selector is `forwardMessage(uint256,uint256,bytes)` has its calldata decoded as a relay, whatever contract it calls. Calldata that doesn't decode as a relay with an `Action[]` message makes the condition revert, which [denies](../../common/permission-conditions.md) the call.
- **One level deep.** The inner actions are checked against the destination chain's lists, but not decoded further. Allow-listing `forwardMessage` on a destination chain lets a relayed batch relay **any** actions onward from there.

**Value on a relayed action is paid on the destination chain.** An inner action with non-zero `value` is executed by the destination chain's executor and paid from *its* balance, not the DAO's. The home chain still decides whether that is allowed, through `allowedNativeTransfers[dstChainId][target]`.

**An empty relay is rejected.** A `forwardMessage` whose message decodes to zero actions would execute nothing remotely yet still cost bridging fees, so the condition denies it. An `execute()` with an empty *outer* batch, by contrast, passes.

## Configuration

| | |
|---|---|
| Constructor | `(IDAO _dao, uint256[] _chainIds, SelectorTarget[] _initialEntries)`, matched by index; `SelectorTarget { address where; bytes4[] selectors; }` |
| Factory | `ConditionFactory.deployExecuteSelectorCrossChainCondition(dao, chainIds, initialEntries)`, emits `ExecuteSelectorCrossChainConditionDeployed` |
| Manage selectors | `allowSelectors([chainId,] SelectorTarget)` / `disallowSelectors([chainId,] SelectorTarget)` |
| Manage native transfers | `allowNativeTransfers([chainId,] address)` / `disallowNativeTransfers([chainId,] address)` |
| Read the lists | `allowedSelectors(chainId, where, selector)`, `allowedNativeTransfers(chainId, where)` |
| Managed by | `MANAGE_SELECTORS_PERMISSION_ID` (grant to the DAO) |
| Events | `SelectorAllowed/Disallowed(chainId, selector, where)`, `NativeTransfersAllowed/Disallowed(chainId, where)` |
| Errors | `ChainIdsLengthMismatch(chainIds, entries)`, `InvalidChainId()` |

Every management function has two overloads: the one **without** a `chainId` acts on `block.chainid`; the other takes the chain explicitly. In the constructor, pass `block.chainid` for entries that apply to the home chain.

**Chain id `0` is rejected** (`InvalidChainId`) by the constructor and by both *allow* functions. The destination chain id comes from the proposal's own calldata, so an entry stored under chain `0` could be matched by a crafted relay.

**Native transfers have no constructor path**, as in the sibling: `_initialEntries` only seeds selectors, so any native-transfer allowance (on the home chain or a destination) needs a governed `allowNativeTransfers` call after deployment.

## Example

Allow a plugin to make the DAO relay USDC transfers to chain 10, and nothing else. This runs from an account holding `ROOT_PERMISSION_ID` on the DAO (in practice, a DAO proposal):

```solidity
uint256 constant DST_CHAIN = 10;

uint256[] memory chainIds = new uint256[](2);
ExecuteSelectorCrossChainCondition.SelectorTarget[] memory entries =
    new ExecuteSelectorCrossChainCondition.SelectorTarget[](2);

// Home chain: the DAO may call forwardMessage on its CrossChainController
chainIds[0] = block.chainid;
entries[0].where = address(controller);
entries[0].selectors = new bytes4[](1);
entries[0].selectors[0] = ICrossChainController.forwardMessage.selector;

// Destination chain: the relayed batch may only call transfer on USDC there
chainIds[1] = DST_CHAIN;
entries[1].where = USDC_ON_DST_CHAIN;
entries[1].selectors = new bytes4[](1);
entries[1].selectors[0] = IERC20.transfer.selector;

// The deployed ConditionFactory doesn't expose this condition yet (see "Keep in mind")
ExecuteSelectorCrossChainCondition condition = new ExecuteSelectorCrossChainCondition(dao, chainIds, entries);

dao.grantWithCondition(address(dao), plugin, dao.EXECUTE_PERMISSION_ID(), condition);
dao.grant(address(condition), address(dao), condition.MANAGE_SELECTORS_PERMISSION_ID());
```

A proposal on that plugin then carries one outer action, the relay:

```solidity
Action[] memory remote = new Action[](1);
remote[0] = Action({to: USDC_ON_DST_CHAIN, value: 0, data: abi.encodeCall(IERC20.transfer, (recipient, amount))});

Action[] memory actions = new Action[](1);
actions[0] = Action({
    to: address(controller),
    value: 0,
    data: abi.encodeCall(ICrossChainController.forwardMessage, (DST_CHAIN, 500_000, abi.encode(remote)))
});
```

`ICrossChainController` is declared in the condition's source file. The controller enforces its own permissions on `forwardMessage`, so the DAO must also be authorized there; the condition only decides whether the DAO may *attempt* the call.

## Keep in mind

- **Any selector that can relay is a blank check.** The condition inspects only direct `forwardMessage` calls. Allow-listing another function that ends up relaying or executing arbitrary actions (a wrapper, a multicall, the DAO's own `execute`, or `forwardMessage` on a destination chain) lets those actions through unchecked.
- **The lists are keyed by chain and address.** An allowance on one chain grants nothing on another, even for a contract at the same address. Configure every destination explicitly.
- **Remote value is a home-chain decision.** A relayed action with `value` spends the destination executor's balance; clear it with `allowNativeTransfers(dstChainId, target)` only for targets that should receive it.
- **The check runs at execution.** Like any condition, it reads the lists when `execute()` is called, so a selector disallowed after a proposal passed blocks that proposal.
- **Deploy it with its constructor.** The [ConditionFactory](../condition-library.md#the-conditionfactory) deployed on every network (the `current` factory in [artifacts-hub](../../tooling/artifacts-hub.md)) predates this condition and has no `deployExecuteSelectorCrossChainCondition`. The factory function exists in source, for factories deployed from it.
- **A selector is not its arguments.** The destination chain id and inner targets are checked, but amounts, recipients and the gas limit are not; for argument rules use a bespoke [condition](../../common/permission-conditions.md) or [RuledCondition](../../common/ruled-condition.md).

## See also

- [ExecuteSelectorCondition](./execute-selector-condition.md): the single-chain counterpart, same per-action rules.
- [Condition Library](../condition-library.md): the library overview and the factory.
- [Actions and execution](../../core/execution.md): the `execute`/`Action` shape this inspects.
