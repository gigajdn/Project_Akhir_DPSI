const Alumni = require('../models/alumni');

// View Profile
exports.viewProfile = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    res.status(200).json(alumni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const updatedProfile = await Alumni.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Access Alumni Information
exports.accessAlumniInfo = async (req, res) => {
  try {
    const alumni = await Alumni.find();
    res.status(200).json(alumni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search Alumni Based on Criteria
exports.searchAlumni = async (req, res) => {
  try {
    const criteria = req.body.criteria;
    const alumni = await Alumni.find(criteria);
    res.status(200).json(alumni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View Alumni Details
exports.viewAlumniDetails = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    res.status(200).json(alumni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Chat Between Alumni
exports.chatBetweenAlumni = async (req, res) => {
  try {
    // Implementation of chat functionality
    res.status(200).json({ message: 'Chat functionality not implemented yet' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
