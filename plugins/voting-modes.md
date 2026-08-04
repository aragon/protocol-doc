---
type: concept
title: Voting modes
tags: [governance, voting]
source: token-voting-plugin/src/base/MajorityVotingBase.sol
---

# Voting modes

A [majority-voting](./majority-voting.md) proposal always passes by the same [thresholds](./majority-voting.md#the-three-thresholds), but the **voting mode** decides two things around them: *when* a passed proposal may execute, and *whether* a voter can change their mind. It's a per-plugin setting (frozen into each proposal at creation), and it's a real governance-design choice, so pick deliberately.

> This page describes the modes for **snapshot-based** voting power ([Token Voting](./token-voting-plugin.md)), where a voter's weight is fixed once cast. A plugin whose power is *live* rather than snapshotted, notably [Lock to Vote](./lock-to-vote-plugin.md), refines these (its Standard mode lets weight grow, and it has no Early Execution); its page owns those deltas.

## The three modes

### Standard

Votes are final once cast, and execution waits for the full voting window: a proposal can only execute after its end date, once the final tally clears the thresholds. Choose it when you want the whole window to always play out, predictable timing, no surprise early execution, everyone gets the chance to vote.

### Early Execution

The proposal can execute *before* the end date, the moment its outcome is mathematically settled, so an obviously-passing proposal doesn't have to wait out the clock. "Mathematically settled" is computed by a **worst-case** test: assume every not-yet-cast vote turned out to be `No`, and check whether support would *still* clear the threshold:

```
worstCaseNo = totalVotingPower(snapshot) - yes - abstain
passes early  iff  (RATIO_BASE - supportThreshold) * yes  >  supportThreshold * worstCaseNo
```

If yes-power is already so far ahead that even "everyone else votes no" can't overturn it, the result is final and it can execute now. Votes are final in this mode (see why below). Choose it when speed matters and you're comfortable with an algorithmically-guaranteed-safe fast path.

### Vote Replacement

A voter can call `vote` again and change their choice any time before the end date; only their latest vote counts (the tally nets it out). There is **no** early execution. Choose it when you want people to react to discussion and new information during the vote.

## Why Early Execution and Vote Replacement are mutually exclusive

They can't be combined, and it comes down to the math. Early execution declares an outcome *final* while the proposal is still open. That's only sound if cast votes can't change: if a "yes" could later flip to "no", no outcome is ever truly settled before the deadline. Vote replacement is exactly the ability to flip a vote. So the two are contradictory, and a proposal is in one mode or the other.

## Keep in mind

- **Early Execution and Vote Replacement are mutually exclusive by construction**, early execution's safety depends on cast votes being immutable.
- **Changing your vote doesn't change your power.** In Vote Replacement, a re-vote is still weighed at the proposal's [snapshot](./token-voting-plugin/voting-power.md#the-snapshot) (fixed when it was created); you can change *direction*, not bring newly-acquired power to bear.

## See also

- [Majority voting](./majority-voting.md) — the thresholds the mode operates around.
- [Token Voting Plugin](./token-voting-plugin.md) — the plugin overview.
- [Voting power](./token-voting-plugin/voting-power.md) — how it sources voting power (an example of the model above).
- [Lock to Vote Plugin](./lock-to-vote-plugin.md) — offers only Standard and Vote Replacement (no Early Execution), since its voting power is live rather than snapshotted.
