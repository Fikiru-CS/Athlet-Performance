const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const analyticsController = require("../controllers/analyticsController");

router.get("/summary", authMiddleware, analyticsController.getSummary);

module.exports = router;