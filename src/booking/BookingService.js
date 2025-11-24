// src/booking/BookingService.js

const crypto = require("crypto");
const { validateCreateBooking } = require("./BookingValidator");

function problemResponse(status, code, hint, correlationId) {
  return {
    status,
    body: {
      status,
      code,
      hint,
      correlationId,
    },
  };
}

class BookingService {
  /**
   * @param {object} deps
   * @param {object} deps.bookingRepository - hasConflict(roomId,start,end), save(booking)
   * @param {object} deps.idempotencyStore - get(key), set(key, value)
   * @param {function} [deps.clock] - () => Date
   */
  constructor({ bookingRepository, idempotencyStore, clock }) {
    this.bookingRepository = bookingRepository;
    this.idempotencyStore = idempotencyStore;
    this.clock = clock || (() => new Date());
  }

  /**
   * request = {
   *   body: { roomId, startTime, endTime, guestEmail },
   *   idempotencyKey?: string,
   *   correlationId?: string
   * }
   */
  async createBooking(request) {
    const correlationId =
      request.correlationId ||
      (crypto.randomUUID ? crypto.randomUUID() : "test-correlation-id");

    try {
      const key = request.idempotencyKey;
      const body = request.body || {};

      // Idempotency replay check
      if (key) {
        const existing = await this.idempotencyStore.get(key);
        if (existing) {
          return {
            status: 200,
            body: {
              bookingId: existing.bookingId,
              idempotent: true,
            },
          };
        }
      }

      const validated = validateCreateBooking(body, this.clock());

      const hasConflict = await this.bookingRepository.hasConflict(
        validated.roomId,
        validated.startTime,
        validated.endTime
      );

      if (hasConflict) {
        return problemResponse(
          409,
          "409_BOOKING_CONFLICT",
          "Booking overlaps existing booking",
          correlationId
        );
      }

      const bookingId = await this.bookingRepository.save(validated);

      if (key) {
        await this.idempotencyStore.set(key, { bookingId });
      }

      return {
        status: 201,
        body: { bookingId },
      };
    } catch (err) {
      // Validation error from validator
      if (err && err.code && err.code.startsWith("400_")) {
        return problemResponse(400, err.code, err.message, correlationId);
      }

      // Fallback: internal error
      return problemResponse(
        500,
        "500_INTERNAL_ERROR",
        "Unexpected error",
        correlationId
      );
    }
  }
}

module.exports = { BookingService, problemResponse };
