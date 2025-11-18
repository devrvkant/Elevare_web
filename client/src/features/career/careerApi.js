import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../config/env.js";

export const careerApi = createApi({
  reducerPath: "careerApi",
  baseQuery: fetchBaseQuery({ baseUrl: config.careerApiUrl }),
  endpoints: (builder) => ({
    predictCareer: builder.mutation({
      query: (body) => ({
        url: "/predict",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { usePredictCareerMutation } = careerApi;
