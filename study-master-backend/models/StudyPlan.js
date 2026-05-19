const mongoose = require("mongoose");

const studyPlanSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      unique: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    taskIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    aiRecommendations: { type: String, default: "" },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudyPlan", studyPlanSchema);
