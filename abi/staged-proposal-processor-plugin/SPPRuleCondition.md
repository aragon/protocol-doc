---
type: reference
title: SPPRuleCondition
kind: contract
source: staged-proposal-processor-plugin/src/utils/SPPRuleCondition.sol
summary: "The SPP Condition that must be granted for `createProposal` function of `StagedProposalProcessor`."
---

# SPPRuleCondition

**Contract** · [`src/utils/SPPRuleCondition.sol`](https://github.com/aragon/staged-proposal-processor-plugin/blob/96b83dd5da22930e8d9bcc211cf4e57aaf5270f2/src/utils/SPPRuleCondition.sol)

**Explained in:** [Staged Proposal Processor (SPP)](../../plugins/spp-plugin.md)

**Author:** Aragon X - 2024

**Inherits:** `DaoAuthorizableUpgradeable`, `RuledCondition`

The SPP Condition that must be granted for `createProposal` function of `StagedProposalProcessor`.

> **Dev:** This contract must be deployed either with clonable or `new` keyword.

## Constructor

### constructor

```solidity
constructor(address _dao, RuledCondition.Rule[] _rules)
```

Disables the initializers on the implementation contract to prevent it from being left uninitialized.

**oz-upgrades-unsafe-allow:** constructor

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `address` |  |
| `_rules` | [`RuledCondition.Rule[]`](#rule) |  |

## Functions

### dao

```solidity
function dao() external view returns (IDAO)
```

Selector: `0x4162169f`

Returns the DAO contract.

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

### initialize

```solidity
function initialize(address _dao, RuledCondition.Rule[] _rules) external
```

Selector: `0xe87c7fa8`

Initializes the component.

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `address` | The IDAO interface of the associated DAO. |
| `_rules` | [`RuledCondition.Rule[]`](#rule) | The rules that decide who can create a proposal on `StagedProposalProcessor`. |

### isGranted

```solidity
function isGranted(
    address _where,
    address _who,
    bytes32 _permissionId,
    bytes
) external view returns (bool isPermitted)
```

Selector: `0x2675fdd0`

Checks if a call is permitted.

| Parameter | Type | Description |
| --- | --- | --- |
| `_where` | `address` | The address of the target contract. |
| `_who` | `address` | The address (EOA or contract) for which the permissions are checked. |
| `_permissionId` | `bytes32` | The permission identifier. |
| `[3]` | `bytes` |  |

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

### updateRules

```solidity
function updateRules(RuledCondition.Rule[] _rules) external
```

Selector: `0x8306b5f1`

Updates the rules that will be used as a check upon proposal creation on `StagedProposalProcessor`.

| Parameter | Type | Description |
| --- | --- | --- |
| `_rules` | [`RuledCondition.Rule[]`](#rule) | The rules that decide who can create a proposal on `StagedProposalProcessor`. |

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

## Errors

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

### UPDATE_RULES_PERMISSION_ID

```solidity
bytes32 public constant UPDATE_RULES_PERMISSION_ID = keccak256("UPDATE_RULES_PERMISSION");
```

Value: `0xd3d98e95f3486fc234d80c098cf0d2a0a3fb187833d7e9cc930f8c4f8335a0e7`

The ID of the permission required to call the `updateRules` function.

## Enums

### Op

_Inherited from `RuledCondition`._

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

Represents various operations that can be performed in a rule.

| Option | Value | Description |
| --- | --- | --- |
| `NONE` | `0` | No operation. |
| `EQ` | `1` | Equal to operation. |
| `NEQ` | `2` | Not equal to operation. |
| `GT` | `3` | Greater than operation. |
| `LT` | `4` | Less than operation. |
| `GTE` | `5` | Greater than or equal to operation. |
| `LTE` | `6` | Less than or equal to operation. |
| `RET` | `7` | Return the evaluation result. |
| `NOT` | `8` | Logical NOT operation. |
| `AND` | `9` | Logical AND operation. |
| `OR` | `10` | Logical OR operation. |
| `XOR` | `11` | Logical XOR operation. |
| `IF_ELSE` | `12` | Conditional evaluation with IF-ELSE logic. |

## Structs

### Rule

_Inherited from `RuledCondition`._

```solidity
struct Rule {
    uint8 id;
    uint8 op;
    uint240 value;
    bytes32 permissionId;
}
```

Represents a rule used in the condition contract.

| Field | Type | Description |
| --- | --- | --- |
| `id` | `uint8` | The ID representing the identifier of the rule. |
| `op` | `uint8` | The operation to apply, as defined in the `Op` enum. |
| `value` | `uint240` | The value associated with this rule, which could be an address, timestamp, etc. |
| `permissionId` | `bytes32` | The specific permission ID to use for evaluating this rule. If set to `0x`, the passed permission ID will be used. |
