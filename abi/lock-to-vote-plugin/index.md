# lock-to-vote-plugin — ABI reference

Generated from [`lock-to-vote-plugin`](https://github.com/aragon/lock-to-vote-plugin) at commit [`5a513e3d`](https://github.com/aragon/lock-to-vote-plugin/commit/5a513e3d9f1aad35d8926de87c408720e8d20a8d).

17 entries. Regenerate with `just abi`.

## Contracts

- [`LockManagerBase`](./LockManagerBase.md) — Helper contract acting as the vault for locked tokens used to vote on LockToGovern plugins.
- [`LockManagerERC20`](./LockManagerERC20.md) — Helper contract acting as the vault for locked tokens used to vote on LockToGovern plugins.
- [`LockToGovernBase`](./LockToGovernBase.md) — LockToGovernBase
- [`LockToVotePlugin`](./LockToVotePlugin.md)
- [`LockToVotePluginSetup`](./LockToVotePluginSetup.md) — The setup contract of the `LockToVotePlugin` contract.
- [`MajorityVotingBase`](./MajorityVotingBase.md) — The abstract implementation of majority voting plugins.
- [`MinVotingPowerCondition`](./MinVotingPowerCondition.md) — Checks if an account's voting power or token balance meets the threshold defined on the given plugin.
- [`PluginUUPSUpgradeable`](./PluginUUPSUpgradeable.md) — An abstract, upgradeable contract to inherit from when creating a plugin being deployed via the UUPS pattern (see…

## Interfaces

- [`ILockManager`](./ILockManager.md) — Helper contract acting as the vault for locked tokens used to vote on LockToGovern plugins.
- [`ILockToGovernBase`](./ILockToGovernBase.md) — ILockToGovernBase
- [`ILockToVote`](./ILockToVote.md) — Governance plugin allowing token holders to use tokens locked without a snapshot requirement and engage in proposals immediately
- [`IMajorityVoting`](./IMajorityVoting.md) — The interface of majority voting plugin.

## Structs

- [`LockManagerSettings`](./LockManagerSettings.md) — The struct containing the LockManager helper settings.

## Enums

- [`PluginMode`](./PluginMode.md) — Defines wether the accepted plugin types.

## Functions

- [`createProxyAndCall`](./createProxyAndCall.md)
- [`createSaltedProxyAndCall`](./createSaltedProxyAndCall.md)
- [`predictProxyAddress`](./predictProxyAddress.md)
