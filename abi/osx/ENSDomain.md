---
type: reference
title: ENSDomain
kind: library
source: osx/src/framework/utils/ens/ENSDomain.sol
summary: "Pure-string utilities for working with ENS domain names: namehash (EIP-137) and splitting at the first dot."
---

# ENSDomain

**Library** · [`src/framework/utils/ens/ENSDomain.sol`](https://github.com/aragon/osx/blob/2c60f1252558d75fe99c414ccd2b1aedbde88f12/src/framework/utils/ens/ENSDomain.sol)

Pure-string utilities for working with ENS domain names: namehash (EIP-137)
and splitting at the first dot. Single source of truth used by the contract,
deploy scripts and tests.

## Errors

### InvalidDomain

```solidity
error InvalidDomain(string domain)
```

Thrown when `domain` is structurally malformed
