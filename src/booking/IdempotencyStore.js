// src/booking/IdempotencyStore.js

class InMemoryIdempotencyStore {
  constructor() {
    this.store = new Map();
  }

  async get(key) {
    return this.store.get(key) || null;
  }

  async set(key, value) {
    this.store.set(key, value);
  }
}

module.exports = { InMemoryIdempotencyStore };
