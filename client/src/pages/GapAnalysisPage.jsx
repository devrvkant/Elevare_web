import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import {
  Upload, FileText, X, Loader2, Brain, Target,
  TrendingUp, BookOpen, ArrowRight, CheckCircle2, AlertTriangle,
  XCircle, Lightbulb, ExternalLink, Clock, ChevronDown, ChevronUp,
  FileSearch, Activity, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { config } from "@/config/env";
import { useAuth } from "@/contexts/AuthContext";
import { useGenerateGapAnalysisMutation, useGetGapAnalysisQuery } from "@/features/gapAnalysis/gapAnalysisApi";
import { useGetUserRoadmapsQuery } from "@/features/rodemap/roadmapApi";
import {
  setExtractedSkills, setExtractionStatus, setExtractionError, resetExtraction,
} from "@/features/gapAnalysis/gapAnalysisSlice";
import { toast } from "@/lib/toast";
import DonutChart from "@/components/dashboard/GapAnalysis/DonutChart";
import RadarChart from "@/components/dashboard/GapAnalysis/RadarChart";
import ProgressBar from "@/components/dashboard/GapAnalysis/ProgressBar";

export default function GapAnalysisPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;
  const dispatch = useDispatch();
  const { extractedSkills, extractionStatus } = useSelector((s) => s.gapAnalysis);

  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [targetCareer, setTargetCareer] = useState("");
  const [selectedRoadmapId, setSelectedRoadmapId] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAllResources, setShowAllResources] = useState(false);
  
  // Fix: useGetUserRoadmapsQuery transformResponse returns the array directly
  const { data: roadmaps = [], isLoading: loadingRoadmaps } = useGetUserRoadmapsQuery(userId, { skip: !userId });
  
  const [generateGapAnalysis, { isLoading: isAnalyzing }] = useGenerateGapAnalysisMutation();
  const { data: fetchedAnalysis, isLoading: loadingFetchedAnalysis } = useGetGapAnalysisQuery(id, { skip: !id });

  // When viewing a past gap analysis
  useEffect(() => {
    if (id && fetchedAnalysis && fetchedAnalysis.analysisContent) {
      try {
        setAnalysisResult(JSON.parse(fetchedAnalysis.analysisContent));
        if (fetchedAnalysis.targetCareer) {
           setTargetCareer(fetchedAnalysis.targetCareer);
        }
      } catch (e) {
        console.error("Failed to parse analysis result:", e);
      }
    } else if (!id) {
       // Reset if we go to the main page
       setAnalysisResult(null);
    }
  }, [id, fetchedAnalysis]);

  // Clear extracted skills from redux state when navigating away
  useEffect(() => {
    return () => {
      dispatch(resetExtraction());
    };
  }, [dispatch]);

  // Select resume file without extracting automatically
  const handleFileSelect = useCallback((selectedFile) => {
    if (!selectedFile) return;
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (!allowed.includes(selectedFile.type)) {
      toast.error("Please upload a PDF, DOCX, or TXT file");
      return;
    }
    setFile(selectedFile);
    dispatch(resetExtraction());
  }, [dispatch]);

  const handleExtractSkills = async () => {
    if (!file) return;
    dispatch(setExtractionStatus("loading"));
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${config.resumeApiUrl}/extract-skills`, {
        method: "POST", body: formData,
      });
      if (!res.ok) throw new Error("Failed to extract skills");
      const data = await res.json();
      dispatch(setExtractedSkills(data.skills || []));
    } catch (err) {
      console.error("Skill extraction error:", err);
      dispatch(setExtractionError(err.message));
      toast.error("Failed to extract skills from resume");
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  }, [handleFileSelect]);

  const handleAnalyze = async () => {
    if (!extractedSkills.length || !targetCareer.trim() || !userId) {
      toast.error("Please upload a resume and enter a target career");
      return;
    }
    try {
      const result = await generateGapAnalysis({
        currentSkills: extractedSkills, targetCareer: targetCareer.trim(), userId, roadmapId: selectedRoadmapId
      }).unwrap();
      if (result.success && result.data?._id) {
        toast.success("Analysis generated successfully!");
        navigate(`/dashboard/gap-analysis/${result.data._id}`);
      } else {
        toast.error("Failed to generate analysis");
      }
    } catch (err) {
      console.error("Gap analysis error:", err);
      toast.error(err.data?.message || "Failed to generate gap analysis");
    }
  };

  const handleReset = () => {
    setFile(null);
    setTargetCareer("");
    setSelectedRoadmapId("");
    setAnalysisResult(null);
    setShowAllResources(false);
    dispatch(resetExtraction());
    navigate('/dashboard/gap-analysis');
  };

  const removeSkill = (idx) => {
    const updated = extractedSkills.filter((_, i) => i !== idx);
    dispatch(setExtractedSkills(updated));
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    dispatch(resetExtraction());
  };

  // Radar chart data from category scores
  const radarData = analysisResult?.categoryScores?.map((c) => ({
    label: c.category, current: c.score, required: c.maxScore,
  })) || [];

  const priorityConfig = {
    high: { color: "bg-red-500/10 text-red-500 border-red-500/20", icon: "🔴" },
    medium: { color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: "🟡" },
    low: { color: "bg-green-500/10 text-green-500 border-green-500/20", icon: "🟢" },
  };

  const importanceConfig = {
    critical: { color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" },
    important: { color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
    "nice-to-have": { color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  };

  // ───── RESULTS VIEW ─────
  if (id && loadingFetchedAnalysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <h2 className="text-xl font-semibold text-foreground">Loading Analysis...</h2>
        <p className="text-muted-foreground text-sm">Fetching your career gap analysis details</p>
      </div>
    );
  }

  if (analysisResult) {
    const resources = analysisResult.learningResources || [];
    const visibleResources = showAllResources ? resources : resources.slice(0, 6);

    return (
      <div className="space-y-6 pb-8">
        {/* Top Bar / Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-4 md:p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-4">
             <Button onClick={handleReset} variant="outline" className="p-2 sm:px-4 sm:py-2 h-auto sm:h-10 border-border text-foreground hover:bg-accent transition-all cursor-pointer">
                <ArrowLeft className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
             </Button>
             <div>
               <h1 className="text-xl md:text-2xl font-bold text-foreground">Gap Analysis Report</h1>
               <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                 <Target className="w-4 h-4" /> Target: <span className="font-semibold text-primary capitalize">{targetCareer}</span>
               </p>
             </div>
          </div>
        </div>

        {/* Top Row — Score + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Readiness Score */}
          <div className="bg-card rounded-2xl p-6 border border-border flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">Career Readiness</h3>
            <DonutChart value={analysisResult.readinessScore} size={180} label="Score" color="auto" />
            <p className="text-sm text-muted-foreground mt-4 max-w-[240px] leading-relaxed">
              {analysisResult.readinessScore >= 75 ? "You're well-prepared!" : analysisResult.readinessScore >= 50 ? "Good foundation, some gaps to fill." : "Significant growth opportunities ahead."}
            </p>
          </div>

          {/* Summary + Career Insight */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">AI Summary</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{analysisResult.summary}</p>
            </div>
          </div>
        </div>

        {/* Radar + Category Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          {radarData.length >= 3 && (
            <div className="bg-card rounded-2xl p-6 border border-border h-full flex flex-col">
              <h3 className="text-lg font-bold text-foreground mb-4">Skills Radar</h3>
              <div className="flex-1 flex flex-col items-center justify-center">
                <RadarChart categories={radarData} size={380} />
              </div>
            </div>
          )}

          {/* Category Progress */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-bold text-foreground mb-5">Category Breakdown</h3>
            <div className="space-y-5">
              {analysisResult.categoryScores?.map((cat, i) => (
                <ProgressBar key={i} label={cat.category} value={cat.score} details={cat.details} />
              ))}
            </div>
          </div>
        </div>

        {/* Skill Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Matched */}
          <div className="bg-card rounded-2xl p-6 border border-border h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-bold text-foreground">Matched</h3>
              <span className="ml-auto bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full">
                {analysisResult.matchedSkills?.length || 0}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 flex-1 items-start content-start">
              {analysisResult.matchedSkills?.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  {skill.name}
                </span>
              ))}
              {(!analysisResult.matchedSkills || analysisResult.matchedSkills.length === 0) && (
                <p className="text-sm text-muted-foreground w-full py-2">No matched skills found</p>
              )}
            </div>
          </div>

          {/* Partial */}
          <div className="bg-card rounded-2xl p-6 border border-border h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-foreground">Partial</h3>
              <span className="ml-auto bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full">
                {analysisResult.partialSkills?.length || 0}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 flex-1 items-start content-start">
              {analysisResult.partialSkills?.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                  {skill.name}
                </span>
              ))}
              {(!analysisResult.partialSkills || analysisResult.partialSkills.length === 0) && (
                <p className="text-sm text-muted-foreground w-full py-2">No partial matches</p>
              )}
            </div>
          </div>

          {/* Missing */}
          <div className="bg-card rounded-2xl p-6 border border-border h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold text-foreground">Missing</h3>
              <span className="ml-auto bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">
                {analysisResult.missingSkills?.length || 0}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 flex-1 items-start content-start">
              {analysisResult.missingSkills?.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold">
                  {skill.name}
                </span>
              ))}
              {(!analysisResult.missingSkills || analysisResult.missingSkills.length === 0) && (
                <p className="text-sm text-muted-foreground w-full py-2">No missing skills!</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Plan Removed for speed */}

        {/* Learning Resources */}
        {resources.length > 0 && (
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Learning Resources</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {visibleResources.map((res, i) => (
                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                  className="group flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                  <ExternalLink className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{res.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{res.skillCovered} · {res.platform}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">{res.type}</span>
                  </div>
                </a>
              ))}
            </div>
            {resources.length > 6 && (
              <button onClick={() => setShowAllResources(!showAllResources)}
                className="mt-4 flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors mx-auto cursor-pointer">
                {showAllResources ? <><ChevronUp className="w-4 h-4" /> Show Less</> : <><ChevronDown className="w-4 h-4" /> Show All ({resources.length})</>}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // ───── INPUT VIEW ─────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-purple-600 dark:from-primary/20 dark:to-purple-600/20 dark:border dark:border-primary/20 rounded-2xl p-6 md:p-8 text-white dark:text-foreground">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Career Gap Analysis</h1>
        <p className="text-white/90 dark:text-muted-foreground text-sm md:text-base">
          Upload your resume and choose a target career to discover your skill gaps with AI-powered insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Upload Section */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Step 1: Upload Resume</h3>
              <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT supported</p>
            </div>
          </div>

          {/* Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
              ${dragOver ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50 hover:bg-muted/30"}`}
            onClick={() => document.getElementById("resume-upload").click()}
          >
            <input id="resume-upload" type="file" accept=".pdf,.docx,.txt" className="hidden"
              onChange={(e) => {
                handleFileSelect(e.target.files[0]);
                e.target.value = null;
              }} />
            {file && extractionStatus !== "loading" ? (
              <div className="space-y-4 w-full max-w-sm mx-auto">
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mx-auto">
                  <FileText className="w-10 h-10 text-primary" />
                  <button onClick={removeFile} className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1.5 hover:scale-110 transition-transform shadow-lg cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-background border border-border rounded-xl p-3 shadow-sm">
                  <p className="text-sm font-bold text-foreground truncate px-2">{file.name}</p>
                </div>
                {extractedSkills.length > 0 ? (
                  <div className="inline-flex items-center gap-2 text-sm text-emerald-500 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" /> Skills extracted
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground font-medium bg-muted px-3 py-1 rounded-full">
                    <FileText className="w-4 h-4" /> Ready to extract
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">Drag & drop or <span className="text-primary font-medium">browse</span></p>
              </div>
            )}
          </div>

          {/* Extract Button */}
          {file && extractedSkills.length === 0 && (
             <Button 
                onClick={handleExtractSkills} 
                disabled={extractionStatus === 'loading'}
                className="w-full mt-4 h-11 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
             >
                {extractionStatus === 'loading' ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" />Extracting Skills...</>
                ) : (
                  <><FileSearch className="w-4 h-4 mr-2" />Extract Skills from Resume</>
                )}
             </Button>
          )}

          {/* Extracted Skills */}
          {extractedSkills.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-foreground mb-3">
                Extracted Skills ({extractedSkills.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {extractedSkills.map((skill, i) => (
                  <span key={i} className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 hover:bg-primary/20 transition-colors">
                    {skill}
                    <button onClick={(e) => { e.stopPropagation(); removeSkill(i); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Target Career Section */}
        <div className="bg-card rounded-2xl p-6 border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Step 2: Target Career</h3>
              <p className="text-xs text-muted-foreground">What career do you want to pursue?</p>
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <Label htmlFor="target-career" className="text-sm font-semibold text-foreground">
              Select Career Roadmap <span className="text-pink-500">*</span>
            </Label>
            
            {loadingRoadmaps ? (
              <div className="h-12 border border-input rounded-md flex items-center justify-center bg-muted/20">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : roadmaps && roadmaps.length > 0 ? (
              <select
                id="target-career"
                className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedRoadmapId}
                onChange={(e) => {
                  setSelectedRoadmapId(e.target.value);
                  const selected = roadmaps.find(r => r._id === e.target.value);
                  if (selected) setTargetCareer(selected.career);
                  else setTargetCareer("");
                }}
              >
                <option value="">-- Select a previously generated roadmap --</option>
                {roadmaps.map(r => (
                  <option key={r._id} value={r._id}>{r.career}</option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-md text-sm">
                You haven't generated any career roadmaps yet. Please generate a roadmap first from the Roadmaps page.
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">Select one of your generated roadmaps to analyze your gaps against it</p>
          </div>

          {/* Analyze Button */}
          <Button onClick={handleAnalyze}
            disabled={isAnalyzing || !extractedSkills.length || !targetCareer.trim()}
            className="w-full mt-6 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50">
            {isAnalyzing ? (
              <><Loader2 className="w-5 h-5 animate-spin mr-2" />Analyzing Gaps...</>
            ) : (
              <><Activity className="w-5 h-5 mr-2" />Analyze Career Gap</>
            )}
          </Button>
        </div>
      </div>


    </div>
  );
}
