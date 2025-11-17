import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roadmaps: {},
  activeRoadmapId: null,
  status: "idle",
  error: null,
  streamingContent: "",
};

const roadmapSlice = createSlice({
  name: "roadmap",
  initialState,
  reducers: {
    startStreaming: (state, action) => {
      const { id, career } = action.payload;
      state.status = "streaming";
      state.activeRoadmapId = id;
      state.streamingContent = "";
      state.error = null;

      state.roadmaps[id] = {
        id,
        career,
        content: "",
        steps: [],
        status: "streaming",
        createdAt: new Date().toISOString(),
      };
    },
    appendStreamingContent: (state, action) => {
      const { chunk } = action.payload;
      state.streamingContent += chunk;

      if (state.activeRoadmapId && state.roadmaps[state.activeRoadmapId]) {
        state.roadmaps[state.activeRoadmapId].content += chunk;

        // Try to parse steps incrementally
        try {
          const content = state.roadmaps[state.activeRoadmapId].content;

          let jsonStr = null;
          const markdownMatch = content.match(/```json\s*([\s\S]*?)(?:```|$)/);

          if (markdownMatch && markdownMatch[1]) {
            jsonStr = markdownMatch[1];
          } else {
            const directJsonMatch = content.match(
              /\{[\s\S]*?"career"\s*:[\s\S]*?"steps"\s*:[\s\S]*\[[\s\S]*?\]/
            );
            if (directJsonMatch) {
              jsonStr = directJsonMatch[0];
            }
          }

          if (jsonStr) {
            const steps = [];
            const stepPattern =
              /\{\s*"title"\s*:\s*"([^"]*)"\s*,\s*"description"\s*:\s*"([^"]*)"\s*\}/g;
            let match;

            while ((match = stepPattern.exec(jsonStr)) !== null) {
              if (match[1] && match[2]) {
                steps.push({
                  title: match[1],
                  description: match[2],
                });
              }
            }

            if (steps.length > 0) {
              state.roadmaps[state.activeRoadmapId].steps = steps;
            }
          }
        } catch {
          // Silent fail - parsing will continue with next chunk
        }
      }
    },
    completeStreaming: (state, action) => {
      const { content } = action.payload;
      state.status = "success";
      state.streamingContent = content;

      if (state.activeRoadmapId && state.roadmaps[state.activeRoadmapId]) {
        const roadmap = state.roadmaps[state.activeRoadmapId];
        roadmap.status = "completed";
        roadmap.content = content;

        try {
          const jsonMatch =
            content.match(/```json\s*([\s\S]*?)\s*```/) ||
            content.match(/\{[\s\S]*"steps"[\s\S]*\}/);

          if (jsonMatch) {
            const jsonStr = jsonMatch[1] || jsonMatch[0];
            const parsed = JSON.parse(jsonStr);
            roadmap.steps = parsed.steps || [];
          }
        } catch (error) {
          console.error("Failed to parse roadmap JSON:", error);
        }
      }
    },
    failStreaming: (state, action) => {
      const { message } = action.payload;
      state.status = "error";
      state.error = message;

      if (state.activeRoadmapId && state.roadmaps[state.activeRoadmapId]) {
        delete state.roadmaps[state.activeRoadmapId];
      }

      state.streamingContent = "";
    },
    resetStreaming: (state) => {
      state.status = "idle";
      state.streamingContent = "";
      state.error = null;
    },
  },
});

export const {
  startStreaming,
  appendStreamingContent,
  completeStreaming,
  failStreaming,
  resetStreaming,
} = roadmapSlice.actions;

export default roadmapSlice.reducer;
