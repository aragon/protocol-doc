---
title: ENSSubdomainRegistrar
kind: contract
source: src/framework/utils/ens/ENSSubdomainRegistrar.sol
summary: "This contract registers ENS subdomains under a parent domain specified in the initialization process and maintains ownership of the subdomain since only the res"
---

# ENSSubdomainRegistrar

**Contract** · [`src/framework/utils/ens/ENSSubdomainRegistrar.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/framework/utils/ens/ENSSubdomainRegistrar.sol)

**Author:** Aragon X - 2022-2023

**Inherits:** `UUPSUpgradeable`, [`DaoAuthorizableUpgradeable`](./DaoAuthorizableUpgradeable.md), [`ProtocolVersion`](./ProtocolVersion.md)

This contract registers ENS subdomains under a parent domain specified in the initialization process and maintains ownership of the subdomain since only the resolver address is set. This contract must either be the domain node owner or an approved operator of the node owner. The default resolver being used is the one specified in the parent domain.

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

### ens

```solidity
function ens() external view returns (ENS)
```

Selector: `0x3f15457f`

The ENS registry contract

### initialize

```solidity
function initialize(IDAO _managingDao, ENS _ens, bytes32 _node) external
```

Selector: `0x6133f985`

Initializes the component by
- checking that the contract is the domain node owner or an approved operator
- initializing the underlying component
- registering the [ERC-165](https://eips.ethereum.org/EIPS/eip-165) interface ID
- setting the ENS contract, the domain node hash, and resolver.

| Parameter | Type | Description |
| --- | --- | --- |
| `_managingDao` | `IDAO` | The interface of the DAO managing the components permissions. |
| `_ens` | `ENS` | The interface of the ENS registry to be used. |
| `_node` | `bytes32` | The ENS parent domain node under which the subdomains are to be registered. |

### node

```solidity
function node() external view returns (bytes32)
```

Selector: `0xd70754ec`

The namehash of the domain on which subdomains are registered.

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

### registerSubnode

```solidity
function registerSubnode(bytes32 _label, address _targetAddress) external
```

Selector: `0x89bb4145`

Registers a new subdomain with this registrar as the owner and set the target address in the resolver.

> **Dev:** It reverts with no message if this contract isn't the owner nor an approved operator for the given node.

| Parameter | Type | Description |
| --- | --- | --- |
| `_label` | `bytes32` | The labelhash of the subdomain name. |
| `_targetAddress` | `address` | The address to which the subdomain resolves. |

### resolver

```solidity
function resolver() external view returns (address)
```

Selector: `0x04f3bcec`

The address of the ENS resolver resolving the names to an address.

### setDefaultResolver

```solidity
function setDefaultResolver(address _resolver) external
```

Selector: `0xc66485b2`

Sets the default resolver contract address that the subdomains being registered will use.

| Parameter | Type | Description |
| --- | --- | --- |
| `_resolver` | `address` | The resolver contract to be used. |

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

### Upgraded

```solidity
event Upgraded(address indexed implementation)
```

> **Dev:** Emitted when the implementation is upgraded.

## Errors

### AlreadyRegistered

```solidity
error AlreadyRegistered(bytes32 subnode, address nodeOwner)
```

Thrown if the subnode is already registered.

| Parameter | Type | Description |
| --- | --- | --- |
| `subnode` | `bytes32` | The subnode namehash. |
| `nodeOwner` | `address` | The node owner address. |

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

### InvalidResolver

```solidity
error InvalidResolver(bytes32 node, address resolver)
```

Thrown if node's resolver is invalid.

| Parameter | Type | Description |
| --- | --- | --- |
| `node` | `bytes32` | The node namehash. |
| `resolver` | `address` | The node resolver address. |

## Constants

_Public, so each is also readable through a generated getter._

### REGISTER_ENS_SUBDOMAIN_PERMISSION_ID

```solidity
bytes32 public constant REGISTER_ENS_SUBDOMAIN_PERMISSION_ID =
        keccak256("REGISTER_ENS_SUBDOMAIN_PERMISSION");
```

Selector: `0x9848ba51`

The ID of the permission required to call the `registerSubnode` and `setDefaultResolver` function.

### UPGRADE_REGISTRAR_PERMISSION_ID

```solidity
bytes32 public constant UPGRADE_REGISTRAR_PERMISSION_ID =
        keccak256("UPGRADE_REGISTRAR_PERMISSION");
```

Selector: `0xaf7b2fed`

The ID of the permission required to call the `_authorizeUpgrade` function.
