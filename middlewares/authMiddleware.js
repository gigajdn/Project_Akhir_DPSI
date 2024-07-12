const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const Alumni = require('../models/alumni');

// Middleware for checking if user is authenticated
const isAuthenticated = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }
    req.userId = decoded.id;
    next();
  });
};

// Middleware for checking if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.userId);
    if (!admin) {
      return res.status(403).json({ message: 'Require Admin Role' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving admin information' });
  }
};

// Middleware for checking if user is alumni
const isAlumni = async (req, res, next) => {
  try {
    const alumni = await Alumni.findById(req.userId);
    if (!alumni) {
      return res.status(403).json({ message: 'Require Alumni Role' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving alumni information' });
  }
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isAlumni,
};
