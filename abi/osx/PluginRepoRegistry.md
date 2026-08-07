---
type: reference
title: PluginRepoRegistry
kind: contract
source: osx/src/framework/plugin/repo/PluginRepoRegistry.sol
summary: "This contract maintains an address-based registry of plugin repositories in the Aragon App DAO framework."
---

# PluginRepoRegistry

**Contract** · [`src/framework/plugin/repo/PluginRepoRegistry.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/framework/plugin/repo/PluginRepoRegistry.sol)

**Explained in:** [PluginRepo Registry](../../framework/plugin-repo-registry.md), [Registries and ENS names](../../framework/registries.md)

**Author:** Aragon X - 2022-2023

**Inherits:** [`InterfaceBasedRegistry`](./InterfaceBasedRegistry.md), [`ProtocolVersion`](./ProtocolVersion.md)

This contract maintains an address-based registry of plugin repositories in the Aragon App DAO framework.

**security-contact:** sirt@aragon.org

## Constructor

### constructor

```solidity
constructor()
```

> **Dev:** Used to disallow initializing the implementation contract by an attacker for extra safety.

**oz-upgrades-unsafe-allow:** constructor

## Functions

### dao

```solidity
function dao() external view returns (IDAO)
```

Selector: `0x4162169f`

Returns the DAO contract.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | [`IDAO`](./IDAO.md) |  |

### entries

```solidity
function entries(address) external view returns (bool)
```

Selector: `0xf29ee125`

The mapping containing the registry entries returning true for registered contract addresses.

### initialize

```solidity
function initialize(IDAO _dao, ENSSubdomainRegistrar _subdomainRegistrar) external
```

Selector: `0x485cc955`

Initializes the contract by setting calling the `InterfaceBasedRegistry` base class initialize method.

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | [`IDAO`](./IDAO.md) | The address of the managing DAO. |
| `_subdomainRegistrar` | [`ENSSubdomainRegistrar`](./ENSSubdomainRegistrar.md) | The `ENSSubdomainRegistrar` where `ENS` subdomain will be registered. |

### protocolVersion

```solidity
function protocolVersion() external pure returns (uint8[3])
```

Selector: `0x2ae9c600`

Returns the semantic Aragon OSx protocol version number that the implementing contract is associated with.

> **Dev:** This version number is not to be confused with the `release` and `build` numbers found in the `Version.Tag` struct inside the `PluginRepo` contract being used to version plugin setup and associated plugin implementation contracts.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `uint8[3]` | Returns the semantic Aragon OSx protocol version number. |

### proxiableUUID

```solidity
function proxiableUUID() external view returns (bytes32)
```

Selector: `0x52d1902d`

> **Dev:** Implementation of the ERC1822 {proxiableUUID} function. This returns the storage slot used by the
> implementation. It is used to validate the implementation's compatibility when performing an upgrade.
> 
> IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks
> bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this
> function revert if invoked through a proxy. This is guaranteed by the `notDelegated` modifier.

### registerPluginRepo

```solidity
function registerPluginRepo(string subdomain, address pluginRepo) external
```

Selector: `0xfdb9df55`

Registers a plugin repository with a subdomain and address.

> **Dev:** If subdomain is empty, registration on ENS is skipped.

| Parameter | Type | Description |
| --- | --- | --- |
| `subdomain` | `string` | The subdomain of the PluginRepo. |
| `pluginRepo` | `address` | The address of the PluginRepo contract. |

### subdomainRegistrar

```solidity
function subdomainRegistrar() external view returns (ENSSubdomainRegistrar)
```

Selector: `0x00077393`

The ENS subdomain registrar registering the PluginRepo subdomains.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | [`ENSSubdomainRegistrar`](./ENSSubdomainRegistrar.md) |  |

### targetInterfaceId

```solidity
function targetInterfaceId() external view returns (bytes4)
```

Selector: `0x44162ef8`

The [ERC-165](https://eips.ethereum.org/EIPS/eip-165) interface ID that the target contracts being registered must support.

### upgradeTo

```solidity
function upgradeTo(address newImplementation) external
```

Selector: `0x3659cfe6`

> **Dev:** Upgrade the implementation of the proxy to `newImplementation`.
> 
> Calls {_authorizeUpgrade}.
> 
> Emits an {Upgraded} event.

**oz-upgrades-unsafe-allow-reachable:** delegatecall

### upgradeToAndCall

```solidity
function upgradeToAndCall(address newImplementation, bytes data) external payable
```

Selector: `0x4f1ef286`

> **Dev:** Upgrade the implementation of the proxy to `newImplementation`, and subsequently execute the function call
> encoded in `data`.
> 
> Calls {_authorizeUpgrade}.
> 
> Emits an {Upgraded} event.

**oz-upgrades-unsafe-allow-reachable:** delegatecall

## Events

### AdminChanged

```solidity
event AdminChanged(address previousAdmin, address newAdmin)
```

> **Dev:** Emitted when the admin account has changed.

### BeaconUpgraded

```solidity
event BeaconUpgraded(address indexed beacon)
```

> **Dev:** Emitted when the beacon is changed.

### Initialized

```solidity
event Initialized(uint8 version)
```

> **Dev:** Triggered when the contract has been initialized or reinitialized.

### PluginRepoRegistered

```solidity
event PluginRepoRegistered(string subdomain, address pluginRepo)
```

Emitted if a new plugin repository is registered.

| Parameter | Type | Description |
| --- | --- | --- |
| `subdomain` | `string` | The subdomain of the plugin repository. |
| `pluginRepo` | `address` | The address of the plugin repository. |

### Upgraded

```solidity
event Upgraded(address indexed implementation)
```

> **Dev:** Emitted when the implementation is upgraded.

## Errors

### ContractAlreadyRegistered

```solidity
error ContractAlreadyRegistered(address registrant)
```

Thrown if the contract is already registered.

| Parameter | Type | Description |
| --- | --- | --- |
| `registrant` | `address` | The address of the contract to be registered. |

### ContractERC165SupportInvalid

```solidity
error ContractERC165SupportInvalid(address registrant)
```

Thrown if the contract does not support ERC165.

| Parameter | Type | Description |
| --- | --- | --- |
| `registrant` | `address` | The address of the contract. |

### ContractInterfaceInvalid

```solidity
error ContractInterfaceInvalid(address registrant)
```

Thrown if the contract does not support the required interface.

| Parameter | Type | Description |
| --- | --- | --- |
| `registrant` | `address` | The address of the contract to be registered. |

### DaoUnauthorized

```solidity
error DaoUnauthorized(address dao, address where, address who, bytes32 permissionId)
```

Thrown if a call is unauthorized in the associated DAO.

| Parameter | Type | Description |
| --- | --- | --- |
| `dao` | `address` | The associated DAO. |
| `where` | `address` | The context in which the authorization reverted. |
| `who` | `address` | The address (EOA or contract) missing the permission. |
| `permissionId` | `bytes32` | The permission identifier. |

### ENSNotSupported

```solidity
error ENSNotSupported()
```

Thrown if the subdomain is present, but registrar is address(0).

### InvalidPluginSubdomain

```solidity
error InvalidPluginSubdomain(string subdomain)
```

Thrown if the plugin subdomain doesn't match the regex `[0-9a-z\-]`

## Constants

_Public, so each is also readable through a generated getter._

### REGISTER_PLUGIN_REPO_PERMISSION_ID

```solidity
bytes32 public constant REGISTER_PLUGIN_REPO_PERMISSION_ID =
        keccak256("REGISTER_PLUGIN_REPO_PERMISSION");
```

Value: `0x055973dfb6d3b3cd890dde3a801f5427fa973864752b6d2a1ae61cbd5ae5dc09`

The ID of the permission required to call the `register` function.

### UPGRADE_REGISTRY_PERMISSION_ID

_Inherited from `InterfaceBasedRegistry`._

```solidity
bytes32 public constant UPGRADE_REGISTRY_PERMISSION_ID =
        keccak256("UPGRADE_REGISTRY_PERMISSION");
```

Value: `0x60b96ff9fb5f29153c29c1747515b8be4ee523d686cc6f453ec294b0afa72932`

The ID of the permission required to call the `_authorizeUpgrade` function.
