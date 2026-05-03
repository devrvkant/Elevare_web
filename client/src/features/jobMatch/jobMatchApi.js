import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/config/env";

export const jobMatchApi = createApi({
  reducerPath: "jobMatchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.apiUrl}/api/job-match`,
  }),
  tagTypes: ["JobMatches"],
  endpoints: (builder) => ({
    // Analyze job match
    analyzeJobMatch: builder.mutation({
      query: ({ resumeSkills, resumeText, jobDescription, userId }) => ({
        url: "/analyze",
        method: "POST",
        body: { resumeSkills, resumeText, jobDescription, userId },
      }),
      invalidatesTags: ["JobMatches"],
    }),
    // Get all job matches for a user
    getUserJobMatches: builder.query({
      query: (userId) => `?userId=${userId}`,
      transformResponse: (response) => response.data,
      providesTags: ["JobMatches"],
    }),
    // Get a single job match
    getJobMatch: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "JobMatches", id }],
    }),
  }),
});

export const {
  useAnalyzeJobMatchMutation,
  useGetUserJobMatchesQuery,
  useGetJobMatchQuery,
} = jobMatchApi;
