import { useState, useCallback } from "react";
import {
  Upload, FileText, X, Loader2, CheckCircle2, AlertTriangle,
  Briefcase, ClipboardPaste, ArrowRight, Zap, TrendingUp,
  Hash, Lightbulb, RotateCcw, Building2, UserCheck,
  ChevronRight, BarChart3, Target, FileSearch
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { config } from "@/config/env";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalyzeJobMatchMutation } from "@/features/jobMatch/jobMatchApi";
import { toast } from "@/lib/toast";

/* ─── Circular Ring Score ─── */
const RingScore = ({ score, size = 200 }) => {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor"
          strokeWidth={stroke} className="text-muted/20" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black" style={{ color }}>{score}</span>
        <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Match %</span>
      </div>
    </div>
  );
};

/* ─── Horizontal Comparison Bar ─── */
const ComparisonBar = ({ name, score, note }) => {
  const color = score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500";
  const textColor = score >= 75 ? "text-emerald-500" : score >= 50 ? "text-amber-500" : "text-rose-500";
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-foreground">{name}</span>
        <span className={`text-sm font-bold ${textColor}`}>{score}%</span>
      </div>
      <div className="relative h-3 bg-muted/40 rounded-full overflow-hidden">
        <div className={`absolute inset-y-0 left-0 ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }} />
        {/* Reference line at 70% */}
        <div className="absolute inset-y-0 left-[70%] w-px bg-foreground/20" />
      </div>
      <p className="text-xs text-muted-foreground mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">{note}</p>
    </div>
  );
};

/* ─── Experience Badge ─── */
const ExperienceBadge = ({ match }) => {
  const cfg = {
    overqualified: { label: "Overqualified", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: TrendingUp },
    strong_match: { label: "Strong Match", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: CheckCircle2 },
    partial_match: { label: "Partial Match", color: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: AlertTriangle },
    underqualified: { label: "Needs Growth", color: "bg-rose-500/10 text-rose-600 border-rose-500/20", icon: Target },
  };
  const c = cfg[match] || cfg.partial_match;
  const Icon = c.icon;
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${c.color}`}>
      <Icon className="w-4 h-4" />{c.label}
    </div>
  );
};

