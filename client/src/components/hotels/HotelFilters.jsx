import { Filter, RotateCcw, Star } from 'lucide-react';

export default function HotelFilters({
  selectedStars,
  onToggleStar,
  freeCancelOnly,
  onToggleFreeCancel,
  breakfastOnly,
  onToggleBreakfast,
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
          <h3>Filter Hotels</h3>
        </div>
        <button type="button" className="reset-btn" onClick={onResetFilters}>
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Max Price */}
      <div className="filter-group">
        <h4>Max Price per Night: ₹{currentMaxPrice.toLocaleString('en-IN')}</h4>
        <input
          type="range"
          min="2000"
          max={maxPrice || 20000}
          step="500"
          value={currentMaxPrice}
          onChange={(e) => onChangeMaxPrice(Number(e.target.value))}
          className="price-range-slider"
        />
        <div className="slider-labels">
          <span>₹2,000</span>
          <span>₹{(maxPrice || 20000).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Star Category */}
      <div className="filter-group">
        <h4>Star Category</h4>
        <div className="checkbox-stack">
          {[5, 4, 3].map((star) => (
            <label key={star} className="filter-checkbox-row">
              <input
                type="checkbox"
                checked={selectedStars.includes(star)}
                onChange={() => onToggleStar(star)}
              />
              <span className="star-filter-label">
                {star} Star Properties ({Array.from({ length: star }).map((_, i) => '★').join('')})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Property Features */}
      <div className="filter-group">
        <h4>Popular Filters</h4>
        <div className="checkbox-stack">
          <label className="filter-checkbox-row">
            <input
              type="checkbox"
              checked={freeCancelOnly}
              onChange={(e) => onToggleFreeCancel(e.target.checked)}
            />
            <span>Free Cancellation</span>
          </label>
          <label className="filter-checkbox-row">
            <input
              type="checkbox"
              checked={breakfastOnly}
              onChange={(e) => onToggleBreakfast(e.target.checked)}
            />
            <span>Breakfast Included</span>
          </label>
        </div>
      </div>
    </div>
  );
}
