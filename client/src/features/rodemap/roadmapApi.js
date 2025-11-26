import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/config/env";

export const roadmapApi = createApi({
  reducerPath: "roadmapApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.apiUrl}/api/roadmap`,
  }),
  tagTypes: ["Roadmaps"],
  endpoints: (builder) => ({
    // Generate a new roadmap (creates in DB and returns complete roadmap with _id)
    generateRoadmap: builder.mutation({
      query: ({ career, userId }) => ({
        url: "/generate",
        method: "POST",
        body: { career, userId },
      }),
      invalidatesTags: ["Roadmaps"],
    }),
    // Get all roadmaps for a user
    getUserRoadmaps: builder.query({
      query: (userId) => `/user?userId=${userId}`,
      transformResponse: (response) => response.data,
      providesTags: ["Roadmaps"],
    }),
    // Get a single roadmap
    getRoadmap: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "Roadmaps", id }],
    }),
    // Delete a roadmap
    deleteRoadmap: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roadmaps"],
    }),
  }),
});

export const {
  useGenerateRoadmapMutation,
  useGetUserRoadmapsQuery,
  useGetRoadmapQuery,
  useDeleteRoadmapMutation,
} = roadmapApi;
