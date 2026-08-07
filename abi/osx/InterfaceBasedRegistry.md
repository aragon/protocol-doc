---
type: reference
title: InterfaceBasedRegistry
kind: abstract contract
source: osx/src/framework/utils/InterfaceBasedRegistry.sol
summary: "An [ERC-165](https://eips.ethereum.org/EIPS/eip-165)-based registry for contracts."
---

# InterfaceBasedRegistry

**Abstract contract** · [`src/framework/utils/InterfaceBasedRegistry.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/framework/utils/InterfaceBasedRegistry.sol)

**Explained in:** [DAO Registry](../../framework/dao-registry.md), [PluginRepo Registry](../../framework/plugin-repo-registry.md), [Registries and ENS names](../../framework/registries.md)

**Author:** Aragon X - 2022-2023

**Inherits:** `UUPSUpgradeable`, [`DaoAuthorizableUpgradeable`](./DaoAuthorizableUpgradeable.md)

An [ERC-165](https://eips.ethereum.org/EIPS/eip-165)-based registry for contracts.

**security-contact:** sirt@aragon.org

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

## Constants

_Public, so each is also readable through a generated getter._

### UPGRADE_REGISTRY_PERMISSION_ID

```solidity
bytes32 public constant UPGRADE_REGISTRY_PERMISSION_ID =
        keccak256("UPGRADE_REGISTRY_PERMISSION");
```

Value: `0x60b96ff9fb5f29153c29c1747515b8be4ee523d686cc6f453ec294b0afa72932`

The ID of the permission required to call the `_authorizeUpgrade` function.
