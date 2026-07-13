---
type: concept
title: SafeOwnerCondition
tags: [permissions]
source: condition-library/src/SafeOwnerCondition.sol, condition-library/src/interfaces/IOwnerManager.sol
---

# SafeOwnerCondition

`SafeOwnerCondition` restricts a permission to the **current owners of a given [Safe](https://safe.global)**. Grant a DAO permission to any address with this condition attached, and only that Safe's owners can actually use it. It's part of the [condition library](/helpers/condition-library.md).

## When to use it

When a group already coordinates through a Safe and you want that same group to hold a DAO permission, without re-listing them in the DAO. It **bridges an existing Safe's membership into OSx permissions**: the Safe stays the single source of truth for "who's in the group," and the DAO permission follows it.

## What it checks

Its [`isGranted`](/common/permission-conditions.md) asks the Safe, live, whether the caller is an owner:

```solidity
(bool ok, bytes memory res) = safe.staticcall(isOwner(_who));
return ok && res.length == 32 && abi.decode(res, (bool));
```

- **It's evaluated on every call**, so it always reflects the Safe's *current* owners: add or remove an owner on the Safe and who can use the DAO permission changes immediately, with no action on the DAO side.
- It reads **`who`** (the caller being authorized), so pairing it with an [`ANY_ADDR`](/core/permissions.md#the-wildcard-any_addr) grant yields exactly "any current Safe owner."
- It [fails closed](/common/permission-conditions.md): if the Safe call reverts or returns something malformed, the answer is "not an owner."

## Configuration

| | |
|---|---|
| Constructor | `(IOwnerManager _safe)` — the Safe to read ownership from; validated at deploy by a shape-check that it answers `isOwner` (else `InvalidSafe`) |
| Mutable? | No. `safe` is set once, no setter, no admin permission. To target a different Safe, deploy a new condition. |

It intentionally has **no management permission**, there's nothing to configure after deployment; the "list" lives on the Safe.

## Keep in mind

- **The Safe governs this permission.** Whoever can change the Safe's owners can change who holds the DAO permission, with immediate effect and no DAO vote. That's the feature, but be deliberate: you're delegating that authority to the Safe.
- **Immutably bound to one Safe.** Re-targeting means a fresh deployment and re-grant.
- **The shape-check is not an identity proof.** Deploy-time validation only confirms the target answers `isOwner(address)` with 32 bytes; *any* contract with that signature passes. Binding to a non-Safe that merely looks like one isn't caught, point it at a genuine Safe.

## See also

- [Condition Library](/helpers/condition-library.md) — the library overview and the factory.
- [Permission conditions](/common/permission-conditions.md) — how a condition is consulted, and fail-closed semantics.
