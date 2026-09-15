import { useState } from 'react';
import { X, Armchair, MapPin, CheckCircle2 } from 'lucide-react';

export default function BusSeatPickerModal({ bus, onClose, onProceed }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedBoarding, setSelectedBoarding] = useState(
    bus?.boardingPoints?.[0]?.location || 'Main Boarding Point'
  );
  const [selectedDropping, setSelectedDropping] = useState(
    bus?.droppingPoints?.[0]?.location || 'Main Dropping Point'
  );

  if (!bus) return null;

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;

    if (selectedSeats.some((s) => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const lowerSeats = bus.seats?.filter((s) => s.deck === 'lower') || [];
  const upperSeats = bus.seats?.filter((s) => s.deck === 'upper') || [];

  const totalPrice = selectedSeats.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container seat-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-custom">
          <div>
            <h3>Select Seats • {bus.operator}</h3>
            <span className="sub-tagline">{bus.from} → {bus.to} ({bus.busType})</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Seat Legend */}
        <div className="seat-legend-bar">
          <div className="legend-item">
            <span className="seat-sample available"></span>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <span className="seat-sample selected"></span>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <span className="seat-sample booked"></span>
            <span>Booked</span>
          </div>
          <div className="legend-item">
            <span className="seat-sample ladies"></span>
            <span>Ladies Only</span>
          </div>
        </div>

        <div className="seat-picker-body">
          {/* Deck Layouts */}
          <div className="decks-container">
            {/* Lower Deck */}
            <div className="deck-block">
              <span className="deck-title">Lower Deck</span>
              <div className="deck-bus-frame">
                <div className="steering-wheel">🚗 Driver</div>
                <div className="seats-grid">
                  {lowerSeats.map((seat) => {
                    const isSelected = selectedSeats.some((s) => s.id === seat.id);
                    return (
                      <button
                        key={seat.id}
                        type="button"
                        disabled={seat.isBooked}
                        className={`seat-btn ${seat.isBooked ? 'booked' : ''} ${
                          seat.isLadies ? 'ladies' : ''
                        } ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSeatClick(seat)}
                        title={`Seat ${seat.number} - ₹${seat.price}`}
                      >
                        <Armchair size={16} />
                        <small>{seat.number}</small>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Upper Deck */}
            {upperSeats.length > 0 && (
              <div className="deck-block">
                <span className="deck-title">Upper Deck</span>
                <div className="deck-bus-frame">
                  <div className="deck-header-blank">Upper Deck Berths</div>
                  <div className="seats-grid">
                    {upperSeats.map((seat) => {
                      const isSelected = selectedSeats.some((s) => s.id === seat.id);
                      return (
                        <button
                          key={seat.id}
                          type="button"
                          disabled={seat.isBooked}
                          className={`seat-btn sleeper-btn ${seat.isBooked ? 'booked' : ''} ${
                            seat.isLadies ? 'ladies' : ''
                          } ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSeatClick(seat)}
                          title={`Berth ${seat.number} - ₹${seat.price}`}
                        >
                          <span className="berth-icon">🛏️</span>
                          <small>{seat.number}</small>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Boarding / Dropping & Selection Summary */}
          <div className="seat-summary-sidebar">
            <div className="selection-card">
              <h4>Boarding & Dropping Points</h4>

              <div className="form-group mb-3">
                <label>Boarding Point:</label>
                <select
                  value={selectedBoarding}
                  onChange={(e) => setSelectedBoarding(e.target.value)}
                  className="native-select"
                >
                  {bus.boardingPoints?.map((bp) => (
                    <option key={bp.location} value={bp.location}>
                      {bp.time} - {bp.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Dropping Point:</label>
                <select
                  value={selectedDropping}
                  onChange={(e) => setSelectedDropping(e.target.value)}
                  className="native-select"
                >
                  {bus.droppingPoints?.map((dp) => (
                    <option key={dp.location} value={dp.location}>
                      {dp.time} - {dp.location}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="selected-seats-card">
              <h4>Seat Summary</h4>
              {selectedSeats.length === 0 ? (
                <p className="text-muted">Please click on seats on the layout to select.</p>
              ) : (
                <div className="selected-seats-list">
                  <div className="seats-tags">
                    {selectedSeats.map((s) => (
                      <span key={s.id} className="selected-seat-chip">
                        Seat {s.number} (₹{s.price})
                      </span>
                    ))}
                  </div>
                  <div className="price-total-row">
                    <span>Total Amount ({selectedSeats.length} Seats):</span>
                    <strong>₹{totalPrice.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              className="primary-btn full"
              disabled={selectedSeats.length === 0}
              onClick={() => {
                onProceed({
                  bus,
                  selectedSeats,
                  boardingPoint: selectedBoarding,
                  droppingPoint: selectedDropping,
                  totalPrice
                });
              }}
            >
              Continue to Passenger Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
