# Change log

## 2026-10-26

- Added the artifacts-hub reference (snapshot `ffcc2118`): where to source deployed addresses per chain and versioned ABIs, with Foundry and viem examples. Linked it from the front door, tooling, just-foundry (whose network configs sync from the hub), the setup guide, the Protocol Factory, and the source repositories.
- Refreshed ten components to their current `main` (osx, token-voting, multisig, admin, SPP, lock-to-vote, conditions, protocol-factory, plugin template, just-foundry). SPP: reporting, sub-proposal creation and the 1.1/1.2 to 1.3 update paths. Conditions: new crosschain condition page. Multisig and admin: Foundry source paths and the setup guide's remapping. just-foundry and the template: the `init` flow, `just networks`, `just flatten`. Regenerated the ABI reference from clean clones at those commits; the generator is Foundry-only (`abi-legacy` removed).
- Pinned the guides' plugin installs to the deployed builds (multisig `v1.3.6`, token-voting `v1.4.2`); the token-import guide now uses Setup's pin, fork-tested on Sepolia. Documented that tokens with a state-changing `fallback` (WETH9) can't be wrapped by Token Voting's setup. The crosschain condition deploys with its constructor (no deployed factory exposes it). Restored the Management DAO metadata example, now in protocol-factory as `management-dao-metadata.json`. "crosschain" joins "onchain" as a voice rule.

## 2026-10-16

- Extended the approved voice pilot across the repository's authored prose; preserved source-derived ABI content, technical examples, and operating rules. Independent fidelity and voice reviews are complete; human review of the draft PR is pending.
- Applied a targeted voice pilot to the root index, ratio reference, and PluginSetupProcessor concept; approved by the user before the wider prose pass.
- Reworked the existing-token importing guide around compatibility, wrapping trade-offs, and the community's token choice; added an independent installation example and a continuous path through delegation and snapshot readiness. An adversarial section-by-section review refined the delegation assumptions, both token paths, and the handoff to the proposal guide.
- Removed the earlier plugin documentation rewrite from this branch, including the staged-governance walkthrough. Retained distinct audit corrections and made the reviewed importing guide's dependency instructions independent of that rewrite.

## 2026-09-08

- Clarified proposal snapshots, excluded voting power, permission boundaries, and installation encoding after the plugin content audit.
