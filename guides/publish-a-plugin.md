---
type: guide
title: Publish a plugin to a PluginRepo
source: osx/src/framework/plugin/repo/PluginRepoFactory.sol, osx/src/framework/plugin/repo/PluginRepo.sol
---

# Publish a plugin to a PluginRepo

You [built a plugin and its setup](./build-a-plugin.md). The canonical way to make it installable is to **publish** it to a [PluginRepo](../framework/plugin-repo.md): the versioned install / update / uninstall lifecycle the [PSP](../framework/plugin-setup-processor.md) drives all keys off a published version, applying the setup's permissions atomically. (A DAO *can* always wire a plugin in by hand instead, deploy it and grant the permissions directly through governance, but publishing is what buys you versioning, the setup guardrails, and a clean uninstall, so it's the idiomatic, recommended path and almost certainly what you want.) A PluginRepo is a versioned registry for **one** plugin: every entry is a `PluginSetup` address plus its [metadata](../framework/plugin-metadata.md), tagged with a `(release, build)`, and that tag is exactly what [Deploy your first DAO](./deploy-a-dao.md) and [Install a plugin](./install-a-plugin.md) reference. This guide creates the repo with a first version, then cuts later versions.

## What you need

The one-time [Setup](./setup.md), plus:
- The **`PluginRepoFactory`** address (`PLUGIN_REPO_FACTORY_ADDRESS`).
- Your compiled `MyPluginSetup` (from [Build a plugin](./build-a-plugin.md)).
- Two [metadata](../framework/plugin-metadata.md) blobs on IPFS (a **build** JSON documenting your install-data ABI, and a **release** JSON); you pass their `ipfs://…` pointers, not the JSON.

## Step 1, create the repo and its first version

`PluginRepoFactory.createPluginRepoWithFirstVersion` does it all in one call: deploys the repo, registers its ENS **subdomain** in the [PluginRepoRegistry](../framework/plugin-repo-registry.md), publishes version **(release 1, build 1)**, i.e. `1.1`, and grants your `maintainer` the repo permissions, including the `MAINTAINER_PERMISSION` that gates future publishing (plus repo-upgrade and root rights over the repo).

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Test} from "forge-std/Test.sol";
import {PluginRepo} from "@aragon/osx/framework/plugin/repo/PluginRepo.sol";
import {PluginRepoFactory} from "@aragon/osx/framework/plugin/repo/PluginRepoFactory.sol";
import {MyPluginSetup} from "../src/setup/MyPluginSetup.sol";

contract PublishPlugin is Test {
    PluginRepoFactory repoFactory = PluginRepoFactory(vm.envAddress("PLUGIN_REPO_FACTORY_ADDRESS"));

    function test_publish() public {
        vm.createSelectFork(vm.envString("RPC_URL"));

        address pluginSetup = address(new MyPluginSetup()); // your setup = one repo version
        address maintainer  = address(this);

        PluginRepo repo = repoFactory.createPluginRepoWithFirstVersion({
            _subdomain: "my-plugin",                    // unique ENS label; a-z, 0-9, '-'
            _pluginSetup: pluginSetup,
            _maintainer: maintainer,                    // receives MAINTAINER_PERMISSION on the repo
            _releaseMetadata: bytes("ipfs://<release-cid>"),
            _buildMetadata: bytes("ipfs://<build-1-cid>")
        });

        // repo now holds version 1.1; any DAO can install it by (repo, tag {release:1, build:1}).
    }
}
```

The subdomain must be unique and lowercase (the [registry charset](../framework/registries.md)); if it's taken, the call reverts. The factory also verifies your `pluginSetup` really implements the setup interface, a non-setup address is rejected.

## Step 2, publish later versions

Once the repo exists, the maintainer cuts new versions with `createVersion`. You choose the **release**; the repo assigns the **build** number itself (you don't pass it):

```solidity
// A new BUILD: a backward-compatible change. Same release, the repo bumps the build to 1.2, 1.3, ...
repo.createVersion({
    _release: 1,
    _pluginSetup: address(new MyPluginSetupV2()),
    _buildMetadata: bytes("ipfs://<build-2-cid>"),
    _releaseMetadata: bytes("")   // unchanged on a pure build
});

// A new RELEASE: an incompatible change. _release must be exactly latestRelease + 1; build restarts at 1.
repo.createVersion({
    _release: 2,
    _pluginSetup: address(new MyPluginSetupV2()),
    _buildMetadata: bytes("ipfs://<build-cid>"),
    _releaseMetadata: bytes("ipfs://<release-2-cid>")
});
```

`createVersion` is `auth(MAINTAINER_PERMISSION_ID)`, so only the maintainer (or whoever they grant it to) can publish. A **release** must increment by exactly one (`InvalidReleaseIncrement` otherwise), and the [release-vs-build distinction](../framework/plugin-repo.md#release-vs-build) is the contract you make with installers: a new **build** is an in-place [update](./update-a-plugin.md); a new **release** signals incompatibility, so moving to it is an uninstall + reinstall.

## What you just saw

- A PluginRepo is a **versioned registry for one plugin**; a version is a `PluginSetup` + metadata at a `(release, build)` tag.
- `createPluginRepoWithFirstVersion` bootstraps the repo, its ENS name, version `1.1`, and the maintainer permission in one call.
- **Build** = compatible (installs as an update); **release** = incompatible (increment by one; reinstall). The repo assigns build numbers; you pick releases.

## Next

- [Update a plugin](./update-a-plugin.md), how a DAO moves to the new build you just published.
- Back to the [guides index](./index.md) for the full path, or the concept graph starting at [the plugin framework](../framework/index.md).
