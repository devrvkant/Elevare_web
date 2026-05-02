import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  extractedSkills: [],
  extractionStatus: "idle", // idle | loading | succeeded | failed
  extractionError: null,
};

const gapAnalysisSlice = createSlice({
  name: "gapAnalysis",
  initialState,
  reducers: {
    setExtractedSkills(state, action) {
      state.extractedSkills = action.payload;
      state.extractionStatus = "succeeded";
    },
    setExtractionStatus(state, action) {
      state.extractionStatus = action.payload;
    },
    setExtractionError(state, action) {
      state.extractionError = action.payload;
      state.extractionStatus = "failed";
    },
    resetExtraction(state) {
      state.extractedSkills = [];
      state.extractionStatus = "idle";
      state.extractionError = null;
    },
  },
});

export const {
  setExtractedSkills,
  setExtractionStatus,
  setExtractionError,
  resetExtraction,
} = gapAnalysisSlice.actions;

export default gapAnalysisSlice.reducer;
