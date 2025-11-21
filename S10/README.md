# S10 – Refactor, Error Rules, Idempotency, Review Checklist

**Team:** Md Hosen, Ahmed Bahgat
**Repo:** https://github.com/YOUR-USERNAME/YOUR-REPO

## Scope

This S10 refactor focuses on:

- **Target:** <PUT YOUR FUNCTION/CLASS NAME HERE, e.g. `OrderService.createOrder`>
- **Goals:**
  - Improve readability and modularity (smaller, focused functions)
  - Standardize error handling to follow `/docs/errors/ERROR_RULES.md`
  - Ensure idempotent POST-create behavior for this story (if applicable)
  - Use Review Checklist v1 in a real PR

## Evidence

- **Refactor PR (PR-S10):** <ADD LINK TO THE PR AFTER YOU CREATE IT>
- **Diff + peer comments:** `/S10/refactor/DIFF.md`
- **Refactored code:**
  - <LIST MAIN CODE FILES YOU CHANGED, e.g. `src/orders/OrderService.ts`>
- **Tests (behavior parity):**
  - <UNIT TEST FILES>
  - <CONTRACT/API TEST FILES>

- **Error rules:** `/docs/errors/ERROR_RULES.md`
- **Review checklist:** `/docs/review/Review_Checklist_v1.md`
- **AI use log:** `/docs/ai/AI_Use_Log.md` (used if AI helped with S10)

- **Idempotent create evidence (if you have POST-create):**
  - Commit: <LINK TO COMMIT OR PR COMMENT WHERE YOU SHOW 201 THEN 200 WITH SAME Idempotency-Key>
  - Note: first request with new key → 201, replay with same key → 200 with same resource.

## CI

- Workflow: `/.github/workflows/ci.yml`
- Requirement: CI green (lint + tests + typecheck) and at least one human approval on PR-S10 before merge.
