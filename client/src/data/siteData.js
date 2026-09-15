export const HERO_BACKDROPS = {
  flights: {
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&auto=format&fit=crop&q=85',
    title: 'Affordable Travel Options At Your Fingertips.',
    subtitle: 'Book Flights, Hotels, Buses & Train tickets with instant confirmation and great savings.'
  },
  hotels: {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=85',
    title: 'Discover Tropical Escapes & Beach Sanctuaries.',
    subtitle: 'Handpicked luxury beach stays, boutique retreats, and heritage villas across dream destinations.'
  },
  bus: {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=85',
    title: 'Journey Through Majestic Mountain Valleys.',
    subtitle: 'AC Sleeper, Volvo & luxury bus routes with live GPS tracking through panoramic routes.'
  },
  railway: {
    url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1920&auto=format&fit=crop&q=85',
    title: 'Traverse Alpine Peaks & Scenic Rail Canyons.',
    subtitle: 'IRCTC authorized train bookings, live PNR status & guaranteed confirmation alerts.'
  },
  holidays: {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=85',
    title: 'Curated Holiday Packages & Dream Vacations.',
    subtitle: 'All-inclusive domestic & international holiday tour packages with flights, luxury stays & sightseeing.'
  }
};

export const specialBankOffers = [
  {
    id: 'bank-1',
    bank: 'AXIS BANK',
    bankLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Axis_Bank_logo.svg/320px-Axis_Bank_logo.svg.png',
    bankTheme: '#97144d',
    title: 'Up to INR 1,500 OFF*',
    category: 'Flights',
    subtitle: 'On Domestic Flights',
    terms: '*Offer applicable on AXIS BANK Credit Card transactions only.',
    code: 'AXISFEST',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&auto=format&fit=crop&q=80',
    link: '/flight-booking'
  },
  {
    id: 'bank-2',
    bank: 'HSBC',
    bankLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/HSBC_logo_%282018%29.svg/320px-HSBC_logo_%282018%29.svg.png',
    bankTheme: '#db0011',
    title: 'Up to INR 3,000 OFF*',
    category: 'Flights',
    subtitle: 'On Domestic & International Flights',
    terms: '*Offer applicable on HSBC Credit Card transactions only.',
    code: 'EAZETRIPHSBC',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&auto=format&fit=crop&q=80',
    link: '/flight-booking'
  },
  {
    id: 'bank-3',
    bank: 'RBL BANK',
    bankLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/RBL_Bank_Logo.svg/320px-RBL_Bank_Logo.svg.png',
    bankTheme: '#1e3a8a',
    title: 'Up to INR 2,500 OFF*',
    category: 'Hotels',
    subtitle: 'On Luxury Hotel Stays & Resorts',
    terms: '*Offer applicable on RBL Bank Credit Card transactions only.',
    code: 'EAZERBL',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80',
    link: '/hotel-booking'
  },
  {
    id: 'bank-4',
    bank: 'HDFC BANK',
    bankLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/320px-HDFC_Bank_Logo.svg.png',
    bankTheme: '#004c8f',
    title: 'Flat 15% OFF*',
    category: 'Hotels',
    subtitle: 'On Premium 4-Star & 5-Star Hotels',
    terms: '*Offer applicable on HDFC Bank Net Banking & Cards.',
    code: 'HDFCEAZ',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
    link: '/hotel-booking'
  },
  {
    id: 'bank-5',
    bank: 'ICICI BANK',
    bankLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/ICICI_Bank_Logo.svg/320px-ICICI_Bank_Logo.svg.png',
    bankTheme: '#b94017',
    title: 'Up to INR 500 OFF*',
    category: 'Buses',
    subtitle: 'On Intercity AC Volvo & Sleeper Buses',
    terms: '*Offer applicable on ICICI Bank Cards & iMobile Pay.',
    code: 'ICICIBUS',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    link: '/bus-booking'
  },
  {
    id: 'bank-6',
    bank: 'SBI CARD',
    bankLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-Logo.svg/320px-SBI-Logo.svg.png',
    bankTheme: '#0072bb',
    title: 'Zero Convenience Fee*',
    category: 'Railway',
    subtitle: 'On Express & Vande Bharat Train Bookings',
    terms: '*Offer applicable on SBI Credit Cards for all IRCTC bookings.',
    code: 'TRAINSBI',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&auto=format&fit=crop&q=80',
    link: '/railway'
  }
];

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

