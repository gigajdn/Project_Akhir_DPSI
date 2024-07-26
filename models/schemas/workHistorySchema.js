const mongoose = require('mongoose');

const workHistorySchema = new mongoose.Schema({
  company: { type: String, default: '' },
  position: { type: String, default: '' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: Date.now },
  responsibilities: { type: String, default: '' },
}, { timestamps: true });

module.exports = workHistorySchema;
