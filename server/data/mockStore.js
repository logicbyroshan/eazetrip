/**
 * Synchronized mock database store for ExploreEase
 */

const flights = [
  {
    id: 'FL-601',
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E-2041',
    from: 'BOM',
    fromCity: 'Mumbai',
    fromAirport: 'Chhatrapati Shivaji Maharaj Intl T2',
    to: 'DEL',
    toCity: 'New Delhi',
    toAirport: 'Indira Gandhi Intl T1',
    departureTime: '06:00',
    arrivalTime: '08:15',
    duration: '2h 15m',
    stops: 0,
    stopText: 'Non-stop',
    basePrice: 4250,
    taxes: 749,
    price: 4999,
    seatsLeft: 9,
    cabinClass: 'Economy',
    baggage: { cabin: '7 Kg (1 piece)', checkin: '15 Kg (1 piece)' },
    cancellationFee: 3000,
    rescheduleFee: 2500,
    mealIncluded: false,
    refundable: true
  },
  {
    id: 'FL-602',
    airline: 'Air India',
    airlineCode: 'AI',
    flightNumber: 'AI-806',
    from: 'BOM',
    fromCity: 'Mumbai',
    fromAirport: 'Chhatrapati Shivaji Maharaj Intl T2',
    to: 'DEL',
    toCity: 'New Delhi',
    toAirport: 'Indira Gandhi Intl T3',
    departureTime: '08:30',
    arrivalTime: '10:45',
    duration: '2h 15m',
    stops: 0,
    stopText: 'Non-stop',
    basePrice: 4700,
    taxes: 850,
    price: 5550,
    seatsLeft: 4,
    cabinClass: 'Economy',
    baggage: { cabin: '7 Kg (1 piece)', checkin: '20 Kg (1 piece)' },
    cancellationFee: 2500,
    rescheduleFee: 2000,
    mealIncluded: true,
    refundable: true
  },
  {
    id: 'FL-603',
    airline: 'Akasa Air',
    airlineCode: 'QP',
    flightNumber: 'QP-1355',
    from: 'BOM',
    fromCity: 'Mumbai',
    to: 'DEL',
    toCity: 'New Delhi',
    departureTime: '11:15',
    arrivalTime: '13:35',
    duration: '2h 20m',
    stops: 0,
    stopText: 'Non-stop',
    basePrice: 3890,
    taxes: 709,
    price: 4599,
    seatsLeft: 12,
    cabinClass: 'Economy',
    baggage: { cabin: '7 Kg (1 piece)', checkin: '15 Kg (1 piece)' },
    cancellationFee: 3500,
    rescheduleFee: 2750,
    mealIncluded: false,
    refundable: true
  },
  {
    id: 'FL-604',
    airline: 'SpiceJet',
    airlineCode: 'SG',
    flightNumber: 'SG-8169',
    from: 'BOM',
    fromCity: 'Mumbai',
    to: 'DEL',
    toCity: 'New Delhi',
    departureTime: '15:20',
    arrivalTime: '17:40',
    duration: '2h 20m',
    stops: 0,
    stopText: 'Non-stop',
    basePrice: 4100,
    taxes: 750,
    price: 4850,
    seatsLeft: 6,
    cabinClass: 'Economy',
    baggage: { cabin: '7 Kg (1 piece)', checkin: '15 Kg (1 piece)' },
    cancellationFee: 3200,
    rescheduleFee: 2600,
    mealIncluded: false,
    refundable: true
  },
  {
    id: 'FL-605',
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E-5324',
    from: 'BOM',
    fromCity: 'Mumbai',
    to: 'DEL',
    toCity: 'New Delhi',
    departureTime: '19:45',
    arrivalTime: '22:00',
    duration: '2h 15m',
    stops: 0,
    stopText: 'Non-stop',
    basePrice: 4500,
    taxes: 799,
    price: 5299,
    seatsLeft: 3,
    cabinClass: 'Economy',
    baggage: { cabin: '7 Kg (1 piece)', checkin: '15 Kg (1 piece)' },
    cancellationFee: 3000,
    rescheduleFee: 2500,
    mealIncluded: false,
    refundable: true
  }
];

