import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import HolidaySearchWidget from '../components/search/HolidaySearchWidget';
import HolidayCard from '../components/holidays/HolidayCard';
import HolidayFilters from '../components/holidays/HolidayFilters';
import HolidayDetailsModal from '../components/holidays/HolidayDetailsModal';
import { mockHolidayPackages } from '../data/holidayData';
import { HERO_BACKDROPS } from '../data/siteData';
import { useBooking } from '../context/BookingContext';
import { Compass } from 'lucide-react';

export default function HolidayBookingPage() {
  const location = useLocation();
  const searchState = location.state || {};
  const { startCheckout } = useBooking();

  const [activeModalPackage, setActiveModalPackage] = useState(null);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('All'); // All | Domestic | International
  const [selectedTheme, setSelectedTheme] = useState(searchState.theme || 'All Themes');
  const [selectedDuration, setSelectedDuration] = useState('all'); // all | short | medium | long
  const [maxPrice, setMaxPrice] = useState(60000);

  const filteredPackages = useMemo(() => {
    return mockHolidayPackages.filter((pkg) => {
      // 1. Destination Search filter
      if (searchState.destination) {
        const query = searchState.destination.toLowerCase();
        const matchesDest =
          pkg.destination.toLowerCase().includes(query) ||
          pkg.title.toLowerCase().includes(query);
        if (!matchesDest) return false;
      }

      // 2. Category filter (Domestic / International)
      if (selectedCategory !== 'All' && pkg.category !== selectedCategory) {
        return false;
      }

      // 3. Theme filter
      if (selectedTheme !== 'All Themes' && pkg.theme !== selectedTheme) {
        return false;
      }

      // 4. Duration filter
      if (selectedDuration === 'short' && (pkg.days < 3 || pkg.days > 4)) return false;
      if (selectedDuration === 'medium' && (pkg.days < 5 || pkg.days > 7)) return false;
      if (selectedDuration === 'long' && pkg.days < 8) return false;

      // 5. Price filter
      if (pkg.price > maxPrice) {
        return false;
      }

      return true;
    });
  }, [searchState.destination, selectedCategory, selectedTheme, selectedDuration, maxPrice]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedTheme('All Themes');
    setSelectedDuration('all');
    setMaxPrice(60000);
  };

  const handleBookPackage = (pkg) => {
    startCheckout({
      ...pkg,
      price: pkg.price,
      taxes: pkg.taxes,
      travelDate: searchState.month || '2026-10-15',
      departureCity: searchState.fromCity || 'Mumbai',
      guests: '2 Travelers'
    }, 'holiday');
  };

  const heroImage = HERO_BACKDROPS.holidays?.url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=85';

  return (
    <div className="listing-page-wrapper">
      {/* Top Search Filter Banner */}
      <div
        className="listing-top-search-banner"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(10, 25, 47, 0.82) 0%, rgba(17, 34, 64, 0.88) 100%), url('${heroImage}')`
        }}
      >
        <div className="container">
          <div className="listing-search-card-wrapper">
            <HolidaySearchWidget initialValues={searchState} />
          </div>
        </div>
      </div>

      <div className="container listing-content-layout">
        {/* Left Filter Sidebar */}
        <aside className="listing-sidebar">
          <HolidayFilters
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedTheme={selectedTheme}
            onSelectTheme={setSelectedTheme}
            selectedDuration={selectedDuration}
            onSelectDuration={setSelectedDuration}
            maxPrice={60000}
            currentMaxPrice={maxPrice}
            onChangeMaxPrice={setMaxPrice}
            onResetFilters={handleResetFilters}
          />
        </aside>

        {/* Right Search Results */}
        <main className="listing-results-col">
          <div className="results-header-bar">
            <div>
              <h2>
                {searchState.destination
                  ? `Holiday Tour Packages in ${searchState.destination}`
                  : 'All Curated Holiday Tour Packages'}
              </h2>
              <span className="results-count">
                Showing {filteredPackages.length} verified packages • Flights, Hotels, Sightseeing & Meals Included
              </span>
            </div>
          </div>

          {filteredPackages.length === 0 ? (
            <div className="empty-results-box">
              <Compass size={48} color="#94a3b8" />
              <h3>No holiday packages found matching your criteria</h3>
              <p>Try resetting the category and budget filters to see all dream vacation packages.</p>
              <button
                type="button"
                className="secondary-btn"
                onClick={handleResetFilters}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="holiday-cards-list">
              {filteredPackages.map((pkg) => (
                <HolidayCard
                  key={pkg.id}
                  pkg={pkg}
                  onBook={handleBookPackage}
                  onViewDetails={(p) => setActiveModalPackage(p)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Itinerary Details Modal */}
      {activeModalPackage && (
        <HolidayDetailsModal
          pkg={activeModalPackage}
          onClose={() => setActiveModalPackage(null)}
          onBook={handleBookPackage}
        />
      )}
    </div>
  );
}
