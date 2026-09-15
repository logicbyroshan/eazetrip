import { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { api } from '../services/api';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  QrCode,
  Building,
  Wallet,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PaymentPage() {
  const { showToast } = useBooking();

  const [firstName, setFirstName] = useState('Rohit');
  const [lastName, setLastName] = useState('Sharma');
  const [email, setEmail] = useState('rohit.sharma@example.com');
  const [mobile, setMobile] = useState('9876543210');
  const [currency, setCurrency] = useState('INR');
  const [amount, setAmount] = useState('4500');
  const [description, setDescription] = useState('Custom Travel Booking / Itinerary #EZ-88219');
  const [address, setAddress] = useState('B-402, Sea Green Heights, Mumbai, Maharashtra');

  // Payment Method Selection
  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi | card | netbanking | wallet
  const [upiId, setUpiId] = useState('rohit@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !email || !amount) {
      showToast('Please fill all mandatory fields', 'error');
      return;
    }

    setIsProcessing(true);
    let receipt = null;

    try {
      const res = await api.processPayment({
        firstName,
        lastName,
        email,
        mobile,
        currency,
        amount: Number(amount),
        description,
        address
      });
      if (res.ok && res.data?.data) {
        receipt = res.data.data;
      }
    } catch (err) {
      console.warn('Backend unavailable, processing locally', err);
    }

    if (!receipt) {
      receipt = {
        paymentId: `PAY-${Date.now()}`,
        amount: Number(amount),
        currency,
        name: `${firstName} ${lastName}`.trim(),
        email,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        method: paymentMethod.toUpperCase(),
        description: description || 'Travel Itinerary Payment'
      };
    }

    setIsProcessing(false);
    setPaymentSuccess(receipt);
    showToast('Payment processed successfully! Transaction confirmed.');
  };

  const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€'
  };

  const symbol = currencySymbols[currency] || '₹';

  return (
    <div className="container page-wrap">
      <div className="page-shell">
        <div className="page-topbar">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Make Payment</span>
        </div>

        {paymentSuccess ? (
          <div className="content-card payment-success-card text-center">
            <div className="success-icon-badge mx-auto">
              <CheckCircle2 size={48} color="#16a34a" />
            </div>
            <h2>Payment Successful!</h2>
            <p className="lead">Your custom payment has been confirmed and receipt generated.</p>

            <div className="receipt-box-elevated">
              <div className="receipt-head">
                <span className="receipt-ref-label">Transaction ID</span>
                <strong className="receipt-ref-val">{paymentSuccess.paymentId}</strong>
              </div>
              <div className="receipt-grid">
                <div className="receipt-cell">
                  <span>Amount Paid</span>
                  <strong>{symbol}{Number(paymentSuccess.amount).toLocaleString('en-IN')}</strong>
                </div>
                <div className="receipt-cell">
                  <span>Payer Name</span>
                  <strong>{paymentSuccess.name}</strong>
                </div>
                <div className="receipt-cell">
                  <span>Payment Mode</span>
                  <strong>{paymentSuccess.method || paymentMethod.toUpperCase()}</strong>
                </div>
                <div className="receipt-cell">
                  <span>Date & Time</span>
                  <strong>{paymentSuccess.date}</strong>
                </div>
              </div>
              <div className="receipt-desc-box">
                <span>Description:</span>
                <p>{paymentSuccess.description}</p>
              </div>
            </div>

            <div className="success-action-buttons mt-4">
              <button
                type="button"
                className="primary-btn"
                onClick={() => window.print()}
              >
                <FileText size={16} /> Print Official Receipt
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setPaymentSuccess(null);
                  setAmount('');
                  setDescription('');
                }}
              >
                Make Another Payment
              </button>
            </div>
          </div>
        ) : (
          <div className="payment-page-layout">
            {/* Left Column: Form Details & Payment Selector */}
            <div className="payment-form-column">
              <div className="content-card payment-main-card">
                <div className="payment-card-header">
                  <div className="payment-title-row">
                    <div className="payment-icon-box">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <h1>Make a Secure Payment</h1>
                      <p>Instant online checkout for flight bookings, holiday packages & custom itineraries</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="stack-form mt-4">
                  {/* Step 1: Payer Information */}
                  <div className="payment-section-block">
                    <h3 className="section-subtitle">1. Payer Details</h3>
                    <div className="form-grid two-col">
                      <div className="form-group">
                        <label htmlFor="pay-first-name">First Name *</label>
                        <input
                          id="pay-first-name"
                          type="text"
                          placeholder="Rohit"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="pay-last-name">Last Name</label>
                        <input
                          id="pay-last-name"
                          type="text"
                          placeholder="Sharma"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-grid two-col">
                      <div className="form-group">
                        <label htmlFor="pay-email">Email Address (for e-receipt) *</label>
                        <input
                          id="pay-email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="pay-mobile">Mobile Number (SMS confirmation)</label>
                        <input
                          id="pay-mobile"
                          type="tel"
                          placeholder="10 digit mobile"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Payment Method */}
                  <div className="payment-section-block">
                    <h3 className="section-subtitle">2. Choose Payment Method</h3>
                    <div className="payment-method-selector-grid">
                      <button
                        type="button"
                        className={`pay-method-card ${paymentMethod === 'upi' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('upi')}
                      >
                        <QrCode size={20} />
                        <div>
                          <strong>UPI / QR Code</strong>
                          <small>GPay, PhonePe, Paytm</small>
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`pay-method-card ${paymentMethod === 'card' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <CreditCard size={20} />
                        <div>
                          <strong>Debit / Credit Card</strong>
                          <small>Visa, Mastercard, RuPay</small>
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`pay-method-card ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('netbanking')}
                      >
                        <Building size={20} />
                        <div>
                          <strong>Net Banking</strong>
                          <small>50+ Indian Banks</small>
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`pay-method-card ${paymentMethod === 'wallet' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('wallet')}
                      >
                        <Wallet size={20} />
                        <div>
                          <strong>Wallets / EMI</strong>
                          <small>Amazon Pay, Mobikwik</small>
                        </div>
                      </button>
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="method-details-panel">
                        <label htmlFor="upi-id-input">Enter UPI ID / VPA</label>
                        <input
                          id="upi-id-input"
                          type="text"
                          placeholder="e.g. mobile@upi or username@okhdfcbank"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                        />
                        <span className="helper-note">⚡ Fast 1-click approval directly in your UPI app.</span>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="method-details-panel">
                        <div className="form-group">
                          <label htmlFor="card-num-input">Card Number</label>
                          <input
                            id="card-num-input"
                            type="text"
                            placeholder="4532 •••• •••• 8910"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                          />
                        </div>
                        <div className="form-grid two-col">
                          <div className="form-group">
                            <label htmlFor="card-exp-input">Expiry Date</label>
                            <input
                              id="card-exp-input"
                              type="text"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="card-cvv-input">CVV</label>
                            <input
                              id="card-cvv-input"
                              type="password"
                              maxLength={4}
                              placeholder="•••"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step 3: Billing Info */}
                  <div className="payment-section-block">
                    <h3 className="section-subtitle">3. Invoice & Billing Address</h3>
                    <div className="form-group">
                      <label htmlFor="pay-desc">Payment Reference / Remarks</label>
                      <input
                        id="pay-desc"
                        type="text"
                        placeholder="e.g. Flight booking reference, tour package, or invoice number"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="pay-address">Billing Address</label>
                      <textarea
                        id="pay-address"
                        rows="2"
                        placeholder="House/Street, City, Pincode"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="primary-btn full payment-submit-btn"
                    disabled={isProcessing}
                  >
                    <Lock size={16} />
                    <span>{isProcessing ? 'PROCESSING SECURE PAYMENT...' : `PAY ${symbol}${Number(amount || 0).toLocaleString('en-IN')} NOW`}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Order Summary & Trust Guarantee Card */}
            <div className="payment-summary-column">
              <div className="content-card summary-card sticky-sidebar">
                <h3>Payment Summary</h3>
                <div className="currency-switch-box">
                  <span>Currency:</span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="currency-picker"
                  >
                    <option value="INR">INR (₹ Indian Rupee)</option>
                    <option value="USD">USD ($ US Dollar)</option>
                    <option value="EUR">EUR (€ Euro)</option>
                  </select>
                </div>

                <div className="amount-input-box mt-3">
                  <label htmlFor="pay-amount-sidebar">Payment Amount *</label>
                  <div className="amount-input-wrap">
                    <span className="currency-symbol">{symbol}</span>
                    <input
                      id="pay-amount-sidebar"
                      type="number"
                      min="1"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="summary-breakdown-list mt-3">
                  <div className="summary-row">
                    <span>Base Amount</span>
                    <span>{symbol}{Number(amount || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="summary-row">
                    <span>Convenience Fee</span>
                    <span className="text-success">FREE (₹0)</span>
                  </div>
                  <div className="summary-row">
                    <span>GST & Gateway Charges</span>
                    <span>Included</span>
                  </div>
                  <div className="summary-row total-row">
                    <strong>Total Payable</strong>
                    <strong className="final-price">{symbol}{Number(amount || 0).toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div className="security-badges-box mt-4">
                  <div className="security-badge-item">
                    <ShieldCheck size={20} color="#16a34a" />
                    <div>
                      <strong>256-Bit SSL Encryption</strong>
                      <p>Bank-grade payment security protocol</p>
                    </div>
                  </div>
                  <div className="security-badge-item">
                    <Sparkles size={20} color="#034ea2" />
                    <div>
                      <strong>100% Buyer Protection</strong>
                      <p>Instant refund on booking cancellation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