export const trendingDestinations = {
  india: [
    {
      id: 'delhi',
      name: 'New Delhi',
      flag: '🇮🇳',
      tag: 'Heritage & Culture',
      places: '1,420+ properties & daily flights',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=700&auto=format&fit=crop&q=80',
      hero: true,
      flightCode: 'DEL',
      query: { from: 'BOM', to: 'DEL', fromCity: 'Mumbai', toCity: 'New Delhi' }
    },
    {
      id: 'bangalore',
      name: 'Bangalore',
      flag: '🇮🇳',
      tag: 'Garden City & Tech Hub',
      places: '980+ properties & express rails',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=700&auto=format&fit=crop&q=80',
      hero: true,
      flightCode: 'BLR',
      query: { from: 'DEL', to: 'BLR', fromCity: 'New Delhi', toCity: 'Bengaluru' }
    },
    {
      id: 'mumbai',
      name: 'Mumbai',
      flag: '🇮🇳',
      tag: 'Marine Drive & Glamour',
      places: '1,650+ stays & non-stop flights',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80',
      hero: false,
      flightCode: 'BOM',
      query: { from: 'DEL', to: 'BOM', fromCity: 'New Delhi', toCity: 'Mumbai' }
    },
    {
      id: 'chennai',
      name: 'Chennai',
      flag: '🇮🇳',
      tag: 'Temples & Marina Beach',
      places: '740+ properties & rail junction',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80',
      hero: false,
      flightCode: 'MAA',
      query: { from: 'DEL', to: 'MAA', fromCity: 'New Delhi', toCity: 'Chennai' }
    },
    {
      id: 'hyderabad',
      name: 'Hyderabad',
      flag: '🇮🇳',
      tag: 'Charminar & Royal Biryani',
      places: '830+ stays & express routes',
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=80',
      hero: false,
      flightCode: 'HYD',
      query: { from: 'DEL', to: 'HYD', fromCity: 'New Delhi', toCity: 'Hyderabad' }
    },
    {
      id: 'goa',
      name: 'Goa',
      flag: '🇮🇳',
      tag: 'Sun, Sand & Beach Parties',
      places: '1,200+ beachfront villas & resorts',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80',
      hero: false,
      flightCode: 'GOI',
      query: { from: 'DEL', to: 'GOI', fromCity: 'New Delhi', toCity: 'Goa' }
    },
    {
      id: 'jaipur',
      name: 'Jaipur',
      flag: '🇮🇳',
      tag: 'Pink City & Royal Forts',
      places: '890+ heritage hotels & palaces',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&auto=format&fit=crop&q=80',
      hero: false,
      flightCode: 'JAI',
      query: { from: 'DEL', to: 'JAI', fromCity: 'New Delhi', toCity: 'Jaipur' }
    },
    {
      id: 'srinagar',
      name: 'Kashmir (Srinagar)',
      flag: '🇮🇳',
      tag: 'Dal Lake Houseboats & Snow Peaks',
      places: '510+ mountain retreats',
      image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&auto=format&fit=crop&q=80',
      hero: false,
      flightCode: 'SXR',
      query: { from: 'DEL', to: 'SXR', fromCity: 'New Delhi', toCity: 'Srinagar' }
    }
  ],
  international: [
    {
      id: 'dubai',
      name: 'Dubai',
      flag: '🇦🇪',
      tag: 'Skyline, Desert & Luxury Malls',
      places: '2,100+ luxury stays & direct flights',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=700&auto=format&fit=crop&q=80',
      hero: true,
      flightCode: 'DXB',
      query: { from: 'DEL', to: 'DXB', fromCity: 'New Delhi', toCity: 'Dubai' }
    },
    {
      id: 'singapore',
      name: 'Singapore',
      flag: '🇸🇬',
      tag: 'Marina Bay Sands & Gardens',
      places: '850+ luxury hotels & city stays',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=700&auto=format&fit=crop&q=80',
      hero: true,
      flightCode: 'SIN',
      query: { from: 'DEL', to: 'SIN', fromCity: 'New Delhi', toCity: 'Singapore' }
    },
    {
      id: 'bangkok',
      name: 'Bangkok',
      flag: '🇹🇭',
      tag: 'Grand Palaces & Floating Markets',
      places: '1,800+ budget & 5-star stays',
      image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&auto=format&fit=crop&q=80',
      hero: false,
      flightCode: 'BKK',
      query: { from: 'DEL', to: 'BKK', fromCity: 'New Delhi', toCity: 'Bangkok' }
    },
    {
      id: 'bali',
      name: 'Bali',
      flag: '🇮🇩',
      tag: 'Tropical Beaches & Lush Rice Terraces',
      places: '1,950+ private pool villas',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80',
      hero: false,
      flightCode: 'DPS',
      query: { from: 'BOM', to: 'DPS', fromCity: 'Mumbai', toCity: 'Bali (Denpasar)' }
    },
    {
      id: 'london',
      name: 'London',
      flag: '🇬🇧',
      tag: 'Big Ben, River Thames & History',
      places: '2,400+ hotels & direct flights',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80',
      hero: false,
      flightCode: 'LHR',
      query: { from: 'DEL', to: 'LHR', fromCity: 'New Delhi', toCity: 'London' }
    },
    {
      id: 'paris',
      name: 'Paris',
      flag: '🇫🇷',
      tag: 'Eiffel Tower, Art & Romance',
      places: '1,720+ boutique Parisian stays',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
      hero: false,
      flightCode: 'CDG',
      query: { from: 'DEL', to: 'CDG', fromCity: 'New Delhi', toCity: 'Paris' }
    },
    {
      id: 'maldives',
      name: 'Maldives',
      flag: '🇲🇻',
      tag: 'Overwater Bungalows & Turquoise Lagoons',
      places: '340+ island resorts',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&auto=format&fit=crop&q=80',
      hero: false,
      flightCode: 'MLE',
      query: { from: 'BOM', to: 'MLE', fromCity: 'Mumbai', toCity: 'Maldives' }
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      flag: '🇯🇵',
      tag: 'Mount Fuji, Neon Shinjuku & Cuisine',
      places: '1,500+ modern city hotels',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
      hero: false,
      flightCode: 'NRT',
      query: { from: 'DEL', to: 'NRT', fromCity: 'New Delhi', toCity: 'Tokyo' }
    }
  ]
};

