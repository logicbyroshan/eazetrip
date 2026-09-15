import { Link } from 'react-router-dom';
import { RotateCcw, ShieldCheck, Clock, HelpCircle } from 'lucide-react';

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
          <h1>Cancellation, Refund & Rescheduling Policy</h1>
          <p className="effective-date">Last Updated: January 1, 2026</p>

          <section className="legal-section">
            <h2>1. How to Cancel Your Booking</h2>
            <p>You can cancel bookings easily through two channels:</p>
            <div className="cancellation-steps-grid">
              <div className="step-card">
                <strong>Method 1: Self-Service Online</strong>
                <p>
                  Visit <Link to="/manage-bookings" className="accent-link">Manage Bookings</Link>, select your booking ID, and click <strong>Cancel Booking</strong>. The refund amount will be calculated automatically based on the airline/hotel cancellation tier.
                </p>
              </div>
              <div className="step-card">
                <strong>Method 2: Support Desk Helpline</strong>
                <p>
                  Call our 24/7 customer service at <a href="tel:+918269054018" className="accent-link">+91 8269054018</a> or email <a href="mailto:support@eazetrip.com" className="accent-link">support@eazetrip.com</a> with your Booking Reference ID.
                </p>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>2. Service-Specific Cancellation Rules</h2>
            <div className="rules-table-box">
              <div className="rules-row header">
                <span>Travel Service</span>
                <span>Cancellation Policy Overview</span>
                <span>Typical Refund Window</span>
              </div>
              <div className="rules-row">
                <strong>Domestic Flights</strong>
                <span>Governed by airline penalty rules (e.g. ₹2,500 - ₹3,500 per passenger). Non-refundable within 2 hours of departure.</span>
                <span>5 to 7 Working Days</span>
              </div>
              <div className="rules-row">
                <strong>Hotels & Stays</strong>
                <span>Free cancellation available on selected rates up to 24-48 hours before check-in. Non-refundable bookings do not qualify for refund.</span>
                <span>3 to 5 Working Days</span>
              </div>
              <div className="rules-row">
                <strong>Buses</strong>
                <span>Cancellations allowed up to 4-6 hours prior to bus departure per operator policy. 50-80% refund depending on notice time.</span>
                <span>3 to 5 Working Days</span>
              </div>
              <div className="rules-row">
                <strong>Railway (IRCTC)</strong>
                <span>Standard IRCTC cancellation rules and clerkage charges apply. Tatkal tickets are non-refundable once confirmed.</span>
                <span>3 to 7 Working Days</span>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>3. Refund Processing & Disbursement Timelines</h2>
            <p>
              Once a cancellation is confirmed, refunds are automatically credited back to the original mode of payment:
            </p>
            <ul>
              <li><strong>UPI (GPay / PhonePe / Paytm):</strong> Credited within 24 to 48 hours of confirmation.</li>
              <li><strong>Net Banking & Debit Cards:</strong> Credited within 3 to 5 business banking days.</li>
              <li><strong>Credit Cards:</strong> Reflected in your monthly credit card statement within 5 to 7 business days.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Need Assistance?</h2>
            <p>
              For urgent cancellation or partial passenger cancellation queries, please contact our 24/7 dedicated support team at <a href="tel:+918269054018" className="accent-link">+91 8269054018</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
