import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, CreditCard, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-brand-col">
          <div className="brand-logo-custom white">
            <span className="brand-name-explore">Explore</span>
            <span className="brand-name-eaz">Eaz</span>
            <span className="brand-dot">.</span>
          </div>
          <p className="footer-tagline">
            Your reliable travel companion across India. Simple bookings, transparent fares, and 24/7 dedicated customer assistance.
          </p>
          <div className="footer-contacts">
            <div className="contact-item">
              <MapPin size={16} />
              <span>Saubhagya Bindiya Tower, MP, India</span>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <a href="tel:+918269054018">+91 8269054018</a>
            </div>
            <div className="contact-item">
              <Mail size={16} />
              <a href="mailto:priyansh@exploreeaz.com">priyansh@exploreeaz.com</a>
            </div>
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Our Products</h4>
            <Link to="/flight-booking">Flight Bookings</Link>
            <Link to="/hotel-booking">Hotel Stays</Link>
            <Link to="/bus-booking">Bus Tickets</Link>
            <Link to="/railway">Railway Bookings</Link>
            <Link to="/offers">Latest Travel Offers</Link>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Support</Link>
            <Link to="/manage-bookings">Manage Bookings</Link>
            <Link to="/profile">My Account</Link>
            <Link to="/payment">Make Invoice Payment</Link>
          </div>

          <div className="footer-col">
            <h4>Legal & Policies</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/user-agreement">User Agreement</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/cancellation-refund">Cancellation & Refund</Link>
            <Link to="/faq">Frequently Asked Questions</Link>
          </div>

          <div className="footer-col">
            <h4>Business & Partners</h4>
            <Link to="/partnerLogin">Partner Login</Link>
            <Link to="/partner-registration">Agent Registration</Link>
            <Link to="/corporate-login">Corporate Travel</Link>
            <div className="security-badge-box">
              <div className="badge-row">
                <ShieldCheck size={16} color="#4ade80" />
                <span>100% Secure Checkout</span>
              </div>
              <div className="badge-row">
                <CreditCard size={16} color="#60a5fa" />
                <span>Encrypted Payments</span>
              </div>
              <div className="badge-row">
                <Clock size={16} color="#facc15" />
                <span>24x7 Customer Help</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} ExploreEase (ExploreEaz). All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy</Link>
          <span>•</span>
          <Link to="/terms">Terms</Link>
          <span>•</span>
          <Link to="/cancellation-refund">Refunds</Link>
          <span>•</span>
          <Link to="/faq">FAQs</Link>
        </div>
      </div>
    </footer>
  );
}