export const seoDirectoryData = {
  popularFlightRoutes: [
    { title: 'Delhi to Mumbai Flight', from: 'DEL', to: 'BOM', path: '/flight-booking?from=DEL&to=BOM' },
    { title: 'Delhi to Chennai Flight', from: 'DEL', to: 'MAA', path: '/flight-booking?from=DEL&to=MAA' },
    { title: 'Delhi to Goa Flight', from: 'DEL', to: 'GOI', path: '/flight-booking?from=DEL&to=GOI' },
    { title: 'Delhi to Bangalore Flight', from: 'DEL', to: 'BLR', path: '/flight-booking?from=DEL&to=BLR' },
    { title: 'Delhi to Kolkata Flight', from: 'DEL', to: 'CCU', path: '/flight-booking?from=DEL&to=CCU' },
    { title: 'Mumbai to Chennai Flight', from: 'BOM', to: 'MAA', path: '/flight-booking?from=BOM&to=MAA' },
    { title: 'Delhi to Hyderabad Flight', from: 'DEL', to: 'HYD', path: '/flight-booking?from=DEL&to=HYD' },
    { title: 'Bangalore to Hyderabad Flight', from: 'BLR', to: 'HYD', path: '/flight-booking?from=BLR&to=HYD' },
    { title: 'Mumbai to Kolkata Flight', from: 'BOM', to: 'CCU', path: '/flight-booking?from=BOM&to=CCU' },
    { title: 'Delhi to Pune Flight', from: 'DEL', to: 'PNQ', path: '/flight-booking?from=DEL&to=PNQ' },
    { title: 'Bangalore to Goa Flight', from: 'BLR', to: 'GOI', path: '/flight-booking?from=BLR&to=GOI' },
    { title: 'Delhi to Jaipur Flight', from: 'DEL', to: 'JAI', path: '/flight-booking?from=DEL&to=JAI' },
    { title: 'Delhi to Srinagar Flight', from: 'DEL', to: 'SXR', path: '/flight-booking?from=DEL&to=SXR' },
    { title: 'Mumbai to Nagpur Flight', from: 'BOM', to: 'NAG', path: '/flight-booking?from=BOM&to=NAG' },
    { title: 'Delhi to Varanasi Flight', from: 'DEL', to: 'VNS', path: '/flight-booking?from=DEL&to=VNS' },
    { title: 'Bangalore to Ahmedabad Flight', from: 'BLR', to: 'AMD', path: '/flight-booking?from=BLR&to=AMD' },
    { title: 'Mumbai to Surat Flight', from: 'BOM', to: 'STV', path: '/flight-booking?from=BOM&to=STV' },
    { title: 'Chennai to Bangalore Flight', from: 'MAA', to: 'BLR', path: '/flight-booking?from=MAA&to=BLR' },
    { title: 'Mumbai to Udaipur Flight', from: 'BOM', to: 'UDR', path: '/flight-booking?from=BOM&to=UDR' },
    { title: 'Delhi to Raipur Flight', from: 'DEL', to: 'RPR', path: '/flight-booking?from=DEL&to=RPR' }
  ],
  popularDomesticRoutes: [
    { title: 'Mumbai to Jaipur Flight', from: 'BOM', to: 'JAI', path: '/flight-booking?from=BOM&to=JAI' },
    { title: 'Bangalore to Pune Flight', from: 'BLR', to: 'PNQ', path: '/flight-booking?from=BLR&to=PNQ' },
    { title: 'Delhi to Leh Flight', from: 'DEL', to: 'IXL', path: '/flight-booking?from=DEL&to=IXL' },
    { title: 'Indore to Mumbai Flight', from: 'IDR', to: 'BOM', path: '/flight-booking?from=IDR&to=BOM' },
    { title: 'Delhi to Amritsar Flight', from: 'DEL', to: 'ATQ', path: '/flight-booking?from=DEL&to=ATQ' },
    { title: 'Indore to Delhi Flight', from: 'IDR', to: 'DEL', path: '/flight-booking?from=IDR&to=DEL' },
    { title: 'Bangalore to Kochi Flight', from: 'BLR', to: 'COK', path: '/flight-booking?from=BLR&to=COK' },
    { title: 'Mumbai to Bangalore Flight', from: 'BOM', to: 'BLR', path: '/flight-booking?from=BOM&to=BLR' },
    { title: 'Delhi to Chandigarh Flight', from: 'DEL', to: 'IXC', path: '/flight-booking?from=DEL&to=IXC' },
    { title: 'Kochi to Bangalore Flight', from: 'COK', to: 'BLR', path: '/flight-booking?from=COK&to=BLR' },
    { title: 'Chennai to Ahmedabad Flight', from: 'MAA', to: 'AMD', path: '/flight-booking?from=MAA&to=AMD' },
    { title: 'Mumbai to Surat Flight', from: 'BOM', to: 'STV', path: '/flight-booking?from=BOM&to=STV' },
    { title: 'Kolkata to Varanasi Flight', from: 'CCU', to: 'VNS', path: '/flight-booking?from=CCU&to=VNS' },
    { title: 'Bangalore to Hubli Flight', from: 'BLR', to: 'HBX', path: '/flight-booking?from=BLR&to=HBX' },
    { title: 'Pune to Delhi Flight', from: 'PNQ', to: 'DEL', path: '/flight-booking?from=PNQ&to=DEL' },
    { title: 'Chennai to Visakhapatnam Flight', from: 'MAA', to: 'VTZ', path: '/flight-booking?from=MAA&to=VTZ' },
    { title: 'Delhi to Jammu Flight', from: 'DEL', to: 'IXJ', path: '/flight-booking?from=DEL&to=IXJ' },
    { title: 'Bangalore to Mangalore Flight', from: 'BLR', to: 'IXE', path: '/flight-booking?from=BLR&to=IXE' },
    { title: 'Guwahati to Kolkata Flight', from: 'GAU', to: 'CCU', path: '/flight-booking?from=GAU&to=CCU' },
    { title: 'Nagpur to Mumbai Flight', from: 'NAG', to: 'BOM', path: '/flight-booking?from=NAG&to=BOM' }
  ],
  popularInternationalRoutes: [
    { title: 'Kochi to Dubai Flight', from: 'COK', to: 'DXB', path: '/flight-booking?from=COK&to=DXB' },
    { title: 'Kuwait to Mumbai Flight', from: 'KWI', to: 'BOM', path: '/flight-booking?from=KWI&to=BOM' },
    { title: 'Bangalore to Melbourne Flight', from: 'BLR', to: 'MEL', path: '/flight-booking?from=BLR&to=MEL' },
    { title: 'Mumbai to Baku Flight', from: 'BOM', to: 'GYD', path: '/flight-booking?from=BOM&to=GYD' },
    { title: 'Doha to Mumbai Flight', from: 'DOH', to: 'BOM', path: '/flight-booking?from=DOH&to=BOM' },
    { title: 'Mumbai to Doha Flight', from: 'BOM', to: 'DOH', path: '/flight-booking?from=BOM&to=DOH' },
    { title: 'Delhi to Male Flight', from: 'DEL', to: 'MLE', path: '/flight-booking?from=DEL&to=MLE' },
    { title: 'Mumbai to Madrid Flight', from: 'BOM', to: 'MAD', path: '/flight-booking?from=BOM&to=MAD' },
    { title: 'Mumbai to Hanoi Flight', from: 'BOM', to: 'HAN', path: '/flight-booking?from=BOM&to=HAN' },
    { title: 'Delhi to Baku Flight', from: 'DEL', to: 'GYD', path: '/flight-booking?from=DEL&to=GYD' },
    { title: 'Chennai to Dubai Flight', from: 'MAA', to: 'DXB', path: '/flight-booking?from=MAA&to=DXB' },
    { title: 'Kuwait to Delhi Flight', from: 'KWI', to: 'DEL', path: '/flight-booking?from=KWI&to=DEL' },
    { title: 'Delhi to Sydney Flight', from: 'DEL', to: 'SYD', path: '/flight-booking?from=DEL&to=SYD' },
    { title: 'Delhi to Adelaide Flight', from: 'DEL', to: 'ADL', path: '/flight-booking?from=DEL&to=ADL' },
    { title: 'Delhi to Kathmandu Flight', from: 'DEL', to: 'KTM', path: '/flight-booking?from=DEL&to=KTM' },
    { title: 'Delhi to Tokyo Flight', from: 'DEL', to: 'NRT', path: '/flight-booking?from=DEL&to=NRT' },
    { title: 'Chennai to Singapore Flight', from: 'MAA', to: 'SIN', path: '/flight-booking?from=MAA&to=SIN' },
    { title: 'Mumbai to Toronto Flight', from: 'BOM', to: 'YYZ', path: '/flight-booking?from=BOM&to=YYZ' },
    { title: 'Dubai to Mumbai Flight', from: 'DXB', to: 'BOM', path: '/flight-booking?from=DXB&to=BOM' },
    { title: 'Kolkata to Bangkok Flight', from: 'CCU', to: 'BKK', path: '/flight-booking?from=CCU&to=BKK' }
  ],
  popularTrainRoutes: [
    { title: 'New Delhi to Mumbai Central Rajdhani', path: '/railway?from=NDLS&to=MMCT' },
    { title: 'Mumbai CSMT to Madgaon Vande Bharat', path: '/railway?from=CSMT&to=MAO' },
    { title: 'New Delhi to Varanasi Vande Bharat', path: '/railway?from=NDLS&to=BSB' },
    { title: 'KSR Bengaluru to Chennai Central Shatabdi', path: '/railway?from=SBC&to=MAS' },
    { title: 'Howrah to New Delhi Poorva Express', path: '/railway?from=HWH&to=NDLS' },
    { title: 'Ahmedabad to Mumbai Central Tejas', path: '/railway?from=ADI&to=MMCT' },
    { title: 'Pune to Secunderabad Shatabdi Express', path: '/railway?from=PUNE&to=SC' },
    { title: 'Delhi to Dehradun Vande Bharat', path: '/railway?from=NDLS&to=DDN' },
    { title: 'Jaipur to Delhi Cantt Vande Bharat', path: '/railway?from=JP&to=DEC' }
  ],
  popularBusRoutes: [
    { title: 'Delhi to Manali Volvo Bus', path: '/bus-booking?from=Delhi&to=Manali' },
    { title: 'Mumbai to Pune AC Sleeper Bus', path: '/bus-booking?from=Mumbai&to=Pune' },
    { title: 'Bangalore to Hyderabad Luxury Bus', path: '/bus-booking?from=Bangalore&to=Hyderabad' },
    { title: 'Chennai to Bangalore AC Bus', path: '/bus-booking?from=Chennai&to=Bangalore' },
    { title: 'Jaipur to Delhi Express Bus', path: '/bus-booking?from=Jaipur&to=Delhi' },
    { title: 'Delhi to Shimla Volvo Bus', path: '/bus-booking?from=Delhi&to=Shimla' },
    { title: 'Bangalore to Goa Sleeper Bus', path: '/bus-booking?from=Bangalore&to=Goa' },
    { title: 'Pune to Goa Multi-Axle Bus', path: '/bus-booking?from=Pune&to=Goa' },
    { title: 'Ahmedabad to Udaipur AC Sleeper', path: '/bus-booking?from=Ahmedabad&to=Udaipur' }
  ],
  eazetripProducts: [
    { title: 'Flights Booking', path: '/flight-booking' },
    { title: 'International Airlines', path: '/flight-booking' },
    { title: 'Domestic Airlines', path: '/flight-booking' },
    { title: 'Hotels & Stays', path: '/hotel-booking' },
    { title: 'Luxury Resorts', path: '/hotel-booking' },
    { title: 'IRCTC Train Booking', path: '/railway' },
    { title: 'Bus Booking', path: '/bus-booking' },
    { title: 'AC Sleeper Buses', path: '/bus-booking' },
    { title: 'Special Offers', path: '/offers' },
    { title: 'Live PNR Status', path: '/railway' }
  ],
  companyUsefulLinks: [
    { title: 'About EazeTrip', path: '/about' },
    { title: 'Contact Us', path: '/contact' },
    { title: 'Partner With EazeTrip', path: '/partnerLogin' },
    { title: 'Agent Registration', path: '/partner-registration' },
    { title: 'Corporate Travel Login', path: '/corporate-login' },
    { title: 'Customer Care Helpdesk', path: '/faq' },
    { title: 'Privacy Policy', path: '/privacy' },
    { title: 'Terms & Conditions', path: '/terms' },
    { title: 'Cancellation & Refunds', path: '/cancellation-refund' },
    { title: 'User Agreement', path: '/user-agreement' }
  ]
};

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

