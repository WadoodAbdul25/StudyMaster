const express = require("express");
const router = express.Router({ mergeParams: true });
const verifyToken = require("../middleware/verifyToken");
const { upload, verifyCourseAccess, uploadDocument, getDocuments } = require("../controllers/documentController");

router.get("/", verifyToken, verifyCourseAccess, getDocuments);
router.post("/", verifyToken, verifyCourseAccess, upload.single("file"), uploadDocument);

module.exports = router;
