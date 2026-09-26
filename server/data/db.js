/**
 * EazeTrip Persistent Database Engine
 * Powered by Node.js native DatabaseSync with atomic WAL mode and resilient fallback
 */

const path = require('path');
const fs = require('fs');

let DatabaseSync;
try {
  const sqlite = require('node:sqlite');
  DatabaseSync = sqlite.DatabaseSync;
} catch (e) {
  DatabaseSync = null;
}

const mockStore = require('./mockStore');

const DB_PATH = process.env.NODE_ENV === 'test'
  ? ':memory:'
  : (process.env.DATABASE_PATH || path.join(__dirname, 'eazetrip.db'));

class PersistentDB {
  constructor() {
    this.isNativeSqlite = Boolean(DatabaseSync);
    this.db = null;
    this.fallbackStore = {
      users: [],
      bookings: [],
      refunds: [],
      support_tickets: [],
      support_callbacks: [],
      notifications: [],
      dlq_records: [],
      reviews: [],
      consent_records: [],
      privacy_grievances: [],
      nominees: [],
      breach_incidents: [],
      data_erasure_requests: []
    };

    this.init();
  }

  init() {
    if (this.isNativeSqlite) {
      try {
        this.db = new DatabaseSync(DB_PATH);
        this.db.exec('PRAGMA journal_mode = WAL;');
        this.createTables();
        this.seedInitialData();
        console.log(`[Database] Native SQLite persistent database initialized at ${DB_PATH}`);
        return;
      } catch (err) {
        console.warn('[Database] Native SQLite initialization error, falling back to JSON persistence:', err.message);
        this.isNativeSqlite = false;
      }
    }

    // JSON file fallback if native sqlite encounters restrictions
    this.fallbackPath = path.join(__dirname, 'eazetrip_store.json');
    if (fs.existsSync(this.fallbackPath)) {
      try {
        const raw = fs.readFileSync(this.fallbackPath, 'utf8');
        this.fallbackStore = { ...this.fallbackStore, ...JSON.parse(raw) };
      } catch (e) {
        console.warn('[Database] Could not read fallback store, creating fresh store');
      }
    }
    this.seedFallback();
    console.log(`[Database] File-backed persistent JSON store initialized at ${this.fallbackPath}`);
  }

  saveFallback() {
    try {
      fs.writeFileSync(this.fallbackPath, JSON.stringify(this.fallbackStore, null, 2), 'utf8');
    } catch (err) {
      console.error('[Database Fallback Save Error]:', err.message);
    }
  }

  createTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT,
        phone TEXT,
        name TEXT,
        tier TEXT,
        token TEXT,
        data TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        pnr TEXT UNIQUE,
        user_id TEXT,
        email TEXT,
        service_type TEXT,
        status TEXT,
        amount REAL,
        data TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS refunds (
        id TEXT PRIMARY KEY,
        booking_id TEXT,
        pnr TEXT,
        arn_number TEXT,
        status TEXT,
        amount REAL,
        data TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS support_tickets (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        pnr TEXT,
        category TEXT,
        status TEXT,
        urgency TEXT,
        data TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS support_callbacks (
        id TEXT PRIMARY KEY,
        name TEXT,
        phone TEXT,
        topic TEXT,
        pnr TEXT,
        status TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        category TEXT,
        read INTEGER,
        data TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS dlq_records (
        id TEXT PRIMARY KEY,
        template TEXT,
        channels TEXT,
        status TEXT,
        data TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        service_type TEXT,
        service_id TEXT,
        user_id TEXT,
        user_name TEXT,
        rating REAL,
        comment TEXT,
        photos TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS consent_records (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        purpose TEXT,
        status TEXT,
        notice_version TEXT,
        data TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS privacy_grievances (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        pnr TEXT,
        category TEXT,
        status TEXT,
        data TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS nominees (
        user_id TEXT PRIMARY KEY,
        nominee_name TEXT,
        email TEXT,
        phone TEXT,
        data TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS breach_incidents (
        id TEXT PRIMARY KEY,
        title TEXT,
        severity TEXT,
        status TEXT,
        data TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS data_erasure_requests (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        status TEXT,
        data TEXT,
        created_at TEXT
      );
    `);
  }

  seedInitialData() {
    const bookingCount = this.db.prepare('SELECT count(*) as count FROM bookings').get();
    if (bookingCount && bookingCount.count === 0 && mockStore.bookings && mockStore.bookings.length > 0) {
      const insertBooking = this.db.prepare(`
        INSERT INTO bookings (id, pnr, user_id, email, service_type, status, amount, data, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const b of mockStore.bookings) {
        insertBooking.run(
          b.id,
          b.pnr,
          b.userId || 'USR-1',
          b.email || 'traveler@eazetrip.com',
          b.type || 'FL',
          b.status || 'Confirmed',
          Number(b.price || b.totalAmount || 0),
          JSON.stringify(b),
          b.createdAt || new Date().toISOString()
        );
      }
      console.log(`[Database] Seeded ${mockStore.bookings.length} initial bookings from mockStore.`);
    }

    const userCount = this.db.prepare('SELECT count(*) as count FROM users').get();
    if (userCount && userCount.count === 0) {
      const insertUser = this.db.prepare(`
        INSERT INTO users (id, email, phone, name, tier, token, data, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const defaultUsers = [
        {
          id: 'USR-1',
          name: 'Priyansh Sharma',
          email: 'priyansh.sharma@gmail.com',
          phone: '+91 98765 43210',
          tier: 'Platinum Voyager',
          token: 'token_priyansh_demo_voyager',
          memberSince: 2024,
          walletBalance: 4850
        },
        {
          id: 'USR-2',
          name: 'Ananya Roy',
          email: 'ananya.roy@example.com',
          phone: '+91 98112 34567',
          tier: 'Gold Explorer',
          token: 'token_ananya_demo_explorer',
          memberSince: 2025,
          walletBalance: 2400
        }
      ];

      for (const u of defaultUsers) {
        insertUser.run(
          u.id,
          u.email,
          u.phone,
          u.name,
          u.tier,
          u.token,
          JSON.stringify(u),
          new Date().toISOString()
        );
      }
      console.log(`[Database] Seeded default user accounts.`);
    }
  }

  seedFallback() {
    if (this.fallbackStore.bookings.length === 0 && mockStore.bookings) {
      this.fallbackStore.bookings = [...mockStore.bookings];
    }
    if (this.fallbackStore.users.length === 0) {
      this.fallbackStore.users = [
        {
          id: 'USR-1',
          name: 'Priyansh Sharma',
          email: 'priyansh.sharma@gmail.com',
          phone: '+91 98765 43210',
          tier: 'Platinum Voyager',
          token: 'token_priyansh_demo_voyager',
          memberSince: 2024,
          walletBalance: 4850
        }
      ];
    }
    this.saveFallback();
  }

  // ==========================================
  // BOOKINGS CRUD
  // ==========================================
  getAllBookings(filters = {}) {
    if (!this.isNativeSqlite) {
      let list = [...this.fallbackStore.bookings];
      if (filters.userId) list = list.filter((b) => b.userId === filters.userId);
      if (filters.email) list = list.filter((b) => b.email?.toLowerCase() === filters.email.toLowerCase() || b.passengers?.some(p => p.email?.toLowerCase() === filters.email.toLowerCase()));
      if (filters.status) list = list.filter((b) => b.status?.toLowerCase() === filters.status.toLowerCase());
      if (filters.type) list = list.filter((b) => b.type?.toLowerCase() === filters.type.toLowerCase());
      return list;
    }

    let query = 'SELECT data FROM bookings WHERE 1=1';
    const params = [];

    if (filters.userId) {
      query += ' AND user_id = ?';
      params.push(filters.userId);
    }
    if (filters.email) {
      query += ' AND (lower(email) = lower(?) OR data LIKE ?)';
      params.push(filters.email, `%${filters.email.toLowerCase()}%`);
    }
    if (filters.status) {
      query += ' AND lower(status) = lower(?)';
      params.push(filters.status);
    }
    if (filters.type) {
      query += ' AND lower(service_type) = lower(?)';
      params.push(filters.type);
    }

    query += ' ORDER BY created_at DESC';

    const rows = this.db.prepare(query).all(...params);
    return rows.map((r) => JSON.parse(r.data));
  }

  getBookingByIdOrPnr(idOrPnr) {
    if (!idOrPnr) return null;
    if (!this.isNativeSqlite) {
      const q = String(idOrPnr).toLowerCase();
      return this.fallbackStore.bookings.find((b) => b.id?.toLowerCase() === q || b.pnr?.toLowerCase() === q) || null;
    }

    const row = this.db.prepare('SELECT data FROM bookings WHERE lower(id) = lower(?) OR lower(pnr) = lower(?)').get(idOrPnr, idOrPnr);
    return row ? JSON.parse(row.data) : null;
  }

  createBooking(booking) {
    const pnr = booking.pnr || `${(booking.type || 'FL').slice(0, 2).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;
    const id = booking.id || `EZ-${(booking.type || 'FL').slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const email = booking.email || booking.passengers?.[0]?.email || 'traveler@eazetrip.com';
    const createdAt = booking.createdAt || new Date().toISOString();

    const record = {
      ...booking,
      id,
      pnr,
      email,
      status: booking.status || 'Confirmed',
      paymentStatus: booking.paymentStatus || 'Paid',
      createdAt
    };

    if (!this.isNativeSqlite) {
      this.fallbackStore.bookings.unshift(record);
      this.saveFallback();
      return record;
    }

    const insert = this.db.prepare(`
      INSERT INTO bookings (id, pnr, user_id, email, service_type, status, amount, data, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      record.id,
      record.pnr,
      record.userId || 'USR-1',
      record.email,
      record.type || 'FL',
      record.status,
      Number(record.price || record.totalAmount || 0),
      JSON.stringify(record),
      record.createdAt
    );

    return record;
  }

  updateBooking(idOrPnr, updates) {
    const existing = this.getBookingByIdOrPnr(idOrPnr);
    if (!existing) return null;

    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };

    if (!this.isNativeSqlite) {
      const idx = this.fallbackStore.bookings.findIndex((b) => b.id === existing.id);
      if (idx !== -1) {
        this.fallbackStore.bookings[idx] = updated;
        this.saveFallback();
      }
      return updated;
    }

    const updateStmt = this.db.prepare(`
      UPDATE bookings
      SET status = ?, amount = ?, data = ?
      WHERE id = ? OR pnr = ?
    `);

    updateStmt.run(
      updated.status || 'Confirmed',
      Number(updated.price || updated.totalAmount || 0),
      JSON.stringify(updated),
      existing.id,
      existing.pnr
    );

    return updated;
  }

  // ==========================================
  // USERS CRUD
  // ==========================================
  findUserByEmailOrPhone(identifier) {
    if (!identifier) return null;
    const clean = String(identifier).trim().toLowerCase();
    const phoneClean = clean.replace(/[\s-]/g, '');

    if (!this.isNativeSqlite) {
      return (
        this.fallbackStore.users.find(
          (u) =>
            u.email?.toLowerCase() === clean ||
            (u.phone && u.phone.replace(/[\s-]/g, '') === phoneClean)
        ) || null
      );
    }

    const row = this.db
      .prepare(`SELECT data FROM users WHERE lower(email) = ? OR replace(phone, ' ', '') = ? LIMIT 1`)
      .get(clean, phoneClean);

    return row ? JSON.parse(row.data) : null;
  }

  findUserById(id) {
    if (!id) return null;
    if (!this.isNativeSqlite) {
      return this.fallbackStore.users.find((u) => u.id === id) || null;
    }
    const row = this.db.prepare('SELECT data FROM users WHERE id = ?').get(id);
    return row ? JSON.parse(row.data) : null;
  }

  upsertUser(userData) {
    const existing =
      (userData.id && this.findUserById(userData.id)) ||
      (userData.email && this.findUserByEmailOrPhone(userData.email)) ||
      (userData.phone && this.findUserByEmailOrPhone(userData.phone));

    const id = existing?.id || userData.id || `USR-${Math.floor(100000 + Math.random() * 900000)}`;
    const merged = { ...(existing || {}), ...userData, id };

    if (!this.isNativeSqlite) {
      const idx = this.fallbackStore.users.findIndex((u) => u.id === id);
      if (idx !== -1) {
        this.fallbackStore.users[idx] = merged;
      } else {
        this.fallbackStore.users.push(merged);
      }
      this.saveFallback();
      return merged;
    }

    const upsertStmt = this.db.prepare(`
      INSERT INTO users (id, email, phone, name, tier, token, data, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        email=excluded.email,
        phone=excluded.phone,
        name=excluded.name,
        tier=excluded.tier,
        token=excluded.token,
        data=excluded.data
    `);

    upsertStmt.run(
      merged.id,
      merged.email || '',
      merged.phone || '',
      merged.name || 'Traveler',
      merged.tier || 'Classic Explorer',
      merged.token || '',
      JSON.stringify(merged),
      merged.createdAt || new Date().toISOString()
    );

    return merged;
  }

  // ==========================================
  // REFUNDS CRUD
  // ==========================================
  getAllRefunds(userQuery = '') {
    if (!this.isNativeSqlite) {
      let list = [...this.fallbackStore.refunds];
      if (userQuery) {
        const q = userQuery.toLowerCase();
        list = list.filter((r) => r.customerEmail?.toLowerCase() === q || r.customerName?.toLowerCase().includes(q));
      }
      return list;
    }

    if (!userQuery) {
      const rows = this.db.prepare('SELECT data FROM refunds ORDER BY created_at DESC').all();
      return rows.map((r) => JSON.parse(r.data));
    }

    const rows = this.db
      .prepare('SELECT data FROM refunds WHERE lower(data) LIKE ? ORDER BY created_at DESC')
      .all(`%${userQuery.toLowerCase()}%`);
    return rows.map((r) => JSON.parse(r.data));
  }

  getRefundByQuery(query) {
    if (!query) return null;
    const q = String(query).toLowerCase().trim();

    if (!this.isNativeSqlite) {
      return (
        this.fallbackStore.refunds.find(
          (r) =>
            r.id?.toLowerCase() === q ||
            r.pnr?.toLowerCase() === q ||
            r.bookingId?.toLowerCase() === q ||
            r.arnNumber?.toLowerCase() === q
        ) || null
      );
    }

    const row = this.db
      .prepare(
        'SELECT data FROM refunds WHERE lower(id) = ? OR lower(pnr) = ? OR lower(booking_id) = ? OR lower(arn_number) = ?'
      )
      .get(q, q, q, q);

    return row ? JSON.parse(row.data) : null;
  }

  createRefund(refund) {
    if (!this.isNativeSqlite) {
      this.fallbackStore.refunds.unshift(refund);
      this.saveFallback();
      return refund;
    }

    const insert = this.db.prepare(`
      INSERT INTO refunds (id, booking_id, pnr, arn_number, status, amount, data, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      refund.id,
      refund.bookingId || '',
      refund.pnr || '',
      refund.arnNumber || '',
      refund.status || 'Initiated',
      Number(refund.amount || 0),
      JSON.stringify(refund),
      refund.createdAt || new Date().toISOString()
    );

    return refund;
  }

  updateRefund(id, updates) {
    const existing = this.getRefundByQuery(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };

    if (!this.isNativeSqlite) {
      const idx = this.fallbackStore.refunds.findIndex((r) => r.id === existing.id);
      if (idx !== -1) {
        this.fallbackStore.refunds[idx] = updated;
        this.saveFallback();
      }
      return updated;
    }

    const updateStmt = this.db.prepare(`
      UPDATE refunds SET status = ?, amount = ?, data = ? WHERE id = ?
    `);

    updateStmt.run(updated.status, Number(updated.amount || 0), JSON.stringify(updated), existing.id);
    return updated;
  }

  // ==========================================
  // SUPPORT TICKETS & CALLBACKS
  // ==========================================
  getSupportTickets(filters = {}) {
    if (!this.isNativeSqlite) {
      let list = [...this.fallbackStore.support_tickets];
      if (filters.userId) list = list.filter((t) => t.userId === filters.userId);
      if (filters.pnr) list = list.filter((t) => t.pnr?.toLowerCase() === filters.pnr.toLowerCase());
      if (filters.status) list = list.filter((t) => t.status?.toLowerCase() === filters.status.toLowerCase());
      if (filters.category) list = list.filter((t) => t.category?.toLowerCase() === filters.category.toLowerCase());
      return list;
    }

    let query = 'SELECT data FROM support_tickets WHERE 1=1';
    const params = [];
    if (filters.userId) {
      query += ' AND user_id = ?';
      params.push(filters.userId);
    }
    if (filters.pnr) {
      query += ' AND lower(pnr) = lower(?)';
      params.push(filters.pnr);
    }
    if (filters.status) {
      query += ' AND lower(status) = lower(?)';
      params.push(filters.status);
    }
    if (filters.category) {
      query += ' AND lower(category) = lower(?)';
      params.push(filters.category);
    }
    query += ' ORDER BY created_at DESC';

    const rows = this.db.prepare(query).all(...params);
    return rows.map((r) => JSON.parse(r.data));
  }

  getSupportTicketById(id) {
    if (!id) return null;
    if (!this.isNativeSqlite) {
      return this.fallbackStore.support_tickets.find((t) => t.id === id) || null;
    }
    const row = this.db.prepare('SELECT data FROM support_tickets WHERE id = ?').get(id);
    return row ? JSON.parse(row.data) : null;
  }

  createSupportTicket(ticket) {
    if (!this.isNativeSqlite) {
      this.fallbackStore.support_tickets.unshift(ticket);
      this.saveFallback();
      return ticket;
    }

    const insert = this.db.prepare(`
      INSERT INTO support_tickets (id, user_id, pnr, category, status, urgency, data, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      ticket.id,
      ticket.userId || 'USR-1',
      ticket.pnr || '',
      ticket.category || 'General',
      ticket.status || 'Open',
      ticket.urgency || 'Normal',
      JSON.stringify(ticket),
      ticket.createdAt || new Date().toISOString()
    );

    return ticket;
  }

  updateSupportTicket(id, updates) {
    const existing = this.getSupportTicketById(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };

    if (!this.isNativeSqlite) {
      const idx = this.fallbackStore.support_tickets.findIndex((t) => t.id === id);
      if (idx !== -1) {
        this.fallbackStore.support_tickets[idx] = updated;
        this.saveFallback();
      }
      return updated;
    }

    const updateStmt = this.db.prepare(`
      UPDATE support_tickets SET status = ?, urgency = ?, data = ? WHERE id = ?
    `);

    updateStmt.run(updated.status, updated.urgency, JSON.stringify(updated), id);
    return updated;
  }

  createCallback(callbackData) {
    const record = {
      id: `CB-${Math.floor(1000 + Math.random() * 9000)}`,
      ...callbackData,
      status: 'Queued (Agent calling in < 5 mins)',
      createdAt: new Date().toISOString()
    };

    if (!this.isNativeSqlite) {
      this.fallbackStore.support_callbacks.unshift(record);
      this.saveFallback();
      return record;
    }

    const insert = this.db.prepare(`
      INSERT INTO support_callbacks (id, name, phone, topic, pnr, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      record.id,
      record.name || '',
      record.phone || '',
      record.topic || 'General Inquiry',
      record.pnr || '',
      record.status,
      record.createdAt
    );

    return record;
  }

  // ==========================================
  // REVIEWS & RATINGS CRUD
  // ==========================================
  getReviews(serviceType, serviceId) {
    if (!this.isNativeSqlite) {
      let list = [...this.fallbackStore.reviews];
      if (serviceType) list = list.filter((r) => r.serviceType?.toLowerCase() === serviceType.toLowerCase());
      if (serviceId) list = list.filter((r) => r.serviceId === serviceId);
      return list;
    }

    let query = 'SELECT * FROM reviews WHERE 1=1';
    const params = [];
    if (serviceType) {
      query += ' AND lower(service_type) = lower(?)';
      params.push(serviceType);
    }
    if (serviceId) {
      query += ' AND service_id = ?';
      params.push(serviceId);
    }
    query += ' ORDER BY created_at DESC';

    const rows = this.db.prepare(query).all(...params);
    return rows.map((r) => ({
      id: r.id,
      serviceType: r.service_type,
      serviceId: r.service_id,
      userId: r.user_id,
      userName: r.user_name,
      rating: r.rating,
      comment: r.comment,
      photos: r.photos ? JSON.parse(r.photos) : [],
      createdAt: r.created_at
    }));
  }

  createReview(review) {
    const record = {
      id: `REV-${Math.floor(10000 + Math.random() * 90000)}`,
      serviceType: review.serviceType || 'Flight',
      serviceId: review.serviceId,
      userId: review.userId || 'USR-1',
      userName: review.userName || 'Verified Traveler',
      rating: Math.max(1, Math.min(5, Number(review.rating) || 5)),
      comment: review.comment || '',
      photos: Array.isArray(review.photos) ? review.photos : [],
      createdAt: new Date().toISOString()
    };

    if (!this.isNativeSqlite) {
      this.fallbackStore.reviews.unshift(record);
      this.saveFallback();
      return record;
    }

    const insert = this.db.prepare(`
      INSERT INTO reviews (id, service_type, service_id, user_id, user_name, rating, comment, photos, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      record.id,
      record.serviceType,
      record.serviceId,
      record.userId,
      record.userName,
      record.rating,
      record.comment,
      JSON.stringify(record.photos),
      record.createdAt
    );

    return record;
  }

  // ==========================================
  // DPDP ACT 2023 & RULES 2025 DATA GOVERNANCE
  // ==========================================

  // 1. Consent Records
  saveConsentRecord(record) {
    if (!this.isNativeSqlite) {
      this.fallbackStore.consent_records.unshift(record);
      this.saveFallback();
      return record;
    }

    const insert = this.db.prepare(`
      INSERT INTO consent_records (id, user_id, purpose, status, notice_version, data, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      record.id,
      record.userId || 'USR-1',
      record.purpose,
      record.status,
      record.noticeVersion || 'v2026.1',
      JSON.stringify(record),
      record.createdAt || new Date().toISOString()
    );

    return record;
  }

  getConsentRecords(userId = 'USR-1') {
    if (!this.isNativeSqlite) {
      return this.fallbackStore.consent_records.filter((c) => c.userId === userId);
    }

    const rows = this.db.prepare('SELECT data FROM consent_records WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    return rows.map((r) => JSON.parse(r.data));
  }

  // 2. Privacy Grievances
  saveGrievance(record) {
    if (!this.isNativeSqlite) {
      this.fallbackStore.privacy_grievances.unshift(record);
      this.saveFallback();
      return record;
    }

    const insert = this.db.prepare(`
      INSERT INTO privacy_grievances (id, user_id, pnr, category, status, data, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      record.id,
      record.userId || 'USR-1',
      record.pnr || '',
      record.category || 'General',
      record.status || 'Open',
      JSON.stringify(record),
      record.filedAt || new Date().toISOString()
    );

    return record;
  }

  getGrievances(userId = 'USR-1') {
    if (!this.isNativeSqlite) {
      return this.fallbackStore.privacy_grievances.filter((g) => !userId || g.userId === userId);
    }

    if (!userId) {
      const rows = this.db.prepare('SELECT data FROM privacy_grievances ORDER BY created_at DESC').all();
      return rows.map((r) => JSON.parse(r.data));
    }

    const rows = this.db.prepare('SELECT data FROM privacy_grievances WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    return rows.map((r) => JSON.parse(r.data));
  }

  getGrievanceById(id) {
    if (!id) return null;
    if (!this.isNativeSqlite) {
      return this.fallbackStore.privacy_grievances.find((g) => g.id === id) || null;
    }

    const row = this.db.prepare('SELECT data FROM privacy_grievances WHERE id = ?').get(id);
    return row ? JSON.parse(row.data) : null;
  }

  // 3. Nominees (Section 14)
  saveNominee(record) {
    if (!this.isNativeSqlite) {
      const idx = this.fallbackStore.nominees.findIndex((n) => n.userId === record.userId);
      if (idx !== -1) {
        this.fallbackStore.nominees[idx] = record;
      } else {
        this.fallbackStore.nominees.push(record);
      }
      this.saveFallback();
      return record;
    }

    const insert = this.db.prepare(`
      INSERT INTO nominees (user_id, nominee_name, email, phone, data, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        nominee_name=excluded.nominee_name,
        email=excluded.email,
        phone=excluded.phone,
        data=excluded.data
    `);

    insert.run(
      record.userId,
      record.nomineeName,
      record.email,
      record.phone,
      JSON.stringify(record),
      record.appointedAt || new Date().toISOString()
    );

    return record;
  }

  getNominee(userId = 'USR-1') {
    if (!userId) return null;
    if (!this.isNativeSqlite) {
      return this.fallbackStore.nominees.find((n) => n.userId === userId) || null;
    }

    const row = this.db.prepare('SELECT data FROM nominees WHERE user_id = ?').get(userId);
    return row ? JSON.parse(row.data) : null;
  }

  // 4. Data Erasure Requests (Section 12(3))
  saveErasureRequest(record) {
    if (!this.isNativeSqlite) {
      this.fallbackStore.data_erasure_requests.unshift(record);
      this.saveFallback();
      return record;
    }

    const insert = this.db.prepare(`
      INSERT INTO data_erasure_requests (id, user_id, status, data, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    insert.run(
      record.id,
      record.userId,
      record.status,
      JSON.stringify(record),
      record.requestedAt || new Date().toISOString()
    );

    return record;
  }

  getErasureRequests(userId) {
    if (!this.isNativeSqlite) {
      return userId
        ? this.fallbackStore.data_erasure_requests.filter((e) => e.userId === userId)
        : this.fallbackStore.data_erasure_requests;
    }

    if (userId) {
      const rows = this.db.prepare('SELECT data FROM data_erasure_requests WHERE user_id = ? ORDER BY created_at DESC').all(userId);
      return rows.map((r) => JSON.parse(r.data));
    }

    const rows = this.db.prepare('SELECT data FROM data_erasure_requests ORDER BY created_at DESC').all();
    return rows.map((r) => JSON.parse(r.data));
  }

  // 5. Breach Incident Management (Section 8(6))
  saveBreachIncident(record) {
    if (!this.isNativeSqlite) {
      this.fallbackStore.breach_incidents.unshift(record);
      this.saveFallback();
      return record;
    }

    const insert = this.db.prepare(`
      INSERT INTO breach_incidents (id, title, severity, status, data, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      record.id,
      record.title,
      record.severity,
      record.status,
      JSON.stringify(record),
      record.detectedAt || new Date().toISOString()
    );

    return record;
  }

  getAllBreachIncidents() {
    if (!this.isNativeSqlite) {
      return [...this.fallbackStore.breach_incidents];
    }

    const rows = this.db.prepare('SELECT data FROM breach_incidents ORDER BY created_at DESC').all();
    return rows.map((r) => JSON.parse(r.data));
  }

  getBreachIncidentById(id) {
    if (!id) return null;
    if (!this.isNativeSqlite) {
      return this.fallbackStore.breach_incidents.find((b) => b.id === id) || null;
    }

    const row = this.db.prepare('SELECT data FROM breach_incidents WHERE id = ?').get(id);
    return row ? JSON.parse(row.data) : null;
  }

  // 6. Retention Engine Pruning (Section 8(7))
  pruneStaleNotifications(cutoffIsoDate) {
    let count = 0;
    if (!this.isNativeSqlite) {
      const beforeLen = this.fallbackStore.notifications.length;
      this.fallbackStore.notifications = this.fallbackStore.notifications.filter(
        (n) => n.createdAt > cutoffIsoDate
      );
      count = beforeLen - this.fallbackStore.notifications.length;
      this.saveFallback();
      return count;
    }

    try {
      const res = this.db.prepare('DELETE FROM notifications WHERE created_at < ?').run(cutoffIsoDate);
      return res.changes || 0;
    } catch {
      return 0;
    }
  }
}

// Singleton export
const db = new PersistentDB();
module.exports = db;
