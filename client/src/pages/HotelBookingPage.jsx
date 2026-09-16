import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HotelSearchWidget from '../components/search/HotelSearchWidget';
import HotelCard from '../components/hotels/HotelCard';
import HotelFilters from '../components/hotels/HotelFilters';
import { mockHotels } from '../data/hotelData';
import { HERO_BACKDROPS } from '../data/siteData';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Building2 } from 'lucide-react';

export default function HotelBookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchState = location.state || {};
  const { startCheckout } = useBooking();
  const { user, firstName } = useAuth();

  const [selectedStars, setSelectedStars] = useState([]);
  const [freeCancelOnly, setFreeCancelOnly] = useState(false);
  const [breakfastOnly, setBreakfastOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(20000);

  const filteredHotels = useMemo(() => {
    return mockHotels.filter((hotel) => {
      if (selectedStars.length > 0 && !selectedStars.includes(hotel.starRating)) {
        return false;
      }
      if (freeCancelOnly && !hotel.freeCancellation) {
        return false;
      }
      if (breakfastOnly && !hotel.breakfastIncluded) {
        return false;
      }
      if (hotel.pricePerNight > maxPrice) {
        return false;
      }
      return true;
    });
  }, [selectedStars, freeCancelOnly, breakfastOnly, maxPrice]);

  const handleToggleStar = (star) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  };

  const handleReset = () => {
    setSelectedStars([]);
    setFreeCancelOnly(false);
    setBreakfastOnly(false);
    setMaxPrice(20000);
  };

  const handleBookHotel = (hotel) => {
    const item = {
      ...hotel,
      checkoutType: 'hotel',
      price: hotel.pricePerNight,
      taxes: hotel.taxes,
      checkInDate: searchState.checkInDate || '2026-10-05',
      checkOutDate: searchState.checkOutDate || '2026-10-08',
      guests: `${searchState.adults || 2} Adults, ${searchState.rooms || 1} Room`
    };
    startCheckout(item, 'hotel');
    navigate('/review-booking', { state: { item } });
  };

  return (
    <div className="listing-page-wrapper">
      <div
        className="listing-top-search-banner"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(10, 25, 47, 0.82) 0%, rgba(17, 34, 64, 0.88) 100%), url('${HERO_BACKDROPS.hotels.url}')`
        }}
      >
        <div className="container">
          <div className="listing-search-card-wrapper">
            <HotelSearchWidget initialValues={searchState} />
          </div>
        </div>
      </div>

      <div className="container listing-content-layout">
        <aside className="listing-sidebar">
          <HotelFilters
            selectedStars={selectedStars}
            onToggleStar={handleToggleStar}
            freeCancelOnly={freeCancelOnly}
            onToggleFreeCancel={setFreeCancelOnly}
            breakfastOnly={breakfastOnly}
            onToggleBreakfast={setBreakfastOnly}
            maxPrice={20000}
            currentMaxPrice={maxPrice}
            onChangeMaxPrice={setMaxPrice}
            onResetFilters={handleReset}
          />
        </aside>

        <main className="listing-results-col">
          <div className="results-header-bar">
            <div>
              <h2>{firstName ? `Luxury Stays Handpicked for ${firstName}` : `Hotels & Stays in ${searchState.city || 'Goa'}`}</h2>
              <span className="results-count">
                {firstName
                  ? `Member perks & complimentary upgrades for ${firstName} • Showing ${filteredHotels.length} verified properties in ${searchState.city || 'Goa'}`
                  : `Showing ${filteredHotels.length} luxury & verified properties`}
              </span>
            </div>
          </div>

          <div className="hotel-cards-list">
            {filteredHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onBook={handleBookHotel}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
