const express = require("express");
const router = express.Router({ mergeParams: true });
const { getPlan, generatePlan } = require("../controllers/studyPlanController");

router.get("/", getPlan);
router.post("/generate", generatePlan);

module.exports = router;
