---
type: concept
title: The permission system
tags: [permissions, security]
source: osx/src/core/permission/PermissionManager.sol, osx/src/common/permission/PermissionLib.sol
---

# The permission system

Every privileged action in Aragon OSx, a DAO admin function, a plugin function, even framework contracts like [PluginRepo](../framework/plugin-repo.md), is gated by **one** mechanism: the `PermissionManager`. Learn this model and the whole protocol's access control follows.

A permission is a triple, optionally guarded by a [condition](../common/permission-conditions.md):

```
(where, who, permissionId)  ->  allowed? / denied? / ask a condition
```

- **`where`** — the contract the action happens *on* (usually the DAO itself, or a plugin).
- **`who`** — the caller being authorized (an EOA or a contract).
- **`permissionId`** — `keccak256("SOME_PERMISSION")`, naming the capability (e.g. `EXECUTE_PERMISSION_ID`).

The [DAO](./dao.md) *is* a `PermissionManager` (it inherits it), so a DAO's permissions live in the DAO contract's own storage. Plugins don't inherit it; they defer to their DAO, see [Authorizing against a DAO](../common/auth.md).

## How a decision is made

The core query is:

```solidity
function isGranted(address _where, address _who, bytes32 _permissionId, bytes _data)
    public view returns (bool);
```

