import React, { useState, useEffect } from 'react';
import {
  Headphones,
  X,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Send,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  FileText,
  Sparkles,
  User,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { api } from '../../services/api';

export default function HelpDeskWidget() {
  const { user, isAuthenticated } = useAuth();
  const { bookings, showToast } = useBooking();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('report'); // 'report' | 'whatsapp' | 'mail' | 'callback' | 'tickets'

  // Form states - Report Problem
  const [category, setCategory] = useState('Booking & PNR Issue');
  const [pnr, setPnr] = useState(bookings?.[0]?.pnr || '');
  const [urgency, setUrgency] = useState('High');
  const [problemDescription, setProblemDescription] = useState('');
  const [passengerName, setPassengerName] = useState(user?.name || 'Priyansh Sharma');
  const [passengerEmail, setPassengerEmail] = useState(user?.email || 'priyansh.sharma@gmail.com');
  const [passengerPhone, setPassengerPhone] = useState(user?.phone || '+91 98765 43210');
  const [submitting, setSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);

  // Form states - Callback
  const [cbPhone, setCbPhone] = useState(user?.phone || '+91 98765 43210');
  const [cbTopic, setCbTopic] = useState('Urgent Airport Assistance');
  const [cbSuccess, setCbSuccess] = useState(false);

  // Form states - Direct Mail
  const [mailSubject, setMailSubject] = useState('');
  const [mailBody, setMailBody] = useState('');
  const [mailSent, setMailSent] = useState(false);

  // Tickets state
  const [myTickets, setMyTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loadingTickets, setLoadingTickets] = useState(false);

  // Auto-sync contact details with auth state
  useEffect(() => {
    if (user) {
      if (user.name) setPassengerName(user.name);
      if (user.email) setPassengerEmail(user.email);
      if (user.phone) {
        setPassengerPhone(user.phone);
        setCbPhone(user.phone);
      }
    }
  }, [user]);

  // Fetch tickets when tab opens
  const fetchMyTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await api.getSupportTickets({ userId: user?.id || 'USR-1' });
      if (res.data) {
        setMyTickets(res.data);
        if (res.data.length > 0 && !selectedTicket) {
          setSelectedTicket(res.data[0]);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch tickets:', e);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'tickets') {
      fetchMyTickets();
    }
  }, [isOpen, activeTab]);

  // Submit Problem Ticket
  const handleSubmitProblem = async (e) => {
    e.preventDefault();
    if (!problemDescription.trim()) {
      showToast('Please describe the problem you are facing.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createSupportTicket({
        userId: user?.id || 'USR-1',
        pnr,
        category,
        subject: `${category} - ${pnr ? `PNR ${pnr}` : 'Travel Issue'}`,
        description: problemDescription,
        name: passengerName,
        email: passengerEmail,
        phone: passengerPhone,
        urgency
      });

      if (res.ok && res.data?.data) {
        setCreatedTicket(res.data.data);
        setProblemDescription('');
        showToast(`Support Ticket #${res.data.data.id} created! Confirmation sent via WhatsApp & Email.`);
      }
    } catch (err) {
      showToast('Error filing problem ticket.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit 5-min Callback
  const handleRequestCallback = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.requestCallback({
        name: passengerName,
        phone: cbPhone,
        topic: cbTopic,
        pnr
      });
      if (res.ok) {
        setCbSuccess(true);
        showToast('Callback request queued! A specialist will call within 5 minutes.');
      }
    } catch (err) {
      showToast('Error requesting callback.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Send Direct In-App Mail
  const handleSendDirectMail = async (e) => {
    e.preventDefault();
    if (!mailBody.trim()) {
      showToast('Please enter your message.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.sendDirectSupportMail({
        name: passengerName,
        email: passengerEmail,
        phone: passengerPhone,
        subject: mailSubject || 'Direct Support Inquiry',
        message: mailBody,
        pnr
      });
      if (res.ok) {
        setMailSent(true);
        showToast('Direct email sent to support@eazetrip.com!');
      }
    } catch (err) {
      showToast('Error sending email.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Post reply to ticket thread
  const handleSendTicketReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    try {
      const res = await api.addTicketMessage(selectedTicket.id, {
        sender: `${passengerName} (You)`,
        text: replyText,
        role: 'user'
      });
      if (res.ok && res.data?.data) {
        setSelectedTicket((prev) => ({
          ...prev,
          messages: [...prev.messages, res.data.data]
        }));
        setReplyText('');
        showToast('Reply added to ticket conversation!');
      }
    } catch (err) {
      showToast('Failed to post reply.', 'error');
    }
  };

  const getWhatsAppPrefillUrl = () => {
    const text = encodeURIComponent(
      `Hello EazeTrip Support Team,\n\nI need urgent assistance with my travel booking.\n• Name: ${passengerName}\n• PNR: ${pnr || 'Not specified'}\n• Category: ${category}\n• Problem Details: ${problemDescription || 'Need booking support'}\n\nPlease connect with me immediately.`
    );
    return `https://wa.me/918269054018?text=${text}`;
  };

  return (
    <div className="helpdesk-floating-hub">
      {/* Launcher Button */}
      <button
        id="helpdesk-launcher-btn"
        className={`helpdesk-launcher-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="24/7 Help Desk"
        title="24/7 Help Desk & Problem Resolution"
      >
        <div className="helpdesk-icon-wrap">
          <Headphones className="w-5 h-5" />
          <span className="helpdesk-pulse-dot" />
        </div>
        <span className="helpdesk-btn-text">24/7 Help Desk</span>
      </button>

      {/* Main Support Modal / Drawer */}
      {isOpen && (
        <div className="helpdesk-modal-backdrop" onClick={() => setIsOpen(false)}>
          <div
            className="helpdesk-modal-window animate-scale-up shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="helpdesk-header">
              <div className="flex items-center gap-3">
                <div className="helpdesk-header-icon-box">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="helpdesk-header-title">EazeTrip Concierge Help Desk</h3>
                  <p className="helpdesk-header-sub">
                    Direct Problem Reporting, 1-Click WhatsApp Chat, Direct Email & 5-Min Callback
                  </p>
                </div>
              </div>

              <button
                className="helpdesk-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close Help Desk"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="helpdesk-tabs-bar">
              {[
                { id: 'report', label: '🚨 Report Problem', icon: AlertTriangle },
                { id: 'whatsapp', label: '💬 Direct WhatsApp', icon: MessageSquare },
                { id: 'mail', label: '✉️ Direct Mail Us', icon: Mail },
                { id: 'callback', label: '📞 5-Min Callback', icon: Phone },
                { id: 'tickets', label: '📋 Track My Tickets', icon: FileText }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`helpdesk-nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setCreatedTicket(null);
                      setCbSuccess(false);
                      setMailSent(false);
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body */}
            <div className="helpdesk-body-content custom-scrollbar">
              {/* TAB 1: REPORT A PROBLEM / TICKET SUBMISSION */}
              {activeTab === 'report' && (
                <div className="helpdesk-tab-pane">
                  {createdTicket ? (
                    <div className="ticket-success-card animate-fade-in">
                      <div className="ticket-success-header">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                        <h4 className="text-lg font-bold text-slate-900">Problem Reported Successfully!</h4>
                        <p className="text-xs text-slate-500">
                          Your ticket has been logged and escalated with <strong>{createdTicket.urgency}</strong> priority.
                        </p>
                      </div>

                      <div className="ticket-summary-box">
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
                            <span className="summary-label">Linked PNR:</span>
                            <span className="summary-val font-mono font-bold text-slate-800">{createdTicket.pnr}</span>
                          </div>
                        )}
                        <div className="ticket-summary-row">
                          <span className="summary-label">Assigned Specialist:</span>
                          <span className="summary-val text-emerald-700 font-semibold">{createdTicket.assignedTo}</span>
                        </div>
                        <div className="ticket-summary-row">
                          <span className="summary-label">Estimated Response:</span>
                          <span className="summary-val text-amber-600 font-bold">Under 15 Minutes</span>
                        </div>
                      </div>

                      <div className="ticket-auto-notice">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Automated confirmation sent to your WhatsApp ({passengerPhone}) and Email ({passengerEmail}).</span>
                      </div>

                      <div className="flex gap-2 justify-center mt-4">
                        <button
                          type="button"
                          className="secondary-btn small"
                          onClick={() => setCreatedTicket(null)}
                        >
                          Report Another Issue
                        </button>
                        <button
                          type="button"
                          className="primary-btn small"
                          onClick={() => {
                            setActiveTab('tickets');
                            fetchMyTickets();
                          }}
                        >
                          Track Ticket Conversation →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitProblem} className="helpdesk-form">
                      <div className="helpdesk-info-banner">
                        <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span>
                          Facing a booking, payment, reschedule, or baggage issue? Submit below for immediate concierge investigation.
                        </span>
                      </div>

                      {/* Category & Urgency */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="form-group mb-0">
                          <label className="text-xs font-semibold text-slate-700">Problem Category *</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="native-select text-xs py-2"
                            required
                          >
                            <option value="Flight / Train / Bus Booking Issue">✈️ Flight / Train / Bus Booking Issue</option>
                            <option value="Payment, Billing & Refund Inquiry">💳 Payment & Refund Inquiry</option>
                            <option value="Date Change / Reschedule Assistance">📅 Date Change / Reschedule</option>
                            <option value="Flight Cancellation & Fare Refund">❌ Cancellation & Refund</option>
                            <option value="Baggage & Airport Terminal Assistance">🧳 Baggage & Terminal Assistance</option>
                            <option value="Hotel Room & Special Requests">🏨 Hotel Room Special Request</option>
                            <option value="Urgent Emergency at Airport">🚨 Urgent Airport Emergency</option>
                          </select>
                        </div>

                        <div className="form-group mb-0">
                          <label className="text-xs font-semibold text-slate-700">Urgency Level *</label>
                          <select
                            value={urgency}
                            onChange={(e) => setUrgency(e.target.value)}
                            className="native-select text-xs py-2"
                          >
                            <option value="Normal">Normal (Response in 30 mins)</option>
                            <option value="High">High Priority (Response in 15 mins)</option>
                            <option value="Emergency">🚨 Urgent / Emergency (Immediate)</option>
                          </select>
                        </div>
                      </div>

                      {/* PNR Input */}
                      <div className="form-group mb-3">
                        <div className="flex-between-center mb-1">
                          <label className="text-xs font-semibold text-slate-700">PNR / Booking ID (Optional)</label>
                          {bookings?.length > 0 && (
                            <button
                              type="button"
                              className="text-[11px] text-blue-600 font-semibold hover:underline"
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
                          className="text-xs font-mono uppercase"
                        />
                      </div>

                      {/* Problem Details */}
                      <div className="form-group mb-3">
                        <label className="text-xs font-semibold text-slate-700">
                          Describe the Problem in Detail *
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Please explain what happened (e.g. payment deducted but ticket not generated, need date change, baggage excess, etc.)..."
                          value={problemDescription}
                          onChange={(e) => setProblemDescription(e.target.value)}
                          className="text-xs leading-relaxed"
                          required
                        />
                      </div>

                      {/* Contact Prefills */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="form-group mb-0">
                          <label className="text-[11px] font-semibold text-slate-600">Your Name</label>
                          <input
                            type="text"
                            value={passengerName}
                            onChange={(e) => setPassengerName(e.target.value)}
                            className="text-xs"
                            required
                          />
                        </div>
                        <div className="form-group mb-0">
                          <label className="text-[11px] font-semibold text-slate-600">Email Address</label>
                          <input
                            type="email"
                            value={passengerEmail}
                            onChange={(e) => setPassengerEmail(e.target.value)}
                            className="text-xs"
                            required
                          />
                        </div>
                        <div className="form-group mb-0">
                          <label className="text-[11px] font-semibold text-slate-600">WhatsApp / Phone</label>
                          <input
                            type="tel"
                            value={passengerPhone}
                            onChange={(e) => setPassengerPhone(e.target.value)}
                            className="text-xs font-mono"
                            required
                          />
                        </div>
                      </div>

                      {/* Submit CTA */}
                      <button
                        type="submit"
                        className="primary-btn w-full py-2.5 flex items-center justify-center gap-2"
                        disabled={submitting}
                      >
                        <Send className="w-4 h-4" />
                        <span>{submitting ? 'Submitting Problem Ticket...' : 'Submit Problem Ticket to Concierge'}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: DIRECT WHATSAPP CONNECT */}
              {activeTab === 'whatsapp' && (
                <div className="helpdesk-tab-pane animate-fade-in">
                  <div className="whatsapp-connect-card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                        <MessageSquare className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">Direct WhatsApp Support Chat</h4>
                        <p className="text-xs text-slate-500 mb-0">
                          Connect 1-on-1 with our verified concierge team at <strong>+91 82690 54018</strong>
                        </p>
                      </div>
                    </div>

                    <div className="whatsapp-template-box mb-4">
                      <span className="text-xs font-semibold text-emerald-800 mb-1 block">
                        Pre-Configured Chat Message Template:
                      </span>
                      <div className="p-3 bg-white border border-emerald-200 rounded-lg text-xs text-slate-800 font-mono leading-relaxed">
                        Hello EazeTrip Support Team,<br/><br/>
                        I need urgent assistance with my travel booking.<br/>
                        • <strong>Name:</strong> {passengerName}<br/>
                        • <strong>PNR:</strong> {pnr || 'FL2775'}<br/>
                        • <strong>Issue:</strong> {problemDescription || 'Assistance with web check-in and seat assignment'}<br/><br/>
                        Please connect with me on WhatsApp.
                      </div>
                    </div>

                    <a
                      href={getWhatsAppPrefillUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whatsapp-launch-btn"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Launch Official WhatsApp Chat</span>
                      <ExternalLink className="w-4 h-4 ml-auto" />
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 3: DIRECT MAIL US */}
              {activeTab === 'mail' && (
                <div className="helpdesk-tab-pane animate-fade-in">
                  {mailSent ? (
                    <div className="ticket-success-card">
                      <CheckCircle2 className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                      <h4 className="text-lg font-bold text-slate-900">Email Dispatched Directly!</h4>
                      <p className="text-xs text-slate-600 mb-3">
                        Your inquiry has been sent to <strong>support@eazetrip.com</strong>. A senior concierge agent will reply directly to <strong>{passengerEmail}</strong> within 30 minutes.
                      </p>
                      <button
                        type="button"
                        className="secondary-btn small"
                        onClick={() => setMailSent(false)}
                      >
                        Send Another Mail
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSendDirectMail} className="helpdesk-form">
                      <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 mb-3">
                        <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span>Direct Inbox: <strong>support@eazetrip.com</strong> (Official 24/7 Desk)</span>
                      </div>

                      <div className="form-group mb-3">
                        <label className="text-xs font-semibold text-slate-700">Subject *</label>
                        <input
                          type="text"
                          placeholder="e.g. Urgent Date Change Request for PNR FL2775"
                          value={mailSubject}
                          onChange={(e) => setMailSubject(e.target.value)}
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label className="text-xs font-semibold text-slate-700">Message Content *</label>
                        <textarea
                          rows={4}
                          placeholder="Type your message, questions, or requirements here..."
                          value={mailBody}
                          onChange={(e) => setMailBody(e.target.value)}
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="primary-btn flex-1 py-2 text-xs flex items-center justify-center gap-1.5"
                          disabled={submitting}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{submitting ? 'Sending...' : 'Send Direct In-App Email'}</span>
                        </button>
                        <a
                          href={`mailto:support@eazetrip.com?subject=${encodeURIComponent(mailSubject || 'Support Inquiry')}&body=${encodeURIComponent(mailBody || 'Need assistance with booking')}`}
                          className="secondary-btn py-2 text-xs flex items-center gap-1"
                        >
                          <span>Open in Mail App</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 4: 5-MIN INSTANT CALLBACK */}
              {activeTab === 'callback' && (
                <div className="helpdesk-tab-pane animate-fade-in">
                  {cbSuccess ? (
                    <div className="ticket-success-card">
                      <Phone className="w-12 h-12 text-emerald-500 mx-auto mb-2 animate-bounce" />
                      <h4 className="text-lg font-bold text-slate-900">Priority Call-Back Scheduled!</h4>
                      <p className="text-xs text-slate-600 mb-2">
                        Our Senior Travel Specialist is dialing <strong>{cbPhone}</strong>.
                      </p>
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold mb-3">
                        ⏳ Estimated Call Time: Within 5 Minutes
                      </div>
                      <button
                        type="button"
                        className="secondary-btn small"
                        onClick={() => setCbSuccess(false)}
                      >
                        Request Another Call
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRequestCallback} className="helpdesk-form">
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900 mb-3 flex items-start gap-2">
                        <Clock className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>5-Minute Priority Call-Back Guarantee:</strong>
                          <p className="mb-0 text-[11px] text-purple-700">Enter your phone number below and our specialist will call you directly.</p>
                        </div>
                      </div>

                      <div className="form-group mb-3">
                        <label className="text-xs font-semibold text-slate-700">Phone Number to Call *</label>
                        <input
                          type="tel"
                          value={cbPhone}
                          onChange={(e) => setCbPhone(e.target.value)}
                          className="text-xs font-mono"
                          required
                        />
                      </div>

                      <div className="form-group mb-4">
                        <label className="text-xs font-semibold text-slate-700">Reason / Topic of Call</label>
                        <select
                          value={cbTopic}
                          onChange={(e) => setCbTopic(e.target.value)}
                          className="native-select text-xs"
                        >
                          <option value="Urgent Airport Assistance">🚨 Urgent Airport Assistance</option>
                          <option value="Flight Date Change & Fare Difference">✈️ Flight Date Change & Fare Difference</option>
                          <option value="Hotel Booking & Check-in Issue">🏨 Hotel Check-in Assistance</option>
                          <option value="Refund & Cancellation Status">💳 Refund Status Inquiry</option>
                          <option value="Custom Holiday Tour Planning">🌴 Custom Holiday Tour Planning</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="primary-btn w-full py-2.5 flex items-center justify-center gap-2"
                        disabled={submitting}
                      >
                        <Phone className="w-4 h-4" />
                        <span>{submitting ? 'Queuing Call Request...' : 'Call Me in 5 Minutes'}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 5: TRACK MY TICKETS */}
              {activeTab === 'tickets' && (
                <div className="helpdesk-tab-pane animate-fade-in">
                  {loadingTickets ? (
                    <div className="py-8 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      <p className="text-xs">Loading your support tickets...</p>
                    </div>
                  ) : myTickets.length === 0 ? (
                    <div className="py-8 text-center text-slate-500">
                      <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-sm">No Support Tickets Filed</p>
                      <p className="text-xs text-slate-400">You haven't filed any problem tickets yet.</p>
                      <button
                        type="button"
                        className="primary-btn small mt-2"
                        onClick={() => setActiveTab('report')}
                      >
                        Report a Problem Now
                      </button>
                    </div>
                  ) : (
                    <div className="tickets-split-view">
                      {/* Ticket Sidebar List */}
                      <div className="tickets-list-col">
                        {myTickets.map((t) => (
                          <div
                            key={t.id}
                            className={`ticket-item-card ${selectedTicket?.id === t.id ? 'active' : ''}`}
                            onClick={() => setSelectedTicket(t)}
                          >
                            <div className="flex-between-center mb-1">
                              <span className="font-mono text-xs font-bold text-blue-700">#{t.id}</span>
                              <span className={`ticket-status-pill ${t.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                {t.status}
                              </span>
                            </div>
                            <h5 className="ticket-subject-text">{t.subject}</h5>
                            <span className="text-[10px] text-slate-400">
                              {t.category} • PNR: {t.pnr || 'N/A'}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Selected Ticket Conversation Thread */}
                      {selectedTicket && (
                        <div className="ticket-thread-col">
                          <div className="ticket-thread-header">
                            <div>
                              <span className="font-mono font-bold text-blue-700 text-xs">#{selectedTicket.id}</span>
                              <h4 className="font-semibold text-sm text-slate-900 mb-0">{selectedTicket.subject}</h4>
                              <span className="text-[11px] text-slate-500">
                                Assigned to: <strong>{selectedTicket.assignedTo}</strong>
                              </span>
                            </div>
                            <span className={`ticket-status-pill ${selectedTicket.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {selectedTicket.status}
                            </span>
                          </div>

                          {/* Chat Thread Messages */}
                          <div className="ticket-messages-feed custom-scrollbar">
                            {selectedTicket.messages?.map((msg, idx) => (
                              <div
                                key={msg.id || idx}
                                className={`ticket-msg-bubble ${msg.role === 'user' ? 'user-msg' : 'support-msg'}`}
                              >
                                <div className="ticket-msg-meta">
                                  <strong>{msg.sender}</strong>
                                  <span className="text-[10px] text-slate-400">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="ticket-msg-body">{msg.text}</p>
                              </div>
                            ))}
                          </div>

                          {/* Reply Box */}
                          <form onSubmit={handleSendTicketReply} className="ticket-reply-form">
                            <input
                              type="text"
                              placeholder="Type a follow-up message to the concierge specialist..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="text-xs"
                            />
                            <button type="submit" className="ticket-reply-btn">
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Bar */}
            <div className="helpdesk-footer">
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>24x7 Direct Helpline: <a href="tel:+918269054018" className="font-bold text-slate-800">+91 82690 54018</a></span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span><a href="mailto:support@eazetrip.com" className="font-bold text-slate-800">support@eazetrip.com</a></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
