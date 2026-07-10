---
type: concept
title: Plugin metadata
tags: [plugin-framework, metadata]
source: multisig-plugin/packages/contracts/src/build-metadata.json, multisig-plugin/packages/contracts/src/release-metadata.json, osx/src/common/utils/metadata/MetadataExtension.sol
---

# Plugin metadata

A plugin carries metadata at two levels, for two different audiences, by two different mechanisms:

- **Version metadata** (off-chain JSON) describes a *published version* in a [PluginRepo](/framework/plugin-repo.md): what the plugin is, and, crucially, *how to install it*. Consumed by UIs and install scripts.
- **Instance metadata** (on-chain, via `MetadataExtension`) is a *specific installed plugin's* own metadata. Consumed by whoever reads that instance.

Keeping them straight matters because they live in different places and only one is a JSON file you author.

## Version metadata: the JSON a repo version points to

When a version is published with [`createVersion`](/framework/plugin-repo.md), the on-chain repo stores a **pointer** to two JSON files, an `ipfs://<CID>` URI each, **not** the JSON itself; the documents live off-chain (IPFS) and only their content-addressed URI is on-chain.

**`release-metadata.json`** — per *release*, human/UI facing:

```json
{ "name": "Multisig", "description": "", "images": {} }
```

**`build-metadata.json`** — per *build*, and the load-bearing one, it declares the **input schema for the [plugin setup](/framework/plugin-setup.md)**:

```json
{
  "name": "multisig",
  "change": "v1.3\n - Removed an unnecessary permission …",
  "pluginSetup": {
    "prepareInstallation": {
      "description": "The information required for the installation.",
      "inputs": [
        { "name": "members", "type": "address[]", "description": "The initial members." },
        { "name": "multisigSettings", "type": "tuple",
          "components": [ { "name": "onlyListed", "type": "bool", … },
                          { "name": "minApprovals", "type": "uint16", … } ] },
        { "name": "TargetConfig", "type": "tuple", … },
        { "name": "metadata", "type": "bytes", … }
      ]
    },
    "prepareUpdate": { "3": { "inputs": [ … ] } },
    "prepareUninstallation": { "inputs": [] }
  }
}
```

- `change` — this build's changelog.
- `pluginSetup.prepareInstallation.inputs` — the ABI schema, **with a `description` per field**, of exactly the `_data` the setup's [`prepareInstallation`](/framework/plugin-setup.md) decodes. This is the **contract between an off-chain encoder and the setup**: the install `_data` is ABI-encoded and *not* self-describing on-chain, so this schema is how a UI or script knows what to encode (and how a reviewer reads what an install will configure). `prepareUpdate` inputs are keyed by the *source build* you're updating from; `prepareUninstallation` likewise.

This is why the [plugin setup](/framework/plugin-setup.md) page says "decode `_data` yourself, its shape is documented in build metadata, not enforced on-chain." **Build metadata is that documentation.** If it drifts from what your setup actually decodes, tools build a wrong payload and the install misconfigures silently, so treat the schema as part of the contract, not a description written after the fact.

## Instance metadata: `MetadataExtension`

Separate from the version JSON, each *deployed* plugin carries its **own** metadata for the UI to show, describing *this installation* (this particular multisig's name/notes), not the plugin line. A plugin gets it by mixing in `MetadataExtension`: `setMetadata(bytes)` (gated by `SET_METADATA_PERMISSION_ID`), `getMetadata()`, and a `MetadataSet` event. Unlike the [DAO's metadata](/core/dao-metadata.md) (event-only), `MetadataExtension` **stores** the bytes, so `getMetadata()` returns the current value on-chain.