export const popularAirlines = {
  domestic: [
    {
      id: 'indigo',
      name: 'IndiGo',
      code: '6E',
      color: '#001b94',
      hub: 'Delhi, Mumbai, Bengaluru',
      tag: 'India’s #1 On-Time Carrier'
    },
    {
      id: 'airindia',
      name: 'Air India',
      code: 'AI',
      color: '#ed1c24',
      hub: 'Delhi, Mumbai',
      tag: 'Full Service National Airline'
    },
    {
      id: 'airindiaexpress',
      name: 'Air India Express',
      code: 'IX',
      color: '#f37021',
      hub: 'Kochi, Delhi, Mumbai',
      tag: 'Smart Value Travel'
    },
    {
      id: 'akasaair',
      name: 'Akasa Air',
      code: 'QP',
      color: '#5b2c6f',
      hub: 'Mumbai, Bengaluru',
      tag: 'Warm & Affordable Airline'
    },
    {
      id: 'allianceair',
      name: 'Alliance Air',
      code: '9I',
      color: '#c0392b',
      hub: 'Delhi, Kolkata',
      tag: 'Regional Connectivity'
    },
    {
      id: 'spicejet',
      name: 'SpiceJet',
      code: 'SG',
      color: '#e74c3c',
      hub: 'Delhi, Hyderabad',
      tag: 'Red. Hot. Spicy.'
    }
  ],
  international: [
    {
      id: 'emirates',
      name: 'Emirates',
      code: 'EK',
      color: '#d71921',
      hub: 'Dubai (DXB)',
      tag: 'World-Class Luxury'
    },
    {
      id: 'singaporeair',
      name: 'Singapore Airlines',
      code: 'SQ',
      color: '#00205b',
      hub: 'Singapore (SIN)',
      tag: 'A Great Way to Fly'
    },
    {
      id: 'qatar',
      name: 'Qatar Airways',
      code: 'QR',
      color: '#5c0632',
      hub: 'Doha (DOH)',
      tag: 'World’s Best Business Class'
    },
    {
      id: 'etihad',
      name: 'Etihad Airways',
      code: 'EY',
      color: '#bd9b60',
      hub: 'Abu Dhabi (AUH)',
      tag: 'Exceptional Arabian Hospitality'
    },
    {
      id: 'britishairways',
      name: 'British Airways',
      code: 'BA',
      color: '#075aaa',
      hub: 'London Heathrow (LHR)',
      tag: 'To Fly. To Serve.'
    },
    {
      id: 'lufthansa',
      name: 'Lufthansa',
      code: 'LH',
      color: '#05164d',
      hub: 'Frankfurt (FRA)',
      tag: 'Nonstop You'
    }
  ]
};

