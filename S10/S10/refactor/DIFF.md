# S10 Refactor – Before / After

## Target

- **Component:** <e.g. `OrderService.createOrder`>
- **Reason for refactor:**
  - Function was long and mixed validation, business rules, and persistence.
  - Error handling inconsistent and sometimes returned plain strings.

## Before / After Summary

- **Readability:**
  - Before: one long function with nested if/else and inline calculations.
  - After: logic split into smaller helpers like `validateOrder`, `calculateTotal`, `saveOrder`.

- **Modularity / SRP:**
  - Before: validation, price calculation, and database access all in one place.
  - After:
    - `OrderValidator` (validation)
    - `PriceCalculator` (pricing)
    - `OrderRepository` injected into service

- **Error handling:**
  - Before: mixed HTTP status codes, plain error messages.
  - After:
    - All public errors follow `/docs/errors/ERROR_RULES.md`
    - Responses include `status`, `code`, `hint`, `correlationId`.

- **Public contract:**
  - Status: **unchanged**
  - Details: input/output JSON and HTTP status codes are the same as before; only internal structure changed.

- **Tests impacted:**
  - Updated: `<LIST UPDATED TEST FILES>`
  - Added: `<LIST NEW TESTS / EDGE CASES>`

## Risks & Edge Cases

- Validation rules must still match previous behavior (no regression).
- Idempotent POST-create must return 201 first, 200 on replay with same `Idempotency-Key`.
- Mapping of domain/infra errors must not leak stack traces to clients.

## Peer Review Notes

- **Strong choice:**  
  - Extracting `OrderValidator` made it easier to test invalid quantities and dates separately.

- **Risk:**  
  - If we add new fields later, we must remember to update both validator and tests.

- **Question:**  
  - Should we log the full request body, or only non-sensitive fields + `correlationId`?
