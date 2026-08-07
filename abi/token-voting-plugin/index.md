# token-voting-plugin — ABI reference

Generated from [`token-voting-plugin`](https://github.com/aragon/token-voting-plugin) at commit [`e97b783d`](https://github.com/aragon/token-voting-plugin/commit/e97b783d76872d694f41dfc4bc846405019ca741).

10 entries. Regenerate with `just abi`.

## Contracts

- [`GovernanceERC20`](./GovernanceERC20.md) — An [OpenZeppelin `Votes`](https://docs.openzeppelin.com/contracts/4.x/api/governance#Votes) compatible [ERC-20](https://eips.ethereum.org/EIPS/eip-20) token,…
- [`GovernanceWrappedERC20`](./GovernanceWrappedERC20.md) — Wraps an existing [ERC-20](https://eips.ethereum.org/EIPS/eip-20) token by inheriting from `ERC20WrapperUpgradeable` and allows using it for voting by…
- [`MajorityVotingBase`](./MajorityVotingBase.md) — The abstract implementation of majority voting plugins.
- [`TokenVoting`](./TokenVoting.md) — The majority voting implementation using an [OpenZeppelin `Votes`](https://docs.openzeppelin.com/contracts/4.x/api/governance#Votes) compatible governance token.
- [`TokenVotingSetup`](./TokenVotingSetup.md) — The setup contract of the `TokenVoting` plugin.
- [`TokenVotingSetupZkSync`](./TokenVotingSetupZkSync.md) — The setup contract of the `TokenVoting` plugin.
- [`VotingPowerCondition`](./VotingPowerCondition.md) — Checks if an account's voting power or token balance meets the threshold set in an associated TokenVoting plugin.

## Interfaces

- [`IERC20MintableUpgradeable`](./IERC20MintableUpgradeable.md) — Interface to allow minting of [ERC-20](https://eips.ethereum.org/EIPS/eip-20) tokens.
- [`IGovernanceWrappedERC20`](./IGovernanceWrappedERC20.md) — An interface for the token wrapping contract wrapping existing [ERC-20](https://eips.ethereum.org/EIPS/eip-20) tokens.
- [`IMajorityVoting`](./IMajorityVoting.md) — The interface of majority voting plugin.
