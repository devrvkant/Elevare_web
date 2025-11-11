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
// import { GoogleGenAI } from "@google/genai";
// import { config } from "../config/env.js";

// // Initialize Gemini client using API key from environment
// const ai = new GoogleGenAI({
//   apiKey: config.elevareAiApiKey,
// });

// export const predictCareer = async (req, res) => {
//   try {
//     const { course, skills, interests } = req.body;

//     if (!course || !skills || !interests) {
//       return res.status(400).json({
//         success: false,
//         message: "course, skills, and interests are required",
//       });
//     }

//     const prompt = `
//       Based on the following details:
//       - Course: ${course}
//       - Skills: ${skills.join(", ")}
//       - Interests: ${interests.join(", ")}

//       Predict the top 3 most suitable career paths for this person.
//       Respond in JSON format like:
//       {
//         "careers": [
//           {"name": "Data Scientist", "reason": "because ..."},
//           {"name": "Software Engineer", "reason": "because ..."},
//           {"name": "AI Researcher", "reason": "because ..."}
//         ]
//       }
//     `;

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: prompt,
//     });

//     const text = response.text;
//     let careers = [];

//     // try {
//     //   careers = JSON.parse(text).careers || [];
//     // } catch {
//     //   careers = [{ name: "Unable to parse Gemini response", reason: text }];
//     // }

//     res.json({ success: true, text });
//   } catch (error) {
//     console.error("Error in predictCareer:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Error predicting career",
//     });
//   }
// };
