import { GoogleGenAI } from "@google/genai";
import { config } from "../config/env.js";
import Roadmap from "../models/rodemap.model.js";

// Reuse the same Gemini client
const ai = new GoogleGenAI({
  apiKey: config.elevareAiApiKey,
});

export const generateRoadmap = async (req, res) => {
  try {
    const { career, userId } = req.query;

    if (!career || !userId) {
      return res.status(400).json({
        success: false,
        message: "career and userId are required",
      });
    }

    const prompt = `
      Create a detailed, interactive roadmap for becoming a successful ${career}.

      Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
      {
        "title": "Career title",
        "description": "Brief overview (2-3 sentences)",
        "nodes": [
          {
            "id": "unique_id",
            "title": "Node title",
            "description": "What you'll learn (2-3 sentences)",
            "category": "fundamentals|intermediate|advanced|specialization",
            "learnMoreUrl": "https://actual-learning-resource-url.com",
            "duration": "X weeks/months"
          }
        ]
      }

      Guidelines:
      - Create 9-16 nodes organized in a learning progression
      - Use real, working URLs for learnMoreUrl (official docs, MDN, W3Schools, freeCodeCamp, etc.)
      - Categories: fundamentals (basics), intermediate (building skills), advanced (expert level), specialization (career-specific)
      - Make descriptions clear and actionable
      - Include realistic durations
    `;

    // Generate complete content from Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let generatedContent = response.text;

    if (!generatedContent || generatedContent.length === 0) {
      return res.status(500).json({
        success: false,
        message: "No content generated from AI",
      });
    }

    // Clean up the response - remove markdown code blocks if present
    generatedContent = generatedContent
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    // Parse the JSON response
    let roadmapData;
    try {
      roadmapData = JSON.parse(generatedContent);

      // Validate structure
      if (!roadmapData.nodes || !Array.isArray(roadmapData.nodes)) {
        throw new Error("Invalid roadmap structure");
      }
    } catch (parseErr) {
      console.error("JSON parsing failed:", parseErr);
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI response",
      });
    }

    // Save to database only if generation was successful
    const roadmap = await Roadmap.create({
      userId,
      career,
      content: JSON.stringify(roadmapData),
      steps: roadmapData.nodes || [], // Store nodes as steps for compatibility
      status: "completed",
    });

    console.log(`✅ Roadmap ${roadmap._id} created successfully`);

    // Return the complete roadmap with MongoDB _id
    return res.status(201).json({
      success: true,
      data: {
        _id: roadmap._id,
        userId: roadmap.userId,
        career: roadmap.career,
        content: roadmap.content,
        steps: roadmap.steps,
        status: roadmap.status,
        createdAt: roadmap.createdAt,
        updatedAt: roadmap.updatedAt,
      },
    });
  } catch (error) {
    console.error("Roadmap generation error:", error.message);

    // Better error messages
    let errorMessage = "Failed to generate roadmap";
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      errorMessage = "API quota exceeded. Please try again later.";
    } else if (
      error.message?.includes("503") ||
      error.message?.includes("overload")
    ) {
      errorMessage =
        "Service temporarily overloaded. Please try again in a moment.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
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

    const roadmap = await Roadmap.findById(id).select("-__v");

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

    const roadmap = await Roadmap.findByIdAndDelete(id);

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
