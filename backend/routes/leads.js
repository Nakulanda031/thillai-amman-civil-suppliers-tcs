const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const upload = require('../utils/upload');
const { notifyNewLead } = require('../utils/notify');

// Helper to generate unique Lead ID
function generateLeadId() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TCS-${year}-${rand}`;
}

// -------------------------------------------------------------
// POST /api/quote — Request Quote Endpoint
// -------------------------------------------------------------
router.post('/quote', upload.single('drawing'), async (req, res) => {
  try {
    const { name, mobile, email, material, quantity, unit, location, deliveryLocation, preferredDate, projectType, message } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({ success: false, message: 'Name and mobile number are required.' });
    }

    const leadId = req.body.id || generateLeadId();

    const newLead = new Lead({
      leadId,
      type: 'quote',
      name: name.trim(),
      mobile: mobile.trim(),
      email: email ? email.trim() : '',
      item: material || 'General Construction Material',
      quantity: quantity || '',
      unit: unit || '',
      location: (location || deliveryLocation || 'Coimbatore').trim(),
      preferredDate: preferredDate || '',
      projectType: projectType || 'Residential',
      message: message || '',
      drawingFile: req.file ? req.file.filename : ''
    });

    await newLead.save();

    // Trigger async email/WhatsApp alert
    notifyNewLead(newLead).catch(err => console.error('[Notification Error]', err));

    res.status(201).json({
      success: true,
      id: newLead.leadId,
      message: 'Thank you for contacting TCS. Your quote request has been received.'
    });
  } catch (err) {
    console.error('[Quote API Error]', err);
    res.status(500).json({ success: false, message: 'Server error while recording quote request.' });
  }
});

// -------------------------------------------------------------
// POST /api/booking — Equipment Booking Endpoint
// -------------------------------------------------------------
router.post('/booking', async (req, res) => {
  try {
    const { name, mobile, email, equipment, location, preferredDate, requiredTime, duration, workType, message } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({ success: false, message: 'Name and phone number are required.' });
    }

    const leadId = req.body.id || generateLeadId();

    const newLead = new Lead({
      leadId,
      type: 'booking',
      name: name.trim(),
      mobile: mobile.trim(),
      email: email ? email.trim() : '',
      item: equipment || 'Heavy Equipment',
      location: (location || 'Coimbatore').trim(),
      preferredDate: preferredDate || '',
      requiredTime: requiredTime || 'Morning',
      duration: duration || '1 Day',
      workType: workType || 'Excavation',
      message: message || ''
    });

    await newLead.save();

    notifyNewLead(newLead).catch(err => console.error('[Notification Error]', err));

    res.status(201).json({
      success: true,
      id: newLead.leadId,
      message: 'Thank you. Your equipment booking request has been received.'
    });
  } catch (err) {
    console.error('[Booking API Error]', err);
    res.status(500).json({ success: false, message: 'Server error while recording equipment booking.' });
  }
});

// -------------------------------------------------------------
// POST /api/contact — General Contact Message Endpoint
// -------------------------------------------------------------
router.post('/contact', async (req, res) => {
  try {
    const { name, mobile, email, message, location } = req.body;

    if (!name || !mobile || !message) {
      return res.status(400).json({ success: false, message: 'Name, mobile and message are required.' });
    }

    const leadId = req.body.id || generateLeadId();

    const newLead = new Lead({
      leadId,
      type: 'contact',
      name: name.trim(),
      mobile: mobile.trim(),
      email: email ? email.trim() : '',
      item: 'General Enquiry',
      location: (location || 'Coimbatore').trim(),
      message: message.trim()
    });

    await newLead.save();

    notifyNewLead(newLead).catch(err => console.error('[Notification Error]', err));

    res.status(201).json({
      success: true,
      id: newLead.leadId,
      message: 'Thank you. Your message has been received by TCS.'
    });
  } catch (err) {
    console.error('[Contact API Error]', err);
    res.status(500).json({ success: false, message: 'Server error while recording contact enquiry.' });
  }
});

// -------------------------------------------------------------
// GET /api/leads — List Enquiries (For Admin Portal)
// -------------------------------------------------------------
router.get('/leads', async (req, res) => {
  try {
    // Optional admin key check
    const adminKey = req.headers['x-admin-key'] || req.query.admin_key;
    if (process.env.ADMIN_SECRET_KEY && adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(401).json({ success: false, message: 'Unauthorized access to leads.' });
    }

    const { status, type, limit = 50 } = req.query;
    const filter = {};
    if (status && status !== 'ALL') filter.status = status;
    if (type && type !== 'ALL') filter.type = type;

    const leads = await Lead.find(filter).sort({ createdAt: -1 }).limit(parseInt(limit, 10));
    res.json({ success: true, count: leads.length, leads });
  } catch (err) {
    console.error('[Get Leads Error]', err);
    res.status(500).json({ success: false, message: 'Server error while fetching leads.' });
  }
});

// -------------------------------------------------------------
// PATCH /api/leads/:id/status — Update Lead Status
// -------------------------------------------------------------
router.patch('/leads/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['NEW', 'CONTACTED', 'QUOTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid lead status.' });
    }

    const updated = await Lead.findOneAndUpdate(
      { leadId: req.params.id },
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    res.json({ success: true, lead: updated });
  } catch (err) {
    console.error('[Update Lead Status Error]', err);
    res.status(500).json({ success: false, message: 'Server error updating lead status.' });
  }
});

// -------------------------------------------------------------
// GET /api/leads/export/csv — Download Leads as CSV
// -------------------------------------------------------------
router.get('/leads/export/csv', async (req, res) => {
  try {
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    const headers = ['Lead ID', 'Type', 'Name', 'Mobile', 'Email', 'Item', 'Quantity', 'Location', 'Date', 'Project', 'Status', 'Created At'];
    
    const rows = leads.map(l => [
      `"${l.leadId}"`,
      `"${l.type}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${l.mobile}"`,
      `"${l.email || ''}"`,
      `"${(l.item || '').replace(/"/g, '""')}"`,
      `"${(l.quantity || '') + ' ' + (l.unit || '')}"`,
      `"${(l.location || '').replace(/"/g, '""')}"`,
      `"${l.preferredDate || ''}"`,
      `"${l.projectType || l.workType || ''}"`,
      `"${l.status}"`,
      `"${l.createdAt.toISOString()}"`
    ]);

    const csvData = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=TCS_Leads_${Date.now()}.csv`);
    res.status(200).send(csvData);
  } catch (err) {
    console.error('[CSV Export Error]', err);
    res.status(500).json({ success: false, message: 'Failed to export CSV.' });
  }
});

module.exports = router;
