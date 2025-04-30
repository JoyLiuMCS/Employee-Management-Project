const Document = require('../models/Document');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

const downloadDocument = (req, res, next) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads', filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.download(filePath);
  });
};

const uploadDocument = async (req, res, next) => {
  try {
    const newDoc = new Document({
      userId: req.user.userId,
      filename: req.file.filename, 
      status: 'pending', 
    });
    await newDoc.save();
    res.status(201).json({ message: 'Document uploaded successfully' });
  } catch (err) {
    next(err);
  }
};

const getMyDocuments = async (req, res, next) => {
  try {
    const myDocuments = await Document.find({ userId: req.user.userId });
    res.json(myDocuments);
  } catch (err) {
    next(err);
  }
};

const getInProgressDocuments = async (req, res, next) => {
  try {
    const employees = await User.find({ role: 'employee' });
    const documents = await Document.find();

    const inProgressList = employees.map(emp => {
      const empDoc = documents.find(doc => doc.userId.toString() === emp._id.toString());
      let nextStep = '';
      let waitingForApproval = false;
      let documentId = null;

      if (!empDoc) {
        nextStep = 'Submit OPT Receipt';
      } else if (empDoc.status === 'pending') {
        nextStep = 'Waiting for HR Approval';
        waitingForApproval = true;
        documentId = empDoc._id;
      } else {
        nextStep = 'Completed';
      }

      return {
        userId: emp._id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        workAuthorizationTitle: emp.workAuthorizationTitle || '',
        workAuthStartDate: emp.workAuthStartDate ? emp.workAuthStartDate.toISOString().split('T')[0] : '',
        workAuthEndDate: emp.workAuthEndDate ? emp.workAuthEndDate.toISOString().split('T')[0] : '',
        daysRemaining: emp.workAuthEndDate
          ? Math.max(0, Math.ceil((new Date(emp.workAuthEndDate) - new Date()) / (1000 * 60 * 60 * 24)))
          : '',
        nextStep,
        waitingForApproval,
        documentId,
      };
    });

    res.json(inProgressList);
  } catch (err) {
    next(err);
  }
};

const approveDocument = async (req, res, next) => {
  try {
    const docId = req.params.id;
    const doc = await Document.findById(docId);
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

    doc.status = 'approved'; 
    doc.feedback = '';
    await doc.save();

    res.json({ success: true, message: 'Document approved' });
  } catch (err) {
    next(err);
  }
};

const rejectDocument = async (req, res, next) => {
  try {
    const docId = req.params.id;
    const { feedback } = req.body;

    const doc = await Document.findById(docId);
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

    doc.status = 'rejected'; 
    doc.feedback = feedback || 'Please resubmit the document.';
    await doc.save();

    res.json({ success: true, message: 'Document rejected with feedback' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  downloadDocument,
  uploadDocument,
  getMyDocuments,         
  getInProgressDocuments,
  approveDocument,
  rejectDocument,
};
