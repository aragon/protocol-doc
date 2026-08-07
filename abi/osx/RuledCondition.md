---
type: reference
title: RuledCondition
kind: abstract contract
source: osx/src/common/permission/condition/extensions/RuledCondition.sol
summary: "An abstract contract to create conditional permissions using rules."
---

# RuledCondition

**Abstract contract** · [`src/common/permission/condition/extensions/RuledCondition.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/permission/condition/extensions/RuledCondition.sol)

**Explained in:** [RuledCondition (the rule engine)](../../common/ruled-condition.md)

**Author:** Aragon X - 2024

**Inherits:** [`PermissionConditionUpgradeable`](./PermissionConditionUpgradeable.md)

An abstract contract to create conditional permissions using rules.

## Functions

### decodeRuleValue

```solidity
function decodeRuleValue(uint256 _x) external pure returns (uint32 a, uint32 b, uint32 c)
```

Selector: `0x1498b514`

Decodes rule indices into three uint32.

| Parameter | Type | Description |
| --- | --- | --- |
| `_x` | `uint256` | The value to decode. |

| Returns | Type | Description |
| --- | --- | --- |
| `a` | `uint32` | The first 32-bit segment. |
| `b` | `uint32` | The second 32-bit segment. |
| `c` | `uint32` | The third 32-bit segment. |

### encodeIfElse

```solidity
function encodeIfElse(
    uint256 startingRuleIndex,
    uint256 successRuleIndex,
    uint256 failureRuleIndex
) external pure returns (uint240)
```

Selector: `0x23e8cefc`

Encodes rule indices into a uint240 value.

| Parameter | Type | Description |
| --- | --- | --- |
| `startingRuleIndex` | `uint256` | The index of the starting rule to evaluate. |
| `successRuleIndex` | `uint256` | The index of the rule to evaluate if the evaluation of `startingRuleIndex` was true. |
| `failureRuleIndex` | `uint256` | The index of the rule to evaluate if the evaluation of `startingRuleIndex` was false. |

### encodeLogicalOperator

```solidity
function encodeLogicalOperator(
    uint256 ruleIndex1,
    uint256 ruleIndex2
) external pure returns (uint240)
```

Selector: `0xd09e5361`

Encodes two rule indexes into a uint240 value. Useful for logical operators such as `AND/OR/XOR` and others.

| Parameter | Type | Description |
| --- | --- | --- |
| `ruleIndex1` | `uint256` | The first index to evaluate. |
| `ruleIndex2` | `uint256` | The second index to evaluate. |

### getRules

```solidity
function getRules() external view returns (RuledCondition.Rule[])
```

Selector: `0x45e2984a`

Retrieves the current rules stored in this contract.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | [`RuledCondition.Rule[]`](#rule) |  |

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

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | `bool` | Returns `true` if the interface is supported. |

## Events

### Initialized

```solidity
event Initialized(uint8 version)
```

> **Dev:** Triggered when the contract has been initialized or reinitialized.

### RulesUpdated

```solidity
event RulesUpdated(RuledCondition.Rule[] rules)
```

Emitted when the rules are updated.

| Parameter | Type | Description |
| --- | --- | --- |
| `rules` | [`RuledCondition.Rule[]`](#rule) | The new rules that replaces old rules. |

## Enums

### Op

```solidity
enum Op {
    NONE,
    EQ,
    NEQ,
    GT,
    LT,
    GTE,
    LTE,
    RET,
    NOT,
    AND,
    OR,
    XOR,
    IF_ELSE
}
```

| Option | Value |
| --- | --- |
| `NONE` | `0` |
| `EQ` | `1` |
| `NEQ` | `2` |
| `GT` | `3` |
| `LT` | `4` |
| `GTE` | `5` |
| `LTE` | `6` |
| `RET` | `7` |
| `NOT` | `8` |
| `AND` | `9` |
| `OR` | `10` |
| `XOR` | `11` |
| `IF_ELSE` | `12` |

## Structs

### Rule

```solidity
struct Rule {
    uint8 id;
    uint8 op;
    uint240 value;
    bytes32 permissionId;
}
```
