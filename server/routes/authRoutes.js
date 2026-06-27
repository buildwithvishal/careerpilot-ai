import express from "express";
import {
  registerUser,
  loginUser,
  analyzeResume,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/analyze-resume", analyzeResume);

export default router;