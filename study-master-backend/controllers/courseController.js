const Course = require("../models/Course");
const Document = require("../models/Document");
const Task = require("../models/Task");
const StudyPlan = require("../models/StudyPlan");
const fs = require("fs");

const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ userId: req.user.id });
    res.status(200).json(courses);
  } catch (err) {
    next(err);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const { name, courseCode, semester, description } = req.body;

    if (!name || !courseCode || !semester) {
      return res.status(400).json({ error: "name, courseCode, and semester are required" });
    }

    const course = await Course.create({ userId: req.user.id, name, courseCode, semester, description });
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, userId: req.user.id });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(course);
  } catch (err) {
    next(err);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { name, courseCode, semester, description } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (courseCode !== undefined) updates.courseCode = courseCode;
    if (semester !== undefined) updates.semester = semester;
    if (description !== undefined) updates.description = description;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "Provide at least one course field to update" });
    }

    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updates,
      { new: true, runValidators: true }
    );
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(course);
  } catch (err) {
    next(err);
  }
};

// cascade delete
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const documents = await Document.find({ courseId: course._id, userId: req.user.id });
    documents.forEach((document) => {
      if (document.filePath && fs.existsSync(document.filePath)) {
        fs.unlinkSync(document.filePath);
      }
    });

    await Document.deleteMany({ courseId: course._id });
    await Task.deleteMany({ courseId: course._id });
    await StudyPlan.deleteOne({ courseId: course._id });

    res.status(200).json({ message: "Course deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCourses, createCourse, getCourseById, updateCourse, deleteCourse };
