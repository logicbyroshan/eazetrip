import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import TrainSearchWidget from '../components/search/TrainSearchWidget';
import TrainCard from '../components/trains/TrainCard';
import { mockTrains } from '../data/trainData';
import { useBooking } from '../context/BookingContext';
import { Train, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function RailwayBookingPage() {
  const location = useLocation();
  const searchState = location.state || {};
  const { startCheckout } = useBooking();

  const handleBookTrainClass = (train, classObj) => {
    startCheckout({
      ...train,
      selectedClass: classObj,
      price: classObj.price,
      travelDate: searchState.travelDate || '2026-09-25'
    }, 'train');
  };

  return (
    <div className="listing-page-wrapper">
      <div className="listing-top-search-banner">
        <div className="container">
          <div className="listing-search-card-wrapper">
            <TrainSearchWidget initialValues={searchState} />
          </div>
        </div>
      </div>

      <div className="container railway-page-layout">
        <div className="irctc-partner-strip">
          <div className="partner-badge">
            <CheckCircle2 size={18} color="#16a34a" />
            <span>IRCTC Authorized Train Ticket Booking Partner</span>
          </div>
          <p>Instant refund on Tatkal cancellations • Zero payment gateway surcharges on UPI</p>
        </div>

        <div className="results-header-bar">
          <div>
            <h2>Trains between {searchState.from || 'New Delhi'} and {searchState.to || 'Mumbai'}</h2>
            <span className="results-count">
              Showing {mockTrains.length} direct express & superfast trains
            </span>
          </div>
        </div>

        <div className="train-cards-list">
          {mockTrains.map((train) => (
            <TrainCard
              key={train.id}
              train={train}
              onBookClass={handleBookTrainClass}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
