---
type: concept
title: Vault Donate
tags: [automation, treasury]
source: capital-tree/src/actions/VaultDonateAction.sol
---

# Vault Donate

Use Vault Donate to benefit existing vault holders with a branch's tokens. A **vault** holds an underlying asset; **shares** represent holders' interests in it. The `DAO.sol` contract calls `donate()` with the branch's full allocation, increasing the backing of existing shares without receiving new shares itself.

- **Check**: the input token is the vault's asset, and the vault's total assets rose by at least
  the amount.
- **Trust**: the vault is trusted, and only vaults that count a donation in their assets
  immediately are supported.

[The avKAT example](../examples/avkat-buyback.md) walks through a buyback that donates to avKAT.

## See also

- [All actions](./index.md)
- [Execution](../execution.md) and [setup and permissions](../setup.md)
- [Contract source](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/actions/VaultDonateAction.sol) and [settings metadata](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/metadata/components/VaultDonateAction.json)
