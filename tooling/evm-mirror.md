---
type: concept
title: EVM Mirror
tags: [security]
source: evm-mirror/README.md
---

# EVM Mirror

EVM Mirror is Aragon's in-house CLI for answering one high-stakes question: **does the code actually running on-chain match the code that was reviewed?** It fetches a contract's verified sources from the block explorer (Etherscan V2 and compatibles) and diffs them, file by file, against a reference, a local Foundry checkout at a specific commit, or another on-chain contract. It's the tool the [deployment ceremony](../deployment/deployment-checklist.md) ends with.

## The gap it closes

Three artifacts quietly drift apart: the **audited git commit** (what reviewers read), the **deployed bytecode** (what users actually interact with), and the **verified source** on a block explorer (what compiles to that bytecode). The audit report names the commit; the explorer names the source; *nothing automatically proves all three are the same code*. A subtle mismatch, a swapped dependency, an edited line between audit and deploy, hides exactly in that gap, and checking dozens of source files per address across networks by hand is tedious and error-prone. EVM Mirror automates the comparison and answers in seconds, turning "we're pretty sure it's the audited code" into a verified fact.

It grew out of real operational load: deploying and upgrading across 15+ chains (every release and plugin adds another contract set to re-check), and security-council work, reviewing upgrades, validating proposals, or acting as an independent signer, where an assessment is only trustworthy if it maps to the code actually running on-chain.

## What it does

- **`mirror verify`** — diff one or more on-chain addresses against a local source of truth (a git checkout, an installed package, a release artifact, any directory; it's agnostic to how you manage the code). It compares the **complete set** of verified source files the explorer returns, imported libraries and dependencies included, not just the root contract. This is the "deployed == reviewed" check.
- **`mirror diff`** — diff two on-chain contracts against each other (e.g. the same contract on two chains).
- **`mirror clone`** — download a verified contract's sources into a ready-to-build local Foundry project (it generates `foundry.toml` and `remappings.txt` and rewrites `@openzeppelin/…`-style paths for Foundry).
- **`--follow-proxy`** — on any command, resolve a proxy to its implementation, so you compare the logic, not the proxy shell.

## Why it's built the way it is

- **Foundry-first.** It reads your `remappings.txt` and resolves imports exactly as your project does, so verifying a deployment against the repo that produced it "just works."
- **Minimal and secure by default.** No Python, no Docker, no GitHub token, just a list of addresses and (on some networks) an Etherscan API key. It runs on Deno, whose permission model (network + read-only file access only) blocks supply-chain attacks from transitive dependencies, and it keeps its own dependency set tiny.
- **Multi-chain on one key.** Uses Etherscan's V2 multi-chain API and auto-detects the endpoint (Etherscan, Routescan) for a given chain id.

It's a fresh take on source verification: Aragon used Lido's DiffyScan extensively, then outgrew it, needing to work across arbitrary contracts, many chains, and automated pipelines without repo-specific configuration, and rebuilt the idea dependency-free and Foundry-first. The article [*Mind the gap between the audit and deployment*](https://blog.aragon.org/evm-mirror-mind-the-gap-between-audit-and-deployment/) lays out the thinking.

## Keep in mind

- **It proves source parity, not behavior.** A clean diff means the verified on-chain sources match your reference; it doesn't judge whether that code is *correct*, that's what the audit the commit corresponds to is for.
- **Same-repo assumption.** Verifying is smoothest against the repo that deployed the contract; comparing against a differently-structured repo needs explicit remappings.
- **Verify against what you deployed.** The reference is the exact commit that produced the deployment (and the audit it maps to), not a generic "latest."

## See also

- [The deployment checklist](../deployment/deployment-checklist.md) — the ceremony's attest step diffs the deployment with EVM Mirror.
- [just-foundry](./just-foundry.md) — the task runner those deployments run on.
- [Source repositories](../repositories.md) — where EVM Mirror and the rest of the code live.
