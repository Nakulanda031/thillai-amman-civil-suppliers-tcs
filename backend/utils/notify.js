const nodemailer = require('nodemailer');

// Setup Nodemailer transporter if configured
let transporter = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

// Setup Twilio client if configured
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } catch (err) {
    console.warn('[Twilio Init] Twilio library not initialized:', err.message);
  }
}

/**
 * Send office alert when a new lead is captured
 * @param {Object} lead 
 */
async function notifyNewLead(lead) {
  const subject = `[New TCS Lead] ${lead.type.toUpperCase()}: ${lead.name} (${lead.item || 'General'})`;
  const textBody = `
=== NEW TCS CUSTOMER ENQUIRY ===
Lead ID: ${lead.leadId}
Type: ${lead.type}
Customer Name: ${lead.name}
Phone: ${lead.mobile}
Email: ${lead.email || 'N/A'}
Material / Fleet: ${lead.item || 'N/A'}
Quantity: ${lead.quantity || 'N/A'} ${lead.unit || ''}
Location: ${lead.location || 'Coimbatore'}
Required Date: ${lead.preferredDate || 'N/A'}
Work / Project: ${lead.projectType || lead.workType || 'N/A'}
Message: ${lead.message || 'N/A'}
Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
================================
`;

  // 1. Send Email Notification
  if (transporter && process.env.NOTIFY_EMAIL) {
    try {
      await transporter.sendMail({
        from: `"TCS Website Leads" <${process.env.SMTP_USER}>`,
        to: process.env.NOTIFY_EMAIL,
        subject: subject,
        text: textBody
      });
      console.log(`[Email Alert] Sent for lead ${lead.leadId}`);
    } catch (err) {
      console.warn(`[Email Alert Error] Failed to send email for lead ${lead.leadId}:`, err.message);
    }
  }

  // 2. Send Twilio WhatsApp Alert
  if (twilioClient && process.env.TWILIO_WHATSAPP_FROM && process.env.OWNER_WHATSAPP_TO) {
    try {
      const waMsg = `*New TCS Lead: ${lead.leadId}*\n*Customer:* ${lead.name} (${lead.mobile})\n*Requirement:* ${lead.item || 'Enquiry'}\n*Location:* ${lead.location || 'Coimbatore'}\n*Date:* ${lead.preferredDate || 'Immediate'}`;
      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: process.env.OWNER_WHATSAPP_TO,
        body: waMsg
      });
      console.log(`[WhatsApp Alert] Sent to owner for lead ${lead.leadId}`);
    } catch (err) {
      console.warn(`[WhatsApp Alert Error] Failed to send WhatsApp for lead ${lead.leadId}:`, err.message);
    }
  }
}

module.exports = { notifyNewLead };
