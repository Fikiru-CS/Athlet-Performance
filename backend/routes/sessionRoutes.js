const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const sessionController = require("../controllers/sessionController");

router.post("/", authMiddleware, sessionController.createSession);
router.get("/", authMiddleware, sessionController.getSessions);
router.delete("/:id", authMiddleware, sessionController.deleteSession);

module.exports = router;