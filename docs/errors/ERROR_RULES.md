# ERROR_RULES – Room Booking API

## ERR-01 – Public Error Shape

All public API errors use `application/problem+json`:

```json
{
  "type": "https://errors.example.com/<category>/<slug>",
  "title": "Short human title",
  "status": 400,
  "detail": "Human-readable description without sensitive data",
  "instance": "/v1/bookings",
  "code": "400_INVALID_INPUT",
  "hint": "Describe what the client should fix",
  "correlationId": "UUID"
}
