const mongoose = require('mongoose');

const workHistorySchema = new mongoose.Schema({
  company: { type: String, default: null },
  position: { type: String, default: null },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
  responsibilities: { type: String, default: '' },
}, { timestamps: true });

module.exports = workHistorySchema;
