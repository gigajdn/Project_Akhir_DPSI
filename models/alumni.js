const mongoose = require('mongoose');
const profileSchema = require('./schemas/profileSchema');
const workHistorySchema = require('./schemas/workHistorySchema');

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: profileSchema,
  education: {
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    graduationYear: { type: Number, required: true },
  },
  workHistory: [workHistorySchema],
}, { timestamps: true });

module.exports = mongoose.model('Alumni', alumniSchema);
