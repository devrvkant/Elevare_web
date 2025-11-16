import { useParams, useNavigate, useLocation } from "react-router";
import { useState, useCallback, useMemo } from "react";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  RefreshCw,
  Target,
  Sparkles,
  ExternalLink,
  Clock,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetRoadmapQuery } from "@/redux/api/roadmapApi";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Custom Node Component
const CustomNode = ({ data }) => {
  const categoryColors = {
    fundamentals: "from-blue-500 to-cyan-500",
    intermediate: "from-purple-500 to-pink-500",
    advanced: "from-orange-500 to-red-500",
    specialization: "from-green-500 to-emerald-500",
  };

  const categoryIcons = {
    fundamentals: "🎯",
    intermediate: "🚀",
    advanced: "⚡",
    specialization: "💎",
  };

  const gradient = categoryColors[data.category] || "from-gray-500 to-gray-600";
  const icon = categoryIcons[data.category] || "📚";

  return (
    <div className="group">
      {/* Input Handle (top) - for incoming connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-purple-500 border-2 border-white"
      />

      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300 w-[280px]">
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${gradient} p-4 rounded-t-xl`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{icon}</span>
            <span className="text-xs font-semibold text-white/90 uppercase tracking-wide">
              {data.category}
            </span>
          </div>
          <h3 className="text-white font-bold text-lg leading-tight">
            {data.title}
          </h3>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {data.description}
          </p>

          {data.duration && (
            <div className="flex items-center gap-2 text-xs text-purple-600">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-medium">{data.duration}</span>
            </div>
          )}

          {data.learnMoreUrl && (
            <a
              href={data.learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors group-hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <span>Learn More</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Output Handle (bottom) - for outgoing connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-purple-500 border-2 border-white"
      />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export default function RoadmapPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedNode, setSelectedNode] = useState(null);

  // Fetch roadmap from server using MongoDB _id
  const {
    data: roadmap,
    isLoading,
    isError,
    error,
  } = useGetRoadmapQuery(id, {
    skip: !id,
  });

  console.log("RoadmapPage Debug:", { id, roadmap, isLoading, isError, error });

  // Parse roadmap data and create nodes/edges
  const { nodes, edges, roadmapData, isOldFormat } = useMemo(() => {
    if (!roadmap?.content) {
      return { nodes: [], edges: [], roadmapData: null, isOldFormat: false };
    }

    try {
      const data = JSON.parse(roadmap.content);

      // Check if it's the new JSON format with nodes
      if (!data.nodes || !Array.isArray(data.nodes)) {
        console.log("Old format detected - no nodes array");
        return { nodes: [], edges: [], roadmapData: null, isOldFormat: true };
      }

      // Create nodes with positions
      const nodeList = data.nodes.map((node, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;

        return {
          id: node.id,
          type: "custom",
          position: {
            x: col * 350 + 50,
            y: row * 250 + 50,
          },
          data: {
            ...node,
            label: node.title,
          },
        };
      });

      // Create edges connecting sequential nodes
      const edgeList = [];
      for (let i = 0; i < nodeList.length - 1; i++) {
        edgeList.push({
          id: `e${i}-${i + 1}`,
          source: nodeList[i].id,
          target: nodeList[i + 1].id,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#9333ea", strokeWidth: 2 },
        });
      }

      return {
        nodes: nodeList,
        edges: edgeList,
        roadmapData: data,
        isOldFormat: false,
      };
    } catch (err) {
      console.error("Failed to parse roadmap content:", err);
      // Old format - plain text
      return { nodes: [], edges: [], roadmapData: null, isOldFormat: true };
    }
  }, [roadmap?.content]);

  const [nodesState, setNodes] = useNodesState(nodes);
  const [edgesState, setEdges] = useEdgesState(edges);

  // Update nodes when roadmap changes
  useMemo(() => {
    setNodes(nodes);
    setEdges(edges);
  }, [nodes, edges, setNodes, setEdges]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.data);
  }, []);

  // Get back navigation path
  const getBackPath = () => {
    if (location.state?.from === "dashboard") {
      return "/dashboard";
    }
    return "/dashboard/roadmaps";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800">
            Loading your roadmap...
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch your career path
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
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
  if (!roadmap) {
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

  // Old format roadmap - show message to regenerate
  if (isOldFormat || nodes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-50 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-xl border border-purple-100 text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
            <RefreshCw className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Upgrade Required</h2>
          <p className="text-gray-600 leading-relaxed">
            This roadmap was created with an older format. To experience the new{" "}
            <strong>interactive node-based graph</strong> with clickable
            learning resources, please generate a new roadmap!
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-purple-200">
            <p className="text-sm font-semibold text-purple-900 mb-2">
              ✨ New Features:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 text-left list-disc list-inside">
              <li>Interactive visual graph with connected nodes</li>
              <li>Color-coded by learning category</li>
              <li>Click nodes to see details</li>
              <li>Direct links to learning resources</li>
              <li>Zoom, pan, and explore</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 hover:from-pink-600 hover:via-purple-600 hover:to-violet-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate New Roadmap
            </Button>
            <Button
              onClick={() => navigate("/dashboard/roadmaps")}
              variant="outline"
              className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              View All Roadmaps
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main layout - Interactive graph view
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <Button
            variant="outline"
            onClick={() => navigate(getBackPath())}
            className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm sm:text-base font-medium text-gray-700 truncate max-w-[200px] sm:max-w-none">
              {roadmapData?.title || roadmap.career || "Career Roadmap"}
            </span>
          </div>
          <div className="w-[80px] sm:w-[100px]" />
        </div>
      </div>

      {/* Description Banner */}
      {roadmapData?.description && (
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 px-4 sm:px-6 py-4 sm:py-6 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <p className="text-white text-sm sm:text-base leading-relaxed text-center">
              {roadmapData.description}
            </p>
          </div>
        </div>
      )}

      {/* React Flow Container */}
      <div
        className="flex-1 relative"
        style={{ width: "100%", height: "100%" }}
      >
        <ReactFlow
          nodes={nodesState}
          edges={edgesState}
          onNodesChange={() => {}}
          onEdgesChange={() => {}}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
          className="bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50"
          minZoom={0.1}
          maxZoom={1.5}
        >
          <Background color="#e9d5ff" gap={16} size={1} variant="dots" />
          <Controls className="bg-white/90 backdrop-blur-lg border border-purple-200 rounded-lg shadow-lg" />
          <MiniMap
            nodeColor={(node) => {
              const category = node.data.category;
              const colors = {
                fundamentals: "#3b82f6",
                intermediate: "#a855f7",
                advanced: "#f97316",
                specialization: "#10b981",
              };
              return colors[category] || "#6b7280";
            }}
            className="bg-white/90 backdrop-blur-lg border border-purple-200 rounded-lg shadow-lg"
            maskColor="rgb(240, 240, 255, 0.6)"
          />
        </ReactFlow>

        {/* Selected Node Detail Panel */}
        {selectedNode && (
          <div className="absolute bottom-6 right-6 bg-white rounded-2xl shadow-2xl border-2 border-purple-200 p-6 max-w-md w-full sm:w-96 z-10 animate-in slide-in-from-bottom-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  {selectedNode.category}
                </span>
                <h3 className="text-xl font-bold text-gray-800 mt-1">
                  {selectedNode.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {selectedNode.description}
            </p>

            {selectedNode.duration && (
              <div className="flex items-center gap-2 text-sm text-purple-600 mb-4">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{selectedNode.duration}</span>
              </div>
            )}

            {selectedNode.learnMoreUrl && (
              <a
                href={selectedNode.learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                <span>Learn More</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}

        {/* Floating Help Card */}
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg border border-purple-200 p-4 max-w-xs hidden lg:block">
          <div className="flex items-center gap-2 mb-2">
            <Maximize2 className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-gray-800">
              Interactive Roadmap
            </span>
          </div>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Click on any node to see details</li>
            <li>• Zoom and pan to explore</li>
            <li>• Click "Learn More" to visit resources</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
