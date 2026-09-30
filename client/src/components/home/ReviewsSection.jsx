import { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  CheckCircle, 
  Plane, 
  Building2, 
  Train, 
  Bus, 
  Palmtree, 
  Sparkles,
  Quote
} from 'lucide-react';

export default function ReviewsSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  // Row 1 Reviews (8 distinct verified travelers - moves Left)
  const row1Reviews = [
    {
      id: 101,
      name: 'Aarav Sharma',
      city: 'Mumbai, Maharashtra',
      category: 'flight',
      categoryLabel: 'Flight',
      categoryIcon: Plane,
      tag: 'BOM ✈ DEL • IndiGo 6E-2041',
      rating: 5,
      avatarBg: 'linear-gradient(135deg, #034ea2 0%, #0097a7 100%)',
      avatarText: 'AS',
      date: 'Yesterday',
      verified: 'Verified Booking',
      quote: 'Booking was completely effortless. Instant PNR confirmation on WhatsApp and saved ₹1,400 with the FLYEAZE code! Best airfare engine.'
    },
    {
      id: 102,
      name: 'Pooja Roy',
      city: 'Kolkata, West Bengal',
      category: 'hotel',
      categoryLabel: 'Luxury Stay',
      categoryIcon: Building2,
      tag: 'Taj Fort Aguada, Goa',
      rating: 5,
      avatarBg: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)',
      avatarText: 'PR',
      date: '2 days ago',
      verified: 'Verified Hotel Stay',
      quote: 'Free room upgrade and late checkout included as promised. Check-in was instant with the mobile voucher QR. Will book again!'
    },
    {
      id: 103,
      name: 'Sneha Patil',
      city: 'Pune, Maharashtra',
      category: 'bus',
      categoryLabel: 'Intercity Bus',
      categoryIcon: Bus,
      tag: 'Pune ➜ Bengaluru • SRS Volvo Sleeper',
      rating: 5,
      avatarBg: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
      avatarText: 'SP',
      date: '3 days ago',
      verified: 'Verified Bus Ride',
      quote: 'The sleeper seat selection was 100% accurate. Live bus tracking link texted to my family gave great peace of mind during overnight travel.'
    },
    {
      id: 104,
      name: 'Vikram Mehta',
      city: 'New Delhi',
      category: 'train',
      categoryLabel: 'IRCTC Train',
      categoryIcon: Train,
      tag: 'NDLS ⇄ BSB • Vande Bharat Express',
      rating: 5,
      avatarBg: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
      avatarText: 'VM',
      date: '4 days ago',
      verified: 'Verified Train Booking',
      quote: 'Direct IRCTC partner integration means zero login lag at tatkal rush hours. PNR confirmation came in under 5 seconds on WhatsApp!'
    },
    {
      id: 105,
      name: 'Meera Nambiar',
      city: 'Kochi, Kerala',
      category: 'holiday',
      categoryLabel: 'Tour Package',
      categoryIcon: Palmtree,
      tag: 'Munnar & Alleppey Houseboat 5D/4N',
      rating: 5,
      avatarBg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      avatarText: 'MN',
      date: '5 days ago',
      verified: 'Verified Holiday',
      quote: 'Curated itinerary was magical. The private chauffeur, spice plantation tour, and luxury houseboat stay exceeded all our expectations.'
    },
    {
      id: 106,
      name: 'Rohan Deshmukh',
      city: 'Hyderabad, Telangana',
      category: 'flight',
      categoryLabel: 'International Flight',
      categoryIcon: Plane,
      tag: 'HYD ✈ DXB • Emirates Skywards',
      rating: 5,
      avatarBg: 'linear-gradient(135deg, #dc2626 0%, #f97316 100%)',
      avatarText: 'RD',
      date: '6 days ago',
      verified: 'Verified Flight Booking',
      quote: 'Smooth international booking with transparent currency exchange. Zero hidden fees at checkout and instant baggage specs breakdown.'
    },
    {
      id: 107,
      name: 'Ananya Birla',
      city: 'Bengaluru, Karnataka',
      category: 'hotel',
      categoryLabel: '5-Star Resort',
      categoryIcon: Building2,
      tag: 'The Oberoi Amarvilas, Agra',
      rating: 5,
      avatarBg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      avatarText: 'AB',
      date: '1 week ago',
      verified: 'Verified Hotel Stay',
      quote: 'Unmatched pricing compared to other portals. Customer concierge personally verified our anniversary room request with hotel GM.'
    },
    {
      id: 108,
      name: 'Karan Singhal',
      city: 'Jaipur, Rajasthan',
      category: 'bus',
      categoryLabel: 'Electric Intercity',
      categoryIcon: Bus,
      tag: 'Jaipur ➜ Delhi • Zingbus Electric AC',
      rating: 5,
      avatarBg: 'linear-gradient(135deg, #0891b2 0%, #0284c7 100%)',
      avatarText: 'KS',
      date: '1 week ago',
      verified: 'Verified Bus Ride',
      quote: 'Punctual departure, premium waiting lounge access, and plush charging seats. EazeTrip bus pass saved me 25% on weekly commutes.'
    }
  ];

  // Row 2 Reviews (8 distinct verified travelers - moves Right)
  const row2Reviews = [
    {
      id: 201,
      name: 'Rajesh Kulkarni',
      city: 'Ahmedabad, Gujarat',
      category: 'train',
      categoryLabel: 'IRCTC Tejas Express',
      categoryIcon: Train,
      tag: 'ADI ⇄ MMCT • Tejas Express',
      rating: 5,
      avatarBg: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
      avatarText: 'RK',
      date: 'Yesterday',
      verified: 'Verified Train Booking',
      quote: 'Instant auto-refund credited to my EazeWallet in under 2 minutes when I rescheduled my train departure. Truly exceptional service!'
    },
    {
      id: 202,
      name: 'Divya Menon',
      city: 'Chennai, Tamil Nadu',
      category: 'holiday',
      categoryLabel: 'Holiday Tour',
      categoryIcon: Palmtree,
      tag: 'Kashmir Valley & Gulmarg Gondola 6D/5N',
      rating: 5,
      avatarBg: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
      avatarText: 'DM',
      date: '2 days ago',
      verified: 'Verified Tour Package',
      quote: 'Snow valleys, warm shikara rides, and 24/7 on-ground tour coordinator. Best family vacation we have taken in years.'
    },
    {
      id: 203,
      name: 'Aditya Kapoor',
      city: 'Chandigarh',
      category: 'flight',
      categoryLabel: 'Domestic Flight',
      categoryIcon: Plane,
      tag: 'IXC ✈ GOI • Air India Express',
      rating: 5,
      avatarBg: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
      avatarText: 'AK',
      date: '3 days ago',
      verified: 'Verified Flight Booking',
      quote: 'Zero convenience fee promo saved us ₹1,200 on 4 family tickets. Web check-in reminders and boarding gate updates were super fast.'
    },
    {
      id: 204,
      name: 'Tanvi Joshi',
      city: 'Vadodara, Gujarat',
      category: 'hotel',
      categoryLabel: 'Heritage Palace',
      categoryIcon: Building2,
      tag: 'Heritage Palace Resort, Udaipur',
      rating: 5,
      avatarBg: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)',
      avatarText: 'TJ',
      date: '4 days ago',
      verified: 'Verified Heritage Stay',
      quote: 'Spectacular Lake Pichola views and complimentary royal dinner included. Booking voucher was scanned effortlessly at front desk.'
    },
    {
      id: 205,
      name: 'Harpreet Singh',
      city: 'Amritsar, Punjab',
      category: 'train',
      categoryLabel: 'IRCTC Shatabdi',
      categoryIcon: Train,
      tag: 'ASR ⇄ NDLS • Shatabdi Express',
      rating: 5,
      avatarBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      avatarText: 'HS',
      date: '5 days ago',
      verified: 'Verified IRCTC Ticket',
      quote: 'The easiest tatkal seat selection tool ever made. Live seat availability status matched IRCTC counter exactly.'
    },
    {
      id: 206,
      name: 'Priya Sundaram',
      city: 'Coimbatore, Tamil Nadu',
      category: 'bus',
      categoryLabel: 'SmartBus Sleeper',
      categoryIcon: Bus,
      tag: 'Coimbatore ➜ Chennai • Intrcity AC',
      rating: 5,
      avatarBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      avatarText: 'PS',
      date: '6 days ago',
      verified: 'Verified Bus Ride',
      quote: 'Clean sanitized sleeper cabin, air quality monitor, and reliable onboard attendant. 5 stars for safety and punctuality.'
    },
    {
      id: 207,
      name: 'Zaid Al-Mansoor',
      city: 'Dubai / Mumbai',
      category: 'flight',
      categoryLabel: 'Club Prime Flight',
      categoryIcon: Plane,
      tag: 'DXB ✈ BOM • Vistara Prime',
      rating: 5,
      avatarBg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      avatarText: 'ZM',
      date: '1 week ago',
      verified: 'Verified Flight Booking',
      quote: 'Switched currency to AED in one click, paid with international card seamlessly, and received airline NDC e-ticket instantly.'
    },
    {
      id: 208,
      name: 'Shweta Agarwal',
      city: 'Lucknow, Uttar Pradesh',
      category: 'holiday',
      categoryLabel: 'Royal Tour',
      categoryIcon: Palmtree,
      tag: 'Rajasthan Forts & Palaces 7D/6N',
      rating: 5,
      avatarBg: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
      avatarText: 'SA',
      date: '1 week ago',
      verified: 'Verified Holiday',
      quote: 'Flawlessly organized. The desert camp night in Jaisalmer was unforgettable. EazeTrip is now our permanent travel partner.'
    }
  ];

  // Helper renderer for a single review card
  const renderCard = (rev, keyPrefix) => {
    const IconComponent = rev.categoryIcon || Plane;
    return (
      <div key={`${keyPrefix}-${rev.id}`} className="review-card-elevated marquee-card">
        {/* Card Top: Stars & Verified Badge */}
        <div className="review-card-top-row">
          <div className="review-stars-row">
            {Array.from({ length: rev.rating }).map((_, i) => (
              <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
            ))}
            <span className="review-rating-number">5.0</span>
          </div>
          <div className="review-category-pill" data-category={rev.category}>
            <IconComponent size={12} />
            <span>{rev.categoryLabel}</span>
          </div>
        </div>

        {/* Route / Property Tag Chip */}
        <div className="review-route-chip">
          <span className="route-chip-dot" />
          <span className="route-chip-text">{rev.tag}</span>
        </div>

        {/* Quote body text with luxury subtle quotation styling */}
        <p className="review-body-text">
          <Quote size={14} className="review-quote-icon" />
          <span>{rev.quote}</span>
        </p>

        {/* Author Footer */}
        <div className="review-author-footer">
          <div className="review-avatar-circle" style={{ background: rev.avatarBg }}>
            <span>{rev.avatarText}</span>
          </div>
          <div className="review-author-info">
            <div className="author-name-row">
              <h4 className="author-full-name">{rev.name}</h4>
              <div className="review-verified-badge" title="Verified Travel Purchase">
                <CheckCircle size={12} color="#16a34a" />
                <span>Verified</span>
              </div>
            </div>
            <p className="author-location-service">
              {rev.city} • <span className="review-date-stamp">{rev.date}</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="section-block reviews-experience-block reviews-marquee-section">
      <div className="container">
        {/* Header */}
        <div className="reviews-header-center">
          <div className="reviews-trust-pill">
            <ShieldCheck size={15} />
            <span>VERIFIED TRAVEL PULSE • OVER 1.2M+ HAPPY TRAVELERS</span>
          </div>
          <h2 className="reviews-title">Loved by Travelers Across the Globe</h2>
          <p className="reviews-subtitle">
            Real experiences from travelers who book flights, hotels, trains, buses, and holiday tours with complete peace of mind.
          </p>
        </div>
      </div>

      {/* Single Infinite Marquee Track (Left to Right Smooth Stream) */}
      <div className="reviews-marquee-viewport">
        <div className="reviews-marquee-row single-row">
          <div className="reviews-marquee-track track-single-marquee">
            {/* All 16 Reviews */}
            {[...row1Reviews, ...row2Reviews].map((rev) => renderCard(rev, 'rev-a'))}
            {/* Duplicate Set for Seamless Infinite Loop */}
            {[...row1Reviews, ...row2Reviews].map((rev) => renderCard(rev, 'rev-b'))}
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '36px' }}>
        {/* Subtle Pause Hint */}
        <div className="reviews-interaction-hint">
          <Sparkles size={13} color="#034ea2" />
          <span>Stream pauses automatically when you hover over any review</span>
        </div>

        {/* Trust Badges Strip */}
        <div className="trust-metrics-strip">
          <div className="metric-item">
            <strong className="metric-number">4.9 / 5</strong>
            <span className="metric-label">Average User Rating</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <strong className="metric-number">1.2M+</strong>
            <span className="metric-label">Happy Travelers</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <strong className="metric-number">99.4%</strong>
            <span className="metric-label">Instant Confirmation</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <strong className="metric-number">24/7</strong>
            <span className="metric-label">Dedicated Concierge</span>
          </div>
        </div>
      </div>
    </section>
  );
}
