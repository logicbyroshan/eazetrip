import { Link } from 'react-router-dom';
import { Camera, Ticket, Sparkles, ArrowRight } from 'lucide-react';

export const categoryCardsData = [
  {
    id: 'adventure',
    title: 'Adventure & Flights',
    subtitle: 'Soaring peaks & aerial escapes',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80',
    link: '/flight-booking',
    offsetClass: 'offset-step-1'
  },
  {
    id: 'cultural',
    title: 'Cultural Heritage',
    subtitle: 'Palaces, forts & historic trails',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&auto=format&fit=crop&q=80',
    link: '/hotel-booking',
    offsetClass: 'offset-step-2'
  },
  {
    id: 'beach',
    title: 'Beach Getaways',
    subtitle: 'Turquoise lagoons & tropical sand',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&auto=format&fit=crop&q=80',
    link: '/hotel-booking',
    offsetClass: 'offset-step-3'
  },
  {
    id: 'luxury',
    title: 'Luxury Stays',
    subtitle: '5-star resorts & private villas',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&auto=format&fit=crop&q=80',
    link: '/hotel-booking',
    offsetClass: 'offset-step-2'
  },
  {
    id: 'wildlife',
    title: 'Scenic Rails & Roads',
    subtitle: 'Alpine valleys & sleeper journeys',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&auto=format&fit=crop&q=80',
    link: '/bus-booking',
    offsetClass: 'offset-step-1'
  }
];

export default function TravelCategoriesSection() {
  return (
    <section className="section-block travel-categories-block">
      <div className="container relative-container">
        {/* Floating Playful Stickers (Matching Screenshot 1) */}
        <div className="floating-sticker sticker-camera" title="Capture Moments">
          <div className="sticker-bubble">
            <span className="sticker-emoji">📸</span>
          </div>
        </div>
        <div className="floating-sticker sticker-ticket" title="Exclusive Tickets">
          <div className="sticker-bubble">
            <span className="sticker-emoji">🎫</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="categories-arc-header">
          <span className="cursive-tagline">Wonderful place for You</span>
          <h2 className="categories-main-title">Tour Categories</h2>
        </div>

        {/* 5-Card Staggered Curved Wave Layout (Matching Screenshot 1) */}
        <div className="categories-staggered-grid">
          {categoryCardsData.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className={`category-arc-card ${item.offsetClass}`}
            >
              <div className="cat-photo-frame">
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="cat-photo-overlay"></div>
              </div>
              <div className="cat-title-caption">
                <h4>{item.title}</h4>
                <p className="cat-sub-caption">{item.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
