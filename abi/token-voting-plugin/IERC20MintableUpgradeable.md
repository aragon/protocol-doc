---
title: IERC20MintableUpgradeable
kind: interface
source: src/erc20/IERC20MintableUpgradeable.sol
summary: "Interface to allow minting of [ERC-20](https://eips.ethereum.org/EIPS/eip-20) tokens."
---

# IERC20MintableUpgradeable

**Interface** · [`src/erc20/IERC20MintableUpgradeable.sol`](https://github.com/aragon/token-voting-plugin/blob/e97b783d76872d694f41dfc4bc846405019ca741/src/erc20/IERC20MintableUpgradeable.sol)

Interface to allow minting of [ERC-20](https://eips.ethereum.org/EIPS/eip-20) tokens.

**security-contact:** sirt@aragon.org

## Functions

### mint

```solidity
function mint(address _to, uint256 _amount) external
```

Selector: `0x40c10f19`

Mints [ERC-20](https://eips.ethereum.org/EIPS/eip-20) tokens for a receiving address.

| Parameter | Type | Description |
| --- | --- | --- |
| `_to` | `address` | The receiving address. |
| `_amount` | `uint256` | The amount of tokens. |
