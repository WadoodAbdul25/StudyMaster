const multer = require("multer");
const path = require("path");
const Document = require("../models/Document");

// save to uploads folder with original name
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".pdf" || ext === ".docx") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Only PDF and DOCX files are allowed" });
    }

    const ext = path.extname(req.file.originalname).toLowerCase().replace(".", "");

    const document = await Document.create({
      courseId: req.params.courseId,
      userId: req.user.id,
      fileName: req.file.originalname,
      fileType: ext,
      filePath: req.file.path,
    });

    const { rawText, ...docWithoutRawText } = document.toObject();

    res.status(201).json(docWithoutRawText);
  } catch (err) {
    next(err);
  }
};

const fs = require("fs");
const Task = require("../models/Task");

const processDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, userId: req.user.id });
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }
    if (document.processedAt) {
      return res.status(409).json({ error: "Document already processed" });
    }

    const { extractText } = require("../services/extractionService");
    const { extractTasksFromText } = require("../ai_funcs");
    const rawText = await extractText(document.filePath, document.fileType);
    const extracted = await extractTasksFromText(rawText);

    const taskDocs = extracted.map((t) => ({
      courseId: document.courseId,
      userId: document.userId,
      title: t.title,
      type: t.type,
      dueDate: t.dueDate || null,
      description: t.description || "",
      priority: t.priority || "medium",
      status: "pending",
    }));

    const created = await Task.insertMany(taskDocs);

    document.rawText = rawText;
    document.processedAt = new Date();
    await document.save();

    res.status(200).json({ document, tasksCreated: created.length });
  } catch (err) {
    next(err);
  }
};

const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ courseId: req.params.courseId, userId: req.user.id });
    res.status(200).json(documents);
  } catch (err) {
    next(err);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    res.status(200).json({ message: "Document deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { upload, uploadDocument, getDocuments, deleteDocument, processDocument };
