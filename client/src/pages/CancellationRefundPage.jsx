import { Link } from 'react-router-dom';
import { RotateCcw, ShieldCheck, Clock, HelpCircle, Phone, ArrowRight } from 'lucide-react';

export default function CancellationRefundPage() {
  return (
    <div className="container page-wrap">
      <div className="page-shell narrow">
        <div className="page-topbar">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Cancellation & Refund Policy</span>
        </div>

        <div className="content-card legal-card">
          <div className="legal-header-block mb-3">
            <span className="section-tag">CUSTOMER PROTECTION & REFUNDS</span>
            <h1>Cancellation, Refund & Rescheduling Policy</h1>
            <p className="effective-date">Last Updated: January 1, 2026 • Governed by DGCA & IRCTC Standards</p>
          </div>

          <section className="legal-section">
            <h2>1. How to Cancel Your Booking</h2>
            <p>You can cancel bookings easily through two transparent channels:</p>
            <div className="cancellation-steps-grid mt-3">
              <div className="step-card-elevated">
                <div className="step-num-badge">1</div>
                <div>
                  <strong>Self-Service Online Portal</strong>
                  <p>
                    Visit <Link to="/manage-bookings" className="accent-link">Manage Bookings</Link>, select your booking ID, and click <strong>Cancel Booking</strong>. The refund amount will be calculated automatically based on the operator's cancellation slab.
                  </p>
                </div>
              </div>
              <div className="step-card-elevated">
                <div className="step-num-badge">2</div>
                <div>
                  <strong>24/7 Support Desk Helpline</strong>
                  <p>
                    Call our round-the-clock resolution team at <a href="tel:+918269054018" className="accent-link">+91 8269054018</a> or email <a href="mailto:support@eazetrip.com" className="accent-link">support@eazetrip.com</a> with your Booking ID.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="legal-section mt-4">
            <h2>2. Service-Specific Cancellation Rules</h2>
            <div className="rules-table-box">
              <div className="rules-row header">
                <span>Travel Service</span>
                <span>Cancellation Policy Overview</span>
                <span>Refund Window</span>
              </div>
              <div className="rules-row">
                <strong>Domestic Flights</strong>
                <span>Governed by airline penalty rules (e.g. ₹2,500 - ₹3,500 per passenger). Non-refundable within 2 hours of departure.</span>
                <span className="window-pill">5 to 7 Working Days</span>
              </div>
              <div className="rules-row">
                <strong>Hotels & Stays</strong>
                <span>Free cancellation available on selected rates up to 24-48 hours before check-in. Non-refundable bookings do not qualify for refund.</span>
                <span className="window-pill">3 to 5 Working Days</span>
              </div>
              <div className="rules-row">
                <strong>Buses</strong>
                <span>Cancellations allowed up to 4-6 hours prior to bus departure per operator policy. 50-80% refund depending on notice time.</span>
                <span className="window-pill">3 to 5 Working Days</span>
              </div>
              <div className="rules-row">
                <strong>Railway (IRCTC)</strong>
                <span>Standard IRCTC cancellation rules and clerkage charges apply. Tatkal tickets are non-refundable once confirmed.</span>
                <span className="window-pill">3 to 7 Working Days</span>
              </div>
            </div>
          </section>

          <section className="legal-section mt-4">
            <h2>3. Refund Processing & Disbursement Timelines</h2>
            <p>
              Once a cancellation is confirmed, refunds are automatically credited back to your original mode of payment:
            </p>
            <div className="refund-channels-list mt-3">
              <div className="refund-channel-item">
                <div className="channel-dot upi"></div>
                <div>
                  <strong>UPI (GPay / PhonePe / Paytm / BHIM)</strong>
                  <p>Direct bank credit within <strong>24 to 48 hours</strong> of cancellation approval.</p>
                </div>
              </div>
              <div className="refund-channel-item">
                <div className="channel-dot netbanking"></div>
                <div>
                  <strong>Net Banking & Debit Cards</strong>
                  <p>Credited back to your savings/current account within <strong>3 to 5 business banking days</strong>.</p>
                </div>
              </div>
              <div className="refund-channel-item">
                <div className="channel-dot card"></div>
                <div>
                  <strong>Credit Cards (Visa / Mastercard / RuPay / Amex)</strong>
                  <p>Reflected in your monthly credit card statement within <strong>5 to 7 business days</strong>.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="legal-section mt-4">
            <h2>4. Need Emergency Cancellation Assistance?</h2>
            <p>
              For urgent cancellation or partial passenger drop queries, our customer desk is ready to help:
            </p>
            <div className="legal-cta-row mt-3">
              <a href="tel:+918269054018" className="primary-btn">
                <Phone size={16} /> Call +91 8269054018
              </a>
              <Link to="/manage-bookings" className="secondary-btn">
                Go to Manage Bookings
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
