# osx — ABI reference

Generated from [`osx`](https://github.com/aragon/core) at commit [`f7c7508f`](https://github.com/aragon/core/commit/f7c7508f4ceb2b685ee037ffe87df17340fc4aef).

65 entries. Regenerate with `just abi`.

## Contracts

- [`Addresslist`](./Addresslist.md) — The majority voting implementation using a list of member addresses.
- [`CallbackHandler`](./CallbackHandler.md) — This contract handles callbacks by registering a magic number together with the callback function's selector.
- [`DAO`](./DAO.md) — This contract is the entry point to the Aragon DAO framework and provides our users a simple and easy to use public interface.
- [`DaoAuthorizable`](./DaoAuthorizable.md) — An abstract contract providing a meta-transaction compatible modifier for non-upgradeable contracts instantiated via the `new` keyword to authorize function…
- [`DaoAuthorizableUpgradeable`](./DaoAuthorizableUpgradeable.md) — An abstract contract providing a meta-transaction compatible modifier for upgradeable or cloneable contracts to authorize function calls through an associated…
- [`DAOFactory`](./DAOFactory.md) — This contract is used to create a DAO.
- [`DAORegistry`](./DAORegistry.md) — This contract provides the possibility to register a DAO.
- [`ENSSubdomainRegistrar`](./ENSSubdomainRegistrar.md) — This contract registers ENS subdomains under a parent domain specified in the initialization process and maintains ownership of the subdomain since only the…
- [`Executor`](./Executor.md) — Simple Executor that loops through the actions and executes them.
- [`InterfaceBasedRegistry`](./InterfaceBasedRegistry.md) — An [ERC-165](https://eips.ethereum.org/EIPS/eip-165)-based registry for contracts.
- [`MemberRegistry`](./MemberRegistry.md) — Permissionless member self-registration via ENS subdomain claims.
- [`MetadataExtension`](./MetadataExtension.md) — An abstract, non upgradeable contract for managing and retrieving metadata associated with a plugin.
- [`MetadataExtensionUpgradeable`](./MetadataExtensionUpgradeable.md) — An abstract, upgradeable contract for managing and retrieving metadata associated with a plugin.
- [`PermissionCondition`](./PermissionCondition.md) — An abstract contract for non-upgradeable contracts instantiated via the `new` keyword to inherit from to support customary permissions depending on arbitrary…
- [`PermissionConditionUpgradeable`](./PermissionConditionUpgradeable.md) — An abstract contract for upgradeable or cloneable contracts to inherit from and to support customary permissions depending on arbitrary on-chain state.
- [`PermissionManager`](./PermissionManager.md) — The abstract permission manager used in a DAO, its associated plugins, and other framework-related components.
- [`PlaceholderSetup`](./PlaceholderSetup.md) — A placeholder setup contract for outdated plugin builds.
- [`Plugin`](./Plugin.md) — An abstract, non-upgradeable contract to inherit from when creating a plugin being deployed via the `new` keyword.
- [`PluginCloneable`](./PluginCloneable.md) — An abstract, non-upgradeable contract to inherit from when creating a plugin being deployed via the minimal clones pattern (see…
- [`PluginRepo`](./PluginRepo.md) — The plugin repository contract required for managing and publishing different plugin versions within the Aragon DAO framework.
- [`PluginRepoFactory`](./PluginRepoFactory.md) — This contract creates `PluginRepo` proxies and registers them on a `PluginRepoRegistry` contract.
- [`PluginRepoRegistry`](./PluginRepoRegistry.md) — This contract maintains an address-based registry of plugin repositories in the Aragon App DAO framework.
- [`PluginSetup`](./PluginSetup.md) — An abstract contract to inherit from to implement the plugin setup for non-upgradeable plugins, i.e, - `Plugin` being deployed via the `new` keyword -…
- [`PluginSetupProcessor`](./PluginSetupProcessor.md) — This contract processes the preparation and application of plugin setups (installation, update, uninstallation) on behalf of a requesting DAO.
- [`PluginUpgradeableSetup`](./PluginUpgradeableSetup.md) — An abstract contract to inherit from to implement the plugin setup for upgradeable plugins, i.e, `PluginUUPSUpgradeable` being deployed via the UUPS pattern…
- [`PluginUUPSUpgradeable`](./PluginUUPSUpgradeable.md) — An abstract, upgradeable contract to inherit from when creating a plugin being deployed via the UUPS pattern (see…
- [`Proposal`](./Proposal.md) — An abstract contract containing the traits and internal functionality to create and execute proposals that can be inherited by non-upgradeable DAO plugins.
- [`ProposalUpgradeable`](./ProposalUpgradeable.md) — An abstract contract containing the traits and internal functionality to create and execute proposals that can be inherited by upgradeable DAO plugins.
- [`ProtocolVersion`](./ProtocolVersion.md) — An abstract, stateless, non-upgradeable contract providing the current Aragon OSx protocol version number.
- [`ProxyFactory`](./ProxyFactory.md) — A factory to deploy proxies via the UUPS pattern (see [ERC-1822](https://eips.ethereum.org/EIPS/eip-1822)) and minimal proxy pattern (see…
- [`RuledCondition`](./RuledCondition.md) — An abstract contract to create conditional permissions using rules.

## Interfaces

- [`IDAO`](./IDAO.md) — The interface required for DAOs within the Aragon App DAO framework.
- [`IEIP4824`](./IEIP4824.md) — See https://eips.ethereum.org/EIPS/eip-4824
- [`IExecutor`](./IExecutor.md) — The interface required for Executors within the Aragon App DAO framework.
- [`IMemberRegistry`](./IMemberRegistry.md) — Permissionless member self-registration via ENS subdomain claims.
- [`IMembership`](./IMembership.md) — An interface to be implemented by DAO plugins that define membership.
- [`IPermissionCondition`](./IPermissionCondition.md) — An interface to be implemented to support custom permission logic.
- [`IPlugin`](./IPlugin.md) — An interface defining the traits of a plugin.
- [`IPluginRepo`](./IPluginRepo.md) — The interface required for a plugin repository.
- [`IPluginSetup`](./IPluginSetup.md) — The interface required for a plugin setup contract to be consumed by the `PluginSetupProcessor` for plugin installations, updates, and uninstallations.
- [`IProposal`](./IProposal.md) — An interface to be implemented by DAO plugins that create and execute proposals.
- [`IProtocolVersion`](./IProtocolVersion.md) — An interface defining the semantic Aragon OSx protocol version number.
- [`IResolver`](./IResolver.md) — Minimal resolver interface for MemberRegistry.

## Libraries

- [`ENSDomain`](./ENSDomain.md) — Pure-string utilities for working with ENS domain names: namehash (EIP-137) and splitting at the first dot.
- [`PermissionLib`](./PermissionLib.md) — A library containing objects for permission processing.
- [`ProxyLib`](./ProxyLib.md) — A library containing methods for the deployment of proxies via the UUPS pattern (see [ERC-1822](https://eips.ethereum.org/EIPS/eip-1822)) and minimal proxy…
- [`VersionComparisonLib`](./VersionComparisonLib.md) — A library containing methods for [semantic version number](https://semver.org/spec/v2.0.0.html) comparison.

## Structs

- [`Action`](./Action.md)
- [`PluginSetupRef`](./PluginSetupRef.md)

## Enums

- [`PreparationType`](./PreparationType.md)

## Errors

- [`DaoUnauthorized`](./DaoUnauthorized.md) — Thrown if a call is unauthorized in the associated DAO.
- [`RatioOutOfBounds`](./RatioOutOfBounds.md) — Thrown if a ratio value exceeds the maximal value of `10**6`.

## Constants

- [`RATIO_BASE`](./RATIO_BASE.md)

## Functions

- [`_applyRatioCeiled`](./_applyRatioCeiled.md) — Applies a ratio to a value and ceils the remainder.
- [`_auth`](./_auth.md) — A free function checking if a caller is granted permissions on a target contract via a permission identifier that redirects the approval to a…
- [`_getAppliedSetupId`](./_getAppliedSetupId.md) — Returns an identifier for applied installations.
- [`_getPluginInstallationId`](./_getPluginInstallationId.md) — Returns an ID for plugin installation by hashing the DAO and plugin address.
- [`_getPreparedSetupId`](./_getPreparedSetupId.md) — Returns an ID for prepared setup obtained from hashing characterizing elements.
- [`_uncheckedAdd`](./_uncheckedAdd.md) — Adds two unsigned integers without checking the result for overflow errors (using safe math).
- [`_uncheckedSub`](./_uncheckedSub.md) — Subtracts two unsigned integers without checking the result for overflow errors (using safe math).
- [`flipBit`](./flipBit.md)
- [`hasBit`](./hasBit.md)
- [`hashHelpers`](./hashHelpers.md) — Returns a hash of an array of helper addresses (contracts or EOAs).
- [`hashPermissions`](./hashPermissions.md) — Returns a hash of an array of multi-targeted permission operations.
- [`isSubdomainValid`](./isSubdomainValid.md) — Validates that a subdomain name is composed only from characters in the allowed character set: - the lowercase letters `a-z` - the digits `0-9` - the hyphen `-`
