const Admin = require('../models/admin');
const Alumni = require('../models/alumni');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ExcelJS = require('exceljs');


// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to get cell value as string
const getCellValue = (cell) => {
  if (cell && cell.text) {
    return cell.text; // If cell has a text property, return it (for hyperlinks)
  }
  return cell || ''; // Otherwise, return the cell value or empty string if undefined
};

// Import Alumni Data
exports.importAlumniData = [
  upload.single('file'),
  async (req, res) => {
    try {
      const file = req.file;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file.buffer);
      const worksheet = workbook.getWorksheet(1); // Assuming data is in the first sheet

      const alumniData = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Skip header row
          let profile;
          let workHistory;

          try {
            profile = JSON.parse(getCellValue(row.getCell(4))); // Assuming profile is a JSON string
          } catch (error) {
            profile = {}; // Handle parsing error
          }

          try {
            workHistory = JSON.parse(getCellValue(row.getCell(8))); // Assuming workHistory is a JSON string
          } catch (error) {
            workHistory = []; // Handle parsing error
          }

          const data = {
            name: getCellValue(row.getCell(1)),
            email: getCellValue(row.getCell(2)),
            password: getCellValue(row.getCell(3)),
            profile: profile,
            education: {
              degree: getCellValue(row.getCell(5)),
              institution: getCellValue(row.getCell(6)),
              graduationYear: row.getCell(7).value,
            },
            workHistory: workHistory
          };

          alumniData.push(data);
        }
      });

      await Alumni.insertMany(alumniData);

      res.status(201).json({ message: 'Data successfully imported', data: alumniData });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

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
    const alumni = await Alumni.find();

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

    // Add fonts
    doc.font('Times-Roman');

    // Header
    doc
      .fontSize(20)
      .fillColor('#003366')
      .text('Alumni Report', { align: 'center', underline: true });
    doc.moveDown(1);

    alumni.forEach((alum, index) => {
      // Section Title
      doc
        .fontSize(16)
        .fillColor('#003366')
        .text(`Alumni ${index + 1}`, { underline: true });
      doc.moveDown(0.5);

      // Alumni Details
      doc.fontSize(12).fillColor('black');
      doc.text(`Name: ${alum.name}`, { indent: 20 });
      doc.text(`Email: ${alum.email}`, { indent: 20 });
      doc.text(`Graduation Year: ${alum.education.graduationYear}`, { indent: 20 });
      doc.text(`Profile: ${alum.profile.bio}`, { indent: 20 });
      doc.moveDown(0.5);

      // Work History
      if (alum.workHistory.length > 0) {
        doc
          .fontSize(14)
          .fillColor('#003366')
          .text('Work History:', { underline: true, indent: 20 });
        alum.workHistory.forEach((work, idx) => {
          doc.fontSize(12).fillColor('black');
          doc.text(`  ${idx + 1}. Company: ${work.company}`, { indent: 40 });
          doc.text(`     Position: ${work.position}`, { indent: 40 });
          doc.text(`     Start Date: ${work.startDate.toISOString().split('T')[0]}`, { indent: 40 });
          doc.text(`     End Date: ${work.endDate ? work.endDate.toISOString().split('T')[0] : 'Present'}`, { indent: 40 });
          doc.text(`     Responsibilities: ${work.responsibilities}`, { indent: 40 });
        });
      } else {
        doc
          .fontSize(12)
          .fillColor('black')
          .text('No work history available.', { indent: 20 });
      }

      // Separator Line
      if (index < alumni.length - 1) {
        doc.moveDown(1);
        doc
          .lineWidth(0.5)
          .strokeColor('#cccccc')
          .moveTo(40, doc.y)
          .lineTo(doc.page.width - 40, doc.y)
          .stroke();
        doc.moveDown(1);
      } else {
        doc.moveDown(2);
      }
    });

    // Function to add footer
    const addFooter = (doc) => {
      doc
        .fontSize(10)
        .fillColor('gray')
        .text('Generated by Alumni Management System', 40, doc.page.height - 40, { align: 'center' });
    };

    // Add the footer to the first page
    addFooter(doc);

    // Add event listener for new pages to add footer
    doc.on('pageAdded', () => {
      addFooter(doc);
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
