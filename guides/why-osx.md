---
type: guide
title: "Why OSx: the organization that can reinvent itself"
source: osx/README.md
---

# Why OSx: the organization that can reinvent itself

*An executive, no-code introduction to what OSx means for an organization. Follow the links when you want the technical detail.*

Organizations start small and informal, grow, add functions, change how they make decisions, start new activities, and retire old ones. Most onchain organizations have rules hard-coded into a contract. Substantial changes require deploying a *new* contract and migrating the treasury, token, integrations, and history, while changing the address other people rely on.

**Aragon OSx lets an organization change without replacing its DAO.** The DAO is a small, permanent core: one contract holds the assets, carries out decisions, and owns the permissions that determine who may do what. Capabilities *around* that core can be added, replaced, and upgraded over time. The organization keeps the same treasury, address, and identity while gaining new capabilities and rules as it needs them.

<a id="three-ideas-one-payoff"></a>

## How OSx supports change

- **The core stays small.** The [DAO](../core/dao.md) itself does only three things: hold funds, execute decisions, and answer "is this allowed?". Its limited responsibilities leave little code that can fail or needs to change.
- **Capabilities are [plugins](../framework/plugins.md).** Governance (a multisig, token voting, staged approvals), treasury automation, membership, anything, is a module you install onto the DAO and can later upgrade or remove. The organization gains and sheds capabilities without being rebuilt.
- **One permission system governs everything.** A single [permission system](../core/permissions.md) decides who may do what, across the DAO and all its plugins. There is one place to reason about authority.

You can move from a founder-run multisig to full token voting, then to a staged process where a council can veto, all on the **same DAO**, with its funds and history untouched. Add payroll or buyback automation years after launch, or remove a capability when it's no longer needed.

<a id="change-always-controlled"></a>

## How governance controls changes

OSx uses governed setup changes and a small, audited core to make that flexibility safe:

- **Governance approves plugin changes.** Each plugin comes with a [setup](../framework/plugin-setup.md) that specifies exactly what will be deployed and which permissions will be granted or revoked, applied as a single, reviewable, all-or-nothing step. Governance approves the *exact* change before it happens.
- **The organization governs itself.** After setup, no founder, deployer, or Aragon-controlled key holds power over a DAO. [The DAO holds authority over itself](../core/dao.md#deployment-and-bootstrapping-root), so every change runs through the organization's own governance.
- **Small core, audited.** The minimal core and shared authorization layer limit the code where errors can occur. That code is [audited repeatedly](https://github.com/aragon/osx/tree/main/audits) across releases, by firms including Halborn and Code4rena. Keeping the core small and reviewing it supports the protocol's security.

## Where to go next

- To see how it works, start with [what a DAO is](../core/dao.md) and [the permission system](../core/permissions.md), the two ideas everything else builds on.
- To try it, [A hands-on tour of OSx](./hands-on-tour.md) stands up a DAO and makes it act, in one short Foundry test.
- To launch one with governance in control from the first block, follow [Deploy your first DAO](./deploy-a-dao.md).

OSx is infrastructure for an organization that expects to change over time.
