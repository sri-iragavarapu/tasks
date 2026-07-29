import express from "express";
import { getProfile, updateProfile, changePassword } from "../controllers/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateProfilePayload } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.get("/:userId", authMiddleware, getProfile);
router.put("/:userId", authMiddleware, validateProfilePayload, updateProfile);
router.put("/:userId/password", authMiddleware, changePassword);

export default router;