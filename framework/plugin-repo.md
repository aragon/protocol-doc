---
type: concept
title: PluginRepo (versioning & publishing)
tags: [core, plugin-framework, upgradeability]
source: osx/src/framework/plugin/repo/PluginRepo.sol, osx/src/framework/plugin/repo/IPluginRepo.sol, osx/src/framework/plugin/repo/PluginRepoFactory.sol
---

# PluginRepo (versioning & publishing)

A `PluginRepo` is the on-chain home of **one plugin across all its versions**. Every version a plugin author ships is an immutable entry here, mapping a version tag to the [plugin setup](/framework/plugin-setup.md) that installs it plus its metadata. When a DAO installs "MyPlugin v1.3", the [PSP](/framework/plugin-setup-processor.md) resolves that request against MyPlugin's repo. A specific version is named by a **`PluginSetupRef`**, the pair `(pluginSetupRepo, version Tag)`, and that ref is exactly what the [PSP](/framework/plugin-setup-processor.md) and [DAOFactory](/framework/dao-factory.md) take to know which setup to run.

A repo is itself a UUPS proxy, and, notably, **it is its own [`PermissionManager`](/core/permissions.md)**: maintainers govern the repo through the same permission model DAOs use, independent of any DAO.

## Release vs build

Versions are `release.build` tags, and the distinction is the whole point of the versioning model:

```solidity
struct Tag { uint8 release; uint16 build; }
struct Version { Tag tag; address pluginSetup; bytes buildMetadata; }
```

- **`build`** — a *compatible* change: a patch, or a feature that doesn't break existing installs. Builds increment automatically (1, 2, 3, …) within a release. An installed plugin can [update](/framework/plugin-setup-processor.md) to a higher build of the same release in place.
- **`release`** — an *incompatible* change: different interface, storage layout, or behavior. A new release starts its build numbering over.

A version reads as **`release.build`** (`1.4` = release 1, build 4), and the consumer rule of thumb falls out of the two definitions: **always take the latest *build*** of whatever release you run (builds are compatible, so a newer one is strictly better, fixes and compatible features), but you may deliberately stay on an **older *release*** if you prefer its feature set or behaviour, moving release is an opt-in, breaking migration, not a free upgrade.

This is why the [PSP forbids updates across releases](/framework/plugin-setup-processor.md#the-three-lifecycles): a release boundary *means* "not a drop-in replacement," so crossing it is an uninstall + reinstall, not an in-place upgrade. Choosing release vs build correctly is a contract you make with every DAO running your plugin.

## Publishing versions

`createVersion` (gated by `MAINTAINER_PERMISSION_ID`) adds a version. Its rules encode the model's guarantees:

- The setup must advertise `IPluginSetup` via ERC-165 (`InvalidPluginSetupInterface`).
- Release `0` is not allowed; releases must increase by exactly `1` (`InvalidReleaseIncrement`), no gaps.
- A given setup contract can belong to only one release (`PluginSetupAlreadyInPreviousRelease`).
- Starting a new release requires non-empty release metadata.

The repo's own upgrades are gated by `UPGRADE_REPO_PERMISSION_ID`, and both maintainer and upgrade permissions are blocked from `ANY_ADDR` grants (a compromise would propagate to every DAO consuming the repo).

## Publishing a plugin: `PluginRepoFactory`

You don't deploy a `PluginRepo` by hand. `PluginRepoFactory` does it and registers the repo in the [PluginRepoRegistry](/framework/registries.md) (which assigns its ENS name):

- **`createPluginRepo(subdomain, initialOwner)`** — an empty repo owned by `initialOwner`, no versions yet.
- **`createPluginRepoWithFirstVersion(subdomain, pluginSetup, maintainer, releaseMetadata, buildMetadata)`** — the common path: deploys the repo, publishes version **1.1** (the first published version is always **1.1**, not 1.0: version **0** is the reserved "nothing published yet" state, and release and build each begin at 1), and hands full ownership (`MAINTAINER`, `UPGRADE_REPO`, `ROOT`) to `maintainer` while the factory relinquishes everything.

An empty subdomain reverts, every repo gets an ENS name (see [registries](/framework/registries.md)).

> **Placeholders.** When migrating a repo to a new chain where only the latest build should be usable, the build-number history still has to be preserved (builds are sequential). A `PlaceholderSetup` (a setup that always reverts if you try to install it) fills the gaps so the real latest build lands on the correct build number.

## Keep in mind

- **Release vs build is a promise to every DAO on your plugin.** A new *build* must be a drop-in for the same release (installable as an in-place update); anything that changes interface, storage, or behavior is a new *release*. Misclassify an incompatible change as a build and you break in-place updates for everyone.

## See also

- [Plugin setup](/framework/plugin-setup.md) — what each version points at.
- [PluginSetupProcessor](/framework/plugin-setup-processor.md) — resolves versions from repos at install time.
- [Registries](/framework/registries.md) — where repos are registered and named.
- [The permission system](/core/permissions.md) — a repo is its own PermissionManager.
