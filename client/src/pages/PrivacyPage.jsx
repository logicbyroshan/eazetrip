import { Link } from 'react-router-dom';
import { Lock, ShieldCheck, Eye, Database } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="container page-wrap">
      <div className="page-shell narrow">
        <div className="page-topbar">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Privacy Policy</span>
        </div>

        <div className="content-card legal-card">
          <h1>Privacy Policy</h1>
          <p className="effective-date">Last Updated: January 1, 2026</p>

          <section className="legal-section">
            <h2>1. Information We Collect</h2>
            <p>
              When you use ExploreEase to search or book flights, hotels, buses, or train tickets, we collect information necessary to fulfill your bookings and enhance your travel experience.
            </p>
            <ul>
              <li><strong>Personal Identifiers:</strong> Name, gender, date of birth, nationality, email address, phone number, and passport details (for international flights).</li>
              <li><strong>Payment Data:</strong> Encrypted transaction identifiers, billing address, and payment method tokens (we do not store raw card CVV or banking PINs).</li>
              <li><strong>Booking History:</strong> Selected itineraries, seat preferences, meal selections, and GST details.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>2. How We Use Your Data</h2>
            <p>We process your personal information strictly for the following purposes:</p>
            <ul>
              <li>Issuing confirmed flight tickets, hotel reservations, bus berths, and railway PNRs with suppliers.</li>
              <li>Sending transactional SMS, WhatsApp updates, and email confirmation vouchers.</li>
              <li>Customer service assistance, schedule alerts, and automated cancellation/refund processing.</li>
              <li>Fraud prevention and compliance with applicable aviation and travel security regulations.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Third-Party Data Sharing</h2>
            <p>
              Your traveler information is shared only with verified service providers directly involved in your booking (e.g., IndiGo, Air India, hotel operators, IRCTC, payment gateways). We never sell your personal contact information to unaffiliated third-party marketing brokers.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Data Security & Encryption</h2>
            <p>
              We implement industry-standard 256-bit SSL encryption, tokenized payment protocols, and restricted role-based database access to safeguard your data against unauthorized access, loss, or alteration.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Your Rights & Data Access</h2>
            <p>
              You can access, update, or request the deletion of your personal account data at any time by visiting <Link to="/profile" className="accent-link">My Profile</Link> or contacting our privacy officer at <a href="mailto:priyansh@exploreeaz.com" className="accent-link">priyansh@exploreeaz.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
