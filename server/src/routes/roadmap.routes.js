import { Router } from "express";
import {
  generateRoadmap,
  getUserRoadmaps,
  getRoadmapById,
  deleteRoadmap,
} from "../controllers/roadmap.controller.js";

const roadmapRouter = Router();

// SSE endpoint must be GET
roadmapRouter.get("/generate", generateRoadmap);

// Get all roadmaps for a user
roadmapRouter.get("/user", getUserRoadmaps);

// Get a single roadmap by ID
roadmapRouter.get("/:id", getRoadmapById);

// Delete a roadmap
roadmapRouter.delete("/:id", deleteRoadmap);

export default roadmapRouter;
