---
type: reference
title: ConditionFactory
kind: contract
source: conditions/src/factory/ConditionFactory.sol
summary: "A factory used to deploy new condition instances"
---

# ConditionFactory

**Contract** · [`src/factory/ConditionFactory.sol`](https://github.com/aragon/conditions/blob/33918b06b95233dd8890bef6cc60da6227fa5af1/src/factory/ConditionFactory.sol)

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

### deploySafeOwnerCondition

```solidity
function deploySafeOwnerCondition(
    address _safe
) external returns (SafeOwnerCondition newContract)
```

Selector: `0x1002e8ad`

### deploySelectorCondition

```solidity
function deploySelectorCondition(
    IDAO _dao,
    bytes4[] _initialSelectors
) external returns (SelectorCondition newContract)
```

Selector: `0xa907b318`

## Events

### ExecuteSelectorConditionDeployed

```solidity
event ExecuteSelectorConditionDeployed(ExecuteSelectorCondition newContract)
```

### SafeOwnerConditionDeployed

```solidity
event SafeOwnerConditionDeployed(SafeOwnerCondition newContract)
```

### SelectorConditionDeployed

```solidity
event SelectorConditionDeployed(SelectorCondition newContract)
```
