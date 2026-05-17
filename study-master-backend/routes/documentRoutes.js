const express = require("express");
const router = express.Router({ mergeParams: true });
const verifyToken = require("../middleware/verifyToken");
const { upload, uploadDocument, getDocuments, deleteDocument } = require("../controllers/documentController");

router.get("/", verifyToken, getDocuments);
router.post("/", verifyToken, upload.single("file"), uploadDocument);

module.exports = router;
