/**
 * EazeTrip Smart Notification Engine
 * Multi-Channel Dispatch (Email, WhatsApp, In-App)
 * Personalized Customer Re-engagement Campaigns
 * Fault-Tolerant Delivery Queue with Exponential Backoff & Dead-Letter Queue (DLQ)
 */

const crypto = require('crypto');

// In-Memory State Stores
const inAppNotifications = [
  {
    id: 'NOTIF-101',
    userId: 'USR-1',
    category: 'offer',
    title: '🌴 We Miss You! Exclusive 25% Off Your Next Holiday',
    message: 'It has been 3 months since your last trip with EazeTrip! Enjoy 25% OFF on Goa & Kashmir packages with promo code HOLIDAY25.',
    actionUrl: '/holidays',
    actionLabel: 'Claim 25% Off',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    read: false,
    priority: 'high',
    channelsDelivered: ['email', 'whatsapp', 'in_app']
  },
  {
    id: 'NOTIF-102',
    userId: 'USR-1',
    category: 'trip',
    title: '✈️ Flight Booking Confirmed (PNR: FL2775)',
    message: 'Your flight IndiGo 6E-2041 from Mumbai (BOM) to New Delhi (DEL) on 24 Sep is confirmed. E-Ticket ready for download.',
    actionUrl: '/profile',
    actionLabel: 'View E-Ticket',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    read: true,
    priority: 'high',
    channelsDelivered: ['email', 'whatsapp', 'in_app']
  },
  {
    id: 'NOTIF-103',
    userId: 'USR-1',
    category: 'alert',
    title: '📉 Price Drop Alert: Mumbai → Goa Fares Down 20%',
    message: 'Flight prices for Mumbai to Goa dropped from ₹4,500 to ₹3,599 for next weekend. Book before seats sell out!',
    actionUrl: '/flights?from=BOM&to=GOI',
    actionLabel: 'Book Now',
    timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    read: true,
    priority: 'medium',
    channelsDelivered: ['whatsapp', 'in_app']
  }
];

const deliveryQueue = [];
const deliveredArchive = [];
const deadLetterQueue = [];

const userPreferences = {
  'USR-1': {
    email: true,
    whatsapp: true,
    sms: false,
    push: true,
    tripUpdates: true,
    promotionalOffers: true,
    priceDropAlerts: true
  }
};

// ==========================================
// 1. TEMPLATE RENDERERS
// ==========================================

/**
 * Generates high-fidelity HTML Email template
 */
