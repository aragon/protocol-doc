set shell := ["bash", "-uc"]

# Where the source repositories are checked out, relative to this bundle.
repos := ".."

[private]
default:
    @just --list --unsorted

# Generate the ABI reference for the given Solidity paths (files or directories)
[group('abi')]
abi *paths:
    @deno run --allow-read --allow-write --allow-run --allow-env scripts/abi-docs.ts {{ paths }}

# Regenerate the ABI reference for every repository
[group('abi')]
abi-all:
    @just abi \
        {{ repos }}/osx/src \
        {{ repos }}/token-voting-plugin/src \
        {{ repos }}/multisig-plugin/src \
        {{ repos }}/admin-plugin/src \
        {{ repos }}/staged-proposal-processor-plugin/src \
        {{ repos }}/lock-to-vote-plugin/src \
        {{ repos }}/conditions/src

# Cross-link the ABI reference with the wiki (re-run after `abi-all`, which overwrites it)
[group('wiki')]
abi-link:
    @deno run --allow-read --allow-write --allow-run --allow-env scripts/abi-crosslink.ts

# Verify the bundle: links, anchors, required frontmatter
[group('wiki')]
check:
    @wiki check
