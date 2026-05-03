import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import careerReducer from "../features/career/careerSlice";
import { careerApi } from "../features/career/careerApi";
import roadmapReducer from "../features/rodemap/roadmapSlice";
import { roadmapApi } from "../features/rodemap/roadmapApi";
import gapAnalysisReducer from "../features/gapAnalysis/gapAnalysisSlice";
import { gapAnalysisApi } from "../features/gapAnalysis/gapAnalysisApi";
import { jobMatchApi } from "../features/jobMatch/jobMatchApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    career: careerReducer,
    roadmap: roadmapReducer,
    gapAnalysis: gapAnalysisReducer,
    [careerApi.reducerPath]: careerApi.reducer,
    [roadmapApi.reducerPath]: roadmapApi.reducer,
    [gapAnalysisApi.reducerPath]: gapAnalysisApi.reducer,
    [jobMatchApi.reducerPath]: jobMatchApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(careerApi.middleware)
      .concat(roadmapApi.middleware)
      .concat(gapAnalysisApi.middleware)
      .concat(jobMatchApi.middleware),
});

