---
title: ENSDomain
kind: library
source: src/framework/utils/ens/ENSDomain.sol
summary: "Pure-string utilities for working with ENS domain names: namehash (EIP-137) and splitting at the first dot."
---

# ENSDomain

**Library** · [`src/framework/utils/ens/ENSDomain.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/framework/utils/ens/ENSDomain.sol)

Pure-string utilities for working with ENS domain names: namehash (EIP-137)
and splitting at the first dot. Single source of truth used by the contract,
deploy scripts and tests.

## Errors

### InvalidDomain

```solidity
error InvalidDomain(string domain)
```

Thrown when `domain` is structurally malformed
