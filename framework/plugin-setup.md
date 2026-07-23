---
type: concept
title: Plugin setup
tags: [plugin-framework]
source: osx/src/common/plugin/setup/IPluginSetup.sol, osx/src/common/plugin/setup/PluginSetup.sol, osx/src/common/plugin/setup/PluginUpgradeableSetup.sol
---

# Plugin setup

Think of a plugin setup as a **factory that deploys a plugin on the caller's behalf and makes sure all its inner dependencies are wired up correctly**, the contract, its helper contracts, and the permissions that connect them to the DAO. Given a DAO and some parameters, it produces a fully-formed, ready-to-run plugin installation.

Installing a plugin is more than deploying one contract, which is why the factory needs to be this deliberate. The plugin usually needs **permissions** on its DAO (to execute proposals, say), sometimes needs **helper contracts** deployed alongside it (a token, a condition), and later needs a clean way to be updated or uninstalled. A **plugin setup** encapsulates all of that for one plugin version.

Why not just wire it by hand? You *could* deploy a plugin and grant its permissions one call at a time, but that's precisely the kind of multi-step, order-sensitive work where one missed or mis-ordered grant leaves a DAO half-configured, a plugin that can't execute, or a stray permission left dangling. A setup instead bundles the **complete, consistent** set of changes for a version so the [PluginSetupProcessor](./plugin-setup-processor.md) applies them as a single atomic step: all of it lands or none of it does, and the DAO is in a clean, fully-wired state both before and after.

**A setup is declarative.** It does not mutate the DAO. It *deploys* the plugin and its helpers and *returns a description* of the permission changes required, applying nothing itself. Whether and when to apply them is a **governance decision**: a permitted caller (in a healthy DAO, a passed proposal) drives the [PluginSetupProcessor](./plugin-setup-processor.md), which then applies exactly what was prepared, under permission control. The PSP is the mechanism, not the decider. This separation is what makes installation reviewable by governance instead of a blind trust in the plugin author (see [why two steps](./plugin-setup-processor.md#why-prepare-and-apply-are-separate)).

## What a setup implements

A setup implements `IPluginSetup`'s three lifecycle functions plus `implementation()`:

```solidity
function prepareInstallation(address _dao, bytes calldata _data)
    external returns (address plugin, PreparedSetupData preparedSetupData);

function prepareUpdate(address _dao, uint16 _fromBuild, SetupPayload calldata _payload)
    external returns (bytes memory initData, PreparedSetupData preparedSetupData);

function prepareUninstallation(address _dao, SetupPayload calldata _payload)
    external returns (PermissionLib.MultiTargetPermission[] memory permissions);
```

The two structs that flow through the framework:

```solidity
struct PreparedSetupData {
    address[] helpers;                              // auxiliary contracts this version needs
    PermissionLib.MultiTargetPermission[] permissions; // what to grant/revoke on the DAO
}
struct SetupPayload {
    address plugin;          // the already-installed plugin instance
    address[] currentHelpers; // helpers from the previous prepare, round-tripped back
    bytes data;              // operation-specific ABI-encoded input
}
```

- **`prepareInstallation`** deploys the plugin (via `new`, clone, or UUPS proxy, matching the [plugin type](./plugin-types.md)) and returns the [permissions](../core/permissions.md#batch-changes-permissionlib) the DAO must grant. `_data` is your plugin's install parameters, ABI-encoded; its shape is documented in the version's [build metadata](./plugin-metadata.md) (not enforced on-chain), so decode it yourself.
- **`prepareUninstallation`** returns the permissions to *revoke*.
- **`prepareUpdate`** (upgradeable plugins only) returns the `initData` the PSP will use when upgrading the proxy, e.g. a call to a re-initializer that migrates from `_fromBuild`.

**Helpers** are the mechanism for stateful, multi-contract plugins. Whatever addresses a `prepareInstallation` returns as `helpers` are tracked by the PSP and handed back (as `currentHelpers`) on the next update/uninstall, so the setup can act on the exact contracts it deployed earlier. Their order matters: it's hashed, see [the PSP's bookkeeping](./plugin-setup-processor.md#setup-ids-what-keeps-apply-honest).

## Two setup bases

Match the base to your [plugin type](./plugin-types.md):

- **`PluginSetup`** — for non-upgradeable plugins (`Plugin` / `PluginCloneable`). It pre-implements `prepareUpdate` to always revert `NonUpgradeablePlugin()`, since there's no in-place update path, so you only write install/uninstall.
- **`PluginUpgradeableSetup`** — for `PluginUUPSUpgradeable` plugins. You must implement all three prepares. The convention for an unsupported update path is to revert `InvalidUpdatePath(fromBuild, thisBuild)`.

Both expose `implementation()`, the logic contract this setup deploys from (the UUPS/clone implementation, or, for `new`-deployed plugins, mainly a reference for block-explorer verification).

## The pattern in practice

One setup contract corresponds to one `(release, build)` version in a [PluginRepo](./plugin-repo.md), and it typically owns exactly one immutable logic contract, deployed once in the setup's constructor and reused by every install of that build:

```solidity
contract MyPluginSetup is PluginUpgradeableSetup {
    constructor() PluginUpgradeableSetup(address(new MyPlugin())) {}

    function prepareInstallation(address _dao, bytes calldata _data)
        external returns (address plugin, PreparedSetupData memory prepared)
    {
        MyInstallParams memory p = abi.decode(_data, (MyInstallParams));
        plugin = implementation().deployUUPSProxy(          // see /common/proxies.md
            abi.encodeCall(MyPlugin.initialize, (IDAO(_dao), p))
        );
        // Describe (do not apply) the permissions the DAO must grant. `_installPermissions`
        // here is a stand-in: it returns a PermissionLib.MultiTargetPermission[] of Grants.
        // See "Build a plugin" for that array written out in full.
        prepared.permissions = _installPermissions(_dao, plugin);
        // prepared.helpers = ...any auxiliary contracts...
    }
    // prepareUninstallation returns the mirror-image Revoke permissions
    // prepareUpdate branches on _fromBuild, or reverts InvalidUpdatePath
}
```

Fresh installs run `initialize`; in-place updates run a re-initializer (`initializeFrom`) with the `initData` your `prepareUpdate` returns. For a complete setup with the permission arrays and `prepareUninstallation` written out (no stand-ins), see the [Build a plugin](../guides/build-a-plugin.md) guide.

## Keep in mind

- **Decode `_data` yourself, correctly.** The install parameters' shape is documented in the version's build metadata, not enforced on-chain. Decode exactly what your plugin expects; a mismatch silently misconfigures the install. The pattern to copy: expose public `encodeInstallationParams` / `decodeInstallationParams` helpers on your setup (as the [Token Voting Plugin](../plugins/token-voting-plugin.md) setup does) so off-chain callers and the setup agree on the encoding in one place.
- **Helper order is significant.** Return helpers in a stable order and supply `currentHelpers` in that same order on update/uninstall, the [PSP hashes them as an ordered array](./plugin-setup-processor.md#setup-ids-what-keeps-apply-honest).

## See also

- [PluginSetupProcessor](./plugin-setup-processor.md) — consumes these setups; the two-step apply.
- [PluginRepo](./plugin-repo.md) — where each setup is published as a version.
- [The permission system](../core/permissions.md) — the `MultiTargetPermission[]` a setup returns.
- [Plugin Template (Foundry)](../tooling/plugin-template.md) — the template repo that scaffolds a plugin + setup.
