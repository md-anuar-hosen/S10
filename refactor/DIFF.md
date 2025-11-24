 
# S10 Refactor – BookingService.createBooking

## Target

- **Module:** `src/booking/BookingService.ts`
- **Function:** `createBooking(request, context)`
- **Public contract:**
  - `POST /v1/bookings`
  - Request fields: `roomId`, `startTime`, `endTime`, `guestEmail`
  - Responses:
    - 201 + `{ bookingId }` on success
    - 400/401/409/503 with `problem+json` shape on errors

## Before

- **Readability**
  - Single function ~70 lines mixing validation, business rules, DB access and logging.
  - In-line date parsing and overlap checks make the happy path hard to scan.

- **Modularity**
  - Validation, conflict detection and persistence all in one function.
  - Direct calls to DB client and logger (hidden dependencies).

- **Error handling**
  - Mixed `throw` and ad-hoc `res.status(...).json(...)` branches.
  - No guaranteed `code` or `correlationId` in error payloads.
  - Booking conflicts sometimes returned as plain strings.

- **Public contract**
  - Status codes mostly correct (201, 400, 409) but `code` not stable.
  - Error shape inconsistent with `ERROR_RULES.md`.

- **Tests**
  - One basic happy-path unit test.
  - No negative/edge tests (invalid dates, overlapping booking, missing room).

## After

- **Readability**
  - `createBooking` is now a short orchestration:

    1. `validateCreateBooking(requestBody)`
    2. `checkConflicts(validatedInput)`
    3. `persistBooking(validatedInput)`
    4. return 201 with `{ bookingId }`

- **Modularity**
  - New `BookingValidator` for input validation.
  - `BookingRepository` injected into `BookingService` (constructor injection).
  - IO (DB / logging) moved to clear edge helpers.

- **Error handling**
  - All errors mapped to `application/problem+json` with `{ status, code, hint, correlationId }`.
  - Domain errors:
    - `BookingConflictError` → `409_BOOKING_CONFLICT`
    - `InvalidBookingTimeError` → `400_INVALID_DATE_RANGE`
  - Infra errors (DB down) wrapped and mapped to `503_DEPENDENCY_DOWN`.

- **Public contract**
  - Status codes unchanged (201, 400, 401, 403, 404, 409, 503).
  - Error `code` values now stable and documented in `/docs/errors/ERROR_RULES.md`.
  - `correlationId` always included and propagated via middleware.

- **Tests**
  - New / updated tests:
    - `tests/booking/createBooking.unit.test.ts`
      - happy path
      - invalid date range
      - overlapping booking
    - `tests/booking/createBooking.contract.test.ts`
      - checks `problem+json` payload (status, code, correlationId)

## Risks & Edge Cases

- **R1 – Timezone handling**
  - Risk: start/end comparisons may behave differently if server timezone changes.
  - Mitigation: tests use fixed UTC instants; normalization to UTC in validator.

- **R2 – Idempotency store TTL**
  - Risk: replays after TTL may create duplicates.
  - Mitigation: TTL set to 24h, documented in `ERROR_RULES.md` and API docs.

- **R3 – Performance with conflict checks**
  - Risk: naive “scan all bookings for room” could degrade with large data.
  - Mitigation: repository uses indexed query by `roomId` and time window;
    perf testing deferred to dedicated Testing course.

## Idempotency Behaviour

- **Operation:** `POST /v1/bookings`
- **Header:** `Idempotency-Key: <client-generated-uuid>`

Observed behavior (S10 commit):

1. First request with new key:
   - Status: `201 Created`
   - Body: `{ "bookingId": "bkg-123", ... }`
2. Replay within TTL with same key and identical payload:
   - Status: `200 OK`
   - Body: `{ "bookingId": "bkg-123", ... }`

 

## Peer Review Notes

- **Strong choice:** Extracting `BookingValidator` and constructor-injecting `BookingRepository` made tests much simpler and reduced hidden dependencies.
- **Risk:** Reviewer flagged the naive in-memory idempotency store as a potential bottleneck under high load; suggested moving to a shared cache (e.g. Redis) later.
- **Question:** Reviewer asked whether cancellations should also use idempotency to avoid double-cancel side effects – captured as a follow-up story.

Reviewer: `@<REVIEWER_HANDLE>`  
 
