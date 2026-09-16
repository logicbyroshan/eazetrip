import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const BookingContext = createContext(null);

const STORAGE_KEY = 'eazetrip_bookings';

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
  },
  {
    id: 'EZ-HL-61902',
    type: 'holiday',
    title: 'Royal Rajasthan & Udaipur Heritage Tour (4N/5D)',
    location: 'Jaipur • Jodhpur • Udaipur, Rajasthan',
    date: '2026-10-18 to 2026-10-22',
    status: 'Confirmed',
    totalAmount: 28499,
    createdAt: '2026-09-08T11:20:00.000Z',
    guests: '2 Adults (Deluxe Package)',
    roomType: 'Heritage Haveli & Palaces',
    passengers: [
      { name: 'Rohit Sharma', gender: 'Male', age: '32', seat: 'Royal Deluxe Suite' },
      { name: 'Pooja Sharma', gender: 'Female', age: '30', seat: 'Royal Deluxe Suite' }
    ],
    pnr: '6EZ9HL',
    bookingRef: 'PKG-RAJ-4491',
    paymentMethod: 'UPI / Google Pay',
    paymentStatus: 'Paid'
  }
];

const initialDemoRefunds = [
  {
    id: 'RFND-10492',
    bookingId: 'EZ-FL-74892',
    pnr: '6EZ9KM',
    customerName: 'Rohit Sharma',
    customerEmail: 'rohit@example.com',
    customerPhone: '+91 9876543210',
    serviceType: 'flight',
    serviceTitle: 'IndiGo (6E-2041) • Mumbai (BOM) → New Delhi (DEL)',
    grossAmount: 4999,
    penaltyAmount: 1200,
    serviceFeeWaiver: 300,
    netRefundAmount: 3799,
    payoutMode: 'wallet',
    payoutDetails: 'Instant EazeWallet Credit (+ ₹289 Bonus Voucher)',
    arnNumber: 'ARN-IND883920194821',
    status: 'Completed',
    statusStep: 4,
    reason: 'Travel schedule changed',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'RFND-20941',
    bookingId: 'EZ-HT-58210',
    pnr: 'GHP-8902',
    customerName: 'Rohit Sharma',
    customerEmail: 'rohit@example.com',
    customerPhone: '+91 9876543210',
    serviceType: 'hotel',
    serviceTitle: 'The Grand Heritage Palace & Spa, Goa (Deluxe Sea View)',
    grossAmount: 8500,
    penaltyAmount: 0,
    serviceFeeWaiver: 500,
    netRefundAmount: 8500,
    payoutMode: 'original_mode',
    payoutDetails: 'Original Payment Source (HDFC Visa Card •••• 4012)',
    arnNumber: 'ARN-HDFC77281940129',
    status: 'In Progress',
    statusStep: 3,
    reason: 'Free cancellation within 48h check-in window',
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    completedAt: null
  }
];

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('exploreeaz_bookings');
      return saved ? JSON.parse(saved) : initialDemoBookings;
    } catch {
      return initialDemoBookings;
    }
  });

  const [activeCheckoutItem, setActiveCheckoutItem] = useState(() => {
    try {
      const saved = sessionStorage.getItem('eazetrip_active_booking');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [bookingDraft, setBookingDraft] = useState(() => {
    try {
      const saved = sessionStorage.getItem('eazetrip_booking_draft');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [refunds, setRefunds] = useState(() => {
    try {
      const saved = localStorage.getItem('eazetrip_refunds');
      return saved ? JSON.parse(saved) : initialDemoRefunds;
    } catch {
      return initialDemoRefunds;
    }
  });

  const [activeTicket, setActiveTicket] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error('Error persisting bookings', e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('eazetrip_refunds', JSON.stringify(refunds));
    } catch (e) {
      console.error('Error persisting refunds', e);
    }
  }, [refunds]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const startCheckout = (item, type) => {
    const enriched = {
      ...item,
      checkoutType: type || item.checkoutType || item.type || 'flight'
    };
    setActiveCheckoutItem(enriched);
    try {
      sessionStorage.setItem('eazetrip_active_booking', JSON.stringify(enriched));
    } catch (e) {
      console.warn('Could not save booking to sessionStorage', e);
    }
  };

  const saveBookingDraft = (draft) => {
    setBookingDraft(draft);
    try {
      sessionStorage.setItem('eazetrip_booking_draft', JSON.stringify(draft));
    } catch (e) {
      console.warn('Could not save draft to sessionStorage', e);
    }
  };

  const closeCheckout = () => {
    setActiveCheckoutItem(null);
    try {
      sessionStorage.removeItem('eazetrip_active_booking');
      sessionStorage.removeItem('eazetrip_booking_draft');
    } catch {}
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
    closeCheckout();
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

  const requestCancellationRefund = async (refundPayload) => {
    let result = null;
    try {
      const res = await api.requestRefund(refundPayload);
      if (res.ok && res.data?.data) {
        result = res.data.data;
      }
    } catch (err) {
      console.warn('Backend refund error, generating local fallback', err);
    }

    if (!result) {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      result = {
        id: `RFND-${randomNum}`,
        bookingId: refundPayload.bookingId,
        pnr: refundPayload.pnr,
        grossAmount: refundPayload.grossAmount || 3000,
        netRefundAmount: refundPayload.netRefundAmount || (refundPayload.grossAmount ? refundPayload.grossAmount - 800 : 2200),
        penaltyAmount: refundPayload.penaltyAmount || 800,
        payoutMode: refundPayload.payoutMode || 'original_mode',
        payoutDetails: refundPayload.payoutDetails || 'Original Payment Source',
        arnNumber: `ARN-EZT${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        status: refundPayload.payoutMode === 'wallet' ? 'Completed' : 'In Progress',
        statusStep: refundPayload.payoutMode === 'wallet' ? 4 : 2,
        reason: refundPayload.reason || 'Travel plans changed',
        createdAt: new Date().toISOString()
      };
    }

    // Update refunds list
    setRefunds((prev) => [result, ...prev.filter((r) => r.id !== result.id)]);

    // Update booking in context
    setBookings((prev) =>
      prev.map((b) =>
        b.id === refundPayload.bookingId || b.pnr === refundPayload.pnr
          ? {
              ...b,
              status: 'Cancelled',
              cancellationReason: refundPayload.reason,
              cancelledAt: new Date().toISOString(),
              refundId: result.id,
              refundStatus: `Refund ${result.status}: ₹${result.netRefundAmount.toLocaleString('en-IN')} via ${result.payoutMode === 'wallet' ? 'EazeWallet' : 'Original Mode'}`
            }
          : b
      )
    );

    showToast(`Cancellation confirmed! Refund #${result.id} initiated.`);
    return result;
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
        refunds,
        activeCheckoutItem,
        bookingDraft,
        activeTicket,
        toastMessage,
        showToast,
        startCheckout,
        saveBookingDraft,
        closeCheckout,
        createBooking,
        cancelBooking,
        requestCancellationRefund,
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
