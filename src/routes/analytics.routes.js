const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const roleMiddleware = require("../middlewares/role.middleware")
const {tasksByStatus, tasksByMember, tasksOverTime} = require("../controllers/analytics.controller")

router.get("/tasks-by-status", authMiddleware, roleMiddleware("ADMIN"), tasksByStatus)
router.get("/tasks-by-member", authMiddleware, roleMiddleware("ADMIN"), tasksByMember)
router.get("/tasks-over-time", authMiddleware, roleMiddleware("ADMIN"), tasksOverTime)

module.exports = router


