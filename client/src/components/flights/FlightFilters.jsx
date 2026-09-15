import { RotateCcw, Filter, Sun, Sunrise, Sunset, Moon } from 'lucide-react';

export default function FlightFilters({
  selectedAirlines,
  onToggleAirline,
  selectedStops,
  onToggleStops,
  selectedTimeSlot,
  onSelectTimeSlot,
  maxPrice,
  currentMaxPrice,
  onChangeMaxPrice,
  onResetFilters
}) {
  const airlinesList = [
    { name: 'IndiGo', code: '6E', color: '#0052cc' },
    { name: 'Air India', code: 'AI', color: '#d6001c' },
    { name: 'Akasa Air', code: 'QP', color: '#ff6200' },
    { name: 'SpiceJet', code: 'SG', color: '#ec1c24' }
  ];

  const timeSlots = [
    { id: 'earlyMorning', label: 'Before 6 AM', icon: Moon },
    { id: 'morning', label: '6 AM - 12 PM', icon: Sunrise },
    { id: 'afternoon', label: '12 PM - 6 PM', icon: Sun },
    { id: 'evening', label: 'After 6 PM', icon: Sunset }
  ];

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <div className="filter-title">
          <Filter size={18} />
          <h3>Filter Flights</h3>
        </div>
        <button type="button" className="reset-btn" onClick={onResetFilters}>
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Price Slider */}
      <div className="filter-group">
        <h4>Max Price: ₹{currentMaxPrice.toLocaleString('en-IN')}</h4>
        <input
          type="range"
          min="3000"
          max={maxPrice || 10000}
          step="200"
          value={currentMaxPrice}
          onChange={(e) => onChangeMaxPrice(Number(e.target.value))}
          className="price-range-slider"
        />
        <div className="slider-labels">
          <span>₹3,000</span>
          <span>₹{(maxPrice || 10000).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Stops */}
      <div className="filter-group">
        <h4>Stops</h4>
        <div className="checkbox-stack">
          <label className="filter-checkbox-row">
            <input
              type="checkbox"
              checked={selectedStops.includes(0)}
              onChange={() => onToggleStops(0)}
            />
            <span>Non-stop flights</span>
          </label>
          <label className="filter-checkbox-row">
            <input
              type="checkbox"
              checked={selectedStops.includes(1)}
              onChange={() => onToggleStops(1)}
            />
            <span>1 Stop</span>
          </label>
        </div>
      </div>

      {/* Departure Time Slots */}
      <div className="filter-group">
        <h4>Departure Time</h4>
        <div className="time-slot-grid">
          {timeSlots.map((slot) => {
            const Icon = slot.icon;
            const isSelected = selectedTimeSlot === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                className={`time-slot-btn ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectTimeSlot(isSelected ? null : slot.id)}
              >
                <Icon size={16} />
                <small>{slot.label}</small>
              </button>
            );
          })}
        </div>
      </div>

      {/* Airlines */}
      <div className="filter-group">
        <h4>Airlines</h4>
        <div className="checkbox-stack">
          {airlinesList.map((airline) => (
            <label key={airline.name} className="filter-checkbox-row">
              <input
                type="checkbox"
                checked={selectedAirlines.includes(airline.name)}
                onChange={() => onToggleAirline(airline.name)}
              />
              <span className="airline-filter-label">
                <span
                  className="airline-dot"
                  style={{ backgroundColor: airline.color }}
                ></span>
                {airline.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
