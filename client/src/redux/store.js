import { configureStore } from "@reduxjs/toolkit";
import careerReducer from "../features/career/careerSlice";
import { careerApi } from "../features/career/careerApi";
import roadmapReducer from "./slices/roadmapSlice";
import { roadmapApi } from "./api/roadmapApi";

export const store = configureStore({
  reducer: {
    career: careerReducer,
    roadmap: roadmapReducer,
    [careerApi.reducerPath]: careerApi.reducer,
    [roadmapApi.reducerPath]: roadmapApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(careerApi.middleware)
      .concat(roadmapApi.middleware),
});
