---
title: ProxyFactory
kind: contract
source: src/common/utils/deployment/ProxyFactory.sol
summary: "A factory to deploy proxies via the UUPS pattern (see [ERC-1822](https://eips.ethereum.org/EIPS/eip-1822)) and minimal proxy pattern (see [ERC-1167](https://eip"
---

# ProxyFactory

**Contract** · [`src/common/utils/deployment/ProxyFactory.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/common/utils/deployment/ProxyFactory.sol)

**Author:** Aragon X - 2024

A factory to deploy proxies via the UUPS pattern (see [ERC-1822](https://eips.ethereum.org/EIPS/eip-1822)) and minimal proxy pattern (see [ERC-1167](https://eips.ethereum.org/EIPS/eip-1167)).

**security-contact:** sirt@aragon.org

## Constructor

### constructor

```solidity
constructor(address _implementation)
```

Initializes the contract with a logic contract address.

| Parameter | Type | Description |
| --- | --- | --- |
| `_implementation` | `address` | The logic contract address. |

## Functions

### deployMinimalProxy

```solidity
function deployMinimalProxy(bytes _data) external returns (address proxy)
```

Selector: `0x93042ea3`

Creates an [ERC-1167](https://eips.ethereum.org/EIPS/eip-1167) minimal proxy contract pointing to the pre-set logic contract.

> **Dev:** If `_data` is non-empty, it is used in a call to the clone contract. This will typically be an encoded function call initializing the storage of the contract.

| Parameter | Type | Description |
| --- | --- | --- |
| `_data` | `bytes` | The initialization data for this contract. |

| Returns | Type | Description |
| --- | --- | --- |
| `proxy` | `address` | The address of the proxy contract created. |

### deployUUPSProxy

```solidity
function deployUUPSProxy(bytes _data) external returns (address proxy)
```

Selector: `0x5c5c278b`

Creates an [ERC-1967](https://eips.ethereum.org/EIPS/eip-1967) proxy contract pointing to the pre-set logic contract.

> **Dev:** If `_data` is non-empty, it is used in a delegate call to the `_implementation` contract. This will typically be an encoded function call initializing the proxy (see [OpenZeppelin ERC1967Proxy-constructor](https://docs.openzeppelin.com/contracts/4.x/api/proxy#ERC1967Proxy-constructor-address-bytes-)).

| Parameter | Type | Description |
| --- | --- | --- |
| `_data` | `bytes` | The initialization data for this contract. |

| Returns | Type | Description |
| --- | --- | --- |
| `proxy` | `address` | The address of the proxy contract created. |

### implementation

```solidity
function implementation() external view returns (address)
```

Selector: `0x5c60da1b`

Returns the implementation contract address.

> **Dev:** The implementation can be cloned via the minimal proxy pattern (see [ERC-1167](https://eips.ethereum.org/EIPS/eip-1167)), or proxied via the UUPS proxy pattern (see [ERC-1822](https://eips.ethereum.org/EIPS/eip-1822)).

## Events

### ProxyCreated

```solidity
event ProxyCreated(address proxy)
```

Emitted when an proxy contract is created.

| Parameter | Type | Description |
| --- | --- | --- |
| `proxy` | `address` | The proxy address. |
