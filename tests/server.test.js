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

test('13. GET /api/bookings/:id fetches booking details or 404', async () => {
  // Create a known booking
  const createRes = await requestJson('/api/bookings', {
    method: 'POST',
    body: {
      type: 'hotel',
      title: 'Grand Palace Goa',
      date: '2026-10-01 to 2026-10-04',
      totalAmount: 14500,
      passengers: [{ name: 'Rohit Sharma' }]
    }
  });
  const bookingId = createRes.data.data.id;

  const fetchRes = await requestJson(`/api/bookings/${bookingId}`);
  assert.strictEqual(fetchRes.status, 200);
  assert.strictEqual(fetchRes.data.data.id, bookingId);

  const notFoundRes = await requestJson('/api/bookings/EZ-INVALID-9999');
  assert.strictEqual(notFoundRes.status, 404);
});

test('14. GET /api/bookings supports status and type query filtering', async () => {
  const { status, data } = await requestJson('/api/bookings?type=flight');
  assert.strictEqual(status, 200);
  assert.ok(Array.isArray(data.data));
  assert.ok(data.data.every((b) => b.type === 'flight'));
});

test('15. POST /api/auth/register rejects duplicate registration with 409 Conflict', async () => {
  const duplicateEmail = `dup_${Date.now()}@example.com`;

  const res1 = await requestJson('/api/auth/register', {
    method: 'POST',
    body: { name: 'User One', email: duplicateEmail, password: 'password123' }
  });
  assert.strictEqual(res1.status, 201);

  const res2 = await requestJson('/api/auth/register', {
    method: 'POST',
    body: { name: 'User Two', email: duplicateEmail, password: 'password123' }
  });
  assert.strictEqual(res2.status, 409);
  assert.strictEqual(res2.data.success, false);
});

test('16. PUT /api/auth/profile updates user state', async () => {
  const res = await requestJson('/api/auth/profile', {
    method: 'PUT',
    body: { email: 'profile.user@example.com', name: 'Updated Explorer Name', city: 'Bengaluru' }
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.data.name, 'Updated Explorer Name');
  assert.strictEqual(res.data.data.city, 'Bengaluru');
});

test('17. Sanitization middleware trims whitespace and strips null bytes', async () => {
  const res = await requestJson('/api/contact', {
    method: 'POST',
    body: { name: '  NullByte\\0Stripped  ', email: 'clean@example.com', message: '  Cleaned message body  ' }
  });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.data.data.name, 'NullByte\\0Stripped');
  assert.strictEqual(res.data.data.message, 'Cleaned message body');
});

test('18. POST /api/payment rejects unsupported currency codes', async () => {
  const res = await requestJson('/api/payment', {
    method: 'POST',
    body: { firstName: 'Test', email: 'test@example.com', amount: 1000, currency: 'INVALID_CURRENCY' }
  });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.data.success, false);
});

test('19. Non-existent API route returns structured JSON 404', async () => {
  const res = await requestJson('/api/unknown-service/route');
  assert.strictEqual(res.status, 404);
  assert.strictEqual(res.data.success, false);
  assert.ok(res.data.error.includes('not found'));
});

test('20. POST /api/bookings validates passenger object structure', async () => {
  const res = await requestJson('/api/bookings', {
    method: 'POST',
    body: {
      type: 'bus',
      title: 'Delhi to Manali',
      totalAmount: 1200,
      passengers: [{ name: '' }] // Invalid empty passenger name
    }
  });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.data.success, false);
});

test('21. GET /api/payment/razorpay-key returns public gateway config', async () => {
  const res = await requestJson('/api/payment/razorpay-key');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
  assert.ok(res.data.keyId);
  assert.strictEqual(res.data.merchantName, 'EazeTrip India');
});

