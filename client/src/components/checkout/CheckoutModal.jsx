import { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { initiateRazorpayCheckout } from '../../services/razorpay';
import {
  X,
  CreditCard,
  QrCode,
  Building,
  Wallet,
  Tag,
  User,
  Mail
} from 'lucide-react';

export default function CheckoutModal() {
  const { activeCheckoutItem, closeCheckout, createBooking, showToast } = useBooking();
  const { user } = useAuth();

  const [step, setStep] = useState(1); // 1: Travellers & Contact, 2: Payment & Confirm

  // Passenger state
  const [title, setTitle] = useState('Mr');
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name?.split(' ')[1] || 'Traveler');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('1994-05-15');
  const [contactEmail, setContactEmail] = useState(user?.email || 'traveler@eazetrip.com');
  const [contactPhone, setContactPhone] = useState(user?.phone || '9876543210');
  
  // GST Details
  const [addGst, setAddGst] = useState(false);
  const [gstNumber, setGstNumber] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponSuccess, setCouponSuccess] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi | card | netbanking | wallet
  const [upiId, setUpiId] = useState('traveler@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && activeCheckoutItem && !isProcessing) {
        closeCheckout();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCheckoutItem, isProcessing, closeCheckout]);

  if (!activeCheckoutItem) return null;

  const type = activeCheckoutItem.checkoutType || activeCheckoutItem.type || 'flight';
  const rawPrice = Number(activeCheckoutItem.price || activeCheckoutItem.totalPrice || activeCheckoutItem.pricePerNight || 4999);
  const basePrice = isNaN(rawPrice) || rawPrice <= 0 ? 4999 : rawPrice;
  const rawTaxes = Number(activeCheckoutItem.taxes);
  const taxes = isNaN(rawTaxes) || rawTaxes <= 0 ? Math.round(basePrice * 0.12) : rawTaxes;
  const convenienceFee = 0; // Free on EazeTrip
  const finalTotal = Math.max(0, basePrice + taxes + convenienceFee - appliedDiscount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.toUpperCase().trim();
    if (code === 'EAZETRIP' || code === 'EXPLOREEAZ' || code === 'EAZETRIP500') {
      setAppliedDiscount(500);
      setCouponSuccess('Coupon EAZETRIP applied: ₹500 saved!');
      showToast('Coupon EAZETRIP applied successfully!');
    } else if (code === 'STAYEAZY' || code === 'BUSEAZ' || code === 'TRAINEAZ' || code === 'EAZETRIP1000') {
      const discount = code === 'EAZETRIP1000' ? Math.min(1000, Math.round(basePrice * 0.15)) : Math.min(300, Math.round(basePrice * 0.1));
      setAppliedDiscount(discount);
      setCouponSuccess(`Coupon ${code} applied: ₹${discount} saved!`);
      showToast(`Coupon ${code} applied successfully: ₹${discount} off!`);
    } else {
      showToast('Invalid promo code. Try EAZETRIP', 'error');
    }
  };

  const handlePassengerSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !contactEmail || !contactPhone) {
      showToast('Please fill all mandatory contact & traveler details', 'error');
      return;
    }
    setStep(2);
  };

  const handleFinalPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const bookingTitle =
      activeCheckoutItem.title ||
      (type === 'flight'
        ? `${activeCheckoutItem.fromCity || activeCheckoutItem.from || 'Origin'} → ${activeCheckoutItem.toCity || activeCheckoutItem.to || 'Destination'}`
        : type === 'hotel'
        ? activeCheckoutItem.name || 'Luxury Hotel Stay'
        : type === 'bus'
        ? `${activeCheckoutItem.from || 'Origin'} → ${activeCheckoutItem.to || 'Destination'} (${activeCheckoutItem.operator || 'Bus'})`
        : `${activeCheckoutItem.trainName || 'Express Train'} (${activeCheckoutItem.trainNumber || ''})`);

    const bookingPayload = {
      type,
      title: bookingTitle,
      details: activeCheckoutItem,
      date: activeCheckoutItem.departureDate || activeCheckoutItem.journeyDate || activeCheckoutItem.travelDate || activeCheckoutItem.checkInDate || activeCheckoutItem.date || new Date().toISOString().split('T')[0],
      totalAmount: finalTotal,
      discount: appliedDiscount,
      paymentMethod:
        paymentMethod === 'upi'
          ? `Razorpay UPI (${upiId})`
          : paymentMethod === 'card'
          ? 'Razorpay Card'
          : paymentMethod === 'netbanking'
          ? 'Razorpay Net Banking'
          : 'Razorpay Wallet',
      passengers: [
        {
          name: `${title} ${firstName} ${lastName}`.trim(),
          gender,
          dob,
          email: contactEmail,
          phone: contactPhone,
          seat: Array.isArray(activeCheckoutItem.selectedSeats)
            ? activeCheckoutItem.selectedSeats.map((s) => (typeof s === 'object' ? s.number : s)).filter(Boolean).join(', ') || 'Auto-Assigned'
            : 'Auto-Assigned'
        }
      ],
      pnr: `${type.slice(0, 2).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`
    };

    try {
      // 1. Fetch Razorpay key & create order
      const keyConfig = await api.getRazorpayKey();
      const orderRes = await api.createRazorpayOrder({
        amount: finalTotal,
        currency: 'INR',
        receipt: `rcpt_${bookingPayload.pnr}`,
        notes: {
          bookingType: type,
          pnr: bookingPayload.pnr,
          customer: `${title} ${firstName} ${lastName}`.trim()
        }
      });

      const orderId = orderRes?.orderId || `order_sim_${Date.now()}`;
      const keyId = orderRes?.keyId || keyConfig?.keyId || 'rzp_test_placeholder';

      // 2. Open Razorpay Checkout modal
      await initiateRazorpayCheckout({
        keyId,
        orderId,
        amount: finalTotal * 100,
        currency: 'INR',
        name: 'EazeTrip India',
        description: `Booking for ${bookingTitle}`,
        prefill: {
          name: `${title} ${firstName} ${lastName}`.trim(),
          email: contactEmail,
          contact: contactPhone
        },
        themeColor: '#034ea2',
        onSuccess: async (rzpRes) => {
          bookingPayload.paymentId = rzpRes.razorpay_payment_id;
          bookingPayload.orderId = rzpRes.razorpay_order_id;
          bookingPayload.signature = rzpRes.razorpay_signature;

          try {
            await api.verifyRazorpayPayment({
              razorpay_payment_id: rzpRes.razorpay_payment_id,
              razorpay_order_id: rzpRes.razorpay_order_id,
              razorpay_signature: rzpRes.razorpay_signature,
              amount: finalTotal,
              currency: 'INR',
              payerName: `${title} ${firstName} ${lastName}`.trim(),
              email: contactEmail,
              mobile: contactPhone,
              description: `Booking #${bookingPayload.pnr} - ${bookingTitle}`,
              bookingDetails: bookingPayload
            });
          } catch (err) {
            console.warn('Backend verification note:', err);
          }

          await createBooking(bookingPayload);
          setIsProcessing(false);
          showToast(`Booking ${bookingPayload.pnr} confirmed via Razorpay!`);
        },
        onFailure: (err) => {
          setIsProcessing(false);
          showToast(err.description || 'Payment failed. Please retry.', 'error');
        },
        onDismiss: () => {
          setIsProcessing(false);
        }
      });
    } catch (err) {
      console.warn('Falling back to direct booking confirmation:', err);
      setTimeout(async () => {
        await createBooking(bookingPayload);
        setIsProcessing(false);
      }, 1000);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeCheckout}>
      <div
        className="modal-container checkout-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
      >
        <div className="modal-header-custom">
          <div>
            <h3 id="checkout-modal-title">
              {step === 1 ? 'Traveller Details & Review' : 'Secure Payment Gateway'}
            </h3>
            <span className="sub-tagline">
              Booking for {type.toUpperCase()} • Instant Confirmation
            </span>
          </div>
          <button className="modal-close-btn" onClick={closeCheckout} aria-label="Close checkout modal">
            <X size={20} />
          </button>
        </div>

        {/* Steps Indicator */}
        <div className="checkout-steps-bar">
          <div className={`checkout-step-node ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">1</span>
            <span>Passenger & Contact</span>
          </div>
          <div className="step-connector"></div>
          <div className={`checkout-step-node ${step === 2 ? 'active' : ''}`}>
            <span className="step-num">2</span>
            <span>Payment & Confirm</span>
          </div>
        </div>

        <div className="checkout-modal-body">
          {step === 1 ? (
            <form onSubmit={handlePassengerSubmit} className="checkout-step-form">
              {/* Order Summary Pill */}
              <div className="order-summary-box">
                <div className="summary-title">
                  <strong>
                    {activeCheckoutItem.title ||
                      activeCheckoutItem.name ||
                      activeCheckoutItem.trainName ||
                      activeCheckoutItem.operator ||
                      (activeCheckoutItem.from && activeCheckoutItem.to
                        ? `${activeCheckoutItem.fromCity || activeCheckoutItem.from} to ${activeCheckoutItem.toCity || activeCheckoutItem.to}`
                        : 'EazeTrip Verified Booking')}
                  </strong>
                  <span className="summary-price">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
                <small className="summary-date">
                  Date: {activeCheckoutItem.departureDate || activeCheckoutItem.journeyDate || activeCheckoutItem.travelDate || activeCheckoutItem.checkInDate || activeCheckoutItem.date || 'Instant Confirmation'}
                </small>
              </div>

              {/* Primary Traveller Info */}
              <div className="form-card-section">
                <div className="section-title-with-action">
                  <h4>
                    <User size={16} /> Passenger / Guest Details (Adult 1)
                  </h4>
                  {(() => {
                    try {
                      const list = JSON.parse(
                        localStorage.getItem('eazetrip_travellers') ||
                        localStorage.getItem('exploreeaz_travellers') ||
                        '[]'
                      );
                      if (Array.isArray(list) && list.length > 0) {
                        return (
                          <div className="quick-traveller-pills">
                            <span className="quick-lbl">Quick Fill:</span>
                            {list.map((t, idx) => {
                              if (!t || !t.name) return null;
                              return (
                                <button
                                  key={t.id || idx}
                                  type="button"
                                  className="quick-pax-btn"
                                  onClick={() => {
                                    const parts = String(t.name || '').trim().split(' ');
                                    setFirstName(parts[0] || '');
                                    setLastName(parts.slice(1).join(' ') || 'Traveler');
                                    if (t.gender) setGender(t.gender);
                                    if (t.dob) setDob(t.dob);
                                    showToast(`Auto-filled details for ${t.name}`);
                                  }}
                                >
                                  + {t.name}
                                </button>
                              );
                            })}
                          </div>
                        );
                      }
                    } catch {
                      return null;
                    }
                    return null;
                  })()}
                </div>
                <div className="form-grid three-col">
                  <div className="form-group">
                    <label htmlFor="pax-title">Title</label>
                    <select
                      id="pax-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="native-select"
                    >
                      <option value="Mr">Mr.</option>
                      <option value="Ms">Ms.</option>
                      <option value="Mrs">Mrs.</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="pax-first-name">First & Middle Name *</label>
                    <input
                      id="pax-first-name"
                      type="text"
                      placeholder="e.g. Rahul"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="pax-last-name">Last Name *</label>
                    <input
                      id="pax-last-name"
                      type="text"
                      placeholder="e.g. Sharma"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid two-col mt-3">
                  <div className="form-group">
                    <label htmlFor="pax-gender">Gender</label>
                    <select
                      id="pax-gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="native-select"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="pax-dob">Date of Birth</label>
                    <input
                      id="pax-dob"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="form-card-section mt-4">
                <h4>
                  <Mail size={16} /> Contact Information (For E-Ticket & SMS Updates)
                </h4>
                <div className="form-grid two-col">
                  <div className="form-group">
                    <label htmlFor="pax-email">Email Address *</label>
                    <input
                      id="pax-email"
                      type="email"
                      placeholder="name@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="pax-phone">Mobile Number *</label>
                    <div className="input-with-prefix">
                      <span className="phone-prefix">+91</span>
                      <input
                        id="pax-phone"
                        type="tel"
                        maxLength={10}
                        placeholder="10 digit number"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, ''))}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* GST Option */}
              <div className="gst-toggle-box mt-3">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={addGst}
                    onChange={(e) => setAddGst(e.target.checked)}
                  />
                  <span>I have a GST number (Optional for business invoicing)</span>
                </label>

                {addGst && (
                  <div className="form-grid two-col mt-3">
                    <div className="form-group">
                      <label htmlFor="gstin-input">GSTIN</label>
                      <input
                        id="gstin-input"
                        type="text"
                        placeholder="e.g. 07AAAAA0000A1Z5"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="company-name-input">Registered Company Name</label>
                      <input
                        id="company-name-input"
                        type="text"
                        placeholder="Company Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="checkout-actions-row mt-4">
                <button type="button" className="secondary-btn" onClick={closeCheckout}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Proceed to Payment (₹{finalTotal.toLocaleString('en-IN')})
                </button>
              </div>
            </form>
          ) : (
            <div className="payment-step-wrap">
              {/* Promo code bar */}
              <form onSubmit={handleApplyCoupon} className="coupon-bar">
                <div className="coupon-input-wrap">
                  <Tag size={16} />
                  <input
                    type="text"
                    placeholder="Enter Promo Code (e.g. EXPLOREEAZ)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    aria-label="Promo discount code"
                  />
                </div>
                <button type="submit" className="apply-coupon-btn">
                  Apply
                </button>
              </form>
              {couponSuccess && <div className="coupon-success-text">{couponSuccess}</div>}

              {/* Payment Methods Grid */}
              <div className="payment-options-layout">
                <div className="payment-method-nav">
                  <button
                    type="button"
                    className={`pay-nav-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <QrCode size={18} />
                    <span>UPI / QR Code</span>
                  </button>
                  <button
                    type="button"
                    className={`pay-nav-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard size={18} />
                    <span>Credit / Debit Card</span>
                  </button>
                  <button
                    type="button"
                    className={`pay-nav-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('netbanking')}
                  >
                    <Building size={18} />
                    <span>Net Banking</span>
                  </button>
                  <button
                    type="button"
                    className={`pay-nav-btn ${paymentMethod === 'wallet' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('wallet')}
                  >
                    <Wallet size={18} />
                    <span>Wallets</span>
                  </button>
                </div>

                <div className="payment-method-content">
                  {paymentMethod === 'upi' && (
                    <div className="upi-pay-box">
                      <div className="qr-demo-box">
                        <div className="qr-frame">
                          <QrCode size={120} color="#12213d" />
                          <small>Scan with GPay, PhonePe or Paytm</small>
                        </div>
                      </div>
                      <div className="upi-id-row">
                        <label htmlFor="upi-vpa-input">Or enter UPI ID / VPA</label>
                        <input
                          id="upi-vpa-input"
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="username@bank"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="card-pay-box">
                      <div className="form-group mb-3">
                        <label htmlFor="card-number-input">Card Number</label>
                        <input
                          id="card-number-input"
                          type="text"
                          placeholder="4532 •••• •••• ••••"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-grid two-col">
                        <div className="form-group">
                          <label htmlFor="card-exp-input">Expiry Date</label>
                          <input
                            id="card-exp-input"
                            type="text"
                            placeholder="MM / YY"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="card-cvv-input">CVV / CVC</label>
                          <input
                            id="card-cvv-input"
                            type="password"
                            placeholder="•••"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div className="netbanking-pay-box">
                      <label htmlFor="netbank-select">Select Your Bank</label>
                      <select id="netbank-select" className="native-select">
                        <option>HDFC Bank</option>
                        <option>State Bank of India (SBI)</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                        <option>Punjab National Bank</option>
                      </select>
                    </div>
                  )}

                  {paymentMethod === 'wallet' && (
                    <div className="wallet-pay-box">
                      <label htmlFor="wallet-select">Select Mobile Wallet</label>
                      <select id="wallet-select" className="native-select">
                        <option>Paytm Wallet</option>
                        <option>Amazon Pay</option>
                        <option>PhonePe Wallet</option>
                        <option>Mobikwik</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Summary Breakdown */}
              <div className="fare-summary-card">
                <div className="fare-summary-row">
                  <span>Base Booking Price</span>
                  <span>₹{basePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="fare-summary-row">
                  <span>Taxes & Surcharges</span>
                  <span>₹{taxes.toLocaleString('en-IN')}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="fare-summary-row discount-row">
                    <span>Promo Discount Applied</span>
                    <span>-₹{appliedDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="fare-summary-row total-row">
                  <strong>Total Amount Payable</strong>
                  <strong className="final-price-text">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              <div className="checkout-actions-row mt-4">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="primary-btn pay-now-btn"
                  onClick={handleFinalPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing Payment...' : `PAY ₹${finalTotal.toLocaleString('en-IN')} NOW`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
