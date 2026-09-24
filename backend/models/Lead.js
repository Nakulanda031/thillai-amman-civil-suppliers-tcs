const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema(
  {
    leadId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    type: {
      type: String,
      enum: ['quote', 'booking', 'contact'],
      default: 'quote',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    mobile: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    item: {
      type: String, // Material name, Equipment model, or Service name
      trim: true
    },
    quantity: {
      type: String,
      trim: true
    },
    unit: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    preferredDate: {
      type: String
    },
    requiredTime: {
      type: String
    },
    duration: {
      type: String
    },
    workType: {
      type: String
    },
    projectType: {
      type: String
    },
    message: {
      type: String,
      trim: true
    },
    drawingFile: {
      type: String // path or original filename of uploaded plan
    },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'QUOTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
      default: 'NEW',
      index: true
    },
    notes: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Lead', LeadSchema);
