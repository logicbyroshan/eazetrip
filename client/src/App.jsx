import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

import TopBar from './components/common/TopBar';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';
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

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <BrowserRouter>
          <div className="app-shell">
            <TopBar />
            <Header />
            <main className="main-viewport">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/flight-booking" element={<FlightBookingPage />} />
                <Route path="/hotel-booking" element={<HotelBookingPage />} />
                <Route path="/bus-booking" element={<BusBookingPage />} />
                <Route path="/railway" element={<RailwayBookingPage />} />
                <Route path="/manage-bookings" element={<ManageBookingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/user-login" element={<AuthPage mode="login" />} />
                <Route path="/user-register" element={<AuthPage mode="register" />} />
                <Route path="/partnerLogin" element={<PartnerPage mode="login" />} />
                <Route path="/partner-registration" element={<PartnerPage mode="register" />} />
                <Route path="/corporate-login" element={<PartnerPage mode="login" />} />
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
            <Footer />
            
            {/* Global Overlays & Modals */}
            <LoginModal />
            <CheckoutModal />
            <TicketModal />
            <Toast />
          </div>
        </BrowserRouter>
      </BookingProvider>
    </AuthProvider>
  );
}
