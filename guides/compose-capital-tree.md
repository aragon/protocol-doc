---
type: guide
title: Compose a Capital Tree flow
tags: [automation, treasury]
source: capital-tree/src/setup/CapitalTreePluginSetup.sol, capital-tree/src/registry/ComponentRegistry.sol, capital-tree/script/Recipes.sol
---

# Compose a Capital Tree flow

Build a new flow by combining registered budgets, actions and splitters in a recipe: the component choices, settings, connections and permissions used to install the flow. If the components already provide the behavior you need, only their settings and connections change.

For example, the [swap, retain and donate flow](../plugins/capital-tree/concepts.md#example-swap-retain-and-donate) combines [`StreamBudget@1`](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/budgets/StreamBudget.sol), [`OpenFillAction@1`](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/actions/OpenFillAction.sol), [`WeightSplitter@1`](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/splitters/WeightSplitter.sol), [`KeepAction@1`](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/actions/KeepAction.sol) and [`VaultDonateAction@1`](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/actions/VaultDonateAction.sol). Its recipe puts Open Fill at node 0, with Keep and Vault Donate as children, and attaches the splitter to node 0. Weights of 200,000 and 800,000 assign 20% to retention and 80% to donation; [`forwardSurplus`](../plugins/capital-tree/execution.md#inputs-and-outputs) makes that split apply to all received tokens.

## Build a custom recipe

The following function body builds the overview's flow from registered components. It belongs in a recipe builder using [`CapitalTreePluginSetup`](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/setup/CapitalTreePluginSetup.sol) as `Setup` and the existing [`Recipes`](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/script/Recipes.sol) library. The setup defines `InstallParams` (the whole recipe), `RecipeNode` (one node declaration) and `Grant` (a permission recipient and ID). `manager`, `guardian`, `stream`, `swap` and `vault` are its inputs; `stream` and `swap` use the library's `Stream` and `Swap` structs.

```solidity
Setup.InstallParams memory recipe = Recipes.buyAndBurn(manager, guardian, stream, swap);

// Keep the stream, Open Fill declaration and management grants.
Setup.RecipeNode memory swapNode = recipe.nodes[0];
recipe.nodes = new Setup.RecipeNode[](3);
recipe.nodes[0] = swapNode;
recipe.nodes[0].children = new uint32[](2);
recipe.nodes[0].children[0] = 1;
recipe.nodes[0].children[1] = 2;

uint32[] memory weights = new uint32[](2);
weights[0] = 200_000;
weights[1] = 800_000;
recipe.nodes[0].splitter.id = bytes32("WeightSplitter@1");
recipe.nodes[0].splitter.settings = abi.encode(weights);
recipe.nodes[0].splitter.permissions = new Setup.Grant[](0);
recipe.nodes[0].forwardSurplus = true;

recipe.nodes[1].action.id = bytes32("KeepAction@1");
recipe.nodes[2].action.id = bytes32("VaultDonateAction@1");
recipe.nodes[2].action.settings = abi.encode(vault);

bytes memory installationData = abi.encode(recipe);
```

The splitter has no delegated manager in this example; add a `SET_SETTINGS_PERMISSION_ID` grant if its weights should be adjustable. The inherited stream and Open Fill grants remain. Pass `installationData` to preparation. Setup looks up each ID in the registry and creates a separate instance with the supplied settings.

The repository's [`Install.s.sol`](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/script/Install.s.sol) selects named recipes. To use this composition, connect your builder to its preparation step; adding a new recipe name to JSON alone is insufficient.

Composition must respect each component's dependencies and the [tree rules](../plugins/capital-tree/execution.md#tree-validation). For behavior the existing components cannot express, implement a compatible component and have the registry maintainer register it under a new ID. It can then participate in recipes through the same setup interface. Each declaration still creates a fresh clone with its own state.

Next, follow [Setup and permissions](../plugins/capital-tree/setup.md#the-install-proposal) to review and apply the prepared installation.

## Component initialization and permissions

Component **settings** are ABI-encoded configuration. **Dependencies** are component addresses supplied by setup: `[budget]` for actions and an empty array for budgets and splitters. Every declaration uses [`IComponent`](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/src/interfaces/IComponent.sol); [`IDAO`](../core/dao.md) represents the installing `DAO.sol` contract:

```solidity
import {IDAO} from "@aragon/osx-commons-contracts/src/dao/IDAO.sol";

interface IComponent {
    struct Permission {
        /// @notice Target contract.
        address where;
        /// @notice Authorized caller.
        address who;
        bytes32 permissionId;
    }

    /// @notice Binds the component to the DAO.sol contract and applies its settings.
    /// @dev Called once on a fresh clone.
    /// @param deps Setup supplies [budget] for actions, empty otherwise.
    /// @param settings ABI-encoded component configuration.
    function initialize(IDAO dao, address[] calldata deps, bytes calldata settings) external;

    /// @notice Declares operational grants; recipe grants separately choose managers.
    /// @dev Setup supplies the installing contract, new plugin and flow budget.
    function requiredPermissions(address dao, address plugin, address budget)
        external view returns (Permission[] memory);
}
```

Setup initializes each clone once, then combines `requiredPermissions` with the recipe's `(who, permissionId)` grants. Later setting changes use authorized setters. An absent action or splitter uses ID zero with empty settings and permissions.


## Clone addresses

Before approving, verify the prepared plugin with `pluginAddress(dao, abi.encode(recipe), index)`. Use index 0 for the first preparation of that recipe for that `DAO.sol` contract; subsequent preparations increment it. Different recipes produce different addresses, so the proposal's address commits to its configuration.


## Registry and replacement

The registry's managing `DAO.sol` contract appoints its maintainer by granting `REGISTER_PERMISSION_ID`. That managing contract is selected at [registry deployment](https://github.com/aragon/capital-tree/blob/47eb5ef56e8f83822d832e23da49dc76b103d37c/script/Deploy.s.sol) through `MANAGEMENT_DAO_ADDRESS`, independently of the manager and guardian chosen by each client for its flow.

Registry entries are write-once: a new implementation needs a new ID. Governance can replace runtime components with `setFlow`, which checks [tree validity](../plugins/capital-tree/execution.md#tree-validation) but does not require registered clones. Review replacement code and state: a fresh budget loses earlier accounting, including claim history.
