import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TrainSearchWidget from '../components/search/TrainSearchWidget';
import TrainCard from '../components/trains/TrainCard';
import TrainFilters from '../components/trains/TrainFilters';
import { mockTrains } from '../data/trainData';
import { HERO_BACKDROPS } from '../data/siteData';
import { useBooking } from '../context/BookingContext';
import { Train, CheckCircle2, RotateCcw } from 'lucide-react';

export default function RailwayBookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchState = location.state || {};
  const { startCheckout } = useBooking();

  // Filters State
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedTrainTypes, setSelectedTrainTypes] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [maxPrice, setMaxPrice] = useState(6000);

  const filteredTrains = useMemo(() => {
    return mockTrains.filter((train) => {
      // 1. Train Type filter
      if (selectedTrainTypes.length > 0) {
        const matchesType = selectedTrainTypes.some((t) =>
          train.trainName.toLowerCase().includes(t.toLowerCase().split(' ')[0])
        );
        if (!matchesType) return false;
      }

      // 2. Class filter
      if (selectedClasses.length > 0) {
        const hasClass = train.classes?.some((c) => selectedClasses.includes(c.code));
        if (!hasClass) return false;
      }

      // 3. Price filter
      const minClassPrice = Math.min(...(train.classes?.map((c) => c.price) || [9999]));
      if (minClassPrice > maxPrice) {
        return false;
      }

      // 4. Time slot filter
      if (selectedTimeSlot) {
        const hour = parseInt(train.departureTime.split(':')[0], 10);
        if (selectedTimeSlot === 'earlyMorning' && hour >= 6) return false;
        if (selectedTimeSlot === 'morning' && (hour < 6 || hour >= 12)) return false;
        if (selectedTimeSlot === 'afternoon' && (hour < 12 || hour >= 18)) return false;
        if (selectedTimeSlot === 'evening' && hour < 18) return false;
      }

      return true;
    });
  }, [selectedClasses, selectedTrainTypes, selectedTimeSlot, maxPrice]);

  const handleToggleClass = (code) => {
    setSelectedClasses((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleToggleTrainType = (type) => {
    setSelectedTrainTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleResetFilters = () => {
    setSelectedClasses([]);
    setSelectedTrainTypes([]);
    setSelectedTimeSlot(null);
    setMaxPrice(6000);
  };

  const handleBookTrainClass = (train, classObj) => {
    const item = {
      ...train,
      checkoutType: 'train',
      selectedClass: classObj?.name || classObj?.code || '3A',
      price: classObj?.price || 1200,
      travelDate: searchState.travelDate || '2026-09-25'
    };
    startCheckout(item, 'train');
    navigate('/review-booking', { state: { item } });
  };

  return (
    <div className="listing-page-wrapper">
      {/* Top Search Filter Banner */}
      <div
        className="listing-top-search-banner"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(10, 25, 47, 0.82) 0%, rgba(17, 34, 64, 0.88) 100%), url('${HERO_BACKDROPS.railway.url}')`
        }}
      >
        <div className="container">
          <div className="listing-search-card-wrapper">
            <TrainSearchWidget initialValues={searchState} />
          </div>
        </div>
      </div>

      <div className="container listing-content-layout">
        {/* Left Filter Sidebar */}
        <aside className="listing-sidebar">
          <TrainFilters
            selectedClasses={selectedClasses}
            onToggleClass={handleToggleClass}
            selectedTrainTypes={selectedTrainTypes}
            onToggleTrainType={handleToggleTrainType}
            selectedTimeSlot={selectedTimeSlot}
            onSelectTimeSlot={setSelectedTimeSlot}
            maxPrice={6000}
            currentMaxPrice={maxPrice}
            onChangeMaxPrice={setMaxPrice}
            onResetFilters={handleResetFilters}
          />
        </aside>

        {/* Right Search Results */}
        <main className="listing-results-col">
          <div className="irctc-partner-strip mb-3">
            <div className="partner-badge">
              <CheckCircle2 size={18} color="#16a34a" />
              <strong>IRCTC Authorized Train Booking Partner</strong>
            </div>
            <p>Instant refund on Tatkal cancellations • Zero payment gateway charges via Razorpay & UPI</p>
          </div>

          <div className="results-header-bar">
            <div>
              <h2>Trains between {searchState.from || 'New Delhi'} and {searchState.to || 'Mumbai'}</h2>
              <span className="results-count">
                Showing {filteredTrains.length} direct express & superfast trains with live seat availability
              </span>
            </div>
          </div>

          {filteredTrains.length === 0 ? (
            <div className="empty-results-box">
              <Train size={48} color="#94a3b8" />
              <h3>No trains found matching your filter criteria</h3>
              <p>Try resetting the filters or choosing a different class/time slot.</p>
              <button
                type="button"
                className="secondary-btn"
                onClick={handleResetFilters}
              >
                <RotateCcw size={14} /> Reset All Filters
              </button>
            </div>
          ) : (
            <div className="train-cards-list">
              {filteredTrains.map((train) => (
                <TrainCard
                  key={train.id}
                  train={train}
                  onBookClass={handleBookTrainClass}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
