---
type: concept
title: Authorizing against a DAO
tags: [permissions, plugin-framework]
source: osx/src/common/permission/auth/DaoAuthorizable.sol, osx/src/common/permission/auth/DaoAuthorizableUpgradeable.sol, osx/src/common/permission/auth/auth.sol
---

# Authorizing against a DAO

A [plugin](/framework/plugins.md) does **not** keep its own access-control list. It defers every authorization decision to its DAO's [permission system](/core/permissions.md). `DaoAuthorizable` is the small base contract that wires that up, and it is where the plugin-to-DAO coupling lives.

## The pattern

Inherit `DaoAuthorizable` (or its upgradeable variant), store a reference to your DAO, and gate functions with the `auth` modifier:

```solidity
contract MyPlugin is DaoAuthorizableUpgradeable {
    bytes32 public constant DO_THING_PERMISSION_ID = keccak256("DO_THING_PERMISSION");

    function initialize(IDAO _dao) external initializer {
        __DaoAuthorizableUpgradeable_init(_dao);
    }

    function doThing() external auth(DO_THING_PERMISSION_ID) {
        // only callers the DAO has granted DO_THING_PERMISSION_ID on this plugin
    }
}
```

The `auth(permissionId)` modifier calls:

```solidity
dao().hasPermission(
    address(this),   // where = the plugin
    _msgSender(),    // who   = the caller
    permissionId,
    _msgData()       // data  = full calldata, available to a condition
);
```

and reverts `DaoUnauthorized` if the DAO says no. So **the plugin is the `where`** and its DAO is the authority. To let Alice call `doThing`, the DAO's ROOT holder grants `(myPlugin, alice, DO_THING_PERMISSION_ID)`, see [granting](/core/permissions.md#granting-and-revoking).

This is also how a governance plugin becomes able to act: the DAO grants the plugin `EXECUTE_PERMISSION_ID` on the DAO, so the plugin may call [`dao.execute(...)`](/core/execution.md).

## Two variants

| | `DaoAuthorizable` | `DaoAuthorizableUpgradeable` |
|---|---|---|
| For | non-upgradeable contracts (`new`) | proxy-based contracts (clones, UUPS) |
| DAO stored as | `immutable`, set in constructor | storage var, set in initializer |
| Wire-up | `constructor(IDAO _dao)` | `__DaoAuthorizableUpgradeable_init(_dao)` |

Pick the one matching your [plugin type](/framework/plugin-types.md). The three plugin base contracts already inherit the right variant, so you normally get `auth` for free by extending a plugin base.

Both are meta-transaction aware (they use OpenZeppelin `Context`'s `_msgSender()`/`_msgData()`), so they work behind an ERC-2771 trusted forwarder.

## Keep in mind

- **Forgetting `__DaoAuthorizableUpgradeable_init(_dao)`** in your `initialize` leaves the DAO reference at `address(0)`, so every `auth` check calls `address(0).hasPermission(...)` and reverts. If a freshly installed plugin reverts on every gated call, check the init.
- **The plugin is the `where`.** Permissions on a plugin's functions are keyed to the plugin's address, not the DAO's; grant on the plugin, not on the DAO.

## See also

- [The permission system](/core/permissions.md) — what `hasPermission` resolves.
- [Permission conditions](/common/permission-conditions.md) — the `_msgData()` passed through lets a condition inspect call arguments.
- [Choosing a plugin base](/framework/plugin-types.md) — which variant you inherit.
