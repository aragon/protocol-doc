---
type: concept
title: DAO metadata
tags: [metadata]
source: osx/src/core/dao/DAO.sol, osx/src/core/dao/IEIP4824.sol, protocol-factory/management-dao-metadata.json
---

# DAO metadata

A DAO's human-facing identity, its name, description, logo, and links, is **not** stored as on-chain fields. The [DAO contract](/core/dao.md) keeps two thin pointers to off-chain JSON instead, one Aragon-app-facing and one an interoperability standard. Knowing which is which (and that one isn't even stored) saves you from looking for a getter that doesn't exist.

## Surface 1: the Aragon metadata blob (event-only)

`setMetadata(bytes)` (gated by `SET_METADATA_PERMISSION_ID`; also set at `initialize`) takes an opaque `bytes` value. That value is a **pointer, not the metadata itself**: by convention it's the UTF-8 of an `ipfs://<CID>` URI (an IPFS content id), and the chain never holds the JSON, only the pointer. On top of that, `setMetadata` **only emits** the value as `MetadataSet(metadata)`; it's *not* written to storage either. So there's no `getMetadata()` on a DAO: read the current pointer by indexing the **latest `MetadataSet` event**, then fetch the `ipfs://…` it names.

That `ipfs://…` resolves to a JSON object in this shape (a real example, the Management DAO):

```json
{
  "name": "Aragon Management DAO",
  "description": "Aragon OSx includes a group of global smart contracts …",
  "avatar": "https://ipfs.eth.aragon.network/ipfs/Qm…/",
  "links": [
    { "name": "Web site", "url": "https://www.aragon.org" },
    { "name": "Developer Portal", "url": "https://devs.aragon.org/" }
  ]
}
```

- `name`, `description` — display text.
- `avatar` — a URL (often IPFS) to the DAO's logo.
- `links` — an array of `{ name, url }` for the DAO's sites/socials.

Nothing on-chain validates this shape; the contract treats the CID as opaque. It's a convention that Aragon's app and ecosystem tools read.

## Surface 2: the EIP-4824 `daoURI` (stored, standardized)

Separately, the DAO implements [EIP-4824](https://eips.ethereum.org/EIPS/eip-4824): `daoURI()` returns a **stored** URI (set at `initialize`, updatable via `setDaoURI`, same `SET_METADATA_PERMISSION_ID`) that points to a standardized JSON-LD document. That document fans out into `membersURI`, `proposalsURI`, `activityLogURI`, and `governanceURI`, a cross-tool schema for machine-readable discovery of a DAO's members, proposals, activity, and governance docs.

So a DAO carries **two** metadata surfaces for two audiences: the Aragon blob is app/branding metadata (event-only), and `daoURI` is the interoperable standard any DAO tool can consume (stored, with a getter). Both are gated by the same `SET_METADATA_PERMISSION_ID`, so both change through the DAO's governance.

## A minimal skeleton to copy

```json
{
  "name": "My DAO",
  "description": "One-line description of the organization.",
  "avatar": "ipfs://<CID-of-your-logo>",
  "links": [ { "name": "Website", "url": "https://example.org" } ]
}
```

Pin it with `just ipfs-pin <file>` (it uploads and returns the `ipfs://<CID>` URI), then pass that URI (ABI-encoded as `bytes`) as the `metadata` at the DAO's `initialize` / a factory, or later via `setMetadata`. The `daoURI` is set the same way, pointing at its own EIP-4824 document.

## Keep in mind

- **The Aragon blob is event-only, the `daoURI` is stored.** Read the former by indexing `MetadataSet`; read the latter with `daoURI()`. Don't look for a metadata getter, it isn't there.
- **Both point off-chain (usually IPFS).** The chain stores a CID/URI, not the content, so availability depends on the JSON staying pinned.
- **No on-chain schema check.** The DAO never parses the JSON; a malformed blob just renders badly in tooling, it won't revert anything.
- **No formal schema file, just a convention.** The blob's shape is the de-facto standard shown above; the canonical live example is the Management DAO's `management-dao-metadata.json`. The `daoURI` document, by contrast, follows the published [EIP-4824](https://eips.ethereum.org/EIPS/eip-4824) schema.

## See also

- [The DAO contract](/core/dao.md) — where `setMetadata` / `daoURI` live and how they're permissioned.
- [Plugin metadata](/framework/plugin-metadata.md) — the plugin-side counterpart (version JSON + on-chain instance metadata), which *does* store instance metadata.