`isGranted` *is* the resolver. The DAO's [`IDAO`](../common/auth.md) interface re-exposes the identical query as **`hasPermission`**, a one-line forwarder to it, so external callers and every plugin's [`auth`](../common/auth.md) check call `hasPermission` while the engine underneath is this `isGranted`, same arguments, same answer. (Don't confuse either with a **condition's** `isGranted`: that's a different method sharing the signature, the *hook* this resolver calls when a grant is [conditional](../common/permission-conditions.md), not the resolver itself.)

Internally each grant is stored under a hash of `(where, who, permissionId)` mapping to one of three things:

- **unset** (`address(0)`) — not granted.
- **allow** (`address(2)`) — granted unconditionally.
- **a condition contract address** — ask that [condition](../common/permission-conditions.md) at call time.

(Why an address, not a bool? The slot has to hold a *condition contract address* for the conditional case, so the two non-conditional outcomes reuse the same slot as reserved sentinel addresses: `address(0)` = unset, `address(2)` = allow-without-condition.)

`isGranted` resolves in **three tiers, first match wins**:

1. **Specific:** `(where, who, permissionId)`.
2. **Any caller:** `(where, ANY_ADDR, permissionId)` — "anyone, on this target".
3. **Any target:** `(ANY_ADDR, who, permissionId)` — "this caller, anywhere". Only reachable via a condition (see below).

If none is set, the answer is `false`.

> **The tiers do not merge, and this trips people up.** If the *specific* slot is set but its condition returns `false`, `isGranted` returns `false` immediately, it does **not** fall through to a broader tier that might have allowed it. Whichever tier is set first (specific → any-caller → any-target) decides the outcome outright. A wildcard grant and a specific grant coexist as separate entries; they do not override or combine.

## The wildcard: `ANY_ADDR`

`ANY_ADDR` is `address(type(uint160).max)` (all F's) and stands for "any address" in the `who` or `where` slot. The rules that keep it safe:

- A plain `grant` can **never** set `where == ANY_ADDR`, only [`grantWithCondition`](../common/permission-conditions.md) can. ("This caller, on any contract" is only allowed if a condition constrains it.)
- `who` **and** `where` can't both be `ANY_ADDR` at once (that would be "anyone, anywhere").
- `ROOT_PERMISSION_ID` can never go to `ANY_ADDR`, ever, no override.
- Individual contracts blacklist their own sensitive permissions from wildcard grants by overriding `isPermissionRestrictedForAnyAddr` (the [DAO](./dao.md) restricts `EXECUTE`, `UPGRADE_DAO`, and three others).

## ROOT: the permission to manage permissions

`ROOT_PERMISSION_ID` gates `grant`, `grantWithCondition`, `revoke`, and the batch apply functions. Holding ROOT on a `where` means you can grant or revoke every permission on that contract.

**ROOT is not a runtime bypass**, and this catches people. It does *not* make you pass *other* permission checks: `isGranted` never consults ROOT, so a ROOT holder who lacks `EXECUTE` still cannot call `execute` directly. What ROOT lets you do is **grant yourself** (or anyone) that permission first, then use it. It's god-mode over the permission *table*, not a skeleton key at call time, the same reason a plugin upgrade needs `UPGRADE_PLUGIN_PERMISSION` explicitly rather than riding on ROOT. (A condition attached to your ROOT grant constrains that granting power itself; it never enters the `EXECUTE` check, which ignores ROOT regardless.)

In a healthy DAO, **ROOT is held by the DAO itself**, so permission changes happen only through governance (a proposal that executes a `grant`/`revoke`). See the [DAO](./dao.md#deployment-and-bootstrapping-root) bootstrapping note for how ROOT gets there safely.

## Granting and revoking

All of these require the caller to hold `ROOT_PERMISSION_ID` on the target:

```solidity
grant(where, who, permissionId);                       // unconditional
grantWithCondition(where, who, permissionId, condition); // guarded, see conditions
revoke(where, who, permissionId);
```

A few semantics:

- **Idempotent, and that cuts both ways.** Granting an already-granted permission is a silent no-op (no revert, no new event); same for revoking an unset one. In particular, a plain `grant` over a permission that is currently *conditional* is **also** a no-op: it does **not** strip the condition down to unconditional-allow. Trying to "remove a condition" by re-granting plainly leaves the old condition fully in force, silently. To drop or change a condition you must `revoke` first, then re-grant (see the rotation note below).
- **Conditions are immutable once set.** `grantWithCondition` on a permission already granted with a *different* condition **reverts** (`PermissionAlreadyGrantedForDifferentCondition`). To change a condition you must `revoke` first, then re-grant. This stops a second ROOT holder from silently swapping the condition out. **Consequence:** that `revoke` drops the entry to *unset*, so, unless a broader [wildcard tier](#the-wildcard-any_addr) still covers that caller, the permission is **denied in the gap between the two calls**. Rotate a condition by putting the `revoke` and the re-`grantWithCondition` in the *same* [action batch](./execution.md) (one proposal), never two transactions, or you flicker the permission off mid-flight.

### Batch changes: `PermissionLib`

Setups and factories rarely grant one at a time. `PermissionLib` defines the payload shapes for batch operations, and the [plugin setup](../framework/plugin-setup.md) flow is built entirely on them:

```solidity
enum Operation { Grant, Revoke, GrantWithCondition }

struct SingleTargetPermission { Operation operation; address who; bytes32 permissionId; }
struct MultiTargetPermission  { Operation operation; address where; address who; address condition; bytes32 permissionId; }
```

- `applySingleTargetPermissions(where, SingleTargetPermission[])` — many changes on one target; grant/revoke only (no conditions).
- `applyMultiTargetPermissions(MultiTargetPermission[])` — changes across many targets, conditions supported. A conditional grant here **must** use the `GrantWithCondition` op: a plain `Grant` op carrying a non-zero `condition` reverts `GrantWithConditionNotSupported`, rather than silently granting unconditionally. So a hand-built [setup](../framework/plugin-setup.md) array can't accidentally look conditional while granting a wide-open permission.

`MultiTargetPermission[]` is exactly what a [plugin setup](../framework/plugin-setup.md) returns and what the [PluginSetupProcessor](../framework/plugin-setup-processor.md) applies when installing a plugin.

## Checking permissions from your own contract

If your contract inherits `PermissionManager` (or is a DAO), gate a function with the `auth` modifier:

```solidity
function doPrivileged() external auth(DO_PRIVILEGED_PERMISSION_ID) { ... }
```

`auth` calls `isGranted(address(this), msg.sender, permissionId, msg.data)` and reverts `Unauthorized` if false. Because the full `msg.data` is passed through, a [condition](../common/permission-conditions.md) attached to that permission can inspect the exact call arguments. Plugins gate their functions the same way but resolve against their DAO, through a **same-named** `auth` from [`DaoAuthorizable`](../common/auth.md#which-auth-unauthorized-vs-daounauthorized) that reverts **`DaoUnauthorized`** (carrying a `dao` field) instead of this `Unauthorized`.

## Keep in mind

- **The three tiers don't merge.** A specific grant guarded by a condition that returns false is denied outright, it does *not* fall through to a broader wildcard grant that would have said yes. Turn this around and it's a *tool*: a specific grant **carves one caller out** of a wildcard. Grant `(where, ANY_ADDR, perm)` so everyone may act, then add `(where, alice, perm)` with a restrictive condition, and alice alone is held to the stricter rule while everyone else rides the wildcard (or the reverse, a permissive carve-out under a conditioned wildcard).
- **Conditions fail closed.** A condition that reverts or misbehaves counts as "denied", never as an error.
- **ROOT with an EOA is total control.** Whoever holds ROOT can rewrite every permission; in a healthy DAO that is the DAO itself.
- **Grants are idempotent and silent.** Re-granting an existing permission emits no new event, don't rely on `Granted` firing.
- **The permission DB is a public authorization service, not just an internal ACL.** `isGranted` / `hasPermission` are `view` and callable by anyone, so *other* contracts can gate themselves on a DAO's permissions without the DAO's involvement, which is exactly how [EIP-1271 signature validation](./signature-validation.md) and every plugin's [`auth`](../common/auth.md) already work. A permission is a queryable fact the whole chain can build on, which is why "who may do what on this DAO" is reusable far beyond the DAO's own functions.

## See also

- [Permission conditions](../common/permission-conditions.md) — dynamic, on-chain authorization logic.
- [Authorizing against a DAO](../common/auth.md) — how plugins use this system.
- [The DAO contract](./dao.md) — the primary `PermissionManager` instance.
