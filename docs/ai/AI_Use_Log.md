# AI Use Log

## 2025-11-24 — S10 Refactor `BookingService.createBooking`

- **Context:** Improve readability and modularity of `createBooking` and align error handling with `ERROR_RULES.md`.
- **Tool:** ChatGPT (G-AI companion).
- **Prompt summary:**
  - Asked for a refactor plan for `createBooking` (split validation / conflicts / persistence).
  - Asked for ideas for unit/contract tests (invalid date range, overlap, missing fields).
  - Explicitly required: keep public API stable, no new external dependencies.
- **Kept:**
  - Suggested split into `validateCreateBooking`, `checkConflicts`, `persistBooking`.
  - Suggested contract test that asserts `code` and `correlationId` in error responses.
- **Rejected:**
  - Suggested adding an in-function retry loop; decided to keep retries at client side.
- **Verification:**
  - `npm test` green (unit + contract tests).
  - ESLint and formatter passed in CI.
  - Manual local checks with two different Idempotency-Keys.
- **Privacy/IP:**
  - No real customer data, tokens, or secrets used in prompts.
  - Only synthetic room IDs and emails in examples.

Reviewer: `@<REVIEWER_HANDLE>`  
 
