---
type: concept
title: OSx compared
tags: [permissions, security, governance]
---

# OSx compared

Every access-control system on EVM answers the same question: may this caller do this thing? Where they differ is more basic. Each one keeps that answer in a different place, attached to a different thing, and almost everything else follows from that choice.

This page compares OSx with the three systems it most often sits beside, or inside:

- **OpenZeppelin Contracts**: `Ownable`, `AccessControl`, and the newer `AccessManager`. The default for a single contract.
- **Safe + Zodiac**: a Safe account extended with Modules, Guards and Modifiers. The default for an organization that holds assets.
- **Hats Protocol**: roles as non-transferable ERC-1155 tokens in an admin tree.

For the OSx model itself, read [the permission system](./core/permissions.md) first.

## Each model at a glance

### OpenZeppelin: authorization lives in the function

Start with the simplest thing that works. `Ownable` stores a single `address owner`, and the `onlyOwner` modifier checks the caller against it. One admin, one check, nothing to configure.

`AccessControl` replaces that single owner with named roles. A role is just a `bytes32` constant, conventionally `keccak256("MINTER_ROLE")`, and `onlyRole(MINTER_ROLE)` gates the function. Accounts are added and removed with `grantRole` and `revokeRole`. Every role has an admin role allowed to do that granting, and unless you say otherwise it is `DEFAULT_ADMIN_ROLE`, which is `bytes32(0)`.

Both share one property: the rules are compiled into the contract they protect. Deploy a new version of that contract and you start from an empty table, re-granting everything by hand. There is also nowhere to ask "what can this organization do", because the answer is scattered across however many contracts you deployed.

