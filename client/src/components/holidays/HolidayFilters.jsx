import { Filter, RotateCcw, Palmtree, MapPin, Compass, Check } from 'lucide-react';
import { holidayThemes } from '../../data/holidayData';

export default function HolidayFilters({
  selectedCategory,
  onSelectCategory,
  selectedTheme,
  onSelectTheme,
  selectedDuration,
  onSelectDuration,
  maxPrice,
  currentMaxPrice,
  onChangeMaxPrice,
  onResetFilters
}) {
  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <div className="filter-title">
          <Filter size={18} />
          <h3>Filter Packages</h3>
        </div>
        <button
          type="button"
          className="reset-btn"
          onClick={onResetFilters}
          title="Reset all filters"
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* 1. Destination Category */}
      <div className="filter-group">
        <h4>Destination Category</h4>
        <div className="filter-pills-row">
          {['All', 'Domestic', 'International'].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Package Themes */}
      <div className="filter-group">
        <h4>Holiday Theme</h4>
        <div className="checkbox-stack">
          {holidayThemes.map((theme) => {
            const isSelected = selectedTheme === theme;
            return (
              <label key={theme} className="filter-checkbox-row">
                <input
                  type="radio"
                  name="themeFilter"
                  checked={isSelected}
                  onChange={() => onSelectTheme(theme)}
                />
                <span>{theme}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Duration */}
      <div className="filter-group">
        <h4>Trip Duration</h4>
        <div className="checkbox-stack">
          {[
            { id: 'all', label: 'All Durations' },
            { id: 'short', label: '3 - 4 Days (Weekend Getaway)' },
            { id: 'medium', label: '5 - 7 Days (Standard Holiday)' },
            { id: 'long', label: '8+ Days (Grand Tour)' }
          ].map((dur) => {
            const isSelected = selectedDuration === dur.id;
            return (
              <label key={dur.id} className="filter-checkbox-row">
                <input
                  type="radio"
                  name="durationFilter"
                  checked={isSelected}
                  onChange={() => onSelectDuration(dur.id)}
                />
                <span>{dur.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Budget Slider */}
      <div className="filter-group">
        <h4>Budget per Person: ₹{currentMaxPrice.toLocaleString('en-IN')}</h4>
        <input
          type="range"
          min={10000}
          max={maxPrice || 60000}
          step={2000}
          value={currentMaxPrice}
          onChange={(e) => onChangeMaxPrice(Number(e.target.value))}
          className="price-range-slider"
        />
        <div className="slider-labels">
          <span>₹10,000</span>
          <span>₹{(maxPrice || 60000).toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}
