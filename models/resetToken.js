const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'userModel' },
  userModel: { type: String, required: true, enum: ['Alumni', 'Admin'] },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // token akan kedaluwarsa setelah 1 jam
});

module.exports = mongoose.model('ResetToken', resetTokenSchema);
