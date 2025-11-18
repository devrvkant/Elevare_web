import { useNavigate } from "react-router";
import {
  MapPin,
  Clock,
  TrendingUp,
  Plus,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetUserRoadmapsQuery } from "../features/rodemap/roadmapApi";
import { useAuth } from "../contexts/AuthContext";

export default function RoadmapsPage() {
  const { currentUser } = useAuth();
  const userId = currentUser ? currentUser.uid : null;
  const navigate = useNavigate();

  const {
    data: roadmaps = [],
    isLoading,
    isError,
    error,
  } = useGetUserRoadmapsQuery(userId, {
    skip: !userId,
    refetchOnMountOrArgChange: true,
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const capitalizeWords = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-purple-600 mx-auto animate-spin" />
          <p className="text-gray-600">Loading your roadmaps...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-gray-200 text-center space-y-4">
          <h2 className="text-xl font-bold text-gray-900">
            Failed to Load Roadmaps
          </h2>
          <p className="text-gray-600">
            {error?.data?.message || "Something went wrong. Please try again."}
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // No user logged in
  if (!userId) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-gray-200 text-center space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Please Sign In</h2>
          <p className="text-gray-600">
            You need to be signed in to view your roadmaps.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          My Roadmaps
        </h1>
        <Button
          onClick={() => navigate("/dashboard")}
          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Roadmap
        </Button>
      </div>

      {/* Roadmaps List */}
      {roadmaps.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            No roadmaps yet
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start your career journey by generating your first personalized
            roadmap
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate First Roadmap
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((roadmap) => (
            <div
              key={roadmap._id}
              onClick={() => navigate(`/dashboard/roadmaps/${roadmap._id}`)}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              {/* Career Title with Time */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors flex-1">
                  {capitalizeWords(roadmap.career)}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDate(roadmap.createdAt)}</span>
                </div>
              </div>

              {/* Node Count */}
              {roadmap.steps && roadmap.steps.length > 0 && (
                <p className="text-sm text-purple-600 mb-3 font-medium flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {roadmap.steps.length} learning steps
                </p>
              )}

              {/* Summary/Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {roadmap.content
                  ? (() => {
                      try {
                        const data = JSON.parse(roadmap.content);
                        return (
                          data.description ||
                          "A comprehensive learning path to achieve your career goals with structured milestones and resources."
                        );
                      } catch {
                        return "A personalized roadmap designed to guide you through your career journey step by step.";
                      }
                    })()
                  : "A personalized roadmap designed to guide you through your career journey step by step."}
              </p>

              {/* Action */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm font-semibold text-purple-600 group-hover:text-purple-700">
                  View Roadmap
                </span>
                <TrendingUp className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
