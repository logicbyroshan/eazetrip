import { useState } from 'react';
import { siteFaqs } from '../data/siteData';
import { ChevronDown, ChevronUp, HelpCircle, Search, Sparkles, MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FaqPage() {
  const [openItems, setOpenItems] = useState({ 'Flights-0': true, 'Hotels-0': true });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const toggleItem = (key) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const categories = ['All', 'Flights', 'Hotels', 'Buses & Trains', 'Payments & Refunds'];

  const filteredFaqs = siteFaqs
    .filter((cat) => (selectedCategory === 'All' ? true : cat.category === selectedCategory))
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <div className="container page-wrap">
      <div className="page-shell narrow">
        <div className="page-topbar">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Help Center & FAQ</span>
        </div>

        {/* Hero Search Box */}
        <div className="faq-hero-box content-card text-center">
          <div className="faq-hero-icon mx-auto mb-2">
            <HelpCircle size={36} color="#034ea2" />
          </div>
          <span className="section-tag">KNOWLEDGE BASE & SUPPORT</span>
          <h1>Frequently Asked Questions</h1>
          <p className="lead">Instant answers to common questions about air tickets, hotel check-ins, IRCTC train rules, and instant refunds.</p>

          <div className="faq-search-input-wrap mt-3">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by keywords (e.g. baggage allowance, cancellation, refund timeline, meal)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="category-filter-strip mt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cat-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordions List */}
        <div className="faq-sections-list mt-4">
          {filteredFaqs.length === 0 ? (
            <div className="content-card text-center py-5">
              <p className="lead">No questions found matching "{searchQuery}".</p>
              <button
                type="button"
                className="secondary-btn mt-3"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            filteredFaqs.map((section) => (
              <div key={section.category} className="faq-section-group mb-4">
                <h3 className="faq-section-title">{section.category}</h3>
                <div className="faq-accordion-stack">
                  {section.items.map((item, idx) => {
                    const key = `${section.category}-${idx}`;
                    const isOpen = !!openItems[key];
                    return (
                      <div key={idx} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                        <button
                          type="button"
                          className="faq-question-btn"
                          onClick={() => toggleItem(key)}
                          aria-expanded={isOpen}
                        >
                          <span className="faq-q-text">{item.q}</span>
                          <span className="faq-icon-arrow">
                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="faq-answer-content">
                            <p>{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 24/7 Contact Fallback Resolution Card */}
        <div className="content-card contact-cta-card text-center mt-4">
          <div className="cta-icon-box mx-auto mb-2">
            <MessageCircle size={28} color="#034ea2" />
          </div>
          <h3>Still Need Assistance with Your Booking?</h3>
          <p>Our dedicated travel support specialists are available round-the-clock to assist you.</p>
          <div className="cta-actions-row mt-3">
            <Link to="/contact" className="primary-btn">
              Contact 24/7 Helpdesk
            </Link>
            <a href="tel:+918269054018" className="secondary-btn">
              <Phone size={15} /> Call +91 8269054018
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
