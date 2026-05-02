import { Router } from "express";
import {
  generateGapAnalysis,
  getUserGapAnalyses,
  getGapAnalysisById,
} from "../controllers/gapAnalysis.controller.js";

const gapAnalysisRouter = Router();

// Generate a new gap analysis
gapAnalysisRouter.post("/generate", generateGapAnalysis);

// Get all gap analyses for a user
gapAnalysisRouter.get("/user", getUserGapAnalyses);

// Get a single gap analysis by ID
gapAnalysisRouter.get("/:id", getGapAnalysisById);

export default gapAnalysisRouter;
