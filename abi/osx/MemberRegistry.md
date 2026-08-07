---
type: reference
title: MemberRegistry
kind: contract
source: osx/src/framework/member/MemberRegistry.sol
summary: "Permissionless member self-registration via ENS subdomain claims."
---

# MemberRegistry

**Contract** · [`src/framework/member/MemberRegistry.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/framework/member/MemberRegistry.sol)

**Explained in:** [Member registry](../../framework/member-registry.md)

**Author:** Aragon X - 2026

**Inherits:** [`IMemberRegistry`](./IMemberRegistry.md), `UUPSUpgradeable`, [`DaoAuthorizableUpgradeable`](./DaoAuthorizableUpgradeable.md), [`ProtocolVersion`](./ProtocolVersion.md)

Permissionless member self-registration via ENS subdomain claims. Owns the parent
ENS node, manages subdomain lifecycle (claim, release, move), and grants per-node
resolver approval so members can manage their own ENS records natively.

> **Dev:** The ENS registry and resolver are trusted, known mainnet contracts. No reentrancy
> guard is needed — the contract is the sole caller of its own ENS operations.

**security-contact:** sirt@aragon.org

## Constructor

### constructor

```solidity
constructor()
```

> **Dev:** Disallow initializing the implementation contract.

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

The ENS registry contract.

### evict

```solidity
function evict(string subdomain, address newController) external
```

Selector: `0x75e99e1d`

Forcibly evict a subdomain, optionally re-assigning it to a new controller. Governed. Requires EVICT_SUBDOMAIN_PERMISSION_ID on this contract (OSx permission system). If `newController` is the zero address, the subdomain is fully released (records cleared, subnode released). If `newController` is non-zero, the same subdomain is re-assigned to it as if it had called `register` itself: ENS subnode re-created, addr record set to `newController`, per-node resolver approval granted to it. Reverts if the subdomain is unknown, if `newController` already controls it, or if `newController` is already registered with a different subdomain.

| Parameter | Type | Description |
| --- | --- | --- |
| `subdomain` | `string` | The subdomain label to evict (e.g., "alice"). |
| `newController` | `address` | Address that should control the subdomain after the eviction, or `address(0)` to release without reassignment. |

### initialize

```solidity
function initialize(IDAO _managementDao, ENS _ens, string _domain, address _resolver) external
```

Selector: `0x09c26fb1`

Initializes the registry.

| Parameter | Type | Description |
| --- | --- | --- |
| `_managementDao` | `IDAO` | The DAO management permissions. |
| `_ens` | `ENS` | The ENS registry contract. |
| `_domain` | `string` | The parent domain this registry manages (e.g., `"members.dao.eth"`). |
| `_resolver` | `address` | The resolver address. Must support per-node `approve()`. |

### isRegistered

```solidity
function isRegistered(address member) external view returns (bool)
```

Selector: `0xc3c5a547`

Returns true if the member has a registered subdomain.

### labelOwner

```solidity
function labelOwner(bytes32) external view returns (address)
```

Selector: `0x23227a56`

Maps a labelhash to the member who owns it. `address(0)` means available.

### memberLabel

```solidity
function memberLabel(address) external view returns (bytes32)
```

Selector: `0x659ef1bf`

Maps a member address to its claimed labelhash. `bytes32(0)` means not registered.

### memberSubdomain

```solidity
function memberSubdomain(address) external view returns (string)
```

Selector: `0xbd51a3b8`

Maps a member address to its claimed subdomain string (for events and display).

### move(string,((string,string)[],address,bytes))

```solidity
function move(string newSubdomain, IMemberRegistry.Records records) external
```

Selector: `0x09b54918`

Move your subdomain and carry over resolver records atomically. Only moves the caller's own subdomain. Reverts if not registered or new label taken.

| Parameter | Type | Description |
| --- | --- | --- |
| `newSubdomain` | `string` | The new subdomain label to claim. |
| `records` | `IMemberRegistry.Records` | Resolver records to set on the new subnode (text, addr, contenthash). addr=address(0) keeps the default (msg.sender). Empty contenthash is skipped. |

### move(string)

```solidity
function move(string newSubdomain) external
```

Selector: `0x0bfb0697`

Move your subdomain. Releases the old label and claims the new one atomically. Only moves the caller's own subdomain. Reverts if not registered or new label taken.

| Parameter | Type | Description |
| --- | --- | --- |
| `newSubdomain` | `string` | The new subdomain label to claim. |

### parentDomain

```solidity
function parentDomain() external view returns (string)
```

Selector: `0xaf1a6e3d`

The parent domain string (e.g., `"members.dao.eth"`). Pre-image of `parentNode`.

### parentNode

```solidity
function parentNode() external view returns (bytes32)
```

Selector: `0xf3068a00`

The namehash of the parent domain (e.g., `namehash("members.dao.eth")`).

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

### register(string,((string,string)[],address,bytes))

```solidity
function register(string subdomain, IMemberRegistry.Records records) external
```

Selector: `0x24f8bee2`

Register as a member with initial resolver records set atomically. Permissionless. One subdomain per address. Reverts if already registered (release first).

| Parameter | Type | Description |
| --- | --- | --- |
| `subdomain` | `string` | The subdomain label to claim (e.g., "alice"). |
| `records` | `IMemberRegistry.Records` | Resolver records to set on the new subnode (text, addr, contenthash). addr=address(0) defaults to msg.sender. Empty contenthash is skipped. |

### register(string)

```solidity
function register(string subdomain) external
```

Selector: `0xf2c298be`

Register as a member by claiming a subdomain. Permissionless. One subdomain per address. Reverts if already registered (release first).

| Parameter | Type | Description |
| --- | --- | --- |
| `subdomain` | `string` | The subdomain label to claim (e.g., "alice"). |

### release

```solidity
function release() external
```

Selector: `0x86d1a69f`

Voluntarily release your subdomain. Permissionless. Only releases the caller's own subdomain. Reverts if not registered.

### resolver

```solidity
function resolver() external view returns (address)
```

Selector: `0x04f3bcec`

The resolver address (must support per-node `approve()`).

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

### ProfileMoved

```solidity
event ProfileMoved(address indexed member, string oldSubdomain, string newSubdomain)
```

Emitted when a member moves their subdomain (release old + claim new).

### Registered

```solidity
event Registered(address indexed member, string subdomain)
```

Emitted when a member registers and claims a subdomain.

### Released

```solidity
event Released(address indexed member, string subdomain)
```

Emitted when a member voluntarily releases their subdomain.

### SubdomainEvicted

```solidity
event SubdomainEvicted(address indexed member, address indexed evictor, string subdomain)
```

Emitted when governance forcibly evicts a member's subdomain.

### Upgraded

```solidity
event Upgraded(address indexed implementation)
```

> **Dev:** Emitted when the implementation is upgraded.

## Errors

### AlreadyRegistered

```solidity
error AlreadyRegistered(address member)
```

Thrown if the member is already registered.

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

### InvalidDomain(string)

```solidity
error InvalidDomain(string domain)
```

Thrown if the parent domain is empty.

### InvalidDomain(string)

```solidity
error InvalidDomain(string domain)
```

Thrown if the parent domain is empty.

### InvalidENSRegistry

```solidity
error InvalidENSRegistry(address ens)
```

Thrown if the ENS registry address is not a valid ENS registry.

### InvalidManagementDao

```solidity
error InvalidManagementDao(address dao)
```

Thrown if the management DAO address is the zero address.

### InvalidNewController

```solidity
error InvalidNewController(address newController)
```

Thrown if the new controller passed to `evict` already controls the subdomain
being evicted (no-op transfer is rejected to surface caller mistakes).

### InvalidResolver

```solidity
error InvalidResolver(address resolver)
```

Thrown if the resolver address has no contract code (zero address or EOA).

### InvalidSubdomain

```solidity
error InvalidSubdomain(string subdomain)
```

Thrown if the subdomain is invalid: shorter than 3 characters, longer than 50,
starts or ends with `-`, or contains characters outside [0-9a-z-].

### NotRegistered

```solidity
error NotRegistered(address member)
```

Thrown if the member is not registered.

### SubdomainAlreadyTaken

```solidity
error SubdomainAlreadyTaken(string subdomain)
```

Thrown if the requested subdomain label is already taken.

### SubdomainNotRegistered

```solidity
error SubdomainNotRegistered(string subdomain)
```

Thrown if the subdomain has no current owner (evict target unknown).

## Constants

_Public, so each is also readable through a generated getter._

### EVICT_SUBDOMAIN_PERMISSION_ID

```solidity
bytes32 public constant EVICT_SUBDOMAIN_PERMISSION_ID = keccak256("EVICT_SUBDOMAIN_PERMISSION");
```

Value: `0x9586822989ef45dd4a50f192e8b5063684aa930288ca589d9882bc9b44d65519`

The ID of the permission required to call `evict`.

### UPGRADE_REGISTRY_PERMISSION_ID

```solidity
bytes32 public constant UPGRADE_REGISTRY_PERMISSION_ID = keccak256("UPGRADE_REGISTRY_PERMISSION");
```

Value: `0x60b96ff9fb5f29153c29c1747515b8be4ee523d686cc6f453ec294b0afa72932`

The ID of the permission required to call `_authorizeUpgrade`.

## Structs

### Records _(from IMemberRegistry)_

```solidity
struct Records {
    IMemberRegistry.TextRecord[] textRecords;
    address addr;
    bytes contenthash;
}
```

### TextRecord _(from IMemberRegistry)_

```solidity
struct TextRecord {
    string key;
    string value;
}
```
