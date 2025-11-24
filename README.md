 # S10 – Refactor, Error Rules, Idempotency, Review Checklist

Team: Md Hosen, Ahmed Bahgat  
Repo: https://github.com/md-anuar-hosen/S10

## Scope

This S10 refactor focuses on the **Room Booking** feature:

- **Target:** `BookingService.createBooking` in `src/booking/BookingService.ts`
- **Endpoint:** `POST /v1/bookings`
- **Goals:**
  - Improve readability and modularity (smaller, focused helpers).
  - Standardize error handling according to `/docs/errors/ERROR_RULES.md`.
  - Ensure idempotent POST-create behavior via the `Idempotency-Key` header.
  - Apply `Review_Checklist_v1.md` in a real PR (PR-S10).
  - Use AI only as a **companion** (naming, micro-tests, refactor plan) and log provenance.

## Evidence

### Refactor & DIFF

- Refactor PR (PR-S10): `<ADD LINK TO PR HERE>`
- DIFF summary and peer comments: [`/S10/refactor/DIFF.md`](./refactor/DIFF.md)

- Refactored code:
  - `src/booking/BookingService.ts`
  - `src/booking/BookingValidator.ts` (new helper module)
  - `src/booking/IdempotencyStore.ts` (simple in-memory or DB wrapper)

- Tests (behavior parity and contracts):
  - `tests/booking/createBooking.unit.test.ts`
  - `tests/booking/createBooking.contract.test.ts`

### Error Rules & Idempotency

- Error rules: [`/docs/errors/ERROR_RULES.md`](../docs/errors/ERROR_RULES.md)

`POST /v1/bookings` uses `application/problem+json` with:

```json
{
  "status": 400,
  "code": "400_INVALID_INPUT",
  "hint": "Check required fields: roomId, startTime, endTime, guestEmail",
  "correlationId": "UUID"
}
