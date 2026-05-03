import { useState, useCallback } from "react";
import {
  Upload, FileText, X, Loader2, Award,
  CheckCircle2, AlertTriangle, XCircle, FileCheck, ArrowRight, Brain,
  BookOpen, Layout, Briefcase, ShieldCheck, Building, ScanSearch,
  Target, Zap, Activity, Lightbulb, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { config } from "@/config/env";
import { toast } from "@/lib/toast";

const GaugeMeter = ({ score }) => {
  const radius = 60;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const colorClass = score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500";
  
  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-muted/20 rounded-full shadow-inner border border-border/50">
      <svg className="w-56 h-28" viewBox="0 0 140 70">
        {/* Background track */}
        <path
          d="M 10 70 A 60 60 0 0 1 130 70"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          className="text-muted/30"
        />
        {/* Value track */}
        <path
          d="M 10 70 A 60 60 0 0 1 130 70"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-1000 ease-out ${colorClass}`}
        />
      </svg>
      <div className="absolute top-16 flex flex-col items-center">
         <span className={`text-5xl font-black ${colorClass}`}>{score}</span>
         <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">/ 100</span>
      </div>
    </div>
  );
};

const CategoryCard = ({ label, score, icon: Icon }) => {
  const colorClass = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-rose-500";
  const bgClass = score >= 80 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                  score >= 60 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                  "bg-rose-500/10 text-rose-500 border-rose-500/20";
                  
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className={`p-2.5 rounded-lg ${bgClass} border transition-colors group-hover:bg-background`}>
             <Icon className="w-5 h-5" />
           </div>
           <span className="font-semibold text-foreground text-sm md:text-base">{label}</span>
        </div>
        <span className="font-bold text-foreground text-lg">{score}%</span>
      </div>
      <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
        <div 
           className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`} 
           style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

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
    setAnalysisResult(null);
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
    grammar: { label: "Grammar & Language", icon: BookOpen },
    formatting: { label: "Layout & Formatting", icon: Layout },
    industry_standards: { label: "Industry Standards", icon: Briefcase },
    genuine_skills: { label: "Skills Authenticity", icon: ShieldCheck },
    company_standards: { label: "Professionalism", icon: Building },
    ats_readability: { label: "ATS Readability", icon: ScanSearch }
  };

  if (analysisResult) {
    const isGoodScore = analysisResult.overall_score >= 75;
    
    return (
      <div className="space-y-8 pb-10">
        {/* Header Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-4 md:p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">ATS Score Results</h1>
              <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                <FileText className="w-4 h-4" /> {analysisResult.filename}
              </p>
            </div>
          </div>
          <Button onClick={handleReset} variant="outline" className="border-border text-foreground hover:bg-accent cursor-pointer">
            <Activity className="w-4 h-4 mr-2" /> Score Another
          </Button>
        </div>

        {/* Top Highlight Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Score Gauge */}
          <div className="lg:col-span-4 bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <h3 className="text-sm font-semibold text-muted-foreground mb-6 uppercase tracking-wider">ATS Match Score</h3>
            
            <GaugeMeter score={analysisResult.overall_score} />
            
            <div className={`mt-8 px-6 py-3 rounded-2xl inline-flex items-center gap-2 ${isGoodScore ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
              {isGoodScore ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              <span className="font-semibold">{isGoodScore ? 'Ready for Application' : 'Review Suggested'}</span>
            </div>
          </div>

          {/* Detailed Summary */}
          <div className="lg:col-span-8 bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">AI Evaluation Summary</h3>
                <p className="text-sm text-muted-foreground">Comprehensive system scan results</p>
              </div>
            </div>
            <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 text-foreground leading-relaxed text-base">
              {analysisResult.summary}
            </div>
          </div>
        </div>

        {/* Categories Grid - REPLACES RADAR CHART */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Performance by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisResult.category_scores && Object.entries(analysisResult.category_scores).map(([key, value]) => (
              <CategoryCard 
                key={key} 
                label={categoryMap[key]?.label || key.replace('_', ' ')} 
                score={value} 
                icon={categoryMap[key]?.icon || FileText} 
              />
            ))}
          </div>
        </div>

        {/* Detailed Feedback Lists - STYLED DIFFERENTLY FROM GAP ANALYSIS */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Detailed Insights
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths Container */}
            <div className="bg-emerald-500/5 rounded-3xl p-6 md:p-8 border border-emerald-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Core Strengths</h3>
              </div>
              <div className="space-y-4">
                {analysisResult.strengths?.map((str, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-background rounded-xl border border-emerald-500/10 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground leading-relaxed">{str}</p>
                  </div>
                ))}
                {(!analysisResult.strengths || analysisResult.strengths.length === 0) && (
                  <p className="text-muted-foreground p-4">No prominent strengths identified.</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Weaknesses Container */}
              <div className="bg-rose-500/5 rounded-3xl p-6 md:p-8 border border-rose-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-rose-500/20 rounded-lg text-rose-600">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Critical Issues</h3>
                </div>
                <div className="space-y-3">
                  {analysisResult.weaknesses?.map((weak, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></div>
                      <p className="text-sm text-foreground leading-relaxed">{weak}</p>
                    </div>
                  ))}
                  {(!analysisResult.weaknesses || analysisResult.weaknesses.length === 0) && (
                    <p className="text-muted-foreground">No major weaknesses identified.</p>
                  )}
                </div>
              </div>

              {/* Suggestions Container */}
              <div className="bg-amber-500/5 rounded-3xl p-6 md:p-8 border border-amber-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-500/20 rounded-lg text-amber-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Improvement Actions</h3>
                </div>
                <div className="space-y-3">
                  {analysisResult.suggestions?.map((sug, i) => (
                    <div key={i} className="flex gap-3 items-start bg-background p-3 rounded-lg border border-amber-500/10">
                      <ArrowRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{sug}</p>
                    </div>
                  ))}
                  {(!analysisResult.suggestions || analysisResult.suggestions.length === 0) && (
                    <p className="text-muted-foreground">No further suggestions.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Extracted Skills Map */}
        {analysisResult.skills && analysisResult.skills.length > 0 && (
          <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ScanSearch className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Detected Skills Keyword Match</h3>
              </div>
              <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-bold uppercase">
                {analysisResult.skill_count} Items Found
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {analysisResult.skills.map((skill, i) => (
                <span key={i} className="px-4 py-2 rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium border border-border cursor-default">
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
      <div className="bg-gradient-to-r from-primary to-purple-600 dark:from-primary/20 dark:to-purple-600/20 dark:border dark:border-primary/20 rounded-2xl p-6 md:p-8 text-white dark:text-foreground">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">ATS Resume Intelligence</h1>
        <p className="text-white/90 dark:text-muted-foreground text-sm md:text-base">
          Ensure your resume passes through Applicant Tracking Systems. We analyze formatting, grammar, and relevance to generate a comprehensive readability score.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-7 bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Upload Document</h3>
              <p className="text-sm text-muted-foreground">PDF, DOCX, or TXT format</p>
            </div>
          </div>

          {/* Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`flex-1 relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer min-h-[280px]
              ${dragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-muted/30"}`}
            onClick={() => document.getElementById("ats-resume-upload").click()}
          >
            <input id="ats-resume-upload" type="file" accept=".pdf,.docx,.txt" className="hidden"
              onChange={(e) => {
                handleFileSelect(e.target.files[0]);
                e.target.value = null;
              }} />
            {file ? (
              <div className="space-y-4 w-full max-w-sm">
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mx-auto">
                  <FileText className="w-10 h-10 text-primary" />
                  <button onClick={removeFile} className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1.5 hover:scale-110 transition-transform shadow-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-background border border-border rounded-xl p-3 shadow-sm">
                  <p className="text-sm font-bold text-foreground truncate px-2">{file.name}</p>
                </div>
                <div className="inline-flex items-center gap-2 text-sm text-emerald-500 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" /> Ready for analysis
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-base text-foreground font-semibold">Drag & drop your resume here</p>
                  <p className="text-sm text-muted-foreground mt-2">or <span className="text-primary font-bold hover:underline">browse files</span></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Section */}
        <div className="lg:col-span-5 bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
          
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <Award className="w-8 h-8 text-primary" />
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-4">Calculate ATS Compatibility</h3>
          <p className="text-base text-muted-foreground mb-8 leading-relaxed">
            Our specialized ATS parsing engine will read your resume exactly how an automated recruiter system does, providing an accurate match score.
          </p>
          
          <Button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !file}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 mt-auto">
            {isAnalyzing ? (
              <><Loader2 className="w-6 h-6 animate-spin mr-3" />Scanning Document...</>
            ) : (
              <><Zap className="w-6 h-6 mr-3" />Generate Score Report</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
