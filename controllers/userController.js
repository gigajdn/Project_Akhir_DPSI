const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Admin = require('../models/admin');
const Alumni = require('../models/alumni');
const ResetToken = require('../models/resetToken');
const transporter = require('../config/emailConfig');

// Register Alumni
exports.registerAlumni = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newAlumni = new Alumni({ name, email, password: hashedPassword });
    await newAlumni.save();
    res.status(201).json(newAlumni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Register Admin
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();
    res.status(201).json(newAdmin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Alumni.findOne({ email }) || await Admin.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 86400 }); // 24 hours
    res.status(200).json({ auth: true, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Alumni.findOne({ email }) || await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a reset token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resetToken = new ResetToken({
      userId: user._id,
      userModel: user instanceof Alumni ? 'Alumni' : 'Admin',
      token,
    });
    await resetToken.save();

    // Send email with reset link
    const resetUrl = `http://${req.headers.host}/resetPassword?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset',
      text: `You requested for a password reset. Please use the following link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const resetToken = await ResetToken.findOne({ token });
    if (!resetToken) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const user = await (resetToken.userModel === 'Alumni' ? Alumni : Admin).findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = bcrypt.hashSync(newPassword, 8);
    await user.save();
    await resetToken.delete();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
