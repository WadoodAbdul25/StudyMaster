const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, enum: ["pdf", "docx"], required: true },
    filePath: { type: String, required: true },
    rawText: { type: String, default: "" },
    processedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
