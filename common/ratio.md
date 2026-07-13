---
type: reference
title: Ratio (threshold math)
tags: [governance-primitive]
source: osx/src/common/utils/math/Ratio.sol
---

# Ratio (threshold math)

Governance thresholds, support percentages, and quorums are fractions, but Solidity has no fractions. OSx represents them as fixed-point integers with a shared base:

```solidity
uint256 constant RATIO_BASE = 10 ** 6;   // 1_000_000 == 100%
```

So `500_000` means 50%, `750_000` means 75%. Every voting/approval threshold in the protocol ([token voting](/plugins/index.md), multisig, …) uses this unit, learn it once here.

## Applying a ratio, and why it rounds up

```solidity
_applyRatioCeiled(value, ratio);   // ceil(value * ratio / RATIO_BASE)
```

The **ceiling** is deliberate and important. When a ratio expresses a *minimum requirement* ("at least X% must approve"), rounding **up** ensures integer truncation never silently weakens it. Example: 50% of 3 members should require **2** approvals, not 1, floor division would wrongly allow passing with 1. Any plugin author computing a required count from a ratio should ceil, never floor. A ratio above `RATIO_BASE` reverts (`RatioOutOfBounds`).

## Keep in mind

- **Round up, never down, for a minimum requirement.** Use `_applyRatioCeiled`; floor division silently weakens a threshold, letting a proposal pass with fewer approvals than the percentage implies.

## See also

- [Membership and the address list](/common/membership.md) — the member count a ratio is applied to.
- [Proposals](/common/proposal.md) — where thresholds decide `hasSucceeded`.
