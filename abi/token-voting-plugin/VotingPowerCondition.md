---
title: VotingPowerCondition
kind: contract
source: src/condition/VotingPowerCondition.sol
summary: "Checks if an account's voting power or token balance meets the threshold set in an associated TokenVoting plugin."
---

# VotingPowerCondition

**Contract** · [`src/condition/VotingPowerCondition.sol`](https://github.com/aragon/token-voting-plugin/blob/e97b783d76872d694f41dfc4bc846405019ca741/src/condition/VotingPowerCondition.sol)

**Author:** Aragon X - 2025

**Inherits:** `PermissionCondition`

Checks if an account's voting power or token balance meets the threshold set
in an associated TokenVoting plugin.

**security-contact:** sirt@aragon.org

## Constructor

### constructor

```solidity
constructor(address _tokenVoting)
```

Initializes the contract with the `TokenVoting` plugin address and fetches the associated token.

| Parameter | Type | Description |
| --- | --- | --- |
| `_tokenVoting` | `address` | The address of the `TokenVoting` plugin. |

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

> **Dev:** The function checks both the voting power and token balance to ensure `_who` meets the minimum voting
> threshold defined in the `TokenVoting` plugin. Returns `false` if the minimum requirement is unmet.

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
