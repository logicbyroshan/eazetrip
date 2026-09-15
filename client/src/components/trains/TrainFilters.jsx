import { Filter, RotateCcw, Sunrise, Sun, Sunset, Moon, Train } from 'lucide-react';

export default function TrainFilters({
  selectedClasses = [],
  onToggleClass,
  selectedTrainTypes = [],
  onToggleTrainType,
  selectedTimeSlot,
  onSelectTimeSlot,
  maxPrice = 6000,
  currentMaxPrice = 6000,
  onChangeMaxPrice,
  onResetFilters
}) {
  const timeSlots = [
    { id: 'earlyMorning', label: 'Before 6 AM', sub: '00:00 - 06:00', icon: Sunrise },
    { id: 'morning', label: '6 AM - 12 PM', sub: '06:00 - 12:00', icon: Sun },
    { id: 'afternoon', label: '12 PM - 6 PM', sub: '12:00 - 18:00', icon: Sunset },
    { id: 'evening', label: 'After 6 PM', sub: '18:00 - 24:00', icon: Moon }
  ];

  const trainClasses = [
    { code: '1A', name: 'First AC (1A)' },
    { code: '2A', name: 'Second AC (2A)' },
    { code: '3A', name: 'Third AC (3A)' },
    { code: '3E', name: 'AC 3 Economy (3E)' },
    { code: 'SL', name: 'Sleeper (SL)' },
    { code: 'CC', name: 'AC Chair Car (CC)' },
    { code: 'EC', name: 'Exec. Chair Car (EC)' }
  ];

  const trainTypes = [
    'Rajdhani Express',
    'Vande Bharat',
    'Shatabdi Express',
    'Superfast Express',
    'Duronto Express',
    'Mail / Express'
  ];

  return (
    <div className="filter-sidebar">
      {/* Header */}
      <div className="filter-header">
        <div className="filter-title">
          <Filter size={18} />
          <h3>Filter Trains</h3>
        </div>
        <button type="button" className="reset-btn" onClick={onResetFilters}>
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Max Fare Range */}
      <div className="filter-group">
        <h4>Max Base Fare: ₹{currentMaxPrice.toLocaleString('en-IN')}</h4>
        <input
          type="range"
          min="500"
          max={maxPrice}
          step="250"
          value={currentMaxPrice}
          onChange={(e) => onChangeMaxPrice(Number(e.target.value))}
          className="price-range-slider"
        />
        <div className="slider-labels">
          <span>₹500</span>
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

      {/* Journey Class */}
      <div className="filter-group">
        <h4>Journey Class</h4>
        <div className="checkbox-stack">
          {trainClasses.map((cls) => (
            <label key={cls.code} className="filter-checkbox-row">
              <input
                type="checkbox"
                checked={selectedClasses.includes(cls.code)}
                onChange={() => onToggleClass(cls.code)}
              />
              <span>{cls.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Train Type */}
      <div className="filter-group">
        <h4>Train Type</h4>
        <div className="checkbox-stack">
          {trainTypes.map((type) => (
            <label key={type} className="filter-checkbox-row">
              <input
                type="checkbox"
                checked={selectedTrainTypes.includes(type)}
                onChange={() => onToggleTrainType(type)}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
