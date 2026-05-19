require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const documentRoutes = require("./routes/documentRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { deleteDocument, processDocument } = require("./controllers/documentController");
const { updateTask, deleteTask } = require("./controllers/taskController");
const studyPlanRoutes = require("./routes/studyPlanRoutes");
const verifyToken = require("./middleware/verifyToken");

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:3001")
  .split(",")
  .map((origin) => origin.trim());

fs.mkdirSync("uploads", { recursive: true });

// cors middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/courses/:courseId/documents", documentRoutes);
app.use("/api/courses/:courseId/tasks", taskRoutes);
app.delete("/api/documents/:id", verifyToken, deleteDocument);
app.post("/api/documents/:id/process", verifyToken, processDocument);
app.put("/api/tasks/:id", verifyToken, updateTask);
app.delete("/api/tasks/:id", verifyToken, deleteTask);
app.use("/api/courses/:courseId/study-plan", verifyToken, studyPlanRoutes);

mongoose
  .connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err.message));

// global error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  if (err.name === "MulterError") {
    return res.status(400).json({ error: err.message });
  }
  if (err.message === "Only PDF and DOCX files are allowed") {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === "CastError") {
    return res.status(404).json({ error: "Resource not found" });
  }
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
