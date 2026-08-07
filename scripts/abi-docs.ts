#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run --allow-env
//
// Generate the Markdown ABI reference under `abi/<repo>/<Element>.md` from Solidity sources.
//
//   deno run -A scripts/abi-docs.ts ../token-voting-plugin/src ../osx/src/core/dao/DAO.sol
//
// Paths may be files or directories, in any repo, mixed freely; they are grouped by git
// root and each group is compiled once. See scripts/README.md for the how and why.

import { basename, dirname, globToRegExp, join, relative, resolve } from "jsr:@std/path@1";

// ---------------------------------------------------------------- solc types

/** A node of solc's `abi` output. `components` recurses for tuples (structs). */
type AbiParam = {
  name: string;
  type: string;
  internalType?: string;
  components?: AbiParam[];
  indexed?: boolean;
};
type AbiEntry = {
  type: "function" | "constructor" | "event" | "error" | "fallback" | "receive";
  name?: string;
  inputs?: AbiParam[];
  outputs?: AbiParam[];
  stateMutability?: string;
};

/** solc's parsed NatSpec, keyed by canonical signature. Overloads make the values arrays. */
type DocEntry = {
  notice?: string;
  details?: string;
  params?: Record<string, string>;
  returns?: Record<string, string>;
};
type DocSet = Record<string, DocEntry | DocEntry[]>;
type Devdoc = {
  title?: string;
  author?: string;
  details?: string;
  methods?: DocSet;
  events?: DocSet;
  errors?: DocSet;
  stateVariables?: DocSet;
  [custom: string]: unknown;
};
type Userdoc = { notice?: string; methods?: DocSet; events?: DocSet; errors?: DocSet };

// deno-lint-disable-next-line no-explicit-any
type AstNode = any;

/** A nested enum/struct, with the base contract and file it was declared in. */
type MemberDef = { n: AstNode; from?: string; path: string };

type BuildInfo = {
  input: { sources: Record<string, { content: string }> };
  output: {
    sources: Record<string, { ast: AstNode }>;
    contracts: Record<
      string,
      Record<string, { abi: AbiEntry[]; metadata?: string; evm?: { methodIdentifiers?: Record<string, string> } }>
    >;
  };
};

// ------------------------------------------------------------- the page model

/** What each generated `.md` file describes. One top-level Solidity declaration. */
type Page = {
  name: string;
  kind: "contract" | "abstract contract" | "interface" | "library" | "struct" | "enum" | "error" | "type" | "function" | "constant";
  sourcePath: string; // repo-relative
  file: string; // basename of the .md, filled in once collisions are known
  body: string[]; // rendered lines, minus the header (needs the cross-link set)
  summary: string; // one-line blurb for the index
  render: (linkable: Set<string>) => string;
};

// ------------------------------------------------------------------- helpers

const enc = new TextEncoder();
const dec = new TextDecoder();

async function run(cmd: string, args: string[], cwd: string): Promise<string> {
  const out = await new Deno.Command(cmd, { args, cwd, stdout: "piped", stderr: "piped" }).output();
  if (!out.success) throw new Error(`${cmd} ${args.join(" ")} failed:\n${dec.decode(out.stderr)}`);
  return dec.decode(out.stdout).trim();
}

/** Best-effort: a value we can put in a link, or "" if the repo has no usable origin. */
function httpsRemote(url: string): string {
  const m = url.match(/^(?:git@([^:]+):|https?:\/\/(?:[^@]*@)?([^/]+)\/)(.+?)(?:\.git)?$/);
  return m ? `https://${m[1] ?? m[2]}/${m[3]}` : "";
}

/** solc `src` is "byteOffset:byteLength:fileIndex" — slice the original UTF-8 source. */
function sliceSrc(content: string, src: string): string {
  const [off, len] = src.split(":").map(Number);
  return dec.decode(enc.encode(content).slice(off, off + len));
}

/** De-indent NatSpec prose. solc keeps the comment's leading whitespace on every line. */
const prose = (s?: string) => (s ?? "").split("\n").map((l) => l.trim().replace(/ {2,}/g, " ")).join("\n").trim();
/** Same, flattened for a table cell (pipes would break the row). */
const cell = (s?: string) => prose(s).replace(/\s+/g, " ").replace(/\|/g, "\\|");
/** First sentence, for index blurbs. */
const firstSentence = (s?: string) => {
  const t = cell(s);
  const m = t.match(/^(.{0,160}?[.!?])(\s|$)/);
  if (m) return m[1];
  return t.length <= 160 ? t : `${t.slice(0, 160).replace(/\s+\S*$/, "")}…`;
};

/** Overloads make solc's doc values arrays; we only ever have one match per signature here. */
const one = (d: DocEntry | DocEntry[] | undefined): DocEntry => (Array.isArray(d) ? d[0] ?? {} : d ?? {});

/** Own-property lookup. Signatures are attacker-free but `constructor` is a real solc key,
 *  and a plain `obj["constructor"]` would happily return `Object.prototype.constructor`. */
const own = <T>(o: Record<string, T> | undefined, k: string): T | undefined =>
  o && Object.hasOwn(o, k) ? o[k] : undefined;

/**
 * Merge the two NatSpec sources, field by field.
 *
 * The raw AST comment is preferred because solc's devdoc/userdoc flattens a multi-line
 * `@notice` onto one line, destroying any Markdown structure the author wrote. But the AST
 * comment is only ever the one physically above the declaration, so `@inheritdoc` and
 * members inherited from a base contract have nothing there — that is what devdoc/userdoc
 * resolves, and why it stays the fallback rather than being dropped.
 */
