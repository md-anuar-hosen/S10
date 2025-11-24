// tests/booking/createBooking.test.js

const test = require("node:test");
const assert = require("assert");
const { BookingService } = require("../../src/booking/BookingService");
const { InMemoryIdempotencyStore } = require("../../src/booking/IdempotencyStore");

// Simple in-memory repository used only for tests
class FakeBookingRepository {
  constructor() {
    this.bookings = [];
  }

  async hasConflict(roomId, startTime, endTime) {
    return this.bookings.some((b) => {
      if (b.roomId !== roomId) return false;
      // overlap if start < existingEnd && end > existingStart
      return startTime < b.endTime && endTime > b.startTime;
    });
  }

  async save(booking) {
    const id = `BKG-${this.bookings.length + 1}`;
    this.bookings.push({ id, ...booking });
    return id;
  }
}

function fixedClock() {
  // "now" for tests
  return new Date("2025-11-25T10:00:00Z");
}

function createService() {
  const repo = new FakeBookingRepository();
  const store = new InMemoryIdempotencyStore();
  const service = new BookingService({
    bookingRepository: repo,
    idempotencyStore: store,
    clock: fixedClock,
  });
  return { service, repo, store };
}

test("createBooking returns 201 and bookingId on valid input", async () => {
  const { service, repo } = createService();

  const request = {
    idempotencyKey: "idem-001",
    body: {
      roomId: "ROOM-101",
      startTime: "2025-11-25T11:00:00Z",
      endTime: "2025-11-25T12:00:00Z",
      guestEmail: "user@example.com",
    },
  };

  const result = await service.createBooking(request);

  assert.strictEqual(result.status, 201);
  assert.ok(result.body.bookingId);
  assert.strictEqual(repo.bookings.length, 1);
});

test("createBooking rejects past startTime with 400_INVALID_DATE_RANGE", async () => {
  const { service } = createService();

  const request = {
    body: {
      roomId: "ROOM-101",
      // one hour in the past relative to fixedClock
      startTime: "2025-11-25T09:00:00Z",
      endTime: "2025-11-25T10:30:00Z",
      guestEmail: "user@example.com",
    },
  };

  const result = await service.createBooking(request);

  assert.strictEqual(result.status, 400);
  assert.strictEqual(result.body.code, "400_INVALID_DATE_RANGE");
  assert.ok(result.body.correlationId);
});

test("createBooking is idempotent for same Idempotency-Key", async () => {
  const { service } = createService();

  const body = {
    roomId: "ROOM-101",
    startTime: "2025-11-25T11:00:00Z",
    endTime: "2025-11-25T12:00:00Z",
    guestEmail: "user@example.com",
  };

  const first = await service.createBooking({
    idempotencyKey: "idem-XYZ",
    body,
  });

  const second = await service.createBooking({
    idempotencyKey: "idem-XYZ",
    body,
  });

  assert.strictEqual(first.status, 201);
  assert.strictEqual(second.status, 200);
  assert.strictEqual(first.body.bookingId, second.body.bookingId);
});
