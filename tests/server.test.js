process.env.NODE_ENV = 'test';
const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../server/index.js');

let server;
let baseUrl;

test.before((t, done) => {
  server = app.listen(0, () => {
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;
    done();
  });
});

test.after((t, done) => {
  server.close(done);
});

async function requestJson(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await res.json();
  return { status: res.status, headers: res.headers, data };
}

test('1. Security Headers are present on API responses', async () => {
  const { headers } = await requestJson('/api/health');
  assert.strictEqual(headers.get('x-content-type-options'), 'nosniff');
  assert.strictEqual(headers.get('x-frame-options'), 'SAMEORIGIN');
  assert.strictEqual(headers.get('x-xss-protection'), '1; mode=block');
});

test('2. GET /api/health returns operational status', async () => {
  const { status, data } = await requestJson('/api/health');
  assert.strictEqual(status, 200);
  assert.strictEqual(data.status, 'healthy');
  assert.strictEqual(typeof data.uptime, 'number');
});

test('3. GET /api/flights returns list and supports route query filters', async () => {
  const { status, data } = await requestJson('/api/flights?from=BOM&to=DEL');
  assert.strictEqual(status, 200);
  assert.strictEqual(data.success, true);
  assert.ok(Array.isArray(data.data));
  assert.ok(data.data.length > 0);
  assert.strictEqual(data.data[0].from, 'BOM');
});

test('4. GET /api/flights/:id returns single flight details or 404', async () => {
  const { status, data } = await requestJson('/api/flights/FL-601');
  assert.strictEqual(status, 200);
  assert.strictEqual(data.data.id, 'FL-601');

  const notFoundRes = await requestJson('/api/flights/FL-INVALID');
  assert.strictEqual(notFoundRes.status, 404);
  assert.strictEqual(notFoundRes.data.success, false);
});

test('5. GET /api/hotels returns list and supports city filter', async () => {
  const { status, data } = await requestJson('/api/hotels?city=Goa');
  assert.strictEqual(status, 200);
  assert.ok(data.data.every((h) => h.city.toLowerCase() === 'goa'));
});

test('6. GET /api/buses returns intercity bus operators', async () => {
  const { status, data } = await requestJson('/api/buses');
  assert.strictEqual(status, 200);
  assert.ok(data.data.length > 0);
  assert.ok(data.data[0].operator);
});

test('7. GET /api/railways returns train schedules', async () => {
  const { status, data } = await requestJson('/api/railways');
  assert.strictEqual(status, 200);
  assert.ok(data.data.length > 0);
  assert.ok(data.data[0].trainNumber);
});

test('8. POST /api/auth/register validates email and password length', async () => {
  // Invalid short password
  const failRes = await requestJson('/api/auth/register', {
    method: 'POST',
    body: { name: 'Test User', email: 'test@example.com', password: '123' }
  });
  assert.strictEqual(failRes.status, 400);
  assert.strictEqual(failRes.data.success, false);

  // Valid registration
  const passRes = await requestJson('/api/auth/register', {
    method: 'POST',
    body: { name: 'Test User', email: 'valid@example.com', password: 'password123', phone: '9876543210' }
  });
  assert.strictEqual(passRes.status, 201);
  assert.strictEqual(passRes.data.success, true);
  assert.strictEqual(passRes.data.data.email, 'valid@example.com');
});

test('9. POST /api/auth/login validates credentials format', async () => {
  const failRes = await requestJson('/api/auth/login', {
    method: 'POST',
    body: { identifier: 'invalid-email', method: 'email' }
  });
  assert.strictEqual(failRes.status, 400);

  const passRes = await requestJson('/api/auth/login', {
    method: 'POST',
    body: { identifier: 'user@example.com', method: 'email', password: 'secretpassword' }
  });
  assert.strictEqual(passRes.status, 200);
  assert.strictEqual(passRes.data.success, true);
});

test('10. POST /api/bookings creates booking and POST /api/bookings/:id/cancel cancels it', async () => {
  // Invalid booking payload
  const failRes = await requestJson('/api/bookings', {
    method: 'POST',
    body: { type: 'invalid_type' }
  });
  assert.strictEqual(failRes.status, 400);

  // Valid booking
  const createRes = await requestJson('/api/bookings', {
    method: 'POST',
    body: {
      type: 'flight',
      title: 'Mumbai → Delhi Flight',
      date: '2026-09-22',
      totalAmount: 4999,
      passengers: [{ name: 'Test Passenger', seat: '14B' }]
    }
  });
  assert.strictEqual(createRes.status, 201);
  assert.strictEqual(createRes.data.success, true);
  const bookingId = createRes.data.data.id;
  assert.ok(bookingId.startsWith('EZ-FL-'));

  // Cancel the booking
  const cancelRes = await requestJson(`/api/bookings/${bookingId}/cancel`, {
    method: 'POST',
    body: { reason: 'Schedule conflict' }
  });
  assert.strictEqual(cancelRes.status, 200);
  assert.strictEqual(cancelRes.data.data.status, 'Cancelled');
});

test('11. POST /api/payment validates amount and returns payment record', async () => {
  const failRes = await requestJson('/api/payment', {
    method: 'POST',
    body: { firstName: 'John', email: 'john@example.com', amount: -500 }
  });
  assert.strictEqual(failRes.status, 400);

  const passRes = await requestJson('/api/payment', {
    method: 'POST',
    body: { firstName: 'John', lastName: 'Doe', email: 'john@example.com', amount: 2500, currency: 'INR' }
  });
  assert.strictEqual(passRes.status, 201);
  assert.strictEqual(passRes.data.data.status, 'Success');
  assert.strictEqual(passRes.data.data.amount, 2500);
});

test('12. POST /api/contact validates inputs and confirms submission', async () => {
  const failRes = await requestJson('/api/contact', {
    method: 'POST',
    body: { name: 'A', email: 'bad-email', message: 'hi' }
  });
  assert.strictEqual(failRes.status, 400);

  const passRes = await requestJson('/api/contact', {
    method: 'POST',
    body: { name: 'Priyansh', email: 'priyansh@example.com', subject: 'Flight query', message: 'Please confirm flight details.' }
  });
  assert.strictEqual(passRes.status, 201);
  assert.strictEqual(passRes.data.success, true);
});
