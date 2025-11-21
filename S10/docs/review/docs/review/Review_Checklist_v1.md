# Review Checklist v1

For each PR, reviewers verify:

- [ ] Names reveal intent; one abstraction level per function.
- [ ] Dependencies are injected; no hidden singletons/globals in core logic.
- [ ] Error shape follows `/docs/errors/ERROR_RULES.md` (status, `code`, `hint`, `correlationId`).
- [ ] Retries are only used for idempotent operations; POST-create uses `Idempotency-Key` where applicable.
- [ ] Side-effects are at the edges (controllers, gateways); core logic is as pure as possible.
- [ ] No secrets or PII in logs; `correlationId` is propagated through calls.
- [ ] Tests updated/added for changed lines; contract/API tests still pass.
- [ ] CI is green (lint, tests, type checks) before merge.
- [ ] AI-assisted changes (if any) are recorded in `/docs/ai/AI_Use_Log.md`.

