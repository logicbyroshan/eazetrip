import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

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

import TopBar from './components/common/TopBar';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';
import Preloader from './components/common/Preloader';
import LoginModal from './components/auth/LoginModal';
import CheckoutModal from './components/checkout/CheckoutModal';
import TicketModal from './components/checkout/TicketModal';

import HomePage from './pages/HomePage';
import FlightBookingPage from './pages/FlightBookingPage';
import HotelBookingPage from './pages/HotelBookingPage';
import BusBookingPage from './pages/BusBookingPage';
import RailwayBookingPage from './pages/RailwayBookingPage';
import ManageBookingsPage from './pages/ManageBookingsPage';
import ProfilePage from './pages/ProfilePage';
import PaymentPage from './pages/PaymentPage';
import AuthPage from './pages/AuthPage';
import PartnerPage from './pages/PartnerPage';
import OffersPage from './pages/OffersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CancellationRefundPage from './pages/CancellationRefundPage';

import './App.css';

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
    <div className={`app-shell ${isAuthIsolatedPage ? 'auth-isolated-mode' : ''}`}>
      {!isAuthIsolatedPage && <TopBar />}
      {!isAuthIsolatedPage && <Header />}
      
      <main className={isAuthIsolatedPage ? 'auth-isolated-viewport' : 'main-viewport'}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/flight-booking" element={<FlightBookingPage />} />
          <Route path="/hotel-booking" element={<HotelBookingPage />} />
          <Route path="/bus-booking" element={<BusBookingPage />} />
          <Route path="/railway" element={<RailwayBookingPage />} />
          <Route path="/manage-bookings" element={<ManageBookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/payment" element={<PaymentPage />} />
          
          {/* User Auth Routes */}
          <Route path="/user-login" element={<AuthPage mode="login" />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/user-register" element={<AuthPage mode="register" />} />
          <Route path="/signup" element={<AuthPage mode="register" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/create-account" element={<AuthPage mode="register" />} />

          {/* Partner & B2B Routes */}
          <Route path="/partnerLogin" element={<PartnerPage mode="login" />} />
          <Route path="/partner-registration" element={<PartnerPage mode="register" />} />
          <Route path="/corporate-login" element={<PartnerPage mode="login" />} />
          
          {/* Informational & Support Pages */}
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/user-agreement" element={<TermsPage title="User Agreement" />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cancellation-refund" element={<CancellationRefundPage />} />
          
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {!isAuthIsolatedPage && <Footer />}
      
      {/* Global Overlays & Modals */}
      <Preloader />
      <LoginModal />
      <CheckoutModal />
      <TicketModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <BrowserRouter>
          <ScrollHandler />
          <AppContent />
        </BrowserRouter>
      </BookingProvider>
    </AuthProvider>
  );
}
