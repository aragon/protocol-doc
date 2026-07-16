# How these docs work

This is the **Aragon OSx protocol knowledge base**: a public, developer-facing wiki for the whole EVM protocol behind Aragon, the OSx core, the governance plugins, and the helpers and tooling around them. It is operated with the `wiki` CLI (see [CLAUDE.md](./CLAUDE.md) for the tool; this file is *this base's* conventions).

Two layers, per the `wiki` model:

- **Concepts, the graph.** Atomic `concept`, `reference`, and `example` entries, one idea per page, richly cross-linked. This is the substance, consumed non-linearly: land on a page, follow links (`wiki links` / `backlinks`).
- **Guides, the linear layer.** `guide` entries read top-to-bottom (a tutorial or how-to) and **link into** the concepts for depth, never restating them.

The concepts are the source of truth; guides are paths through them. **Git-managed:** pull before editing, commit in batches once `wiki check` passes.

## Audience

Developers who want to **build on and integrate with** the protocol in Solidity: authoring plugins, deploying DAOs, wiring permissions and conditions, integrating the helpers. Write for someone competent in Solidity but new to Aragon. Every relevant use case earns an actionable, copy-adaptable Solidity example. Don't just transcribe interfaces, signatures, and NatSpec: explain what a thing *is*, *why* it exists, and *how* you use it.

## Structure

One product, one graph. Pages live in **area folders** (grouped by architectural role, not by `type`), plus the linear **`guides/`** layer. Each area folder has its own `index.md` (its map). The root carries only the front-door `index.md`, the `backlog/`, `raw/`, `log.md`, and the odd general-purpose page (a glossary).

```
platform-docs/
├── index.md          # front door: what the protocol is + links to guides and each area
├── glossary.md       (type: concept)  general-purpose, if it earns its keep
│
├── core/             # AREA — the DAO + permission system (osx: src/core)
│   └── index.md
├── common/           # AREA — shared cross-cutting primitives, osx-commons (osx: src/common)
│   └── index.md      #   auth, conditions, proposals, membership, ratio, proxies, versioning
├── framework/        # AREA — the plugin model + publish/install machinery (osx: src/framework + plugin bases)
│   └── index.md      #   plugin model, base types, setup, metadata, PluginRepo, PSP, factories, registries
├── plugins/          # AREA — the governance plugins + the Capital Router (automation)
│   └── index.md      #   token-voting, multisig, admin, staged-proposal-processor, lock-to-vote, capital-router
├── helpers/          # AREA — protocol helpers
│   └── index.md      #   condition-library
├── deployment/       # AREA — deploying the protocol and DAOs
│   └── index.md      #   protocol-factory, dao-launchpad, deployment-checklist
├── tooling/          # AREA — tooling for building on OSx (distinct from guides)
│   └── index.md      #   plugin-template, just-foundry
│
├── guides/           # the linear layer (type: guide)
│   └── index.md      #   guides in reading order
│
├── backlog/          # the work tracker (type: task) — see "The backlog"
│   └── index.md      #   the board
│
├── raw/              # raw source captures (git-ignored, not indexed) — see "Ingesting"
└── log.md            # dated record of ingestion / enrichment passes
```

**File by area from the first page.** An area folder mixes `concept`, `reference`, and `example`; there is no `concepts/` folder. Keep it one level deep. Pages link freely across areas (define-once-link-everywhere): the graph, not the tree, carries relationships. Add an area only when a real cluster appears; split one when it outgrows its home (`wiki move` rewrites the links).

**Querying: by component vs by concern.** The folder *is* the component, so search a component by its folder, not a tag: `wiki list --prefix plugins/capital-router/`, `wiki list --prefix core/`. **Tags are only for cross-cutting concerns** that span folders (`security`, `permissions`, `upgradeability`, `ens`, …), queried with `wiki list --where tags=security`. Don't add a tag that just mirrors a folder (`core`, `capital-router`, …): it duplicates what `--prefix` answers and silently drifts (a page always lives in its folder; a tag has to be maintained). So: **by component → `--prefix`; by cross-cutting concern → `--where tags=`.**

**Links are relative.** Cross-page links resolve **relative to the linking file** (`../core/permissions.md`, `./sibling.md`), not root-absolute. Don't hand-compute them: write the target however is convenient, then run `wiki tidy` to canonicalize every link to its relative form (and filenames to slugs). `wiki move` keeps links correct when a page relocates, and `wiki check` verifies both targets and `#anchor` fragments.

## The entry point (`index.md`)

The front door, hand-curated, not a dump: a short intro to the protocol, links to the **guides** (the linear way in), and links to the **key concepts** each area hangs off. Every area's `index.md` is the same shape one level down: what's here, where to start, the notable pages. Keep them curated and lean; exhaustive lists are what `wiki list` is for.

## Concepts: the graph

Each concept is **one atomic idea**, defined once, linked to what it relates to.

- **Define once, link everywhere.** A term is explained on its own page; every other page links to it instead of re-explaining. The definition changes in one place.
- **Distinct ideas stay distinct.** A contract and its setup, a base class and its variants: separate pages, linked. Adjacent is a reason to link, not to merge. Don't split one idea across pages, don't fold two into one.
- **Link generously.** The value is the graph. `backlinks` shows what depends on a concept; `links` shows what it builds on.
- **concept vs reference vs example.** `concept` explains an idea ("what a permission condition is, and why"); `reference` is precise lookup material ("`PermissionManager`'s functions and their args"); `example` is a runnable/adaptable Solidity snippet for a use case. Split when readers want "understand" apart from "look up" apart from "do"; a page can be primarily one and still hold a short snippet.
- **"Keep in mind", for what's worth circling back on.** End a concept page with a short **## Keep in mind** (always that heading, so readers know where to scan) listing the genuinely important, easy-to-forget points, phrased as a helpful heads-up, not a warning. Include a point if it's important enough to reinforce *even when the body already states it* ("ROOT with an EOA is total control", "the permission tiers don't merge", "delegate or you have no voting power"); exclude trivia and mechanical restatements ("max 256 actions", "don't confuse X with Y"). If a page has nothing worth reinforcing, omit the section, never pad one in.

`wiki unresolved` is the **to-write list**: a link to a page you haven't written yet is a promise, not an error.

## Guides: the linear layer

A `guide` walks through a task start to finish, **linking into concepts** for depth rather than restating them ("grant a permission, see [Permissions](../core/permissions.md)"). Single page for something short; for anything longer, a **sequence**: a typed landing entry (`guides/<name>.md`, `type: guide`, the intro + chapter order) with the numbered chapters beside it under `guides/<name>/` (`01-…`, `02-…`) linked next/prev, the landing is a real typed guide, not a typeless `index.md`. Order is explicit: within a sequence and in `guides/index.md`. If you're tempted to explain a concept inside a guide, that concept wants its own page.

## Ingesting from source

Docs are distilled from **source code** (the 12 repos). The material is the input, not the wiki. Work in two phases, gradually, one repo at a time in this order:

> `osx` → `token-voting-plugin` → `multisig-plugin` → `admin-plugin` → `spp` → `lock-to-vote-plugin` → `capital-router` → `dao-launchpad` → `protocol-factory` → `condition-library` → `osx-plugin-template-foundry` → `just-foundry`

1. **Extract into `raw/`.** Pull the relevant facts out of a repo's source into rough notes under `raw/<repo>/` before shaping them (delegate this to an extraction agent if it helps). `raw/` is git-ignored and unindexed: interim scratch you mine, not the committed base. Read source contracts, not test files (mine a test only for a real usage example), and not the repos' own docs beyond a final checklist so nothing is forgotten, never mirror their structure.
2. **Build incrementally, from `raw/`.** Promote raw notes into atomic entries a few at a time: write one page, file it into its area, link it, `wiki check`, then delete the raw note you mined. `raw/<repo>/` empty = that repo's batch is done. Let `wiki unresolved` guide the order: each page names others, and those become the next to-write items.

**Keep provenance, at two granularities.** Every entry carries a `source:` field naming the repo-relative path(s) it was distilled from (e.g. `source: osx/src/core/dao/DAO.sol`), so any *fact* can be re-checked against the code. It is a field, not a type: there is no `source` entry. And [`repositories.md`](./repositories.md) pins, per component, the **exact commit** the docs were generated from (its *Snapshot* column), so the whole base has a diffable baseline.

**Refreshing is a delta, not a re-read.** Because the source commit is pinned, keeping a component current is: `git diff <snapshot-commit> HEAD` on its repo, update the entries the diff touches (their `source:` fields point at the files), then **bump the Snapshot commit** in `repositories.md` and log the pass. This is the whole reason to record commits, not just repos: each update stays a small, followable diff.

**Record each pass in `log.md`,** dated and high-level: one line per repo/enrichment pass (what was covered, roughly what was added), not one per edit.

## The backlog

A single lightweight kanban at [`backlog/index.md`](./backlog/index.md): a goal, then sections of plain links to `type: task` entries in `backlog/`.

- A task is `backlog/<slug>.md`, `type: task`, with `status` (`todo` | `in-progress` | `done`) and a `tags` work-kind (`ingest`, `guide`, `debt`, `question`, `example`). Statuses and sections stay minimal on purpose.
- **Board sections:** `## Now` (committed), `## Next` (queued), `## Debt` (workarounds and gaps to revisit), `## For the user` (questions/decisions the human owns). Plain links only, the linked task owns its `status`.
- **Technical debt and gaps** are `debt`-tagged tasks under `## Debt`, so nothing accrues silently: every workaround, TODO, or known omission becomes one.
- **Done work leaves the board:** set `status: done`, remove the board line, delete the file (git keeps it). Lasting outcomes go as a `log.md` line.
- `backlog/**` is `ignore_orphans`'d, so `wiki orphans` stays a clean signal (a hit = a real page that lost its links, not a parked task).

## Grooming

Groom to make the base more findable, not for its own sake. After any batch: `wiki check`, then work `wiki unresolved` (to-write) and `wiki orphans` (undiscoverable, link it in). Watch for a concept explained twice (merge + link). Reread stale pages as the source moves (`wiki list --sort=timestamp --reverse`). Read a finished area cold, as a newcomer, and fix the blind spots.
