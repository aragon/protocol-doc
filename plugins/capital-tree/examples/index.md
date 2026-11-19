# Examples

Start with [Run a recurring buyback](buyback.md) to see how Stream, Open Fill and competing solvers form a buyback mechanism. Then choose where the proceeds go, or explore another flow below. Each example below has a supplied [recipe](../concepts.md#new-trees-compose-new-flows) in [`script/Recipes.sol`](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/script/Recipes.sol) and a configuration example in [aragon/capital-tree](https://github.com/aragon/capital-tree).

| Example | Composition |
|---|---|
| [Buy and Burn](./buy-and-burn.md) | Stream → Open Fill → Burn |
| [Buyback with a Fee](./buyback-with-fee.md) | Stream → Open Fill → weighted Burn and Transfer |
| [Buyback and Donate: avKAT](./avkat-buyback.md) | Stream → Open Fill → vault donation |
| [Payroll](./payroll.md) | Stream → weighted transfers |
| [Merkle Claims](./merkle-claims.md) | Merkle entitlement → caller-selected beneficiary |

## Custom compositions

A grants-and-auction tree can split a stream between a transfer and Open Fill. This has no supplied recipe. Both branches wait for a successful fill; changing demand resets the whole stream, including accrued grants. Use separate flows if those schedules must be independent.

Custom splitters can implement top-ups or caps. A Merkle claim can fund further processing, but swapping needs an action compatible with that budget; the supplied Open Fill expects a [checkpointed budget](../budgets/stream.md#checkpoint-interface). See [Compose a Capital Tree flow](../../../guides/compose-capital-tree.md) to build a custom composition.

Follow [Setup and permissions](../setup.md#the-install-proposal) to install your chosen flow.
