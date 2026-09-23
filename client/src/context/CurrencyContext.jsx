import { createContext, useContext, useState, useEffect } from 'react';

export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', rate: 1.0, flag: '🇮🇳', name: 'Indian Rupee' },
  USD: { code: 'USD', symbol: '$', rate: 0.012, flag: '🇺🇸', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.011, flag: '🇪🇺', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0094, flag: '🇬🇧', name: 'British Pound' },
  AED: { code: 'AED', symbol: 'AED ', rate: 0.044, flag: '🇦🇪', name: 'UAE Dirham' }
};

export const LANGUAGES = {
  en: { code: 'en', name: 'English', flag: '🇬🇧' },
  hi: { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
};

const TRANSLATIONS = {
  en: {
    flights: 'Flights',
    hotels: 'Hotels',
    buses: 'Buses',
    trains: 'Trains',
    holidays: 'Holidays',
    offers: 'Offers',
    manageBookings: 'Manage Bookings',
    makePayment: 'Make Payment',
    loginOrSignup: 'Login or Signup',
    whatsappSupport: 'WhatsApp Support',
    searchFlights: 'Search Flights',
    searchHotels: 'Search Hotels',
    bookNow: 'Book Now',
    reviews: 'Reviews & Ratings',
    writeReview: 'Write a Review',
    verifiedTraveler: 'Verified Traveler',
    offlineWallet: 'Offline Ticket Wallet',
    offlineNotice: 'You are offline. Your confirmed tickets are saved locally for offline access.'
  },
  hi: {
    flights: 'उड़ानें (Flights)',
    hotels: 'होटल (Hotels)',
    buses: 'बसें (Buses)',
    trains: 'ट्रेन (Trains)',
    holidays: 'हॉलीडे टूर (Holidays)',
    offers: 'ऑफ़र्स (Offers)',
    manageBookings: 'बुकिंग प्रबंधित करें',
    makePayment: 'भुगतान करें',
    loginOrSignup: 'लॉगिन / साइन अप',
    whatsappSupport: 'व्हाट्सएप सहायता',
    searchFlights: 'उड़ान खोजें',
    searchHotels: 'होटल खोजें',
    bookNow: 'अभी बुक करें',
    reviews: 'समीक्षाएं और रेटिंग',
    writeReview: 'समीक्षा लिखें',
    verifiedTraveler: 'प्रमाणित यात्री',
    offlineWallet: 'ऑफलाइन टिकट वॉलेट',
    offlineNotice: 'आप ऑफलाइन हैं। आपके ई-टिकट बिना इंटरनेट के भी उपलब्ध हैं।'
  }
};

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    try {
      return localStorage.getItem('eazetrip_currency') || 'INR';
    } catch {
      return 'INR';
    }
  });

  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('eazetrip_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const setCurrency = (code) => {
    if (CURRENCIES[code]) {
      setCurrencyState(code);
      try {
        localStorage.setItem('eazetrip_currency', code);
      } catch (err) {
        console.error('Failed to persist currency preference', err);
      }
    }
  };

  const setLanguage = (langCode) => {
    if (LANGUAGES[langCode]) {
      setLanguageState(langCode);
      try {
        localStorage.setItem('eazetrip_lang', langCode);
        document.documentElement.lang = langCode;
      } catch (err) {
        console.error('Failed to persist language preference', err);
      }
    }
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {}
  }, [language]);

  const activeCurrency = CURRENCIES[currency] || CURRENCIES.INR;

  const convertPrice = (amountInINR) => {
    const num = Number(amountInINR) || 0;
    return num * activeCurrency.rate;
  };

  const formatPrice = (amountInINR) => {
    const num = Number(amountInINR) || 0;
    const converted = num * activeCurrency.rate;

    if (currency === 'INR') {
      return `₹${Math.round(converted).toLocaleString('en-IN')}`;
    }
    if (currency === 'AED') {
      return `AED ${Math.round(converted).toLocaleString('en-US')}`;
    }
    return `${activeCurrency.symbol}${converted.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  };

  const t = (key, fallback = '') => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || fallback || key;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        currencies: CURRENCIES,
        activeCurrency,
        language,
        setLanguage,
        languages: LANGUAGES,
        convertPrice,
        formatPrice,
        t
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    return {
      currency: 'INR',
      setCurrency: () => {},
      currencies: CURRENCIES,
      activeCurrency: CURRENCIES.INR,
      language: 'en',
      setLanguage: () => {},
      languages: LANGUAGES,
      convertPrice: (amt) => Number(amt) || 0,
      formatPrice: (amt) => `₹${Number(amt || 0).toLocaleString('en-IN')}`,
      t: (k, fb) => fb || k
    };
  }
  return context;
}
