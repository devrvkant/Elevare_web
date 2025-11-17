import { configureStore } from "@reduxjs/toolkit";
import careerReducer from "../features/career/careerSlice";
import { careerApi } from "../features/career/careerApi";
import roadmapReducer from "../features/rodemap/roadmapSlice";
import { roadmapApi } from "../features/rodemap/roadmapApi";

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