function mergeDoc(raw: DocEntry & Record<string, unknown>, dev: DocEntry, user: DocEntry): DocEntry & Record<string, unknown> {
  const pick = (a?: Record<string, string>, b?: Record<string, string>) => (Object.keys(a ?? {}).length ? a : b);
  return {
    ...Object.fromEntries(Object.entries(dev).filter(([k]) => k.startsWith("custom:"))),
    ...Object.fromEntries(Object.entries(raw).filter(([k]) => k.startsWith("custom:"))),
    notice: raw.notice ?? user.notice,
    details: raw.details ?? dev.details,
    params: pick(raw.params, dev.params),
    returns: pick(raw.returns, dev.returns),
  };
}

// -------------------------------------------------------------- ABI → strings

/** The canonical signature solc keys devdoc/userdoc and selectors by: structs flattened to tuples. */
function canonicalType(p: AbiParam): string {
  if (!p.type.startsWith("tuple")) return p.type;
  return `(${(p.components ?? []).map(canonicalType).join(",")})${p.type.slice("tuple".length)}`;
}
const canonicalSig = (e: AbiEntry) => `${e.name ?? ""}(${(e.inputs ?? []).map(canonicalType).join(",")})`;

/** The readable type. `internalType` keeps the declared name (`IDAO.Action[]`, not `(address,...)[]`). */
const displayType = (p: AbiParam) => (p.internalType ?? p.type).replace(/\b(contract|struct|enum) /g, "");

const param = (p: AbiParam) => [displayType(p), p.indexed ? "indexed" : "", p.name].filter(Boolean).join(" ");

function signature(e: AbiEntry): string {
  const ins = (e.inputs ?? []).map(param);
  let head: string, tail: string;
  if (e.type === "constructor") {
    head = "constructor";
    tail = e.stateMutability === "payable" ? " payable" : "";
  } else if (e.type === "event") {
    head = `event ${e.name}`;
    tail = "";
  } else if (e.type === "error") {
    head = `error ${e.name}`;
    tail = "";
  } else if (e.type === "fallback" || e.type === "receive") {
    head = e.type;
    tail = ` external${e.stateMutability === "payable" ? " payable" : ""}`;
  } else {
    head = `function ${e.name}`;
    const mut = e.stateMutability && e.stateMutability !== "nonpayable" ? ` ${e.stateMutability}` : "";
    const outs = (e.outputs ?? []).map(param);
    tail = ` external${mut}${outs.length ? ` returns (${outs.join(", ")})` : ""}`;
  }
  const flat = `${head}(${ins.join(", ")})${tail}`;
  if (flat.length <= 96 || ins.length === 0) return flat;
  return `${head}(\n${ins.map((i) => `    ${i}`).join(",\n")}\n)${tail}`;
}

// ------------------------------------------------------------ NatSpec (raw AST)

/**
 * The comment exactly as written, markers stripped.
 *
 * We cannot just use the AST's `documentation.text`: solc drops blank `///` lines from it,
 * collapsing every paragraph break in a long NatSpec block. The `documentation` node does
 * carry `src` offsets, so we re-read the comment from the original source instead.
 */
function rawDoc(content: string | undefined, doc?: AstNode): string | undefined {
  if (!doc) return undefined;
  if (!doc.src || !content) return doc.text;
  return sliceSrc(content, doc.src)
    .split("\n")
    .map((l) => l.replace(/^\s*(\/\/\/|\/\*\*|\*\/|\*)?[ \t]?/, "").replace(/\s*\*\/\s*$/, ""))
    .join("\n");
}

/** Parse NatSpec into tags. `@notice`/`@dev` keep their Markdown line structure, which
 *  solc's flattened devdoc/userdoc has already lost. */
function parseNatspec(text?: string): DocEntry & Record<string, unknown> {
  const out: DocEntry & Record<string, unknown> = { params: {}, returns: {} };
  if (!text) return out;
  let tag = "notice", key = "", buf: string[] = [];
  const flush = () => {
    // `@notice`/`@dev` bodies are free-form Markdown and keep their line breaks; the rest
    // land in table cells, so they collapse to one line.
    const block = buf.join("\n").split("\n").map((l) => l.trimEnd()).join("\n").replace(/^\n+|\n+$/g, "");
    const v = buf.join(" ").replace(/\s+/g, " ").trim();
    buf = [];
    if (!v && tag !== "notice") return;
    if (tag === "notice") out.notice = [out.notice, block].filter(Boolean).join("\n");
    else if (tag === "dev") out.details = [out.details, block].filter(Boolean).join("\n");
    else if (tag === "param") out.params![key] = v;
    else if (tag === "return") out.returns![key || String(Object.keys(out.returns!).length)] = v;
    else if (tag.startsWith("custom:")) out[tag] = v;
  };
  for (const line of text.split("\n")) {
    const m = line.trim().match(/^@(\w+(?::\w[\w-]*)?)\s*(.*)$/);
    if (m) {
      flush();
      tag = m[1];
      let rest = m[2];
      if (tag === "param" || tag === "return") {
        const km = rest.match(/^(\S+)\s*(.*)$/);
        key = km ? km[1] : "";
        rest = km ? km[2] : "";
        if (tag === "return" && !rest) { rest = key; key = ""; } // `@return desc` with no name
      } else key = "";
      buf.push(rest);
    } else buf.push(line.trim());
  }
  flush();
  if (!out.notice) delete out.notice;
  return out;
}

// -------------------------------------------------------------- md rendering

