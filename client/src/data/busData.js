export const busCities = [
  'Pune', 'Mumbai', 'Nagpur', 'Hyderabad', 'Bengaluru', 'Delhi', 'Ahmedabad', 'Surat', 'Indore', 'Bhopal', 'Jaipur', 'Goa', 'Chennai'
];

export const mockBuses = [
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
    amenities: ['Charging Point', 'Water Bottle', 'Blanket', 'Reading Light', 'Emergency Exit'],
    boardingPoints: [
      { location: 'Swargate (Opp Bus Stand)', time: '22:30' },
      { location: 'Wakad Bridge', time: '23:15' },
      { location: 'Nigdi Toll Plaza', time: '23:45' }
    ],
    droppingPoints: [
      { location: 'Vashi Plaza', time: '02:00' },
      { location: 'Chembur Naka', time: '02:25' },
      { location: 'Dadar TT Circle', time: '02:45' }
    ],
    seats: [
      { id: 'L1', deck: 'lower', number: '1', type: 'sleeper', price: 799, isBooked: false, isLadies: false },
      { id: 'L2', deck: 'lower', number: '2', type: 'sleeper', price: 799, isBooked: true, isLadies: false },
      { id: 'L3', deck: 'lower', number: '3', type: 'sleeper', price: 799, isBooked: false, isLadies: true },
      { id: 'L4', deck: 'lower', number: '4', type: 'sleeper', price: 799, isBooked: false, isLadies: true },
      { id: 'L5', deck: 'lower', number: '5', type: 'sleeper', price: 799, isBooked: false, isLadies: false },
      { id: 'L6', deck: 'lower', number: '6', type: 'sleeper', price: 799, isBooked: true, isLadies: false },
      { id: 'U1', deck: 'upper', number: 'U1', type: 'sleeper', price: 899, isBooked: false, isLadies: false },
      { id: 'U2', deck: 'upper', number: 'U2', type: 'sleeper', price: 899, isBooked: false, isLadies: false },
      { id: 'U3', deck: 'upper', number: 'U3', type: 'sleeper', price: 899, isBooked: true, isLadies: false },
      { id: 'U4', deck: 'upper', number: 'U4', type: 'sleeper', price: 899, isBooked: false, isLadies: false },
      { id: 'U5', deck: 'upper', number: 'U5', type: 'sleeper', price: 899, isBooked: false, isLadies: true },
      { id: 'U6', deck: 'upper', number: 'U6', type: 'sleeper', price: 899, isBooked: false, isLadies: false }
    ]
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
    amenities: ['High Speed WiFi', 'Live GPS Tracking', 'Snack Box', 'Water Bottle', 'Pillow'],
    boardingPoints: [
      { location: 'Hinjewadi Flyover', time: '23:45' },
      { location: 'Baner Balewadi', time: '00:10' }
    ],
    droppingPoints: [
      { location: 'Vashi Highway', time: '03:15' },
      { location: 'Andheri East Flyover', time: '03:45' },
      { location: 'Borivali National Park', time: '04:15' }
    ],
    seats: [
      { id: 'L1', deck: 'lower', number: '1', type: 'sleeper', price: 949, isBooked: false, isLadies: false },
      { id: 'L2', deck: 'lower', number: '2', type: 'sleeper', price: 949, isBooked: false, isLadies: false },
      { id: 'L3', deck: 'lower', number: '3', type: 'sleeper', price: 949, isBooked: true, isLadies: false },
      { id: 'U1', deck: 'upper', number: 'U1', type: 'sleeper', price: 999, isBooked: false, isLadies: false },
      { id: 'U2', deck: 'upper', number: 'U2', type: 'sleeper', price: 999, isBooked: false, isLadies: true }
    ]
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
    amenities: ['Air Conditioning', 'Reclining Seats', 'Charging Port', 'Sanitized Cabins'],
    boardingPoints: [
      { location: 'Pune Station Private Stand', time: '06:00' },
      { location: 'Aundh Parihar Chowk', time: '06:30' }
    ],
    droppingPoints: [
      { location: 'CBD Belapur', time: '08:45' },
      { location: 'Sion Circle', time: '09:45' }
    ],
    seats: [
      { id: 'S1', deck: 'lower', number: '1', type: 'seater', price: 649, isBooked: false, isLadies: false },
      { id: 'S2', deck: 'lower', number: '2', type: 'seater', price: 649, isBooked: false, isLadies: false },
      { id: 'S3', deck: 'lower', number: '3', type: 'seater', price: 649, isBooked: false, isLadies: true },
      { id: 'S4', deck: 'lower', number: '4', type: 'seater', price: 649, isBooked: true, isLadies: false }
    ]
  }
];