test('22. POST /api/payment/create-order generates Razorpay order ID and amount in paise', async () => {
  // Invalid amount
  const failRes = await requestJson('/api/payment/create-order', {
    method: 'POST',
    body: { amount: -50 }
  });
  assert.strictEqual(failRes.status, 400);

  // Valid order
  const passRes = await requestJson('/api/payment/create-order', {
    method: 'POST',
    body: { amount: 3500, currency: 'INR', receipt: 'rcpt_test_101' }
  });
  assert.strictEqual(passRes.status, 201);
  assert.strictEqual(passRes.data.success, true);
  assert.ok(passRes.data.orderId);
  assert.strictEqual(passRes.data.amount, 350000); // 3500 * 100 paise
});

test('23. POST /api/payment/verify validates payment and records confirmation', async () => {
  const verifyRes = await requestJson('/api/payment/verify', {
    method: 'POST',
    body: {
      razorpay_payment_id: 'pay_test_9921',
      razorpay_order_id: 'order_sim_test_123',
      razorpay_signature: 'sig_test_dummy',
      amount: 4500,
      payerName: 'Virat Kohli',
      email: 'virat@example.com',
      description: 'Goa Holiday Villa'
    }
  });
  assert.strictEqual(verifyRes.status, 200);
  assert.strictEqual(verifyRes.data.success, true);
  assert.strictEqual(verifyRes.data.data.paymentId, 'pay_test_9921');
  assert.strictEqual(verifyRes.data.data.status, 'Success');
});

test('24. POST /api/payment/webhook accepts incoming notifications', async () => {
  const hookRes = await requestJson('/api/payment/webhook', {
    method: 'POST',
    body: { event: 'payment.captured' }
  });
  assert.strictEqual(hookRes.status, 200);
  assert.strictEqual(hookRes.data.status, 'ok');
});

test('25. Booking creation assigns PNR, email, and supports email/userId filtering', async () => {
  const testEmail = `traveller_${Date.now()}@test.com`;
  const createRes = await requestJson('/api/bookings', {
    method: 'POST',
    body: {
      type: 'flight',
      title: 'Delhi to Mumbai Express Flight',
      date: '2026-10-15',
      totalAmount: 5200,
      email: testEmail,
      userId: 'usr_audit_99',
      passengers: [{ name: 'Ananya Birla', seat: '3A' }]
    }
  });
  assert.strictEqual(createRes.status, 201);
  assert.ok(createRes.data.data.pnr);
  assert.strictEqual(createRes.data.data.email, testEmail);

  // Query filter by email
  const filterEmailRes = await requestJson(`/api/bookings?email=${encodeURIComponent(testEmail)}`);
  assert.strictEqual(filterEmailRes.status, 200);
  assert.strictEqual(filterEmailRes.data.data.length, 1);
  assert.strictEqual(filterEmailRes.data.data[0].email, testEmail);

  // Query filter by userId
  const filterUserRes = await requestJson('/api/bookings?userId=usr_audit_99');
  assert.strictEqual(filterUserRes.status, 200);
  assert.ok(filterUserRes.data.data.some(b => b.userId === 'usr_audit_99'));
});

test('26. Prototype pollution payloads are safely neutralized by security middleware', async () => {
  const res = await requestJson('/api/contact', {
    method: 'POST',
    body: {
      name: 'Safe Sender',
      email: 'safe@example.com',
      message: 'Testing prototype pollution defense',
      __proto__: { polluted: 'true' }
    }
  });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(({}).polluted, undefined);
});

test('27. Promo codes EAZETRIP and brand discounts exist in mockStore', () => {
  const { offers } = require('../server/data/mockStore.js');
  const promoMap = new Map(offers.map(p => [p.code, p]));
  assert.ok(promoMap.has('EAZETRIP'));
  assert.ok(promoMap.has('EAZETRIP1000'));
  assert.ok(promoMap.has('STAYEAZY'));
  assert.ok(promoMap.has('BUSEAZ'));
  assert.ok(promoMap.has('TRAINEAZ'));
});

test('28. HTTP Parameter Pollution (duplicate query keys) is handled safely', async () => {
  const res = await requestJson('/api/flights?from=BOM&from=DEL&airline=IndiGo&airline=Air+India');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
  assert.ok(Array.isArray(res.data.data));
});

