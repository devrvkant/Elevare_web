import { configureStore } from "@reduxjs/toolkit";
import careerReducer from "../features/career/careerSlice";
import { careerApi } from "../features/career/careerApi";

export const store = configureStore({
  reducer: {
    career: careerReducer,
    [careerApi.reducerPath]: careerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(careerApi.middleware),
});
