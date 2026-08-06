---
type: reference
title: IDAO
kind: interface
source: osx/src/common/dao/IDAO.sol
summary: "The interface required for DAOs within the Aragon App DAO framework."
---

# IDAO

**Interface** · [`src/common/dao/IDAO.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/dao/IDAO.sol)

**Author:** Aragon X - 2022-2024

The interface required for DAOs within the Aragon App DAO framework.

**security-contact:** sirt@aragon.org

## Functions

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

### getTrustedForwarder

```solidity
function getTrustedForwarder() external view returns (address)
```

Selector: `0xce1b815f`

Getter for the trusted forwarder verifying the meta transaction.

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

### isValidSignature

```solidity
function isValidSignature(bytes32 _hash, bytes _signature) external returns (bytes4)
```

Selector: `0x1626ba7e`

Checks whether a signature is valid for a provided hash according to [ERC-1271](https://eips.ethereum.org/EIPS/eip-1271).

| Parameter | Type | Description |
| --- | --- | --- |
| `_hash` | `bytes32` | The hash of the data to be signed. |
| `_signature` | `bytes` | The signature byte array associated with `_hash`. |

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
function setSignatureValidator(address) external
```

Selector: `0x3e2ab0d9`

Removed function being left here to not corrupt the IDAO interface ID. Any call will revert.

> **Dev:** Introduced in v1.0.0. Removed in v1.4.0.

### setTrustedForwarder

```solidity
function setTrustedForwarder(address _trustedForwarder) external
```

Selector: `0xda742228`

Setter for the trusted forwarder verifying the meta transaction.

| Parameter | Type | Description |
| --- | --- | --- |
| `_trustedForwarder` | `address` | The trusted forwarder address. |

## Events

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
