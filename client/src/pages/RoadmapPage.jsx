import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  RefreshCw,
  Target,
  CheckCircle2,
  Circle,
  Zap,
  Sparkles,
} from "lucide-react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";

// Custom node component for roadmap steps
const StepNode = ({ data }) => {
  return (
    <div
      className={`px-6 py-4 rounded-xl shadow-lg border-2 transition-all duration-300 ${
        data.completed
          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-400"
          : "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            data.completed
              ? "bg-green-500"
              : "bg-gradient-to-br from-pink-500 to-purple-600"
          }`}
        >
          {data.completed ? (
            <CheckCircle2 className="w-5 h-5 text-white" />
          ) : (
            <span className="text-white font-bold text-sm">{data.number}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2">
            {data.title}
          </h3>
          {data.description && (
            <p className="text-xs text-gray-600 line-clamp-3">
              {data.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  stepNode: StepNode,
};

export default function RoadmapPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { roadmaps, streamingContent, status, error } = useSelector(
    (state) => state.roadmap
  );
  console.log(roadmaps)
  const [displayedContent, setDisplayedContent] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const roadmap = roadmaps[id];
  const isStreaming = status === "streaming";
  const hasError = status === "error";

  // Generate React Flow nodes and edges from roadmap steps
  const generateFlowChart = useCallback(
    (steps) => {
      if (!steps || steps.length === 0) return;

      const newNodes = [];
      const newEdges = [];
      const verticalSpacing = 180;
      const horizontalSpacing = 400;
      const columns = 2; // 2 columns layout

      steps.forEach((step, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);

        newNodes.push({
          id: `step-${index}`,
          type: "stepNode",
          position: {
            x: col * horizontalSpacing,
            y: row * verticalSpacing,
          },
          data: {
            number: index + 1,
            title: step.title,
            description: step.description,
            completed: false,
          },
        });

        // Add edge to next node
        if (index < steps.length - 1) {
          newEdges.push({
            id: `edge-${index}`,
            source: `step-${index}`,
            target: `step-${index + 1}`,
            type: "smoothstep",
            animated: true,
            style: {
              stroke: "#9333ea",
              strokeWidth: 2,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#9333ea",
            },
          });
        }
      });

      setNodes(newNodes);
      setEdges(newEdges);
    },
    [setNodes, setEdges]
  );

  // Generate flow chart when roadmap is loaded
  useEffect(() => {
    if (roadmap?.steps && roadmap.steps.length > 0 && !isStreaming) {
      generateFlowChart(roadmap.steps);
    }
  }, [roadmap, isStreaming, generateFlowChart]);

  // Typing effect for streaming content
  useEffect(() => {
    if (isStreaming && streamingContent) {
      const timer = setTimeout(() => {
        if (typingIndex < streamingContent.length) {
          setDisplayedContent(streamingContent.slice(0, typingIndex + 1));
          setTypingIndex(typingIndex + 1);
        }
      }, 10);

      return () => clearTimeout(timer);
    } else if (roadmap && !isStreaming) {
      setDisplayedContent(roadmap.content);
    }
  }, [streamingContent, typingIndex, isStreaming, roadmap]);

  // Reset typing when content changes
  useEffect(() => {
    setTypingIndex(0);
    setDisplayedContent("");
  }, [id]);

  // Get back navigation path
  const getBackPath = () => {
    // If came from dashboard, go back there
    if (location.state?.from === "dashboard") {
      return "/dashboard";
    }
    // Otherwise go to roadmaps list
    return "/dashboard/roadmaps";
  };

  // Error state
  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-red-100">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Generation Failed
            </h2>
            <p className="text-gray-600">
              {error ||
                "We encountered an error while generating your roadmap. This could be due to high demand or a temporary service issue."}
            </p>

            <div className="flex flex-col gap-3 mt-6">
              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 hover:from-pink-600 hover:via-purple-600 hover:to-violet-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={() => navigate("/dashboard/roadmaps")}
                variant="outline"
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                View My Roadmaps
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 text-left">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                💡 Tips:
              </p>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Check your internet connection</li>
                <li>Try again in a few moments</li>
                <li>If the problem persists, contact support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!roadmap && !isStreaming) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-purple-100 text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Roadmap Not Found
          </h2>
          <p className="text-gray-600">
            This roadmap doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate("/dashboard/roadmaps")}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 hover:from-pink-600 hover:via-purple-600 hover:to-violet-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            View My Roadmaps
          </Button>
        </div>
      </div>
    );
  }

  // Main immersive layout
  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Top Bar - Fixed */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <Button
            variant="outline"
            onClick={() => navigate(getBackPath())}
            className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            {isStreaming ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  Generating your roadmap...
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">
                  {roadmap?.career || "Career Roadmap"}
                </span>
              </>
            )}
          </div>
          <div className="w-[100px]" /> {/* Spacer for balance */}
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex flex-col lg:flex-row h-full pt-[73px]">
        {/* Left Panel - Roadmap Steps */}
        <div className="w-full lg:w-1/2 h-full overflow-y-auto lg:border-r border-purple-200 bg-white/50 backdrop-blur-sm">
          <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-xl">
              <div className="flex items-center gap-3 lg:gap-4 mb-3">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white line-clamp-2">
                  {roadmap?.career || "Your Career Roadmap"}
                </h1>
              </div>
              <p className="text-purple-100 text-xs lg:text-sm">
                A comprehensive guide to achieving your career goals
              </p>
            </div>

            {/* Steps */}
            {roadmap?.steps && roadmap.steps.length > 0 ? (
              <div className="space-y-3 lg:space-y-4">
                {roadmap.steps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-4 lg:p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-purple-100 group"
                  >
                    <div className="flex items-start gap-3 lg:gap-4">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-sm lg:text-base">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base lg:text-lg font-bold text-gray-800 mb-1 lg:mb-2 flex items-center gap-2 line-clamp-2">
                          {step.title}
                          {!isStreaming && (
                            <Circle className="w-3 h-3 lg:w-4 lg:h-4 text-purple-400 flex-shrink-0" />
                          )}
                        </h3>
                        <p className="text-gray-600 text-xs lg:text-sm leading-relaxed whitespace-pre-wrap">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isStreaming ? (
              /* Streaming Content */
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-md border border-purple-100">
                <div className="relative">
                  <pre className="whitespace-pre-wrap text-gray-700 font-sans text-xs lg:text-sm leading-relaxed">
                    {displayedContent}
                    <span className="inline-block w-2 h-4 bg-purple-500 animate-pulse ml-1" />
                  </pre>
                </div>
              </div>
            ) : (
              /* Loading State */
              <div className="bg-white rounded-xl p-8 lg:p-12 shadow-md border border-purple-100">
                <div className="flex flex-col items-center justify-center gap-4 lg:gap-6">
                  <div className="relative">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                      <Zap className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full animate-ping opacity-20" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-2">
                      Crafting your personalized roadmap...
                    </h3>
                    <p className="text-gray-600 text-xs lg:text-sm">
                      Our AI is analyzing the best path for your career
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - React Flow Visualization */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-full bg-gradient-to-br from-purple-50 to-pink-50 relative">
          {nodes.length > 0 ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.3}
              maxZoom={1.5}
              defaultEdgeOptions={{
                type: "smoothstep",
                animated: true,
              }}
              className="bg-transparent"
            >
              <Background color="#e9d5ff" gap={16} size={1} variant="dots" />
              <Controls
                className="bg-white/80 backdrop-blur-lg border border-purple-200 rounded-lg shadow-lg"
                showInteractive={false}
              />
              <MiniMap
                nodeColor={() => "#a855f7"}
                maskColor="rgba(255, 255, 255, 0.8)"
                className="bg-white/80 backdrop-blur-lg border border-purple-200 rounded-lg shadow-lg !hidden sm:!block"
              />
            </ReactFlow>
          ) : (
            <div className="h-full flex items-center justify-center p-6 lg:p-12">
              <div className="text-center space-y-3 lg:space-y-4">
                <div className="relative inline-block">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                    <Target className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full animate-ping opacity-20" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-800">
                  Building your roadmap visualization...
                </h3>
                <p className="text-gray-600 text-xs lg:text-sm max-w-md mx-auto">
                  Your personalized career path will appear here as an
                  interactive flowchart
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
