const express = require("express");
const router = express.Router();
const { analyze, prioritize } = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/analyze", analyze);
router.post("/prioritize", prioritize);

module.exports = router;
