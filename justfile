set shell := ["bash", "-uc"]

# Where the source repositories are checked out, relative to this bundle.
repos := ".."

[private]
default:
    @just --list --unsorted

# Generate the ABI reference for the given Solidity paths (files or directories)
abi *paths:
    @deno run --allow-read --allow-write --allow-run --allow-env scripts/abi-docs.ts {{ paths }}

# Regenerate the ABI reference for every source repository
# (multisig-plugin and admin-plugin are Hardhat; see scripts/README.md)
abi-all:
    @just abi \
        {{ repos }}/osx/src \
        {{ repos }}/token-voting-plugin/src \
        {{ repos }}/staged-proposal-processor-plugin/src \
        {{ repos }}/lock-to-vote-plugin/src \
        {{ repos }}/conditions/src

# Verify the bundle: links, anchors, required frontmatter
check:
    @wiki check
