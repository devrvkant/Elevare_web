import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/config/env";

export const roadmapApi = createApi({
  reducerPath: "roadmapApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.apiUrl}/api/roadmap`,
  }),
  tagTypes: ["Roadmaps"],
  endpoints: (builder) => ({
    // Get all roadmaps for a user
    getUserRoadmaps: builder.query({
      query: (userId) => `/user?userId=${userId}`,
      transformResponse: (response) => response.data,
      providesTags: ["Roadmaps"],
    }),
    // Get a single roadmap
    getRoadmap: builder.query({
      query: (id) => `/${id}`,
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
  useGetUserRoadmapsQuery,
  useGetRoadmapQuery,
  useDeleteRoadmapMutation,
} = roadmapApi;

// Manual SSE streaming function with proper error handling
export const streamRoadmap = (
  career,
  id,
  userId,
  onChunk,
  onComplete,
  onError
) => {
  const url = `${
    config.apiUrl
  }/api/roadmap/generate?career=${encodeURIComponent(
    career
  )}&id=${encodeURIComponent(id)}&userId=${encodeURIComponent(
    userId || "anonymous"
  )}`;

  const eventSource = new EventSource(url);
  let accumulatedData = "";
  let hasReceivedData = false;

  // Handle regular messages
  eventSource.onmessage = (event) => {
    if (event.data === "[DONE]") {
      eventSource.close();
      onComplete(accumulatedData);
      return;
    }

    hasReceivedData = true;
    accumulatedData += event.data;
    onChunk(event.data, accumulatedData);
  };

  // Handle custom events
  eventSource.addEventListener("done", () => {
    eventSource.close();
    onComplete(accumulatedData);
  });

  eventSource.addEventListener("error", (event) => {
    eventSource.close();
    try {
      const errorData = JSON.parse(event.data);
      onError({
        message: errorData.error || "Failed to generate roadmap",
        type: "api_error",
      });
    } catch {
      onError({
        message: event.data || "Failed to generate roadmap",
        type: "api_error",
      });
    }
  });

  // Handle connection errors
  eventSource.onerror = (error) => {
    console.error("SSE Connection Error:", error);
    eventSource.close();

    // Provide more specific error message based on the situation
    if (!hasReceivedData) {
      onError({
        message: "Failed to connect to the server. Please check your connection and try again.",
        type: "connection_error",
      });
    } else {
      onError({
        message: "Connection lost while generating roadmap. Please try again.",
        type: "stream_interrupted",
      });
    }
  };

  // Return eventSource for manual cleanup if needed
  return eventSource;
};
