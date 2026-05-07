import { Router } from "express";
import {
  createTask,
  deleteTask,
  getOverdueTasks,
  getPinnedTasks,
  getTaskById,
  getTasks,
  getTodayTasks,
  updateTask,
  updateTaskPin,
  updateTaskStatus
} from "../controllers/taskController";

const router = Router();

router.get("/", getTasks);
router.get("/today", getTodayTasks);
router.get("/overdue", getOverdueTasks);
router.get("/pinned", getPinnedTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.patch("/:id/status", updateTaskStatus);
router.patch("/:id/pin", updateTaskPin);
router.delete("/:id", deleteTask);

export default router;
