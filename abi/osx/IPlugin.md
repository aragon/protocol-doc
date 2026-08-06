---
title: IPlugin
kind: interface
source: src/common/plugin/IPlugin.sol
summary: "An interface defining the traits of a plugin."
---

# IPlugin

**Interface** · [`src/common/plugin/IPlugin.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/plugin/IPlugin.sol)

**Author:** Aragon X - 2022-2024

An interface defining the traits of a plugin.

**security-contact:** sirt@aragon.org

## Functions

### pluginType

```solidity
function pluginType() external view returns (IPlugin.PluginType)
```

Selector: `0x41de6830`

Returns the plugin's type

## Enums

### Operation

```solidity
enum Operation {
    Call,
    DelegateCall
}
```

### PluginType

```solidity
enum PluginType {
    UUPS,
    Cloneable,
    Constructable
}
```

## Structs

### TargetConfig

```solidity
struct TargetConfig {
    address target;
    IPlugin.Operation operation;
}
```
