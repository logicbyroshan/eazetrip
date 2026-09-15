import { Filter, RotateCcw, Sunrise, Sun, Sunset, Moon, Bus } from 'lucide-react';

export default function BusFilters({
  selectedOperators = [],
  onToggleOperator,
  acOnly = false,
  onToggleAcOnly,
  sleeperOnly = false,
  onToggleSleeperOnly,
  selectedTimeSlot,
  onSelectTimeSlot,
  maxPrice = 3000,
  currentMaxPrice = 3000,
  onChangeMaxPrice,
  onResetFilters
}) {
  const timeSlots = [
    { id: 'earlyMorning', label: 'Before 6 AM', sub: '00:00 - 06:00', icon: Sunrise },
    { id: 'morning', label: '6 AM - 12 PM', sub: '06:00 - 12:00', icon: Sun },
    { id: 'afternoon', label: '12 PM - 6 PM', sub: '12:00 - 18:00', icon: Sunset },
    { id: 'evening', label: 'After 6 PM', sub: '18:00 - 24:00', icon: Moon }
  ];

  const popularOperators = [
    'Orange Travels',
    'Zingbus Plus',
    'IntrCity SmartBus',
    'NueGo Electric',
    'VRL Travels',
    'SRS Travels'
  ];

  return (
    <div className="filter-sidebar">
      {/* Header */}
      <div className="filter-header">
        <div className="filter-title">
          <Filter size={18} />
          <h3>Filter Buses</h3>
        </div>
        <button type="button" className="reset-btn" onClick={onResetFilters}>
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Max Price Slider */}
      <div className="filter-group">
        <h4>Max Ticket Price: ₹{currentMaxPrice.toLocaleString('en-IN')}</h4>
        <input
          type="range"
          min="400"
          max={maxPrice}
          step="100"
          value={currentMaxPrice}
          onChange={(e) => onChangeMaxPrice(Number(e.target.value))}
          className="price-range-slider"
        />
        <div className="slider-labels">
          <span>₹400</span>
          <span>₹{maxPrice.toLocaleString('en-IN')}</span>
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
                <Icon size={18} />
                <span className="slot-title">{slot.label}</span>
                <span className="slot-sub">{slot.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bus Types */}
      <div className="filter-group">
        <h4>Bus Type</h4>
        <div className="checkbox-stack">
          <label className="filter-checkbox-row">
            <input
              type="checkbox"
              checked={acOnly}
              onChange={(e) => onToggleAcOnly(e.target.checked)}
            />
            <span>AC / Volvo Buses Only</span>
          </label>
          <label className="filter-checkbox-row">
            <input
              type="checkbox"
              checked={sleeperOnly}
              onChange={(e) => onToggleSleeperOnly(e.target.checked)}
            />
            <span>Sleeper / Multi-Axle Berth</span>
          </label>
        </div>
      </div>

      {/* Bus Operators */}
      <div className="filter-group">
        <h4>Bus Operators</h4>
        <div className="checkbox-stack">
          {popularOperators.map((op) => (
            <label key={op} className="filter-checkbox-row">
              <input
                type="checkbox"
                checked={selectedOperators.includes(op)}
                onChange={() => onToggleOperator(op)}
              />
              <span>{op}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
