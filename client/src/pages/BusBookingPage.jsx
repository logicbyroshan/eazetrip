import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BusSearchWidget from '../components/search/BusSearchWidget';
import BusCard from '../components/buses/BusCard';
import BusFilters from '../components/buses/BusFilters';
import BusSeatPickerModal from '../components/buses/BusSeatPickerModal';
import { mockBuses } from '../data/busData';
import { HERO_BACKDROPS } from '../data/siteData';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Bus, RotateCcw } from 'lucide-react';

export default function BusBookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchState = location.state || {};
  const { startCheckout } = useBooking();
  const { user, firstName } = useAuth();

  const [activeBusModal, setActiveBusModal] = useState(null);

  // Filters State
  const [selectedOperators, setSelectedOperators] = useState([]);
  const [acOnly, setAcOnly] = useState(false);
  const [sleeperOnly, setSleeperOnly] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [maxPrice, setMaxPrice] = useState(3000);

  const filteredBuses = useMemo(() => {
    return mockBuses.filter((bus) => {
      // Operator filter
      if (selectedOperators.length > 0 && !selectedOperators.includes(bus.operator)) {
        return false;
      }
      // AC filter
      if (acOnly && !bus.busType.includes('A/C')) {
        return false;
      }
      // Sleeper filter
      if (sleeperOnly && !bus.busType.includes('Sleeper')) {
        return false;
      }
      // Price filter
      if (bus.price > maxPrice) {
        return false;
      }
      // Time slot filter
      if (selectedTimeSlot) {
        const hour = parseInt(bus.departureTime.split(':')[0], 10);
        if (selectedTimeSlot === 'earlyMorning' && hour >= 6) return false;
        if (selectedTimeSlot === 'morning' && (hour < 6 || hour >= 12)) return false;
        if (selectedTimeSlot === 'afternoon' && (hour < 12 || hour >= 18)) return false;
        if (selectedTimeSlot === 'evening' && hour < 18) return false;
      }
      return true;
    });
  }, [selectedOperators, acOnly, sleeperOnly, selectedTimeSlot, maxPrice]);

  const handleToggleOperator = (operator) => {
    setSelectedOperators((prev) =>
      prev.includes(operator) ? prev.filter((o) => o !== operator) : [...prev, operator]
    );
  };

  const handleResetFilters = () => {
    setSelectedOperators([]);
    setAcOnly(false);
    setSleeperOnly(false);
    setSelectedTimeSlot(null);
    setMaxPrice(3000);
  };

  const handleProceedFromSeatPicker = (selectionData) => {
    setActiveBusModal(null);
    const item = {
      ...selectionData.bus,
      checkoutType: 'bus',
      selectedSeats: selectionData.selectedSeats,
      boardingPoint: selectionData.boardingPoint,
      droppingPoint: selectionData.droppingPoint,
      price: selectionData.totalPrice,
      journeyDate: searchState.journeyDate || '2026-09-28'
    };
    startCheckout(item, 'bus');
    navigate('/review-booking', { state: { item } });
  };

  return (
    <div className="listing-page-wrapper">
      {/* Top Search Filter Banner */}
      <div
        className="listing-top-search-banner"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(10, 25, 47, 0.82) 0%, rgba(17, 34, 64, 0.88) 100%), url('${HERO_BACKDROPS.bus.url}')`
        }}
      >
        <div className="container">
          <div className="listing-search-card-wrapper">
            <BusSearchWidget initialValues={searchState} />
          </div>
        </div>
      </div>

      <div className="container listing-content-layout">
        {/* Left Filter Sidebar */}
        <aside className="listing-sidebar">
          <BusFilters
            selectedOperators={selectedOperators}
            onToggleOperator={handleToggleOperator}
            acOnly={acOnly}
            onToggleAcOnly={setAcOnly}
            sleeperOnly={sleeperOnly}
            onToggleSleeperOnly={setSleeperOnly}
            selectedTimeSlot={selectedTimeSlot}
            onSelectTimeSlot={setSelectedTimeSlot}
            maxPrice={3000}
            currentMaxPrice={maxPrice}
            onChangeMaxPrice={setMaxPrice}
            onResetFilters={handleResetFilters}
          />
        </aside>

        {/* Right Search Results */}
        <main className="listing-results-col">
          <div className="results-header-bar">
            <div>
              <h2>{firstName ? `Bus Routes Curated for ${firstName}` : `Buses from ${searchState.from || 'Pune'} to ${searchState.to || 'Mumbai'}`}</h2>
              <span className="results-count">
                {firstName
                  ? `Real-Time GPS Tracking & Live Seat Selection for ${firstName} • ${filteredBuses.length} verified operators (${searchState.from || 'Pune'} → ${searchState.to || 'Mumbai'})`
                  : `Showing ${filteredBuses.length} verified operators • Real-Time GPS Tracking & Live Seat Selection`}
              </span>
            </div>
          </div>

          {filteredBuses.length === 0 ? (
            <div className="empty-results-box">
              <Bus size={48} color="#94a3b8" />
              <h3>No buses found matching your filter criteria</h3>
              <p>Try clearing your bus type or operator filters.</p>
              <button
                type="button"
                className="secondary-btn"
                onClick={handleResetFilters}
              >
                <RotateCcw size={14} /> Reset All Filters
              </button>
            </div>
          ) : (
            <div className="bus-cards-list">
              {filteredBuses.map((bus) => (
                <BusCard
                  key={bus.id}
                  bus={bus}
                  onSelectSeats={(b) => setActiveBusModal(b)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {activeBusModal && (
        <BusSeatPickerModal
          bus={activeBusModal}
          onClose={() => setActiveBusModal(null)}
          onProceed={handleProceedFromSeatPicker}
        />
      )}
    </div>
  );
}