export default function JobMatchPage() {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState(null);

  const [analyzeJobMatch, { isLoading: isAnalyzing }] = useAnalyzeJobMatchMutation();

  const handleFileSelect = useCallback((f) => {
    if (!f) return;
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (!allowed.includes(f.type)) { toast.error("Upload a PDF, DOCX, or TXT file"); return; }
    setFile(f);
    setExtractedSkills([]);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
  }, [handleFileSelect]);

  const handleExtract = async () => {
    if (!file) return;
    setExtracting(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch(`${config.resumeApiUrl}/extract-skills`, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Extraction failed");
      const data = await res.json();
      setExtractedSkills(data.skills || []);
      toast.success(`${data.skills?.length || 0} skills extracted!`);
    } catch (err) {
      toast.error("Failed to extract skills");
    } finally { setExtracting(false); }
  };

  const handleAnalyze = async () => {
    if (!extractedSkills.length || !jobDescription.trim() || !userId) {
      toast.error("Please upload resume, extract skills, and paste a job description");
      return;
    }
    try {
      const res = await analyzeJobMatch({
        resumeSkills: extractedSkills,
        jobDescription: jobDescription.trim(),
        userId,
      }).unwrap();
      if (res.success && res.data?.analysisContent) {
        setResult(JSON.parse(res.data.analysisContent));
        toast.success("Match analysis complete!");
      } else { toast.error("Analysis failed"); }
    } catch (err) {
      toast.error(err.data?.message || "Failed to analyze match");
    }
  };

  const handleReset = () => {
    setFile(null); setJobDescription(""); setExtractedSkills([]); setResult(null);
  };

  /* ═══════════ RESULTS VIEW ═══════════ */
  if (result) {
    return (
      <div className="space-y-6 pb-10">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-indigo-500/10 rounded-lg"><Briefcase className="w-5 h-5 text-indigo-500" /></div>
              <h1 className="text-2xl font-bold text-foreground">{result.jobTitle || "Job Match"}</h1>
            </div>
            <p className="text-muted-foreground text-sm flex items-center gap-2 ml-12">
              <Building2 className="w-3.5 h-3.5" />{result.company || "Company"}
            </p>
          </div>
          <Button onClick={handleReset} variant="outline" className="border-border cursor-pointer">
            <RotateCcw className="w-4 h-4 mr-2" />New Match
          </Button>
        </div>

        {/* Score + Verdict Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ring Score */}
          <div className="lg:col-span-4 bg-card rounded-2xl p-8 border border-border flex flex-col items-center justify-center text-center">
            <RingScore score={result.matchScore} />
            <ExperienceBadge match={result.experienceMatch} />
          </div>
          {/* Verdict */}
          <div className="lg:col-span-8 bg-card rounded-2xl p-8 border border-border flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-indigo-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Match Verdict</h3>
            </div>
            <p className="text-foreground/80 leading-relaxed text-base">{result.verdict}</p>
          </div>
        </div>

        {/* Dimensions — Horizontal Bars */}
        <div className="bg-card rounded-2xl p-6 md:p-8 border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Compatibility Breakdown</h3>
          </div>
          <div className="space-y-6">
            {result.dimensions?.map((d, i) => (
              <ComparisonBar key={i} name={d.name} score={d.score} note={d.note} />
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />75%+ Strong</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" />50-74% Moderate</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" />&lt;50% Weak</span>
            <span className="flex items-center gap-1.5 ml-auto"><span className="w-px h-4 bg-foreground/20" />70% Threshold</span>
          </div>
        </div>

        {/* Keywords — Side-by-Side Cloud */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Matched */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base font-bold text-foreground">Matched Keywords</h3>
              <span className="ml-auto bg-emerald-500/10 text-emerald-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {result.matchedKeywords?.length || 0}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.matchedKeywords?.map((kw, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  ✓ {kw}
                </span>
              ))}
              {(!result.matchedKeywords || result.matchedKeywords.length === 0) && (
                <p className="text-sm text-muted-foreground">No keyword matches found</p>
              )}
            </div>
          </div>
          {/* Missing */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="w-5 h-5 text-rose-500" />
              <h3 className="text-base font-bold text-foreground">Missing Keywords</h3>
              <span className="ml-auto bg-rose-500/10 text-rose-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {result.missingKeywords?.length || 0}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords?.map((kw, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  ✕ {kw}
                </span>
              ))}
              {(!result.missingKeywords || result.missingKeywords.length === 0) && (
                <p className="text-sm text-muted-foreground">No missing keywords — great coverage!</p>
              )}
            </div>
          </div>
        </div>

        {/* Tailoring Tips — Vertical Timeline */}
        {result.tailoringTips?.length > 0 && (
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-indigo-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Tailoring Tips</h3>
            </div>
            <div className="relative ml-4">
              {/* Vertical line */}
              <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />
              <div className="space-y-5">
                {result.tailoringTips.map((t, i) => {
                  const impactCfg = {
                    high: { dot: "bg-emerald-500", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
                    medium: { dot: "bg-amber-500", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
                    low: { dot: "bg-blue-500", badge: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
                  };
                  const ic = impactCfg[t.impact] || impactCfg.medium;
                  return (
                    <div key={i} className="relative flex items-start gap-4 pl-6">
                      <div className={`absolute left-[6px] top-1.5 w-3 h-3 rounded-full ${ic.dot} ring-4 ring-background z-10`} />
                      <div className="flex-1 bg-muted/30 rounded-xl p-4 border border-border hover:border-indigo-500/30 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm text-foreground leading-relaxed flex-1">{t.tip}</p>
                          <span className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${ic.badge}`}>
                            {t.impact}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ═══════════ INPUT VIEW ═══════════ */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-purple-600 dark:from-primary/20 dark:to-purple-600/20 dark:border dark:border-primary/20 rounded-2xl p-6 md:p-8 text-white dark:text-foreground">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Job-Resume Match</h1>
        <p className="text-white/90 dark:text-muted-foreground text-sm md:text-base">
          Paste any job description and compare it against your resume to get a detailed match analysis with tailoring suggestions
        </p>
      </div>

      {/* Two-column: Resume Left, JD Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Resume Upload */}
        <div className="bg-card rounded-2xl p-6 border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Upload Resume</h3>
              <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT</p>
            </div>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("jm-resume-upload").click()}
            className={`flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[180px]
              ${dragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-muted/30"}`}
          >
            <input id="jm-resume-upload" type="file" accept=".pdf,.docx,.txt" className="hidden"
              onChange={(e) => { handleFileSelect(e.target.files[0]); e.target.value = null; }} />
            {file ? (
              <div className="space-y-3 w-full max-w-xs">
                <div className="relative inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto">
                  <FileText className="w-8 h-8 text-primary" />
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); setExtractedSkills([]); }}
                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:scale-110 transition-transform shadow-lg cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-sm font-bold text-foreground truncate">{file.name}</p>
                {extractedSkills.length > 0 ? (
                  <div className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />{extractedSkills.length} skills extracted
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">Ready to extract</div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">Drop or <span className="text-primary font-medium">browse</span></p>
              </div>
            )}
          </div>

          {file && extractedSkills.length === 0 && (
            <Button onClick={handleExtract} disabled={extracting}
              className="w-full mt-4 h-11 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold cursor-pointer">
              {extracting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Extracting...</> : <><FileSearch className="w-4 h-4 mr-2" />Extract Skills</>}
            </Button>
          )}

          {extractedSkills.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-foreground mb-2">Extracted ({extractedSkills.length})</p>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                {extractedSkills.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-primary/10 text-primary dark:text-primary/90 text-xs font-medium border border-primary/20">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Job Description */}
        <div className="bg-card rounded-2xl p-6 border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ClipboardPaste className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Paste Job Description</h3>
              <p className="text-xs text-muted-foreground">Copy from LinkedIn, Naukri, Indeed, etc.</p>
            </div>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder={"Paste the full job description here...\n\nExample:\nWe are looking for a Full Stack Developer with 2+ years of experience in React, Node.js, MongoDB..."}
            className="flex-1 min-h-[220px] w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary resize-none"
          />

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground">
              {jobDescription.length > 0 ? `${jobDescription.split(/\s+/).filter(Boolean).length} words` : "No content yet"}
            </span>
            {jobDescription.length > 0 && (
              <button onClick={() => setJobDescription("")} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">Clear</button>
            )}
          </div>

          <Button onClick={handleAnalyze}
            disabled={isAnalyzing || !extractedSkills.length || !jobDescription.trim()}
            className="w-full mt-4 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50">
            {isAnalyzing ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Analyzing Match...</> : <><Zap className="w-5 h-5 mr-2" />Analyze Match</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
