import { Router } from "express";
import { generateRoadmap } from "../controllers/roadmap.controller.js";

const roadmapRouter = Router();

// get /api/roadmap/generate
// SSE endpoint must be GET
roadmapRouter.get("/generate", generateRoadmap);

export default roadmapRouter;
