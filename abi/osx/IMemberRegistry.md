---
type: reference
title: IMemberRegistry
kind: interface
source: osx/src/framework/member/IMemberRegistry.sol
summary: "Permissionless member self-registration via ENS subdomain claims."
---

# IMemberRegistry

**Interface** · [`src/framework/member/IMemberRegistry.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/framework/member/IMemberRegistry.sol)

Permissionless member self-registration via ENS subdomain claims.
Members claim a subdomain under a configurable parent domain, manage their own
resolver records (text, avatar, etc.) via per-node approval, and can release or
move their subdomain at any time.

**security-contact:** sirt@aragon.org

## Functions

### evict

```solidity
function evict(string subdomain, address newController) external
```

Selector: `0x75e99e1d`

Forcibly evict a subdomain, optionally re-assigning it to a new controller. Governed.
Requires EVICT_SUBDOMAIN_PERMISSION_ID on this contract (OSx permission system).
If `newController` is the zero address, the subdomain is fully released (records
cleared, subnode released). If `newController` is non-zero, the same subdomain is
re-assigned to it as if it had called `register` itself: ENS subnode re-created,
addr record set to `newController`, per-node resolver approval granted to it.
Reverts if the subdomain is unknown, if `newController` already controls it, or
if `newController` is already registered with a different subdomain.

| Parameter | Type | Description |
| --- | --- | --- |
| `subdomain` | `string` | The subdomain label to evict (e.g., "alice"). |
| `newController` | `address` | Address that should control the subdomain after the eviction, or `address(0)` to release without reassignment. |

### isRegistered

```solidity
function isRegistered(address member) external view returns (bool)
```

Selector: `0xc3c5a547`

Returns true if `member` has a registered subdomain.

### move(string,((string,string)[],address,bytes))

```solidity
function move(string newSubdomain, IMemberRegistry.Records records) external
```

Selector: `0x09b54918`

Move your subdomain and carry over resolver records atomically.
Only moves the caller's own subdomain. Reverts if not registered or new label taken.

| Parameter | Type | Description |
| --- | --- | --- |
| `newSubdomain` | `string` | The new subdomain label to claim. |
| `records` | `IMemberRegistry.Records` | Resolver records to set on the new subnode (text, addr, contenthash). addr=address(0) keeps the default (msg.sender). Empty contenthash is skipped. |

### move(string)

```solidity
function move(string newSubdomain) external
```

Selector: `0x0bfb0697`

Move your subdomain. Releases the old label and claims the new one atomically.
Only moves the caller's own subdomain. Reverts if not registered or new label taken.

| Parameter | Type | Description |
| --- | --- | --- |
| `newSubdomain` | `string` | The new subdomain label to claim. |

### parentDomain

```solidity
function parentDomain() external view returns (string)
```

Selector: `0xaf1a6e3d`

The parent domain string this registry manages (e.g., `"members.dao.eth"`).
Pre-image of `parentNode()`.

### parentNode

```solidity
function parentNode() external view returns (bytes32)
```

Selector: `0xf3068a00`

The namehash of the parent domain. Equal to `namehash(parentDomain())`.

### register(string,((string,string)[],address,bytes))

```solidity
function register(string subdomain, IMemberRegistry.Records records) external
```

Selector: `0x24f8bee2`

Register as a member with initial resolver records set atomically. Permissionless.
One subdomain per address. Reverts if already registered (release first).

| Parameter | Type | Description |
| --- | --- | --- |
| `subdomain` | `string` | The subdomain label to claim (e.g., "alice"). |
| `records` | `IMemberRegistry.Records` | Resolver records to set on the new subnode (text, addr, contenthash). addr=address(0) defaults to msg.sender. Empty contenthash is skipped. |

### register(string)

```solidity
function register(string subdomain) external
```

Selector: `0xf2c298be`

Register as a member by claiming a subdomain. Permissionless.
One subdomain per address. Reverts if already registered (release first).

| Parameter | Type | Description |
| --- | --- | --- |
| `subdomain` | `string` | The subdomain label to claim (e.g., "alice"). |

### release

```solidity
function release() external
```

Selector: `0x86d1a69f`

Voluntarily release your subdomain. Permissionless.
Only releases the caller's own subdomain. Reverts if not registered.

## Events

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

## Errors

### AlreadyRegistered

```solidity
error AlreadyRegistered(address member)
```

Thrown if the member is already registered.

### InvalidDomain

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

## Structs

### Records

```solidity
struct Records {
    IMemberRegistry.TextRecord[] textRecords;
    address addr;
    bytes contenthash;
}
```

### TextRecord

```solidity
struct TextRecord {
    string key;
    string value;
}
```
