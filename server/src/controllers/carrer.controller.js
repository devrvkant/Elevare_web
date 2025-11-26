import axios from "axios";
import { config } from "../config/env.js";

export const predictCareer = async (req, res) => {
  try {
    const { course, skills, interests } = req.body;

    // Call Flask ML API (Python)
    const response = await axios.post(`${config.flaskApiUrl}/predict`, {
      course,
      skills,
      interests,
    });

    res.json({
      success: true,
      predicted_career: response.data.predicted_career,
    });
  } catch (error) {
    console.error("Error in predictCareer:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