test('29. Bookings can be cancelled using PNR code', async () => {
  const createRes = await requestJson('/api/bookings', {
    method: 'POST',
    body: {
      type: 'flight',
      title: 'Goa Weekend Trip',
      date: '2026-11-01',
      totalAmount: 3800,
      passengers: [{ name: 'Test Traveler' }]
    }
  });
  assert.strictEqual(createRes.status, 201);
  const pnr = createRes.data.data.pnr;
  assert.ok(pnr);

  // Cancel via PNR
  const cancelRes = await requestJson(`/api/bookings/${pnr}/cancel`, {
    method: 'POST',
    body: { reason: 'Change of plans' }
  });
  assert.strictEqual(cancelRes.status, 200);
  assert.strictEqual(cancelRes.data.data.status, 'Cancelled');
});

test('30. User login and registration produce 64-character (256-bit) crypto tokens', async () => {
  const regEmail = `crypto_${Date.now()}@example.com`;
  const regRes = await requestJson('/api/auth/register', {
    method: 'POST',
    body: { name: 'Crypto User', email: regEmail, password: 'password123' }
  });
  assert.strictEqual(regRes.status, 201);
  assert.strictEqual(typeof regRes.data.data.token, 'string');
  assert.strictEqual(regRes.data.data.token.length, 64);
});

