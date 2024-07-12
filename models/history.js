const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  alumniId: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumni', required: true },
  changes: [{
    field: { type: String, required: true },
    oldValue: { type: String, required: true },
    newValue: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
  }],
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('History', historySchema);
