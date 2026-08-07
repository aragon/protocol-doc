# Scripts

Tooling for this knowledge base. Run everything through the [`justfile`](../justfile) at the
bundle root; `just` on its own lists the recipes.

## `abi-docs.ts` — the ABI reference

Generates [`abi/<repo>/<Element>.md`](../abi/index.md): one page per top-level Solidity
declaration, carrying its public surface and every scrap of NatSpec attached to it.

```sh
just abi ../token-voting-plugin/src            # a directory, recursively
just abi ../osx/src/core/dao/DAO.sol           # or single files
just abi ../osx/src ../conditions/src          # or several repos at once
just abi-all                                   # every Foundry repo, from scratch
```

Paths may be files or directories, from any repo, in any mix. They are grouped by git root,
each group is compiled once, and the per-repo and root `index.md` are rebuilt from whatever
is on disk afterwards, so regenerating a subset never truncates the indexes.

### How it works

`forge build --build-info` writes solc's full standard-JSON output to one file per compile
(into a temp dir, so nothing is added to the source repo). That single artifact carries
everything the pages need:

| From | Used for |
| --- | --- |
| `output.contracts[f][C].abi` | the public surface: functions, events, errors, and their types |
| `…metadata.output.devdoc` / `userdoc` | NatSpec with `@inheritdoc` and inherited members **resolved** |
| `…evm.methodIdentifiers` | function selectors |
| `output.sources[f].ast` | contract kind, inheritance, enums, structs, constants, and the NatSpec **as written** |
| `input.sources[f].content` | the original text, sliced by the AST's `src` offsets |

`cast keccak` fills in one more thing solc does not: a `bytes32 constant X = keccak256("…")`
is rendered with its **computed value**, because that hash is what you actually pass to
`grant`/`revoke`/`isGranted` and it is the one fact the declaration does not state. Constants
show that value rather than their getter's selector, which is technically real but useless
next to the literal.

Three of those choices are load-bearing:

- **Members come from the ABI, not the AST.** The ABI *is* the public surface by definition,
  and it already includes everything inherited from base contracts. Enums, structs and
  constants are not in the ABI, so those come from the AST, walked across
  `linearizedBaseContracts` so a page is self-contained.
- **Prose comes from the AST, with devdoc/userdoc as the fallback.** solc flattens a
  multi-line `@notice` onto a single line, which destroys the Markdown structure some of
  these contracts rely on (`MajorityVotingBase` has headings and LaTeX). The raw comment
  keeps it. But the raw comment only exists where one was physically written, so
  `@inheritdoc` and inherited members still need devdoc/userdoc — hence both, merged field
  by field.
- **The comment is re-read from source, not taken from `documentation.text`.** solc drops
  blank `///` lines from that field, collapsing every paragraph break. The `documentation`
  node's `src` offsets let us slice the original comment instead.

Headings found inside NatSpec are demoted below `###` so an author's heading can never
collide with the page's own outline.

### Output contract

- **One page per top-level declaration** — contract, interface, library, and any file-level
  enum, struct, error, constant, user-defined value type or free function. Declarations
  *inside* a contract stay on that contract's page.
- **Filenames are the Solidity identifier verbatim** (`TokenVoting.md`, `IDAO.md`). If two
  declarations in one repo share a name, the colliding ones get their directory prefixed and
  the script says so on stderr. Note this is deliberately *not* the base's slug convention,
  so don't run `wiki tidy --names` over `abi/`.
- **Frontmatter** is `type: reference` (these are lookup material, per
  [WORKFLOW.md](../WORKFLOW.md)), plus `kind` (the Solidity kind, orthogonal to the wiki
  type), `source`, `title` and `summary`.
- **Deterministic.** Members are sorted, nothing carries a timestamp or an absolute path, and
  the source commit appears only in the per-repo `index.md` — one line, so a regeneration
  after an unrelated commit does not churn 100 files. Two runs against the same commits
  produce byte-identical output.
- **Generated, so never hand-edited.** The next run overwrites the tree.

### Non-Foundry repositories

`multisig-plugin` and `admin-plugin` are Hardhat, with their sources under
`packages/contracts/`. They work anyway:

```sh
just abi-legacy        # installs their deps, then generates as usual
forge build --root . --contracts src --lib-paths node_modules --skip '*/mocks/*'
```

Because forge runs in `packages/contracts` while the git root is one level up, `source:` and
the GitHub links are written relative to the **git root**
(`multisig-plugin/packages/contracts/src/Multisig.sol`) while build-info lookups use the
build root.

This is all temporary: both repos are being migrated to Foundry, after which the `NON_FOUNDRY`
table and the `abi-legacy` recipe can be deleted and they join `abi-all`.

## `abi-crosslink.ts` — wiring it into the wiki

```sh
just abi-link           # re-run after `abi-all`, which overwrites the ABI pages
```

Bundle-specific glue, kept separate on purpose: `abi-docs.ts` is a standalone
Solidity-to-Markdown tool with no knowledge of this wiki, and this pass only reads what is
already on disk. The bridge is the `source:` frontmatter both layers already carry, so the
mapping is exact and needs no heuristics.

- **ABI → KB is written.** Each ABI page gets an `**Explained in:**` line under its title.
  Safe to automate, since those files are generated anyway, and it stops a signature page
  being a dead end. Idempotent: the line is replaced, never duplicated.
- **KB → ABI is not.** Each area's `index.md` carries that link by hand; anything finer
  belongs in the sentence that earns it, so the prose stays hand-owned.

It then reports `source:` values matching no ABI page, grouped by repo. Most of those are
repos nobody generates (`protocol-factory`, the tooling) or non-Solidity sources (a
`build-metadata.json`, a `README.md`) — but a **wrong prefix** surfaces here too, and nowhere
else. That is how `condition-library` (the repo is `conditions`) and `spp` were caught
linking to nothing at all. If a repo you *do* generate appears in this list, check that the
`source:` prefix is the repo name.

## Known gaps

- **No selectors for events and errors.** Function selectors come free from
  `methodIdentifiers`; the others would need a `cast sig-event` call per member. Cheap enough
  to add if the error selectors turn out to be worth it when debugging reverts.
- **Only `keccak256("literal")` constants get a computed value.** Anything else (`10**6`,
  a struct literal) is left as the declaration, which already reads clearly.
- **Stale pages are not pruned.** Removing a contract from source leaves its page behind
  until `abi/` is deleted and regenerated (`just abi-all` after an `rm -rf abi`).
- **Undocumented surface shows up bare.** A function with no NatSpec renders as just its
  signature. That is faithful, and a useful signal about the source.
