import { Router } from "express";
import {
  generateRoadmap,
  getUserRoadmaps,
  getRoadmapById,
} from "../controllers/roadmap.controller.js";

const roadmapRouter = Router();

// Generate a new roadmap
roadmapRouter.post("/generate", generateRoadmap);

// Get all roadmaps for a user
roadmapRouter.get("/user", getUserRoadmaps);

// Get a single roadmap by ID
roadmapRouter.get("/:id", getRoadmapById);

export default roadmapRouter;
