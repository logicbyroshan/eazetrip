export const railwayStations = [
  { code: 'NDLS', name: 'New Delhi Railway Station', city: 'New Delhi' },
  { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai' },
  { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai' },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata' },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai' },
  { code: 'SBC', name: 'KSR Bengaluru City', city: 'Bengaluru' },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune' },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad' },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur' },
  { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad' },
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna' },
  { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur' },
  { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow' }
];

export const mockTrains = [
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
    ],
    pantry: 'Available (Food included in fare)',
    cateringOption: true
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
    ],
    pantry: 'Available',
    cateringOption: true
  },
  {
    id: 'TR-22222',
    trainNumber: '22222',
    trainName: 'CSMT Tejas Rajdhani',
    from: 'NDLS',
    fromStation: 'Hazrat Nizamuddin (NZM)',
    to: 'CSMT',
    toStation: 'Mumbai CSMT (CSMT)',
    departureTime: '17:00',
    arrivalTime: '11:15',
    duration: '18h 15m',
    runningDays: ['M', 'T', 'W', 'F', 'S'],
    classes: [
      { code: '1A', name: 'First AC', price: 4890, status: 'AVAILABLE 4', statusType: 'available', probability: '100%' },
      { code: '2A', name: '2 Tier AC', price: 2920, status: 'AVAILABLE 14', statusType: 'available', probability: '100%' },
      { code: '3A', name: '3 Tier AC', price: 2110, status: 'AVAILABLE 22', statusType: 'available', probability: '100%' }
    ],
    pantry: 'Available',
    cateringOption: true
  },
  {
    id: 'TR-12908',
    trainNumber: '12908',
    trainName: 'Maharashtra Sampark Kranti',
    from: 'NDLS',
    fromStation: 'Hazrat Nizamuddin (NZM)',
    to: 'BDTS',
    toStation: 'Bandra Terminus (BDTS)',
    departureTime: '14:30',
    arrivalTime: '07:35',
    duration: '17h 05m',
    runningDays: ['M', 'T', 'F'],
    classes: [
      { code: '2A', name: '2 Tier AC', price: 2450, status: 'AVAILABLE 8', statusType: 'available', probability: '100%' },
      { code: '3A', name: '3 Tier AC', price: 1720, status: 'AVAILABLE 19', statusType: 'available', probability: '100%' },
      { code: 'SL', name: 'Sleeper Class', price: 680, status: 'GNWL 42/WL 18', statusType: 'wl', probability: '68%' }
    ],
    pantry: 'Available',
    cateringOption: false
  }
];
