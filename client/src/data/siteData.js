export const HERO_BACKDROPS = {
  flights: {
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&auto=format&fit=crop&q=85',
    title: 'Affordable Travel Options At Your Fingertips.',
    subtitle: 'Book Flights, Hotels, Buses & Train tickets with instant confirmation and great savings.'
  },
  hotels: {
    url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&auto=format&fit=crop&q=85',
    title: 'Experience Dream Stays & Luxury Escapes.',
    subtitle: 'Handpicked luxury resorts, heritage palaces, and boutique villas across India.'
  },
  bus: {
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&auto=format&fit=crop&q=85',
    title: 'Scenic Road Trips & Comfortable Intercity Travel.',
    subtitle: 'AC Sleeper, Volvo & Bharat Benz buses with live GPS tracking and comfortable berths.'
  },
  railway: {
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&auto=format&fit=crop&q=85',
    title: 'Journey Across India with Scenic Railways.',
    subtitle: 'IRCTC authorized train bookings, live PNR status & guaranteed confirmation alerts.'
  }
};

export const siteOffers = [
  {
    id: 1,
    title: 'Take Off with Big Savings',
    description: 'Fly smarter and save big! Use code EAZETRIP to get up to ₹1,500 off on domestic flight bookings.',
    category: 'Flights',
    code: 'EAZETRIP',
    discount: 'Up to ₹1,500 OFF',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&auto=format&fit=crop&q=80',
    validTill: '31 Dec 2026'
  },
  {
    id: 2,
    title: 'Exclusive Luxury Hotel Deals',
    description: 'Get Flat 20% off on 4-star and 5-star hotel stays across Goa, Jaipur, and Udaipur with instant confirmation.',
    category: 'Hotels',
    code: 'STAYEAZY',
    discount: 'Flat 20% OFF',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=80',
    validTill: '31 Dec 2026'
  },
  {
    id: 3,
    title: 'Intercity Bus Bonanza',
    description: 'Save up to ₹250 on Sleeper & Semi-Sleeper bus bookings across top routes in India.',
    category: 'Buses',
    code: 'BUSEAZ',
    discount: 'Up to ₹250 OFF',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=80',
    validTill: '31 Dec 2026'
  },
  {
    id: 4,
    title: 'Special Railway Fast Track Booking',
    description: 'Zero convenience fee on your first train ticket booking with instant PNR status updates.',
    category: 'Railway',
    code: 'TRAINEAZ',
    discount: 'Zero Convenience Fee',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=500&auto=format&fit=crop&q=80',
    validTill: '31 Dec 2026'
  }
];

export const siteFaqs = [
  {
    category: 'Flights',
    items: [
      {
        q: 'How do I book a flight on EazeTrip?',
        a: 'Simply select your trip type (One-Way, Round-Trip, or Multi-City), enter origin and destination airports, choose your travel dates, passenger counts, and click SEARCH. Filter flights according to your schedule and book in a few clicks.'
      },
      {
        q: 'What is the standard baggage allowance for domestic flights?',
        a: 'Most economy domestic flights in India include 15 kg check-in baggage and 7 kg cabin baggage per passenger, except Air India which generally offers 20 kg check-in baggage.'
      },
      {
        q: 'Can I do web check-in directly through the website?',
        a: 'Yes, web check-in opens 48 hours prior to domestic flight departures. You can visit the airline link or manage your booking directly under Manage Bookings.'
      }
    ]
  },
  {
    category: 'Hotels',
    items: [
      {
        q: 'What are the standard check-in and check-out times for hotels?',
        a: 'Standard hotel check-in time across India is usually 12:00 PM or 2:00 PM, and check-out is 11:00 AM. Early check-in or late check-out is subject to property availability.'
      },
      {
        q: 'Can I cancel my hotel reservation for free?',
        a: 'Free cancellation depends on the property and the specific rate selected. Listings with "Free Cancellation" badges allow zero cancellation charges up to 24-48 hours before check-in.'
      }
    ]
  },
  {
    category: 'Buses & Trains',
    items: [
      {
        q: 'How do I select specific seats for bus bookings?',
        a: 'Click on "Select Seats" on any bus card in the search results. Our interactive seat map will display lower and upper deck sleeper and seater berths, with gender-specific and reserved seats clearly indicated.'
      },
      {
        q: 'What are the Tatkal and General quotas in Railway bookings?',
        a: 'General quota is open for booking up to 120 days in advance. Tatkal quota opens 1 day prior to the journey date (10:00 AM for AC classes and 11:00 AM for Non-AC classes).'
      }
    ]
  },
  {
    category: 'Payments & Refunds',
    items: [
      {
        q: 'What payment modes are accepted on EazeTrip?',
        a: 'We support all major payment options including UPI (Google Pay, PhonePe, Paytm, BHIM, QR code), Credit Cards, Debit Cards, Net Banking across 50+ banks, EMI, and Mobile Wallets.'
      },
      {
        q: 'How long do refund disbursements take after cancellation?',
        a: 'Once approved, refunds are credited back to the original payment source within 5 to 7 business days for UPI/Cards, and per airline/operator timeline for offline adjustments.'
      }
    ]
  }
];

export const siteTestimonials = [
  {
    quote: 'Booking flights and hotels through EazeTrip was effortless. Got instant confirmation and the best airfare deal for our Goa trip!',
    author: 'Aarav Sharma',
    city: 'Mumbai',
    service: 'Flights & Hotels'
  },
  {
    quote: 'Orange Travels bus booking experience was smooth. Clean seat layout selection and accurate live tracking.',
    author: 'Sneha Patil',
    city: 'Pune',
    service: 'Bus Booking'
  },
  {
    quote: 'The Manage Bookings portal makes it super simple to download e-tickets and view all itineraries in one dashboard.',
    author: 'Vikram Mehta',
    city: 'New Delhi',
    service: 'Railways & Flights'
  }
];
