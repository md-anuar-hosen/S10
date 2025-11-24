 
# S10 Refactor – BookingService.createBooking
# Before/After Summary

## Before
- No booking domain service existed.
- No input validator for date/email rules.
- No structured error shape (no `problem+json`).
- No idempotency handling.
- No tests for behaviour or errors.
- No CI workflow.

## After
- Added BookingValidator with strict validation and typed error codes.
- Added BookingService with clean dependency injection.
- Added idempotency support (`InMemoryIdempotencyStore`).
- Adopted uniform error schema: `{ status, code, hint, correlationId }`.
- Added three behaviour tests (happy, validation, idempotency).
- Added GitHub Actions CI for PRs.
- Public contract preserved: output uses stable fields + error codes.

## Risks & Edge Cases
- Race conditions possible with concurrent bookings (out of S10 scope).
- In-memory idempotency not suitable for production (acceptable here).
- Repo is in-memory fake; persistence layer not tested.
- Timezone handling depends on `clock()` injection but not fully exercised.

## Peer Review Notes
**Strong choice:** Using pure validator + clean DI makes service easier to test.  
**Risk:** In-memory idempotency only works for single-instance runtime.  
**Question:** Should correlationId be passed from API gateway instead of generated?

## Evidence

**PR:** https://github.com/md-anuar-hosen/S10/pull/1  
**CI Run:** https://github.com/md-anuar-hosen/S10/actions/runs/19632095548  
**Tests:** `tests/booking/createBooking.test.js`


 
 
