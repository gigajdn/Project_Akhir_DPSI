const History = require('../models/history');

// Get History by Alumni ID
exports.getHistoryByAlumniId = async (req, res) => {
  try {
    const history = await History.find({ alumniId: req.params.alumniId });
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add History Entry
exports.addHistoryEntry = async (req, res) => {
  try {
    const newHistory = new History(req.body);
    await newHistory.save();
    res.status(201).json(newHistory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
