---
type: reference
title: PluginSettings
kind: library
source: staged-proposal-processor-plugin/src/utils/PluginSettings.sol
summary: "Provides constant values and metadata for the \"StagedProposalProcessor\" plugin, including contract names, versioning, and IPFS metadata for builds and releases."
---

# PluginSettings

**Library** · [`src/utils/PluginSettings.sol`](https://github.com/aragon/staged-proposal-processor-plugin/blob/96b83dd5da22930e8d9bcc211cf4e57aaf5270f2/src/utils/PluginSettings.sol)

**Author:** Aragon X - 2024

Provides constant values and metadata for the "StagedProposalProcessor" plugin,
including contract names, versioning, and IPFS metadata for builds and releases.

## Constants

_Public, so each is also readable through a generated getter._

### BUILD_METADATA

```solidity
string public constant BUILD_METADATA =
        "ipfs://QmaxGSvvnTAZcDLYz2BMtaXmcx3i1GcaKGaxNEpfQe3Vyv";
```

### PLACEHOLDER_BUILD_METADATA

```solidity
string public constant PLACEHOLDER_BUILD_METADATA =
        "ipfs://QmZDx8G5xuF9vqVbFGZ3KhF5nioL8gXwV3JbsEsSHvNMiz";
```

Aragon's canonical empty-schema placeholder build metadata, used when filling skipped builds
on a fresh-network deploy so on-chain build numbers stay aligned across networks.

> **Dev:** Content-addressed; the file at `lib/osx/.../placeholder/placeholder-build-metadata.json` always pins to this CID.

### PLUGIN_CONTRACT_NAME

```solidity
string public constant PLUGIN_CONTRACT_NAME = "StagedProposalProcessor";
```

### PLUGIN_REPO_ENS_SUBDOMAIN_NAME

```solidity
string public constant PLUGIN_REPO_ENS_SUBDOMAIN_NAME = "spp";
```

### PLUGIN_SETUP_CONTRACT_NAME

```solidity
string public constant PLUGIN_SETUP_CONTRACT_NAME = "StagedProposalProcessorSetup";
```

### PROPOSAL_METADATA

```solidity
string public constant PROPOSAL_METADATA =
        "ipfs://QmTS3Nrjrs8nuMeqUqSRjBxbGUhZB4nW6N1GiK8vFmfDcD";
```

Title/summary/description/resources JSON pinned for this version's management DAO proposal.

> **Dev:** Re-pin and update on every VERSION_BUILD bump. Source: `script/new-version-proposal-metadata.json`.

### RELEASE_METADATA

```solidity
string public constant RELEASE_METADATA =
        "ipfs://bafkreif23p6yw325rkwwlhgkudiasvq64lonqmfnt7ls5ksfam5hedcb4m";
```

### VERSION_BUILD

```solidity
uint8 public constant VERSION_BUILD = 2;
```

### VERSION_RELEASE

```solidity
uint8 public constant VERSION_RELEASE = 1;
```
