import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/config/env";

export const gapAnalysisApi = createApi({
  reducerPath: "gapAnalysisApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.apiUrl}/api/gap-analysis`,
  }),
  tagTypes: ["GapAnalyses"],
  endpoints: (builder) => ({
    // Generate a new gap analysis
    generateGapAnalysis: builder.mutation({
      query: ({ currentSkills, targetCareer, userId, roadmapId }) => ({
        url: "/generate",
        method: "POST",
        body: { currentSkills, targetCareer, userId, roadmapId },
      }),
      invalidatesTags: ["GapAnalyses"],
    }),
    // Get all gap analyses for a user
    getUserGapAnalyses: builder.query({
      query: (userId) => `/user?userId=${userId}`,
      transformResponse: (response) => response.data,
      providesTags: ["GapAnalyses"],
    }),
    // Get a single gap analysis
    getGapAnalysis: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "GapAnalyses", id }],
    }),
  }),
});

export const {
  useGenerateGapAnalysisMutation,
  useGetUserGapAnalysesQuery,
  useGetGapAnalysisQuery,
} = gapAnalysisApi;
