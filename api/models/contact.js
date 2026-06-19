const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    caseType: { type: String, required: true },
     hasLawyer: {
      type: String,
      enum: ["Yes", "No"],
      required: true,
    },
    xxTrustedFormCertUrl: { type: String },

    consent: {
      type: Boolean,
      default: false,
    },

    // ⭐ NEW — must end with a comma!
    consentText: {
      type: String,
      default: "",
    },

    // ⭐ Add client details here
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

module.exports =
  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);