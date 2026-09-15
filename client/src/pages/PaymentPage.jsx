import { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { CreditCard, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export default function PaymentPage() {
  const { showToast } = useBooking();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !email || !amount) {
      showToast('Please fill all mandatory fields', 'error');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const receipt = {
        paymentId: `PAY-${Date.now()}`,
        amount,
        currency,
        name: `${firstName} ${lastName}`.trim(),
        email,
        date: new Date().toLocaleDateString('en-IN')
      };
      setPaymentSuccess(receipt);
      showToast('Payment processed successfully!');
    }, 1200);
  };

  return (
    <div className="container page-wrap">
      <div className="page-shell narrow">
        <div className="page-topbar">
          <span>Home</span>
          <span>/</span>
          <span>Make Payment</span>
        </div>

        {paymentSuccess ? (
          <div className="content-card payment-success-card text-center">
            <CheckCircle2 size={56} color="#16a34a" className="mx-auto" />
            <h2>Payment Successful!</h2>
            <p className="lead">Your transaction has been processed securely.</p>

            <div className="receipt-box">
              <div className="receipt-row">
                <span>Transaction Reference:</span>
                <strong>{paymentSuccess.paymentId}</strong>
              </div>
              <div className="receipt-row">
                <span>Amount Paid:</span>
                <strong>₹{Number(paymentSuccess.amount).toLocaleString('en-IN')}</strong>
              </div>
              <div className="receipt-row">
                <span>Paid By:</span>
                <strong>{paymentSuccess.name}</strong>
              </div>
              <div className="receipt-row">
                <span>Date:</span>
                <strong>{paymentSuccess.date}</strong>
              </div>
            </div>

            <button
              type="button"
              className="primary-btn mt-4"
              onClick={() => {
                setPaymentSuccess(null);
                setFirstName('');
                setLastName('');
                setEmail('');
                setMobile('');
                setAmount('');
                setDescription('');
                setAddress('');
              }}
            >
              Make Another Payment
            </button>
          </div>
        ) : (
          <div className="content-card form-card">
            <div className="payment-page-head">
              <div className="head-icon-box">
                <CreditCard size={24} />
              </div>
              <div>
                <h1>Make Payment</h1>
                <p>Secure online portal for custom bookings and itinerary payments</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="explore-payment-form">
              <div className="payment-field-row">
                <span className="field-label">First Name *</span>
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="payment-field-row">
                <span className="field-label">Last Name</span>
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="payment-field-row">
                <span className="field-label">Email Address *</span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="payment-field-row">
                <span className="field-label">Mobile Number</span>
                <input
                  type="tel"
                  placeholder="10 digit mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              <div className="payment-field-row">
                <span className="field-label">Amount (INR) *</span>
                <div className="amount-input-composite">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="currency-select"
                  >
                    <option value="INR">India (INR)</option>
                    <option value="USD">USA (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="payment-field-row">
                <span className="field-label">Payment Description</span>
                <input
                  type="text"
                  placeholder="e.g. Flight booking reference or custom tour"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="payment-field-row">
                <span className="field-label">Billing Address</span>
                <textarea
                  rows="2"
                  placeholder="Address, City, Pincode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="payment-field-row action-row">
                <span className="field-label">Process Payment</span>
                <button
                  type="submit"
                  className="process-payment-btn"
                  disabled={isProcessing}
                >
                  <Lock size={15} />
                  <span>{isProcessing ? 'PROCESSING...' : 'PROCESS PAYMENT'}</span>
                </button>
              </div>
            </form>

            <div className="payment-security-footer">
              <ShieldCheck size={18} color="#16a34a" />
              <span>256-Bit SSL Encrypted & Verified Transaction</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
