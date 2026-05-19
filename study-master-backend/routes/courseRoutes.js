const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { getCourses, createCourse, getCourseById, updateCourse, deleteCourse } = require("../controllers/courseController");

router.get("/", verifyToken, getCourses);
router.post("/", verifyToken, createCourse);
router.get("/:id", verifyToken, getCourseById);
router.put("/:id", verifyToken, updateCourse);
router.delete("/:id", verifyToken, deleteCourse);

module.exports = router;
