const express = require("express");
const router = express.Router({ mergeParams: true });
const { generatePlan } = require("../controllers/studyPlanController");

router.post("/generate", generatePlan);

module.exports = router;
