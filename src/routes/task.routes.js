const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const taskController = require("../controllers/task.controller");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  taskController.createTask,
);
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  taskController.getAllTasks,
);
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("MEMBER"),
  taskController.getMyTasks,
);
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("MEMBER"),
  taskController.updateTaskStatus,
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "MEMBER"),
  taskController.getTaskById,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  taskController.deleteTaskById,
);
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  taskController.updateTask,
);

module.exports = router;
