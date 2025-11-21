# ERROR_RULES

## ERR-01 – API Error Shape

All public errors follow a problem+json-like schema with:

- `status` (HTTP status code)
- `code` (stable machine-readable string, e.g. `ORDER_INVALID_QTY`)
- `hint` (short, user-readable description)
- `correlationId` (UUID for tracing logs)

## ERR-02 – Domain Errors

- Domain layer uses typed errors (e.g. `InvalidQtyError`) instead of plain strings.
- Mapping from domain errors to API errors happens only in controllers/adapters.

## ERR-03 – Infra / Vendor Errors

- External failures (DB, HTTP clients, etc.) are wrapped and mapped to:
  - `503` / `SERVICE_UNAVAILABLE` for transient issues
  - `500` / `INTERNAL_ERROR` for unexpected bugs
- Stack traces never returned to clients; only logged with `correlationId`.

## ERR-04 – Retry & Idempotency

- Only idempotent operations may be retried (GET, PUT, safe POST with `Idempotency-Key`).
- For POST-create:
  - First request with a new `Idempotency-Key` → 201 Created
  - Repeated request with same key (inside window) → 200 OK, same resource
- Client retry policies must use exponential backoff + jitter.

## ERR-05 – Logging

- Each error is logged exactly once with:
  - `correlationId`
  - key context fields (userId, resourceId, operation)
- Secrets and PII must be redacted or omitted.
