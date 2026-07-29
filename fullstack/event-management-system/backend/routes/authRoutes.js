import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { validateAuthPayload } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/register", validateAuthPayload, registerUser);
router.post("/login", validateAuthPayload, loginUser);

router.get("/register", (req, res) => {
  res.send("Register API is working. Use POST to register.");
});

export default router;