---
type: concept
title: Governance tokens
tags: [governance]
source: token-voting-plugin/src/erc20/GovernanceERC20.sol, token-voting-plugin/src/erc20/GovernanceWrappedERC20.sol, token-voting-plugin/src/erc20/IERC20MintableUpgradeable.sol, token-voting-plugin/src/erc20/IGovernanceWrappedERC20.sol, token-voting-plugin/src/TokenVotingSetup.sol
---

# Governance tokens

[Token Voting Plugin](../token-voting-plugin.md) draws voting power from an `IVotes` token, a token with the checkpointed, delegatable balances OpenZeppelin's `ERC20Votes` provides. Choosing that token is the main decision when you install the plugin, and `TokenVotingSetup` handles three paths automatically based on the token settings you pass:

1. **Mint a new token.** Pass no token address and the setup deploys a fresh **`GovernanceERC20`** and mints an initial supply to the receivers you specify. The DAO gets mint rights. Best for a new DAO issuing its own governance token.
2. **Reuse an existing `IVotes` token.** Pass a token that already speaks `IVotes` and it's used as-is, no new deployment. Best when your community already has a governance token.
3. **Wrap a plain ERC-20.** Pass a token that *isn't* `IVotes` and the setup deploys a **`GovernanceWrappedERC20`** around it. Holders lock the original token into the wrapper to receive voting power. The fallback for governing with a token that was never built for it.

(The setup duck-types these: it probes for `IVotes` functions rather than trusting an ERC-165 flag, since many `IVotes` tokens don't advertise support formally.)

## `GovernanceERC20`: a mintable governance token

A full `ERC20Votes` + `ERC20Permit` token, DAO-managed:

- **Minting is DAO-gated.** `mint` is behind `MINT_PERMISSION_ID`, granted to the DAO at install, so new supply is issued through governance, not by an EOA.
- **Supply can be frozen.** `freezeMinting` is a one-way switch a DAO can flip to credibly commit to a fixed supply, visible right on the token.

## `GovernanceWrappedERC20`: retrofitting votes onto an existing token

Wraps an existing ERC-20 to add `IVotes`. It has **no mint of its own**, supply is entirely a function of how much of the underlying token has been deposited:

- `depositFor(account, amount)` locks the underlying token and mints an equal amount of wrapped, voting-enabled token.
- `withdrawTo(account, amount)` reverses it 1:1.

This works, but it adds real friction: holders must actively wrap (lock) their tokens to participate, so turnout suffers. Prefer a native `GovernanceERC20` for a new token; reach for wrapping only when you're committed to an existing non-governance ERC-20.

## Delegation

[Voting power is delegated, not merely held](./voting-power.md#delegation), the rule that catches every token-voting DAO out. What differs between the token types is *how that first delegation happens*:

- **`GovernanceERC20`** has an `ensureDelegationOnMint` option: when set, minting auto-delegates a recipient to themselves if they haven't delegated yet. Leave it off and freshly-minted holders have balance but no power until they manually `delegate()`, the classic onboarding foot-gun.
- **`GovernanceWrappedERC20`** always auto-self-delegates on receipt, so wrapping already grants power without a separate step (it compensates for the friction of wrapping).

> The zkSync variant of the setup (`TokenVotingSetupZkSync`) differs only in *how* it deploys these token contracts (fresh deployment instead of minimal-proxy clones, for zkEVM compatibility); the governance behavior is identical.

## Keep in mind

- **Delegate, or holders have no power.** Unless `ensureDelegationOnMint` is on (or you use the wrapper), a token holder must delegate before they can vote, expect to guide users through it.
- **Wrapping means locking.** Voting with `GovernanceWrappedERC20` requires depositing the underlying token; that friction depresses turnout. Don't wrap a token you could instead issue natively.

## See also

- [Token Voting Plugin](../token-voting-plugin.md) — how the plugin reads voting power from the token.
- [Plugin setup](../../framework/plugin-setup.md) — the setup mechanism that deploys and wires all this.
