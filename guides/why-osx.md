---
type: guide
title: "Why OSx: the organization that can reinvent itself"
source: osx/README.md
---

# Why OSx: the organization that can reinvent itself

*An executive introduction. No code, read this for what OSx means for an organization, then follow the links if you want the technical detail.*

No organization stays the same. It starts small and informal, grows, adds functions, changes how it makes decisions, spins up new activities and retires old ones. The one constant is change. Most on-chain organizations aren't built for that: their rules are hard-coded into a contract, and changing anything of substance means deploying a *new* contract and migrating everything to it, the treasury, the token, the integrations, the history, the address other people rely on. Evolving the organization means rebuilding it.

**Aragon OSx is built the other way around.** It treats a DAO as a small, permanent core, one contract that holds the assets, carries out decisions, and owns the rulebook for who is allowed to do what, and lets everything *around* that core be added, replaced, and upgraded over time. The organization evolves in place. Same treasury, same address, same identity; new capabilities and new rules as the organization needs them.

## Three ideas, one payoff

- **The core stays lean.** The [DAO](../core/dao.md) itself does only three things: hold funds, execute decisions, and answer "is this allowed?". It is deliberately minimal, and that is a feature, there is very little in it to break, and it rarely needs to change.
- **Capabilities are [plugins](../framework/plugins.md).** Governance (a multisig, token voting, staged approvals), treasury automation, membership, anything, is a module you install onto the DAO and can later upgrade or remove. The organization gains and sheds capabilities without being rebuilt.
- **One rulebook governs everything.** A single [permission system](../core/permissions.md) decides who may do what, across the DAO and all its plugins. There is one place to reason about authority, not a patchwork per feature.

The payoff is the thing organizations actually need: **you can change how the organization works without tearing it down.** Move from a founder-run multisig to full token voting, then to a staged process where a council can veto, all on the *same* DAO, its funds and history untouched. Add payroll or buyback automation years after launch. Wind a capability down when it's no longer needed. The organization can pivot, reinvent itself, and outlive any particular way it happened to be run at the start.

## Change, always controlled

Flexibility usually trades against safety. OSx is designed so it doesn't have to:

- **Nothing changes by accident.** A plugin never arrives loose. It comes with a [setup](../framework/plugin-setup.md) that spells out exactly what will be deployed and which permissions will be granted or revoked, applied as a single, reviewable, all-or-nothing step. Governance approves the *exact* change before it happens.
- **The organization governs itself.** After setup, no founder, deployer, or Aragon-controlled key holds power over a DAO, [the DAO holds authority over itself](../core/dao.md#deployment-and-the-root-bootstrapping-problem), so every change runs through the organization's own governance.
- **Small core, audited.** Because the core is minimal and the authorization model is one shared layer, there is little surface for something to go wrong, and that surface is [audited repeatedly](https://github.com/aragon/osx/tree/main/audits) (by firms including Halborn and Code4rena, across releases). Security here is a design choice, a lean, well-reviewed core, not a bolt-on.

## Where to go next

- Curious how it actually works? Start with [what a DAO is](../core/dao.md) and [the permission system](../core/permissions.md), the two ideas everything else builds on.
- Want to try it? [A hands-on tour of OSx](./hands-on-tour.md) stands up a DAO and makes it act, in one short Foundry test.
- Ready to launch one properly? [Deploy your first DAO](./deploy-a-dao.md) hands control to a governance plugin from the first block.

OSx is, in one line, the infrastructure for an organization that expects to change, and intends to survive doing so.
