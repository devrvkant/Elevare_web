import { GoogleGenAI } from "@google/genai";
import { config } from "../config/env.js";
import JobMatch from "../models/jobMatch.model.js";

const ai = new GoogleGenAI({
  apiKey: config.elevareAiApiKey,
});

export const analyzeJobMatch = async (req, res) => {
  try {
    const { resumeSkills, resumeText, jobDescription, userId } = req.body;

    if (!jobDescription || !userId) {
      return res.status(400).json({
        success: false,
        message: "jobDescription and userId are required",
      });
    }

    if ((!resumeSkills || resumeSkills.length === 0) && !resumeText) {
      return res.status(400).json({
        success: false,
        message: "Either resumeSkills or resumeText is required",
      });
    }

    const skillsContext = resumeSkills && resumeSkills.length > 0
      ? `Resume Skills: ${resumeSkills.join(", ")}`
      : "";

    const textContext = resumeText
      ? `Resume Content Summary: ${resumeText.substring(0, 2000)}`
      : "";

    const prompt = `
      You are an expert HR recruiter and job matching analyst. Analyze how well a candidate's resume matches a specific job description.

      ${skillsContext}
      ${textContext}

      Job Description:
      """
      ${jobDescription.substring(0, 3000)}
      """

      Perform a detailed job-resume match analysis. Be realistic and thorough.

      Instructions:
      - Extract the job title and company name from the JD if present
      - Calculate an overall match percentage (0-100)
      - Identify keywords from the JD that ARE found in the resume (matched)
      - Identify keywords from the JD that are NOT found in the resume (missing)
      - Break down compatibility into exactly 5 dimensions
      - Provide 4-5 specific, actionable tailoring tips
      - Give a brief verdict summary
      - Keep all text concise
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        jobTitle: {
          type: "STRING",
          description: "Extracted job title from JD or 'Unknown Position'",
        },
        company: {
          type: "STRING",
          description: "Extracted company name from JD or 'Not Specified'",
        },
        matchScore: {
          type: "NUMBER",
          description: "Overall match percentage 0-100",
        },
        verdict: {
          type: "STRING",
          description: "2-3 sentence verdict summary of the match",
        },
        matchedKeywords: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Keywords from JD found in resume (max 12)",
        },
        missingKeywords: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Important keywords from JD missing in resume (max 10)",
        },
        dimensions: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING", description: "Dimension name e.g. Technical Skills, Experience Level" },
              score: { type: "NUMBER", description: "Score 0-100" },
              note: { type: "STRING", description: "Brief 1-line note about this dimension" },
            },
            required: ["name", "score", "note"],
          },
          description: "Exactly 5 compatibility dimensions",
        },
        tailoringTips: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              tip: { type: "STRING", description: "The actionable suggestion" },
              impact: {
                type: "STRING",
                enum: ["high", "medium", "low"],
                description: "Expected impact level",
              },
            },
            required: ["tip", "impact"],
          },
          description: "4-5 specific resume tailoring suggestions",
        },
        experienceMatch: {
          type: "STRING",
          enum: ["overqualified", "strong_match", "partial_match", "underqualified"],
          description: "How the candidate's experience level compares to JD requirements",
        },
      },
      required: [
        "jobTitle",
        "company",
        "matchScore",
        "verdict",
        "matchedKeywords",
        "missingKeywords",
        "dimensions",
        "tailoringTips",
        "experienceMatch",
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

      if (typeof analysisData.matchScore !== "number") {
        throw new Error("Invalid analysis structure - missing matchScore");
      }
    } catch (parseErr) {
      console.error("Job match JSON parsing failed:", parseErr);
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI response",
      });
    }

    // Save to database
    const jobMatch = await JobMatch.create({
      userId,
      jobTitle: analysisData.jobTitle,
      company: analysisData.company,
      matchScore: analysisData.matchScore,
      analysisContent: JSON.stringify(analysisData),
      status: "completed",
    });

    console.log(`Job match ${jobMatch._id} created successfully`);

    return res.status(201).json({
      success: true,
      data: {
        _id: jobMatch._id,
        userId: jobMatch.userId,
        jobTitle: jobMatch.jobTitle,
        company: jobMatch.company,
        matchScore: jobMatch.matchScore,
        analysisContent: jobMatch.analysisContent,
        status: jobMatch.status,
        createdAt: jobMatch.createdAt,
        updatedAt: jobMatch.updatedAt,
      },
    });
  } catch (error) {
    console.error("Job match analysis error:", error.message);

    let errorMessage = "Failed to analyze job match";
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

// Get all job matches for a user
export const getUserJobMatches = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const matches = await JobMatch.find({ userId })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json({
      success: true,
      data: matches,
    });
  } catch (error) {
    console.error("Error fetching job matches:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job matches",
    });
  }
};

// Get a single job match by ID
export const getJobMatchById = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await JobMatch.findById(id).select("-__v");

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Job match not found",
      });
    }

    res.json({
      success: true,
      data: match,
    });
  } catch (error) {
    console.error("Error fetching job match:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job match",
    });
  }
};
