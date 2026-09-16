/**
 * refundService.js - EazeTrip Refund & Cancellation Engine
 * Handles penalty calculations, payout mode routing, ARN generation,
 * 4-step progress timeline tracking, and auto-notification dispatch.
 */

const mockStore = require('../data/mockStore');
const notificationService = require('./notificationService');

// In-memory refund store initialized with demo records for testing and customer lookup
let mockRefunds = [
  {
    id: 'RFND-10492',
    bookingId: 'BK-1002',
    pnr: 'AI-204928',
    customerName: 'Priyansh Sharma',
    customerEmail: 'priyansh.sharma@gmail.com',
    customerPhone: '9876543210',
    serviceType: 'flight',
    serviceTitle: 'IndiGo 6E-204 • New Delhi to Mumbai',
    grossAmount: 4899,
    penaltyAmount: 1200,
    serviceFeeWaiver: 300,
    netRefundAmount: 3699,
    payoutMode: 'wallet',
    payoutDetails: 'Instant EazeWallet Credit (+ ₹200 Voucher)',
    arnNumber: 'ARN-IND883920194821',
    status: 'Completed',
    statusStep: 4,
    reason: 'Travel plan changed',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    timeline: [
      {
        step: 1,
        title: 'Refund Request Registered',
        desc: 'Request submitted online via EazeTrip portal with selected payout destination.',
        time: new Date(Date.now() - 36 * 3600 * 1000).toLocaleString('en-IN'),
        completed: true
      },
      {
        step: 2,
        title: 'Airline Fare Rule Verification',
        desc: 'IndiGo fare rules verified under DGCA cancellation slab. Penalty ₹1,200 deducted.',
        time: new Date(Date.now() - 24 * 3600 * 1000).toLocaleString('en-IN'),
        completed: true
      },
      {
        step: 3,
        title: 'Payment Gateway Disbursement',
        desc: 'Disbursement executed. Bank reference ARN-IND883920194821 generated.',
        time: new Date(Date.now() - 12 * 3600 * 1000).toLocaleString('en-IN'),
        completed: true
      },
      {
        step: 4,
        title: 'Credited to EazeWallet',
        desc: 'Net amount ₹3,699 credited to your EazeTrip wallet balance with 1-year validity.',
        time: new Date(Date.now() - 2 * 3600 * 1000).toLocaleString('en-IN'),
        completed: true
      }
    ]
  },
  {
    id: 'RFND-20941',
    bookingId: 'BK-1003',
    pnr: 'HTL-882194',
    customerName: 'Ananya Verma',
    customerEmail: 'ananya.v@example.com',
    customerPhone: '9812345678',
    serviceType: 'hotel',
    serviceTitle: 'The Taj Mahal Palace • Mumbai Deluxe Room',
    grossAmount: 8500,
    penaltyAmount: 0,
    serviceFeeWaiver: 500,
    netRefundAmount: 8500,
    payoutMode: 'original_mode',
    payoutDetails: 'Original Payment Source (HDFC UPI)',
    arnNumber: 'ARN-HDFC77281940129',
    status: 'In Progress',
    statusStep: 3,
    reason: 'Personal emergency',
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    completedAt: null,
    timeline: [
      {
        step: 1,
        title: 'Refund Request Registered',
        desc: 'Free cancellation verified within 48h check-in window. Zero penalty applied.',
        time: new Date(Date.now() - 14 * 3600 * 1000).toLocaleString('en-IN'),
        completed: true
      },
      {
        step: 2,
        title: 'Hotel Partner Confirmation',
        desc: 'Taj Mahal Palace front desk approved full booking cancellation.',
        time: new Date(Date.now() - 8 * 3600 * 1000).toLocaleString('en-IN'),
        completed: true
      },
      {
        step: 3,
        title: 'Banking Gateway Routing',
        desc: 'Refund batch transmitted to NPCI / HDFC Bank. ARN generated.',
        time: new Date(Date.now() - 1 * 3600 * 1000).toLocaleString('en-IN'),
        completed: true
      },
      {
        step: 4,
        title: 'Credit to Account',
        desc: 'Expected to reflect in HDFC Bank account within 24 to 48 hours.',
        time: 'Estimated by tomorrow 5:00 PM',
        completed: false
      }
    ]
  }
];

/**
 * Calculate refund breakdown and penalties based on service type & notice time
 */
