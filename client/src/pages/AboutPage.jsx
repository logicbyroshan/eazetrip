import React from 'react';
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
  MapPin,
  CheckCircle2,
  Zap,
  Leaf,
  Briefcase,
  Compass,
  ArrowRight,
  Lock,
  Headphones,
  Train,
  Bus,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

import Breadcrumb from '../components/common/Breadcrumb';

export default function AboutPage() {
  return (
    <div className="container page-wrap">
      <div className="page-shell">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'About EazeTrip' }]} />

        {/* Hero Showcase Section */}
        <div className="about-hero-showcase">
          <div className="about-hero-content">
            <div className="about-hero-tag">
              <Sparkles size={14} />
              <span>100% TRANSPARENT TRAVEL TECHNOLOGY</span>
            </div>
            <h1 className="about-hero-title">
              Redefining How India Travels: Honest Fares, Instant Refunds & 24/7 Dedicated Care
            </h1>
            <p className="about-hero-subtitle">
              Founded in 2022, EazeTrip was built with a single uncompromising mission: eliminate hidden airline checkout fees, surge traps, and agonizing refund wait times. Today, we empower over 1.2 Million travelers across flights, hotels, trains, buses, and curated holiday packages.
            </p>

            <div className="about-hero-actions">
              <Link to="/flight-booking" className="about-action-btn primary">
                <Plane size={16} />
                <span>Explore Flights & Holidays</span>
              </Link>
              <Link to="/helpdesk" className="about-action-btn secondary">
                <Headphones size={16} />
                <span>24/7 Concierge Help Desk</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 6 Performance Stat Metrics */}
        <div className="about-stats-grid mt-6">
          <div className="stat-card-luxury">
            <div className="stat-icon-wrap bg-blue-50 text-blue-700">
              <Users size={24} />
            </div>
            <strong className="stat-num">1.2M+</strong>
            <span className="stat-label">Happy Travelers</span>
            <small className="stat-subtext">Across 28 States & 40+ Global Destinations</small>
          </div>

          <div className="stat-card-luxury">
            <div className="stat-icon-wrap bg-emerald-50 text-emerald-700">
              <Plane size={24} />
            </div>
            <strong className="stat-num">450+</strong>
            <span className="stat-label">Airline & Bus Partners</span>
            <small className="stat-subtext">IndiGo, Air India, Akasa, SpiceJet, Zingbus</small>
          </div>

          <div className="stat-card-luxury">
            <div className="stat-icon-wrap bg-purple-50 text-purple-700">
              <Building2 size={24} />
            </div>
            <strong className="stat-num">15,000+</strong>
            <span className="stat-label">Verified Hotels & Stays</span>
            <small className="stat-subtext">Direct Concierge Check-in Guarantee</small>
          </div>

          <div className="stat-card-luxury">
            <div className="stat-icon-wrap bg-amber-50 text-amber-700">
              <Clock size={24} />
            </div>
            <strong className="stat-num">99.8%</strong>
            <span className="stat-label">On-Time Ticketing SLA</span>
            <small className="stat-subtext">Sub-second PNR & WhatsApp dispatch</small>
          </div>

          <div className="stat-card-luxury">
            <div className="stat-icon-wrap bg-sky-50 text-sky-700">
              <Zap size={24} />
            </div>
            <strong className="stat-num">&lt; 15 Mins</strong>
            <span className="stat-label">Concierge Response SLA</span>
            <small className="stat-subtext">24/7 Live Dedicated Travel Specialists</small>
          </div>

          <div className="stat-card-luxury">
            <div className="stat-icon-wrap bg-rose-50 text-rose-700">
              <Award size={24} />
            </div>
            <strong className="stat-num">4.9 / 5.0</strong>
            <span className="stat-label">Customer Trust Score</span>
            <small className="stat-subtext">Over 85,000+ Verified User Reviews</small>
          </div>
        </div>

        {/* The EazeTrip Story & Mission Section */}
        <div className="content-card about-story-card mt-6">
          <div className="about-story-grid">
            <div className="about-story-text-col">
              <span className="section-tag">OUR ORIGIN STORY</span>
              <h2>Why We Built EazeTrip</h2>
              <p className="lead">
                Booking travel in India had become an exercise in frustration: opaque pricing with unexpected "convenience fees" added on the last screen, zero customer accountability when flights are rescheduled, and refund cycles taking up to 45 days.
              </p>
              <p>
                We envisioned a different way — a travel platform built on radical transparency, direct GDS infrastructure, and automated FinTech instant refund pipelines. At EazeTrip, what you see is what you pay. No hidden surcharges, no surprise service fees, and instant resolution from real human travel specialists round-the-clock.
              </p>

              <div className="about-story-highlights">
                <div className="highlight-item">
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                  <div>
                    <strong>Direct Airline & IRCTC Integration</strong>
                    <p>Live inventory sync with zero middleman markup.</p>
                  </div>
                </div>
                <div className="highlight-item">
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                  <div>
                    <strong>Zero Shield™ Instant UPI Refunds</strong>
                    <p>Cancellations reversed directly to your bank account in minutes.</p>
                  </div>
                </div>
                <div className="highlight-item">
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                  <div>
                    <strong>Multi-Modal Unified Booking Cart</strong>
                    <p>Combine flight, hotel, and intercity train tickets in one checkout.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Milestone Timeline */}
            <div className="about-timeline-col">
              <div className="timeline-header">
                <h3>Our Growth Journey</h3>
                <span className="text-xs text-slate-500">From Seed to 1.2M+ Happy Travelers</span>
              </div>

              <div className="about-timeline-list">
                <div className="timeline-node">
                  <div className="timeline-bullet active">2022</div>
                  <div className="timeline-body">
                    <strong>EazeTrip Genesis</strong>
                    <p>Launched in MP, India with direct domestic flight ticketing and transparent pricing.</p>
                  </div>
                </div>

                <div className="timeline-node">
                  <div className="timeline-bullet active">2023</div>
                  <div className="timeline-body">
                    <strong>Multi-Modal Expansion</strong>
                    <p>Integrated IRCTC train schedules, 15,000+ hotels, and intercity AC sleeper buses.</p>
                  </div>
                </div>

                <div className="timeline-node">
                  <div className="timeline-bullet active">2024</div>
                  <div className="timeline-body">
                    <strong>Zero Shield™ Instant Refunds</strong>
                    <p>Introduced India's fastest automated UPI refund engine and 24/7 dedicated concierge.</p>
                  </div>
                </div>

                <div className="timeline-node">
                  <div className="timeline-bullet active">2025</div>
                  <div className="timeline-body">
                    <strong>Global Flight Routes & B2B Desk</strong>
                    <p>Expanded to 40+ international airlines and launched corporate travel portal.</p>
                  </div>
                </div>

                <div className="timeline-node">
                  <div className="timeline-bullet highlight">2026</div>
                  <div className="timeline-body">
                    <strong>1.2 Million Milestone</strong>
                    <p>Empowering millions of seamless journeys with AI price locks and luxury tour packages.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Core Value Pillars */}
        <div className="content-card mt-6">
          <div className="section-title-wrap text-center mb-6">
            <span className="section-tag">FOUNDATIONAL PILLARS</span>
            <h2>What Sets EazeTrip Apart</h2>
            <p className="max-w-2xl mx-auto">
              Our six operational commitments ensure that every flight, hotel stay, bus ride, and train ticket booked through EazeTrip is seamless and worry-free.
            </p>
          </div>

          <div className="about-pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon-box bg-blue-50 text-blue-700">
                <ShieldCheck size={26} />
              </div>
              <h3>Zero Hidden Surcharges</h3>
              <p>
                What you see is exactly what you pay. All taxes, airport user development fees, and cabin baggage allowances are itemized upfront.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box bg-emerald-50 text-emerald-700">
                <Zap size={26} />
              </div>
              <h3>Zero Shield™ Instant UPI Refunds</h3>
              <p>
                Never wait 30 days for airline reversals. Our automated payout pipeline settles refund claims directly into your UPI ID or EazeWallet in under 5 minutes.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box bg-purple-50 text-purple-700">
                <Headphones size={26} />
              </div>
              <h3>24/7 Human-First Concierge</h3>
              <p>
                No endless automated telephone menus. Reach our verified travel specialists instantly via 1-click WhatsApp, direct email, or priority 5-minute callbacks.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box bg-amber-50 text-amber-700">
                <Compass size={26} />
              </div>
              <h3>Direct GDS & IRCTC Inventory</h3>
              <p>
                Real-time API integrations with Amadeus, Sabre, and Indian Railways guarantee live seat availability and zero double-booking discrepancies.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box bg-teal-50 text-teal-700">
                <Leaf size={26} />
              </div>
              <h3>Eco-Conscious Travel Offsets</h3>
              <p>
                Support certified reforestation and clean energy initiatives across India with opt-in micro carbon offsets at checkout.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box bg-sky-50 text-sky-700">
                <Briefcase size={26} />
              </div>
              <h3>Corporate & B2B Travel Desk</h3>
              <p>
                Specialized invoicing, GST compliance, group fare discounts, and customized travel management tools for enterprise and SME clients.
              </p>
            </div>
          </div>
        </div>

        {/* Executive Leadership Team */}
        <div className="content-card mt-6">
          <div className="section-title-wrap text-center mb-6">
            <span className="section-tag">LEADERSHIP & VISION</span>
            <h2>Meet the Visionaries Behind EazeTrip</h2>
            <p className="max-w-2xl mx-auto">
              A passionate team of technologists, airline veterans, and customer advocates transforming modern travel across India.
            </p>
          </div>

          <div className="about-team-grid">
            <div className="team-member-card">
              <div className="team-avatar-box">
                <div className="team-avatar-initials bg-blue-600">PS</div>
              </div>
              <h4>Priyansh Sharma</h4>
              <span className="team-role">Founder & Chief Executive Officer</span>
              <p className="team-bio">
                Ex-FinTech and travel engineering pioneer dedicated to building transparent pricing models and consumer-first refund technology.
              </p>
            </div>

            <div className="team-member-card">
              <div className="team-avatar-box">
                <div className="team-avatar-initials bg-purple-600">AD</div>
              </div>
              <h4>Ananya Deshmukh</h4>
              <span className="team-role">Chief Technology Officer</span>
              <p className="team-bio">
                Distributed systems architect leading real-time GDS flight pricing engines, IRCTC high-throughput pipelines, and AI fare prediction.
              </p>
            </div>

            <div className="team-member-card">
              <div className="team-avatar-box">
                <div className="team-avatar-initials bg-emerald-600">RM</div>
              </div>
              <h4>Rajesh Malhotra</h4>
              <span className="team-role">VP, Airline & Hotel Alliances</span>
              <p className="team-bio">
                Over 18 years of executive hospitality and airline network operations, securing exclusive negotiated inventory for EazeTrip travelers.
              </p>
            </div>

            <div className="team-member-card">
              <div className="team-avatar-box">
                <div className="team-avatar-initials bg-amber-600">SV</div>
              </div>
              <h4>Sneha Varma</h4>
              <span className="team-role">Head of Customer Experience</span>
              <p className="team-bio">
                Champion of our 24/7 dedicated concierge desk, ensuring a strict 15-minute resolution SLA for all airport emergencies and date changes.
              </p>
            </div>
          </div>
        </div>

        {/* National Infrastructure & Regional Hubs */}
        <div className="content-card mt-6">
          <div className="section-title-wrap mb-4">
            <span className="section-tag">NATIONAL PRESENCE</span>
            <h2>Corporate Headquarters & Regional Hubs</h2>
            <p>
              EazeTrip Technologies Private Limited operates nationwide with registered corporate offices and regional travel desks across major metropolitan corridors.
            </p>
          </div>

          <div className="about-offices-grid">
            <div className="office-card hq-featured">
              <div className="office-header">
                <MapPin size={20} className="text-blue-600" />
                <div>
                  <strong>Corporate Headquarters (MP)</strong>
                  <span className="office-tag">Central Tech & Operations</span>
                </div>
              </div>
              <p className="office-address">Saubhagya Bindiya Tower, MP, India</p>
              <div className="office-contact-row">
                <Phone size={14} />
                <a href="tel:+918269054018" className="font-bold text-slate-800">+91 82690 54018</a>
              </div>
            </div>

            <div className="office-card">
              <div className="office-header">
                <Building2 size={20} className="text-slate-600" />
                <div>
                  <strong>Mumbai Regional Hub</strong>
                  <span className="office-tag">Western Operations</span>
                </div>
              </div>
              <p className="office-address">Nariman Point Commercial Tower, Mumbai, Maharashtra 400021</p>
              <div className="office-contact-row">
                <Mail size={14} />
                <span>mumbai.desk@eazetrip.com</span>
              </div>
            </div>

            <div className="office-card">
              <div className="office-header">
                <Building2 size={20} className="text-slate-600" />
                <div>
                  <strong>New Delhi Regional Hub</strong>
                  <span className="office-tag">Northern Airlines Alliance</span>
                </div>
              </div>
              <p className="office-address">Barakhamba Road, Connaught Place, New Delhi 110001</p>
              <div className="office-contact-row">
                <Mail size={14} />
                <span>delhi.desk@eazetrip.com</span>
              </div>
            </div>

            <div className="office-card">
              <div className="office-header">
                <Building2 size={20} className="text-slate-600" />
                <div>
                  <strong>Bengaluru Tech Hub</strong>
                  <span className="office-tag">AI & Distributed Systems</span>
                </div>
              </div>
              <p className="office-address">100ft Road, Indiranagar, Bengaluru, Karnataka 560038</p>
              <div className="office-contact-row">
                <Mail size={14} />
                <span>tech@eazetrip.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Accreditations Strip */}
        <div className="about-security-banner mt-6">
          <div className="security-badges-container">
            <div className="sec-badge-item">
              <ShieldCheck size={22} className="text-emerald-400" />
              <div>
                <strong>IATA Certified</strong>
                <span>Global Airline Network</span>
              </div>
            </div>
            <div className="sec-badge-item">
              <Train size={22} className="text-blue-400" />
              <div>
                <strong>IRCTC Authorized</strong>
                <span>Official Partner Ticketing</span>
              </div>
            </div>
            <div className="sec-badge-item">
              <Lock size={22} className="text-amber-400" />
              <div>
                <strong>256-Bit SSL Vault</strong>
                <span>PCI-DSS Level 1 Encrypted</span>
              </div>
            </div>
            <div className="sec-badge-item">
              <Award size={22} className="text-purple-400" />
              <div>
                <strong>ISO 27001 Certified</strong>
                <span>Data Privacy & Security</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="about-cta-banner mt-6">
          <div className="about-cta-content text-center">
            <Sparkles size={28} className="text-amber-300 mx-auto mb-2" />
            <h2>Ready for a Smarter, Stress-Free Journey?</h2>
            <p className="max-w-xl mx-auto mb-4">
              Join over 1.2 Million travelers who book flights, hotels, trains, and buses with complete transparency and 24/7 dedicated support.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link to="/flight-booking" className="primary-btn px-6 py-3">
                <Plane size={16} />
                <span>Book Your Next Flight</span>
              </Link>
              <Link to="/helpdesk" className="secondary-btn px-6 py-3">
                <Headphones size={16} />
                <span>Contact 24/7 Concierge</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
