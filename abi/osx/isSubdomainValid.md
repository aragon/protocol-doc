---
type: reference
title: isSubdomainValid
kind: function
source: osx/src/framework/utils/RegistryUtils.sol
summary: "Validates that a subdomain name is composed only from characters in the allowed character set: - the lowercase letters `a-z` - the digits `0-9` - the hyphen `-`"
---

# isSubdomainValid

**Function** · [`src/framework/utils/RegistryUtils.sol`](https://github.com/aragon/core/blob/f7c7508f4ceb2b685ee037ffe87df17340fc4aef/src/framework/utils/RegistryUtils.sol)

```solidity
function isSubdomainValid(string calldata subDomain) pure returns (bool)
```

Validates that a subdomain name is composed only from characters in the allowed character set:
- the lowercase letters `a-z`
- the digits `0-9`
- the hyphen `-`

> **Dev:** This function allows empty (zero-length) subdomains. If this should not be allowed, make sure to add a respective check when using this function in your code.
> Aborts on the first invalid char found.

**security-contact:** sirt@aragon.org

| Parameter | Type | Description |
| --- | --- | --- |
| `subDomain` | `string` | The name of the DAO. |