**Where it comes from:** it's the plugin's **`metadata` install parameter**, the `bytes` field you'll see as the last input in the `build-metadata` above (`"The metadata that contains the information about the plugin"`). The setup passes it into the plugin's `initialize`, which stores it via `_setMetadata(...)` (the [Multisig](/plugins/multisig-plugin.md) plugin does exactly this). Like every metadata value in OSx it's an **`ipfs://<CID>` pointer**, not inline, resolving to freeform, UI-facing JSON. There's **no enforced schema** (it's whatever your UI reads); conventionally something like:

```json
{ "name": "Core-team multisig", "description": "3-of-5 signers for treasury operations." }
```

Change it any time with `setMetadata` (through governance, since it's `SET_METADATA_PERMISSION_ID`). It's per-instance state, independent of the version JSON that is identical for every install of that build.

## A minimal skeleton to copy

`release-metadata.json` (per release):

```json
{ "name": "My Plugin", "description": "One-line summary of the plugin.", "images": {} }
```

`build-metadata.json` (per build), replace the single input with your own:

```json
{
  "ui": {},
  "name": "my-plugin",
  "description": "What this build does.",
  "change": "v1.1 — initial release.",
  "pluginSetup": {
    "prepareInstallation": {
      "description": "Installation parameters.",
      "inputs": [
        {
          "name": "admin",
          "type": "address",
          "internalType": "address",
          "description": "The initial admin address."
        }
      ]
    },
    "prepareUpdate": {},
    "prepareUninstallation": { "description": "No inputs required.", "inputs": [] }
  }
}
```

Pin each file with `just ipfs-pin <file>` (it uploads and returns the `ipfs://<CID>` URI); those two URIs are what you hand to [`createVersion`](/framework/plugin-repo.md) when publishing the version.

## Generating `prepareInstallation.inputs` with Foundry

The `inputs` array is just the ABI of your install `_data`, and hand-writing it is exactly where it drifts from the code. Keep them in lockstep by exposing a public helper on your setup whose parameters mirror what `prepareInstallation` `abi.decode`s (the [Token Voting setup](/plugins/token-voting-plugin.md) does this with `encodeInstallationParameters(...)`):

```solidity
function encodeInstallationParameters(MySettings memory s, address admin)
    external pure returns (bytes memory) { return abi.encode(s, admin); }
```

Then let Foundry emit that function's ABI and lift its `inputs`:

```sh
forge inspect MyPluginSetup abi --json \
  | jq '.[] | select(.name=="encodeInstallationParameters") | .inputs'
```

Paste the result into `build-metadata.json` under `pluginSetup.prepareInstallation.inputs`, then add a human `description` to each field (the ABI doesn't carry those). Because the schema is generated from the same signature the setup encodes and decodes, it can't silently drift from the contract, the exact failure the [setup page](/framework/plugin-setup.md) warns about.

This helper is a **convention Aragon pushes, not something the framework enforces**, plenty of setups don't expose one. When it's absent you hand-write `inputs` to match your `abi.decode`, and the drift risk is back on you (which is precisely why adding the helper is worth it).

## Keep in mind

- **`build-metadata.json` is a contract, not a footnote.** Its `prepareInstallation.inputs` must match what your setup decodes; a mismatch silently misconfigures installs. It's what makes your plugin installable from a UI.
- **Version JSON is off-chain.** The repo stores only its hash/URI; keep the files pinned or the metadata is unresolvable.
- **Instance metadata is stored and readable** (`getMetadata()`), unlike DAO metadata which you read by indexing its event.
- **No standalone schema file, the examples are the format.** Every plugin repo ships its own `release-metadata.json` + `build-metadata.json` (e.g. under `packages/contracts/src/` or `script/metadata/`); `build-metadata` is self-describing, since it embeds the input ABI schema itself.

## See also

- [Plugin setup](/framework/plugin-setup.md) — whose `prepareInstallation` `_data` the build metadata documents.
- [PluginRepo](/framework/plugin-repo.md) — where a version stores these JSON URIs.
- [DAO metadata](/core/dao-metadata.md) — the DAO-side counterpart (and the event-only-vs-stored contrast).
