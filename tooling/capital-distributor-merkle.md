---
type: guide
title: Capital Distributor Merkle tools
source: osx-capital-distributor/script/utils/GenerateMerkleTree.s.sol, osx-capital-distributor/script/utils/GenerateProof.s.sol, osx-capital-distributor/script/utils/VerifyProof.s.sol
---

# Capital Distributor Merkle tools

These Foundry scripts generate data for
[MerkleDistributorStrategy](https://github.com/aragon/osx-capital-distributor/blob/8577c133be83b5a95176581752e0b391f65dc3c5/src/allocatorStrategies/MerkleDistributorStrategy.sol). Run commands from the [repository root](https://github.com/aragon/osx-capital-distributor/blob/development/README.md#local-development) after installing dependencies. Its Foundry configuration grants read/write access to that directory.

## Recipient data

Use one entry per address, with the total entitlement in the payout token's smallest units:

```json
[
  { "account": "0x1111111111111111111111111111111111111111", "amount": 1000000000000000000 },
  { "account": "0x2222222222222222222222222222222222222222", "amount": 2000000000000000000 }
]
```

The generator decodes `amount` as `uint256`; the example supplies JSON numbers. Preserve large integers exactly when
preparing the file; JavaScript's ordinary `Number` type cannot represent every token amount. Consolidate duplicate
addresses into one total entitlement before building the tree.

## Generate a root and proofs

Save your recipient data as `script/fixtures/recipients.json`. The following sequence writes the tree and proofs under
`script/fixtures/`, replacing generated files at those paths.

```sh
mkdir -p script/fixtures/proofs
forge script script/utils/GenerateMerkleTree.s.sol:GenerateMerkleTree \
  --sig "run(string)" "script/fixtures/recipients.json"
forge script script/utils/GenerateProof.s.sol:GenerateProof
```

`GenerateMerkleTree` reads the path passed to `run(string)` and writes `script/fixtures/merkle-tree.json`.
`GenerateProof` reads that tree and writes one `script/fixtures/proofs/proof-<address>.json` file per recipient,
including the amount, leaf, root, and proof array.

The [Merkle allocation reference](../plugins/capital-distributor/merkle-allocations.md#leaf-and-proof-encoding) defines compatible leaf and proof encoding. These tools carry an unpaired node to the next level. `GenerateProof` verifies each proof and reverts if verification fails.

## Verify a proof

Set `MERKLE_ROOT`, `RECIPIENT`, and `TOTAL_ENTITLEMENT` from the generated proof file. Set `MERKLE_PROOF` to its hash
array in bracket notation, such as `[0x123...,0x456...]`, using the complete hashes.

```sh
forge script script/utils/VerifyProof.s.sol:VerifyProof \
  --sig "verifyProof(bytes32,address,uint256,bytes32[])" \
  "$MERKLE_ROOT" "$RECIPIENT" "$TOTAL_ENTITLEMENT" "$MERKLE_PROOF"
```

The verifier prints `VALID` or `INVALID`; an invalid proof does not itself make the command fail. Use this direct
method: `verifyFromFile` makes an external call to its own script address, which Foundry rejects. Its `batchVerify`
method is a template and does not iterate through proof files.

## Use the generated data

Continue with the [campaign walkthrough](../guides/distribute-tokens.md#2-prepare-the-dao-actions) to submit the root and claim with the resulting proof data.
