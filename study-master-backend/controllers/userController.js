const User = require("../models/User");
const Course = require("../models/Course");
const Document = require("../models/Document");
const Task = require("../models/Task");
const StudyPlan = require("../models/StudyPlan");
const fs = require("fs");

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({ error: "Provide at least a name or email to update" });
    }

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select("-passwordHash");
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const deleteMe = async (req, res, next) => {
  try {
    const documents = await Document.find({ userId: req.user.id });
    documents.forEach((document) => {
      if (document.filePath && fs.existsSync(document.filePath)) {
        fs.unlinkSync(document.filePath);
      }
    });

    await Course.deleteMany({ userId: req.user.id });
    await Document.deleteMany({ userId: req.user.id });
    await Task.deleteMany({ userId: req.user.id });
    await StudyPlan.deleteMany({ userId: req.user.id });
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMe, updateMe, deleteMe };
