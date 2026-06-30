import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { analyzeResumePDF } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  registerUser,
  loginUser,
  analyzeResume,
  getAnalysisHistory,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post(
  "/analyze-resume",
  authMiddleware,
  analyzeResume
);

router.get(
  "/analysis-history",
  authMiddleware,
  getAnalysisHistory
);

router.post(
  "/analyze-pdf",
  authMiddleware,
  upload.single("resume"),
  analyzeResumePDF
);

export default router;