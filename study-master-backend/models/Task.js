const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["assignment", "exam", "quiz", "reading"],
      required: true,
    },
    dueDate: { type: Date },
    description: { type: String, default: "" },
    priority: { type: String, enum: ["low", "medium", "high"], required: true },
    status: { type: String, enum: ["pending", "complete"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
