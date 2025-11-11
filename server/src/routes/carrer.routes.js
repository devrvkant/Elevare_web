import { Router } from "express";
import { predictCareer } from "../controllers/carrer.controller.js";

const careerRouter = Router();

// POST /api/career/predict
careerRouter.post("/predict", predictCareer);

export default careerRouter;
