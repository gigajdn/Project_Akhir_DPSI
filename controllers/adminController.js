const Admin = require('../models/admin');
const Alumni = require('../models/alumni');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

// Import Alumni Data
exports.importAlumniData = async (req, res) => {
  try {
    const newAlumni = new Alumni(req.body);
    await newAlumni.save();
    res.status(201).json(newAlumni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Manage Alumni Data
exports.manageAlumniData = async (req, res) => {
  try {
    const alumni = await Alumni.find();
    res.status(200).json(alumni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create Report
exports.createReport = async (req, res) => {
    try {
      const { startDate, endDate, graduationYear } = req.body;
      
      // Build query based on criteria
      let query = {};
      if (startDate && endDate) {
        query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
      }
      if (graduationYear) {
        query['education.graduationYear'] = graduationYear;
      }
      
      // Fetch alumni data based on criteria
      const alumni = await Alumni.find(query);
  
      // Create a PDF document
      const doc = new PDFDocument();
      const fileName = `report_${Date.now()}.pdf`;
      const filePath = path.join(__dirname, '..', 'reports', fileName);
      
      // Ensure the reports directory exists
      if (!fs.existsSync(path.join(__dirname, '..', 'reports'))) {
        fs.mkdirSync(path.join(__dirname, '..', 'reports'));
      }
      
      // Pipe the PDF into a writable stream
      doc.pipe(fs.createWriteStream(filePath));
      
      // Add content to PDF
      doc.fontSize(20).text('Alumni Report', { align: 'center' });
      doc.moveDown();
      
      alumni.forEach((alum, index) => {
        doc.fontSize(14).text(`Alumni ${index + 1}`, { underline: true });
        doc.fontSize(12).text(`Name: ${alum.name}`);
        doc.text(`Email: ${alum.email}`);
        doc.text(`Graduation Year: ${alum.education.graduationYear}`);
        doc.text(`Profile: ${alum.profile.bio}`);
        doc.moveDown();
      });
  
      // Finalize the PDF
      doc.end();
  
      res.status(200).json({ message: 'Report created successfully', filePath: `/reports/${fileName}` });
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

// Add Alumni Data
exports.addAlumniData = async (req, res) => {
  try {
    const newAlumni = new Alumni(req.body);
    await newAlumni.save();
    res.status(201).json(newAlumni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Alumni Data
exports.updateAlumniData = async (req, res) => {
  try {
    const updatedAlumni = await Alumni.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedAlumni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Alumni Data
exports.deleteAlumniData = async (req, res) => {
  try {
    await Alumni.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Alumni deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
