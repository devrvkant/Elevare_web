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
import { useGetUserRoadmapsQuery } from "../redux/api/roadmapApi";
import { useUser } from "@clerk/clerk-react";

export default function RoadmapsPage() {
  const { user } = useUser();
  const userId = user ? user.id : null;
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
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "streaming":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "streaming":
        return "Generating...";
      default:
        return "Draft";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-50 p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-purple-600 mx-auto animate-spin" />
          <h3 className="text-xl font-semibold text-gray-800">
            Loading your roadmaps...
          </h3>
          <p className="text-gray-600">
            Please wait while we fetch your career paths
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-50 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-red-200 text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Failed to Load Roadmaps
          </h2>
          <p className="text-gray-600">
            {error?.data?.message || "Something went wrong. Please try again."}
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 hover:from-pink-600 hover:via-purple-600 hover:to-violet-700"
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-50 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-purple-100 text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Please Sign In</h2>
          <p className="text-gray-600">
            You need to be signed in to view your roadmaps.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">
                My Career Roadmaps
              </h1>
              <p className="text-gray-600">
                Track your career journey and explore different paths
              </p>
            </div>
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 hover:from-pink-600 hover:via-purple-600 hover:to-violet-700 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Generate New
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {roadmaps.length}
                  </p>
                  <p className="text-sm text-gray-600">Total Roadmaps</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {roadmaps.length &&
                      roadmaps.filter((r) => r.status === "completed").length}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {roadmaps.length &&
                      roadmaps.filter((r) => r.status === "streaming").length}
                  </p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmaps List */}
        {roadmaps.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-purple-100 shadow-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              No roadmaps yet
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start your career journey by generating your first personalized
              roadmap. Get AI-powered guidance tailored to your goals.
            </p>
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 hover:from-pink-600 hover:via-purple-600 hover:to-violet-700 shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Your First Roadmap
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap._id}
                onClick={() => navigate(`/dashboard/roadmaps/${roadmap._id}`)}
                className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      roadmap.status
                    )}`}
                  >
                    {getStatusText(roadmap.status)}
                  </span>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>

                {/* Career Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                  {roadmap.career}
                </h3>

                {/* Node Count */}
                {roadmap.steps && roadmap.steps.length > 0 && (
                  <p className="text-sm text-purple-600 mb-3 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {roadmap.steps.length} learning nodes
                  </p>
                )}

                {/* Date */}
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(roadmap.createdAt)}
                </div>

                {/* Preview Description */}
                {roadmap.content &&
                  (() => {
                    try {
                      const data = JSON.parse(roadmap.content);
                      return (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                          {data.description ||
                            "Interactive learning roadmap with visual nodes"}
                        </p>
                      );
                    } catch {
                      return (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                          {roadmap.content.substring(0, 100)}...
                        </p>
                      );
                    }
                  })()}

                {/* Action */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm font-medium text-purple-600 group-hover:text-purple-700">
                    View Roadmap
                  </span>
                  <TrendingUp className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
