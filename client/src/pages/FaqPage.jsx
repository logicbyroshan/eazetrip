import { useState } from 'react';
import { siteFaqs } from '../data/siteData';
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FaqPage() {
  const [openItems, setOpenItems] = useState({ 'Flights-0': true });
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
          <span>Help & FAQ</span>
        </div>

        <div className="faq-hero-box content-card text-center">
          <div className="faq-hero-icon mx-auto">
            <HelpCircle size={36} color="#1272d5" />
          </div>
          <h1>Frequently Asked Questions</h1>
          <p className="lead">Find answers to common questions about flights, hotels, trains, payments, and refunds.</p>

          <div className="faq-search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by keywords (e.g. baggage, cancel, refund, seat)..."
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

        {/* FAQ Accordions */}
        <div className="faq-sections-list mt-4">
          {filteredFaqs.length === 0 ? (
            <div className="content-card text-center py-4">
              <p>No FAQ questions found matching "{searchQuery}".</p>
              <button
                type="button"
                className="secondary-btn mt-2"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Clear Search
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
                        >
                          <span>{item.q}</span>
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
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

        {/* Contact fallback */}
        <div className="content-card contact-cta-card text-center mt-4">
          <h3>Still have questions?</h3>
          <p>Our 24/7 dedicated customer care team is here to assist you anytime.</p>
          <div className="cta-actions-row">
            <Link to="/contact" className="primary-btn">
              Contact Support Desk
            </Link>
            <a href="tel:+918269054018" className="secondary-btn">
              Call +91 8269054018
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
