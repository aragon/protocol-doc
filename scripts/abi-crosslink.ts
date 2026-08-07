#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run --allow-env
//
// Wire the generated ABI reference into this knowledge base, in both directions.
//
//   deno run -A scripts/abi-crosslink.ts
//
// This is bundle-specific glue, deliberately separate from `abi-docs.ts` — that one is a
// standalone Solidity-to-Markdown tool and knows nothing about the wiki. This one only reads
// what is already on disk.
//
// The bridge is the `source:` frontmatter both layers already carry: hand-written entries
// declare which contracts they explain, generated pages declare which contract they document,
// so the mapping is exact and needs no heuristics.
//
//   ABI → KB   an `**Explained in:**` line is written into each ABI page (safe to automate:
//              those files are generated anyway, and it stops them being dead ends)
//   KB → ABI   not written. The area `index.md` pages carry that link by hand, and anything
//              finer belongs in the sentence that earns it, so the prose stays hand-owned.
//
// It also reports `source:` values that match no ABI page, which is the only way a wrong repo
// prefix ever becomes visible.
//
// Re-run after `just abi-all`, which overwrites the ABI pages.

import { basename, join, relative } from "jsr:@std/path@1";

const dec = new TextDecoder();

async function run(cmd: string, args: string[], cwd: string): Promise<string> {
  const out = await new Deno.Command(cmd, { args, cwd, stdout: "piped", stderr: "piped" }).output();
  if (!out.success) throw new Error(`${cmd} ${args.join(" ")} failed:\n${dec.decode(out.stderr)}`);
  return dec.decode(out.stdout).trim();
}

type Entry = { path: string; title: string; sources: string[] };

/** Every entry `wiki` knows about, split into the two layers. Going through `wiki list`
 *  rather than walking the tree lets the bundle's own `ignore` rules decide what counts. */
async function entries(root: string): Promise<{ kb: Entry[]; abi: Entry[] }> {
  const rows = JSON.parse(await run("wiki", ["list", "--format", "json"], root)) as Record<string, string>[];
  const all = rows
    .map((r) => ({
      path: (r._path ?? "").replace(/^\//, ""),
      title: r.title || basename(r._path ?? "", ".md"),
      sources: String(r.source ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    }))
    .filter((e) => e.path && e.sources.length)
    .sort((a, b) => a.path.localeCompare(b.path));
  return {
    kb: all.filter((e) => !e.path.startsWith("abi/")),
    abi: all.filter((e) => e.path.startsWith("abi/")),
  };
}

const EXPLAINED = /^\*\*Explained in:\*\* .*\n\n?/m;

/** Insert (or refresh) the backlink line, right below the `**Contract** · …` line. */
function withExplainedIn(md: string, links: string): string | null {
  const stripped = md.replace(EXPLAINED, "");
  if (!links) return stripped === md ? null : stripped;
  const line = `**Explained in:** ${links}\n\n`;
  const anchor = stripped.match(/^\*\*.+\*\* · .*\n\n/m);
  if (!anchor) return null;
  const at = stripped.indexOf(anchor[0]) + anchor[0].length;
  const next = stripped.slice(0, at) + line + stripped.slice(at);
  return next === md ? null : next;
}

if (import.meta.main) {
  const root = Deno.cwd();
  const { kb, abi } = await entries(root);

  // ABI → KB: which hand-written entries explain each Solidity file.
  const explainers = new Map<string, Entry[]>();
  for (const e of kb) {
    for (const s of e.sources) (explainers.get(s) ?? explainers.set(s, []).get(s)!).push(e);
  }
  for (const v of explainers.values()) v.sort((a, b) => a.title.localeCompare(b.title));

  let written = 0;
  for (const page of abi) {
    const who = page.sources.flatMap((s) => explainers.get(s) ?? []);
    const seen = new Set<string>();
    const links = who
      .filter((e) => !seen.has(e.path) && seen.add(e.path))
      .map((e) => `[${e.title}](${relative(join(page.path, ".."), e.path)})`)
      .join(", ");
    const file = join(root, page.path);
    const next = withExplainedIn(await Deno.readTextFile(file), links);
    if (next !== null) {
      await Deno.writeTextFile(file, next);
      written++;
    }
  }
  console.log(`ABI → KB: ${written} page(s) updated with an "Explained in" line.`);

  // Integrity: `source:` values that match no ABI page. Usually just a repo nobody generates
  // (protocol-factory, tooling); but a *wrong* prefix — a component name where the repo name
  // belongs — surfaces here too, and is invisible otherwise. That is how `condition-library`
  // (the repo is `conditions`) and `spp` were found silently linking to nothing.
  const documented = new Set(abi.flatMap((p) => p.sources));
  const unresolved = new Map<string, number>();
  for (const s of kb.flatMap((e) => e.sources)) {
    if (documented.has(s)) continue;
    const repo = s.split("/")[0];
    unresolved.set(repo, (unresolved.get(repo) ?? 0) + 1);
  }
  if (unresolved.size) {
    console.log("\nUnresolved `source:` files, by repo — no ABI page, so check the prefix is the repo name:");
    for (const [repo, n] of [...unresolved].sort()) console.log(`  ${repo.padEnd(30)} ${n}`);
  }
}
