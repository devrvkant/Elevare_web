import { useState, useCallback } from "react";
import {
  Upload, FileText, X, Sparkles, Loader2, Award,
  CheckCircle2, AlertTriangle, XCircle, FileCheck, ArrowRight, Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { config } from "@/config/env";
import { toast } from "@/lib/toast";
import DonutChart from "@/components/dashboard/GapAnalysis/DonutChart";
import ProgressBar from "@/components/dashboard/GapAnalysis/ProgressBar";
import RadarChart from "@/components/dashboard/GapAnalysis/RadarChart";

export default function AtsScorePage() {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileSelect = useCallback((selectedFile) => {
    if (!selectedFile) return;
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (!allowed.includes(selectedFile.type)) {
      toast.error("Please upload a PDF, DOCX, or TXT file");
      return;
    }
    setFile(selectedFile);
    setAnalysisResult(null); // Reset on new file select
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  }, [handleFileSelect]);

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please upload a resume first");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch(`${config.resumeApiUrl}/score-resume`, {
        method: "POST", 
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error("Failed to score resume");
      }
      
      const data = await res.json();
      setAnalysisResult(data);
      toast.success("Resume scored successfully!");
    } catch (err) {
      console.error("Resume scoring error:", err);
      toast.error(err.message || "Failed to score resume");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysisResult(null);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
  };

  const categoryMap = {
    grammar: "Grammar & Language",
    formatting: "Layout & Formatting",
    industry_standards: "Industry Standards",
    genuine_skills: "Skills Authenticity",
    company_standards: "Professionalism",
    ats_readability: "ATS Readability"
  };

  // Convert category scores for RadarChart and ProgressBar
  const radarData = analysisResult?.category_scores ? 
    Object.entries(analysisResult.category_scores).map(([key, value]) => ({
      label: categoryMap[key] || key,
      current: value,
      required: 100
    })) : [];

  // ───── RESULTS VIEW ─────
  if (analysisResult) {
    return (
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">ATS Resume Score</h1>
            <p className="text-muted-foreground text-sm mt-1">
              File: <span className="font-semibold text-primary">{analysisResult.filename}</span>
            </p>
          </div>
          <Button onClick={handleReset} variant="outline" className="border-border text-foreground hover:bg-accent cursor-pointer">
            Score Another Resume
          </Button>
        </div>

        {/* Top Row — Score + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Score */}
          <div className="bg-card rounded-2xl p-6 border border-border flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">Overall Resume Score</h3>
            <DonutChart value={analysisResult.overall_score} size={180} label="Score" color="auto" />
            <p className="text-sm text-muted-foreground mt-4 max-w-[240px] leading-relaxed">
              {analysisResult.overall_score >= 80 ? "Excellent! Your resume is highly competitive." : 
               analysisResult.overall_score >= 60 ? "Good start, but room for improvement." : 
               "Needs significant updates to pass ATS screening."}
            </p>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card rounded-2xl p-6 border border-border h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">AI Evaluation Summary</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{analysisResult.summary}</p>
            </div>
          </div>
        </div>

        {/* Radar + Category Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          {radarData.length >= 3 && (
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">Score Breakdown Radar</h3>
              <div className="flex items-center justify-center">
                <RadarChart categories={radarData} size={300} />
              </div>
            </div>
          )}

          {/* Category Progress */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-bold text-foreground mb-5">Category Scores</h3>
            <div className="space-y-5">
              {radarData.map((cat, i) => (
                <ProgressBar key={i} label={cat.label} value={cat.current} details="" />
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Breakdown (Strengths, Weaknesses, Suggestions) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Strengths */}
          <div className="bg-card rounded-2xl p-6 border border-border h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-bold text-foreground">Strengths</h3>
            </div>
            <ul className="space-y-3 flex-1">
              {analysisResult.strengths?.map((str, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>{str}</span>
                </li>
              ))}
              {(!analysisResult.strengths || analysisResult.strengths.length === 0) && (
                <p className="text-sm text-muted-foreground">No prominent strengths identified.</p>
              )}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-card rounded-2xl p-6 border border-border h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold text-foreground">Areas to Improve</h3>
            </div>
            <ul className="space-y-3 flex-1">
              {analysisResult.weaknesses?.map((weak, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>{weak}</span>
                </li>
              ))}
              {(!analysisResult.weaknesses || analysisResult.weaknesses.length === 0) && (
                <p className="text-sm text-muted-foreground">No major weaknesses identified.</p>
              )}
            </ul>
          </div>

          {/* Suggestions */}
          <div className="bg-card rounded-2xl p-6 border border-border h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-foreground">Actionable Tips</h3>
            </div>
            <ul className="space-y-3 flex-1">
              {analysisResult.suggestions?.map((sug, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>{sug}</span>
                </li>
              ))}
              {(!analysisResult.suggestions || analysisResult.suggestions.length === 0) && (
                <p className="text-sm text-muted-foreground">No further suggestions.</p>
              )}
            </ul>
          </div>
        </div>
        
        {/* Extracted Skills Reference */}
        {analysisResult.skills && analysisResult.skills.length > 0 && (
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-bold text-foreground mb-4">Detected Skills ({analysisResult.skill_count})</h3>
            <div className="flex flex-wrap gap-2">
              {analysisResult.skills.map((skill, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ───── INPUT VIEW ─────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-600/20 dark:to-indigo-600/20 dark:border dark:border-violet-500/20 rounded-2xl p-6 md:p-8 text-white dark:text-foreground">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Resume ATS Score</h1>
        <p className="text-white/90 dark:text-muted-foreground text-sm md:text-base max-w-2xl">
          Instantly evaluate your resume against ATS (Applicant Tracking System) standards, get a readiness score, and receive actionable suggestions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Upload Resume</h3>
              <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT formats supported</p>
            </div>
          </div>

          {/* Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`flex-1 relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer min-h-[240px]
              ${dragOver ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50 hover:bg-muted/30"}`}
            onClick={() => document.getElementById("ats-resume-upload").click()}
          >
            <input id="ats-resume-upload" type="file" accept=".pdf,.docx,.txt" className="hidden"
              onChange={(e) => handleFileSelect(e.target.files[0])} />
            {file ? (
              <div className="space-y-3">
                <div className="relative inline-block">
                  <FileText className="w-12 h-12 text-primary mx-auto" />
                  <button onClick={removeFile} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:scale-110 transition-transform">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-sm font-semibold text-foreground break-all px-4">{file.name}</p>
                <p className="text-xs text-emerald-500 font-medium">Ready for analysis</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-sm text-foreground font-medium">Drag & drop your resume here</p>
                  <p className="text-xs text-muted-foreground mt-1">or <span className="text-primary font-medium">browse files</span></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Section */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-center items-center text-center space-y-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Award className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Get Your ATS Score</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              Our AI engine will analyze your resume's grammar, formatting, and relevance to provide an in-depth score report.
            </p>
          </div>
          
          <Button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !file}
            className="w-full max-w-xs h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 mt-4">
            {isAnalyzing ? (
              <><Loader2 className="w-5 h-5 animate-spin mr-2" />Scoring Resume...</>
            ) : (
              <><Sparkles className="w-5 h-5 mr-2" />Calculate Score</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
