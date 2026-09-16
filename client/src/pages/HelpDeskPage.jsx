import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Headphones,
  AlertTriangle,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  FileText,
  CheckCircle2,
  Send,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Plane,
  Building2,
  Briefcase,
  ChevronRight,
  RefreshCw,
  MapPin,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { api } from '../services/api';
import Breadcrumb from '../components/common/Breadcrumb';

export default function HelpDeskPage() {
  const { user, isAuthenticated, firstName } = useAuth();
  const { bookings, showToast } = useBooking();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab') || 'report';
  const [activeTab, setActiveTab] = useState(tabParam);

  // Sync tab with URL
  const switchTab = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    setCreatedTicket(null);
    setCbSuccess(false);
    setMailSent(false);
  };

  // Problem Form state
  const [category, setCategory] = useState('Flight / Train / Bus Booking Issue');
  const [pnr, setPnr] = useState(bookings?.[0]?.pnr || '');
  const [urgency, setUrgency] = useState('High');
  const [problemDescription, setProblemDescription] = useState('');
  const [passengerName, setPassengerName] = useState(user?.name || 'Priyansh Sharma');
  const [passengerEmail, setPassengerEmail] = useState(user?.email || 'priyansh.sharma@gmail.com');
  const [passengerPhone, setPassengerPhone] = useState(user?.phone || '+91 98765 43210');
  const [submitting, setSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);

  // 5-Min Callback state
  const [cbPhone, setCbPhone] = useState(user?.phone || '+91 98765 43210');
  const [cbTopic, setCbTopic] = useState('Urgent Airport Check-in');
  const [cbSuccess, setCbSuccess] = useState(false);

  // Direct In-App Mail state
  const [mailSubject, setMailSubject] = useState('');
  const [mailBody, setMailBody] = useState('');
  const [mailSent, setMailSent] = useState(false);

  // Track My Tickets state
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

  // Fetch tickets when tab is 'tickets'
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
    if (activeTab === 'tickets') {
      fetchMyTickets();
    }
  }, [activeTab]);

  // Handle Problem Ticket Submit
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
        subject: `${category} - ${pnr ? `PNR: ${pnr}` : 'Travel Issue'}`,
        description: problemDescription,
        name: passengerName,
        email: passengerEmail,
        phone: passengerPhone,
        urgency
      });

      if (res.ok && res.data?.data) {
        setCreatedTicket(res.data.data);
        setProblemDescription('');
        showToast(`Support Ticket #${res.data.data.id} filed successfully! Senior Concierge notified.`);
      }
    } catch (err) {
      showToast('Error filing problem ticket.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Callback Request
  const handleRequestCallback = async (e) => {
    e.preventDefault();
    if (!cbPhone) {
      showToast('Please enter your phone number.', 'error');
      return;
    }

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
        showToast('Priority callback requested! Concierge will call you within 5 minutes.');
      }
    } catch (err) {
      showToast('Error scheduling callback.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Direct Mail Submit
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
        showToast('Direct email dispatched to support@eazetrip.com!');
      }
    } catch (err) {
      showToast('Error sending email.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Ticket Reply
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
        showToast('Reply sent to concierge specialist!');
      }
    } catch (err) {
      showToast('Failed to send reply.', 'error');
    }
  };

  const getWhatsAppPrefillUrl = () => {
    const text = encodeURIComponent(
      `Hello EazeTrip Support Team,\n\nI need urgent assistance with my travel booking.\n• Name: ${passengerName}\n• PNR: ${pnr || 'Not specified'}\n• Category: ${category}\n• Problem Details: ${problemDescription || 'Need immediate concierge support'}\n\nPlease connect with me immediately.`
    );
    return `https://wa.me/918269054018?text=${text}`;
  };

  return (
    <div className="container page-wrap">
      <div className="page-shell">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: '24/7 Dedicated Help Desk & Concierge' }]} />

        {/* Hero Section */}
        <div className="helpdesk-hero-banner">
          <div className="helpdesk-hero-content">
            <div className="helpdesk-hero-tag">
              <Sparkles size={14} />
              <span>24/7 DEDICATED PRIORITY TRAVEL CONCIERGE</span>
            </div>
            <h1 className="helpdesk-hero-title">
              {firstName ? `Hi ${firstName}, How Can We Assist You Today?` : 'EazeTrip 24/7 Concierge & Help Desk'}
            </h1>
            <p className="helpdesk-hero-subtitle">
              Instant problem resolution, high-priority ticket escalation, 1-click WhatsApp concierge chat, direct email dispatch, guaranteed 5-minute callbacks, and real-time live ticket tracking.
            </p>

            {/* SLA Stat Badges */}
            <div className="helpdesk-sla-grid">
              <div className="helpdesk-sla-badge">
                <Clock size={16} className="text-amber-500" />
                <div>
                  <strong>&lt; 15 Mins</strong>
                  <span>Fast Response SLA</span>
                </div>
              </div>
              <div className="helpdesk-sla-badge">
                <Phone size={16} className="text-blue-500" />
                <div>
                  <strong>+91 82690 54018</strong>
                  <span>24/7 Direct Helpline</span>
                </div>
              </div>
              <div className="helpdesk-sla-badge">
                <MessageSquare size={16} className="text-emerald-500" />
                <div>
                  <strong>WhatsApp Chat</strong>
                  <span>Instant 1-on-1 Support</span>
                </div>
              </div>
              <div className="helpdesk-sla-badge">
                <ShieldCheck size={16} className="text-purple-500" />
                <div>
                  <strong>100% Guaranteed</strong>
                  <span>Resolution Commitment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main 2-Column HelpDesk Layout */}
        <div className="helpdesk-page-grid mt-6">
          {/* Left Main Interactive Hub */}
          <div className="helpdesk-main-col">
            <div className="content-card helpdesk-hub-card">
              {/* Navigation Tabs Bar */}
              <div className="helpdesk-hub-tabs-bar">
                {[
                  { id: 'report', label: '🚨 Report Problem / Ticket', icon: AlertTriangle },
                  { id: 'whatsapp', label: '💬 Direct WhatsApp', icon: MessageSquare },
                  { id: 'mail', label: '✉️ Direct Mail Us', icon: Mail },
                  { id: 'callback', label: '📞 5-Min Callback', icon: Phone },
                  { id: 'tickets', label: '📋 Track My Tickets', icon: FileText }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      className={`helpdesk-hub-tab ${isActive ? 'active' : ''}`}
                      onClick={() => switchTab(tab.id)}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB CONTENT AREA */}
              <div className="helpdesk-hub-body">
                {/* TAB 1: REPORT PROBLEM */}
                {activeTab === 'report' && (
                  <div>
                    {createdTicket ? (
                      <div className="contact-success-state text-center py-5">
                        <CheckCircle2 size={52} color="#16a34a" className="mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-slate-900">Problem Ticket Logged Successfully!</h3>
                        <p className="lead text-sm text-slate-600 mb-4">
                          Your issue has been escalated under Ticket ID <strong>#{createdTicket.id}</strong>. A Senior Concierge Specialist is investigating your case.
                        </p>

                        <div className="ticket-summary-box text-left mb-4">
                          <div className="ticket-summary-row">
                            <span className="summary-label">Ticket ID:</span>
                            <span className="summary-val font-mono font-bold text-blue-700">#{createdTicket.id}</span>
                          </div>
                          <div className="ticket-summary-row">
                            <span className="summary-label">Category:</span>
                            <span className="summary-val font-semibold">{createdTicket.category}</span>
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
                            <span className="summary-label">Response Guarantee:</span>
                            <span className="summary-val text-amber-600 font-bold">Within 15 Minutes</span>
                          </div>
                        </div>

                        <div className="ticket-auto-notice mb-4">
                          <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                          <span>Automated confirmation sent to your WhatsApp ({passengerPhone}) and Email ({passengerEmail}).</span>
                        </div>

                        <div className="flex gap-3 justify-center">
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
                            onClick={() => switchTab('tickets')}
                          >
                            Track Live Conversation →
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitProblem} className="stack-form">
                        <div className="helpdesk-info-banner mb-4">
                          <Sparkles size={16} className="text-blue-600 flex-shrink-0" />
                          <span>
                            Submit your problem details below. An assigned Senior Concierge Specialist will investigate and resolve your issue with highest priority.
                          </span>
                        </div>

                        {/* Category & Urgency */}
                        <div className="form-grid two-col mb-3">
                          <div className="form-group mb-0">
                            <label>Problem Category *</label>
                            <select
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className="native-select"
                              required
                            >
                              <option value="Flight / Train / Bus Booking Issue">✈️ Flight / Train / Bus Booking Issue</option>
                              <option value="Holiday Package / Tour Inquiry">🌴 Holiday Package / Tour Customization</option>
                              <option value="Payment, Billing & Refund Inquiry">💳 Payment, Billing & Refund Inquiry</option>
                              <option value="Date Change / Reschedule Assistance">📅 Date Change & Reschedule</option>
                              <option value="Flight Cancellation & Fare Refund">❌ Cancellation & Refund</option>
                              <option value="Baggage & Airport Terminal Assistance">🧳 Baggage & Terminal Assistance</option>
                              <option value="Hotel Room & Special Requests">🏨 Hotel Room Special Request</option>
                              <option value="Urgent Emergency at Airport">🚨 Urgent Airport Emergency</option>
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

                        {/* PNR Field */}
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

                        {/* Description */}
                        <div className="form-group mb-3">
                          <label>Describe the Problem in Detail *</label>
                          <textarea
                            rows={4}
                            placeholder="Please explain what happened (e.g. payment deducted but ticket not generated, need flight date change, web check-in failing, luggage allowance issue)..."
                            value={problemDescription}
                            onChange={(e) => setProblemDescription(e.target.value)}
                            required
                          />
                        </div>

                        {/* 3-Col Contact Fields */}
                        <div className="form-grid three-col mb-4">
                          <div className="form-group mb-0">
                            <label>Full Name *</label>
                            <input
                              type="text"
                              placeholder="Priyansh Sharma"
                              value={passengerName}
                              onChange={(e) => setPassengerName(e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group mb-0">
                            <label>Email Address *</label>
                            <input
                              type="email"
                              placeholder="priyansh.sharma@gmail.com"
                              value={passengerEmail}
                              onChange={(e) => setPassengerEmail(e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group mb-0">
                            <label>WhatsApp / Phone *</label>
                            <input
                              type="tel"
                              placeholder="+91 98765 43210"
                              value={passengerPhone}
                              onChange={(e) => setPassengerPhone(e.target.value)}
                              className="font-mono"
                              required
                            />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          className="primary-btn full py-3 send-inquiry-btn"
                          disabled={submitting}
                        >
                          <Send size={16} />
                          <span>{submitting ? 'ESCALATING TICKET...' : 'SUBMIT PROBLEM TICKET TO CONCIERGE'}</span>
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* TAB 2: INSTANT WHATSAPP CHAT */}
                {activeTab === 'whatsapp' && (
                  <div className="whatsapp-connect-card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                        <MessageSquare size={32} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base mb-1">Direct WhatsApp Support Chat</h4>
                        <p className="text-xs text-slate-600 mb-0">
                          Connect 1-on-1 with our verified concierge team at <strong>+91 82690 54018</strong> for immediate live travel resolution.
                        </p>
                      </div>
                    </div>

                    <div className="whatsapp-template-box mb-4">
                      <span className="text-xs font-semibold text-emerald-800 mb-1 block">
                        Pre-Configured Chat Message Template:
                      </span>
                      <div className="p-3 bg-white border border-emerald-200 rounded-lg text-xs text-slate-800 font-mono leading-relaxed">
                        Hello EazeTrip Support Team,<br /><br />
                        I need urgent assistance with my travel booking.<br />
                        • <strong>Name:</strong> {passengerName}<br />
                        • <strong>PNR:</strong> {pnr || 'FL2775'}<br />
                        • <strong>Issue:</strong> {problemDescription || 'Assistance with web check-in, seat assignment, or date change'}<br /><br />
                        Please connect with me on WhatsApp.
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <a
                        href={getWhatsAppPrefillUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-launch-btn flex-1"
                      >
                        <MessageSquare size={18} />
                        <span>Launch Official WhatsApp Chat</span>
                        <ExternalLink size={16} className="ml-auto" />
                      </a>
                    </div>
                  </div>
                )}

                {/* TAB 3: DIRECT EMAIL DISPATCH */}
                {activeTab === 'mail' && (
                  <div>
                    {mailSent ? (
                      <div className="contact-success-state text-center py-5">
                        <CheckCircle2 size={52} color="#034ea2" className="mx-auto mb-3" />
                        <h4 className="text-xl font-bold text-slate-900">Email Dispatched Directly!</h4>
                        <p className="lead text-sm text-slate-600 mb-4">
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
                      <form onSubmit={handleSendDirectMail} className="stack-form">
                        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 mb-4">
                          <Mail size={16} className="text-blue-600 flex-shrink-0" />
                          <span>Direct Inbox: <strong>support@eazetrip.com</strong> (Monitored 24/7 by Customer Care)</span>
                        </div>

                        <div className="form-group mb-3">
                          <label>Subject *</label>
                          <input
                            type="text"
                            placeholder="e.g. Urgent Date Change Request for PNR FL2775"
                            value={mailSubject}
                            onChange={(e) => setMailSubject(e.target.value)}
                            required
                          />
                        </div>

                        <div className="form-group mb-4">
                          <label>Message Content *</label>
                          <textarea
                            rows={5}
                            placeholder="Type your message, inquiries, or special requirements here..."
                            value={mailBody}
                            onChange={(e) => setMailBody(e.target.value)}
                            required
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="submit"
                            className="primary-btn flex-1 py-3"
                            disabled={submitting}
                          >
                            <Send size={16} />
                            <span>{submitting ? 'Sending...' : 'Send Direct In-App Email'}</span>
                          </button>
                          <a
                            href={`mailto:support@eazetrip.com?subject=${encodeURIComponent(mailSubject || 'Support Inquiry')}&body=${encodeURIComponent(mailBody || 'Need assistance with booking')}`}
                            className="secondary-btn py-3 px-4 flex items-center gap-1.5"
                          >
                            <span>Open in Mail Client</span>
                            <ExternalLink size={15} />
                          </a>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* TAB 4: 5-MINUTE CALLBACK */}
                {activeTab === 'callback' && (
                  <div>
                    {cbSuccess ? (
                      <div className="contact-success-state text-center py-5">
                        <Phone size={52} color="#16a34a" className="mx-auto mb-3 animate-bounce" />
                        <h4 className="text-xl font-bold text-slate-900">Priority Call-Back Scheduled!</h4>
                        <p className="lead text-sm text-slate-600 mb-2">
                          Our Senior Travel Specialist is dialing <strong>{cbPhone}</strong>.
                        </p>
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold mb-4 inline-block">
                          ⏳ Estimated Call Time: Within 5 Minutes
                        </div>
                        <div>
                          <button
                            type="button"
                            className="secondary-btn small"
                            onClick={() => setCbSuccess(false)}
                          >
                            Request Another Call
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleRequestCallback} className="stack-form">
                        <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900 mb-4 flex items-start gap-2.5">
                          <Clock size={18} className="text-purple-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="block text-sm mb-0.5">5-Minute Priority Call-Back Guarantee:</strong>
                            <p className="mb-0 text-xs text-purple-700">Enter your phone number below and our specialist will call you directly to handle your booking.</p>
                          </div>
                        </div>

                        <div className="form-group mb-3">
                          <label>Phone Number to Call *</label>
                          <input
                            type="tel"
                            value={cbPhone}
                            onChange={(e) => setCbPhone(e.target.value)}
                            className="font-mono"
                            placeholder="+91 98765 43210"
                            required
                          />
                        </div>

                        <div className="form-group mb-4">
                          <label>Reason / Topic of Call</label>
                          <select
                            value={cbTopic}
                            onChange={(e) => setCbTopic(e.target.value)}
                            className="native-select"
                          >
                            <option value="Urgent Airport Check-in">🚨 Urgent Airport Assistance</option>
                            <option value="Flight Date Change & Fare Difference">✈️ Flight Date Change & Fare Difference</option>
                            <option value="Hotel Booking & Check-in Issue">🏨 Hotel Check-in Assistance</option>
                            <option value="Refund & Cancellation Status">💳 Refund Status Inquiry</option>
                            <option value="Custom Holiday Tour Planning">🌴 Custom Holiday Tour Planning</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="primary-btn full py-3 send-inquiry-btn"
                          disabled={submitting}
                        >
                          <Phone size={16} />
                          <span>{submitting ? 'Queuing Call Request...' : 'Call Me in 5 Minutes'}</span>
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* TAB 5: TRACK MY TICKETS */}
                {activeTab === 'tickets' && (
                  <div>
                    {loadingTickets ? (
                      <div className="py-12 text-center text-slate-400">
                        <RefreshCw size={28} className="animate-spin mx-auto mb-2 text-blue-600" />
                        <p className="text-sm">Loading your support tickets...</p>
                      </div>
                    ) : myTickets.length === 0 ? (
                      <div className="py-12 text-center text-slate-500">
                        <FileText size={48} className="text-slate-300 mx-auto mb-3" />
                        <h4 className="font-bold text-base text-slate-700 mb-1">No Support Tickets Filed Yet</h4>
                        <p className="text-xs text-slate-400 mb-4">When you file a problem ticket, you can track real-time agent updates and reply directly here.</p>
                        <button
                          type="button"
                          className="primary-btn small"
                          onClick={() => switchTab('report')}
                        >
                          Report a Problem Now
                        </button>
                      </div>
                    ) : (
                      <div className="tickets-split-view">
                        {/* Sidebar List */}
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
                              <span className="text-[11px] text-slate-500">
                                {t.category} {t.pnr ? `• PNR: ${t.pnr}` : ''}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Conversation Thread */}
                        {selectedTicket && (
                          <div className="ticket-thread-col">
                            <div className="ticket-thread-header">
                              <div>
                                <span className="font-mono font-bold text-blue-700 text-xs">#{selectedTicket.id}</span>
                                <h4 className="font-bold text-sm text-slate-900 mb-0">{selectedTicket.subject}</h4>
                                <span className="text-[11px] text-slate-500">
                                  Assigned to: <strong className="text-emerald-700">{selectedTicket.assignedTo}</strong>
                                </span>
                              </div>
                              <span className={`ticket-status-pill ${selectedTicket.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                {selectedTicket.status}
                              </span>
                            </div>

                            {/* Chat messages */}
                            <div className="ticket-messages-feed custom-scrollbar">
                              {selectedTicket.messages?.map((msg, idx) => (
                                <div
                                  key={msg.id || idx}
                                  className={`ticket-msg-bubble ${msg.role === 'user' ? 'user-msg' : 'support-msg'}`}
                                >
                                  <div className="ticket-msg-meta">
                                    <strong>{msg.sender}</strong>
                                    <span className="text-[10px] opacity-75">
                                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="ticket-msg-body">{msg.text}</p>
                                </div>
                              ))}
                            </div>

                            {/* Reply Input */}
                            <form onSubmit={handleSendTicketReply} className="ticket-reply-form">
                              <input
                                type="text"
                                placeholder="Type a message to your assigned concierge specialist..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                              />
                              <button type="submit" className="ticket-reply-btn" title="Send Reply">
                                <Send size={15} />
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Direct Help & Contact Info Sidebar */}
          <div className="helpdesk-sidebar-col">
            {/* Quick Contact Card */}
            <div className="content-card helpdesk-contact-card mb-4">
              <span className="section-tag">DIRECT ASSISTANCE</span>
              <h3 className="text-base font-bold text-slate-900 mb-3">Concierge Desk Channels</h3>

              <div className="contact-details-stack">
                <div className="contact-box-item">
                  <div className="contact-icon-box">
                    <Phone size={18} color="#034ea2" />
                  </div>
                  <div>
                    <strong>24x7 Customer Helpline</strong>
                    <p><a href="tel:+918269054018" className="accent-link font-bold">+91 8269054018</a></p>
                  </div>
                </div>

                <div className="contact-box-item">
                  <div className="contact-icon-box">
                    <Mail size={18} color="#0097a7" />
                  </div>
                  <div>
                    <strong>Email Support</strong>
                    <p><a href="mailto:support@eazetrip.com" className="accent-link font-bold">support@eazetrip.com</a></p>
                  </div>
                </div>

                <div className="contact-box-item">
                  <div className="contact-icon-box">
                    <MapPin size={18} color="#e11d48" />
                  </div>
                  <div>
                    <strong>Corporate Headquarters</strong>
                    <p>Saubhagya Bindiya Tower, MP, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Self-Serve FAQs & Guides */}
            <div className="content-card helpdesk-guides-card">
              <span className="section-tag">SELF-SERVE TOOLS</span>
              <h3 className="text-base font-bold text-slate-900 mb-3">Common Travel Tasks</h3>

              <div className="helpdesk-quick-links-list">
                <Link to="/manage-bookings" className="helpdesk-quick-link-item">
                  <FileText size={16} className="text-blue-600" />
                  <div>
                    <strong>View & Print E-Tickets</strong>
                    <p>Download PDF invoice & ticket copies</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 ml-auto" />
                </Link>

                <Link to="/cancellation-refund" className="helpdesk-quick-link-item">
                  <AlertTriangle size={16} className="text-amber-600" />
                  <div>
                    <strong>Cancel & Calculate Refund</strong>
                    <p>Instant penalty breakdown & timeline</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 ml-auto" />
                </Link>

                <Link to="/faq" className="helpdesk-quick-link-item">
                  <HelpCircle size={16} className="text-emerald-600" />
                  <div>
                    <strong>Frequently Asked Questions</strong>
                    <p>Baggage rules, refunds, check-in guides</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 ml-auto" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Bottom Frequently Handled Resolution Cards */}
        <div className="helpdesk-features-grid mt-6">
          <div className="helpdesk-feature-card">
            <div className="helpdesk-feature-icon-box bg-blue-50 text-blue-700">
              <Plane size={22} />
            </div>
            <h4>Flight Reschedule & Date Change</h4>
            <p>Direct assistance with airline fare differences, date adjustments, and seat assignments.</p>
          </div>

          <div className="helpdesk-feature-card">
            <div className="helpdesk-feature-icon-box bg-emerald-50 text-emerald-700">
              <ShieldCheck size={22} />
            </div>
            <h4>Zero Shield Refund Protection</h4>
            <p>Track fast-track refunds directly to your UPI ID, bank account, or instant EazeWallet with 10% bonus.</p>
          </div>

          <div className="helpdesk-feature-card">
            <div className="helpdesk-feature-icon-box bg-purple-50 text-purple-700">
              <Building2 size={22} />
            </div>
            <h4>Hotel Check-in & Special Requests</h4>
            <p>Direct coordination with property managers for early check-in, honeymoon setup, and invoice copies.</p>
          </div>

          <div className="helpdesk-feature-card">
            <div className="helpdesk-feature-icon-box bg-amber-50 text-amber-700">
              <Briefcase size={22} />
            </div>
            <h4>Baggage & Airport Emergency</h4>
            <p>Immediate concierge escalation for lost baggage, terminal gate changes, or web check-in failures.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
