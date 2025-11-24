# Review Checklist v1

> Used on PR-S10 and future refactor PRs.

## Design & Readability

- [ ] Names reveal intent; functions keep one abstraction level.
- [ ] No “god functions” – complex logic is split into smaller helpers.
- [ ] Dependencies are injected (no new hidden globals or `new` inside core).

## Error Handling & Logging

- [ ] Public errors follow problem+json schema with `status`, `code`, `hint`, `correlationId`.
- [ ] Domain errors are typed and mapped via a table, not strings scattered in code.
- [ ] No stack traces or secrets leak to clients.
- [ ] Logs include `correlationId` and context; errors logged exactly once at the edge.

## Idempotency & Retries

- [ ] Retries are only used for idempotent operations.
- [ ] POST-create endpoints that might be retried use `Idempotency-Key`.
- [ ] Duplicate submissions return `200` with the same resource, not a second create.

## Testing

- [ ] Tests were added/updated for all changed lines.
- [ ] At least one contract test proves error shape (code + correlationId).
- [ ] Edge/negative cases exist (not only the happy path).

## CI & Governance

- [ ] CI is green (lint/format/type checks + unit tests at minimum).
- [ ] No commented-out tests or dead code left behind.
- [ ] If AI assisted, `/docs/ai/AI_Use_Log.md` is updated and referenced in the PR.
