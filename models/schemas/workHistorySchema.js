const mongoose = require('mongoose');

const workHistorySchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, default: null },
  responsibilities: { type: String, default: '' },
}, { timestamps: true });

module.exports = workHistorySchema;
