const mongoose = require("mongoose");

const ClaimSchema = new mongoose.Schema(
  {
    service: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    consent: {
      type: Boolean,
      default: false,
    },
    // ⭐ NEW — Consent Text
    consentText: {
      type: String,
      default: "",
    },
    
    xxTrustedFormCertUrl: { type: String },

    serviceAnswers: {
      type: [
        {
          question: { type: String, required: true },
          answer: { type: mongoose.Schema.Types.Mixed, required: true },
        },
      ],
      _id: false,
    },

    // ⭐ NEW → Add client details safely
    clientDetails: {
      ipAddress: String,
      browser: String,
      os: String,
      device: String,
      location: Object,
    },
  },
  { timestamps: true }
  
);

module.exports = mongoose.models.Claim || mongoose.model("Claim", ClaimSchema);
