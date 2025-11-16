import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    career: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    steps: {
      type: [
        {
          title: String,
          description: String,
        },
      ],
      default: [],
    },
    status: {
      type: String,
      enum: ["streaming", "completed", "failed"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
roadmapSchema.index({ userId: 1, createdAt: -1 });

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;
