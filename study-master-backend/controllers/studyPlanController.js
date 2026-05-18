const StudyPlan = require("../models/StudyPlan");
const Task = require("../models/Task");
const { generateStudyPlan } = require("../ai_funcs");

const generatePlan = async (req, res, next) => {
  try {
    const tasks = await Task.find({ courseId: req.params.courseId, userId: req.user.id });
    if (tasks.length === 0) {
      return res.status(400).json({ error: "No tasks found for this course" });
    }

    const aiRecommendations = await generateStudyPlan(tasks);

    const plan = await StudyPlan.findOneAndUpdate(
      { courseId: req.params.courseId },
      {
        courseId: req.params.courseId,
        userId: req.user.id,
        taskIds: tasks.map((t) => t._id),
        aiRecommendations,
        generatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(201).json(plan);
  } catch (err) {
    next(err);
  }
};

module.exports = { generatePlan };
