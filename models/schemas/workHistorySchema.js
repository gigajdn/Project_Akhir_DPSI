const mongoose = require('mongoose');

const workHistorySchema = new mongoose.Schema({
  company: { type: String, default: '' },
  position: { type: String, default: '' },
  startDate: { type: Date, default: new Date(0) },
  endDate: { type: Date, default: new Date(0) },
  responsibilities: { type: String, default: '' },
}, { timestamps: true });

module.exports = workHistorySchema;