const fence = (code: string) => ["```solidity", code, "```"];

/**
 * NatSpec bodies are free-form Markdown (the OSx ones carry headings and LaTeX). Push any
 * headings they contain below the member level (`###`) so an authored heading can never
 * compete with, or break, the page's own outline.
 */
function demoteHeadings(md: string): string {
  const levels = [...md.matchAll(/^(#{1,6})\s/gm)].map((m) => m[1].length);
  if (!levels.length) return md;
  const shift = 4 - Math.min(...levels);
  if (shift <= 0) return md;
  return md.replace(/^(#{1,6})(\s)/gm, (_, h: string, s: string) => "#".repeat(Math.min(6, h.length + shift)) + s);
}

function docBlock(notice?: string, details?: string): string[] {
  const out: string[] = [];
  if (notice) out.push("", demoteHeadings(prose(notice)));
  if (details) out.push("", `> **Dev:** ${demoteHeadings(prose(details)).replace(/\n/g, "\n> ")}`);
  return out;
}

/**
 * Turns a rendered type into a Markdown cell, linked to the declaration when there is one.
 *
 * A signature lives inside a code fence and Markdown cannot link inside one, so the parameter
 * table is the only place a type can carry a link at all.
 */
type TypeLinker = { cell: (t: string) => string; resolves: (t: string) => boolean };

const PLAIN: TypeLinker = { cell: (t) => `\`${t}\``, resolves: () => false };

/** `IMajorityVoting.VoteOption[2][]` → `VoteOption`. Empty when there is nothing to link. */
function typeName(t: string): string {
  if (/[(<>=]/.test(t)) return ""; // a mapping or function type: no single declaration to point at
  return t.replace(/\[[^\]]*\]/g, "").trim().split(".").pop() ?? "";
}

/** Links to `#anchor` for a type defined on this very page, else to its own page. */
function linker(local: Set<string>, declared: Set<string>): TypeLinker {
  const target = (t: string) => {
    const n = typeName(t);
    return local.has(n) ? `#${n.toLowerCase()}` : declared.has(n) ? `{{T:${n}}}` : "";
  };
  return {
    resolves: (t) => target(t) !== "",
    cell: (t) => {
      const to = target(t);
      return to ? `[\`${t}\`](${to})` : `\`${t}\``;
    },
  };
}

function paramTable(
  label: string,
  params: { name: string; type: string }[],
  docs: Record<string, string> | undefined,
  link: TypeLinker = PLAIN,
): string[] {
  if (!params.length) return [];
  const descOf = (p: { name: string }, i: number) => docs?.[p.name] ?? docs?.[`_${i}`] ?? docs?.[String(i)] ?? "";
  // Worth a table if there is prose to add, or a type worth linking. Otherwise the signature
  // above already says everything the table would.
  if (!params.some((p, i) => descOf(p, i)) && !params.some((p) => link.resolves(p.type))) return [];
  return [
    "",
    `| ${label} | Type | Description |`,
    "| --- | --- | --- |",
    ...params.map((p, i) => `| \`${p.name || `[${i}]`}\` | ${link.cell(p.type)} | ${cell(descOf(p, i))} |`),
  ];
}

/** `@custom:x` tags, which solc passes through verbatim on every documented item. */
const customTags = (o: object | undefined): string[] =>
  Object.entries(o ?? {})
    .filter(([k]) => k.startsWith("custom:"))
    .sort()
    .map(([k, v]) => `**${k.slice(7)}:** ${cell(String(v))}`)
    .flatMap((l) => ["", l]);

/** One ABI member: signature, selector, NatSpec, param/return tables.
 *  `overloaded` widens the heading to the full signature so the anchors stay unique. */
function renderMember(e: AbiEntry, doc: DocEntry, selector?: string, overloaded = false, link: TypeLinker = PLAIN): string[] {
  const title = overloaded ? canonicalSig(e) : e.name ?? e.type;
  const out = [`### ${title}`, "", ...fence(signature(e))];
  if (selector) out.push("", `Selector: \`0x${selector}\``);
  out.push(...docBlock(doc.notice, doc.details), ...customTags(doc));
  out.push(
    ...paramTable(
      "Parameter",
      (e.inputs ?? []).map((p) => ({ name: p.name, type: displayType(p) })),
      doc.params,
      link,
    ),
  );
  out.push(
    ...paramTable(
      "Returns",
      (e.outputs ?? []).map((p) => ({ name: p.name, type: displayType(p) })),
      doc.returns,
      link,
    ),
  );
  return out;
}

// ---------------------------------------------------------------- extraction

/** Every ContractDefinition in the build, by AST id — so we can follow inheritance into lib/. */
function indexContracts(bi: BuildInfo): Map<number, { node: AstNode; path: string }> {
  const byId = new Map<number, { node: AstNode; path: string }>();
  for (const [path, src] of Object.entries(bi.output.sources)) {
    for (const n of src.ast?.nodes ?? []) {
      if (n.nodeType === "ContractDefinition") byId.set(n.id, { node: n, path });
    }
  }
  return byId;
}

const KIND_OF: Record<string, Page["kind"]> = { contract: "contract", interface: "interface", library: "library" };

/**
 * Render one contract/interface/library page.
 *
 * Members come from the **ABI** — it is the public surface by definition, and inherited
 * members and `@inheritdoc` are already resolved there. Enums, structs and constants are
 * not in the ABI, so those come from the AST, walked across the inheritance chain.
 */
function contractPage(
  node: AstNode,
  path: string,
  bi: BuildInfo,
  byId: Map<number, { node: AstNode; path: string }>,
  declared: Set<string>,
): Omit<Page, "file" | "render"> & { deps: string[] } {
  const artifact = bi.output.contracts[path]?.[node.name];
  const abi: AbiEntry[] = artifact?.abi ?? [];
  const meta = artifact?.metadata ? JSON.parse(artifact.metadata).output : {};
  const dev: Devdoc = meta.devdoc ?? {};
  const user: Userdoc = meta.userdoc ?? {};
  const selectors = artifact?.evm?.methodIdentifiers ?? {};

  const kind: Page["kind"] = node.abstract ? "abstract contract" : KIND_OF[node.contractKind] ?? "contract";
  // The declared `is A, B` list, not the C3 linearization — that is what the source says.
  const inherited: string[] = (node.baseContracts ?? [])
    .map((b: AstNode) => b.baseName?.name ?? b.baseName?.namePath)
    .filter(Boolean);

  // Constant/immutable getters are listed under `## Constants` with their value instead.
  const constants: AstNode[] = [];
  const enums: MemberDef[] = [];
  const structs: MemberDef[] = [];
  const stateVars = new Set<string>();
  // The AST declaration behind each ABI member, most-derived first (linearizedBaseContracts
  // is ordered that way), so we can read the NatSpec as it was actually written.
  const astOf = new Map<string, { n: AstNode; path: string }>();
  for (const id of node.linearizedBaseContracts ?? []) {
    const base = byId.get(id);
    if (!base) continue;
    const from = base.node.name === node.name ? undefined : base.node.name;
    for (const m of base.node.nodes ?? []) {
      if (m.nodeType === "EnumDefinition") enums.push({ n: m, from, path: base.path });
      else if (m.nodeType === "StructDefinition") structs.push({ n: m, from, path: base.path });
      else if (m.nodeType === "VariableDeclaration" && m.visibility === "public") {
        if (m.constant || m.mutability === "immutable") constants.push({ ...m, __path: base.path, __from: from });
        else stateVars.add(m.name);
      }
      const n = m.parameters?.parameters?.length ?? 0;
      const key = m.nodeType === "FunctionDefinition"
        ? (m.kind === "constructor" ? "ctor" : m.functionSelector && `fn:${m.functionSelector}`)
        : m.nodeType === "EventDefinition"
        ? `ev:${m.name}/${n}`
        : m.nodeType === "ErrorDefinition"
        ? `er:${m.name}/${n}`
        : m.nodeType === "VariableDeclaration" && m.functionSelector
        ? `fn:${m.functionSelector}`
        : undefined;
      if (key && !astOf.has(key)) astOf.set(key, { n: m, path: base.path });
    }
  }
  const constantNames = new Set(constants.map((c) => c.name));

  // Types defined on this very page link to their anchor; anything else that has a page of
  // its own links there.
  const link = linker(new Set([...enums, ...structs].map((d) => d.n.name)), declared);

  const body: string[] = [];
  const selfDoc = mergeDoc(parseNatspec(rawDoc(bi.input.sources[path]?.content, node.documentation)), dev, user);
  if (dev.title && dev.title !== node.name) body.push("", `**${cell(dev.title)}**`);
  if (dev.author) body.push("", `**Author:** ${cell(dev.author)}`);
  if (inherited.length) body.push("", `**Inherits:** ${inherited.map((b) => `{{LINK:${b}}}`).join(", ")}`);
  body.push(...docBlock(selfDoc.notice, selfDoc.details), ...customTags(selfDoc));

  const section = (heading: string, entries: AbiEntry[], docsFrom: "methods" | "events" | "errors") => {
    if (!entries.length) return;
    body.push("", `## ${heading}`);
    const count = new Map<string, number>();
    for (const e of entries) count.set(e.name ?? "", (count.get(e.name ?? "") ?? 0) + 1);
    for (const e of entries) {
      const key = e.type === "constructor" ? "constructor" : canonicalSig(e);
      const selector = own(selectors, key);
      const astKey = e.type === "constructor"
        ? "ctor"
        : e.type === "event"
        ? `ev:${e.name}/${e.inputs?.length ?? 0}`
        : e.type === "error"
        ? `er:${e.name}/${e.inputs?.length ?? 0}`
        : selector && `fn:${selector}`;
      // A public state variable's NatSpec sits under `stateVariables`, keyed by name, not signature.
      const d = one(own(dev[docsFrom], key)) ?? {};
      const flat = Object.keys(d).length ? d : stateVars.has(e.name ?? "") ? one(own(dev.stateVariables, e.name!)) : {};
      const decl = astKey ? astOf.get(astKey) : undefined;
      const raw = parseNatspec(rawDoc(bi.input.sources[decl?.path ?? ""]?.content, decl?.n.documentation));
      body.push(
        "",
        ...renderMember(
          e,
          mergeDoc(raw, flat, one(own(user[docsFrom], key))),
          selector,
          (count.get(e.name ?? "") ?? 0) > 1,
          link,
        ),
      );
    }
  };

  const byName = (a: AbiEntry, b: AbiEntry) => (a.name ?? "").localeCompare(b.name ?? "") || canonicalSig(a).localeCompare(canonicalSig(b));
  const ctor = abi.filter((e) => e.type === "constructor" || e.type === "fallback" || e.type === "receive");
  const fns = abi.filter((e) => e.type === "function" && !(constantNames.has(e.name!) && !e.inputs?.length)).sort(byName);

  section("Constructor", ctor, "methods");
  section("Functions", fns, "methods");
  section("Events", abi.filter((e) => e.type === "event").sort(byName), "events");
  section("Errors", abi.filter((e) => e.type === "error").sort(byName), "errors");

  if (constants.length) {
    body.push("", "## Constants", "", "_Public, so each is also readable through a generated getter._");
    for (const c of constants.sort((a, b) => a.name.localeCompare(b.name))) {
      const content = bi.input.sources[c.__path]?.content ?? "";
      const ns = parseNatspec(rawDoc(content, c.documentation));
      body.push("", `### ${c.name}`, "");
      if (c.__from) body.push(`_Inherited from \`${c.__from}\`._`, "");
      body.push(...fence(sliceSrc(content, c.src) + ";"));
      // The permission-ID idiom: the hash is the value you actually pass to `grant`/`isGranted`,
      // and it is the one thing the declaration does not tell you. Resolved later, via `cast keccak`.
      const lit = c.value ? sliceSrc(content, c.value.src).match(/^keccak256\(\s*"([^"\\]*)"\s*\)$/) : null;
      if (lit && !lit[1].startsWith("0x")) body.push("", `Value: {{KECCAK:${lit[1]}}}`);
      body.push(...docBlock(ns.notice, ns.details), ...customTags(ns));
    }
  }
  body.push(...memberDefs("Enums", enums, bi, "enum", link));
  body.push(...memberDefs("Structs", structs, bi, "struct", link));

  return {
    name: node.name,
    kind,
    sourcePath: path,
    body,
    summary: firstSentence(selfDoc.notice ?? selfDoc.details ?? dev.title),
    deps: inherited,
  };
}

/** Enum/struct definitions, rendered from source text plus their `@param` member docs. */
function memberDefs(
  heading: string,
  defs: MemberDef[],
  bi: BuildInfo,
  what: "enum" | "struct",
  link: TypeLinker = PLAIN,
): string[] {
  if (!defs.length) return [];
  const out = ["", `## ${heading}`];
  for (const { n, from, path } of defs.sort((a, b) => a.n.name.localeCompare(b.n.name))) {
    // The heading stays the bare name so its anchor is always `#<name>`: predictable to link
    // to, and stable if the type later moves between base contracts.
    out.push("", `### ${n.name}`, "");
    if (from) out.push(`_Inherited from \`${from}\`._`, "");
    out.push(...defBlock(n, bi, what, path, link));
  }
  return out;
}

/** The declaration itself plus a member table, for an enum or a struct. */
function defBlock(n: AstNode, bi: BuildInfo, what: "enum" | "struct", path: string, link: TypeLinker = PLAIN): string[] {
  const ns = parseNatspec(rawDoc(bi.input.sources[path]?.content, n.documentation));
  const members: { name: string; type: string }[] = what === "enum"
    ? (n.members ?? []).map((m: AstNode) => ({ name: m.name, type: "" }))
    : (n.members ?? []).map((m: AstNode) => ({ name: m.name, type: displayTypeString(m) }));
  const decl = what === "enum"
    ? `enum ${n.name} {\n${members.map((m) => `    ${m.name}`).join(",\n")}\n}`
    : `struct ${n.name} {\n${members.map((m) => `    ${m.type} ${m.name};`).join("\n")}\n}`;
  const out = [...fence(decl), ...docBlock(ns.notice, ns.details), ...customTags(ns)];
  const documented = members.some((m) => ns.params?.[m.name]);
  if (what === "enum") {
    // Always tabulated, documented or not: the ABI encodes an enum as `uint8`, so each
    // option's numeric value is the one thing a caller cannot read off the declaration.
    const cols = documented ? ["Option", "Value", "Description"] : ["Option", "Value"];
    out.push(
      "",
      `| ${cols.join(" | ")} |`,
      `| ${cols.map(() => "---").join(" | ")} |`,
      ...members.map((m, i) =>
        `| \`${m.name}\` | \`${i}\` |${documented ? ` ${cell(ns.params?.[m.name])} |` : ""}`
      ),
    );
  } else if (documented || members.some((m) => link.resolves(m.type))) {
    // The declaration already carries every field's name and type, so this earns its place
    // only when there is prose to add, or a field type worth linking.
    out.push(
      "",
      "| Field | Type | Description |",
      "| --- | --- | --- |",
      ...members.map((m) => `| \`${m.name}\` | ${link.cell(m.type)} | ${cell(ns.params?.[m.name])} |`),
    );
  }
  return out;
}

const displayTypeString = (n: AstNode) =>
  (n.typeDescriptions?.typeString ?? "").replace(/\b(contract|struct|enum) /g, "").replace(/ (memory|calldata|storage)\b/g, "");

/** A declaration at file scope (outside any contract) — its own page, per the base's convention. */
function topLevelPage(
  n: AstNode,
  path: string,
  bi: BuildInfo,
  declared: Set<string>,
): (Omit<Page, "file" | "render"> & { deps: string[] }) | null {
  const content = bi.input.sources[path]?.content ?? "";
  const ns = parseNatspec(rawDoc(content, n.documentation));
  // A standalone page has no types of its own, so every link points at a sibling page.
  const link = linker(new Set(), declared);
  let kind: Page["kind"], body: string[];
  switch (n.nodeType) {
    case "EnumDefinition":
      kind = "enum";
      body = defBlock(n, bi, "enum", path, link);
      break;
    case "StructDefinition":
      kind = "struct";
      body = defBlock(n, bi, "struct", path, link);
      break;
    case "ErrorDefinition":
      kind = "error";
      body = [
        ...fence(sliceSrc(content, n.src)),
        ...docBlock(ns.notice, ns.details),
        ...customTags(ns),
        ...paramTable(
          "Parameter",
          (n.parameters?.parameters ?? []).map((p: AstNode) => ({ name: p.name, type: displayTypeString(p) })),
          ns.params,
          link,
        ),
      ];
      break;
    case "UserDefinedValueTypeDefinition":
      kind = "type";
      body = [...fence(sliceSrc(content, n.src)), ...docBlock(ns.notice, ns.details), ...customTags(ns)];
      break;
    case "VariableDeclaration":
      if (!n.constant) return null;
      kind = "constant";
      body = [...fence(`${sliceSrc(content, n.src)};`), ...docBlock(ns.notice, ns.details), ...customTags(ns)];
      break;
    case "FunctionDefinition": // a free function
      kind = "function";
      body = [
        ...fence(sliceSrc(content, n.src).replace(/\s*\{[\s\S]*$/, "")),
        ...docBlock(ns.notice, ns.details),
        ...customTags(ns),
        ...paramTable(
          "Parameter",
          (n.parameters?.parameters ?? []).map((p: AstNode) => ({ name: p.name, type: displayTypeString(p) })),
          ns.params,
          link,
        ),
        ...paramTable(
          "Returns",
          (n.returnParameters?.parameters ?? []).map((p: AstNode) => ({ name: p.name, type: displayTypeString(p) })),
          ns.returns,
          link,
        ),
      ];
      break;
    default:
      return null;
  }
  return { name: n.name, kind, sourcePath: path, body: ["", ...body], summary: firstSentence(ns.notice ?? ns.details), deps: [] };
}

// -------------------------------------------------------------------- driver

type Repo = {
  root: string; // the git root — what `name`, `commit` and the source links are relative to
  buildRoot: string; // where forge runs; differs from `root` only for the Hardhat repos
  prefix: string; // buildRoot relative to root, "" when they are the same
  buildArgs: string[]; // extra forge flags for a project that has no foundry.toml
  name: string;
  commit: string;
  dirty: boolean;
  url: string;
  files: string[];
};

/**
 * Projects that are not Foundry. `forge` is only a solc driver, so it compiles these fine
 * once told where the sources and the remappings live; it just cannot infer it without a
 * foundry.toml. Deps come from `bun install --ignore-scripts` (see scripts/README.md).
 *
 * Temporary: both repos are being migrated to Foundry, at which point these entries and the
 * `abi-legacy` recipe go away and they join `abi-all` like everything else.
 */
const NON_FOUNDRY: Record<string, { dir: string; args: string[] }> = {
  "multisig-plugin": {
    dir: "packages/contracts",
    // Mocks are not documented, and Migration.sol imports two aliased packages that 404.
    args: ["--contracts", "src", "--lib-paths", "node_modules", "--skip", "*/mocks/*"],
  },
  "admin-plugin": {
    dir: "packages/contracts",
    args: ["--contracts", "src", "--lib-paths", "node_modules", "--skip", "*/mocks/*"],
  },
};

async function describeRepo(root: string, files: string[]): Promise<Repo> {
  const commit = await run("git", ["rev-parse", "HEAD"], root).catch(() => "");
  // Scoped to the documented files on purpose: the question is whether the pages match the
  // pinned commit, and `forge build` itself touches tracked files like `foundry.lock`.
  const dirty = (await run("git", ["status", "--porcelain", "--", ...files], root).catch(() => "")) !== "";
  const url = httpsRemote(await run("git", ["remote", "get-url", "origin"], root).catch(() => ""));
  const name = basename(root);
  const override = own(NON_FOUNDRY, name);
  const buildRoot = override ? join(root, override.dir) : root;
  // Drop what the build was told to skip, so "not in the build output" stays a real warning.
  const skips = (override?.args ?? [])
    .filter((a, i, all) => all[i - 1] === "--skip")
    .map((g) => globToRegExp(g, { globstar: true }));
  return {
    root,
    buildRoot,
    prefix: override ? override.dir : "",
    buildArgs: override?.args ?? [],
    name,
    commit,
    dirty,
    url,
    files: files.filter((f) => !skips.some((re) => re.test(relative(buildRoot, f)))),
  };
}

/**
 * Trees `forge build` compiles by default but that we never document.
 *
 * This is the single biggest cost in a run: osx carries 94 test files against 53 sources, and
 * on token-voting skipping them takes a forced build from 181 files / 32s to 107 files / 4.5s.
 * The names cover both Foundry conventions (`script` and `scripts` are both in use here).
 */
const SKIP_TREES = ["test/**", "tests/**", "test-upgrade/**", "script/**", "scripts/**"];

async function solFiles(path: string): Promise<string[]> {
  const st = await Deno.stat(path);
  if (st.isFile) return path.endsWith(".sol") ? [path] : [];
  const out: string[] = [];
  for await (const e of Deno.readDir(path)) out.push(...(await solFiles(join(path, e.name))));
  return out;
}

async function loadBuildInfo(repo: Repo): Promise<BuildInfo> {
  if (!repo.buildArgs.length && !(await Deno.stat(join(repo.buildRoot, "foundry.toml")).catch(() => null))) {
    throw new Error(
      `${repo.name}: no foundry.toml, and no entry in NON_FOUNDRY.\n` +
        `  forge can still compile it, but it needs the source dir and remappings.\n` +
        `  See scripts/README.md, "Non-Foundry repositories".`,
    );
  }
  if (repo.buildArgs.length && !(await Deno.stat(join(repo.buildRoot, "node_modules")).catch(() => null))) {
    throw new Error(
      `${repo.name}: no node_modules in ${repo.prefix}.\n` +
        `  Run \`just abi-legacy\`, which installs them first.`,
    );
  }
  const dir = await Deno.makeTempDir({ prefix: "abi-docs-" });
  try {
    console.error(`  compiling ${repo.name}…`);
    // Only trees nothing was requested from, so documenting a test helper still works.
    const skip = SKIP_TREES
      .filter((t) => !repo.files.some((f) => relative(repo.buildRoot, f).startsWith(`${t.split("/")[0]}/`)))
      .flatMap((t) => ["--skip", t]);
    await run(
      "forge",
      ["build", "--root", ".", ...repo.buildArgs, ...skip, "--build-info", "--build-info-path", dir],
      repo.buildRoot,
    );
    const merged: BuildInfo = { input: { sources: {} }, output: { sources: {}, contracts: {} } };
    const names = [...Deno.readDirSync(dir)].map((e) => e.name).filter((n) => n.endsWith(".json")).sort();
    for (const n of names) {
      const bi: BuildInfo = JSON.parse(await Deno.readTextFile(join(dir, n)));
      Object.assign(merged.input.sources, bi.input.sources);
      Object.assign(merged.output.sources, bi.output.sources);
      Object.assign(merged.output.contracts, bi.output.contracts);
    }
    return merged;
  } finally {
    await Deno.remove(dir, { recursive: true });
  }
}

function pagesFor(repo: Repo, bi: BuildInfo): Page[] {
  const byId = indexContracts(bi);
  const raw: (Omit<Page, "file" | "render"> & { deps: string[] })[] = [];

  const asts = repo.files.sort().flatMap((abs) => {
    const rel = relative(repo.buildRoot, abs);
    const ast = bi.output.sources[rel]?.ast;
    if (!ast) {
      console.error(`  ! ${rel}: not in the build output (unreachable from the compilation targets?)`);
      return [];
    }
    return [{ rel, ast }];
  });

  // Every name that will get a page, known before any body is rendered so a type reference
  // can be linked as it is written.
  const declared = new Set<string>(
    asts.flatMap(({ ast }) => (ast.nodes ?? []).map((n: AstNode) => n.name).filter(Boolean)),
  );

  for (const { rel, ast } of asts) {
    for (const n of ast.nodes ?? []) {
      if (n.nodeType === "ContractDefinition") raw.push(contractPage(n, rel, bi, byId, declared));
      else {
        const p = topLevelPage(n, rel, bi, declared);
        if (p) raw.push(p);
      }
    }
  }

  // `<Name>.md`, disambiguated by directory only where two declarations collide.
  const seen = new Map<string, number>();
  for (const p of raw) seen.set(p.name, (seen.get(p.name) ?? 0) + 1);
  return raw.map((p) => {
    let file = `${p.name}.md`;
    if ((seen.get(p.name) ?? 0) > 1) {
      const d = dirname(p.sourcePath).replace(/^\.$/, "").replace(/\//g, "-");
      file = `${[d, p.name].filter(Boolean).join("-")}.md`;
      console.error(`  ! ${p.name} declared more than once; writing ${file}`);
    }
    return {
      ...p,
      file,
      render: (linkable: Set<string>) => {
        const repoPath = [repo.prefix, p.sourcePath].filter(Boolean).join("/");
        const src = repo.url && repo.commit
          ? `[\`${repoPath}\`](${repo.url}/blob/${repo.commit}/${repoPath})`
          : `\`${repoPath}\``;
        const head = [
          "---",
          "type: reference", // precise lookup material, per WORKFLOW.md's vocabulary
          `title: ${p.name}`,
          `kind: ${p.kind}`, // the Solidity kind, orthogonal to the wiki `type`
          `source: ${repo.name}/${repoPath}`,
          `summary: ${JSON.stringify(p.summary)}`,
          "---",
          "",
          `# ${p.name}`,
          "",
          `**${p.kind[0].toUpperCase() + p.kind.slice(1)}** · ${src}`,
        ];
        const body = p.body
          .join("\n")
          .replace(/\{\{LINK:(\w+)\}\}/g, (_, n) => (linkable.has(n) ? `[\`${n}\`](./${n}.md)` : `\`${n}\``))
          // A type link, resolved now that collisions are known: a renamed page is not
          // `./<Name>.md`, so it degrades to plain code rather than a broken link.
          .replace(/\]\(\{\{T:(\w+)\}\}\)/g, (_, n) => (linkable.has(n) ? `](./${n}.md)` : "]()"))
          .replace(/\[`([^`]*)`\]\(\)/g, (_, t) => `\`${t}\``);
        return `${[...head, body].join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
      },
    };
  });
}

// ------------------------------------------------------------------- indexes

const GROUPS: [string, Page["kind"][]][] = [
  ["Contracts", ["contract", "abstract contract"]],
  ["Interfaces", ["interface"]],
  ["Libraries", ["library"]],
  ["Structs", ["struct"]],
  ["Enums", ["enum"]],
  ["Types", ["type"]],
  ["Errors", ["error"]],
  ["Constants", ["constant"]],
  ["Functions", ["function"]],
];

type Row = { name: string; kind: string; file: string; summary: string };

/** Read back every page in a repo dir so the index reflects the whole tree, not just this run. */
async function readRows(dir: string): Promise<Row[]> {
  const rows: Row[] = [];
  for await (const e of Deno.readDir(dir)) {
    if (!e.isFile || !e.name.endsWith(".md") || e.name === "index.md") continue;
    const text = await Deno.readTextFile(join(dir, e.name));
    const fm = text.match(/^---\n([\s\S]*?)\n---/);
    const get = (k: string) => fm?.[1].match(new RegExp(`^${k}: (.*)$`, "m"))?.[1] ?? "";
    let summary = get("summary");
    try { summary = JSON.parse(summary); } catch { /* unquoted or absent */ }
    rows.push({ name: get("title") || e.name.replace(/\.md$/, ""), kind: get("kind"), file: e.name, summary });
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name));
}

async function writeRepoIndex(dir: string, repo: Repo) {
  const rows = await readRows(dir);
  const src = repo.url
    ? `[\`${repo.name}\`](${repo.url})` + (repo.commit ? ` at commit [\`${repo.commit.slice(0, 8)}\`](${repo.url}/commit/${repo.commit})` : "")
    : `\`${repo.name}\``;
  const out = [
    `# ${repo.name} — ABI reference`,
    "",
    `Generated from ${src}${repo.dirty ? " _(working tree was dirty when generated)_" : ""}.`,
    "",
    `${rows.length} entries. Regenerate with \`just abi\`.`,
  ];
  for (const [heading, kinds] of GROUPS) {
    const group = rows.filter((r) => kinds.includes(r.kind as Page["kind"]));
    if (!group.length) continue;
    out.push("", `## ${heading}`, "");
    for (const r of group) out.push(`- [\`${r.name}\`](./${r.file})${r.summary ? ` — ${r.summary}` : ""}`);
  }
  await Deno.writeTextFile(join(dir, "index.md"), out.join("\n") + "\n");
}

async function writeRootIndex(abiDir: string) {
  const repos: { name: string; count: number }[] = [];
  for await (const e of Deno.readDir(abiDir)) {
    if (!e.isDirectory) continue;
    repos.push({ name: e.name, count: (await readRows(join(abiDir, e.name))).length });
  }
  repos.sort((a, b) => a.name.localeCompare(b.name));
  const out = [
    "# ABI reference",
    "",
    "The **generated** lookup surface for the protocol's Solidity: every public function, event, error, enum, struct and constant of every contract, with its NatSpec, one page per declaration.",
    "",
    "It is a navigation layer of its own, entered here rather than followed from the graph. The hand-written pages under [core](../core/index.md), [framework](../framework/index.md), [plugins](../plugins/index.md) and the rest explain what things *are* and *why*; these pages are where you check an exact signature. Link *into* them from a concept page whenever a reader will want the precise surface; never distil from them by hand.",
    "",
    "Generated by `just abi` from the sibling repositories (see [Source repositories](../repositories.md)). **Do not edit these files** — the next run overwrites them.",
    "",
    "## Repositories",
    "",
    ...repos.map((r) => `- [${r.name}](./${r.name}/index.md) — ${r.count} entries`),
  ];
  await Deno.writeTextFile(join(abiDir, "index.md"), out.join("\n") + "\n");
}

// ---------------------------------------------------------------------- main

/** Resolve the `keccak256("…")` constants left as placeholders, memoised across the run. */
const keccakCache = new Map<string, string>();
async function resolveKeccak(md: string, cwd: string): Promise<string> {
  for (const [, s] of md.matchAll(/\{\{KECCAK:([^}]*)\}\}/g)) {
    if (!keccakCache.has(s)) keccakCache.set(s, await run("cast", ["keccak", s], cwd).catch(() => ""));
  }
  return md
    .replace(/^Value: \{\{KECCAK:([^}]*)\}\}\n/gm, (_, s: string) => {
      const v = keccakCache.get(s);
      return v ? `Value: \`${v}\`\n` : "";
    })
    .replace(/\n{3,}/g, "\n\n");
}

async function wikiRoot(): Promise<string> {
  let d = dirname(dirname(new URL(import.meta.url).pathname));
  while (!(await Deno.stat(join(d, "wiki.toml")).catch(() => null))) {
    const up = dirname(d);
    if (up === d) throw new Error("no wiki.toml above scripts/");
    d = up;
  }
  return d;
}

if (import.meta.main) {
  const args = Deno.args.filter((a) => !a.startsWith("-"));
  if (!args.length) {
    console.error("usage: abi-docs.ts <path.sol | dir> …");
    Deno.exit(2);
  }

  const abiDir = join(await wikiRoot(), "abi");
  const groups = new Map<string, string[]>();
  for (const a of args) {
    const abs = resolve(a);
    const root = await run("git", ["rev-parse", "--show-toplevel"], (await Deno.stat(abs)).isDirectory ? abs : dirname(abs));
    for (const f of await solFiles(abs)) (groups.get(root) ?? groups.set(root, []).get(root)!).push(f);
  }

  let total = 0;
  for (const [root, files] of [...groups].sort()) {
    const repo = await describeRepo(root, [...new Set(files)]);
    if (repo.dirty) console.error(`  ! ${repo.name}: working tree is dirty; source links may not match`);
    const pages = pagesFor(repo, await loadBuildInfo(repo));
    const linkable = new Set(pages.filter((p) => p.file === `${p.name}.md`).map((p) => p.name));
    const dir = join(abiDir, repo.name);
    await Deno.mkdir(dir, { recursive: true });
    for (const p of pages) {
      await Deno.writeTextFile(join(dir, p.file), await resolveKeccak(p.render(linkable), repo.root));
    }
    await writeRepoIndex(dir, repo);
    console.error(`  ${repo.name}: ${pages.length} pages`);
    total += pages.length;
  }
  await writeRootIndex(abiDir);
  console.error(`${total} pages written to abi/`);
}
