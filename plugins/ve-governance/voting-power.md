---
type: concept
title: VE voting-power curve
tags: [governance, voting]
source: ve-governance/src/curve/LinearIncreasingCurve.sol, ve-governance/src/libs/CurveConstantLib.sol, ve-governance/src/clock/Clock_v1_2_0.sol, ve-governance/script/deploy/DeployGauges_v1_4_0.s.sol
---

# VE voting-power curve

The curve calculates the voting power of a [position](./positions.md) from its amount and recorded age. Power can grow while the tokens remain in escrow, then stop growing at the configured cap.

The checked-in v1.4 deployment script supplies matching coefficients to the curve and [delegation adapter](./delegation.md). Its linear coefficients produce approximately this result, ignoring fixed-point rounding:

```text
age = min(max(query timestamp - recorded start, 0), 104 weeks)
power = deposited amount × (1 + age / 104 weeks)
```

The maximum growth interval is 52 two-week epochs: 104 weeks, or 728 days. An active position starts around 1x its deposited amount and approaches 2x at the cap. The escrow's `votingPower(tokenId)` query uses curve checkpoints to account for subsequent changes and exits.

## The recorded start

The v1.4 escrow records a new position at the beginning of the current weekly checkpoint interval. Its age can therefore precede its deposit transaction, giving it more than baseline power immediately. The [minimum lock requirement](./withdrawals.md) also counts from that recorded start.

Reaching the power cap does not unlock the tokens. They remain in escrow until the holder completes withdrawal.

## Implementation choices

Curve coefficients and maximum epoch count are implementation constructor parameters. A deployment can select different values; the curve and adapter need the same parameters to calculate consistent power. `CurveConstantLibFlat` supplies an alternative flat curve, but the v1.4 script does not select it through a runtime setting.

The linear curve retains a `warmupPeriod` storage field for compatibility without applying the older quadratic curve's warmup gate. Existing deployments using the older curve and token-ID voter have a different accounting model; the [setup map](./setup.md) identifies the component set described here.
