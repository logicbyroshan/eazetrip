import { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  RefreshCw,
  MessageSquare,
  HelpCircle,
  Headphones,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContactPage() {
  const { user } = useAuth();
  const { showToast, bookings } = useBooking();

  const [formMode, setFormMode] = useState('problem'); // 'problem' | 'inquiry' | 'callback'
  
  // Problem Form state
  const [category, setCategory] = useState('Flight / Train / Bus Booking Issue');
  const [pnr, setPnr] = useState(bookings?.[0]?.pnr || '');
  const [urgency, setUrgency] = useState('High');
  const [problemDescription, setProblemDescription] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  
  // Inquiry Form state
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [captchaCode, setCaptchaCode] = useState('9W4K8');
  const [captchaInput, setCaptchaInput] = useState('');

  // Callback state
  const [cbPhone, setCbPhone] = useState(user?.phone || '');
  const [cbTopic, setCbTopic] = useState('Urgent Airport Check-in');
  const [cbSuccess, setCbSuccess] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [submittedInquiry, setSubmittedInquiry] = useState(false);

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = '';
    for (let i = 0; i < 5; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(res);
  };

  // Submit Problem Ticket
  const handleSubmitProblem = async (e) => {
    e.preventDefault();
    if (!problemDescription.trim()) {
      showToast('Please describe the problem you are facing.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.createSupportTicket({
        userId: user?.id || 'USR-1',
        pnr,
        category,
        subject: `${category} - ${pnr ? `PNR: ${pnr}` : 'Help Request'}`,
        description: problemDescription,
        name: name || 'Valued Traveler',
        email: email || 'traveler@eazetrip.com',
        phone: phone || '+91 98765 43210',
        urgency
      });

      if (res.ok && res.data?.data) {
        setCreatedTicket(res.data.data);
        showToast(`Support Ticket #${res.data.data.id} filed successfully! Team notified.`);
      }
    } catch (err) {
      showToast('Error filing problem ticket.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit General Inquiry
  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    if (captchaInput.toUpperCase() !== captchaCode) {
      showToast('Invalid captcha code entered.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitContact({ name, email, phone, subject, message });
      setSubmittedInquiry(true);
      showToast('Your message has been sent to our customer care team!');
    } catch (err) {
      console.warn('Backend unavailable, proceeding locally', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Callback
  const handleRequestCallback = async (e) => {
    e.preventDefault();
    if (!cbPhone) {
      showToast('Please enter your phone number.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.requestCallback({
        name: name || 'Traveler',
        phone: cbPhone,
        topic: cbTopic,
        pnr
      });
      if (res.ok) {
        setCbSuccess(true);
        showToast('Priority callback requested! Specialist will call in 5 mins.');
      }
    } catch (err) {
      showToast('Error scheduling callback.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppPrefillUrl = () => {
    const text = encodeURIComponent(
      `Hello EazeTrip Support Team,\n\nI need urgent assistance with my travel booking.\n• Name: ${name || 'Traveler'}\n• PNR: ${pnr || 'Not specified'}\n• Issue Category: ${category}\n• Problem Details: ${problemDescription || 'Need immediate concierge support'}\n\nPlease connect with me immediately.`
    );
    return `https://wa.me/918269054018?text=${text}`;
  };

  return (
    <div className="container page-wrap">
      <div className="page-shell">
        <div className="page-topbar">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>24/7 Concierge Support & Problem Desk</span>
        </div>

        <div className="contact-layout-grid">
          {/* Left Contact Information & Quick Connects */}
          <div className="contact-info-col">
            <div className="content-card info-card-themed">
              <span className="section-tag">24/7 DEDICATED CONCIERGE</span>
              <h2>Get in Touch with EazeTrip</h2>
              <p>
                Facing a booking, payment, date change, reschedule, or flight baggage issue? Connect directly with our priority customer support specialists.
              </p>

              <div className="contact-details-stack mt-4">
                <div className="contact-box-item">
                  <div className="contact-icon-box">
                    <Phone size={20} color="#034ea2" />
                  </div>
                  <div>
                    <strong>24x7 Customer Care Helpline</strong>
                    <p><a href="tel:+918269054018" className="accent-link font-bold">+91 8269054018</a> (Toll-Free & Priority)</p>
                  </div>
                </div>

                <div className="contact-box-item">
                  <div className="contact-icon-box">
                    <Mail size={20} color="#0097a7" />
                  </div>
                  <div>
                    <strong>Direct Email Support</strong>
                    <p><a href="mailto:support@eazetrip.com" className="accent-link font-bold">support@eazetrip.com</a></p>
                  </div>
                </div>

                <div className="contact-box-item">
                  <div className="contact-icon-box">
                    <MapPin size={20} color="#e11d48" />
                  </div>
                  <div>
                    <strong>Corporate Headquarters</strong>
                    <p>Saubhagya Bindiya Tower, MP, India</p>
                  </div>
                </div>

                <div className="contact-box-item">
                  <div className="contact-icon-box">
                    <Clock size={20} color="#16a34a" />
                  </div>
                  <div>
                    <strong>Live Response Time</strong>
                    <p>Under 15 Minutes for Critical Travel Issues</p>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Help Block */}
              <div className="whatsapp-help-box mt-4">
                <div className="wa-icon-glow">
                  <MessageSquare size={20} color="#16a34a" />
                </div>
                <div>
                  <strong>Need Instant WhatsApp Help?</strong>
                  <p>Chat directly with our verified concierge desk.</p>
                  <a
                    href={getWhatsAppPrefillUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-action-link"
                  >
                    Start WhatsApp Chat ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Interactive Support Hub Form */}
          <div className="contact-form-col">
            <div className="content-card form-card">
              {/* Form Mode Selector Tabs */}
              <div className="contact-form-mode-tabs mb-4">
                <button
                  type="button"
                  className={`mode-tab-btn ${formMode === 'problem' ? 'active' : ''}`}
                  onClick={() => {
                    setFormMode('problem');
                    setCreatedTicket(null);
                  }}
                >
                  <AlertTriangle size={15} />
                  <span>Report Problem / Ticket</span>
                </button>
                <button
                  type="button"
                  className={`mode-tab-btn ${formMode === 'callback' ? 'active' : ''}`}
                  onClick={() => {
                    setFormMode('callback');
                    setCbSuccess(false);
                  }}
                >
                  <Phone size={15} />
                  <span>5-Min Callback</span>
                </button>
                <button
                  type="button"
                  className={`mode-tab-btn ${formMode === 'inquiry' ? 'active' : ''}`}
                  onClick={() => {
                    setFormMode('inquiry');
                    setSubmittedInquiry(false);
                  }}
                >
                  <Mail size={15} />
                  <span>General Inquiry</span>
                </button>
              </div>

              {/* MODE 1: REPORT PROBLEM TICKET */}
              {formMode === 'problem' && (
                <div>
                  {createdTicket ? (
                    <div className="contact-success-state text-center py-4">
                      <CheckCircle2 size={48} color="#16a34a" className="mx-auto mb-2" />
                      <h3>Problem Ticket Logged Successfully!</h3>
                      <p className="lead text-sm text-slate-600 mb-3">
                        Your issue has been escalated under Ticket ID <strong>#{createdTicket.id}</strong>.
                      </p>

                      <div className="ticket-summary-box text-left mb-4">
                        <div className="ticket-summary-row">
                          <span className="summary-label">Ticket ID:</span>
                          <span className="summary-val font-mono font-bold text-blue-700">#{createdTicket.id}</span>
                        </div>
                        <div className="ticket-summary-row">
                          <span className="summary-label">Category:</span>
                          <span className="summary-val">{createdTicket.category}</span>
                        </div>
                        {createdTicket.pnr && (
                          <div className="ticket-summary-row">
                            <span className="summary-label">PNR:</span>
                            <span className="summary-val font-mono font-bold text-slate-800">{createdTicket.pnr}</span>
                          </div>
                        )}
                        <div className="ticket-summary-row">
                          <span className="summary-label">Assigned Specialist:</span>
                          <span className="summary-val text-emerald-700 font-semibold">{createdTicket.assignedTo}</span>
                        </div>
                        <div className="ticket-summary-row">
                          <span className="summary-label">Response Guarantee:</span>
                          <span className="summary-val text-amber-600 font-bold">Within 15 Minutes</span>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-center">
                        <button
                          type="button"
                          className="secondary-btn small"
                          onClick={() => setCreatedTicket(null)}
                        >
                          Report Another Issue
                        </button>
                        <Link to="/profile" className="primary-btn small">
                          Track in Profile Dashboard →
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitProblem} className="stack-form">
                      <div className="helpdesk-info-banner mb-3">
                        <Sparkles size={16} className="text-blue-600 flex-shrink-0" />
                        <span>
                          Submit your problem details below. A Senior Concierge Specialist will investigate and reach out to you directly.
                        </span>
                      </div>

                      <div className="form-grid two-col mb-3">
                        <div className="form-group mb-0">
                          <label>Problem Category *</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="native-select"
                            required
                          >
                            <option value="Flight / Train / Bus Booking Issue">✈️ Booking & Ticketing Issue</option>
                            <option value="Payment, Billing & Refund Inquiry">💳 Payment & Refund Inquiry</option>
                            <option value="Date Change / Reschedule Assistance">📅 Date Change & Reschedule</option>
                            <option value="Flight Cancellation & Fare Refund">❌ Cancellation & Refund</option>
                            <option value="Baggage & Airport Terminal Assistance">🧳 Baggage & Terminal Issue</option>
                            <option value="Hotel Room & Special Requests">🏨 Hotel Check-in / Room Request</option>
                            <option value="Urgent Emergency at Airport">🚨 Airport Emergency</option>
                          </select>
                        </div>

                        <div className="form-group mb-0">
                          <label>Urgency Level *</label>
                          <select
                            value={urgency}
                            onChange={(e) => setUrgency(e.target.value)}
                            className="native-select"
                          >
                            <option value="Normal">Normal (Response in 30 mins)</option>
                            <option value="High">High Priority (Response in 15 mins)</option>
                            <option value="Emergency">🚨 Urgent / Airport Emergency (Immediate)</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group mb-3">
                        <div className="flex-between-center mb-1">
                          <label>PNR / Booking Reference ID (Optional)</label>
                          {bookings?.length > 0 && (
                            <button
                              type="button"
                              className="text-xs text-blue-600 font-semibold hover:underline"
                              onClick={() => setPnr(bookings[0].pnr)}
                            >
                              Auto-fill active PNR ({bookings[0].pnr})
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. FL2775 or EZ-FL-9910"
                          value={pnr}
                          onChange={(e) => setPnr(e.target.value)}
                          className="font-mono uppercase"
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label>Describe the Problem You Are Facing *</label>
                        <textarea
                          rows={4}
                          placeholder="Explain what happened in detail (e.g. payment deducted, need flight date change, web check-in failing, luggage allowance issue)..."
                          value={problemDescription}
                          onChange={(e) => setProblemDescription(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-grid three-col mb-3">
                        <div className="form-group mb-0">
                          <label>Full Name *</label>
                          <input
                            type="text"
                            placeholder="Priyansh Sharma"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group mb-0">
                          <label>Email *</label>
                          <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group mb-0">
                          <label>WhatsApp / Phone *</label>
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="font-mono"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="primary-btn full py-3 send-inquiry-btn"
                        disabled={isSubmitting}
                      >
                        <Send size={16} />
                        <span>{isSubmitting ? 'ESCALATING TICKET...' : 'SUBMIT PROBLEM TICKET TO CONCIERGE'}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* MODE 2: 5-MINUTE CALLBACK */}
              {formMode === 'callback' && (
                <div>
                  {cbSuccess ? (
                    <div className="contact-success-state text-center py-5">
                      <Phone size={48} color="#16a34a" className="mx-auto mb-2 animate-bounce" />
                      <h3>Priority Call-Back Scheduled!</h3>
                      <p className="lead text-sm text-slate-600 mb-2">
                        Our Senior Specialist is dialing <strong>{cbPhone}</strong>.
                      </p>
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold mb-3">
                        ⏳ Estimated Call Time: Within 5 Minutes
                      </div>
                      <button
                        type="button"
                        className="secondary-btn small"
                        onClick={() => setCbSuccess(false)}
                      >
                        Schedule Another Call
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRequestCallback} className="stack-form">
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900 mb-3 flex items-start gap-2">
                        <Clock size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>5-Minute Priority Call-Back Guarantee:</strong>
                          <p className="mb-0 text-xs text-purple-700">Enter your phone number below and our specialist will call you directly.</p>
                        </div>
                      </div>

                      <div className="form-group mb-3">
                        <label>Your Phone Number to Call *</label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={cbPhone}
                          onChange={(e) => setCbPhone(e.target.value)}
                          className="font-mono"
                          required
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label>Reason / Topic for Call</label>
                        <select
                          value={cbTopic}
                          onChange={(e) => setCbTopic(e.target.value)}
                          className="native-select"
                        >
                          <option value="Urgent Airport Check-in">🚨 Urgent Airport Assistance</option>
                          <option value="Flight Date Change & Fare Difference">✈️ Flight Date Change & Fare Difference</option>
                          <option value="Hotel Booking & Check-in Issue">🏨 Hotel Check-in Issue</option>
                          <option value="Refund & Cancellation Status">💳 Refund Status Inquiry</option>
                          <option value="Custom Holiday Tour Planning">🌴 Custom Holiday Tour Planning</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="primary-btn full py-3 send-inquiry-btn"
                        disabled={isSubmitting}
                      >
                        <Phone size={16} />
                        <span>{isSubmitting ? 'QUEUING CALL...' : 'CALL ME IN 5 MINUTES'}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* MODE 3: GENERAL INQUIRY */}
              {formMode === 'inquiry' && (
                <div>
                  {submittedInquiry ? (
                    <div className="contact-success-state text-center py-5">
                      <CheckCircle2 size={48} color="#16a34a" className="mx-auto mb-2" />
                      <h3>Thank You for Contacting Us!</h3>
                      <p className="lead text-sm text-slate-600 mb-3">
                        Your inquiry reference #INQ-{Math.floor(10000 + Math.random() * 90000)} has been registered. An agent will reply shortly.
                      </p>
                      <button
                        type="button"
                        className="primary-btn mt-3"
                        onClick={() => {
                          setSubmittedInquiry(false);
                          setSubject('');
                          setMessage('');
                          setCaptchaInput('');
                          refreshCaptcha();
                        }}
                      >
                        Send Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitInquiry} className="stack-form">
                      <div className="form-grid two-col mb-3">
                        <div className="form-group mb-0">
                          <label>Your Full Name *</label>
                          <input
                            type="text"
                            placeholder="Priyansh Sharma"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group mb-0">
                          <label>Email Address *</label>
                          <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-grid two-col mb-3">
                        <div className="form-group mb-0">
                          <label>Mobile Number</label>
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                        <div className="form-group mb-0">
                          <label>Subject / Service Type *</label>
                          <input
                            type="text"
                            placeholder="e.g. Tour package inquiry"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group mb-3">
                        <label>Message / Inquiry Details *</label>
                        <textarea
                          rows={4}
                          placeholder="Please provide details regarding your query..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        />
                      </div>

                      {/* Captcha */}
                      <div className="form-group captcha-group mb-3">
                        <label>Security Verification Captcha *</label>
                        <div className="captcha-row">
                          <div className="captcha-badge">{captchaCode}</div>
                          <button
                            type="button"
                            className="captcha-refresh-btn"
                            onClick={refreshCaptcha}
                            title="Refresh Captcha"
                          >
                            <RefreshCw size={16} />
                          </button>
                          <input
                            type="text"
                            placeholder="Enter 5 chars"
                            value={captchaInput}
                            onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                            maxLength={5}
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="primary-btn full py-3 send-inquiry-btn"
                        disabled={isSubmitting}
                      >
                        <Send size={16} />
                        <span>{isSubmitting ? 'SENDING INQUIRY...' : 'SEND INQUIRY MESSAGE'}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
