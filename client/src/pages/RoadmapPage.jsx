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
import { useGetRoadmapQuery } from "@/features/rodemap/roadmapApi";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Custom Node Component
const CustomNode = ({ data }) => {
  const categoryColors = {
    fundamentals: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-500",
    intermediate: "from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-500",
    advanced: "from-orange-500/10 to-red-500/10 border-orange-500/20 text-orange-500",
    specialization: "from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-500",
  };

  const style = categoryColors[data.category] || "from-muted/50 to-muted border-border text-muted-foreground";

  return (
    <div className="group">
      {/* Input Handle (top) - for incoming connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-primary border-2 border-background"
      />

      <div className="bg-card rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-border hover:border-primary/50 w-[280px] overflow-hidden">
        {/* Header with subtle gradient */}
        <div className={`bg-gradient-to-r ${style.split(" ").slice(0, 2).join(" ")} p-4 border-b ${style.split(" ").find(c => c.startsWith("border"))}`}>
          <div className="flex items-center gap-3 mb-2">
            {/* Step Number Circle */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-background/50 backdrop-blur-sm ${style.split(" ").find(c => c.startsWith("border"))}`}>
              <span className={`font-bold text-sm ${style.split(" ").pop()}`}>
                {data.stepNumber}
              </span>
            </div>
            <span className={`text-xs font-bold uppercase tracking-wide ${style.split(" ").pop()}`}>
              {data.category}
            </span>
          </div>
          <h3 className="text-foreground font-bold text-lg leading-tight">
            {data.title}
          </h3>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {data.description}
          </p>

          {data.duration && (
            <div className="flex items-center gap-2 text-xs text-primary">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-medium">{data.duration}</span>
            </div>
          )}

          {data.learnMoreUrl && (
            <a
              href={data.learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group-hover:underline"
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
        className="w-3 h-3 !bg-primary border-2 border-background"
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

      // Create nodes with positions - zigzag layout (alternating left/right)
      const nodeList = data.nodes.map((node, index) => {
        const isLeft = index % 2 === 0; // Even indices on left, odd on right

        return {
          id: node.id,
          type: "custom",
          position: {
            x: isLeft ? 100 : 600, // Left at 100px, Right at 600px (500px apart for more space)
            y: Math.floor(index / 2) * 350 + 50, // Move down every 2 nodes (increased to 350px)
          },
          data: {
            ...node,
            stepNumber: index + 1, // Add step number starting from 1
            label: node.title,
          },
        };
      });

      // Create edges connecting sequential nodes (each node connects only to next)
      const edgeList = [];
      for (let i = 0; i < nodeList.length - 1; i++) {
        edgeList.push({
          id: `e${i}-${i + 1}`,
          source: nodeList[i].id,
          target: nodeList[i + 1].id,
          type: "smoothstep", // Smoothstep for curved connections in zigzag
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
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">
            Loading your roadmap...
          </h2>
          <p className="text-muted-foreground">
            Please wait while we fetch your career path
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card rounded-3xl p-8 shadow-xl border border-destructive/20">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Generation Failed
            </h2>
            <p className="text-muted-foreground">
              {error ||
                "We encountered an error while generating your roadmap. This could be due to high demand or a temporary service issue."}
            </p>

            <div className="flex flex-col gap-3 mt-6">
              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={() => navigate("/dashboard/roadmaps")}
                variant="outline"
                className="w-full border-border text-foreground hover:bg-accent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                View My Roadmaps
              </Button>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-xl border border-border text-left">
              <p className="text-sm font-semibold text-foreground mb-2">
                💡 Tips:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
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
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card rounded-3xl p-8 shadow-xl border border-border text-center space-y-4">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <Target className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Roadmap Not Found
          </h2>
          <p className="text-muted-foreground">
            This roadmap doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate("/dashboard/roadmaps")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-card rounded-3xl p-8 shadow-xl border border-border text-center space-y-4">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <RefreshCw className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Upgrade Required</h2>
          <p className="text-muted-foreground leading-relaxed">
            This roadmap was created with an older format. To experience the new{" "}
            <strong>interactive node-based graph</strong> with clickable
            learning resources, please generate a new roadmap!
          </p>

          <div className="bg-muted rounded-xl p-4 border border-border">
            <p className="text-sm font-semibold text-foreground mb-2">
              ✨ New Features:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 text-left list-disc list-inside">
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
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate New Roadmap
            </Button>
            <Button
              onClick={() => navigate("/dashboard/roadmaps")}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-accent"
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
    <div className="h-full bg-background flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="bg-background/80 backdrop-blur-lg border-b border-border shadow-sm flex-shrink-0 z-50">
        <div className="relative flex items-center justify-between px-4 sm:px-6 py-3">
          <Button
            variant="ghost"
            onClick={() => navigate(getBackPath())}
            className="p-2 sm:px-4 sm:py-2 h-auto sm:h-10 border-0 sm:border sm:border-border text-foreground hover:bg-accent hover:border-primary/50 transition-all"
          >
            <ArrowLeft className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3 pointer-events-none">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="text-sm sm:text-base font-medium text-foreground truncate max-w-[150px] sm:max-w-none">
              {roadmapData?.title || roadmap.career || "Career Roadmap"}
            </span>
          </div>

          <div className="w-9 sm:w-[100px]" />
        </div>
      </div>

      {/* Description Banner */}
      {roadmapData?.description && (
        <div className="bg-muted/30 border-b border-border px-6 py-4 shadow-sm flex-shrink-0 backdrop-blur-sm">
          <p className="text-muted-foreground text-sm leading-relaxed text-center max-w-4xl mx-auto">
            {roadmapData.description}
          </p>
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
          onNodesChange={() => { }}
          onEdgesChange={() => { }}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
          className="bg-background w-full h-full"
          minZoom={0.1}
          maxZoom={1.5}
        >
          <Background color="#9333ea" gap={16} size={1} variant="dots" className="opacity-20" />
          <Controls className="!bg-card/90 backdrop-blur-lg border !border-border !rounded-none shadow-lg [&>button]:!bg-card [&>button]:!text-primary [&>button]:!border-border [&>button:hover]:!bg-accent [&>button_svg]:!fill-current [&>button]:!rounded-none" />

        </ReactFlow>

        {/* Selected Node Detail Panel */}
        {selectedNode && (
          <div className="fixed inset-x-4 bottom-4 sm:absolute sm:bottom-6 sm:right-6 sm:inset-auto bg-card rounded-2xl shadow-2xl border-2 border-border p-6 sm:max-w-md w-auto sm:w-96 z-50 animate-in slide-in-from-bottom-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  {selectedNode.category}
                </span>
                <h3 className="text-xl font-bold text-foreground mt-1">
                  {selectedNode.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {selectedNode.description}
            </p>

            {selectedNode.duration && (
              <div className="flex items-center gap-2 text-sm text-primary mb-4">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{selectedNode.duration}</span>
              </div>
            )}

            {selectedNode.learnMoreUrl && (
              <a
                href={selectedNode.learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                <span>Learn More</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}

        {/* Floating Help Card */}
        <div className="absolute top-6 left-6 bg-card/90 backdrop-blur-lg rounded-xl shadow-lg border border-border p-4 max-w-xs hidden lg:block">
          <div className="flex items-center gap-2 mb-2">
            <Maximize2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Interactive Roadmap
            </span>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Click on any node to see details</li>
            <li>• Zoom and pan to explore</li>
            <li>• Click "Learn More" to visit resources</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