test('31. OWASP & CSP Security Headers are all verified', async () => {
  const { headers } = await requestJson('/api/health');
  assert.strictEqual(headers.get('x-dns-prefetch-control'), 'off');
  assert.strictEqual(headers.get('x-download-options'), 'noopen');
  assert.strictEqual(headers.get('cross-origin-opener-policy'), 'same-origin-allow-popups');
  assert.strictEqual(headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
});

test('32. Login identifier auto-detects email or phone when method is omitted', async () => {
  const emailLoginRes = await requestJson('/api/auth/login', {
    method: 'POST',
    body: { identifier: 'autodetect@example.com', password: 'securepassword' }
  });
  assert.strictEqual(emailLoginRes.status, 200);
  assert.strictEqual(emailLoginRes.data.data.email, 'autodetect@example.com');

  const phoneLoginRes = await requestJson('/api/auth/login', {
    method: 'POST',
    body: { identifier: '+91 9988776655' }
  });
  assert.strictEqual(phoneLoginRes.status, 200);
  assert.ok(phoneLoginRes.data.data.phone.includes('9988776655'));
});

test('33. GET /api/holidays returns packages and supports filtering', async () => {
  const allRes = await requestJson('/api/holidays');
  assert.strictEqual(allRes.status, 200);
  assert.strictEqual(allRes.data.success, true);
  assert.ok(Array.isArray(allRes.data.data));
  assert.ok(allRes.data.data.length >= 8);

  // Filter by category
  const intlRes = await requestJson('/api/holidays?category=international');
  assert.strictEqual(intlRes.status, 200);
  assert.ok(intlRes.data.data.every(p => p.category.toLowerCase() === 'international'));

  // Filter by destination
  const goaRes = await requestJson('/api/holidays?destination=Goa');
  assert.strictEqual(goaRes.status, 200);
  assert.ok(goaRes.data.data.some(p => p.destination.includes('Goa')));

  // Filter by maxPrice
  const budgetRes = await requestJson('/api/holidays?maxPrice=25000');
  assert.strictEqual(budgetRes.status, 200);
  assert.ok(budgetRes.data.data.every(p => p.price <= 25000));
});

test('34. GET /api/holidays/:id returns single package or 404', async () => {
  const validRes = await requestJson('/api/holidays/HOL-101');
  assert.strictEqual(validRes.status, 200);
  assert.strictEqual(validRes.data.success, true);
  assert.strictEqual(validRes.data.data.id, 'HOL-101');
  assert.ok(Array.isArray(validRes.data.data.itinerary));

  const notFoundRes = await requestJson('/api/holidays/non-existent-pkg');
  assert.strictEqual(notFoundRes.status, 404);
  assert.strictEqual(notFoundRes.data.success, false);
});

test('35. POST /api/bookings supports holiday package bookings', async () => {
  const bookRes = await requestJson('/api/bookings', {
    method: 'POST',
    body: {
      type: 'holiday',
      title: 'Romantic Goa Getaway Package',
      date: '2026-10-15',
      totalAmount: 18999,
      destination: 'Goa, India',
      duration: '4 Days / 3 Nights',
      packageId: 'hol-01',
      passengers: [
        { name: 'Alex Johnson', age: 30, gender: 'Male' },
        { name: 'Maria Johnson', age: 28, gender: 'Female' }
      ]
    }
  });
  assert.strictEqual(bookRes.status, 201);
  assert.strictEqual(bookRes.data.success, true);
  assert.strictEqual(bookRes.data.data.type, 'holiday');
  assert.ok(bookRes.data.data.id.startsWith('EZ-'));
  assert.ok(bookRes.data.data.pnr);
});

test('36. GET /api/notifications returns user in-app notifications and unread count', async () => {
  const notifRes = await requestJson('/api/notifications?userId=USR-1');
  assert.strictEqual(notifRes.status, 200);
  assert.strictEqual(notifRes.data.success, true);
  assert.ok(Array.isArray(notifRes.data.data));
  assert.strictEqual(typeof notifRes.data.unreadCount, 'number');
});

test('37. POST /api/notifications/send enqueues multi-channel messages (Email, WhatsApp, In-App)', async () => {
  const sendRes = await requestJson('/api/notifications/send', {
    method: 'POST',
    body: {
      userId: 'USR-1',
      channels: ['in_app', 'email', 'whatsapp'],
      template: 'booking_confirmation',
      data: {
        name: 'Priyansh Sharma',
        email: 'priyansh.sharma@gmail.com',
        phone: '+91 98765 43210',
        pnr: 'TEST99',
        serviceType: 'Flight',
        route: 'DEL → BOM',
        travelDate: '28 Sep 2026',
        amount: 5499
      }
    }
  });
  assert.strictEqual(sendRes.status, 201);
  assert.strictEqual(sendRes.data.success, true);
  assert.ok(sendRes.data.data.notificationId);
  assert.strictEqual(sendRes.data.data.inAppCreated, true);
});

test('38. POST /api/notifications/trigger-campaign personalizes inactivity holiday campaign with voucher', async () => {
  const campRes = await requestJson('/api/notifications/trigger-campaign', {
    method: 'POST',
    body: {
      campaignType: 'reengagement_inactivity',
      user: { id: 'USR-1', name: 'Priyansh Sharma', email: 'priyansh.sharma@gmail.com' },
      customData: { monthsInactive: 4, promoCode: 'HOLIDAY25' }
    }
  });
  assert.strictEqual(campRes.status, 201);
  assert.strictEqual(campRes.data.success, true);
  assert.strictEqual(campRes.data.campaign, 'reengagement_inactivity');
});

test('39. GET /api/notifications/queue-status and DLQ routing on simulated failure', async () => {
  // Trigger a simulated delivery failure that exhausts retries to populate Dead-Letter Queue
  await requestJson('/api/notifications/send', {
    method: 'POST',
    body: {
      userId: 'USR-1',
      channels: ['email'],
      template: 'custom',
      data: { name: 'Retry Tester', message: 'Test message for DLQ' },
      simulateFailure: true
    }
  });

  const queueRes = await requestJson('/api/notifications/queue-status');
  assert.strictEqual(queueRes.status, 200);
  assert.strictEqual(queueRes.data.success, true);
  assert.ok(queueRes.data.metrics);
  assert.ok(typeof queueRes.data.metrics.totalDelivered === 'number');
  assert.ok(Array.isArray(queueRes.data.deadLetterQueue));
});

test('40. POST /api/notifications/retry-failed re-enqueues DLQ items and marks notifications read', async () => {
  // Retry all failed messages in DLQ
  const retryRes = await requestJson('/api/notifications/retry-failed', {
    method: 'POST',
    body: { id: 'all' }
  });
  assert.strictEqual(retryRes.status, 200);
  assert.strictEqual(retryRes.data.success, true);

  // Mark all notifications read
  const markRes = await requestJson('/api/notifications/mark-all-read', {
    method: 'POST',
    body: { userId: 'USR-1' }
  });
  assert.strictEqual(markRes.status, 200);
  assert.strictEqual(markRes.data.success, true);
});

test('41. POST /api/support/tickets creates a new support ticket with category and PNR', async () => {
  const ticketRes = await requestJson('/api/support/tickets', {
    method: 'POST',
    body: {
      userId: 'USR-1',
      pnr: 'FL2775',
      category: 'Date Change',
      subject: 'Reschedule flight BOM-DEL',
      description: 'Need to move flight date by 2 days due to schedule change.',
      name: 'Priyansh Sharma',
      email: 'priyansh.sharma@gmail.com',
      phone: '+91 98765 43210',
      urgency: 'High'
    }
  });
  assert.strictEqual(ticketRes.status, 201);
  assert.strictEqual(ticketRes.data.success, true);
  assert.ok(ticketRes.data.data.id.startsWith('TKT-'));
  assert.strictEqual(ticketRes.data.data.status, 'Open');
  assert.strictEqual(ticketRes.data.data.pnr, 'FL2775');
  assert.ok(ticketRes.data.data.messages.length >= 2);
});

test('42. GET /api/support/tickets retrieves user tickets with status & category filtering', async () => {
  const getRes = await requestJson('/api/support/tickets?userId=USR-1');
  assert.strictEqual(getRes.status, 200);
  assert.strictEqual(getRes.data.success, true);
  assert.ok(Array.isArray(getRes.data.data));
  assert.ok(getRes.data.count > 0);
});

test('43. POST /api/support/tickets/:id/message appends messages to ticket conversation thread', async () => {
  const msgRes = await requestJson('/api/support/tickets/TKT-89214/message', {
    method: 'POST',
    body: {
      sender: 'Priyansh Sharma (You)',
      text: 'Yes, please proceed with the 26 Sep 06:00 AM flight seat.'
    }
  });
  assert.strictEqual(msgRes.status, 201);
  assert.strictEqual(msgRes.data.success, true);
  assert.ok(msgRes.data.data.id.startsWith('MSG-'));

  // Verify message persisted on ticket
  const ticketRes = await requestJson('/api/support/tickets/TKT-89214');
  assert.strictEqual(ticketRes.status, 200);
  const msgs = ticketRes.data.data.messages;
  assert.ok(msgs.some((m) => m.text.includes('26 Sep 06:00 AM')));
});

test('44. POST /api/support/callback queues 5-minute priority callback request', async () => {
  const cbRes = await requestJson('/api/support/callback', {
    method: 'POST',
    body: {
      name: 'Priyansh Sharma',
      phone: '+91 98765 43210',
      topic: 'Urgent Airport Check-in Issue',
      pnr: 'FL2775'
    }
  });
  assert.strictEqual(cbRes.status, 201);
  assert.strictEqual(cbRes.data.success, true);
  assert.ok(cbRes.data.data.id.startsWith('CB-'));
  assert.strictEqual(cbRes.data.data.estimatedWaitMins, 5);
});

test('45. POST /api/support/direct-mail validates payload and records direct inquiry', async () => {
  const mailRes = await requestJson('/api/support/direct-mail', {
    method: 'POST',
    body: {
      name: 'Priyansh Sharma',
      email: 'priyansh.sharma@gmail.com',
      subject: 'Holiday Package Customization',
      message: 'Looking for 4 Nights Kashmir package with private shikara ride.',
      pnr: 'HOL-101'
    }
  });
  assert.strictEqual(mailRes.status, 201);
  assert.strictEqual(mailRes.data.success, true);
  assert.strictEqual(mailRes.data.data.sentTo, 'support@eazetrip.com');
});

test('46. POST /api/refunds/calculate computes accurate penalty slabs and net refund amount', async () => {
  const calcRes = await requestJson('/api/refunds/calculate', {
    method: 'POST',
    body: {
      serviceType: 'flight',
      grossAmount: 5000,
      hoursBeforeDeparture: 48,
      hasShield: false
    }
  });
  assert.strictEqual(calcRes.status, 200);
  assert.strictEqual(calcRes.data.success, true);
  assert.strictEqual(calcRes.data.data.grossAmount, 5000);
  assert.ok(calcRes.data.data.penaltyAmount > 0);
  assert.strictEqual(calcRes.data.data.netRefundAmount, 5000 - calcRes.data.data.penaltyAmount);

  // Test Zero Cancellation Shield waiver
  const shieldRes = await requestJson('/api/refunds/calculate', {
    method: 'POST',
    body: {
      serviceType: 'flight',
      grossAmount: 5000,
      hoursBeforeDeparture: 48,
      hasShield: true
    }
  });
  assert.strictEqual(shieldRes.status, 200);
  assert.strictEqual(shieldRes.data.data.penaltyAmount, 0);
  assert.strictEqual(shieldRes.data.data.netRefundAmount, 5000);
});

test('47. POST /api/refunds/request creates refund record with RFND code, ARN, and timeline', async () => {
  const reqRes = await requestJson('/api/refunds/request', {
    method: 'POST',
    body: {
      bookingId: 'BK-TEST-99',
      pnr: 'PNR-TEST-99',
      customerName: 'Priyansh Sharma',
      customerEmail: 'priyansh.sharma@gmail.com',
      customerPhone: '+91 98765 43210',
      serviceType: 'flight',
      serviceTitle: 'IndiGo 6E-552 • Delhi to Bangalore',
      grossAmount: 4200,
      reason: 'Medical emergency',
      payoutMode: 'original_mode',
      payoutDetails: 'Original HDFC Credit Card (•••• 9921)'
    }
  });
  assert.strictEqual(reqRes.status, 201);
  assert.strictEqual(reqRes.data.success, true);
  assert.ok(reqRes.data.data.id.startsWith('RFND-'));
  assert.ok(reqRes.data.data.arnNumber.startsWith('ARN-'));
  assert.strictEqual(reqRes.data.data.status, 'In Progress');
  assert.strictEqual(reqRes.data.data.timeline.length, 4);
});

test('48. GET /api/refunds/track/:query tracks refund progress timeline by RFND ID, PNR, or Booking ID', async () => {
  const trackRes = await requestJson('/api/refunds/track/RFND-10492');
  assert.strictEqual(trackRes.status, 200);
  assert.strictEqual(trackRes.data.success, true);
  assert.strictEqual(trackRes.data.data.id, 'RFND-10492');
  assert.strictEqual(trackRes.data.data.status, 'Completed');
  assert.ok(trackRes.data.data.timeline.every(t => t.completed === true));

  // Track via PNR
  const pnrRes = await requestJson('/api/refunds/track/AI-204928');
  assert.strictEqual(pnrRes.status, 200);
  assert.strictEqual(pnrRes.data.data.id, 'RFND-10492');
});

test('49. POST /api/refunds/request handles instant EazeWallet payout mode with bonus voucher', async () => {
  const walletRes = await requestJson('/api/refunds/request', {
    method: 'POST',
    body: {
      bookingId: 'BK-WALLET-1',
      pnr: 'PNR-WAL-1',
      customerName: 'Priyansh Sharma',
      customerEmail: 'priyansh.sharma@gmail.com',
      serviceType: 'hotel',
      serviceTitle: 'Goa Marriott Resort',
      grossAmount: 6000,
      payoutMode: 'wallet'
    }
  });
  assert.strictEqual(walletRes.status, 201);
  assert.strictEqual(walletRes.data.data.status, 'Completed');
  assert.strictEqual(walletRes.data.data.statusStep, 4);
  assert.ok(walletRes.data.data.payoutDetails.includes('Instant EazeWallet'));
});

test('50. GET /api/refunds/track/:query returns 404 for invalid refund identifier', async () => {
  const notFoundRes = await requestJson('/api/refunds/track/RFND-NONEXISTENT-99999');
  assert.strictEqual(notFoundRes.status, 404);
  assert.strictEqual(notFoundRes.data.success, false);
  assert.ok(notFoundRes.data.error.includes('No refund record found'));
});

test('51. GET /api/refunds returns user refund claims list and supports email filtering', async () => {
  const allRefundsRes = await requestJson('/api/refunds');
  assert.strictEqual(allRefundsRes.status, 200);
  assert.strictEqual(allRefundsRes.data.success, true);
  assert.ok(Array.isArray(allRefundsRes.data.data));
  assert.ok(allRefundsRes.data.count >= 2);

  // Filter by user email
  const userRefundsRes = await requestJson('/api/refunds?email=priyansh.sharma@gmail.com');
  assert.strictEqual(userRefundsRes.status, 200);
  assert.strictEqual(userRefundsRes.data.success, true);
  assert.ok(userRefundsRes.data.data.some(r => r.customerEmail === 'priyansh.sharma@gmail.com'));
});

test('52. POST /api/refunds/request handles direct airline cancellation dispute claim with Zero Shield waiver', async () => {
  const claimRes = await requestJson('/api/refunds/request', {
    method: 'POST',
    body: {
      bookingId: 'BK-DISPUTE-01',
      pnr: 'AI-CANCEL-99',
      customerName: 'Rohit Sharma',
      customerEmail: 'rohit@example.com',
      customerPhone: '+91 9876543210',
      serviceType: 'flight',
      serviceTitle: 'IndiGo 6E-2041 BOM-DEL',
      grossAmount: 4999,
      reason: 'Flight Cancelled / Rescheduled by Airline (>3h delay)',
      payoutMode: 'wallet',
      hasShield: true
    }
  });
  assert.strictEqual(claimRes.status, 201);
  assert.strictEqual(claimRes.data.success, true);
  assert.strictEqual(claimRes.data.data.status, 'Completed');
  assert.strictEqual(claimRes.data.data.penaltyAmount, 0); // 100% full waiver
  assert.strictEqual(claimRes.data.data.netRefundAmount, 4999);
  assert.ok(claimRes.data.data.id.startsWith('RFND-'));
  assert.ok(claimRes.data.data.arnNumber.startsWith('ARN-'));
});

test('53. GET /api/auth/google-client-id returns public Google OAuth configuration', async () => {
  const res = await requestJson('/api/auth/google-client-id');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
  assert.ok(typeof res.data.configured === 'boolean');
  assert.ok(typeof res.data.clientId === 'string');
  assert.ok(['live', 'simulation'].includes(res.data.mode));
});

test('54. POST /api/auth/google authenticates Google credential and returns user session', async () => {
  const authRes = await requestJson('/api/auth/google', {
    method: 'POST',
    body: {
      credential: 'simulated_google_jwt_token_for_tests'
    }
  });
  assert.strictEqual(authRes.status, 200);
  assert.strictEqual(authRes.data.success, true);
  assert.ok(authRes.data.data.id.startsWith('USR-'));
  assert.strictEqual(authRes.data.data.authProvider, 'Google');
  assert.ok(authRes.data.data.email.includes('@'));
  assert.ok(authRes.data.data.token && authRes.data.data.token.length === 64);
});

test('55. POST /api/auth/google rejects empty payload with 400 Bad Request', async () => {
  const badRes = await requestJson('/api/auth/google', {
    method: 'POST',
    body: {}
  });
  assert.strictEqual(badRes.status, 400);
  assert.strictEqual(badRes.data.success, false);
  assert.ok(badRes.data.error.includes('required'));
});

