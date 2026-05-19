const StudyPlan = require("../models/StudyPlan");
const Task = require("../models/Task");
const Course = require("../models/Course");
const { generateStudyPlan } = require("../ai_funcs");

const getPlan = async (req, res, next) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId, userId: req.user.id });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const plan = await StudyPlan.findOne({ courseId: req.params.courseId, userId: req.user.id }).populate("taskIds");
    if (!plan) {
      return res.status(404).json({ error: "No study plan found for this course" });
    }
    res.status(200).json(plan);
  } catch (err) {
    next(err);
  }
};

const generatePlan = async (req, res, next) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId, userId: req.user.id });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const tasks = await Task.find({ courseId: req.params.courseId, userId: req.user.id });
    if (tasks.length === 0) {
      return res.status(400).json({ error: "No tasks found for this course" });
    }

    const aiRecommendations = await generateStudyPlan(tasks);

    const plan = await StudyPlan.findOneAndUpdate(
      { courseId: req.params.courseId, userId: req.user.id },
      {
        courseId: req.params.courseId,
        userId: req.user.id,
        taskIds: tasks.map((t) => t._id),
        aiRecommendations,
        format: "weekly-markdown-v1",
        maxWeeks: 8,
        generatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(201).json(plan);
  } catch (err) {
    next(err);
  }
};

module.exports = { getPlan, generatePlan };
