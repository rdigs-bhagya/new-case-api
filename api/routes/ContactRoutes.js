const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const UAParser = require('ua-parser-js');
const geoip = require('geoip-lite');

// ✅ Create a new contact + capture client details
router.post('/', async (req, res) => {
  try {
    const body = req.body;

    // ----------- Capture Client Details --------------
    const userAgent = req.headers['user-agent'] || "";
    const parser = new UAParser(userAgent);
    const ua = parser.getResult();

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.ip ||
      req.connection.remoteAddress ||
      'Unknown';

    const location = geoip.lookup(ip) || {};

    const clientDetails = {
      ipAddress: ip,
      browser: ua.browser?.name || "Unknown",
      os: ua.os?.name || "Unknown",
      device: ua.device?.type || "Desktop",
      location,
    };

    // ----------- Save Contact Form --------------
    const contact = new Contact({
      ...body,
      clientDetails,
    });

    await contact.save();

    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get a single contact by ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a contact by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact)
      return res.status(404).json({ message: 'Contact not found' });
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;