import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import FlightSearchWidget from '../components/search/FlightSearchWidget';
import FlightCard from '../components/flights/FlightCard';
import FlightFilters from '../components/flights/FlightFilters';
import FlightDetailsModal from '../components/flights/FlightDetailsModal';
import { mockFlights } from '../data/flightData';
import { HERO_BACKDROPS } from '../data/siteData';
import { useBooking } from '../context/BookingContext';
import { Plane } from 'lucide-react';

export default function FlightBookingPage() {
  const location = useLocation();
  const searchState = location.state || {};
  const { startCheckout } = useBooking();

  const [activeModalFlight, setActiveModalFlight] = useState(null);

  // Filters State
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [maxPrice, setMaxPrice] = useState(10000);

  // Round trip selection
  const isRoundTrip = searchState.tripType === 'roundTrip';
  const [selectedOnwardFlight, setSelectedOnwardFlight] = useState(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);

  const filteredFlights = useMemo(() => {
    return mockFlights.filter((flight) => {
      // Airline filter
      if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.airline)) {
        return false;
      }
      // Stops filter
      if (selectedStops.length > 0 && !selectedStops.includes(flight.stops)) {
        return false;
      }
      // Price filter
      if (flight.price > maxPrice) {
        return false;
      }
      // Time slot filter
      if (selectedTimeSlot) {
        const hour = parseInt(flight.departureTime.split(':')[0], 10);
        if (selectedTimeSlot === 'earlyMorning' && hour >= 6) return false;
        if (selectedTimeSlot === 'morning' && (hour < 6 || hour >= 12)) return false;
        if (selectedTimeSlot === 'afternoon' && (hour < 12 || hour >= 18)) return false;
        if (selectedTimeSlot === 'evening' && hour < 18) return false;
      }
      return true;
    });
  }, [selectedAirlines, selectedStops, selectedTimeSlot, maxPrice]);

  const handleToggleAirline = (name) => {
    setSelectedAirlines((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const handleToggleStops = (stopCount) => {
    setSelectedStops((prev) =>
      prev.includes(stopCount) ? prev.filter((s) => s !== stopCount) : [...prev, stopCount]
    );
  };

  const handleResetFilters = () => {
    setSelectedAirlines([]);
    setSelectedStops([]);
    setSelectedTimeSlot(null);
    setMaxPrice(10000);
  };

  const handleSelectFlight = (flight, isReturn = false) => {
    if (!isRoundTrip) {
      startCheckout(flight, 'flight');
    } else {
      if (isReturn) {
        setSelectedReturnFlight(flight);
      } else {
        setSelectedOnwardFlight(flight);
      }
    }
  };

  const handleBookRoundTrip = () => {
    if (!selectedOnwardFlight || !selectedReturnFlight) return;
    const combinedItem = {
      id: `RT-${selectedOnwardFlight.id}-${selectedReturnFlight.id}`,
      type: 'flight',
      title: `${selectedOnwardFlight.fromCity} ⇄ ${selectedOnwardFlight.toCity} (Round Trip)`,
      onward: selectedOnwardFlight,
      returnFlight: selectedReturnFlight,
      price: selectedOnwardFlight.price + selectedReturnFlight.price,
      departureDate: searchState.departureDate,
      returnDate: searchState.returnDate
    };
    startCheckout(combinedItem, 'flight');
  };

  return (
    <div className="listing-page-wrapper">
      {/* Top Search Filter Banner & Card Wrapper */}
      <div
        className="listing-top-search-banner"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(10, 25, 47, 0.82) 0%, rgba(17, 34, 64, 0.88) 100%), url('${HERO_BACKDROPS.flights.url}')`
        }}
      >
        <div className="container">
          <div className="listing-search-card-wrapper">
            <FlightSearchWidget initialValues={searchState} />
          </div>
        </div>
      </div>

      <div className="container listing-content-layout">
        {/* Left Filter Sidebar */}
        <aside className="listing-sidebar">
          <FlightFilters
            selectedAirlines={selectedAirlines}
            onToggleAirline={handleToggleAirline}
            selectedStops={selectedStops}
            onToggleStops={handleToggleStops}
            selectedTimeSlot={selectedTimeSlot}
            onSelectTimeSlot={setSelectedTimeSlot}
            maxPrice={10000}
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
                Flights from {searchState.from || 'Mumbai'} to {searchState.to || 'New Delhi'}
              </h2>
              <span className="results-count">
                Showing {filteredFlights.length} available flights • Special Fares & Instant Booking
              </span>
            </div>
          </div>

          {filteredFlights.length === 0 ? (
            <div className="empty-results-box">
              <Plane size={48} color="#94a3b8" />
              <h3>No flights found matching your filter criteria</h3>
              <p>Try clearing your filters or changing the departure time.</p>
              <button
                type="button"
                className="secondary-btn"
                onClick={handleResetFilters}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="flight-cards-list">
              {filteredFlights.map((flight) => {
                const isSelected = isRoundTrip
                  ? selectedOnwardFlight?.id === flight.id
                  : false;
                return (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    isSelected={isSelected}
                    onSelect={handleSelectFlight}
                    onViewDetails={(f) => setActiveModalFlight(f)}
                  />
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Round Trip Sticky Bottom Bar */}
      {isRoundTrip && (
        <div className="sticky-bottom-bar">
          <div className="container sticky-inner">
            <div className="flight-selection-preview">
              <div className="preview-leg">
                <small>Onward Flight:</small>
                {selectedOnwardFlight ? (
                  <strong>
                    {selectedOnwardFlight.airline} ({selectedOnwardFlight.departureTime}) - ₹{selectedOnwardFlight.price}
                  </strong>
                ) : (
                  <span className="text-warning">Select onward flight above</span>
                )}
              </div>
              <div className="preview-leg">
                <small>Return Flight:</small>
                {selectedReturnFlight ? (
                  <strong>
                    {selectedReturnFlight.airline} ({selectedReturnFlight.departureTime}) - ₹{selectedReturnFlight.price}
                  </strong>
                ) : (
                  <span className="text-warning">Select return flight</span>
                )}
              </div>
            </div>

            <div className="sticky-action-wrap">
              <div className="total-combo-price">
                <span className="lbl">Total Fare:</span>
                <strong>
                  ₹
                  {(
                    (selectedOnwardFlight?.price || 0) +
                    (selectedReturnFlight?.price || 0)
                  ).toLocaleString('en-IN')}
                </strong>
              </div>
              <button
                type="button"
                className="primary-btn"
                disabled={!selectedOnwardFlight || !selectedReturnFlight}
                onClick={handleBookRoundTrip}
              >
                Book Round Trip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {activeModalFlight && (
        <FlightDetailsModal
          flight={activeModalFlight}
          onClose={() => setActiveModalFlight(null)}
          onBook={(f) => handleSelectFlight(f)}
        />
      )}
    </div>
  );
}
