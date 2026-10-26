---
type: reference
title: ConditionFactory
kind: contract
source: conditions/src/factory/ConditionFactory.sol
summary: "A factory used to deploy new condition instances"
---

# ConditionFactory

**Contract** · [`src/factory/ConditionFactory.sol`](https://github.com/aragon/conditions/blob/7198a02ae1e62f3297416feeca64159bf69802c7/src/factory/ConditionFactory.sol)

**Explained in:** [Condition Library](../../helpers/condition-library.md)

**Author:** AragonX 2025

A factory used to deploy new condition instances

## Functions

### deployExecuteSelectorCondition

```solidity
function deployExecuteSelectorCondition(
    IDAO _dao,
    ExecuteSelectorCondition.SelectorTarget[] _initialEntries
) external returns (ExecuteSelectorCondition newContract)
```

Selector: `0x5968851e`

| Returns | Type | Description |
| --- | --- | --- |
| `newContract` | [`ExecuteSelectorCondition`](./ExecuteSelectorCondition.md) |  |

### deployExecuteSelectorCrossChainCondition

```solidity
function deployExecuteSelectorCrossChainCondition(
    IDAO _dao,
    uint256[] _chainIds,
    ExecuteSelectorCrossChainCondition.SelectorTarget[] _initialEntries
) external returns (ExecuteSelectorCrossChainCondition newContract)
```

Selector: `0x4255e795`

| Returns | Type | Description |
| --- | --- | --- |
| `newContract` | [`ExecuteSelectorCrossChainCondition`](./ExecuteSelectorCrossChainCondition.md) |  |

### deploySafeOwnerCondition

```solidity
function deploySafeOwnerCondition(
    address _safe
) external returns (SafeOwnerCondition newContract)
```

Selector: `0x1002e8ad`

| Returns | Type | Description |
| --- | --- | --- |
| `newContract` | [`SafeOwnerCondition`](./SafeOwnerCondition.md) |  |

### deploySelectorCondition

```solidity
function deploySelectorCondition(
    IDAO _dao,
    bytes4[] _initialSelectors
) external returns (SelectorCondition newContract)
```

Selector: `0xa907b318`

| Returns | Type | Description |
| --- | --- | --- |
| `newContract` | [`SelectorCondition`](./SelectorCondition.md) |  |

## Events

### ExecuteSelectorConditionDeployed

```solidity
event ExecuteSelectorConditionDeployed(ExecuteSelectorCondition newContract)
```

| Parameter | Type | Description |
| --- | --- | --- |
| `newContract` | [`ExecuteSelectorCondition`](./ExecuteSelectorCondition.md) |  |

### ExecuteSelectorCrossChainConditionDeployed

```solidity
event ExecuteSelectorCrossChainConditionDeployed(ExecuteSelectorCrossChainCondition newContract)
```

| Parameter | Type | Description |
| --- | --- | --- |
| `newContract` | [`ExecuteSelectorCrossChainCondition`](./ExecuteSelectorCrossChainCondition.md) |  |

### SafeOwnerConditionDeployed

```solidity
event SafeOwnerConditionDeployed(SafeOwnerCondition newContract)
```

| Parameter | Type | Description |
| --- | --- | --- |
| `newContract` | [`SafeOwnerCondition`](./SafeOwnerCondition.md) |  |

### SelectorConditionDeployed

```solidity
event SelectorConditionDeployed(SelectorCondition newContract)
```

| Parameter | Type | Description |
| --- | --- | --- |
| `newContract` | [`SelectorCondition`](./SelectorCondition.md) |  |
