# Actions

Actions define what the plugin does at each step of a capital flow: swap, transfer, burn, retain or donate tokens. Each action uses its [node's allocation](../concepts.md#nodes-define-the-structure) to prepare calls for the `DAO.sol` contract to execute and checks their result.

## Building and checking a node

The plugin runs each action in this order:

1. **Build calls.** The action prepares the operations and declares the expected output.
2. **Capture initial state.** The action checks prerequisites and records what it needs to verify the result, such as a recipient's starting balance.
3. **Execute.** The `DAO.sol` contract makes the calls using its funds and authority.
4. **Check results.** The action verifies the intended effect, and the plugin checks token balances.
5. **Continue to children.** The plugin passes the output to the next nodes, dividing it through a splitter where needed.

The action's methods are read-only. Any failed check reverts the flow. See [Execution](../execution.md) for how the whole run fits together.

## Core concepts

- **Input and output:** an [`Asset`](../execution.md#inputs-and-outputs) describes the token and amount at each step. Input is the node's allocation; output is the minimum it declares for its children. [Leaves](../concepts.md#leaves-complete-the-flow) declare zero output.
- **Calls:** an [`Action[]`](../../../core/execution.md) contains the target, value and calldata for each call the `DAO.sol` contract executes. Node actions build these calls.
- **Caller and data:** [`caller`](../concepts.md#a-trigger-runs-the-flow) triggered the flow; `data` is this node's entry in the supplied node-data array.
- **Snapshot:** bytes captured before execution, such as a recipient's balance, for checking the result afterward.

## The node action interface

[`INodeAction`](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/interfaces/INodeAction.sol) uses [`IBudget`](../budgets/index.md#the-budget-interface), [`Asset`](../execution.md#inputs-and-outputs) and [`Action`](../../../core/execution.md):

```solidity
interface INodeAction {
    /// @return The required budget, or address zero when unbound.
    function budget() external view returns (IBudget);

    /// @notice Builds the node's calls and declares their expected output.
    /// @param caller The address that triggered the flow.
    /// @param data This node's entry in the trigger data.
    /// @param input The token and amount assigned to this node.
    /// @return output Minimum output for children; zero amount for a leaf.
    /// @return actions Calls executed through the DAO.sol contract.
    function build(address caller, bytes calldata data, Asset calldata input)
        external view returns (Asset memory output, Action[] memory actions);

    /// @notice Checks prerequisites after build and before executing the calls.
    /// @return snapshot Initial state and context needed by postconditions.
    function preconditions(
        address caller, bytes calldata data, Asset calldata input, Asset calldata output
    ) external view returns (bytes memory snapshot);

    /// @notice Reverts if the executed calls did not produce the required result.
    /// @param snapshot State captured by preconditions, including any needed node-data context.
    function postconditions(
        address caller, Asset calldata input, Asset calldata output, bytes calldata snapshot
    ) external view;
}
```

## Choose an action

| Action | Result |
|---|---|
| [Open Fill](./open-fill.md) | Exchanges its input for a fixed demand and passes output to children |
| [Transfer](./transfer.md) | Pays a fixed recipient |
| [Transfer to Beneficiary](./transfer-to-beneficiary.md) | Pays an address supplied by the caller |
| [Burn](./burn.md) | Burns its allocation |
| [Keep](./keep.md) | Retains its allocation in the `DAO.sol` contract |
| [Vault Donate](./vault-donate.md) | Adds vault assets without minting shares |

All except Open Fill are leaves. See [Keep's implementation](./keep.md#implementation) for a minimal action and [component setup](../../../guides/compose-capital-tree.md#component-initialization-and-permissions) for initialization and grants.
