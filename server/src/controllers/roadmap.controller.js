import { GoogleGenAI } from "@google/genai";
import { config } from "../config/env.js";
import Roadmap from "../models/rodemap.model.js";

// Reuse the same Gemini client
const ai = new GoogleGenAI({
  apiKey: config.elevareAiApiKey,
});

export const generateRoadmap = async (req, res) => {
  let hasError = false;
  let errorMessage = "";

  try {
    const { career, id, userId } = req.query;

    if (!career || !id || !userId) {
      return res.status(400).json({
        success: false,
        message: "career, id, and userId are required",
      });
    }

    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

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
          {"title": "Step 1: Foundation", "description": "..."},
          {"title": "Step 2: Core Skills", "description": "..."},
          ...
        ]
      }
    `;

    let accumulatedContent = "";
    let streamStarted = false;

    try {
      const response = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      for await (const chunk of response) {
        if (chunk.text) {
          streamStarted = true;
          const text = chunk.text;
          accumulatedContent += text;
          res.write(`data: ${text}\n\n`);
        }
      }

      if (streamStarted && accumulatedContent.length > 0) {
        res.write("event: done\ndata: [DONE]\n\n");
      } else {
        throw new Error("No content generated from AI");
      }
    } catch (aiError) {
      hasError = true;
      errorMessage = aiError.message || "AI generation failed";

      if (
        aiError.message?.includes("429") ||
        aiError.message?.includes("quota")
      ) {
        errorMessage = "API quota exceeded. Please try again later.";
      } else if (
        aiError.message?.includes("503") ||
        aiError.message?.includes("overload")
      ) {
        errorMessage =
          "Service temporarily overloaded. Please try again in a moment.";
      }

      console.error("AI generation error:", aiError);
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: errorMessage })}\n\n`
      );
      res.end();
      return;
    }

    res.end();

    // Save to database if generation was successful
    if (!hasError && accumulatedContent.length > 0) {
      try {
        let steps = [];
        try {
          const jsonMatch =
            accumulatedContent.match(/```json\s*([\s\S]*?)\s*```/) ||
            accumulatedContent.match(/\{[\s\S]*"steps"[\s\S]*\}/);

          if (jsonMatch) {
            const jsonStr = jsonMatch[1] || jsonMatch[0];
            const parsed = JSON.parse(jsonStr);
            steps = parsed.steps || [];
          }
        } catch (parseError) {
          console.log("Could not parse JSON, saving raw content");
        }

        await Roadmap.create({
          id,
          userId,
          career,
          content: accumulatedContent,
          steps,
          status: "completed",
        });

        console.log(`✅ Roadmap ${id} saved to database successfully`);
      } catch (dbError) {
        console.error("❌ Failed to save roadmap to database:", dbError.message);
      }
    }
  } catch (error) {
    console.error("Roadmap generation error:", error.message);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to generate roadmap",
      });
    } else {
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`
      );
      res.end();
    }
  }
};

// Get all roadmaps for a user
export const getUserRoadmaps = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const roadmaps = await Roadmap.find({ userId })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json({
      success: true,
      data: roadmaps,
    });
  } catch (error) {
    console.error("Error fetching roadmaps:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch roadmaps",
    });
  }
};

// Get a single roadmap by ID
export const getRoadmapById = async (req, res) => {
  try {
    const { id } = req.params;

    const roadmap = await Roadmap.findOne({ id }).select("-__v");

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

    res.json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    console.error("Error fetching roadmap:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch roadmap",
    });
  }
};

// Delete a roadmap
export const deleteRoadmap = async (req, res) => {
  try {
    const { id } = req.params;

    const roadmap = await Roadmap.findOneAndDelete({ id });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

    res.json({
      success: true,
      message: "Roadmap deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting roadmap:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete roadmap",
    });
  }
};
