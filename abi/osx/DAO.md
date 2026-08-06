---
type: reference
title: DAO
kind: contract
source: osx/src/core/dao/DAO.sol
summary: "This contract is the entry point to the Aragon DAO framework and provides our users a simple and easy to use public interface."
---

# DAO

**Contract** · [`src/core/dao/DAO.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/core/dao/DAO.sol)

**Author:** Aragon X - 2021-2024

**Inherits:** [`IEIP4824`](./IEIP4824.md), `Initializable`, `IERC1271`, `ERC165StorageUpgradeable`, [`IDAO`](./IDAO.md), [`IExecutor`](./IExecutor.md), `UUPSUpgradeable`, [`ProtocolVersion`](./ProtocolVersion.md), [`PermissionManager`](./PermissionManager.md), [`CallbackHandler`](./CallbackHandler.md)

This contract is the entry point to the Aragon DAO framework and provides our users a simple and easy to use public interface.

> **Dev:** Public API of the Aragon DAO framework.

**security-contact:** sirt@aragon.org

## Constructor

### ()

```solidity
constructor()
```

Disables the initializers on the implementation contract to prevent it from being left uninitialized.

**oz-upgrades-unsafe-allow:** constructor

### ()

```solidity
fallback() external
```

### ()

```solidity
receive() external payable
```

## Functions

### applyMultiTargetPermissions

```solidity
function applyMultiTargetPermissions(PermissionLib.MultiTargetPermission[] _items) external
```

Selector: `0xe978afe5`

Applies an array of permission operations on multiple target contracts `items[i].where`.

| Parameter | Type | Description |
| --- | --- | --- |
| `_items` | `PermissionLib.MultiTargetPermission[]` | The array of multi-targeted permission operations to apply. |

### applySingleTargetPermissions

```solidity
function applySingleTargetPermissions(
    address _where,
    PermissionLib.SingleTargetPermission[] items
) external
```

Selector: `0x22844d04`

Applies an array of permission operations on a single target contracts `_where`.

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The address of the single target contract. |
| `items` | `PermissionLib.SingleTargetPermission[]` | The array of single-targeted permission operations to apply. |

### daoURI

```solidity
function daoURI() external view returns (string)
```

Selector: `0x7034731b`

A distinct Uniform Resource Identifier (URI) pointing to a JSON object following the "EIP-4824 DAO JSON-LD Schema". This JSON file splits into four URIs: membersURI, proposalsURI, activityLogURI, and governanceURI. The membersURI should point to a JSON file that conforms to the "EIP-4824 Members JSON-LD Schema". The proposalsURI should point to a JSON file that conforms to the "EIP-4824 Proposals JSON-LD Schema". The activityLogURI should point to a JSON file that conforms to the "EIP-4824 Activity Log JSON-LD Schema". The governanceURI should point to a flatfile, normatively a .md file. Each of the JSON files named above can be statically hosted or dynamically-generated.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `string` | The DAO URI. |

### deposit

```solidity
function deposit(address _token, uint256 _amount, string _reference) external payable
```

Selector: `0xbfe07da6`

Deposits (native) tokens to the DAO contract with a reference string.

| Parameter | Type | Description |
| --- | --- | --- |
| `_token` | `address` | The address of the token or address(0) in case of the native token. |
| `_amount` | `uint256` | The amount of tokens to deposit. |
| `_reference` | `string` | The reference describing the deposit reason. |

### execute

```solidity
function execute(
    bytes32 _callId,
    Action[] _actions,
    uint256 _allowFailureMap
) external returns (bytes[] execResults, uint256 failureMap)
```

Selector: `0xc71bf324`

Executes a list of actions. If a zero allow-failure map is provided, a failing action reverts the entire execution. If a non-zero allow-failure map is provided, allowed actions can fail without the entire call being reverted.

| Parameter | Type | Description |
| --- | --- | --- |
| `_callId` | `bytes32` | The ID of the call. The definition of the value of `callId` is up to the calling contract and can be used, e.g., as a nonce. |
| `_actions` | `Action[]` | The array of actions. |
| `_allowFailureMap` | `uint256` | A bitmap allowing execution to succeed, even if individual actions might revert. If the bit at index `i` is 1, the execution succeeds even if the `i`th action reverts. A failure map value of 0 requires every action to not revert. |

| Returns | Type | Description |
| --- | --- | --- |
| `execResults` | `bytes[]` | The array of results obtained from the executed actions in `bytes`. |
| `failureMap` | `uint256` | The resulting failure map containing the actions have actually failed. |

### getTrustedForwarder

```solidity
function getTrustedForwarder() external view returns (address)
```

Selector: `0xce1b815f`

Getter for the trusted forwarder verifying the meta transaction.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `address` | The trusted forwarder address. |

### grant

```solidity
function grant(address _where, address _who, bytes32 _permissionId) external
```

Selector: `0xd68bad2c`

Grants permission to an address to call methods in a contract guarded by an auth modifier with the specified permission identifier.

> **Dev:** Requires the `ROOT_PERMISSION_ID` permission.
> Note, that granting permissions with `_who` or `_where` equal to `ANY_ADDR` does not replace other permissions with specific `_who` and `_where` addresses that exist in parallel.

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The address of the target contract for which `_who` receives permission. |
| `_who` | `address` | The address (EOA or contract) receiving the permission. |
| `_permissionId` | `bytes32` | The permission identifier. |

### grantWithCondition

```solidity
function grantWithCondition(
    address _where,
    address _who,
    bytes32 _permissionId,
    IPermissionCondition _condition
) external
```

Selector: `0xc9dbc2a4`

Grants permission to an address to call methods in a target contract guarded by an auth modifier with the specified permission identifier if the referenced condition permits it.

> **Dev:** Requires the `ROOT_PERMISSION_ID` permission
> Note, that granting permissions with `_who` or `_where` equal to `ANY_ADDR` does not replace other permissions with specific `_who` and `_where` addresses that exist in parallel.

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The address of the target contract for which `_who` receives permission. |
| `_who` | `address` | The address (EOA or contract) receiving the permission. |
| `_permissionId` | `bytes32` | The permission identifier. |
| `_condition` | `IPermissionCondition` | The `PermissionCondition` that will be asked for authorization on calls connected to the specified permission identifier. |

### hasPermission

```solidity
function hasPermission(
    address _where,
    address _who,
    bytes32 _permissionId,
    bytes _data
) external view returns (bool)
```

Selector: `0xfdef9106`

Checks if an address has permission on a contract via a permission identifier and considers if `ANY_ADDRESS` was used in the granting process.

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The address of the contract. |
| `_who` | `address` | The address of a EOA or contract to give the permissions. |
| `_permissionId` | `bytes32` | The permission identifier. |
| `_data` | `bytes` | The optional data passed to the `PermissionCondition` registered. |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | Returns true if the address has permission, false if not. |

### initialize

```solidity
function initialize(
    bytes _metadata,
    address _initialOwner,
    address _trustedForwarder,
    string daoURI_
) external
```

Selector: `0xeafb8b06`

Initializes the DAO by
- setting the reentrancy status variable to `_NOT_ENTERED`
- registering the [ERC-165](https://eips.ethereum.org/EIPS/eip-165) interface ID
- setting the trusted forwarder for meta transactions
- giving the `ROOT_PERMISSION_ID` permission to the initial owner (that should be revoked and transferred to the DAO after setup).

> **Dev:** This method is required to support [ERC-1822](https://eips.ethereum.org/EIPS/eip-1822).

| Parameter | Type | Description |
| --- | --- | --- |
| `_metadata` | `bytes` | IPFS hash that points to all the metadata (logo, description, tags, etc.) of a DAO. |
| `_initialOwner` | `address` | The initial owner of the DAO having the `ROOT_PERMISSION_ID` permission. |
| `_trustedForwarder` | `address` | The trusted forwarder responsible for verifying meta transactions. |
| `daoURI_` | `string` | The DAO URI required to support [ERC-4824](https://eips.ethereum.org/EIPS/eip-4824). |

### initializeFrom

```solidity
function initializeFrom(uint8[3] _previousProtocolVersion, bytes _initData) external
```

Selector: `0x42d8e99e`

Initializes the DAO after an upgrade from a previous protocol version.

| Parameter | Type | Description |
| --- | --- | --- |
| `_previousProtocolVersion` | `uint8[3]` | The semantic protocol version number of the previous DAO implementation contract this upgrade is transitioning from. |
| `_initData` | `bytes` | The initialization data to be passed to via `upgradeToAndCall` (see [ERC-1967](https://docs.openzeppelin.com/contracts/4.x/api/proxy#ERC1967Upgrade)). |

### isGranted

```solidity
function isGranted(
    address _where,
    address _who,
    bytes32 _permissionId,
    bytes _data
) external view returns (bool)
```

Selector: `0x2675fdd0`

Checks if the caller address has permission on the target contract via a permission identifier and relays the answer to a condition contract if this was declared during the granting process.

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The address of the target contract for which `_who` receives permission. |
| `_who` | `address` | The address (EOA or contract) for which the permission is checked. |
| `_permissionId` | `bytes32` | The permission identifier. |
| `_data` | `bytes` | Optional data to be passed to the set `PermissionCondition`. |

### isValidSignature

```solidity
function isValidSignature(bytes32 _hash, bytes _signature) external view returns (bytes4)
```

Selector: `0x1626ba7e`

Checks whether a signature is valid for a provided hash according to [ERC-1271](https://eips.ethereum.org/EIPS/eip-1271).

> **Dev:** Relays the validation logic determining who is allowed to sign on behalf of the DAO to its permission manager.
> Caller specific bypassing can be set direct granting (i.e., `grant({_where: dao, _who: specificErc1271Caller, _permissionId: VALIDATE_SIGNATURE_PERMISSION_ID})`).
> Caller specific signature validation logic can be set by granting with a `PermissionCondition` (i.e., `grantWithCondition({_where: dao, _who: specificErc1271Caller, _permissionId: VALIDATE_SIGNATURE_PERMISSION_ID, _condition: yourConditionImplementation})`)
> Generic signature validation logic can be set for all calling contracts by granting with a `PermissionCondition` to `PermissionManager.ANY_ADDR()` (i.e., `grantWithCondition({_where: dao, _who: PermissionManager.ANY_ADDR(), _permissionId: VALIDATE_SIGNATURE_PERMISSION_ID, _condition: yourConditionImplementation})`).

| Parameter | Type | Description |
| --- | --- | --- |
| `_hash` | `bytes32` | The hash of the data to be signed. |
| `_signature` | `bytes` | The signature byte array associated with `_hash`. |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bytes4` | Returns the `bytes4` magic value `0x1626ba7e` if the signature is valid and `0xffffffff` if not. |

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

### registerStandardCallback

```solidity
function registerStandardCallback(
    bytes4 _interfaceId,
    bytes4 _callbackSelector,
    bytes4 _magicNumber
) external
```

Selector: `0xc4a50145`

Registers an ERC standard having a callback by registering its [ERC-165](https://eips.ethereum.org/EIPS/eip-165) interface ID and callback function signature.

| Parameter | Type | Description |
| --- | --- | --- |
| `_interfaceId` | `bytes4` | The ID of the interface. |
| `_callbackSelector` | `bytes4` | The selector of the callback function. |
| `_magicNumber` | `bytes4` | The magic number to be registered for the function signature. |

### revoke

```solidity
function revoke(address _where, address _who, bytes32 _permissionId) external
```

Selector: `0xd96054c4`

Revokes permission from an address to call methods in a target contract guarded by an auth modifier with the specified permission identifier.

> **Dev:** Requires the `ROOT_PERMISSION_ID` permission.
> Note, that revoking permissions with `_who` or `_where` equal to `ANY_ADDR` does not revoke other permissions with specific `_who` and `_where` addresses that exist in parallel.

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The address of the target contract for which `_who` loses permission. |
| `_who` | `address` | The address (EOA or contract) losing the permission. |
| `_permissionId` | `bytes32` | The permission identifier. |

### setDaoURI

```solidity
function setDaoURI(string newDaoURI) external
```

Selector: `0x1080f99b`

Updates the set DAO URI to a new value.

| Parameter | Type | Description |
| --- | --- | --- |
| `newDaoURI` | `string` | The new DAO URI to be set. |

### setMetadata

```solidity
function setMetadata(bytes _metadata) external
```

Selector: `0xee57e36f`

Updates the DAO metadata (e.g., an IPFS hash).

| Parameter | Type | Description |
| --- | --- | --- |
| `_metadata` | `bytes` | The IPFS hash of the new metadata object. |

### setSignatureValidator

```solidity
function setSignatureValidator(address) external pure
```

Selector: `0x3e2ab0d9`

Removed function being left here to not corrupt the IDAO interface ID. Any call will revert.

> **Dev:** Introduced in v1.0.0. Removed in v1.4.0.

### setTrustedForwarder

```solidity
function setTrustedForwarder(address _newTrustedForwarder) external
```

Selector: `0xda742228`

Setter for the trusted forwarder verifying the meta transaction.

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```

Selector: `0x01ffc9a7`

> **Dev:** See {IERC165-supportsInterface}.

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

### CallbackReceived

```solidity
event CallbackReceived(address sender, bytes4 indexed sig, bytes data)
```

Emitted when `_handleCallback` is called.

| Parameter | Type | Description |
| --- | --- | --- |
| `sender` | `address` | Who called the callback. |
| `sig` | `bytes4` | The function signature. |
| `data` | `bytes` | The calldata. |

### Deposited

```solidity
event Deposited(
    address indexed sender,
    address indexed token,
    uint256 amount,
    string _reference
)
```

Emitted when a token deposit has been made to the DAO.

| Parameter | Type | Description |
| --- | --- | --- |
| `sender` | `address` | The address of the sender. |
| `token` | `address` | The address of the deposited token. |
| `amount` | `uint256` | The amount of tokens deposited. |
| `_reference` | `string` | The reference describing the deposit reason. |

### Executed

```solidity
event Executed(
    address indexed actor,
    bytes32 callId,
    Action[] actions,
    uint256 allowFailureMap,
    uint256 failureMap,
    bytes[] execResults
)
```

Emitted when a proposal is executed.

> **Dev:** The value of `callId` is defined by the component/contract calling the execute function.
> A `Plugin` implementation can use it, for example, as a nonce.

| Parameter | Type | Description |
| --- | --- | --- |
| `actor` | `address` | The address of the caller. |
| `callId` | `bytes32` | The ID of the call. |
| `actions` | `Action[]` | The array of actions executed. |
| `allowFailureMap` | `uint256` | The allow failure map encoding which actions are allowed to fail. |
| `failureMap` | `uint256` | The failure map encoding which actions have failed. |
| `execResults` | `bytes[]` | The array with the results of the executed actions. |

### Granted

```solidity
event Granted(
    bytes32 indexed permissionId,
    address indexed here,
    address where,
    address indexed who,
    address condition
)
```

Emitted when a permission `permission` is granted in the context `here` to the address `_who` for the contract `_where`.

| Parameter | Type | Description |
| --- | --- | --- |
| `permissionId` | `bytes32` | The permission identifier. |
| `here` | `address` | The address of the context in which the permission is granted. |
| `where` | `address` | The address of the target contract for which `_who` receives permission. |
| `who` | `address` | The address (EOA or contract) receiving the permission. |
| `condition` | `address` | The address `ALLOW_FLAG` for regular permissions or, alternatively, the `IPermissionCondition` contract implementation to be used. |

### Initialized

```solidity
event Initialized(uint8 version)
```

> **Dev:** Triggered when the contract has been initialized or reinitialized.

### MetadataSet

```solidity
event MetadataSet(bytes metadata)
```

Emitted when the DAO metadata is updated.

| Parameter | Type | Description |
| --- | --- | --- |
| `metadata` | `bytes` | The IPFS hash of the new metadata object. |

### NativeTokenDeposited

```solidity
event NativeTokenDeposited(address sender, uint256 amount)
```

Emitted when a native token deposit has been made to the DAO.

> **Dev:** This event is intended to be emitted in the `receive` function and is therefore bound by the gas limitations for `send`/`transfer` calls introduced by [ERC-2929](https://eips.ethereum.org/EIPS/eip-2929).

| Parameter | Type | Description |
| --- | --- | --- |
| `sender` | `address` | The address of the sender. |
| `amount` | `uint256` | The amount of native tokens deposited. |

### NewURI

```solidity
event NewURI(string daoURI)
```

Emitted when a new DAO URI is set.

| Parameter | Type | Description |
| --- | --- | --- |
| `daoURI` | `string` | The new URI. |

### Revoked

```solidity
event Revoked(
    bytes32 indexed permissionId,
    address indexed here,
    address where,
    address indexed who
)
```

Emitted when a permission `permission` is revoked in the context `here` from the address `_who` for the contract `_where`.

| Parameter | Type | Description |
| --- | --- | --- |
| `permissionId` | `bytes32` | The permission identifier. |
| `here` | `address` | The address of the context in which the permission is revoked. |
| `where` | `address` | The address of the target contract for which `_who` loses permission. |
| `who` | `address` | The address (EOA or contract) losing the permission. |

### StandardCallbackRegistered

```solidity
event StandardCallbackRegistered(
    bytes4 interfaceId,
    bytes4 callbackSelector,
    bytes4 magicNumber
)
```

Emitted when a standard callback is registered.

| Parameter | Type | Description |
| --- | --- | --- |
| `interfaceId` | `bytes4` | The ID of the interface. |
| `callbackSelector` | `bytes4` | The selector of the callback function. |
| `magicNumber` | `bytes4` | The magic number to be registered for the callback function selector. |

### TrustedForwarderSet

```solidity
event TrustedForwarderSet(address forwarder)
```

Emitted when a new TrustedForwarder is set on the DAO.

| Parameter | Type | Description |
| --- | --- | --- |
| `forwarder` | `address` | the new forwarder address. |

### Upgraded

```solidity
event Upgraded(address indexed implementation)
```

> **Dev:** Emitted when the implementation is upgraded.

## Errors

### ActionFailed

```solidity
error ActionFailed(uint256 index)
```

Thrown if action execution has failed.

| Parameter | Type | Description |
| --- | --- | --- |
| `index` | `uint256` | The index of the action in the action array that failed. |

### AlreadyInitialized

```solidity
error AlreadyInitialized()
```

Thrown when initialize is called after it has already been executed.

### AnyAddressDisallowedForWhoAndWhere

```solidity
error AnyAddressDisallowedForWhoAndWhere()
```

Thrown for permission grants where `who` and `where` are both `ANY_ADDR`.

### ConditionInterfaceNotSupported

```solidity
error ConditionInterfaceNotSupported(IPermissionCondition condition)
```

Thrown if a condition contract does not support the `IPermissionCondition` interface.

| Parameter | Type | Description |
| --- | --- | --- |
| `condition` | `IPermissionCondition` | The address that is not a contract. |

### ConditionNotAContract

```solidity
error ConditionNotAContract(IPermissionCondition condition)
```

Thrown if a condition address is not a contract.

| Parameter | Type | Description |
| --- | --- | --- |
| `condition` | `IPermissionCondition` | The address that is not a contract. |

### FunctionRemoved

```solidity
error FunctionRemoved()
```

Thrown when a function is removed but left to not corrupt the interface ID.

### GrantWithConditionNotSupported

```solidity
error GrantWithConditionNotSupported()
```

Thrown if `Operation.GrantWithCondition` is requested as an operation but the method does not support it.

### InsufficientGas

```solidity
error InsufficientGas()
```

Thrown if an action has insufficient gas left.

### NativeTokenDepositAmountMismatch

```solidity
error NativeTokenDepositAmountMismatch(uint256 expected, uint256 actual)
```

Thrown if there is a mismatch between the expected and actually deposited amount of native tokens.

| Parameter | Type | Description |
| --- | --- | --- |
| `expected` | `uint256` | The expected native token amount. |
| `actual` | `uint256` | The actual native token amount deposited. |

### PermissionAlreadyGrantedForDifferentCondition

```solidity
error PermissionAlreadyGrantedForDifferentCondition(
    address where,
    address who,
    bytes32 permissionId,
    address currentCondition,
    address newCondition
)
```

Thrown if a permission has been already granted with a different condition.

> **Dev:** This makes sure that condition on the same permission can not be overwriten by a different condition.

| Parameter | Type | Description |
| --- | --- | --- |
| `where` | `address` | The address of the target contract to grant `_who` permission to. |
| `who` | `address` | The address (EOA or contract) to which the permission has already been granted. |
| `permissionId` | `bytes32` | The permission identifier. |
| `currentCondition` | `address` | The current condition set for permissionId. |
| `newCondition` | `address` | The new condition it tries to set for permissionId. |

### PermissionsForAnyAddressDisallowed

```solidity
error PermissionsForAnyAddressDisallowed()
```

Thrown for `ROOT_PERMISSION_ID` or `EXECUTE_PERMISSION_ID` permission grants where `who` or `where` is `ANY_ADDR`.

### ProtocolVersionUpgradeNotSupported

```solidity
error ProtocolVersionUpgradeNotSupported(uint8[3] protocolVersion)
```

Thrown if an upgrade is not supported from a specific protocol version .

### ReentrantCall

```solidity
error ReentrantCall()
```

Thrown if a call is reentrant.

### TooManyActions

```solidity
error TooManyActions()
```

Thrown if the action array length is larger than `MAX_ACTIONS`.

### Unauthorized

```solidity
error Unauthorized(address where, address who, bytes32 permissionId)
```

Thrown if a call is unauthorized.

| Parameter | Type | Description |
| --- | --- | --- |
| `where` | `address` | The context in which the authorization reverted. |
| `who` | `address` | The address (EOA or contract) missing the permission. |
| `permissionId` | `bytes32` | The permission identifier. |

### UnknownCallback

```solidity
error UnknownCallback(bytes4 callbackSelector, bytes4 magicNumber)
```

Thrown if the callback function is not registered.

| Parameter | Type | Description |
| --- | --- | --- |
| `callbackSelector` | `bytes4` | The selector of the callback function. |
| `magicNumber` | `bytes4` | The magic number to be registered for the callback function selector. |

### ZeroAmount

```solidity
error ZeroAmount()
```

Thrown if the deposit amount is zero.

## Constants

_Public, so each is also readable through a generated getter._

### EXECUTE_PERMISSION_ID

```solidity
bytes32 public constant EXECUTE_PERMISSION_ID = keccak256("EXECUTE_PERMISSION");
```

Value: `0xbf04b4486c9663d805744005c3da000eda93de6e3308a4a7a812eb565327b78d`

The ID of the permission required to call the `execute` function.

### REGISTER_STANDARD_CALLBACK_PERMISSION_ID

```solidity
bytes32 public constant REGISTER_STANDARD_CALLBACK_PERMISSION_ID =
        keccak256("REGISTER_STANDARD_CALLBACK_PERMISSION");
```

Value: `0xfaf505be9907aa6951c2ebe5b0312f4980e14f21912ed355372103cc8bd683bc`

The ID of the permission required to call the `registerStandardCallback` function.

### ROOT_PERMISSION_ID _(from PermissionManager)_

```solidity
bytes32 public constant ROOT_PERMISSION_ID = keccak256("ROOT_PERMISSION");
```

Value: `0x815fe80e4b37c8582a3b773d1d7071f983eacfd56b5965db654f3087c25ada33`

The ID of the permission required to call the `grant`, `grantWithCondition`, `revoke`, and `bulk` function.

### SET_METADATA_PERMISSION_ID

```solidity
bytes32 public constant SET_METADATA_PERMISSION_ID = keccak256("SET_METADATA_PERMISSION");
```

Value: `0x4707e94b25cfce1a7c363508fbb838c35864388ad77284b248282b9746982b9b`

The ID of the permission required to call the `setMetadata` function.

### SET_TRUSTED_FORWARDER_PERMISSION_ID

```solidity
bytes32 public constant SET_TRUSTED_FORWARDER_PERMISSION_ID =
        keccak256("SET_TRUSTED_FORWARDER_PERMISSION");
```

Value: `0x06d294bc8cbad2e393408b20dd019a772661f60b8d633e56761157cb1ec85f8c`

The ID of the permission required to call the `setTrustedForwarder` function.

### UPGRADE_DAO_PERMISSION_ID

```solidity
bytes32 public constant UPGRADE_DAO_PERMISSION_ID = keccak256("UPGRADE_DAO_PERMISSION");
```

Value: `0x1f53edd44352e5d15bad2b29233baa93bcd595e09457780bc7c5445bbbe751cc`

The ID of the permission required to call the `_authorizeUpgrade` function.

### VALIDATE_SIGNATURE_PERMISSION_ID

```solidity
bytes32 public constant VALIDATE_SIGNATURE_PERMISSION_ID =
        keccak256("VALIDATE_SIGNATURE_PERMISSION");
```

Value: `0x968c17ebf04aa1b7544168e69314cdab6b69ba813bb6080d49c0c40a65560f58`

The ID of the permission required to validate [ERC-1271](https://eips.ethereum.org/EIPS/eip-1271) signatures.