function calculateRefund({ serviceType = 'flight', grossAmount = 3000, hoursBeforeDeparture = 48, hasShield = false }) {
  const amount = Number(grossAmount) || 0;
  const hours = Number(hoursBeforeDeparture) || 24;
  let penaltyRate = 0;
  let fixedPenalty = 0;
  let serviceFeeWaiver = 0;
  let penaltyDescription = '';

  if (hasShield) {
    // Zero Cancellation Shield eliminates operator penalty
    penaltyRate = 0;
    fixedPenalty = 0;
    penaltyDescription = 'Zero Cancellation Shield Active (100% Penalty Waived)';
  } else {
    switch (serviceType.toLowerCase()) {
      case 'flight':
        if (hours >= 72) {
          fixedPenalty = Math.min(1500, amount * 0.25);
          penaltyDescription = 'Standard Airline Slab (>72h before departure)';
        } else if (hours >= 24) {
          fixedPenalty = Math.min(2500, amount * 0.4);
          penaltyDescription = 'Airline Cancellation Penalty (24h-72h)';
        } else if (hours >= 4) {
          fixedPenalty = Math.min(3500, amount * 0.7);
          penaltyDescription = 'Urgent Airline Penalty (4h-24h)';
        } else {
          fixedPenalty = amount * 0.95;
          penaltyDescription = 'Last-minute cancellation (<4h departure)';
        }
        serviceFeeWaiver = 250;
        break;

      case 'hotel':
        if (hours >= 24) {
          fixedPenalty = 0;
          penaltyDescription = 'Free Cancellation Window Active (>24h check-in)';
        } else if (hours >= 12) {
          penaltyRate = 0.5;
          penaltyDescription = 'Late cancellation fee (1st night rate)';
        } else {
          penaltyRate = 1.0;
          penaltyDescription = 'Non-refundable within 12h of check-in';
        }
        break;

      case 'bus':
        if (hours >= 12) {
          penaltyRate = 0.15;
          penaltyDescription = 'Standard Bus Operator Cancellation (15% deduction)';
        } else if (hours >= 4) {
          penaltyRate = 0.35;
          penaltyDescription = 'Bus Notice Cancellation (35% deduction)';
        } else {
          penaltyRate = 0.8;
          penaltyDescription = 'Immediate Bus Departure Notice (80% deduction)';
        }
        break;

      case 'train':
      case 'railway':
        if (hours >= 48) {
          fixedPenalty = 180;
          penaltyDescription = 'IRCTC Standard Clerkage Fee (>48h)';
        } else if (hours >= 12) {
          penaltyRate = 0.25;
          penaltyDescription = 'IRCTC Cancellation Slab (25% deduction)';
        } else if (hours >= 4) {
          penaltyRate = 0.5;
          penaltyDescription = 'IRCTC Charting Window (50% deduction)';
        } else {
          fixedPenalty = amount;
          penaltyDescription = 'Post-charting non-refundable (Requires TDR)';
        }
        break;

      default:
        penaltyRate = 0.2;
        penaltyDescription = 'Standard Package Cancellation Surcharge';
    }
  }

  const calculatedPenalty = Math.round(fixedPenalty > 0 ? fixedPenalty : amount * penaltyRate);
  const penaltyAmount = Math.min(amount, Math.max(0, calculatedPenalty));
  const netRefundAmount = Math.max(0, amount - penaltyAmount);

  return {
    serviceType,
    grossAmount: amount,
    hoursBeforeDeparture: hours,
    hasShield: Boolean(hasShield),
    penaltyAmount,
    penaltyDescription,
    serviceFeeWaiver,
    netRefundAmount,
    bonusWalletCredits: Math.round(netRefundAmount * 0.05 + 100),
    estimatedCreditTime: {
      wallet: 'Instant (0 Seconds)',
      upi: '2 to 24 Hours',
      card_netbanking: '3 to 5 Banking Days'
    }
  };
}

/**
 * Register a new cancellation and refund request
 */
