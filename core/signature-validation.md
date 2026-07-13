---
type: concept
title: DAO signature validation (EIP-1271)
tags: [permissions]
source: osx/src/core/dao/DAO.sol
---

# DAO signature validation (EIP-1271)

A DAO is a contract, so it has no private key and cannot produce ECDSA signatures. [EIP-1271](https://eips.ethereum.org/EIPS/eip-1271) is the standard by which a contract answers "is this signature valid for me?" via `isValidSignature(hash, signature)`. Many integrations (Safe modules, exchanges, off-chain order books) call it to check whether a smart-contract account approved something.

OSx implements EIP-1271 in an unusual, elegant way: **the DAO delegates the decision to its own [permission system](./permissions.md).** It holds no signature logic of its own.

## How it works

```solidity
function isValidSignature(bytes32 _hash, bytes memory _signature) external view returns (bytes4) {
    if (isGranted(address(this), msg.sender, VALIDATE_SIGNATURE_PERMISSION_ID,
                  abi.encode(_hash, _signature)))
        return 0x1626ba7e;   // EIP-1271 "valid" magic value
    return 0xffffffff;       // invalid
}
```

Read the permission tuple carefully:

- **`where`** is the DAO itself.
- **`who`** is `msg.sender`, the contract *asking* whether the signature is valid (the Safe, the exchange), **not** a signer.
- **`_data`** carries the `(hash, signature)` pair, so a [condition](../common/permission-conditions.md) can actually inspect and verify the signature.

So "the DAO's signature is valid to caller X" is expressed as "X is granted `VALIDATE_SIGNATURE_PERMISSION_ID` on the DAO."

## Configuring it

Three shapes, depending on how much logic you want:

```solidity
// 1. Trust a specific caller unconditionally: any signature it presents is "valid".
dao.grant(dao, someCaller, VALIDATE_SIGNATURE_PERMISSION_ID);

// 2. Caller-specific validation logic: the condition inspects (hash, signature).
dao.grantWithCondition(dao, someCaller, VALIDATE_SIGNATURE_PERMISSION_ID, validator);

// 3. A generic validator usable by ANY caller.
dao.grantWithCondition(dao, ANY_ADDR, VALIDATE_SIGNATURE_PERMISSION_ID, validator);
```

`VALIDATE_SIGNATURE_PERMISSION_ID` is one of the few permissions the DAO deliberately **allows** to be granted to `ANY_ADDR` (exactly so a generic signature validator can serve every caller). A "signature validator plugin" is just a [condition](../common/permission-conditions.md) wired in this way.

> Legacy note: older OSx exposed `setSignatureValidator`. It was removed in v1.4.0 (the function now reverts, kept only to preserve the interface id); this permission-based approach replaces it.

## Keep in mind

- **`who` is the asker, not the signer.** Grant `VALIDATE_SIGNATURE_PERMISSION_ID` to the contract that *calls* `isValidSignature` (the Safe, the exchange), not to whoever produced a signature.
- **Validation is fail-closed and silent.** With no matching grant (or a condition that reverts) the DAO just returns "invalid"; a mis-wired validator rejects everything with no error to explain why.

## See also

- [Permission conditions](../common/permission-conditions.md) — where the actual signature-checking logic lives.
- [The permission system](./permissions.md) — the `ANY_ADDR` wildcard and `grantWithCondition`.
