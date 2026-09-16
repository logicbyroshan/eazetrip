import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { NotificationProvider } from './context/NotificationContext';

import TopBar from './components/common/TopBar';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';
import Preloader from './components/common/Preloader';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoginModal from './components/auth/LoginModal';
import GoogleOneTapPrompt from './components/auth/GoogleOneTapPrompt';
import TicketModal from './components/checkout/TicketModal';
import NotificationPreviewModal from './components/common/NotificationPreviewModal';
import HelpDeskWidget from './components/common/HelpDeskWidget';
import CookieConsentBanner from './components/common/CookieConsentBanner';

const HomePage = lazy(() => import('./pages/HomePage'));
const FlightBookingPage = lazy(() => import('./pages/FlightBookingPage'));
const HotelBookingPage = lazy(() => import('./pages/HotelBookingPage'));
const BusBookingPage = lazy(() => import('./pages/BusBookingPage'));
const RailwayBookingPage = lazy(() => import('./pages/RailwayBookingPage'));
const HolidayBookingPage = lazy(() => import('./pages/HolidayBookingPage'));
const ReviewBookingPage = lazy(() => import('./pages/ReviewBookingPage'));
const BookingPaymentPage = lazy(() => import('./pages/BookingPaymentPage'));
const ManageBookingsPage = lazy(() => import('./pages/ManageBookingsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const PartnerPage = lazy(() => import('./pages/PartnerPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const CancellationRefundPage = lazy(() => import('./pages/CancellationRefundPage'));

import './App.css';

function RouteLoadingFallback() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      color: '#034ea2'
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        border: '3.5px solid rgba(3, 78, 162, 0.15)',
        borderTopColor: '#034ea2',
        borderRadius: '50%',
        animation: 'spin 0.75s linear infinite'
      }} />
      <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>Loading view...</span>
    </div>
  );
}

function ScrollHandler() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    // Only initialize smooth scrolling on non-reduced-motion environments
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    let frameId;
    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return null;
}

function AppContent() {
  const location = useLocation();
  const isAuthIsolatedPage = [
    '/user-register',
    '/signup',
    '/register',
    '/create-account',
    '/user-login',
    '/login'
  ].includes(location.pathname);

  return (
    <ErrorBoundary>
      <div className={`app-shell ${isAuthIsolatedPage ? 'auth-isolated-shell' : ''}`}>
        {!isAuthIsolatedPage && <TopBar />}
        {!isAuthIsolatedPage && <Header />}
        
        <main className={isAuthIsolatedPage ? 'auth-isolated-viewport' : 'main-viewport'}>
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/flight-booking" element={<FlightBookingPage />} />
              <Route path="/flights" element={<FlightBookingPage />} />
              <Route path="/hotel-booking" element={<HotelBookingPage />} />
              <Route path="/hotels" element={<HotelBookingPage />} />
              <Route path="/bus-booking" element={<BusBookingPage />} />
              <Route path="/buses" element={<BusBookingPage />} />
              <Route path="/railway" element={<RailwayBookingPage />} />
              <Route path="/railway-booking" element={<RailwayBookingPage />} />
              <Route path="/railways" element={<RailwayBookingPage />} />
              <Route path="/trains" element={<RailwayBookingPage />} />
              <Route path="/holiday-booking" element={<HolidayBookingPage />} />
              <Route path="/holidays" element={<HolidayBookingPage />} />
              <Route path="/holiday-packages" element={<HolidayBookingPage />} />

              {/* Dedicated Multi-Step Booking & Payment Flow */}
              <Route path="/review-booking" element={<ReviewBookingPage />} />
              <Route path="/booking-review" element={<ReviewBookingPage />} />
              <Route path="/booking" element={<ReviewBookingPage />} />
              <Route path="/booking-payment" element={<BookingPaymentPage />} />

              <Route path="/manage-bookings" element={<ManageBookingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-profile" element={<ProfilePage />} />
              <Route path="/payment" element={<PaymentPage />} />
              
              {/* User Auth Routes */}
              <Route path="/user-login" element={<AuthPage mode="login" />} />
              <Route path="/login" element={<AuthPage mode="login" />} />
              <Route path="/user-register" element={<AuthPage mode="register" />} />
              <Route path="/signup" element={<AuthPage mode="register" />} />
              <Route path="/register" element={<AuthPage mode="register" />} />
              <Route path="/create-account" element={<AuthPage mode="register" />} />

              {/* Partner & B2B Routes */}
              <Route path="/partner" element={<PartnerPage />} />
              <Route path="/become-partner" element={<PartnerPage />} />
              <Route path="/partnerLogin" element={<PartnerPage mode="login" />} />
              <Route path="/partner-registration" element={<PartnerPage mode="register" />} />
              <Route path="/corporate-login" element={<PartnerPage mode="login" />} />
              
              {/* Informational & Support Pages */}
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/about-us" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/user-agreement" element={<TermsPage title="User Agreement" />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/cancellation-refund" element={<CancellationRefundPage />} />
              
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Suspense>
        </main>

        {!isAuthIsolatedPage && <Footer />}
        
        {/* Global Overlays & Modals */}
        <Preloader />
        <LoginModal />
        <GoogleOneTapPrompt />
        <TicketModal />
        <NotificationPreviewModal />
        <HelpDeskWidget />
        <CookieConsentBanner />
        <Toast />
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <NotificationProvider>
          <BrowserRouter>
            <ScrollHandler />
            <AppContent />
          </BrowserRouter>
        </NotificationProvider>
      </BookingProvider>
    </AuthProvider>
  );
}
