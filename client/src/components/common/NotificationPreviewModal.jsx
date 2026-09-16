import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Mail,
  Copy,
  Check,
  Send,
  Sparkles,
  Smartphone,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function NotificationPreviewModal() {
  const { previewModal, closePreview, triggerCampaign } = useNotification();
  const [copied, setCopied] = useState(false);
  const [dispatchedToast, setDispatchedToast] = useState(false);

  if (!previewModal.isOpen) return null;

  const { channel, type, renderedContent } = previewModal;

  const handleCopy = () => {
    if (renderedContent) {
      navigator.clipboard.writeText(renderedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSimulateSend = async () => {
    try {
      await triggerCampaign(type || 'reengagement_inactivity', {
        channels: [channel],
        monthsInactive: 3,
        promoCode: 'HOLIDAY25'
      });
      setDispatchedToast(true);
      setTimeout(() => {
        setDispatchedToast(false);
        closePreview();
      }, 2000);
    } catch (e) {
      console.warn('Simulation trigger error:', e);
    }
  };

  return (
    <div className="notif-modal-backdrop" onClick={closePreview}>
      <div
        className="notif-modal-container animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="notif-modal-header">
          <div className="flex items-center gap-2">
            {channel === 'whatsapp' ? (
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <MessageSquare className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <Mail className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="notif-modal-title">
                {channel === 'whatsapp' ? 'Official WhatsApp Notification Preview' : 'Luxury HTML Email Notification Preview'}
              </h3>
              <p className="notif-modal-subtitle">
                {type === 'reengagement_inactivity'
                  ? 'Personalized Re-engagement Campaign (Inactivity Offer)'
                  : 'Booking Confirmation & Itinerary E-Ticket Delivery'}
              </p>
            </div>
          </div>
          <button className="notif-modal-close-btn" onClick={closePreview}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="notif-modal-body">
          {channel === 'whatsapp' ? (
            /* AUTHENTIC WHATSAPP SIMULATOR */
            <div className="whatsapp-preview-wrapper">
              <div className="whatsapp-phone-shell">
                {/* WhatsApp Chat Top Bar */}
                <div className="whatsapp-chat-header">
                  <div className="flex items-center gap-3">
                    <div className="whatsapp-avatar">
                      <span>EZ</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-white text-sm">EazeTrip Support</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                      </div>
                      <span className="text-[11px] text-emerald-100 opacity-90">Official Business Account</span>
                    </div>
                  </div>
                  <Smartphone className="w-4 h-4 text-emerald-100 opacity-75" />
                </div>

                {/* Chat Background & Message */}
                <div className="whatsapp-chat-canvas">
                  <div className="whatsapp-date-pill">TODAY</div>

                  {/* WhatsApp Message Bubble */}
                  <div className="whatsapp-bubble animate-slide-up">
                    <div className="whatsapp-bubble-content whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-slate-800">
                      {renderedContent}
                    </div>
                    <div className="whatsapp-bubble-meta">
                      <span>1:30 PM</span>
                      <span className="whatsapp-double-tick">✓✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* AUTHENTIC HTML EMAIL SIMULATOR */
            <div className="email-preview-wrapper">
              <div className="email-client-header">
                <div className="email-meta-row">
                  <span className="email-meta-label">From:</span>
                  <span className="email-meta-val">EazeTrip Concierge &lt;notifications@eazetrip.com&gt;</span>
                </div>
                <div className="email-meta-row">
                  <span className="email-meta-label">To:</span>
                  <span className="email-meta-val">priyansh.sharma@gmail.com</span>
                </div>
                <div className="email-meta-row">
                  <span className="email-meta-label">Subject:</span>
                  <span className="email-meta-val font-semibold text-slate-800">
                    {type === 'reengagement_inactivity'
                      ? '🌴 We Miss Having You Onboard! Exclusive 25% Off Next Getaway'
                      : '🎟️ Booking Confirmed: Your EazeTrip E-Ticket Itinerary (PNR: FL2775)'}
                  </span>
                </div>
              </div>

              <div className="email-html-viewport">
                <iframe
                  title="HTML Email Preview"
                  srcDoc={renderedContent}
                  className="email-iframe-frame"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="notif-modal-footer">
          <div className="flex items-center gap-2">
            <button className="notif-btn-secondary" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Raw Message'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="notif-btn-secondary" onClick={closePreview}>
              Close
            </button>
            <button
              className="notif-btn-primary"
              onClick={handleSimulateSend}
              disabled={dispatchedToast}
            >
              <Send className="w-4 h-4" />
              <span>{dispatchedToast ? 'Dispatched to Queue!' : `Simulate ${channel === 'whatsapp' ? 'WhatsApp' : 'Email'} Send`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
