const express = require('express');
const Claim = require('../models/Claim');
const router = express.Router();
const UAParser = require('ua-parser-js');
const geoip = require('geoip-lite');

// ✅ CREATE Claim + capture client details
router.post('/', async (req, res) => {
  try {
    const body = req.body;

     // ⭐ DEBUG: Check what frontend is sending
    console.log("📩 Incoming Claim Body:", body);
    console.log("📌 consent:", body.consent);
    console.log("📌 consentText:", body.consentText);

    // ----------- Capture Client Details --------------
    const userAgent = req.headers['user-agent'] || "";
    const parser = new UAParser(userAgent);
    const ua = parser.getResult();

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.ip ||
      req.connection.remoteAddress ||
      "Unknown";

    const location = geoip.lookup(ip) || {};

    const clientDetails = {
      ipAddress: ip,
      browser: ua.browser?.name || "Unknown",
      os: ua.os?.name || "Unknown",
      device: ua.device?.type || "Desktop",
      location,
    };

    // ----------- Save Claim --------------
    const claim = new Claim({
      ...body,
      clientDetails,
    });

      console.log("✅ Saved Claim:", claim);
    await claim.save();

    res.status(201).json(claim);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ GET All Claims
router.get('/', async (req, res) => {
  try {
    const claims = await Claim.find();
    res.status(200).json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET a single Claim by ID
router.get('/:id', async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    res.status(200).json(claim);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE a Claim by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedClaim = await Claim.findByIdAndDelete(req.params.id);
    if (!deletedClaim)
      return res.status(404).json({ message: 'Claim not found' });
    res.status(200).json({ message: 'Claim deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;