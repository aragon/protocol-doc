---
type: reference
title: GovernanceERC20
kind: contract
source: token-voting-plugin/src/erc20/GovernanceERC20.sol
summary: "An [OpenZeppelin `Votes`](https://docs.openzeppelin.com/contracts/4.x/api/governance#Votes) compatible [ERC-20](https://eips.ethereum.org/EIPS/eip-20) token,…"
---

# GovernanceERC20

**Contract** · [`src/erc20/GovernanceERC20.sol`](https://github.com/aragon/token-voting-plugin/blob/e97b783d76872d694f41dfc4bc846405019ca741/src/erc20/GovernanceERC20.sol)

**Explained in:** [Governance tokens](../../plugins/token-voting-plugin/governance-tokens.md)

**Author:** Aragon X

**Inherits:** [`IERC20MintableUpgradeable`](./IERC20MintableUpgradeable.md), `Initializable`, `ERC165Upgradeable`, `ERC20VotesUpgradeable`, `DaoAuthorizableUpgradeable`

An [OpenZeppelin `Votes`](https://docs.openzeppelin.com/contracts/4.x/api/governance#Votes)
compatible [ERC-20](https://eips.ethereum.org/EIPS/eip-20) token, used for voting and managed by a DAO.

**security-contact:** sirt@aragon.org

## Constructor

### constructor

```solidity
constructor(IDAO _dao, string _name, string _symbol, GovernanceERC20.MintSettings _mintSettings)
```

Calls the initialize function.

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `IDAO` | The managing DAO. |
| `_name` | `string` | The name of the [ERC-20](https://eips.ethereum.org/EIPS/eip-20) governance token. |
| `_symbol` | `string` | The symbol of the [ERC-20](https://eips.ethereum.org/EIPS/eip-20) governance token. |
| `_mintSettings` | [`GovernanceERC20.MintSettings`](#mintsettings) | The token mint settings struct containing the `receivers`, the `amounts` and `ensureDelegationOnMint`. |

## Functions

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```

Selector: `0xdd62ed3e`

> **Dev:** See {IERC20-allowance}.

### approve

```solidity
function approve(address spender, uint256 amount) external returns (bool)
```

Selector: `0x095ea7b3`

> **Dev:** See {IERC20-approve}.
> 
> NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
> `transferFrom`. This is semantically equivalent to an infinite approval.
> 
> Requirements:
> 
> - `spender` cannot be the zero address.

### balanceOf

```solidity
function balanceOf(address account) external view returns (uint256)
```

Selector: `0x70a08231`

> **Dev:** See {IERC20-balanceOf}.

### checkpoints

```solidity
function checkpoints(
    address account,
    uint32 pos
) external view returns (ERC20VotesUpgradeable.Checkpoint)
```

Selector: `0xf1127ed8`

> **Dev:** Get the `pos`-th checkpoint for `account`.

| Returns | Type | Description |
| --- | --- | --- |
| `[0]` | [`ERC20VotesUpgradeable.Checkpoint`](#checkpoint) |  |

### clock

```solidity
function clock() external view returns (uint48)
```

Selector: `0x91ddadf4`

> **Dev:** Clock used for flagging checkpoints. Can be overridden to implement timestamp based checkpoints (and voting).

### CLOCK_MODE

```solidity
function CLOCK_MODE() external view returns (string)
```

Selector: `0x4bf5d7e9`

> **Dev:** Description of the clock

### dao

```solidity
function dao() external view returns (IDAO)
```

Selector: `0x4162169f`

Returns the DAO contract.

### decimals

```solidity
function decimals() external view returns (uint8)
```

Selector: `0x313ce567`

> **Dev:** Returns the number of decimals used to get its user representation.
> For example, if `decimals` equals `2`, a balance of `505` tokens should
> be displayed to a user as `5.05` (`505 / 10 ** 2`).
> 
> Tokens usually opt for a value of 18, imitating the relationship between
> Ether and Wei. This is the default value returned by this function, unless
> it's overridden.
> 
> NOTE: This information is only used for _display_ purposes: it in
> no way affects any of the arithmetic of the contract, including
> {IERC20-balanceOf} and {IERC20-transfer}.

### decreaseAllowance

```solidity
function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool)
```

Selector: `0xa457c2d7`

> **Dev:** Atomically decreases the allowance granted to `spender` by the caller.
> 
> This is an alternative to {approve} that can be used as a mitigation for
> problems described in {IERC20-approve}.
> 
> Emits an {Approval} event indicating the updated allowance.
> 
> Requirements:
> 
> - `spender` cannot be the zero address.
> - `spender` must have allowance for the caller of at least
> `subtractedValue`.

### delegate

```solidity
function delegate(address delegatee) external
```

Selector: `0x5c19a95c`

> **Dev:** Delegate votes from the sender to `delegatee`.

### delegateBySig

```solidity
function delegateBySig(
    address delegatee,
    uint256 nonce,
    uint256 expiry,
    uint8 v,
    bytes32 r,
    bytes32 s
) external
```

Selector: `0xc3cda520`

> **Dev:** Delegates votes from signer to `delegatee`

### delegates

```solidity
function delegates(address account) external view returns (address)
```

Selector: `0x587cde1e`

> **Dev:** Get the address `account` is currently delegating to.

### DOMAIN_SEPARATOR

```solidity
function DOMAIN_SEPARATOR() external view returns (bytes32)
```

Selector: `0x3644e515`

> **Dev:** Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.

### eip712Domain

```solidity
function eip712Domain() external view returns (bytes1 fields, string name, string version, uint256 chainId, address verifyingContract, bytes32 salt, uint256[] extensions)
```

Selector: `0x84b0196e`

> **Dev:** See {EIP-5267}.
> 
> _Available since v4.9._

### freezeMinting

```solidity
function freezeMinting() external
```

Selector: `0xc013f30f`

Disables the mint() function permanently

### getEnsureDelegationOnMint

```solidity
function getEnsureDelegationOnMint() external view returns (bool)
```

Selector: `0xd9957169`

Whether mint() enables self delegation if the receiver has no delegate.

### getMintingFrozen

```solidity
function getMintingFrozen() external view returns (bool)
```

Selector: `0x081f4b8c`

Returns true if the ability to mint tokens has been frozen

### getPastTotalSupply

```solidity
function getPastTotalSupply(uint256 timepoint) external view returns (uint256)
```

Selector: `0x8e539e8c`

> **Dev:** Retrieve the `totalSupply` at the end of `timepoint`. Note, this value is the sum of all balances.
> It is NOT the sum of all the delegated votes!
> 
> Requirements:
> 
> - `timepoint` must be in the past

### getPastVotes

```solidity
function getPastVotes(address account, uint256 timepoint) external view returns (uint256)
```

Selector: `0x3a46b1a8`

> **Dev:** Retrieve the number of votes for `account` at the end of `timepoint`.
> 
> Requirements:
> 
> - `timepoint` must be in the past

### getVotes

```solidity
function getVotes(address account) external view returns (uint256)
```

Selector: `0x9ab24eb0`

> **Dev:** Gets the current votes balance for `account`

### increaseAllowance

```solidity
function increaseAllowance(address spender, uint256 addedValue) external returns (bool)
```

Selector: `0x39509351`

> **Dev:** Atomically increases the allowance granted to `spender` by the caller.
> 
> This is an alternative to {approve} that can be used as a mitigation for
> problems described in {IERC20-approve}.
> 
> Emits an {Approval} event indicating the updated allowance.
> 
> Requirements:
> 
> - `spender` cannot be the zero address.

### initialize

```solidity
function initialize(
    IDAO _dao,
    string _name,
    string _symbol,
    GovernanceERC20.MintSettings _mintSettings
) external
```

Selector: `0x6273f4dc`

Initializes the contract and mints tokens to a list of receivers.

| Parameter | Type | Description |
| --- | --- | --- |
| `_dao` | `IDAO` | The managing DAO. |
| `_name` | `string` | The name of the [ERC-20](https://eips.ethereum.org/EIPS/eip-20) governance token. |
| `_symbol` | `string` | The symbol of the [ERC-20](https://eips.ethereum.org/EIPS/eip-20) governance token. |
| `_mintSettings` | [`GovernanceERC20.MintSettings`](#mintsettings) | The token mint settings struct containing the `receivers`, the `amounts` and `ensureDelegationOnMint`. |

### mint

```solidity
function mint(address to, uint256 amount) external
```

Selector: `0x40c10f19`

Mints tokens to an address.

| Parameter | Type | Description |
| --- | --- | --- |
| `to` | `address` | The address receiving the tokens. |
| `amount` | `uint256` | The amount of tokens to be minted. |

### name

```solidity
function name() external view returns (string)
```

Selector: `0x06fdde03`

> **Dev:** Returns the name of the token.

### nonces

```solidity
function nonces(address owner) external view returns (uint256)
```

Selector: `0x7ecebe00`

> **Dev:** Returns the current nonce for `owner`. This value must be included whenever a signature is generated for {permit}. Every successful call to {permit} increases ``owner``'s nonce by one. This prevents a signature from being used multiple times.

### numCheckpoints

```solidity
function numCheckpoints(address account) external view returns (uint32)
```

Selector: `0x6fcfff45`

> **Dev:** Get number of checkpoints for `account`.

### permit

```solidity
function permit(
    address owner,
    address spender,
    uint256 value,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
) external
```

Selector: `0xd505accf`

> **Dev:** Sets `value` as the allowance of `spender` over ``owner``'s tokens, given ``owner``'s signed approval. IMPORTANT: The same issues {IERC20-approve} has related to transaction ordering also apply here. Emits an {Approval} event. Requirements: - `spender` cannot be the zero address. - `deadline` must be a timestamp in the future. - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner` over the EIP712-formatted function arguments. - the signature must use ``owner``'s current nonce (see {nonces}). For more information on the signature format, see the https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP section]. CAUTION: See Security Considerations above.

### supportsInterface

```solidity
function supportsInterface(bytes4 _interfaceId) external view returns (bool)
```

Selector: `0x01ffc9a7`

Checks if this or the parent contract supports an interface by its ID.

| Parameter | Type | Description |
| --- | --- | --- |
| `_interfaceId` | `bytes4` | The ID of the interface. |

### symbol

```solidity
function symbol() external view returns (string)
```

Selector: `0x95d89b41`

> **Dev:** Returns the symbol of the token, usually a shorter version of the
> name.

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

Selector: `0x18160ddd`

> **Dev:** See {IERC20-totalSupply}.

### transfer

```solidity
function transfer(address to, uint256 amount) external returns (bool)
```

Selector: `0xa9059cbb`

> **Dev:** See {IERC20-transfer}.
> 
> Requirements:
> 
> - `to` cannot be the zero address.
> - the caller must have a balance of at least `amount`.

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 amount) external returns (bool)
```

Selector: `0x23b872dd`

> **Dev:** See {IERC20-transferFrom}.
> 
> Emits an {Approval} event indicating the updated allowance. This is not
> required by the EIP. See the note at the beginning of {ERC20}.
> 
> NOTE: Does not update the allowance if the current allowance
> is the maximum `uint256`.
> 
> Requirements:
> 
> - `from` and `to` cannot be the zero address.
> - `from` must have a balance of at least `amount`.
> - the caller must have allowance for ``from``'s tokens of at least
> `amount`.

## Events

### Approval

```solidity
event Approval(address indexed owner, address indexed spender, uint256 value)
```

> **Dev:** Emitted when the allowance of a `spender` for an `owner` is set by
> a call to {approve}. `value` is the new allowance.

### DelegateChanged

```solidity
event DelegateChanged(
    address indexed delegator,
    address indexed fromDelegate,
    address indexed toDelegate
)
```

> **Dev:** Emitted when an account changes their delegate.

### DelegateVotesChanged

```solidity
event DelegateVotesChanged(
    address indexed delegate,
    uint256 previousBalance,
    uint256 newBalance
)
```

> **Dev:** Emitted when a token transfer or delegate change results in changes to a delegate's number of votes.

### EIP712DomainChanged

```solidity
event EIP712DomainChanged()
```

> **Dev:** MAY be emitted to signal that the domain could have changed.

### Initialized

```solidity
event Initialized(uint8 version)
```

> **Dev:** Triggered when the contract has been initialized or reinitialized.

### MintingFrozen

```solidity
event MintingFrozen()
```

Emitted when minting is frozen permanently

### Transfer

```solidity
event Transfer(address indexed from, address indexed to, uint256 value)
```

> **Dev:** Emitted when `value` tokens are moved from one account (`from`) to
> another (`to`).
> 
> Note that `value` may be zero.

## Errors

### DaoUnauthorized

```solidity
error DaoUnauthorized(address dao, address where, address who, bytes32 permissionId)
```

Thrown if a call is unauthorized in the associated DAO.

| Parameter | Type | Description |
| --- | --- | --- |
| `dao` | `address` | The associated DAO. |
| `where` | `address` | The context in which the authorization reverted. |
| `who` | `address` | The address (EOA or contract) missing the permission. |
| `permissionId` | `bytes32` | The permission identifier. |

### MintingIsFrozen

```solidity
error MintingIsFrozen()
```

Thrown when attempting to mint when minting is permanently disabled

### MintSettingsArrayLengthMismatch

```solidity
error MintSettingsArrayLengthMismatch(uint256 receiversArrayLength, uint256 amountsArrayLength)
```

Thrown if the number of receivers and amounts specified in the mint settings do not match.

| Parameter | Type | Description |
| --- | --- | --- |
| `receiversArrayLength` | `uint256` | The length of the `receivers` array. |
| `amountsArrayLength` | `uint256` | The length of the `amounts` array. |

## Constants

_Public, so each is also readable through a generated getter._

### MINT_PERMISSION_ID

```solidity
bytes32 public constant MINT_PERMISSION_ID = keccak256("MINT_PERMISSION");
```

Value: `0xb737b436e6cc542520cb79ec04245c720c38eebfa56d9e2d99b043979db20e4c`

The permission identifier to mint new tokens

## Structs

### Checkpoint

_Inherited from `ERC20VotesUpgradeable`._

```solidity
struct Checkpoint {
    uint32 fromBlock;
    uint224 votes;
}
```

### MintSettings

```solidity
struct MintSettings {
    address[] receivers;
    uint256[] amounts;
    bool ensureDelegationOnMint;
}
```

The settings for the initial mint of the token.

> **Dev:** The lengths of `receivers` and `amounts` must match.

| Field | Type | Description |
| --- | --- | --- |
| `receivers` | `address[]` | The receivers of the tokens. On initialization only. |
| `amounts` | `uint256[]` | The amounts of tokens to be minted for each receiver. On initialization only. |
| `ensureDelegationOnMint` | `bool` | Whether mint() calls should self delegate if the receiver doesn't have one. |
