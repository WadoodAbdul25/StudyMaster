const Task = require("../models/Task");

const getTasks = async (req, res, next) => {
  try {
    const filter = { courseId: req.params.courseId, userId: req.user.id };

    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;

    const tasks = await Task.find(filter);
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, type, dueDate, description, priority } = req.body;

    if (!title || !type || !priority) {
      return res.status(400).json({ error: "title, type, and priority are required" });
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
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
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
