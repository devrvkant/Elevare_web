import { GoogleGenAI } from "@google/genai";
import { config } from "../config/env.js";

// Reuse the same Gemini client
const ai = new GoogleGenAI({
  apiKey: config.elevareAiApiKey,
});

export const generateRoadmap = async (req, res) => {
  try {
    const { career } = req.query;

    if (!career) {
      return res.status(400).json({
        success: false,
        message: "career is required",
      });
    }
    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.(); // optional but helps send headers immediately

    const prompt = `
      Create a clear, step-by-step roadmap for becoming a successful ${career}.
      Include:
      1. Key skills and technologies to learn (in order)
      2. Recommended courses or certifications
      3. Real-world projects to practice
      4. How to build a strong portfolio
      5. Job preparation tips

      Format response as JSON:
      {
        "career": "${career}",
        "steps": [
          {"title": "Step 1", "description": "..."},
          {"title": "Step 2", "description": "..."},
          ...
        ]
      }
    `;

    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    for await (const chunk of response) {
      if (chunk.text) {
        // Send streaming chunk as SSE event
        res.write(`data: ${chunk.text}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    res.write(`data: Error: ${error.message}\n\n`);
    res.end();
  }
};
