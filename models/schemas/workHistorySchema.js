const mongoose = require('mongoose');

const workHistorySchema = new mongoose.Schema({
  company: { type: String, default: '' },
  position: { type: String, default: '' },
  startDate: { type: Date, default: '00-000-0-0-0' },
  endDate: { type: Date, default: '00-000-0-0-0' },
  responsibilities: { type: String, default: '' },
}, { timestamps: true });

module.exports = workHistorySchema;