export const trendingFlightRoutesGrid = {
  domestic: [
    {
      id: 'agr-blr',
      from: 'Agra',
      to: 'Bengaluru',
      fromCode: 'AGR',
      toCode: 'BLR',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300&auto=format&fit=crop&q=80',
      price: '₹4,499'
    },
    {
      id: 'ixg-hyd',
      from: 'Belgaum',
      to: 'Hyderabad',
      fromCode: 'IXG',
      toCode: 'HYD',
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=300&auto=format&fit=crop&q=80',
      price: '₹3,299'
    },
    {
      id: 'blr-cok',
      from: 'Bengaluru',
      to: 'Kochi',
      fromCode: 'BLR',
      toCode: 'COK',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=300&auto=format&fit=crop&q=80',
      price: '₹2,899'
    },
    {
      id: 'blr-bom',
      from: 'Bengaluru',
      to: 'Mumbai',
      fromCode: 'BLR',
      toCode: 'BOM',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&auto=format&fit=crop&q=80',
      price: '₹3,450'
    },
    {
      id: 'del-amd',
      from: 'Delhi',
      to: 'Ahmedabad',
      fromCode: 'DEL',
      toCode: 'AMD',
      image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=300&auto=format&fit=crop&q=80',
      price: '₹3,150'
    },
    {
      id: 'del-blr',
      from: 'Delhi',
      to: 'Bengaluru',
      fromCode: 'DEL',
      toCode: 'BLR',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=300&auto=format&fit=crop&q=80',
      price: '₹5,200'
    },
    {
      id: 'del-ccu',
      from: 'Delhi',
      to: 'Kolkata',
      fromCode: 'DEL',
      toCode: 'CCU',
      image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=300&auto=format&fit=crop&q=80',
      price: '₹4,300'
    },
    {
      id: 'del-sxr',
      from: 'Delhi',
      to: 'Srinagar',
      fromCode: 'DEL',
      toCode: 'SXR',
      image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=300&auto=format&fit=crop&q=80',
      price: '₹4,750'
    },
    {
      id: 'hyd-blr',
      from: 'Hyderabad',
      to: 'Bengaluru',
      fromCode: 'HYD',
      toCode: 'BLR',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=300&auto=format&fit=crop&q=80',
      price: '₹2,699'
    },
    {
      id: 'hyd-del',
      from: 'Hyderabad',
      to: 'Delhi',
      fromCode: 'HYD',
      toCode: 'DEL',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&auto=format&fit=crop&q=80',
      price: '₹4,100'
    },
    {
      id: 'cok-bom',
      from: 'Kochi',
      to: 'Mumbai',
      fromCode: 'COK',
      toCode: 'BOM',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&auto=format&fit=crop&q=80',
      price: '₹3,850'
    },
    {
      id: 'bom-del',
      from: 'Mumbai',
      to: 'Delhi',
      fromCode: 'BOM',
      toCode: 'DEL',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&auto=format&fit=crop&q=80',
      price: '₹4,600'
    }
  ],
  international: [
    {
      id: 'del-dxb',
      from: 'Delhi',
      to: 'Dubai',
      fromCode: 'DEL',
      toCode: 'DXB',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&auto=format&fit=crop&q=80',
      price: '₹14,999'
    },
    {
      id: 'bom-sin',
      from: 'Mumbai',
      to: 'Singapore',
      fromCode: 'BOM',
      toCode: 'SIN',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=300&auto=format&fit=crop&q=80',
      price: '₹16,500'
    },
    {
      id: 'blr-bkk',
      from: 'Bengaluru',
      to: 'Bangkok',
      fromCode: 'BLR',
      toCode: 'BKK',
      image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=300&auto=format&fit=crop&q=80',
      price: '₹12,800'
    },
    {
      id: 'del-lhr',
      from: 'Delhi',
      to: 'London',
      fromCode: 'DEL',
      toCode: 'LHR',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&auto=format&fit=crop&q=80',
      price: '₹38,900'
    },
    {
      id: 'bom-dps',
      from: 'Mumbai',
      to: 'Bali',
      fromCode: 'BOM',
      toCode: 'DPS',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&auto=format&fit=crop&q=80',
      price: '₹19,400'
    },
    {
      id: 'maa-kul',
      from: 'Chennai',
      to: 'Kuala Lumpur',
      fromCode: 'MAA',
      toCode: 'KUL',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=300&auto=format&fit=crop&q=80',
      price: '₹11,500'
    },
    {
      id: 'del-cdg',
      from: 'Delhi',
      to: 'Paris',
      fromCode: 'DEL',
      toCode: 'CDG',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&auto=format&fit=crop&q=80',
      price: '₹41,200'
    },
    {
      id: 'bom-mle',
      from: 'Mumbai',
      to: 'Maldives',
      fromCode: 'BOM',
      toCode: 'MLE',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=300&auto=format&fit=crop&q=80',
      price: '₹15,600'
    },
    {
      id: 'blr-mel',
      from: 'Bengaluru',
      to: 'Melbourne',
      fromCode: 'BLR',
      toCode: 'MEL',
      image: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?w=300&auto=format&fit=crop&q=80',
      price: '₹46,800'
    },
    {
      id: 'del-nrt',
      from: 'Delhi',
      to: 'Tokyo',
      fromCode: 'DEL',
      toCode: 'NRT',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=300&auto=format&fit=crop&q=80',
      price: '₹44,000'
    },
    {
      id: 'bom-yyz',
      from: 'Mumbai',
      to: 'Toronto',
      fromCode: 'BOM',
      toCode: 'YYZ',
      image: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=300&auto=format&fit=crop&q=80',
      price: '₹58,000'
    },
    {
      id: 'del-jfk',
      from: 'Delhi',
      to: 'New York',
      fromCode: 'DEL',
      toCode: 'JFK',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&auto=format&fit=crop&q=80',
      price: '₹54,500'
    }
  ]
};

