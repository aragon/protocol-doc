set shell := ["bash", "-uc"]

# Where the source repositories are checked out, relative to this bundle.
repos := ".."

[private]
default:
    @just --list --unsorted

# Generate the ABI reference for the given Solidity paths (files or directories)
abi *paths:
    @deno run --allow-read --allow-write --allow-run --allow-env scripts/abi-docs.ts {{ paths }}

# (multisig-plugin and admin-plugin are not Foundry; see `abi-legacy`)
# Regenerate the ABI reference for every Foundry repository
abi-all:
    @just abi \
        {{ repos }}/osx/src \
        {{ repos }}/token-voting-plugin/src \
        {{ repos }}/staged-proposal-processor-plugin/src \
        {{ repos }}/lock-to-vote-plugin/src \
        {{ repos }}/conditions/src

# Generate the ABI reference for the two Hardhat repos (installs their deps first)
# Temporary: both are being migrated to Foundry, then they fold into `abi-all`.
abi-legacy:
    # `|| true`: a couple of test-only devDependencies are npm aliases that 404. The two
    # runtime deps the contracts actually import install fine, which is all forge needs.
    @cd {{ repos }}/multisig-plugin/packages/contracts && bun install --ignore-scripts || true
    @cd {{ repos }}/admin-plugin/packages/contracts && bun install --ignore-scripts || true
    @just abi \
        {{ repos }}/multisig-plugin/packages/contracts/src \
        {{ repos }}/admin-plugin/packages/contracts/src

# Verify the bundle: links, anchors, required frontmatter
check:
    @wiki check
