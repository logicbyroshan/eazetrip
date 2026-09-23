import { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  RefreshCw,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  LifeBuoy,
  Send,
  CheckCircle,
  XCircle,
  Eye,
  Server,
  Database,
  Radio,
  Clock,
  Search,
  Check
} from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';

export default function AdminDashboardPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('eazetrip_admin_auth') === 'true';
  });
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'bookings' | 'refunds' | 'support' | 'dlq'

  // Data states
  const [metrics, setMetrics] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [dlqItems, setDlqItems] = useState([]);
  const [gateways, setGateways] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Authentication
  const handleVerifyPin = async (e) => {
    e.preventDefault();
    setPinError('');
    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('eazetrip_admin_auth', 'true');
        loadAllData();
      } else {
        setPinError(data.error || 'Invalid administrator credentials');
      }
    } catch (err) {
      setPinError('Connection to admin portal failed');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('eazetrip_admin_auth');
    setIsAuthenticated(false);
    setPin('');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [metricsRes, bookingsRes, refundsRes, ticketsRes, queueRes, provRes] = await Promise.all([
        fetch('/api/admin/metrics').then((r) => r.json()),
        fetch('/api/admin/bookings').then((r) => r.json()),
        fetch('/api/refunds').then((r) => r.json()),
        fetch('/api/support/tickets').then((r) => r.json()),
        fetch('/api/notifications/queue-status').then((r) => r.json()),
        fetch('/api/inventory/providers').then((r) => r.json())
      ]);

      if (metricsRes.success) setMetrics(metricsRes.metrics);
      if (bookingsRes.success) setBookings(bookingsRes.data || []);
      if (refundsRes.success) setRefunds(refundsRes.data || []);
      if (ticketsRes.success) setTickets(ticketsRes.data || []);
      if (queueRes.success) {
        setDlqItems(queueRes.deadLetterQueue || []);
        setGateways(queueRes.gateways || null);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  // Settle Refund
  const handleSettleRefund = async (refundId) => {
    try {
      const res = await fetch(`/api/admin/refunds/${refundId}/settle`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Refund #${refundId} settled successfully! ARN: ${data.data.arnNumber}`);
        loadAllData();
      } else {
        alert(data.error || 'Could not settle refund');
      }
    } catch (e) {
      alert('Error settling refund: ' + e.message);
    }
  };

  // Retry All DLQ
  const handleRetryDlq = async () => {
    try {
      const res = await fetch('/api/admin/dlq/retry-all', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'All DLQ messages re-enqueued for delivery!');
        loadAllData();
      }
    } catch (e) {
      alert('Failed to retry DLQ messages');
    }
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      b.pnr?.toLowerCase().includes(q) ||
      b.id?.toLowerCase().includes(q) ||
      b.email?.toLowerCase().includes(q) ||
      b.title?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || b.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="admin-lock-screen">
        <div className="container" style={{ maxWidth: '440px', padding: '100px 20px' }}>
          <div className="admin-card" style={{ textAlign: 'center', padding: '40px 30px' }}>
            <div className="admin-icon-pill" style={{ margin: '0 auto 20px', background: 'rgba(3, 78, 162, 0.1)', color: '#034ea2' }}>
              <Shield size={36} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              EazeTrip Backoffice
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '24px' }}>
              Operations Concierge & Terminal. Enter security PIN to proceed. (Default: <code>admin123</code>)
            </p>

            <form onSubmit={handleVerifyPin}>
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <input
                  type="password"
                  placeholder="Enter Administrator PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="admin-pin-input"
                  required
                />
                <Lock size={18} style={{ position: 'absolute', right: '16px', top: '16px', color: '#94a3b8' }} />
              </div>

              {pinError && (
                <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '16px', fontWeight: 500 }}>
                  {pinError}
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', height: '48px', fontSize: '0.95rem' }}>
                Authenticate & Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="admin-toast-banner">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="container" style={{ paddingTop: '24px', paddingBottom: '60px' }}>
        <Breadcrumb items={[{ label: 'Operations Backoffice' }]} />

        {/* Dashboard Header Bar */}
        <div className="admin-header-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="admin-badge-live">LIVE SYSTEM TERMINAL</span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                DB: {metrics?.databaseType || 'SQLite Persistent'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0a192f', marginTop: '6px' }}>
              EazeTrip Operations Concierge
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={loadAllData} className="btn-secondary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={15} className={loading ? 'spin' : ''} />
              <span>Refresh</span>
            </button>
            <button onClick={handleLogout} className="btn-outline-danger" style={{ padding: '8px 16px' }}>
              Lock & Exit
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button
            className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <TrendingUp size={16} />
            <span>Overview & KPIs</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <CreditCard size={16} />
            <span>Global Bookings ({bookings.length})</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'refunds' ? 'active' : ''}`}
            onClick={() => setActiveTab('refunds')}
          >
            <AlertTriangle size={16} />
            <span>Refund Settlement ({refunds.filter((r) => r.status !== 'Completed').length})</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'support' ? 'active' : ''}`}
            onClick={() => setActiveTab('support')}
          >
            <LifeBuoy size={16} />
            <span>Concierge Tickets ({tickets.length})</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'dlq' ? 'active' : ''}`}
            onClick={() => setActiveTab('dlq')}
          >
            <Radio size={16} />
            <span>DLQ & Gateways ({dlqItems.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & KPIS */}
        {activeTab === 'overview' && (
          <div className="admin-tab-content">
            <div className="admin-metrics-grid">
              <div className="admin-metric-card">
                <span className="metric-label">Confirmed Revenue</span>
                <span className="metric-val">₹{Number(metrics?.totalRevenueINR || 0).toLocaleString('en-IN')}</span>
                <span className="metric-sub">Across all 5 mediums</span>
              </div>
              <div className="admin-metric-card">
                <span className="metric-label">Total Bookings</span>
                <span className="metric-val">{metrics?.totalBookings || 0}</span>
                <span className="metric-sub">{metrics?.confirmedBookings || 0} Confirmed • {metrics?.cancelledBookings || 0} Cancelled</span>
              </div>
              <div className="admin-metric-card">
                <span className="metric-label">Pending Refunds</span>
                <span className="metric-val" style={{ color: (metrics?.pendingRefunds || 0) > 0 ? '#ea580c' : '#10b981' }}>
                  {metrics?.pendingRefunds || 0}
                </span>
                <span className="metric-sub">{metrics?.totalRefundClaims || 0} Total Claims</span>
              </div>
              <div className="admin-metric-card">
                <span className="metric-label">Open Support Tickets</span>
                <span className="metric-val" style={{ color: (metrics?.openTickets || 0) > 0 ? '#034ea2' : '#64748b' }}>
                  {metrics?.openTickets || 0}
                </span>
                <span className="metric-sub">{metrics?.totalTickets || 0} Total Logged</span>
              </div>
            </div>

            {/* Gateway & System Status Deck */}
            <div className="admin-systems-grid" style={{ marginTop: '24px' }}>
              <div className="admin-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Radio size={18} color="#034ea2" />
                  Communications Gateway Status
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="admin-status-row">
                    <span>SMS Gateway:</span>
                    <span className="status-pill status-active">
                      {gateways?.telecom?.smsLive ? 'Twilio Live Production' : 'Sandbox (Simulated Delivery)'}
                    </span>
                  </div>
                  <div className="admin-status-row">
                    <span>WhatsApp Gateway:</span>
                    <span className="status-pill status-active">
                      {gateways?.telecom?.whatsappLive ? 'Meta WhatsApp Cloud API' : 'Sandbox (Auto Verified)'}
                    </span>
                  </div>
                  <div className="admin-status-row">
                    <span>Email Dispatcher:</span>
                    <span className="status-pill status-active">
                      {gateways?.email?.liveDelivery ? 'Resend / SMTP Live' : 'Branded Mailbox Sandbox'}
                    </span>
                  </div>
                  <div className="admin-status-row">
                    <span>Notification Success Rate:</span>
                    <span style={{ fontWeight: 700, color: '#10b981' }}>{metrics?.notificationSuccessRate || 100}%</span>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Database size={18} color="#034ea2" />
                  Database & System Health
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="admin-status-row">
                    <span>Storage Engine:</span>
                    <span className="status-pill status-active">{metrics?.databaseType || 'Node SQLite WAL'}</span>
                  </div>
                  <div className="admin-status-row">
                    <span>System Uptime:</span>
                    <span>{Math.round((metrics?.systemUptimeSeconds || 0) / 60)} minutes</span>
                  </div>
                  <div className="admin-status-row">
                    <span>Dead-Letter Queue (DLQ):</span>
                    <span style={{ fontWeight: 700, color: (metrics?.dlqCount || 0) > 0 ? '#ef4444' : '#10b981' }}>
                      {metrics?.dlqCount || 0} failed messages
                    </span>
                  </div>
                  <div className="admin-status-row">
                    <span>Inventory Aggregator:</span>
                    <span className="status-pill status-active">Amadeus, Expedia, IRCTC, redBus</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GLOBAL BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="admin-tab-content">
            <div className="admin-filter-bar">
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Search by PNR, Customer Email, Carrier or Booking ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-search-input"
                />
                <Search size={16} style={{ position: 'absolute', right: '14px', top: '14px', color: '#94a3b8' }} />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="admin-select"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>PNR & Service</th>
                    <th>Customer</th>
                    <th>Travel Dates</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id || b.pnr}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#034ea2' }}>{b.pnr}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {b.airline || b.hotelName || b.operator || b.trainName || b.title || 'Travel Booking'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.passengers?.[0]?.name || b.leadPassenger || 'Traveler'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.email || 'N/A'}</div>
                      </td>
                      <td>{b.departureDate || b.checkIn || b.date || 'Upcoming'}</td>
                      <td>
                        <span style={{ fontWeight: 700 }}>₹{Number(b.price || b.totalAmount || 0).toLocaleString('en-IN')}</span>
                      </td>
                      <td>
                        <span className={`status-pill ${b.status?.toLowerCase() === 'confirmed' ? 'status-confirmed' : 'status-cancelled'}`}>
                          {b.status || 'Confirmed'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Eye size={13} /> Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                        No matching booking records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: REFUND SETTLEMENT TERMINAL */}
        {activeTab === 'refunds' && (
          <div className="admin-tab-content">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Refund ID & PNR</th>
                    <th>Customer</th>
                    <th>Gross / Net Refund</th>
                    <th>Payout Mode</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {refunds.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0a192f' }}>{r.id}</div>
                        <div style={{ fontSize: '0.8rem', color: '#034ea2', fontWeight: 600 }}>PNR: {r.pnr || 'N/A'}</div>
                        {r.arnNumber && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ARN: {r.arnNumber}</div>}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{r.customerName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{r.customerEmail}</div>
                      </td>
                      <td>
                        <div>₹{Number(r.netRefundAmount || r.grossAmount || 0).toLocaleString('en-IN')}</div>
                        {r.penaltyAmount > 0 && (
                          <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>-₹{r.penaltyAmount} penalty</div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{r.payoutDetails || r.payoutMode}</div>
                      </td>
                      <td>
                        <span className={`status-pill ${r.status === 'Completed' ? 'status-confirmed' : 'status-pending'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        {r.status !== 'Completed' ? (
                          <button
                            onClick={() => handleSettleRefund(r.id)}
                            className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Check size={13} /> Settle & Issue ARN
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                            Settled on {new Date(r.completedAt || Date.now()).toLocaleDateString('en-IN')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {refunds.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                        No refund claims logged.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CONCIERGE SUPPORT QUEUE */}
        {activeTab === 'support' && (
          <div className="admin-tab-content">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Category & Subject</th>
                    <th>Customer</th>
                    <th>Urgency</th>
                    <th>Status</th>
                    <th>Assigned Specialist</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 700, color: '#034ea2' }}>#{t.id}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{t.category}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.subject || t.description?.slice(0, 45)}...</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{t.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.phone}</div>
                      </td>
                      <td>
                        <span className={`status-pill ${t.urgency?.toLowerCase() === 'high' ? 'status-cancelled' : 'status-confirmed'}`}>
                          {t.urgency || 'Normal'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${t.status === 'Resolved' ? 'status-confirmed' : 'status-pending'}`}>
                          {t.status || 'Open'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                        {t.assignedTo || 'Senior Concierge Specialist'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: DLQ & GATEWAYS */}
        {activeTab === 'dlq' && (
          <div className="admin-tab-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                  Dead-Letter Queue (DLQ) Inspector
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Undelivered communications isolated after retry exhaustion to protect live operations.
                </p>
              </div>

              {dlqItems.length > 0 && (
                <button onClick={handleRetryDlq} className="btn-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RefreshCw size={15} /> Retry All DLQ Messages ({dlqItems.length})
                </button>
              )}
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item ID</th>
                    <th>Channel</th>
                    <th>Recipient</th>
                    <th>Template</th>
                    <th>Attempts</th>
                    <th>Failure Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {dlqItems.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 700 }}>{item.id}</td>
                      <td>
                        <span className="status-pill status-active">{item.channel?.toUpperCase()}</span>
                      </td>
                      <td>{item.recipient}</td>
                      <td>{item.template}</td>
                      <td style={{ fontWeight: 700, color: '#ef4444' }}>{item.attempts} / {item.maxRetries}</td>
                      <td style={{ fontSize: '0.8rem', color: '#dc2626' }}>
                        {item.dlqReason || item.errorLogs?.[0]?.error || 'Handshake timeout'}
                      </td>
                    </tr>
                  ))}
                  {dlqItems.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#10b981', fontWeight: 600 }}>
                        <CheckCircle size={32} style={{ display: 'block', margin: '0 auto 8px', color: '#10b981' }} />
                        Dead-Letter Queue is empty. All communications successfully delivered!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="admin-modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0a192f' }}>
                Booking Details: {selectedBooking.pnr}
              </h3>
              <button onClick={() => setSelectedBooking(null)} className="admin-modal-close">×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <div><strong>Service:</strong> {selectedBooking.airline || selectedBooking.hotelName || selectedBooking.operator || selectedBooking.trainName || selectedBooking.title || 'Travel Booking'}</div>
              <div><strong>Amount:</strong> ₹{Number(selectedBooking.price || selectedBooking.totalAmount || 0).toLocaleString('en-IN')}</div>
              <div><strong>Status:</strong> {selectedBooking.status}</div>
              <div><strong>Customer Email:</strong> {selectedBooking.email}</div>
              <div><strong>Booking Date:</strong> {new Date(selectedBooking.createdAt).toLocaleString('en-IN')}</div>
              {selectedBooking.cancellationReason && (
                <div style={{ color: '#ef4444' }}><strong>Cancellation Reason:</strong> {selectedBooking.cancellationReason}</div>
              )}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button onClick={() => setSelectedBooking(null)} className="btn-secondary" style={{ padding: '8px 16px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
