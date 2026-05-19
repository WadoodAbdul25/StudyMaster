const express = require("express");
const router = express.Router({ mergeParams: true });
const verifyToken = require("../middleware/verifyToken");
const { getTasks, createTask } = require("../controllers/taskController");

router.get("/", verifyToken, getTasks);
router.post("/", verifyToken, createTask);

module.exports = router;
