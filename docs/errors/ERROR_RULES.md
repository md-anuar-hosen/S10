# ERROR_RULES

**ERR-01 API shape**: `application/problem+json` with { `status`, `code`, `hint`, `correlationId` }.  
**ERR-02 Domain**: throw typed domain errors; map to API at the edge.  
**ERR-03 Infra**: wrap vendor/DB errors; never leak stack traces.  
**ERR-04 Retry**: retry only idempotent ops; POST-create guarded by Idempotency-Key.  
**ERR-05 Logging**: log once with context; redact secrets; include `correlationId`.

## Codes (examples)
- `400_INVALID_INPUT` — validation failed (hint lists fields)
- `401_UNAUTHENTICATED`
- `403_UNAUTHORIZED`
- `404_NOT_FOUND`
- `409_DUPLICATE_CREATE` (idempotency replay)
- `422_BUSINESS_RULE`
- `500_INTERNAL`
