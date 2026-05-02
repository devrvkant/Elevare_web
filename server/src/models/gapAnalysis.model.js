import mongoose from "mongoose";

const gapAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    targetCareer: {
      type: String,
      required: true,
    },
    currentSkills: {
      type: [String],
      default: [],
    },
    readinessScore: {
      type: Number,
      default: 0,
    },
    analysisContent: {
      type: String, // Full JSON string from Gemini
      default: "",
    },
    status: {
      type: String,
      enum: ["completed", "failed"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
gapAnalysisSchema.index({ userId: 1, createdAt: -1 });

const GapAnalysis = mongoose.model("GapAnalysis", gapAnalysisSchema);

export default GapAnalysis;
