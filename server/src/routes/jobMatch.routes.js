import express from "express";
import {
  analyzeJobMatch,
  getUserJobMatches,
  getJobMatchById,
} from "../controllers/jobMatch.controller.js";

const router = express.Router();

router.post("/analyze", analyzeJobMatch);
router.get("/", getUserJobMatches);
router.get("/:id", getJobMatchById);

export default router;
