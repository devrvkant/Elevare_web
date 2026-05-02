import { GoogleGenAI } from "@google/genai";
import { config } from "../config/env.js";
import GapAnalysis from "../models/gapAnalysis.model.js";

const ai = new GoogleGenAI({
  apiKey: config.elevareAiApiKey,
});

export const generateGapAnalysis = async (req, res) => {
  try {
    const { currentSkills, targetCareer, userId, roadmapId } = req.body;

    if (!currentSkills || !targetCareer || !userId) {
      return res.status(400).json({
        success: false,
        message: "currentSkills, targetCareer, and userId are required",
      });
    }

    if (!Array.isArray(currentSkills) || currentSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "currentSkills must be a non-empty array",
      });
    }

    let roadmapContext = "";
    if (roadmapId) {
      const Roadmap = (await import("../models/rodemap.model.js")).default;
      const roadmap = await Roadmap.findById(roadmapId);
      if (roadmap && roadmap.steps && roadmap.steps.length > 0) {
        roadmapContext = `
      The user has generated a specific learning roadmap for this career. Here are the steps required in their roadmap:
      ${JSON.stringify(roadmap.steps.map(s => ({ title: s.title, description: s.description })))}

      Please align your gap analysis with these specific roadmap steps where possible.
        `;
      }
    }

    const prompt = `
      You are a career counselor and skills gap analyst. A user wants to pursue a career as a "${targetCareer}".
      
      Their current skills extracted from their resume are:
      ${currentSkills.join(", ")}

      ${roadmapContext}

      Perform a thorough career gap analysis. Evaluate each current skill against what is required for the target career (and the provided roadmap steps if any).
      For each required skill category, assess the user's proficiency and identify gaps.

      Be realistic and detailed. Consider:
      - Technical skills required vs. what they have
      - Soft skills needed
      - Tools & technologies
      - Domain knowledge
      - Certifications or qualifications

      Provide a readiness score from 0-100 indicating how prepared they are.
      Categorize skills into matched (they have it), partial (related but needs deepening), and missing (they don't have it). Keep these lists short (max 5 items each).
      Provide category breakdowns for their skills (generate exactly 6 categories).
      Suggest specific learning resources with real URLs. Generate exactly 6 resources, strictly focusing ONLY on the skills they are missing or where they have gaps.
      Keep all text very concise to improve response time.
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        readinessScore: {
          type: "NUMBER",
          description: "Overall readiness score from 0-100",
        },
        summary: {
          type: "STRING",
          description: "Brief 2-3 sentence summary of the analysis",
        },
        matchedSkills: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
            },
            required: ["name"],
          },
        },
        partialSkills: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
            },
            required: ["name"],
          },
        },
        missingSkills: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
            },
            required: ["name"],
          },
        },
        categoryScores: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              category: { type: "STRING" },
              score: { type: "NUMBER", description: "Score 0-100" },
              maxScore: { type: "NUMBER", description: "Always 100" },
              details: { type: "STRING" },
            },
            required: ["category", "score", "maxScore", "details"],
          },
        },
        learningResources: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING" },
              url: { type: "STRING" },
              type: { type: "STRING", enum: ["course", "documentation", "tutorial", "certification", "book"] },
              skillCovered: { type: "STRING" },
              platform: { type: "STRING" },
            },
            required: ["title", "url", "type", "skillCovered", "platform"],
          },
        },
      },
      required: [
        "readinessScore",
        "summary",
        "matchedSkills",
        "partialSkills",
        "missingSkills",
        "categoryScores",
        "learningResources",
      ],
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });

    let analysisData;
    try {
      analysisData = JSON.parse(response.text);

      if (typeof analysisData.readinessScore !== "number") {
        throw new Error("Invalid analysis structure - missing readinessScore");
      }
    } catch (parseErr) {
      console.error("Gap analysis JSON parsing failed:", parseErr);
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI response",
      });
    }

    // Save to database
    const gapAnalysis = await GapAnalysis.create({
      userId,
      targetCareer,
      currentSkills,
      readinessScore: analysisData.readinessScore,
      analysisContent: JSON.stringify(analysisData),
      status: "completed",
    });

    console.log(`Gap analysis ${gapAnalysis._id} created successfully`);

    return res.status(201).json({
      success: true,
      data: {
        _id: gapAnalysis._id,
        userId: gapAnalysis.userId,
        targetCareer: gapAnalysis.targetCareer,
        currentSkills: gapAnalysis.currentSkills,
        readinessScore: gapAnalysis.readinessScore,
        analysisContent: gapAnalysis.analysisContent,
        status: gapAnalysis.status,
        createdAt: gapAnalysis.createdAt,
        updatedAt: gapAnalysis.updatedAt,
      },
    });
  } catch (error) {
    console.error("Gap analysis generation error:", error.message);

    let errorMessage = "Failed to generate gap analysis";
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      errorMessage = "API quota exceeded. Please try again later.";
    } else if (error.message?.includes("503") || error.message?.includes("overload")) {
      errorMessage = "Service temporarily overloaded. Please try again in a moment.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

// Get all gap analyses for a user
export const getUserGapAnalyses = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const analyses = await GapAnalysis.find({ userId })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json({
      success: true,
      data: analyses,
    });
  } catch (error) {
    console.error("Error fetching gap analyses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch gap analyses",
    });
  }
};

// Get a single gap analysis by ID
export const getGapAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await GapAnalysis.findById(id).select("-__v");

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Gap analysis not found",
      });
    }

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Error fetching gap analysis:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch gap analysis",
    });
  }
};
