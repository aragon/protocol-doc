---
type: reference
title: ListedCheckCondition
kind: contract
source: multisig-plugin/packages/contracts/src/ListedCheckCondition.sol
summary: "A condition contract that checks if an address is listed as a member in the associated Multisig contract."
---

# ListedCheckCondition

**Contract** · [`packages/contracts/src/ListedCheckCondition.sol`](https://github.com/aragon/multisig-plugin/blob/c1b0e04919819f8fb1ec110743085dfb0dd7cc02/packages/contracts/src/ListedCheckCondition.sol)

**Explained in:** [Multisig membership & eligibility](../../plugins/multisig-plugin/membership.md)

**Author:** Aragon X - 2024

**Inherits:** `PermissionCondition`

A condition contract that checks if an address is listed as a member in the associated Multisig contract.

**security-contact:** sirt@aragon.org

## Constructor

### constructor

```solidity
constructor(address _multisig)
```

Initializes the condition with the address of the Multisig plugin.

| Parameter | Type | Description |
| --- | --- | --- |
| `_multisig` | `address` | The address of the Multisig plugin that stores listing and other configuration settings. |

## Functions

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

Checks if a call is permitted.

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The address of the target contract. |
| `_who` | `address` | The address (EOA or contract) for which the permissions are checked. |
| `_permissionId` | `bytes32` | The permission identifier. |
| `_data` | `bytes` | Optional data passed to the `PermissionCondition` implementation. |

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | Returns true if the call is permitted. |

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

### supportsInterface

```solidity
function supportsInterface(bytes4 _interfaceId) external view returns (bool)
```

Selector: `0x01ffc9a7`

Checks if an interface is supported by this or its parent contract.

| Parameter | Type | Description |
| --- | --- | --- |
| `_interfaceId` | `bytes4` | The ID of the interface. |
