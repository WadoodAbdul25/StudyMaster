// the main entry point for the backend server, setting up Express and defining routes.
const express = require("express");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});