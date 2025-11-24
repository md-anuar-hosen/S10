// src/booking/BookingValidator.js

function makeValidationError(code, message) {
  const err = new Error(message);
  err.code = code;
  return err;
}

/**
 * Validates and normalises input for createBooking.
 * Returns an object with parsed Date instances.
 */
function validateCreateBooking(body, now = new Date()) {
  if (!body) {
    throw makeValidationError("400_INVALID_INPUT", "Request body is required");
  }

  const { roomId, startTime, endTime, guestEmail } = body;

  if (!roomId) {
    throw makeValidationError("400_INVALID_INPUT", "roomId is required");
  }
  if (!startTime || !endTime) {
    throw makeValidationError(
      "400_INVALID_DATE_RANGE",
      "startTime and endTime are required"
    );
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw makeValidationError(
      "400_INVALID_DATE_RANGE",
      "startTime and endTime must be valid ISO dates"
    );
  }

  if (start < now) {
    throw makeValidationError(
      "400_INVALID_DATE_RANGE",
      "startTime must be in the future"
    );
  }

  if (end <= start) {
    throw makeValidationError(
      "400_INVALID_DATE_RANGE",
      "endTime must be after startTime"
    );
  }

  if (!guestEmail || !guestEmail.includes("@")) {
    throw makeValidationError(
      "400_INVALID_EMAIL",
      "guestEmail must be a valid email"
    );
  }

  return {
    roomId,
    startTime: start,
    endTime: end,
    guestEmail,
  };
}

module.exports = { validateCreateBooking, makeValidationError };
