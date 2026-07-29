import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getDashboardData
} from "../controllers/eventController.js";
import { validateEventPayload } from "../middleware/validationMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, validateEventPayload, createEvent);
router.get("/dashboard/stats", getDashboardData);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.put("/:id", authMiddleware, validateEventPayload, updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);

export default router;