const hotels = [
  {
    id: 'HT-101',
    name: 'The Grand Heritage Palace & Spa',
    city: 'Goa',
    location: 'Calangute Beach Road, North Goa',
    starRating: 5,
    userRating: 4.8,
    reviewsCount: 1420,
    pricePerNight: 5499,
    originalPrice: 8999,
    roomType: 'Deluxe Sea View Room with Balcony',
    amenities: ['Free WiFi', 'Swimming Pool', 'Free Breakfast', 'Air Conditioning', 'Beach Access', 'Spa & Wellness'],
    freeCancellation: true,
    breakfastIncluded: true,
    taxes: 660
  },
  {
    id: 'HT-102',
    name: 'Ocean Breeze Resort & Suites',
    city: 'Goa',
    location: 'Candolim Beach, North Goa',
    starRating: 4,
    userRating: 4.5,
    reviewsCount: 890,
    pricePerNight: 3899,
    originalPrice: 6000,
    roomType: 'Premium Pool View Suite',
    amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant', 'Air Conditioning', 'Bar/Lounge'],
    freeCancellation: true,
    breakfastIncluded: false,
    taxes: 468
  },
  {
    id: 'HT-103',
    name: 'Radisson Blu Plaza Hotel',
    city: 'New Delhi',
    location: 'Near IGI Airport, Mahipalpur, New Delhi',
    starRating: 5,
    userRating: 4.7,
    reviewsCount: 2310,
    pricePerNight: 6999,
    originalPrice: 11000,
    roomType: 'Superior King Room with Airport Shuttle',
    amenities: ['Free Airport Transfer', 'Free WiFi', 'Fitness Center', 'Spa', 'Fine Dining Buffet'],
    freeCancellation: true,
    breakfastIncluded: true,
    taxes: 840
  },
  {
    id: 'HT-104',
    name: 'The Taj Mahal Palace & Tower',
    city: 'Mumbai',
    location: 'Apollo Bunder, Colaba, Mumbai',
    starRating: 5,
    userRating: 4.9,
    reviewsCount: 4500,
    pricePerNight: 14500,
    originalPrice: 19500,
    roomType: 'Luxury Heritage Gateway Suite',
    amenities: ['Sea View', 'Iconic Heritage', 'Free High Speed WiFi', 'Infinity Pool', 'Butler Service'],
    freeCancellation: false,
    breakfastIncluded: true,
    taxes: 1740
  },
  {
    id: 'HT-105',
    name: 'Royal Heritage Haveli',
    city: 'Jaipur',
    location: 'Khatipura, Jaipur, Rajasthan',
    starRating: 4,
    userRating: 4.6,
    reviewsCount: 650,
    pricePerNight: 3299,
    originalPrice: 5200,
    roomType: 'Royal Maharaja Room',
    amenities: ['Free WiFi', 'Heritage Architecture', 'Rooftop Dining', 'Folk Music Evenings', 'Air Conditioning'],
    freeCancellation: true,
    breakfastIncluded: true,
    taxes: 395
  }
];

const buses = [
  {
    id: 'BUS-301',
    operator: 'Orange Travels',
    busType: 'Bharat Benz A/C Sleeper (2+1)',
    rating: 4.8,
    reviewsCount: 540,
    from: 'Pune',
    to: 'Mumbai',
    departureTime: '22:30',
    arrivalTime: '02:45',
    duration: '4h 15m',
    departureLocation: 'Swargate, Pune',
    dropLocation: 'Dadar TT Circle, Mumbai',
    price: 799,
    originalPrice: 999,
    seatsAvailable: 14,
    liveTracking: true,
    amenities: ['Charging Point', 'Water Bottle', 'Blanket', 'Reading Light', 'Emergency Exit']
  },
  {
    id: 'BUS-302',
    operator: 'Zingbus Plus',
    busType: 'Volvo 9600 Multi-Axle A/C Sleeper',
    rating: 4.7,
    reviewsCount: 380,
    from: 'Pune',
    to: 'Mumbai',
    departureTime: '23:45',
    arrivalTime: '04:15',
    duration: '4h 30m',
    departureLocation: 'Hinjewadi Phase 1, Pune',
    dropLocation: 'Borivali West, Mumbai',
    price: 949,
    originalPrice: 1200,
    seatsAvailable: 8,
    liveTracking: true,
    amenities: ['High Speed WiFi', 'Live GPS Tracking', 'Snack Box', 'Water Bottle', 'Pillow']
  },
  {
    id: 'BUS-303',
    operator: 'IntrCity SmartBus',
    busType: 'Scania Multi-Axle Semi-Sleeper (2+2)',
    rating: 4.6,
    reviewsCount: 710,
    from: 'Pune',
    to: 'Mumbai',
    departureTime: '06:00',
    arrivalTime: '09:45',
    duration: '3h 45m',
    departureLocation: 'Pune Railway Station',
    dropLocation: 'Sion Circle, Mumbai',
    price: 649,
    originalPrice: 850,
    seatsAvailable: 22,
    liveTracking: true,
    amenities: ['Air Conditioning', 'Reclining Seats', 'Charging Port', 'Sanitized Cabins']
  }
];

