const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  bio: { type: String, default: '' },
  contact: {
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
  },
  socialMedia: {
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    twitter: { type: String, default: '' },
  }
});

module.exports = profileSchema;