function createRefundRequest({
  bookingId,
  pnr,
  customerName,
  customerEmail,
  customerPhone,
  serviceType = 'flight',
  serviceTitle = 'Travel Booking',
  grossAmount = 3000,
  reason = 'Travel plans changed',
  payoutMode = 'wallet', // 'wallet' | 'original_mode' | 'bank_transfer' | 'upi'
  payoutDetails = '',
  bankAccount = '',
  ifscCode = '',
  upiId = '',
  hasShield = false,
  selectedPassengers = []
}) {
  const calculation = calculateRefund({
    serviceType,
    grossAmount,
    hoursBeforeDeparture: 48,
    hasShield
  });

  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const refundId = `RFND-${randomNum}`;
  const arnNumber = `ARN-${serviceType.toUpperCase().slice(0, 3)}${Math.floor(100000000000 + Math.random() * 900000000000)}`;

  let formattedPayout = '';
  let status = 'In Progress';
  let statusStep = 2;

  if (payoutMode === 'wallet') {
    formattedPayout = `Instant EazeWallet (+ ₹${calculation.bonusWalletCredits} Bonus Voucher)`;
    status = 'Completed';
    statusStep = 4;
  } else if (payoutMode === 'upi') {
    formattedPayout = `UPI ID: ${upiId || 'Linked UPI ID'}`;
  } else if (payoutMode === 'bank_transfer') {
    formattedPayout = `Bank A/C: •••• ${bankAccount.slice(-4) || '3821'} (IFSC: ${ifscCode || 'HDFC0000123'})`;
  } else {
    formattedPayout = payoutDetails || 'Original Payment Source (Cards / UPI / NetBanking)';
  }

  const now = new Date();
  const timeline = [
    {
      step: 1,
      title: 'Refund Request Registered',
      desc: `Cancellation for Booking #${bookingId || 'EZT'} submitted. Reason: ${reason}.`,
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      completed: true
    },
    {
      step: 2,
      title: 'Operator & Fare Rule Verification',
      desc: `${calculation.penaltyDescription}. Net refund ₹${calculation.netRefundAmount.toLocaleString('en-IN')} approved.`,
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      completed: true
    },
    {
      step: 3,
      title: 'Banking Gateway Routing',
      desc: payoutMode === 'wallet'
        ? 'Internal ledger credit processed directly to customer account.'
        : `Disbursement transmitted to banking gateway with Reference Code ${arnNumber}.`,
      time: payoutMode === 'wallet' ? now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'In Progress',
      completed: payoutMode === 'wallet'
    },
    {
      step: 4,
      title: payoutMode === 'wallet' ? 'Credited to EazeWallet' : 'Credit to Bank / Original Source',
      desc: payoutMode === 'wallet'
        ? `₹${calculation.netRefundAmount.toLocaleString('en-IN')} credited to EazeWallet instantly.`
        : `Amount ₹${calculation.netRefundAmount.toLocaleString('en-IN')} will reflect in account per bank cycle.`,
      time: payoutMode === 'wallet' ? now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Estimated 24-48 hrs',
      completed: payoutMode === 'wallet'
    }
  ];

  const newRefund = {
    id: refundId,
    bookingId: bookingId || `BK-${randomNum}`,
    pnr: pnr || `PNR-${randomNum}`,
    customerName: customerName || 'Traveler',
    customerEmail: customerEmail || 'guest@eazetrip.com',
    customerPhone: customerPhone || '9876543210',
    serviceType,
    serviceTitle,
    grossAmount: calculation.grossAmount,
    penaltyAmount: calculation.penaltyAmount,
    serviceFeeWaiver: calculation.serviceFeeWaiver,
    netRefundAmount: calculation.netRefundAmount,
    payoutMode,
    payoutDetails: formattedPayout,
    arnNumber,
    status,
    statusStep,
    reason,
    selectedPassengers,
    createdAt: now.toISOString(),
    completedAt: payoutMode === 'wallet' ? now.toISOString() : null,
    timeline
  };

  mockRefunds.unshift(newRefund);

  // Update corresponding booking in mockStore if available
  try {
    const targetBooking = mockStore.bookings?.find((b) => b.id === bookingId || b.pnr === pnr);
    if (targetBooking) {
      targetBooking.status = 'Cancelled';
      targetBooking.refundStatus = `Refund ${status}: ₹${calculation.netRefundAmount} to ${payoutMode === 'wallet' ? 'EazeWallet' : 'Original Mode'}`;
      targetBooking.cancellationReason = reason;
      targetBooking.refundId = refundId;
    }
  } catch (err) {
    console.warn('mockStore sync error in refundService', err);
  }

  // Trigger Multi-Channel Auto-Notification via notificationService
  try {
    notificationService.enqueueNotification({
      type: 'trip_pnr',
      title: `Refund Initiated for Booking #${bookingId || refundId}`,
      message: `Your cancellation request for ${serviceTitle} has been processed. Net refund amount of ₹${calculation.netRefundAmount.toLocaleString('en-IN')} has been approved under Tracking ID ${refundId} (Ref: ${arnNumber}). Payout: ${formattedPayout}.`,
      actionUrl: `/cancellation-refund?ref=${refundId}`,
      recipientEmail: customerEmail || 'guest@eazetrip.com',
      recipientPhone: customerPhone || '9876543210',
      channels: ['in_app', 'email', 'whatsapp'],
      userId: customerEmail || 'guest'
    });
  } catch (notifErr) {
    console.warn('Refund notification enqueue failed:', notifErr.message);
  }

  return newRefund;
}

/**
 * Lookup refund by Refund ID, PNR, or Booking ID
 */
function getRefundByQuery(query = '') {
  if (!query) return null;
  const q = query.trim().toUpperCase();
  return (
    mockRefunds.find(
      (r) =>
        r.id?.toUpperCase() === q ||
        r.bookingId?.toUpperCase() === q ||
        r.pnr?.toUpperCase() === q ||
        r.arnNumber?.toUpperCase() === q
    ) || null
  );
}

/**
 * Get all refunds for a user
 */
function getAllRefunds(userIdOrEmail = '') {
  if (!userIdOrEmail) return mockRefunds;
  const q = userIdOrEmail.toLowerCase();
  return mockRefunds.filter(
    (r) =>
      r.customerEmail?.toLowerCase() === q ||
      r.customerPhone?.includes(q) ||
      r.customerName?.toLowerCase().includes(q)
  );
}

module.exports = {
  calculateRefund,
  createRefundRequest,
  getRefundByQuery,
  getAllRefunds
};