const railways = [
  {
    id: 'TR-12952',
    trainNumber: '12952',
    trainName: 'Mumbai Rajdhani Express',
    from: 'NDLS',
    fromStation: 'New Delhi (NDLS)',
    to: 'BCT',
    toStation: 'Mumbai Central (BCT)',
    departureTime: '16:55',
    arrivalTime: '08:35',
    duration: '15h 40m',
    runningDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    classes: [
      { code: '1A', name: 'First AC', price: 4750, status: 'AVAILABLE 12', statusType: 'available', probability: '100%' },
      { code: '2A', name: '2 Tier AC', price: 2850, status: 'AVAILABLE 28', statusType: 'available', probability: '100%' },
      { code: '3A', name: '3 Tier AC', price: 2050, status: 'RAC 4 / WL 12', statusType: 'rac', probability: '85%' },
      { code: '3E', name: '3 AC Economy', price: 1890, status: 'AVAILABLE 45', statusType: 'available', probability: '100%' }
    ]
  },
  {
    id: 'TR-12954',
    trainNumber: '12954',
    trainName: 'August Kranti Rajdhani',
    from: 'NDLS',
    fromStation: 'Hazrat Nizamuddin (NZM)',
    to: 'BCT',
    toStation: 'Mumbai Central (BCT)',
    departureTime: '17:15',
    arrivalTime: '10:05',
    duration: '16h 50m',
    runningDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    classes: [
      { code: '1A', name: 'First AC', price: 4620, status: 'AVAILABLE 6', statusType: 'available', probability: '100%' },
      { code: '2A', name: '2 Tier AC', price: 2790, status: 'AVAILABLE 18', statusType: 'available', probability: '100%' },
      { code: '3A', name: '3 Tier AC', price: 1990, status: 'AVAILABLE 34', statusType: 'available', probability: '100%' }
    ]
  }
];

const offers = [
  { id: 1, title: 'Take Off with Big Savings', code: 'EAZETRIP', discount: 'Flat ₹500 OFF', category: 'Flights' },
  { id: 2, title: 'Mega Explorer Discount', code: 'EAZETRIP1000', discount: 'Up to ₹1,000 OFF', category: 'Flights' },
  { id: 3, title: 'Exclusive Luxury Hotel Deals', code: 'STAYEAZY', discount: 'Flat 20% OFF', category: 'Hotels' },
  { id: 4, title: 'Intercity Bus Bonanza', code: 'BUSEAZ', discount: 'Up to ₹300 OFF', category: 'Buses' },
  { id: 5, title: 'Special Railway Fast Track', code: 'TRAINEAZ', discount: 'Zero Surcharge', category: 'Railway' },
  { id: 6, title: 'ExploreEaz Legacy Savings', code: 'EXPLOREEAZ', discount: 'Flat ₹500 OFF', category: 'Universal' }
];

const faqs = [
  {
    category: 'Flights',
    items: [
      { q: 'How do I book a flight on ExploreEase?', a: 'Choose your route, dates, and passengers, then proceed to book.' },
      { q: 'What is the standard baggage allowance?', a: '15 kg check-in and 7 kg cabin baggage on standard domestic flights.' }
    ]
  },
  {
    category: 'Hotels',
    items: [
      { q: 'Can I cancel my hotel booking for free?', a: 'Yes, properties marked with Free Cancellation allow penalty-free refunds.' }
    ]
  }
];

const bookings = [
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
    passengers: [{ name: 'Rohit Sharma', gender: 'Male', age: '32', seat: '12A' }],
    pnr: '6EZ9KM',
    paymentMethod: 'UPI / Google Pay',
    paymentStatus: 'Paid'
  }
];

module.exports = {
  flights,
  hotels,
  buses,
  railways,
  offers,
  faqs,
  bookings
};
