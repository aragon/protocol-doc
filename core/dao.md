---
type: concept
title: The DAO contract
tags: [upgradeability]
source: osx/src/core/dao/DAO.sol, osx/src/core/dao/IEIP4824.sol, osx/src/core/utils/CallbackHandler.sol, osx/src/common/dao/IDAO.sol
---

# The DAO contract

A DAO in Aragon OSx is **a single smart contract**. Not a collection of contracts, not an off-chain entity with an on-chain treasury: one `DAO` contract that *is* the organization. Everything a DAO can do reduces to functionality this contract exposes or delegates.

That one contract wears several hats at once:

- **The treasury.** It holds the organization's assets (native coin and tokens) and receives deposits.
- **The executor.** It performs arbitrary on-chain actions on behalf of the organization, see [Actions and execution](./execution.md). This is how a passed proposal actually *does* something.
- **Its own permission database.** `DAO` inherits [`PermissionManager`](./permissions.md), so the rules for who may do what live in the DAO contract's own storage. A DAO is self-authorizing.
- **A signer.** It can validate signatures on the organization's behalf via [EIP-1271](./signature-validation.md).
- **A discoverable, upgradeable identity.** It implements [EIP-4824](https://eips.ethereum.org/EIPS/eip-4824) (`daoURI`) for off-chain metadata, and is deployed behind a [UUPS proxy](../common/proxies.md) so it can be upgraded.

That first cluster, hold assets, execute anything, own the rules for who may do what, is the whole point: a durable on-chain **organization**. Upgradeability (the proxy) matters too, but it's how the organization endures, not what it's *for*; if proxies are new to you, read [Proxy deployment](../common/proxies.md) first, then come back.

Everything else, governance, membership, asset management, is added by [plugins](../framework/plugins.md). The DAO itself stays deliberately lean: it holds funds, executes actions, and answers "is this allowed?".

## Why one contract holds everything

The design choice that makes OSx cohere: **the DAO is also its own `PermissionManager`.** Because of that, one authorization model governs the DAO's own admin functions, its plugins' functions, and even framework contracts. A plugin doesn't keep its own access-control list; it asks the DAO "does this caller have permission?" (see [Authorizing against a DAO](../common/auth.md)). There is exactly one source of truth for authority per organization, and it is the DAO.

## Deployment and the ROOT bootstrapping problem

`DAO` is deployed behind a UUPS proxy. The implementation's constructor calls `_disableInitializers()` (so only proxies are ever initialized, the standard OpenZeppelin upgradeable-safety pattern), and each proxy is set up through `initialize`:

```solidity
function initialize(
    bytes calldata _metadata,
    address _initialOwner,
    address _trustedForwarder,
    string calldata daoURI_
) external;
```

`initialize` grants `ROOT_PERMISSION_ID` to `_initialOwner`. **ROOT is god-mode** (see [Permissions](./permissions.md)): whoever holds it can grant or revoke any permission. A freshly initialized DAO therefore has its initial owner in total control, which is fine as a *bootstrap* step and dangerous as an *end state*.

The intended lifecycle: the initial owner sets the DAO up, transfers ROOT **to the DAO itself** (so the organization self-governs), and revokes its own ROOT. In practice you never do this by hand, the [DAOFactory](../framework/dao-factory.md) performs the whole dance atomically in one transaction. The pitfall to remember: **a DAO where an EOA still holds ROOT is a DAO that EOA fully controls.**

> Granting ROOT to the DAO over itself is what lets a DAO manage its own permissions through governance: a proposal can execute `grant`/`revoke` actions on the DAO.

## Permissions the DAO defines

Each of the DAO's own privileged functions is gated by a permission (via the `auth` modifier from [`PermissionManager`](./permissions.md)):

| Permission | Gates |
|---|---|
| `EXECUTE_PERMISSION_ID` | `execute()`, see [Actions and execution](./execution.md). The most consequential permission in the protocol. |
| `UPGRADE_DAO_PERMISSION_ID` | Upgrading the DAO's implementation (UUPS). |
| `SET_METADATA_PERMISSION_ID` | `setMetadata()` and `setDaoURI()`. |
| `SET_TRUSTED_FORWARDER_PERMISSION_ID` | Setting the ERC-2771 meta-transaction forwarder. |
| `REGISTER_STANDARD_CALLBACK_PERMISSION_ID` | Registering new callback handlers (below). |
| `VALIDATE_SIGNATURE_PERMISSION_ID` | Used *inside* [signature validation](./signature-validation.md), not a function gate. |

The first five can **never** be granted to the `ANY_ADDR` wildcard (the DAO overrides `isPermissionRestrictedForAnyAddr` to forbid it): letting "anyone" execute arbitrary calls or upgrade the contract would be catastrophic. `VALIDATE_SIGNATURE_PERMISSION_ID` is deliberately *excluded* from that restriction so it can back a generic signature validator. `ROOT_PERMISSION_ID` is always wildcard-restricted, with no override. See [Permissions](./permissions.md) for the `ANY_ADDR` model.

## Holding assets

- **`deposit(token, amount, reference)`** is the tracked deposit path. Native coin (`token == address(0)`) requires `msg.value == amount`; an ERC-20 pulls via `safeTransferFrom` and requires `msg.value == 0`. Emits `Deposited`, and is **permissionless**, anyone can fund a DAO.
- **`receive()`** handles plain native-coin transfers and just emits `NativeTokenDeposited`. (It does no bookkeeping. Beware the 2300-gas stipend that `.transfer`/`.send` senders impose: such a transfer to the DAO can run out of gas in `receive`; a sender using a normal `call` is unaffected.)

Assets *leave* the DAO only through [`execute`](./execution.md), which is permission-gated. So funding is open; spending is governed.

## Adaptive token callbacks

To receive ERC-721 / ERC-1155 tokens a contract must answer callbacks like `onERC721Received` with a specific magic value. Rather than hard-coding these, the DAO mixes in a `CallbackHandler`: a registry mapping a callback selector to the magic value it must return. The ERC-721/1155 receiver callbacks are registered at `initialize`, and `registerStandardCallback` (gated by `REGISTER_STANDARD_CALLBACK_PERMISSION_ID`) lets a DAO support **future** token/callback standards without a contract upgrade. Unregistered callbacks revert `UnknownCallback`.

## Metadata and discovery

`setMetadata` takes an opaque `bytes` blob (conventionally an IPFS CID) and only *emits* it as the `MetadataSet` event, it is not stored on-chain, so reading a DAO's current metadata means indexing that event. `daoURI()` implements EIP-4824 for standardized off-chain DAO discovery. See [DAO metadata](./dao-metadata.md) for the JSON shape and the `daoURI`-vs-blob distinction.

## Upgrades across versions

`_authorizeUpgrade` is gated by `UPGRADE_DAO_PERMISSION_ID`. After an implementation upgrade, `initializeFrom(previousVersion, initData)` migrates storage; it refuses to upgrade across a major version (`ProtocolVersionUpgradeNotSupported` if the previous major isn't `1`). This is also where the contract keeps ERC-165 interface IDs and storage layout stable across versions (removed fields become reserved slots like `__removed0`; new state goes in the storage `__gap`). See [Protocol version](../common/protocol-version.md).

## Keep in mind

- **ROOT left with an EOA is total control of the DAO.** After any setup, confirm ROOT sits with the DAO itself, not the deployer, that's the line between a self-governing DAO and one somebody privately owns.
- **Metadata is event-only.** Read a DAO's current metadata by indexing the `MetadataSet` event; it isn't stored on-chain.

## See also

- [Permissions](./permissions.md), the authorization model the DAO inherits.
- [Actions and execution](./execution.md), how the DAO acts on the world.
- [Plugins](../framework/plugins.md), how functionality is added.
- [DAOFactory](../framework/dao-factory.md), how a DAO is actually deployed and bootstrapped.
