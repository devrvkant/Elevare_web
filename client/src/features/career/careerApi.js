import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const careerApi = createApi({
  reducerPath: "careerApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5500/api/career" }),
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
