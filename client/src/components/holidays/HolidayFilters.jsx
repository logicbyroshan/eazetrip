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
    <div className="filters-card holiday-filters-card">
      <div className="filters-header">
        <div className="title-with-icon">
          <Filter size={18} color="#034ea2" />
          <h3>Filter Packages</h3>
        </div>
        <button
          type="button"
          className="reset-filters-btn"
          onClick={onResetFilters}
          title="Reset all filters"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* 1. Destination Type */}
      <div className="filter-section">
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
      <div className="filter-section">
        <h4>Holiday Theme</h4>
        <div className="checkbox-stack">
          {holidayThemes.map((theme) => {
            const isSelected = selectedTheme === theme;
            return (
              <label key={theme} className="custom-checkbox-row">
                <input
                  type="radio"
                  name="themeFilter"
                  checked={isSelected}
                  onChange={() => onSelectTheme(theme)}
                />
                <span className="checkbox-box">{isSelected && <Check size={12} />}</span>
                <span className="checkbox-label">{theme}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Duration */}
      <div className="filter-section">
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
              <label key={dur.id} className="custom-checkbox-row">
                <input
                  type="radio"
                  name="durationFilter"
                  checked={isSelected}
                  onChange={() => onSelectDuration(dur.id)}
                />
                <span className="checkbox-box">{isSelected && <Check size={12} />}</span>
                <span className="checkbox-label">{dur.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Budget Slider */}
      <div className="filter-section">
        <div className="slider-header">
          <h4>Budget per Person</h4>
          <strong>₹{currentMaxPrice.toLocaleString('en-IN')}</strong>
        </div>
        <input
          type="range"
          min={10000}
          max={maxPrice}
          step={2000}
          value={currentMaxPrice}
          onChange={(e) => onChangeMaxPrice(Number(e.target.value))}
          className="budget-range-slider"
        />
        <div className="slider-limits">
          <span>₹10,000</span>
          <span>₹{maxPrice.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}
