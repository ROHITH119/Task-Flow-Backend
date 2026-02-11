const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const roleMiddleware = require("../middlewares/role.middleware")
const router = express.Router()
const userController = require("../controllers/user.controller")


router.get("/members", authMiddleware, roleMiddleware("ADMIN"), userController.getMembers)

module.exports = router



