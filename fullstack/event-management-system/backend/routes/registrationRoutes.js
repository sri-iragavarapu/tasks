import express from "express";
import {
  registerEvent,
  getMyRegistrations,
  cancelRegistration
} from "../controllers/registrationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateRegistrationPayload } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, validateRegistrationPayload, registerEvent);
router.get("/:userId", authMiddleware, getMyRegistrations);
router.delete("/:eventId/:userId", authMiddleware, cancelRegistration);

export default router;