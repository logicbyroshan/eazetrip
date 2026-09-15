import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const BookingContext = createContext(null);

const STORAGE_KEY = 'exploreeaz_bookings';

const initialDemoBookings = [
  {
    id: 'EZ-FL-74892',
    type: 'flight',
    title: 'Mumbai (BOM) → New Delhi (DEL)',
    airline: 'IndiGo (6E-2041)',
    date: '2026-09-22',
    departureTime: '06:00',
    arrivalTime: '08:15',
    status: 'Confirmed',
    totalAmount: 4999,
    createdAt: '2026-09-14T10:30:00.000Z',
    passengers: [
      { name: 'Rohit Sharma', gender: 'Male', age: '32', seat: '12A' }
    ],
    pnr: '6EZ9KM',
    paymentMethod: 'UPI / Google Pay',
    paymentStatus: 'Paid'
  },
  {
    id: 'EZ-HT-58210',
    type: 'hotel',
    title: 'The Grand Heritage Palace & Spa, Goa',
    location: 'Calangute Beach Road, North Goa',
    date: '2026-10-05 to 2026-10-08',
    status: 'Confirmed',
    totalAmount: 16497,
    createdAt: '2026-09-12T14:15:00.000Z',
    guests: '2 Adults, 1 Room',
    roomType: 'Deluxe Sea View Room',
    passengers: [
      { name: 'Rohit Sharma', email: 'rohit@example.com', phone: '+91 9876543210' }
    ],
    bookingRef: 'GHP-8902',
    paymentMethod: 'Credit Card (HDFC Visa)',
    paymentStatus: 'Paid'
  },
  {
    id: 'EZ-BS-39144',
    type: 'bus',
    title: 'Orange Travels: Pune → Mumbai',
    date: '2026-09-28',
    departureTime: '22:30',
    status: 'Confirmed',
    totalAmount: 799,
    createdAt: '2026-09-10T18:45:00.000Z',
    passengers: [
      { name: 'Rohit Sharma', seat: 'L1 (Lower Sleeper)' }
    ],
    ticketNo: 'OT-984321',
    boardingPoint: 'Swargate (Opp Bus Stand)',
    paymentMethod: 'Paytm Wallet',
    paymentStatus: 'Paid'
  }
];

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialDemoBookings;
    } catch {
      return initialDemoBookings;
    }
  });

  const [activeCheckoutItem, setActiveCheckoutItem] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error('Error persisting bookings', e);
    }
  }, [bookings]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const startCheckout = (item, type) => {
    setActiveCheckoutItem({
      ...item,
      checkoutType: type || item.type || 'flight'
    });
  };

  const closeCheckout = () => {
    setActiveCheckoutItem(null);
  };

  const createBooking = async (bookingData) => {
    let confirmedBooking = null;

    try {
      const apiBooking = await api.createBooking(bookingData);
      if (apiBooking) {
        confirmedBooking = apiBooking;
      }
    } catch (err) {
      console.warn('Backend unavailable, using local booking generator', err);
    }

    if (!confirmedBooking) {
      confirmedBooking = {
        id: `EZ-${(bookingData.type || 'FL').slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
        createdAt: new Date().toISOString(),
        status: 'Confirmed',
        paymentStatus: 'Paid',
        ...bookingData
      };
    }

    setBookings((prev) => [confirmedBooking, ...prev]);
    setActiveCheckoutItem(null);
    setActiveTicket(confirmedBooking);
    showToast(`Booking Confirmed! Booking ID: ${confirmedBooking.id}`);
    return confirmedBooking;
  };

  const cancelBooking = async (bookingId, reason = 'Travel plan changed') => {
    try {
      await api.cancelBooking(bookingId, reason);
    } catch (err) {
      console.warn('Backend unavailable, cancelling locally', err);
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'Cancelled',
              cancellationReason: reason,
              cancelledAt: new Date().toISOString(),
              refundStatus: 'Initiated (Processed in 5-7 days)'
            }
          : b
      )
    );
    showToast(`Booking ${bookingId} has been cancelled. Refund initiated.`);
  };

  const openTicketModal = (booking) => {
    setActiveTicket(booking);
  };

  const closeTicketModal = () => {
    setActiveTicket(null);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        activeCheckoutItem,
        activeTicket,
        toastMessage,
        showToast,
        startCheckout,
        closeCheckout,
        createBooking,
        cancelBooking,
        openTicketModal,
        closeTicketModal
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
