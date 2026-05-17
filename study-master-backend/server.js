require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const documentRoutes = require("./routes/documentRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { deleteDocument } = require("./controllers/documentController");

const app = express();
const PORT = process.env.PORT || 5000;

// cors middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/courses/:courseId/documents", documentRoutes);
app.use("/api/courses/:courseId/tasks", taskRoutes);
app.delete("/api/documents/:id", require("./middleware/verifyToken"), deleteDocument);

mongoose
  .connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err.message));

// global error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
