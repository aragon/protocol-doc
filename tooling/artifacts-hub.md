---
type: reference
title: Deployed addresses and ABIs (artifacts-hub)
source: artifacts-hub/README.md, artifacts-hub/addresses/README.md, artifacts-hub/abi/README.md, artifacts-hub/scripts/schema.ts
---

# Deployed addresses and ABIs (artifacts-hub)

[`aragon/artifacts-hub`](https://github.com/aragon/artifacts-hub) is the **canonical source for where Aragon's contracts live onchain and what their interfaces are**: one JSON address book per chain and one JSON ABI per contract, for every deployed version. It has no NPM package and no build step: add it as a git submodule and read the files.

Use it whenever you need a real address or an ABI outside of Solidity source: a frontend, an indexer, a script, a fork test that targets a specific plugin build. Pair an address from `addresses/` with the matching ABI from `abi/` and you can call any deployed Aragon contract.

```sh
git submodule add https://github.com/aragon/artifacts-hub lib/artifacts-hub
```

## Addresses: `addresses/<chainId>.json`

One file per chain, all with the same shape (a Zod schema, `scripts/schema.ts`, is the source of truth). Each `<chainId>.json` has a `<network>.json` symlink beside it (`sepolia.json`, `mainnet.json`, `base.json`, …), so either name works.

| You want | Path in the file |
|---|---|
| The current OSx version on the chain | `osx.versions.find(v => v.current)` |
| The framework contracts (`daoFactory`, `pluginSetupProcessor`, `pluginRepoFactory`, the registries, `daoBase`) | `osx.versions.find(v => v.current).core.*` |
| The latest build of a plugin (its `setup` + `implementation`) | `plugins["<slug>"].versions.find(v => v.current)` |
| Every historical build of a plugin | `plugins["<slug>"].versions` |
| A plugin's [PluginRepo](../framework/plugin-repo.md) and ENS name | `plugins["<slug>"].repo`, `plugins["<slug>"].ens` |
| The Management DAO and its multisig | `management.*` |
| Aragon's ENS contracts on the chain | `ens.*` |
| The current [condition](../helpers/condition-library.md) factory | `conditions.factories.find(f => f.current).address` |
| The [Protocol Factory](../deployment/protocol-factory.md) (chains deployed with it) | `deployers.protocolFactory` |

Plugin slugs are `admin`, `multisig`, `token-voting`, `spp`, `lock-to-vote` and `crosschain`. Plugin versions are `(release, build)` pairs, the same [versioning](../framework/plugin-repo.md) the PluginRepo uses onchain, and arrays are sorted ascending with the newest real build marked `current: true`.

## ABIs: `abi/<slug>/<Contract>.json`

One folder per component (the same slugs as above, plus `osx`, `conditions` and `protocol-factory`), one JSON ABI per contract. Every version the address book references has its own folder, and the component root always mirrors the latest one:

```
abi/<slug>/<Contract>.json          # latest version
abi/<slug>/v<version>/<Contract>.json  # a specific version
```

Plugins use `v<release>.<build>` (`abi/multisig/v1.2`), matching their entry in the address book. OSx uses its protocol version (`abi/osx/v1.4.0`). An ABI inside a version folder never changes: a changed interface means a new version. So when a DAO still runs an older build, you can read that build's exact interface.

Each folder also carries a generated `index.ts` exporting every ABI as `<Contract>ABI` with `as const`, the literal typing viem needs for typed `readContract` / `writeContract`. Bytecode is not included: the deployed code is onchain, and the source repos (see [Source repositories](../repositories.md)) build it when you need it.

These ABIs are the machine-readable counterpart of the [ABI reference](../abi/index.md): read the reference to understand a function, load the JSON to call it.

## Reading it from Solidity (Foundry)

A Foundry test or script can read the address book with cheatcodes. Allow read access in `foundry.toml`:

```toml
fs_permissions = [{ access = "read", path = "./lib/artifacts-hub/addresses" }]
```

Then select the `current` entry with a JSONPath filter:

```solidity
string memory book = vm.readFile("lib/artifacts-hub/addresses/sepolia.json");

address daoFactory = vm.parseJsonAddress(
    book, "$.osx.versions[?(@.current == true)].core.daoFactory"
);
address multisigSetup = vm.parseJsonAddress(
    book, "$.plugins.multisig.versions[?(@.current == true)].setup"
);
```

For the everyday case you don't need this: [just-foundry](./just-foundry.md)'s network configs carry the main OSx addresses as environment variables (`DAO_FACTORY_ADDRESS`, `PLUGIN_SETUP_PROCESSOR_ADDRESS`, …), and those values are synced from this address book. Read the hub directly when you need what the env vars don't carry, such as a specific plugin build or a historical version.

## Reading it from TypeScript (viem)

```ts
import sepolia from "./lib/artifacts-hub/addresses/sepolia.json";
import { MultisigSetupABI } from "./lib/artifacts-hub/abi/multisig";
import { createPublicClient, http } from "viem";
import { sepolia as sepoliaChain } from "viem/chains";

const build = sepolia.plugins.multisig.versions.find(v => v.current)!;

const client = createPublicClient({ chain: sepoliaChain, transport: http() });
const implementation = await client.readContract({
  address: build.setup as `0x${string}`,
  abi: MultisigSetupABI,
  functionName: "implementation",
});
```

Import a specific version with `.../abi/multisig/v1.2`, or every component at once with `import { multisig, tokenVoting } from "./lib/artifacts-hub/abi"`.

## How it stays accurate

- **Chains deployed with the [Protocol Factory](../deployment/protocol-factory.md)** are reconstructed from that one address: the hub reads the factory's frozen `getDeployment()` record, then walks each plugin's PluginRepo onchain to list every published build. Older chains that predate the factory are maintained by hand.
- **New plugin builds** arrive as deployment artifacts the plugin repos emit after each deploy, merged in with strict rules: an existing `(release, build)` can never be pointed at a different address.
- **ABIs are pinned** to an exact git commit (or, for builds from before the Foundry repos, an npm package) and checked against the deployed bytecode: every function selector in a version's ABI must exist in the code of every setup and implementation of that version.
- **Addresses are EIP-55 checksummed**, and every file is validated against the schema in CI.

## Keep in mind

- **Placeholder builds are not the plugin.** On chains where a plugin starts at a later build, the earlier build numbers point to the OSx `PlaceholderSetup` (so a `(release, build)` means the same thing on every chain, see the [Protocol Factory](../deployment/protocol-factory.md)). Those entries carry `placeholder: true` and can't be installed. Pick `current`, or filter placeholders out, when you list installable builds.
- **Deprecated chains stay in the book.** A file with `deprecated: true` is a retired chain. Its addresses still resolve existing DAOs, but don't build anything new on it.
- **Compare addresses case-insensitively.** The files are checksummed, but addresses from other sources may not be.
- **Match the ABI to the build the DAO runs.** The root ABI is the latest version. A DAO that hasn't [updated its plugin](../guides/update-a-plugin.md) still runs an older build: load `abi/<slug>/v<release>.<build>` for that one.

## See also

- [just-foundry](./just-foundry.md): the per-network env vars synced from this address book.
- [Protocol Factory](../deployment/protocol-factory.md): the onchain record the hub reconstructs each chain from.
- [ABI reference](../abi/index.md): the readable, per-function documentation of the same contracts.
- [Source repositories](../repositories.md): the code every address and ABI comes from.
