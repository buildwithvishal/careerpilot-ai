import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
  {
    resumeText: {
      type: String,
      required: true,
    },

    analysis: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ResumeAnalysis = mongoose.model(
  "ResumeAnalysis",
  resumeAnalysisSchema
);

export default ResumeAnalysis;