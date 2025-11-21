# Before/After Summary
- Readability: split 1 long fn → 3 pure helpers (parseMoney, applyDiscounts, roundToCents).
- Modularity: injected clock and currencyFormatter; removed hidden globals.
- Error handling: domain errors mapped to problem+json at HTTP edge (no stack leaks).
- Public contract: **unchanged** (types, status, error codes stable).
- Tests impacted: unit tests added; contract test for error shape.

## Risks & Edge Cases
- Rounding at .005 boundaries
- Negative/zero qty handling
- Discount caps and ordering

## Verification
- Unit: `tests/unit/priceCalculator.spec.ts` (added)
- Contract: `tests/contract/orders.problemjson.spec.ts` (updated)
- CI: green on PR-S10

## Peer Review Notes
Strong choice: extracting currency/rounding as pure helpers improved testability.  
Risk: double-discount if both coupon and seasonal applied; test added.  
Question: should free-shipping threshold be derived from config or hard-coded? (Follow-up issue #<id>)