function renderHtmlEmail(type, data) {
  const brandBlue = '#034ea2';
  const brandSky = '#0077b6';
  const accentAmber = '#ea580c';
  const recipientName = data.name || 'Valued Traveler';

  let headerTitle = 'EazeTrip Travel Notification';
  let bannerEmoji = '✈️';
  let bodyContent = '';
  let ctaText = 'Explore on EazeTrip';
  let ctaUrl = 'https://eazetrip.com';

  switch (type) {
    case 'reengagement_inactivity':
      headerTitle = '🌴 We Miss Having You Onboard!';
      bannerEmoji = '🏖️';
      ctaText = 'Claim 25% Off Holiday Packages';
      ctaUrl = 'https://eazetrip.com/holidays';
      bodyContent = `
        <div style="background: #f0f9ff; border-left: 4px solid ${brandSky}; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin: 0 0 8px 0; color: ${brandBlue}; font-size: 18px;">Special Re-engagement Gift For You</h3>
          <p style="margin: 0; color: #334155; line-height: 1.5;">
            It has been <strong>${data.monthsInactive || 3} months</strong> since your last journey. To welcome you back, here is an exclusive <strong>25% OFF discount voucher</strong> curated specially for your next getaway!
          </p>
          <div style="margin-top: 14px; text-align: center;">
            <span style="display: inline-block; background: #fff; border: 2px dashed ${brandBlue}; color: ${brandBlue}; font-weight: bold; font-size: 18px; padding: 8px 24px; border-radius: 6px; letter-spacing: 2px;">
              ${data.promoCode || 'HOLIDAY25'}
            </span>
          </div>
        </div>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          Recommended destinations for you this season: <strong>Goa Beachfronts</strong>, <strong>Kashmir Paradise</strong>, and <strong>Royal Rajasthan Havelis</strong>.
        </p>
      `;
      break;

    case 'booking_confirmation':
      headerTitle = `🎉 Booking Confirmed! PNR: ${data.pnr || 'EZ9900'}`;
      bannerEmoji = '🎟️';
      ctaText = 'View & Download E-Ticket';
      ctaUrl = `https://eazetrip.com/manage-bookings?pnr=${data.pnr || ''}`;
      bodyContent = `
        <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin: 0 0 8px 0; color: #065f46; font-size: 18px;">Your Itinerary is Confirmed</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #1e293b;">
            <tr><td style="padding: 6px 0; color: #64748b;">Service Type:</td><td style="font-weight: 600; text-align: right;">${data.serviceType || 'Flight'}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">PNR / Booking ID:</td><td style="font-weight: 700; color: ${brandBlue}; text-align: right;">${data.pnr || 'EZ9900'}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Route / Details:</td><td style="font-weight: 600; text-align: right;">${data.route || 'Mumbai (BOM) → New Delhi (DEL)'}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Date & Time:</td><td style="font-weight: 600; text-align: right;">${data.travelDate || '24 Sep 2026, 06:00 AM'}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Lead Passenger:</td><td style="font-weight: 600; text-align: right;">${recipientName}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Total Paid:</td><td style="font-weight: 700; color: #047857; text-align: right;">₹${(data.amount || 4999).toLocaleString('en-IN')}</td></tr>
          </table>
        </div>
      `;
      break;

    case 'trip_reminder':
      headerTitle = `⏰ Upcoming Trip Reminder: ${data.route || 'DEL → BOM'}`;
      bannerEmoji = '🛫';
      ctaText = 'Proceed to Web Check-in';
      ctaUrl = 'https://eazetrip.com/profile';
      bodyContent = `
        <p style="color: #334155; font-size: 15px; line-height: 1.6;">
          Your trip is scheduled in <strong>24 hours</strong>. Please keep your valid Government Photo ID ready and complete mandatory web check-in.
        </p>
      `;
      break;

    default:
      bodyContent = `<p style="color: #334155; font-size: 15px; line-height: 1.6;">${data.message || 'You have a new update regarding your EazeTrip account.'}</p>`;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${headerTitle}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f1f5f9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, ${brandBlue} 0%, ${brandSky} 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
        <div style="font-size: 32px; margin-bottom: 6px;">${bannerEmoji}</div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">EazeTrip</h1>
        <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px;">Luxury & Seamless Travel Solutions</p>
      </td>
    </tr>
    <!-- Main Content -->
    <tr>
      <td style="padding: 30px 24px;">
        <h2 style="margin: 0 0 12px 0; color: #0f172a; font-size: 20px; font-weight: 600;">Dear ${recipientName},</h2>
        ${bodyContent}
        <div style="margin: 30px 0 20px 0; text-align: center;">
          <a href="${ctaUrl}" style="display: inline-block; background: ${brandBlue}; color: #ffffff; text-decoration: none; padding: 14px 28px; font-size: 15px; font-weight: 600; border-radius: 8px; box-shadow: 0 2px 8px rgba(3, 78, 162, 0.3);">
            ${ctaText} →
          </a>
        </div>
        <p style="margin: 24px 0 0 0; color: #94a3b8; font-size: 12px; text-align: center; line-height: 1.5;">
          Need assistance? 24/7 Support: support@eazetrip.com | +91 82690 54018<br/>
          Saubhagya Bindiya Tower, MP, India.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generates formatted WhatsApp Markdown message
 */
function renderWhatsAppMessage(type, data) {
  const recipientName = data.name || 'Valued Traveler';

  switch (type) {
    case 'reengagement_inactivity':
      return `🌴 *EAZE TRIP EXCLUSIVE HOLIDAY OFFER* 🌴

Dear *${recipientName}*,

We noticed it has been *${data.monthsInactive || 3} months* since your last journey with us! We have hand-picked special holiday packages just for you:

✨ *Offer Details:*
• *Discount:* 25% Instant OFF
• *Promo Code:* *${data.promoCode || 'HOLIDAY25'}*
• *Popular Packages:* Goa Beachfronts, Kashmir Paradise, Kerala Backwaters

👉 *Book Now & Claim Offer:* https://eazetrip.com/holidays?promo=${data.promoCode || 'HOLIDAY25'}

_Need instant booking support? Reply HELP or call +91 82690 54018_`;

    case 'booking_confirmation':
      return `🎟️ *EAZE TRIP - BOOKING CONFIRMED* 🎟️

Dear *${recipientName}*,

Your booking is confirmed! Here is your quick trip summary:

• *PNR / Ticket No:* *${data.pnr || 'FL2775'}*
• *Service:* ${data.serviceType || 'Flight'} (${data.carrier || 'IndiGo 6E-2041'})
• *Route:* ${data.route || 'BOM → DEL'}
• *Travel Date:* ${data.travelDate || '24 Sep 2026, 06:00 AM'}
• *Status:* *CONFIRMED & PAID* (₹${(data.amount || 4999).toLocaleString('en-IN')})

📲 *Download Official E-Ticket Voucher:*
https://eazetrip.com/manage-bookings?pnr=${data.pnr || 'FL2775'}

_Have a wonderful journey! Team EazeTrip ✈️_`;

    case 'trip_reminder':
      return `⏰ *EAZE TRIP - TRIP REMINDER* ⏰

Dear *${recipientName}*,

Your flight *${data.carrier || 'IndiGo 6E-2041'}* from *${data.route || 'BOM → DEL'}* departs in *24 hours* (${data.travelDate || '24 Sep, 06:00 AM'}).

✅ *Web Check-in is now open:*
https://eazetrip.com/profile

Please carry a valid Govt Photo ID. Have a safe flight!`;

    case 'price_drop_alert':
      return `📉 *EAZE TRIP - PRICE DROP ALERT* 📉

Dear *${recipientName}*,

Fares for your saved route *${data.route || 'Mumbai → Goa'}* just dropped by *${data.discountPercent || '20%'}* to *₹${(data.newPrice || 3599).toLocaleString('en-IN')}*!

🔥 *Grab the Deal Now:*
https://eazetrip.com/flights?from=BOM&to=GOI`;

    default:
      return `📢 *EAZE TRIP UPDATE*\n\nDear *${recipientName}*,\n${data.message || 'You have an update from EazeTrip.'}\n\nhttps://eazetrip.com`;
  }
}

// ==========================================
// 2. RESILIENT QUEUE & DLQ ENGINE
// ==========================================

/**
 * Enqueues a notification across selected channels with retry parameters
 */
function enqueueNotification(options) {
  const {
    userId = 'USR-1',
    channels = ['in_app', 'email', 'whatsapp'],
    template = 'reengagement_inactivity',
    data = {},
    priority = 'high',
    maxRetries = 3,
    simulateFailure = false
  } = options;

  const notificationId = `NOTIF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

  // 1. Create In-App Notification if requested
  if (channels.includes('in_app')) {
    let title = 'Travel Update';
    let message = 'You have a new update.';
    let actionUrl = '/profile';
    let actionLabel = 'View Details';
    let category = 'system';

    if (template === 'reengagement_inactivity') {
      title = '🌴 Exclusive 25% Off Your Next Holiday';
      message = `You haven't traveled in ${data.monthsInactive || 3} months! Use code ${data.promoCode || 'HOLIDAY25'} for 25% off holiday packages.`;
      actionUrl = '/holidays';
      actionLabel = 'Claim 25% Off';
      category = 'offer';
    } else if (template === 'booking_confirmation') {
      title = `✈️ Booking Confirmed (PNR: ${data.pnr || 'EZ9900'})`;
      message = `Your ${data.serviceType || 'Flight'} booking (${data.route || 'DEL → BOM'}) is confirmed.`;
      actionUrl = '/profile';
      actionLabel = 'View E-Ticket';
      category = 'trip';
    } else if (template === 'trip_reminder') {
      title = `⏰ Upcoming Departure Reminder`;
      message = `Your trip is in 24 hours. Complete web check-in now.`;
      actionUrl = '/profile';
      actionLabel = 'Web Check-in';
      category = 'trip';
    } else if (template === 'price_drop_alert') {
      title = `📉 Price Drop on ${data.route || 'Mumbai → Goa'}`;
      message = `Fares dropped to ₹${(data.newPrice || 3599).toLocaleString('en-IN')}.`;
      actionUrl = '/flights';
      actionLabel = 'Book Now';
      category = 'alert';
    }

    inAppNotifications.unshift({
      id: notificationId,
      userId,
      category,
      title,
      message,
      actionUrl,
      actionLabel,
      timestamp: new Date().toISOString(),
      read: false,
      priority,
      channelsDelivered: [...channels]
    });
  }

  // 2. Enqueue external channel messages (Email, WhatsApp)
  const externalChannels = channels.filter((c) => c === 'email' || c === 'whatsapp');

  const enqueuedItems = externalChannels.map((channel) => {
    const queueItemId = `QITEM-${channel.toUpperCase().slice(0, 2)}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const recipient = channel === 'email' ? (data.email || 'traveler@eazetrip.com') : (data.phone || '+91 9876543210');

    const queueItem = {
      id: queueItemId,
      notificationId,
      userId,
      channel,
      recipient,
      template,
      data,
      priority,
      status: 'pending',
      attempts: 0,
      maxRetries,
      backoffDelayMs: 1000,
      nextRetryAt: new Date().toISOString(),
      simulateFailure: Boolean(simulateFailure),
      renderedContent: channel === 'email' ? renderHtmlEmail(template, data) : renderWhatsAppMessage(template, data),
      createdAt: new Date().toISOString(),
      errorLogs: []
    };

    deliveryQueue.push(queueItem);
    return queueItem;
  });

  // Automatically trigger processing cycle
  processQueue();

  return {
    notificationId,
    enqueuedItems,
    inAppCreated: channels.includes('in_app')
  };
}

/**
 * Processes active items in the delivery queue with exponential backoff & DLQ routing
 */
function processQueue() {
  const now = Date.now();

  for (let i = deliveryQueue.length - 1; i >= 0; i--) {
    const item = deliveryQueue[i];

    // Check if ready for retry
    if (new Date(item.nextRetryAt).getTime() > now) {
      continue;
    }

    item.status = 'processing';
    item.attempts += 1;

    // Simulate resilient provider dispatch
    const isFailed = item.simulateFailure && item.attempts <= item.maxRetries;

    if (!isFailed) {
      // SUCCESSFUL DELIVERY
      item.status = 'delivered';
      item.deliveredAt = new Date().toISOString();
      deliveredArchive.unshift({ ...item });
      deliveryQueue.splice(i, 1);
    } else {
      // DELIVERY FAILED -> LOG ERROR & CALCULATE BACKOFF OR MOVE TO DLQ
      const errorMessage = `Provider connection timeout on channel [${item.channel.toUpperCase()}] for recipient [${item.recipient}]`;
      item.errorLogs.push({
        attempt: item.attempts,
        failedAt: new Date().toISOString(),
        error: errorMessage
      });

      if (item.attempts >= item.maxRetries) {
        // EXHAUSTED ALL RETRIES -> SAFELY ROUTE TO DEAD-LETTER QUEUE (NEVER CRASH)
        item.status = 'dead_letter';
        item.movedToDlqAt = new Date().toISOString();
        item.dlqReason = `Max retries (${item.maxRetries}) exhausted without successful handshake.`;
        deadLetterQueue.unshift({ ...item });
        deliveryQueue.splice(i, 1);
      } else {
        // SCHEDULE NEXT RETRY WITH EXPONENTIAL BACKOFF (2^attempts * baseDelay)
        const backoffMs = item.backoffDelayMs * Math.pow(2, item.attempts);
        item.status = 'retry_scheduled';
        item.nextRetryAt = new Date(Date.now() + backoffMs).toISOString();
      }
    }
  }
}

/**
 * Retries a specific dead-letter queue item or all DLQ items
 */
function retryDlqItem(dlqId) {
  if (dlqId === 'all') {
    const count = deadLetterQueue.length;
    while (deadLetterQueue.length > 0) {
      const item = deadLetterQueue.pop();
      item.attempts = 0;
      item.status = 'pending';
      item.simulateFailure = false; // reset simulation to succeed
      item.nextRetryAt = new Date().toISOString();
      deliveryQueue.push(item);
    }
    processQueue();
    return { success: true, count, message: `Re-enqueued and retried all ${count} failed notifications.` };
  }

  const index = deadLetterQueue.findIndex((d) => d.id === dlqId);
  if (index === -1) {
    return { success: false, error: 'Dead-letter item not found' };
  }

  const item = deadLetterQueue.splice(index, 1)[0];
  item.attempts = 0;
  item.status = 'pending';
  item.simulateFailure = false;
  item.nextRetryAt = new Date().toISOString();
  deliveryQueue.push(item);
  processQueue();

  return { success: true, item, message: `Re-enqueued DLQ item ${dlqId} successfully.` };
}

/**
 * Triggers a personalized customer campaign
 */
function triggerCampaign(campaignType, user = {}, customData = {}) {
  const defaultUser = {
    id: user.id || 'USR-1',
    name: user.name || 'Priyansh Sharma',
    email: user.email || 'priyansh.sharma@gmail.com',
    phone: user.phone || '+91 98765 43210'
  };

  let campaignPayload = {
    name: defaultUser.name,
    email: defaultUser.email,
    phone: defaultUser.phone,
    ...customData
  };

  switch (campaignType) {
    case 'reengagement_inactivity':
      campaignPayload = {
        ...campaignPayload,
        monthsInactive: customData.monthsInactive || 3,
        promoCode: customData.promoCode || 'HOLIDAY25',
        recommendedDestinations: ['Goa', 'Kashmir', 'Kerala', 'Rajasthan']
      };
      break;

    case 'booking_confirmation':
      campaignPayload = {
        ...campaignPayload,
        pnr: customData.pnr || 'FL2775',
        serviceType: customData.serviceType || 'Flight',
        carrier: customData.carrier || 'IndiGo 6E-2041',
        route: customData.route || 'Mumbai (BOM) → New Delhi (DEL)',
        travelDate: customData.travelDate || '24 Sep 2026, 06:00 AM',
        amount: customData.amount || 4999
      };
      break;

    case 'trip_reminder':
      campaignPayload = {
        ...campaignPayload,
        pnr: customData.pnr || 'FL2775',
        carrier: customData.carrier || 'IndiGo 6E-2041',
        route: customData.route || 'Mumbai (BOM) → New Delhi (DEL)',
        travelDate: customData.travelDate || 'Tomorrow at 06:00 AM'
      };
      break;

    case 'price_drop_alert':
      campaignPayload = {
        ...campaignPayload,
        route: customData.route || 'Mumbai (BOM) → Goa (GOI)',
        discountPercent: '20% OFF',
        newPrice: 3599,
        oldPrice: 4500
      };
      break;
  }

  return enqueueNotification({
    userId: defaultUser.id,
    channels: customData.channels || ['in_app', 'email', 'whatsapp'],
    template: campaignType,
    data: campaignPayload,
    priority: customData.priority || 'high',
    simulateFailure: Boolean(customData.simulateFailure)
  });
}

/**
 * Returns diagnostic metrics for the notification and queue subsystem
 */
function getQueueMetrics() {
  processQueue(); // Ensure up to date

  const totalDelivered = deliveredArchive.length;
  const activePending = deliveryQueue.filter((q) => q.status === 'pending' || q.status === 'retry_scheduled').length;
  const inProcessing = deliveryQueue.filter((q) => q.status === 'processing').length;
  const dlqCount = deadLetterQueue.length;
  const totalHandled = totalDelivered + dlqCount + activePending + inProcessing;
  const successRate = totalHandled > 0 ? Math.round((totalDelivered / (totalDelivered + dlqCount || 1)) * 100) : 100;

  return {
    success: true,
    metrics: {
      totalHandled,
      totalDelivered,
      activePending,
      inProcessing,
      deadLetterQueueCount: dlqCount,
      successRatePercent: successRate,
      supportedChannels: ['email', 'whatsapp', 'in_app', 'sms', 'push']
    },
    activeQueue: deliveryQueue.slice(0, 10),
    deadLetterQueue: deadLetterQueue.slice(0, 15),
    recentDelivered: deliveredArchive.slice(0, 10)
  };
}

module.exports = {
  inAppNotifications,
  deliveryQueue,
  deliveredArchive,
  deadLetterQueue,
  userPreferences,
  renderHtmlEmail,
  renderWhatsAppMessage,
  enqueueNotification,
  processQueue,
  retryDlqItem,
  triggerCampaign,
  getQueueMetrics
};
