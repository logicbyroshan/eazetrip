import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import BusSearchWidget from '../components/search/BusSearchWidget';
import BusCard from '../components/buses/BusCard';
import BusSeatPickerModal from '../components/buses/BusSeatPickerModal';
import { mockBuses } from '../data/busData';
import { useBooking } from '../context/BookingContext';
import { Bus, Filter, RotateCcw } from 'lucide-react';

export default function BusBookingPage() {
  const location = useLocation();
  const searchState = location.state || {};
  const { startCheckout } = useBooking();

  const [activeBusModal, setActiveBusModal] = useState(null);
  const [selectedOperators, setSelectedOperators] = useState([]);
  const [acOnly, setAcOnly] = useState(false);
  const [sleeperOnly, setSleeperOnly] = useState(false);

  const filteredBuses = useMemo(() => {
    return mockBuses.filter((bus) => {
      if (selectedOperators.length > 0 && !selectedOperators.includes(bus.operator)) {
        return false;
      }
      if (acOnly && !bus.busType.includes('A/C')) {
        return false;
      }
      if (sleeperOnly && !bus.busType.includes('Sleeper')) {
        return false;
      }
      return true;
    });
  }, [selectedOperators, acOnly, sleeperOnly]);

  const handleToggleOperator = (operator) => {
    setSelectedOperators((prev) =>
      prev.includes(operator) ? prev.filter((o) => o !== operator) : [...prev, operator]
    );
  };

  const handleProceedFromSeatPicker = (selectionData) => {
    setActiveBusModal(null);
    startCheckout({
      ...selectionData.bus,
      selectedSeats: selectionData.selectedSeats,
      boardingPoint: selectionData.boardingPoint,
      droppingPoint: selectionData.droppingPoint,
      price: selectionData.totalPrice,
      journeyDate: searchState.journeyDate || '2026-09-28'
    }, 'bus');
  };

  return (
    <div className="listing-page-wrapper">
      <div className="listing-top-search-banner">
        <div className="container">
          <div className="listing-search-card-wrapper">
            <BusSearchWidget initialValues={searchState} />
          </div>
        </div>
      </div>

      <div className="container listing-content-layout">
        <aside className="listing-sidebar">
          <div className="filter-sidebar">
            <div className="filter-header">
              <div className="filter-title">
                <Filter size={18} />
                <h3>Filter Buses</h3>
              </div>
              <button
                type="button"
                className="reset-btn"
                onClick={() => {
                  setSelectedOperators([]);
                  setAcOnly(false);
                  setSleeperOnly(false);
                }}
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>

            <div className="filter-group">
              <h4>Bus Type</h4>
              <div className="checkbox-stack">
                <label className="filter-checkbox-row">
                  <input
                    type="checkbox"
                    checked={acOnly}
                    onChange={(e) => setAcOnly(e.target.checked)}
                  />
                  <span>AC Buses Only</span>
                </label>
                <label className="filter-checkbox-row">
                  <input
                    type="checkbox"
                    checked={sleeperOnly}
                    onChange={(e) => setSleeperOnly(e.target.checked)}
                  />
                  <span>Sleeper Coaches</span>
                </label>
              </div>
            </div>

            <div className="filter-group">
              <h4>Bus Operators</h4>
              <div className="checkbox-stack">
                {['Orange Travels', 'Zingbus Plus', 'IntrCity SmartBus'].map((op) => (
                  <label key={op} className="filter-checkbox-row">
                    <input
                      type="checkbox"
                      checked={selectedOperators.includes(op)}
                      onChange={() => handleToggleOperator(op)}
                    />
                    <span>{op}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="listing-results-col">
          <div className="results-header-bar">
            <div>
              <h2>Buses from {searchState.from || 'Pune'} to {searchState.to || 'Mumbai'}</h2>
              <span className="results-count">
                Showing {filteredBuses.length} top-rated operators with live GPS tracking
              </span>
            </div>
          </div>

          <div className="bus-cards-list">
            {filteredBuses.map((bus) => (
              <BusCard
                key={bus.id}
                bus={bus}
                onSelectSeats={(b) => setActiveBusModal(b)}
              />
            ))}
          </div>
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
