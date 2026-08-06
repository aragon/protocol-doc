---
type: reference
title: IGovernanceWrappedERC20
kind: interface
source: token-voting-plugin/src/erc20/IGovernanceWrappedERC20.sol
summary: "An interface for the token wrapping contract wrapping existing [ERC-20](https://eips.ethereum.org/EIPS/eip-20) tokens."
---

# IGovernanceWrappedERC20

**Interface** · [`src/erc20/IGovernanceWrappedERC20.sol`](https://github.com/aragon/token-voting-plugin/blob/e97b783d76872d694f41dfc4bc846405019ca741/src/erc20/IGovernanceWrappedERC20.sol)

**Author:** Aragon X

An interface for the token wrapping contract wrapping existing
[ERC-20](https://eips.ethereum.org/EIPS/eip-20) tokens.

**security-contact:** sirt@aragon.org

## Functions

### depositFor

```solidity
function depositFor(address account, uint256 amount) external returns (bool)
```

Selector: `0x2f4f21e2`

Deposits an amount of underlying token
and mints the corresponding number of wrapped tokens for a receiving address.

| Parameter | Type | Description |
| --- | --- | --- |
| `account` | `address` | The address receiving the minted, wrapped tokens. |
| `amount` | `uint256` | The amount of tokens to deposit. |

### withdrawTo

```solidity
function withdrawTo(address account, uint256 amount) external returns (bool)
```

Selector: `0x205c2878`

Withdraws an amount of underlying tokens to a receiving address
and burns the corresponding number of wrapped tokens.

| Parameter | Type | Description |
| --- | --- | --- |
| `account` | `address` | The address receiving the withdrawn, underlying tokens. |
| `amount` | `uint256` | The amount of underlying tokens to withdraw. |