[`AccessManager`](https://docs.openzeppelin.com/contracts/5.x/access-control), added in Contracts 5.x, breaks that pattern on purpose. The rules move out into one manager contract. A protected contract marks its functions `restricted` and asks the manager, through `canCall`, whether the caller is allowed.

The manager is richer than a role list. Roles are `uint64` numbers rather than hashes. `setTargetFunctionRole(target, selectors, roleId)` says which role may call which functions on which contract. `grantRole(roleId, account, executionDelay)` can give a member a delay, so their calls have to be scheduled and then executed rather than sent directly. And `setTargetClosed` is a break-glass that shuts a contract off entirely.

OpenZeppelin Contracts is a library, not a full product. You inherit from it, and the organization that results is whatever your team designs, deploys and maintains. Nothing is running that you can point at, you own the release lifecycle, and the answer to "who administers this" is only ever the one you built.

### Safe + Zodiac: authorization lives in the call path

A plain Safe has one rule: *m* of *n* owners sign a transaction and `execTransaction` runs it. This involves no roles and no per-function scoping. If you are an owner and enough co-owners agree, the Safe does what you ask.

[Zodiac](https://www.zodiac.eco/) is a set of conventions for extending that. Its word for the account being extended is the **Avatar**, which in practice means the Safe.

A **Module** is a contract you enable on the Safe. Once enabled it can make the Safe act unilaterally by calling `execTransactionFromModule`. What surprises many is that it needs no owner signatures to operate. Being enabled *is* the authorization. This is why Safe's own documentation warns that a malicious module can take over the account.

A **Guard** is the counterweight. It runs a check before a transaction (`checkTransaction`) and another after it (`checkAfterExecution`), and it can block execution.

A **Modifier** sits between a module and the avatar. It implements the avatar interface itself, so the module thinks it is talking to the Safe while the modifier gets to intercept. The [Roles Modifier](https://github.com/gnosisguild/zodiac-modifier-roles) restricts a role's members to specific target contracts, specific function selectors, conditions on individual call parameters, and which `ExecutionOptions` are permitted (sending ETH, using delegatecall). The Delay modifier is simpler, imposing a timelock.

The rule is not attached to the function being protected. Instead, it lives on the route the call travels to get there.

Note: these are two products from two teams. Safe is maintained by the Safe ecosystem, Zodiac by Gnosis Guild, with separate repositories, audits and release schedules. Day to day that is invisible but anything you assemble across the two, you also upgrade across two roadmaps.

### Hats: authorization is a credential you wear

A [hat](https://docs.hatsprotocol.xyz/) is a token that represents a role. It is ERC-1155 and non-transferable, and holding a balance of 1 makes you its *wearer*. You cannot hand your hat to someone else; only an admin can move it.

Hierarchy is built into the identifier. A hat ID is a 32-byte bitmap that encodes the entire chain of admins above it. A **tophat** sits at the root of a tree, and every other hat is administered by another hat, so authority over a role is itself a role.

Two pluggable modules decide whether a hat currently counts. An **eligibility** module decides who may wear it and whether they are in good standing. A **toggle** module decides whether the hat is active at all. Both are consulted inside `balanceOf`, which means revocation takes effect immediately rather than waiting for someone to send a transaction.

Gating on a hat is therefore just a balance check: `balanceOf(who, hatId) == 1`, or the friendlier `isWearerOfHat`. Note that Hats does *not* execute things. It does answer "who holds this role" but leaves enforcement to whatever reads the answer, most often a Safe through Hats Signer Gate.

So Hats is a primitive rather than a complete system. There is no treasury, no execution, no proposals: you pair it with something that acts. That narrowness is on purpose, and it is why Hats composes with everything else on this page, OSx included.

### OSx: authorization is a database the organization owns

A permission in OSx is a triple: `(where, who, permissionId)`. This is, the contract being called, the caller being authorized, and a hashed name for the capability, such as `EXECUTE_PERMISSION_ID`.

Those triples are stored in the [DAO](./core/dao.md)'s own storage, because the DAO is the `PermissionManager`. So individual contracts keep no access lists of their own. A [plugin](./framework/plugins.md) gates a function with `auth(...)`, and that call [resolves against its DAO](./common/auth.md) instead of against anything the plugin controls.

Any grant can carry a [condition](./common/permission-conditions.md): a contract consulted at call time, which receives the full calldata and can answer yes or no based on the logic it implements. That is where time windows, spending caps and per-argument rules live.

What makes the rest governable is the `ROOT_PERMISSION_ID`. The permission to make the DAO grant and revoke permissions is itself an ordinary permission in the same table. So the power to change the rules is handed out the same way as every other power. In a healthy DAO it is held by the DAO itself.

OSx takes the opposite trade to the other three. It is a framework rather than a library or a primitive: the permission database, execution and a versioned install system arrive as one thing from one team. The tradeoff is that you take on the whole model to use any of it. [Where other options fit better](#where-other-options-fit-better) is honest about the rest.

## Axis by axis

| | OpenZeppelin | Safe + Zodiac | Hats | OSx |
|---|---|---|---|---|
| **What it is** | a library you inherit from and assemble yourself | two products, two teams, two release schedules | a role primitive, paired with something that executes | a framework you deploy and operate as one piece |
| **State lives** | in each contract (`AccessControl`); in one manager (`AccessManager`) | in the Safe (owners, module list) and in each Modifier | in the Hats singleton, shared by all orgs | in each DAO's own storage |
| **Addressed by** | role → function, per contract | route → target + selector + params | wearer → hat | `(where, who, permissionId)` + calldata |
| **Who may change it** | role admin / `ADMIN_ROLE` | Safe owners | the admin *hat* | whoever holds `ROOT` (tipically the DAO) |
| **Evaluated at call time** | nothing beyond stored membership (`AccessManager` adds delays) | the *call*, on paths through a Guard or Modifier | the *wearer*, via eligibility and toggle | both, via any [condition](./common/permission-conditions.md) contract |
| **Survives the target contract** | no, dies with it | partly; the Safe outlives its modules | yes, hats are external | yes, the DB is the DAO |
| **Readable by third parties** | `hasRole`, per contract | `isOwner`, module list | `isWearerOfHat`, designed for it | `hasPermission`, `view` and public |

### Where the authorization state lives

Everything else follows from this one. With `Ownable` and `AccessControl` the rules sit inside the thing they protect, so replacing the contract means re-establishing them, and there is nowhere to ask what an organization as a whole can do. `AccessManager`, Zodiac's Roles Modifier and the OSx permission DB all pull the rules out into a contract of their own. Hats goes furthest and makes it a shared singleton.

OSx and `AccessManager` are closest here, and the difference is ownership. An `AccessManager` is infrastructure you point contracts at. The OSx permission DB is the organization itself: the same contract that holds the treasury and executes actions. "Who may do what" and "what the DAO owns" are two things that cannot drift apart.

### What can be addressed

`AccessControl` addresses a function on one contract. `AccessManager` addresses a `(target, selector)` pair. The Zodiac Roles Modifier goes finer than either for outbound calls, down to individual parameter conditions and whether delegatecall or value transfer is permitted. Hats is agnostic by design: a hat is a role, and what the role means is up to whoever reads it.

OSx addresses `(where, who, permissionId)`, where `permissionId` names a capability like `EXECUTE_PERMISSION_ID` rather than a function selector. Capability naming is broader than a selector, but the `auth` modifier forwards the complete `msg.data` to any attached condition, so argument-level precision is available if needed. It just isn't the primary axis. `ANY_ADDR` allows wildcards in the `who` or `where` slot, with guardrails: a wildcard on `where` is only reachable through `grantWithCondition`. Permissions like `ROOT` can never be wildcarded, and the [three tiers do not merge](./core/permissions.md#the-wildcard-any_addr).

### Who may change the rules

`AccessControl` has role admins, defaulting to `DEFAULT_ADMIN_ROLE`, which in practice is often a single EOA. A Safe's module and guard list is changed by the owners, so owner quorum is the root of all authority and any Zodiac scoping ultimately rests on it. Hats is interesting in the sense that a hat's admin is another hat, so authority over authority is expressed in the same primitive as authority itself, and delegation is inherent in the ID.

OSx follows a similar approach. `ROOT_PERMISSION_ID` is an ordinary permission in the ordinary table, so the power to grant is granted like everything else. With a few particularities: ROOT is not a runtime bypass: `isGranted` never consults it, so a ROOT holder still cannot `execute` without holding `EXECUTE_PERMISSION_ID`. What they can do is grant it to themselves first. And in a healthy DAO, ROOT is held by the DAO itself, so every permission change has to go through a proposal. Neither Safe owners nor a `DEFAULT_ADMIN_ROLE` holder has that property by construction.

### Dynamic permissions

Every system here lets an administrator take access away by sending a transaction: `revokeRole`, removing a Safe owner, burning a hat or `revoke`. A very different thing is **evaluating a permission when the call is made**.

Where systems do evaluate something, it tends to be one of two things: **who** (is this account still entitled, right now?) or **what** (is this particular call, with these arguments, allowed?).

`AccessControl` evaluates neither. `hasRole` is a mapping lookup, so the answer moves only when `grantRole` or `revokeRole` are used. Membership is mutable, but dynamic checks are not possible. If entitlement should depend on a token balance, a deadline or a slashing event, something off-chain has to notice and send the revocation. `AccessManager` adds time (delays, scheduling, closing a target) but still no logic about the caller or the call.

**Hats is dynamic about who, not about what.** Every read of `balanceOf` consults the hat's eligibility and toggle modules, so an eligibility contract can strip a wearer the instant some on-chain fact changes, with nobody sending a revocation transaction. That is genuinely dynamic, but Hats never sees the call: it is not in the execution path, it holds no calldata, and it has no idea which function you are about to invoke. It answers "does this account still hold the role", nothing more.

**Zodiac is dynamic about what, not about who.** Guards and the Roles Modifier inspect the outbound call, down to individual parameters. Role membership itself is a plain list. And the check only happens on calls that actually route through the module or modifier; anything reaching the Safe another way never meets it.

**OSx conditions cover both.** A condition is any contract implementing `IPermissionCondition`, called with `(where, who, permissionId, data)` where `data` is the full calldata of the call being authorized. So it can decide on the caller, on the arguments, on the clock, on a token balance, on another contract's state, or any combination. It runs on every check, because there is only one path and the check is on it.

OSx conditions fail closed, so a revert counts as "denied" rather than surfacing an error. And a condition on a specific grant does not fall through to a broader wildcard that would have allowed the call. [`RuledCondition`](./common/ruled-condition.md) covers the common cases as a rule list, so simple policies need no new Solidity.

### Whether the rule outlives the contract

An `AccessControl` list dies with its contract, and migrating means re-granting everything. A Safe outlives its modules, so swapping a module keeps owners and assets intact. Hats are external to every consumer, so a role survives any contract that reads it.

OSx is built around this principle too. Because permissions live in the DAO and plugins are installed against it, capabilities can be [added, updated and removed](./framework/plugin-setup-processor.md) across a DAO's lifetime without redeploying the organization.

### Composition and packaging

This is the one axis where OSx has something the others don't. Everywhere else, wiring a new capability is a sequence of manual steps: deploy the contract, enable the module, set the guard, scope the role, grant the role admin. Each step is separately fallible and separately reviewable, and a half-applied change leaves a security gap to audit.

OSx makes that wiring a declared, atomic artifact. A [plugin setup](./framework/plugin-setup.md) prepares a deployment and returns a list of permission changes requesting what to grant and revoke. The [PluginSetupProcessor](./framework/plugin-setup-processor.md) stored it as a reviewable prepare-then-apply step that the DAO can confirm, and the [PluginRepo](./framework/plugin-repo.md) versions every build. What you review is a permission diff rather than a runbook.

### Who else can read it

`hasRole` is public but per-contract. Safe exposes `isOwner`. Hats is explicitly a shared credential layer.

OSx's `hasPermission` is `view` and callable by anyone, which makes a DAO's permission table a public authorization service. Other contracts could gate themselves on a DAO's permissions with no cooperation from the DAO, which is exactly how [EIP-1271 signature validation](./core/signature-validation.md) works, and why "who may do what on this DAO" is reusable well beyond the DAO's own functions.

## Doing it the OSx way

### Coming from OpenZeppelin

| OpenZeppelin | OSx |
|---|---|
| `Ownable` + `onlyOwner` | `grant(theContract, alice, SOME_PERMISSION_ID)`. Grant it to the DAO instead of to Alice and every use will need a proposal |
| `bytes32 MINTER_ROLE` + `onlyRole` | [`auth(MINT_PERMISSION_ID)`](./common/auth.md) guarding the function |
| `grantRole` / `revokeRole` | `grant` / `revoke`, gated by `ROOT_PERMISSION_ID` |
| `DEFAULT_ADMIN_ROLE` | `ROOT_PERMISSION_ID` |
| `AccessManager` + `restricted` | the DAO's permission DB + [`auth(permissionID)`](./common/auth.md) |
| `setTargetFunctionRole(target, sel, role)` | `grant(where, who, permissionId)`, named by capability rather than selector |
| execution delay / `schedule` | a [condition](./common/permission-conditions.md) reading `block.timestamp`, or a governance plugin that owns timing |

What has to shift in your head is this: a role is not held by an account globally, it is a fact about a `(where, who)` pair. The closest thing to `onlyRole` is `auth`, which looks identical at the call site but resolves in a contract the plugin doesn't own.

### Coming from Safe + Zodiac

| Safe / Zodiac | OSx |
|---|---|
| the Safe (avatar) | the [DAO](./core/dao.md) |
| owners + threshold | the [Multisig plugin](./plugins/multisig-plugin.md), a plugin rather than the root of authority |
| `enableModule` | install a [plugin](./framework/plugins.md) and grant it `EXECUTE_PERMISSION_ID` |
| `execTransactionFromModule` | [`dao.execute(...)`](./core/execution.md) |
| a Guard | a [condition](./common/permission-conditions.md) on the relevant permission |
| Roles Modifier scoping | a condition, often built with [`RuledCondition`](./common/ruled-condition.md) |
| Delay Modifier | a condition on time, or the [SPP plugin](./plugins/spp-plugin.md) |

A Safe module bypasses the owners entirely; an OSx plugin bypasses nothing, because it holds a permission subject to the same check as every other caller. And Safe's original Transaction Guard (1.3.0) covers only the owner `execTransaction` path, leaving module calls unguarded; Module Guards arrived only in Safe 1.5.0, as `setModuleGuard` and `checkModuleTransaction`. OSx has one path and one check, so there is no equivalent gap to keep in mind.

You don't have to choose, either. [`SafeOwnerCondition`](./helpers/condition-library/safe-owner-condition.md) grants a permission that can be used by a current owner of a given Safe, so the Safe stays the source of truth for membership while the DAO governs what that membership may do.

### Coming from Hats

| Hats | OSx |
|---|---|
| a hat | a `permissionId`: a capability rather than a token |
| wearing a hat | holding a grant on a `where` |
| admin hat | `ROOT_PERMISSION_ID` on that target |
| eligibility module | a [condition](./common/permission-conditions.md) |
| toggle module | a condition returning `false` |
| `isWearerOfHat` | `hasPermission(where, who, permissionId)` |

Both models make authority a first-class object with pluggable validity logic. They differ in two places:
- Hats is a shared singleton with a tree, so hierarchy is built in and a hat is portable across organizations, whereas OSx authority is per-DAO and flat, with no inherent hierarchy among permissions.
- Hats stops at "who holds the role" by design, while OSx is wired straight into execution. They compose more easily than they compete: a condition that checks `isWearerOfHat` bridges the two, the same way `SafeOwnerCondition` does for Safe.

## Where other options fit better

There's no one size fits all when it comes to organizations, and a similar principle applies to Aragon OSx in many areas.

- **OSx is a framework, not a mixin.** `Ownable` is one line of inheritance. OSx asks you to deploy a DAO, install a plugin, and grant permissions. To protect a simple contract with one admin the overhead may not be worth it. Consider using `Ownable`.
- **Conditions are code.** A `RuledCondition` rule array is data, but a custom policy is a contract to be written. Guards and eligibility modules cost about the same. Hats and Zodiac ship more ready-made ones today.
- **The ecosystem has gravity.** Safe is home to many assets and tooling as of now. Bridging in with `SafeOwnerCondition` is often more sensible than migrating right away.
- **Rules about call arguments take more setting up.** Say you want "this role may call `transfer` on USDC, but only to the treasury, and only under 10,000". Zodiac's Roles Modifier takes that as configuration: you scope the target, the selector and each parameter, and you are done. In OSx, the same rule needs a ready-made [condition](./common/permission-conditions.md) either from the [condition library](./helpers/condition-library.md), or from `RuledCondition`. Otherwise it is a small contract that needs to be written.

## Keep in mind

- **Where authorization lives matters more than the syntax.** Rules inside a contract die with it; rules in a database the organization owns outlive every contract they govern.
- **A Safe module bypasses the owners; an OSx plugin bypasses nothing.** A plugin is authorized by a revocable permission, checked on every call.
- **ROOT is the permission of permissions, not a skeleton key.** It lets the holder rewrite the rules first. In a healthy DAO it only belongs to the DAO.
- **These systems compose more often than they compete.** Bridging an existing Safe or hat into an OSx permission through a condition usually beats migrating membership.
- **Pick the smallest thing that fits.** One contract with one admin wants `Ownable`. A group holding assets with no on-chain policy wants a Safe. Organizations that need to outlive any single contract and be governed by evolving policies want OSx.

## See also

- [The permission system](./core/permissions.md) — the OSx model this page compares against.
- [Permission conditions](./common/permission-conditions.md) — the general form of dynamic authorization.
- [The plugin model](./framework/plugins.md) — why capability is modular rather than baked in.
- [SafeOwnerCondition](./helpers/condition-library/safe-owner-condition.md) — bridging an existing Safe into OSx permissions.
- [Why OSx](./guides/why-osx.md) — the short, code-free case.
