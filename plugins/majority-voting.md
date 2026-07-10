---
type: concept
title: Majority voting
tags: [governance, voting]
source: token-voting-plugin/src/base/MajorityVotingBase.sol, token-voting-plugin/src/base/IMajorityVoting.sol
---

# Majority voting

Majority voting is a reusable decision engine for governance plugins (`MajorityVotingBase`): the rules that turn a set of Yes/No/Abstain votes into a pass or fail. It deliberately separates *how do we decide* (here) from *where does voting power come from* (the concrete plugin supplies that, e.g. the [Token Voting Plugin](/plugins/token-voting-plugin.md) weights votes by token balance). Any voting plugin can build on it.

The design worth understanding: a proposal succeeds only if **three independent criteria all hold**, plus it ran for a minimum time. They're independent on purpose, each guards against a different failure of a naive "most votes win" rule.

## The three thresholds

Every voter casts `Yes`, `No`, or `Abstain`, weighted by their **voting power**, what confers it is the plugin's business (a token balance, locked tokens, a member list; the [Token Voting Plugin sources it from IVotes balances](/plugins/token-voting-plugin/voting-power.md)). All thresholds are expressed with the [`RATIO_BASE` convention](/common/ratio.md) (`1_000_000` = 100%) and are **frozen into the proposal at creation**, later changes to the DAO's voting settings never affect proposals already open.

### Support — do most of the *decided* voters agree?

```
support = yes / (yes + no)      must be  >  supportThreshold
```

**Abstain is deliberately excluded** from support. Support asks "of those who took a side, did enough say yes?" Abstaining means "I'm present but express no direction", counting it as opposition would let mass abstention block proposals nobody actually voted against. On-chain the check is done cross-multiplied to avoid division: `(RATIO_BASE - supportThreshold) * yes > supportThreshold * no`. The comparison is strict (`>`), so at a 50% threshold you need *at least one more* yes than no, and the threshold is capped just below 100% (a threshold of exactly 100% could never be met).

### Participation — did enough of the electorate show up?

```
participation = (yes + no + abstain) / totalVotingPower    must be  >=  minParticipation
```

**Abstain *is* included** here, the opposite of support, and for a complementary reason: participation measures engagement, "did enough of the token supply weigh in at all?", regardless of direction. An abstain is still participation. This is the quorum guard: it stops a tiny, unrepresentative slice of the supply from deciding for everyone. (In practice the requirement is computed once at creation as an absolute amount, `minVotingPower`, by [rounding the percentage up](/common/ratio.md) against the snapshot's total supply.)

### Approval — did enough *yes* power turn out in absolute terms?

```
yes  must be  >=  minApproval * totalVotingPower   (rounded up)
```

An absolute floor on yes-power, independent of the yes/no split and of turnout. It defends against the case a high support ratio hides: a proposal passing 2-yes / 0-no at 100% support but with almost none of the DAO engaged. Set `minApproval` above zero and that alone isn't enough to pass.

The three are **ANDed**: support (relative direction) *and* participation (turnout) *and* approval (absolute floor). A fourth setting, `minDuration` (bounded 1 hour to 365 days), forces every proposal to stay open at least that long so the vote can't be rushed.

## Keep in mind

- **Support excludes abstain; participation includes it.** This asymmetry is intentional, not a bug. If ever unsure, re-derive from the definitions: support is `yes/(yes+no)`, participation is `(yes+no+abstain)/total`.
- **A proposal can "succeed" before it can execute.** In Standard mode a proposal may have clinched its thresholds while still open (`hasSucceeded` true), yet execution is blocked until the end date (`canExecute` false). "Succeeded" is the outcome; "executable" also accounts for timing and [mode](/plugins/voting-modes.md).

## See also

- [Token Voting Plugin](/plugins/token-voting-plugin.md) and [Lock to Vote Plugin](/plugins/lock-to-vote-plugin.md) — the governance plugins built on this engine (each with its own voting-power source).
- [Voting modes](/plugins/voting-modes.md) — how the mode changes execution timing and re-voting.
- [Ratio](/common/ratio.md) — the threshold math, and why it rounds up.
- [Proposals](/common/proposal.md) — the shared lifecycle interface.
