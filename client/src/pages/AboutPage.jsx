import { Link } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, Award, Clock, Users, Globe2, Plane, Building2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container page-wrap">
      <div className="page-shell narrow">
        <div className="page-topbar">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>About Us</span>
        </div>

        <div className="about-hero-card content-card">
          <span className="section-tag">OUR MISSION</span>
          <h1>Empowering Hassle-Free Travel Across India</h1>
          <p className="lead">
            ExploreEase (ExploreEaz) was founded with a single mission: to simplify travel planning and bring high transparency, lower fares, and round-the-clock peace of mind to millions of Indian travelers.
          </p>

          <div className="stats-counter-strip">
            <div className="stat-node">
              <strong>500K+</strong>
              <small>Happy Travelers</small>
            </div>
            <div className="stat-node">
              <strong>150+</strong>
              <small>Airline & Bus Partners</small>
            </div>
            <div className="stat-node">
              <strong>10,000+</strong>
              <small>Verified Properties</small>
            </div>
            <div className="stat-node">
              <strong>24 / 7</strong>
              <small>Live Support Desk</small>
            </div>
          </div>
        </div>

        <div className="content-card mt-4">
          <h2>What Makes Us Different</h2>
          <div className="about-values-grid">
            <div className="value-box">
              <div className="value-icon">
                <ShieldCheck size={24} />
              </div>
              <h3>Zero Hidden Fees</h3>
              <p>
                What you see is what you pay. Transparent fare breakdowns with airport development fees and taxes highlighted up front.
              </p>
            </div>

            <div className="value-box">
              <div className="value-icon">
                <HeartHandshake size={24} />
              </div>
              <h3>Customer First Guarantee</h3>
              <p>
                Our 24/7 customer resolution desk helps you manage date changes, seat selections, web check-ins, and instant refund tracking.
              </p>
            </div>

            <div className="value-box">
              <div className="value-icon">
                <Award size={24} />
              </div>
              <h3>Smart Comparison Engine</h3>
              <p>
                Live GDS and direct airline integrations allow you to compare IndiGo, Air India, Akasa, and SpiceJet airfares in real-time.
              </p>
            </div>

            <div className="value-box">
              <div className="value-icon">
                <Clock size={24} />
              </div>
              <h3>Instant E-Tickets & Receipts</h3>
              <p>
                Instant SMS and Email ticket delivery with QR code vouchers, PNR updates, and downloadable PDFs directly in your account.
              </p>
            </div>
          </div>
        </div>

        <div className="content-card mt-4">
          <h2>Registered Office & Headquarters</h2>
          <p>
            <strong>ExploreEase Technologies</strong><br />
            Saubhagya Bindiya Tower, MP, India<br />
            Helpline: <a href="tel:+918269054018" className="accent-link">+91 8269054018</a><br />
            Email: <a href="mailto:priyansh@exploreeaz.com" className="accent-link">priyansh@exploreeaz.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
