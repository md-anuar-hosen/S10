# Team Review Checklist v1 (8–12 checks)

- [ ] Names reveal intent; one abstraction level per function
- [ ] Dependencies injected; no hidden globals/singletons in core
- [ ] Public contracts unchanged or ADR provided; breaking changes blocked
- [ ] Error shape per team schema (status, `code`, `hint`, `correlationId`)
- [ ] Retries only for idempotent ops; POST-create uses Idempotency-Key
- [ ] Side-effects at edges; pure transforms in core
- [ ] Secrets never logged; correlation ID propagated; log once
- [ ] Tests updated for changed lines; contract tests pass
- [ ] CI green; formatter/linter/type checks pass
- [ ] PR description clear; scope ≤ ~300 LOC; screenshots for UI where relevant

