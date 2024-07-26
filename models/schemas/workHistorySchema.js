const mongoose = require('mongoose');

const workHistorySchema = new mongoose.Schema({
  company: { type: String, default: '' },
  position: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  responsibilities: { type: String, default: '' },
}, { timestamps: true });

module.exports = workHistorySchema;
