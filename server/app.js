import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import protect from "./middleware/authMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CareerPilot AI Backend Running",
  });
});

app.get("/api/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected Route Accessed",
    user: req.user,
  });
});

export default app;