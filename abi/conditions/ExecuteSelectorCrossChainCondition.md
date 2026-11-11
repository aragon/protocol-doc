---
type: reference
title: ExecuteSelectorCrossChainCondition
kind: contract
source: conditions/src/ExecuteSelectorCrossChainCondition.sol
summary: "A permission condition that restricts which function selectors (and native transfers) can be invoked through DAO.execute(), with allowlists scoped per chain —…"
---

# ExecuteSelectorCrossChainCondition

**Contract** · [`src/ExecuteSelectorCrossChainCondition.sol`](https://github.com/aragon/conditions/blob/7198a02ae1e62f3297416feeca64159bf69802c7/src/ExecuteSelectorCrossChainCondition.sol)

**Explained in:** [ExecuteSelectorCrossChainCondition](../../helpers/condition-library/execute-selector-crosschain-condition.md)

**Author:** AragonX 2026

**Inherits:** `ERC165`, `IPermissionCondition`, `DaoAuthorizable`

A permission condition that restricts which function selectors (and native transfers) can be invoked
through DAO.execute(), with allowlists scoped per chain — covering both actions executed locally and
actions relayed to other chains through a CrossChainController.

> **Dev:** How it works:
> - The condition intercepts calls to `execute()` and inspects each action in the batch.
> - Every action must be allowed for `(block.chainid, target)`: its selector (or native transfer), and a
> native transfer allowance when it carries `value`. This includes calls to a CrossChainController, so
> `forwardMessage` must be allowed on each controller the DAO relays through.
> - If an action calls `forwardMessage`, it is a cross-chain relay whatever its target: its calldata is
> decoded as a `forwardMessage(destinationChainId, gasLimit, message)` payload, where `message` encodes the
> `Action[]` to be executed on the destination chain. Each of those inner actions must then be allowed for
> `(destinationChainId, innerTarget)`. Empty messages are rejected.
> - Inner actions are not decoded recursively: allowing `forwardMessage` on a destination chain lets that
> message relay any actions onwards.
> - Note on `value` for cross-chain actions: an inner action with a non-zero `value` is executed on the
> destination chain, and the native tokens are paid out of the destination chain executor's balance —
> not from the DAO on this chain. Therefore the current chain must also decide, via
> `allowedNativeTransfers[destinationChainId][target]`, whether the destination chain's executor is
> allowed to call the given target with value attached.
> - Allowlists are managed per chain via `allowSelectors`/`disallowSelectors` and
> `allowNativeTransfers`/`disallowNativeTransfers`, gated by `MANAGE_SELECTORS_PERMISSION`.
> The overloads without a `chainId` parameter operate on the current chain (`block.chainid`).
> - This lets a DAO on one chain constrain not only what its proposals can call locally, but also what
> they can trigger remotely on every destination chain it bridges to.

## Constructor

### constructor

```solidity
constructor(
    IDAO _dao,
    uint256[] _chainIds,
    ExecuteSelectorCrossChainCondition.SelectorTarget[] _initialEntries
)
```

Configures a new instance with the given set of allowed selectors

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `IDAO` | The address of the DAO where the contract should read the permissions from |
| `_chainIds` | `uint256[]` | The chain on which each of the entries below applies, matched by index. Pass `block.chainid` for the entries that apply to the current chain. |
| `_initialEntries` | [`ExecuteSelectorCrossChainCondition.SelectorTarget[]`](#selectortarget) | The list of allowed selectors and the addresses where they can be invoked |

## Functions

### allowedNativeTransfers

```solidity
function allowedNativeTransfers(uint256, address) external view returns (bool)
```

Selector: `0x62b5c6ee`

Stores whether native transfers are allowed to the given target address on the given chain

> **Dev:** allowedNativeTransfers[chainId][where]

### allowedSelectors

```solidity
function allowedSelectors(uint256, address, bytes4) external view returns (bool)
```

Selector: `0xf5a9dff5`

Stores whether the given address and selector are allowed on the given chain

> **Dev:** allowedSelectors[chainId][where][selector]

### allowNativeTransfers(address)

```solidity
function allowNativeTransfers(address _where) external
```

Selector: `0x5e593df6`

Allows actions with a non-zero `value` to pass for the given target address, on the current chain

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The target address |

### allowNativeTransfers(uint256,address)

```solidity
function allowNativeTransfers(uint256 _chainId, address _where) external
```

Selector: `0x38e77c67`

Allows actions with a non-zero `value` to pass for the given target address, on the given chain

| Parameter | Type | Description |
| --- | --- | --- |
| `_chainId` | `uint256` | The chain on which native transfers are allowed |
| `_where` | `address` | The target address |

### allowSelectors((address,bytes4[]))

```solidity
function allowSelectors(ExecuteSelectorCrossChainCondition.SelectorTarget _newEntry) external
```

Selector: `0x32c9ea3e`

Marks the given selectors as allowed on the given where address, on the current chain

| Parameter | Type | Description |
| --- | --- | --- |
| `_newEntry` | [`ExecuteSelectorCrossChainCondition.SelectorTarget`](#selectortarget) | The new selectors and the address where they can be invoked |

### allowSelectors(uint256,(address,bytes4[]))

```solidity
function allowSelectors(
    uint256 _chainId,
    ExecuteSelectorCrossChainCondition.SelectorTarget _newEntry
) external
```

Selector: `0x472c2e05`

Marks the given selectors as allowed on the given where address, on the given chain

| Parameter | Type | Description |
| --- | --- | --- |
| `_chainId` | `uint256` | The chain on which the selectors can be invoked |
| `_newEntry` | [`ExecuteSelectorCrossChainCondition.SelectorTarget`](#selectortarget) | The new selectors and the address where they can be invoked |

### dao

```solidity
function dao() external view returns (IDAO)
```

Selector: `0x4162169f`

Returns the DAO contract.

### disallowNativeTransfers(address)

```solidity
function disallowNativeTransfers(address _where) external
```

Selector: `0x4746831e`

Restricts actions with a non-zero `value` for the given target address, on the current chain

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The target address |

### disallowNativeTransfers(uint256,address)

```solidity
function disallowNativeTransfers(uint256 _chainId, address _where) external
```

Selector: `0xd56a35c5`

Restricts actions with a non-zero `value` for the given target address, on the given chain

| Parameter | Type | Description |
| --- | --- | --- |
| `_chainId` | `uint256` | The chain on which native transfers are no longer allowed |
| `_where` | `address` | The target address |

### disallowSelectors((address,bytes4[]))

```solidity
function disallowSelectors(ExecuteSelectorCrossChainCondition.SelectorTarget _entry) external
```

Selector: `0x6cf0ca63`

Marks the given selector(s) as disallowed on the current chain

| Parameter | Type | Description |
| --- | --- | --- |
| `_entry` | [`ExecuteSelectorCrossChainCondition.SelectorTarget`](#selectortarget) | The selectors to remove and the address where they can no longer be invoked |

### disallowSelectors(uint256,(address,bytes4[]))

```solidity
function disallowSelectors(
    uint256 _chainId,
    ExecuteSelectorCrossChainCondition.SelectorTarget _entry
) external
```

Selector: `0x96b3cf1e`

Marks the given selector(s) as disallowed on the given chain

| Parameter | Type | Description |
| --- | --- | --- |
| `_chainId` | `uint256` | The chain on which the selectors can no longer be invoked |
| `_entry` | [`ExecuteSelectorCrossChainCondition.SelectorTarget`](#selectortarget) | The selectors to remove and the address where they can no longer be invoked |

### isGranted

```solidity
function isGranted(
    address _where,
    address _who,
    bytes32 _permissionId,
    bytes _data
) external view returns (bool isPermitted)
```

Selector: `0x2675fdd0`

Checks if a call is permitted.

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The address of the target contract. |
| `_who` | `address` | The address (EOA or contract) for which the permissions are checked. |
| `_permissionId` | `bytes32` | The permission identifier. |
| `_data` | `bytes` | Optional data passed to the `PermissionCondition` implementation. |

| Returns | Type | Description |
| --- | --- | --- |
| `isPermitted` | `bool` | Returns true if the call is permitted. |

### supportsInterface

```solidity
function supportsInterface(bytes4 _interfaceId) external view returns (bool)
```

Selector: `0x01ffc9a7`

Checks if an interface is supported by this or its parent contract.

| Parameter | Type | Description |
| --- | --- | --- |
| `_interfaceId` | `bytes4` | The ID of the interface. |

## Events

### NativeTransfersAllowed

```solidity
event NativeTransfersAllowed(uint256 chainId, address where)
```

Emitted when native transfers are allowed to the given address

| Parameter | Type | Description |
| --- | --- | --- |
| `chainId` | `uint256` | The chain on which native transfers are allowed |
| `where` | `address` | The address to which native transfers are allowed |

### NativeTransfersDisallowed

```solidity
event NativeTransfersDisallowed(uint256 chainId, address where)
```

Emitted when native transfers are disallowed to the given address

| Parameter | Type | Description |
| --- | --- | --- |
| `chainId` | `uint256` | The chain on which native transfers are no longer allowed |
| `where` | `address` | The address to which native transfers are no longer allowed |

### SelectorAllowed

```solidity
event SelectorAllowed(uint256 chainId, bytes4 selector, address where)
```

Emitted when a new selector is allowed.

| Parameter | Type | Description |
| --- | --- | --- |
| `chainId` | `uint256` | The chain on which the selector is allowed |
| `selector` | `bytes4` | The function selector being allowed |
| `where` | `address` | The address on which the selector can be invoked |

### SelectorDisallowed

```solidity
event SelectorDisallowed(uint256 chainId, bytes4 selector, address where)
```

Emitted when a selector is disallowed.

| Parameter | Type | Description |
| --- | --- | --- |
| `chainId` | `uint256` | The chain on which the selector is no longer allowed |
| `selector` | `bytes4` | The function selector being disallowed |
| `where` | `address` | The address on which the selector can no longer be invoked |

## Errors

### ChainIdsLengthMismatch

```solidity
error ChainIdsLengthMismatch(uint256 chainIds, uint256 entries)
```

Thrown when the given chain id's and selector entries have a different length

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

### InvalidChainId

```solidity
error InvalidChainId()
```

Thrown when attempting to allow something on the chain id zero, which is not a valid chain

## Constants

_Public, so each is also readable through a generated getter._

### MANAGE_SELECTORS_PERMISSION_ID

```solidity
bytes32 public constant MANAGE_SELECTORS_PERMISSION_ID = keccak256("MANAGE_SELECTORS_PERMISSION");
```

Value: `0x485a22b473de7ee3091c71c5ce05019fd1466a1650b1228784a9bcd5b7bed510`

## Structs

### SelectorTarget

```solidity
struct SelectorTarget {
    address where;
    bytes4[] selectors;
}
```

Contains a list of selectors for the given target (where) address
