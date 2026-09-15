import { Star, ShieldCheck, CheckCircle, ThumbsUp, Quote, Heart } from 'lucide-react';
import { siteTestimonials } from '../../data/siteData';

export default function ReviewsSection() {
  const reviews = [
    {
      id: 1,
      name: 'Aarav Sharma',
      city: 'Mumbai, Maharashtra',
      service: 'Flights & Luxury Hotels',
      tag: 'Family Vacation to Goa',
      rating: 5,
      avatarBg: 'linear-gradient(135deg, #034ea2 0%, #0097a7 100%)',
      avatarText: 'AS',
      date: 'September 2026',
      verified: 'Verified Flight & Stay',
      quote: 'Booking flights and hotels through EazeTrip was effortless. Got instant confirmation and the best airfare deal for our Goa trip! The instant ticket voucher download was a lifesaver.'
    },
    {
      id: 2,
      name: 'Sneha Patil',
      city: 'Pune, Maharashtra',
      service: 'Intercity Volvo Bus',
      tag: 'Solo Travel to Hyderabad',
      rating: 5,
      avatarBg: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
      avatarText: 'SP',
      date: 'August 2026',
      verified: 'Verified Bus Booking',
      quote: 'The sleeper bus booking experience was super smooth. Clean seat layout selection, accurate live GPS tracking, and no hidden convenience fees at checkout.'
    },
    {
      id: 3,
      name: 'Vikram Mehta',
      city: 'New Delhi',
      service: 'IRCTC Vande Bharat Express',
      tag: 'Business Trip to Varanasi',
      rating: 5,
      avatarBg: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
      avatarText: 'VM',
      date: 'September 2026',
      verified: 'Verified Train Booking',
      quote: 'The fastest IRCTC train booking portal I have used. Instant seat quota selection and real-time PNR status alerts directly on WhatsApp. Outstanding platform!'
    }
  ];

  return (
    <section className="section-block reviews-experience-block">
      <div className="container">
        {/* Header */}
        <div className="reviews-header-center">
          <div className="reviews-trust-pill">
            <ShieldCheck size={15} />
            <span>VERIFIED TRAVEL EXPERIENCES</span>
          </div>
          <h2 className="reviews-title">Loved by over 1.2M+ Travelers</h2>
          <p className="reviews-subtitle">
            Real experiences from travelers across India and abroad who trust EazeTrip for seamless bookings
          </p>
        </div>

        {/* 3 Elevated Review Cards Grid */}
        <div className="reviews-cards-grid">
          {reviews.map((rev) => (
            <div key={rev.id} className="review-card-elevated">
              {/* Card Top: Stars & Verified Badge */}
              <div className="review-card-top-row">
                <div className="review-stars-row">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <div className="review-verified-badge">
                  <CheckCircle size={13} color="#16a34a" />
                  <span>{rev.verified}</span>
                </div>
              </div>

              {/* Quote text */}
              <p className="review-body-text">“{rev.quote}”</p>

              {/* Traveler Metadata & Avatar */}
              <div className="review-author-footer">
                <div className="review-avatar-circle" style={{ background: rev.avatarBg }}>
                  <span>{rev.avatarText}</span>
                </div>
                <div className="review-author-info">
                  <h4 className="author-full-name">{rev.name}</h4>
                  <p className="author-location-service">{rev.city} • <span className="highlight-service">{rev.service}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Strip */}
        <div className="trust-metrics-strip">
          <div className="metric-item">
            <strong className="metric-number">4.9 / 5</strong>
            <span className="metric-label">Average User Rating</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <strong className="metric-number">1.2M+</strong>
            <span className="metric-label">Happy Travelers</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <strong className="metric-number">99.4%</strong>
            <span className="metric-label">Instant Confirmation</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <strong className="metric-number">24/7</strong>
            <span className="metric-label">Dedicated Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
