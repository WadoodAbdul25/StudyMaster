const Task = require("../models/Task");
const Course = require("../models/Course");

const VALID_TYPES = ["assignment", "exam", "quiz", "reading"];
const VALID_PRIORITIES = ["low", "medium", "high"];
const VALID_STATUSES = ["pending", "complete"];

const getTasks = async (req, res, next) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId, userId: req.user.id });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const filter = { courseId: req.params.courseId, userId: req.user.id };

    if (req.query.status) {
      if (!VALID_STATUSES.includes(req.query.status)) {
        return res.status(400).json({ error: "status must be pending or complete" });
      }
      filter.status = req.query.status;
    }

    if (req.query.type) {
      if (!VALID_TYPES.includes(req.query.type)) {
        return res.status(400).json({ error: "type must be assignment, exam, quiz, or reading" });
      }
      filter.type = req.query.type;
    }

    const tasks = await Task.find(filter);
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId, userId: req.user.id });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const { title, type, dueDate, description, priority } = req.body;

    if (!title || !type || !dueDate || !priority) {
      return res.status(400).json({ error: "title, type, dueDate, and priority are required" });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: "type must be assignment, exam, quiz, or reading" });
    }

    if (!VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: "priority must be low, medium, or high" });
    }

    if (Number.isNaN(new Date(dueDate).getTime())) {
      return res.status(400).json({ error: "dueDate must be a valid date" });
    }

    const task = await Task.create({
      courseId: req.params.courseId,
      userId: req.user.id,
      title,
      type,
      dueDate,
      description,
      priority,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, type, dueDate, description, priority, status } = req.body;
    const updates = {};

    if (type && !VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: "type must be assignment, exam, quiz, or reading" });
    }

    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: "priority must be low, medium, or high" });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: "status must be pending or complete" });
    }

    if (dueDate && Number.isNaN(new Date(dueDate).getTime())) {
      return res.status(400).json({ error: "dueDate must be a valid date" });
    }

    if (title !== undefined) updates.title = title;
    if (type !== undefined) updates.type = type;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (status !== undefined) updates.status = status;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "Provide at least one task field to update" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updates,
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
