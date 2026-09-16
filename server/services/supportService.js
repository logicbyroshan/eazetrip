/**
 * EazeTrip Dedicated Help Desk & Customer Support Service
 * Manages Problem Reporting Tickets, Direct WhatsApp/Email Dispatch, and 5-Min Callback Requests
 */

const supportTickets = [
  {
    id: 'TKT-89214',
    userId: 'USR-1',
    pnr: 'FL2775',
    category: 'Reschedule / Date Change',
    subject: 'Request to reschedule flight BOM-DEL to 26 Sep',
    description: 'Due to an urgent meeting reschedule, I would like to move my flight departure from 24 Sep to 26 Sep morning flight. Please check seat availability.',
    name: 'Priyansh Sharma',
    email: 'priyansh.sharma@gmail.com',
    phone: '+91 98765 43210',
    urgency: 'High',
    status: 'In Progress',
    assignedTo: 'Rohit Verma (Senior Concierge Lead)',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    messages: [
      {
        id: 'MSG-1',
        sender: 'Priyansh Sharma (You)',
        role: 'user',
        text: 'Due to an urgent meeting reschedule, I would like to move my flight departure from 24 Sep to 26 Sep morning flight. Please check seat availability.',
        timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
      },
      {
        id: 'MSG-2',
        sender: 'Rohit Verma (EazeTrip Concierge)',
        role: 'support',
        text: 'Hello Priyansh, we have verified your PNR FL2775 on IndiGo 6E-2041. We found 4 available morning seats on 26 Sep 6E-2041 at 06:00 AM with zero fare difference and a nominal reschedule fee of ₹1,200. Would you like us to confirm this change?',
        timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'TKT-84102',
    userId: 'USR-1',
    pnr: 'HT4829',
    category: 'Hotel Special Request',
    subject: 'Early check-in at Taj Lands End Mumbai',
    description: 'Arriving early at 10:00 AM. Please request complimentary early check-in.',
    name: 'Priyansh Sharma',
    email: 'priyansh.sharma@gmail.com',
    phone: '+91 98765 43210',
    urgency: 'Normal',
    status: 'Resolved',
    assignedTo: 'Ananya Deshmukh (Hospitality Specialist)',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 46 * 3600 * 1000).toISOString(),
    messages: [
      {
        id: 'MSG-1',
        sender: 'Priyansh Sharma (You)',
        role: 'user',
        text: 'Arriving early at 10:00 AM. Please request complimentary early check-in.',
        timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
      },
      {
        id: 'MSG-2',
        sender: 'Ananya Deshmukh (EazeTrip Concierge)',
        role: 'support',
        text: 'Great news! We contacted Taj Lands End front desk manager and secured complimentary early check-in for your Sea View Suite from 10:00 AM. Have a wonderful stay!',
        timestamp: new Date(Date.now() - 46 * 3600 * 1000).toISOString()
      }
    ]
  }
];

const callbackQueue = [];
const directMails = [];

/**
 * Creates a new problem / helpdesk ticket
 */
function createTicket(payload) {
  const {
    userId = 'USR-1',
    pnr = '',
    category = 'General Inquiry',
    subject = '',
    description = '',
    name = 'Valued Traveler',
    email = 'traveler@eazetrip.com',
    phone = '+91 98765 43210',
    urgency = 'Normal'
  } = payload;

  const ticketId = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;

  const newTicket = {
    id: ticketId,
    userId,
    pnr: pnr.trim().toUpperCase(),
    category,
    subject: subject || `${category} - ${pnr ? `PNR: ${pnr}` : 'Help Request'}`,
    description,
    name,
    email,
    phone,
    urgency,
    status: 'Open',
    assignedTo: 'Senior Concierge Specialist',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: `MSG-${Date.now()}-1`,
        sender: `${name} (You)`,
        role: 'user',
        text: description,
        timestamp: new Date().toISOString()
      },
      {
        id: `MSG-${Date.now()}-2`,
        sender: 'EazeTrip Concierge Bot',
        role: 'system',
        text: `Hello ${name}, your issue has been logged under Ticket ID ${ticketId}. Our specialist team has been notified with ${urgency} priority. Estimated response time: under 15 minutes.`,
        timestamp: new Date(Date.now() + 1000).toISOString()
      }
    ]
  };

  supportTickets.unshift(newTicket);
  return newTicket;
}

/**
 * Retrieves tickets with flexible filters
 */
function getTickets(filters = {}) {
  const { userId, email, pnr, status, category } = filters;
  let results = supportTickets;

  if (userId) {
    results = results.filter((t) => t.userId === userId);
  }
  if (email) {
    results = results.filter((t) => t.email.toLowerCase() === email.toLowerCase());
  }
  if (pnr) {
    results = results.filter((t) => t.pnr.toLowerCase() === pnr.toLowerCase());
  }
  if (status && status !== 'all') {
    results = results.filter((t) => t.status.toLowerCase() === status.toLowerCase());
  }
  if (category && category !== 'all') {
    results = results.filter((t) => t.category.toLowerCase().includes(category.toLowerCase()));
  }

  return results;
}

/**
 * Retrieves a single ticket by ID
 */
function getTicketById(id) {
  return supportTickets.find((t) => t.id.toLowerCase() === id.toLowerCase()) || null;
}

/**
 * Adds a message to an existing support ticket thread
 */
function addMessage(ticketId, sender, text, role = 'user') {
  const ticket = getTicketById(ticketId);
  if (!ticket) return null;

  const newMsg = {
    id: `MSG-${Date.now()}`,
    sender,
    role,
    text,
    timestamp: new Date().toISOString()
  };

  ticket.messages.push(newMsg);
  ticket.updatedAt = new Date().toISOString();
  if (role === 'user' && ticket.status === 'Resolved') {
    ticket.status = 'Open';
  }
  return newMsg;
}

/**
 * Creates an instant 5-minute callback request
 */
function createCallback(payload) {
  const {
    name = 'Traveler',
    phone = '+91 98765 43210',
    topic = 'Booking Assistance',
    pnr = ''
  } = payload;

  const callbackId = `CB-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const request = {
    id: callbackId,
    name,
    phone,
    topic,
    pnr: pnr.trim().toUpperCase(),
    status: 'Queued (High Priority)',
    estimatedWaitMins: 5,
    requestedAt: new Date().toISOString()
  };

  callbackQueue.unshift(request);
  return request;
}

/**
 * Dispatches direct in-app mail to support team
 */
function sendDirectMail(payload) {
  const {
    name = 'Traveler',
    email = 'traveler@eazetrip.com',
    phone = '',
    subject = 'Help Inquiry',
    message = '',
    pnr = ''
  } = payload;

  const mailId = `MAIL-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const mailRecord = {
    id: mailId,
    name,
    email,
    phone,
    pnr: pnr.trim().toUpperCase(),
    subject,
    message,
    sentTo: 'support@eazetrip.com',
    status: 'Delivered',
    sentAt: new Date().toISOString()
  };

  directMails.unshift(mailRecord);
  return mailRecord;
}

module.exports = {
  supportTickets,
  callbackQueue,
  directMails,
  createTicket,
  getTickets,
  getTicketById,
  addMessage,
  createCallback,
  sendDirectMail
};
