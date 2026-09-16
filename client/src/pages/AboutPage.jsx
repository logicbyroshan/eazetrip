import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  HeartHandshake,
  Award,
  Clock,
  Users,
  Globe2,
  Plane,
  Building2,
  Sparkles,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container page-wrap">
      <div className="page-shell narrow">
        <div className="page-topbar">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>About EazeTrip</span>
        </div>

        {/* Hero Mission Card */}
        <div className="about-hero-card content-card">
          <div className="hero-tag-wrap mb-2">
            <span className="section-tag">OUR MISSION & VISION</span>
          </div>
          <h1>Empowering Hassle-Free Travel Across India</h1>
          <p className="lead">
            EazeTrip was founded with a clear mission: to simplify travel planning, deliver honest transparent pricing with zero hidden fees, and provide 24/7 dedicated customer assistance for millions of journeys across flights, hotels, trains, and buses.
          </p>

          <div className="about-stats-grid mt-4">
            <div className="stat-card-luxury">
              <div className="stat-icon-wrap">
                <Users size={22} />
              </div>
              <strong className="stat-num">1.2M+</strong>
              <span className="stat-label">Happy Travelers</span>
            </div>
            <div className="stat-card-luxury">
              <div className="stat-icon-wrap">
                <Plane size={22} />
              </div>
              <strong className="stat-num">450+</strong>
              <span className="stat-label">Airline & Bus Partners</span>
            </div>
            <div className="stat-card-luxury">
              <div className="stat-icon-wrap">
                <Building2 size={22} />
              </div>
              <strong className="stat-num">15,000+</strong>
              <span className="stat-label">Verified Hotel Stays</span>
            </div>
            <div className="stat-card-luxury">
              <div className="stat-icon-wrap">
                <Clock size={22} />
              </div>
              <strong className="stat-num">24 / 7</strong>
              <span className="stat-label">Priority Live Support</span>
            </div>
          </div>
        </div>

        {/* Core Values 4-Grid */}
        <div className="content-card mt-4">
          <div className="section-title-wrap mb-4">
            <h2>What Makes EazeTrip Different</h2>
            <p>Our foundational pillars built to provide you with peace of mind every step of your trip.</p>
          </div>

          <div className="about-values-grid">
            <div className="value-box">
              <div className="value-icon-circle blue">
                <ShieldCheck size={24} />
              </div>
              <h3>Zero Hidden Fees</h3>
              <p>
                What you see is what you pay. Transparent fare breakdowns with airport development taxes and baggage rules upfront.
              </p>
            </div>

            <div className="value-box">
              <div className="value-icon-circle teal">
                <HeartHandshake size={24} />
              </div>
              <h3>Customer First Guarantee</h3>
              <p>
                Our 24/7 resolution desk assists you with date changes, seat selections, web check-in, and instant refund tracking.
              </p>
            </div>

            <div className="value-box">
              <div className="value-icon-circle amber">
                <Award size={24} />
              </div>
              <h3>Smart Comparison Engine</h3>
              <p>
                Live GDS and airline APIs compare IndiGo, Air India, Akasa, SpiceJet, and Emirates in real-time for lowest airfares.
              </p>
            </div>

            <div className="value-box">
              <div className="value-icon-circle purple">
                <Clock size={24} />
              </div>
              <h3>Instant E-Tickets & Vouchers</h3>
              <p>
                Immediate SMS and Email ticket delivery with QR code vouchers, PNR updates, and downloadable PDFs directly in your account.
              </p>
            </div>
          </div>
        </div>

        {/* Registered Office & Headquarters */}
        <div className="content-card mt-4">
          <h2>Registered Corporate Headquarters</h2>
          <p className="mb-3">
            EazeTrip Technologies Private Limited is a registered online travel agency (OTA) providing authorized flight, hotel, bus, and IRCTC train ticketing services.
          </p>

          <div className="headquarters-details-grid">
            <div className="hq-detail-node">
              <MapPin size={18} color="#034ea2" />
              <div>
                <strong>Office Address</strong>
                <p>Saubhagya Bindiya Tower, MP, India</p>
              </div>
            </div>

            <div className="hq-detail-node">
              <Phone size={18} color="#16a34a" />
              <div>
                <strong>Customer Helpline</strong>
                <p><a href="tel:+918269054018" className="accent-link">+91 8269054018</a> (24x7 Toll-Free)</p>
              </div>
            </div>

            <div className="hq-detail-node">
              <Mail size={18} color="#0097a7" />
              <div>
                <strong>Official Email</strong>
                <p><a href="mailto:support@eazetrip.com" className="accent-link">support@eazetrip.com</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
