const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const goalController = require("../controllers/goalController");

router.post("/", authMiddleware, roleMiddleware("athlete"), goalController.createGoal);
router.get("/", authMiddleware, goalController.getGoals);
router.put("/:id", authMiddleware, goalController.updateGoal);
router.delete("/:id", authMiddleware, goalController.deleteGoal);

module.exports = router;