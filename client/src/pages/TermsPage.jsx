import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export default function TermsPage({ title = 'Terms & Conditions' }) {
  return (
    <div className="container page-wrap">
      <div className="page-shell narrow">
        <div className="page-topbar">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{title}</span>
        </div>

        <div className="content-card legal-card">
          <h1>{title}</h1>
          <p className="effective-date">Last Updated: January 1, 2026</p>

          <section className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or using ExploreEase (ExploreEaz) platform, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. User Eligibility & Account Registration</h2>
            <p>
              You must be at least 18 years of age to make bookings or enter into legally binding contracts. When registering an account or making bookings as a guest, you agree to provide accurate, current, and complete details regarding all travelers.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Travel Service Bookings & Third-Party Suppliers</h2>
            <p>
              ExploreEase acts as a booking facilitator between users and third-party travel service providers (including airlines, hotels, bus operators, and Indian Railways). The carriage, lodging, and journey terms are governed by the respective provider's terms of service and fare rules.
            </p>
            <ul>
              <li><strong>Airlines:</strong> Baggage limits, flight delays, schedule changes, and cancellations are subject to airline conditions.</li>
              <li><strong>Hotels:</strong> Standard check-in and check-out policies apply. Additional occupancy or amenities may incur charges payable directly to the property.</li>
              <li><strong>Buses & Trains:</strong> Seat numbers, coach allocations, and running schedules are maintained by the respective transport authorities.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Payments & Invoicing</h2>
            <p>
              All prices displayed are in Indian Rupees (INR) unless otherwise selected. Prices include applicable government taxes and airport charges. Payment must be made in full using valid online payment instruments prior to ticket issuance.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Limitation of Liability</h2>
            <p>
              ExploreEase shall not be liable for any indirect, incidental, or consequential damages resulting from flight delays, weather disruptions, supplier insolvency, or unforeseen technical issues beyond reasonable control.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Contact & Legal Jurisdiction</h2>
            <p>
              For legal inquiries, contact: <a href="mailto:priyansh@exploreeaz.com" className="accent-link">priyansh@exploreeaz.com</a>.<br />
              All disputes are subject to the exclusive jurisdiction of the competent courts in Madhya Pradesh, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
