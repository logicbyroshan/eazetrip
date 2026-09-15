import { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContactPage() {
  const { showToast } = useBooking();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [captchaCode, setCaptchaCode] = useState('9W4K8');
  const [captchaInput, setCaptchaInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = '';
    for (let i = 0; i < 5; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(res);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (captchaInput.toUpperCase() !== captchaCode) {
      showToast('Invalid captcha code entered.', 'error');
      return;
    }

    setSubmitted(true);
    showToast('Your message has been sent to our customer care team!');
  };

  return (
    <div className="container page-wrap">
      <div className="page-shell">
        <div className="page-topbar">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Contact Us</span>
        </div>

        <div className="contact-layout-grid">
          {/* Left Contact Information */}
          <div className="contact-info-col">
            <div className="content-card info-card-themed">
              <span className="section-tag">24/7 HELPDESK</span>
              <h2>Get in Touch with ExploreEase</h2>
              <p>
                Have questions regarding your flight booking, hotel check-in, or need emergency cancellation assistance? Our dedicated support team is available round the clock.
              </p>

              <div className="contact-details-stack mt-4">
                <div className="contact-box-item">
                  <div className="contact-icon-box">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <strong>Corporate Headquarters</strong>
                    <p>Saubhagya Bindiya Tower, MP, India</p>
                  </div>
                </div>

                <div className="contact-box-item">
                  <div className="contact-icon-box">
                    <Phone size={20} />
                  </div>
                  <div>
                    <strong>Customer Support Helpline</strong>
                    <p><a href="tel:+918269054018">+91 8269054018</a> (Toll-Free)</p>
                  </div>
                </div>

                <div className="contact-box-item">
                  <div className="contact-icon-box">
                    <Mail size={20} />
                  </div>
                  <div>
                    <strong>Official Email Support</strong>
                    <p><a href="mailto:priyansh@exploreeaz.com">priyansh@exploreeaz.com</a></p>
                  </div>
                </div>

                <div className="contact-box-item">
                  <div className="contact-icon-box">
                    <Clock size={20} />
                  </div>
                  <div>
                    <strong>Operating Hours</strong>
                    <p>24 Hours / 7 Days a Week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="contact-form-col">
            <div className="content-card form-card">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and an agent will respond within 30 minutes.</p>

              {submitted ? (
                <div className="contact-success-state text-center py-4">
                  <CheckCircle2 size={48} color="#16a34a" className="mx-auto mb-2" />
                  <h3>Thank You for Contacting Us!</h3>
                  <p>Your inquiry reference #INQ-{Math.floor(10000 + Math.random() * 90000)} has been registered. Our representative will contact you shortly.</p>
                  <button
                    type="button"
                    className="primary-btn mt-3"
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setSubject('');
                      setMessage('');
                      setCaptchaInput('');
                      refreshCaptcha();
                    }}
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="stack-form mt-3">
                  <div className="form-grid two-col">
                    <div className="form-group">
                      <label>Your Full Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Priyansh Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid two-col">
                    <div className="form-group">
                      <label>Mobile Number</label>
                      <input
                        type="tel"
                        placeholder="10 digit phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Subject</label>
                      <input
                        type="text"
                        placeholder="e.g. Flight Rescheduling Request"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Message / Inquiry Details *</label>
                    <textarea
                      rows="4"
                      placeholder="Please provide booking ID if applicable..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  {/* Captcha */}
                  <div className="form-group captcha-group">
                    <label>Security Captcha</label>
                    <div className="captcha-row">
                      <div className="captcha-badge">{captchaCode}</div>
                      <button
                        type="button"
                        className="captcha-refresh-btn"
                        onClick={refreshCaptcha}
                        title="Refresh Captcha"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <input
                        type="text"
                        placeholder="Enter text"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                        maxLength={5}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="primary-btn full send-inquiry-btn">
                    <Send size={16} />
                    <span>SEND MESSAGE</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
