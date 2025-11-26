import { GoogleGenAI } from "@google/genai";
import { config } from "../config/env.js";
import Roadmap from "../models/rodemap.model.js";

const ai = new GoogleGenAI({
  apiKey: config.elevareAiApiKey,
});

export const generateRoadmap = async (req, res) => {
  try {
    const { career, userId } = req.body;

    if (!career || !userId) {
      return res.status(400).json({
        success: false,
        message: "career and userId are required",
      });
    }

    const prompt = `
      Create a detailed, interactive roadmap for becoming a successful ${career}.

      Structure the response exactly according to the schema.
      - Create 9-16 nodes organized in a learning progression
      - Use real, working URLs for learnMoreUrl (official docs, MDN, W3Schools, freeCodeCamp, etc.)
      - Categories: fundamentals, intermediate, advanced, specialization
      - Make descriptions clear and actionable
      - Include realistic durations
    `;

    // Define schema for structured output
    const schema = {
      type: "OBJECT",
      properties: {
        title: { type: "STRING" },
        description: { type: "STRING" },
        nodes: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              id: { type: "STRING" },
              title: { type: "STRING" },
              description: { type: "STRING" },
              category: {
                type: "STRING",
                enum: [
                  "fundamentals",
                  "intermediate",
                  "advanced",
                  "specialization",
                ],
              },
              learnMoreUrl: { type: "STRING" },
              duration: { type: "STRING" },
            },
            required: [
              "id",
              "title",
              "description",
              "category",
              "learnMoreUrl",
              "duration",
            ],
          },
        },
      },
      required: ["title", "description", "nodes"],
    };

    // Generate complete content from Gemini using JSON mode
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        thinkingConfig: {
          thinkingBudget: 0, // Disable Thinking
        }
      },
    });

    let roadmapData;
    try {
      // With JSON mode, we can directly parse the text
      roadmapData = JSON.parse(response.text);

      // Validate structure (double check)
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

    console.log(`Roadmap ${roadmap._id} created successfully`);

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
