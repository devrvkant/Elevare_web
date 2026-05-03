import mongoose from "mongoose";

const jobMatchSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    jobTitle: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    },
    matchScore: {
      type: Number,
      required: true,
    },
    analysisContent: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "failed"],
      default: "completed",
    },
  },
  { timestamps: true }
);

const JobMatch = mongoose.model("JobMatch", jobMatchSchema);

export default JobMatch;
