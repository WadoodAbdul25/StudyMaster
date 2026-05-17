const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { getMe, updateMe, deleteMe } = require("../controllers/userController");

router.get("/me", verifyToken, getMe);
router.put("/me", verifyToken, updateMe);
router.delete("/me", verifyToken, deleteMe);

module.exports = router;
