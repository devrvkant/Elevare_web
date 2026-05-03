import { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  ArrowRight,
  Brain,
  Map,
  GitCompareArrows,
  FileText,
  Briefcase,
  Activity,
  FileCheck,
} from "lucide-react";
import CareerPredictionModal from "../components/dashboard/Career/CareerPredictionModal";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-purple-600 dark:from-primary/20 dark:to-purple-600/20 dark:border dark:border-primary/20 rounded-2xl p-6 md:p-8 text-white dark:text-foreground">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome to Your Workspace
        </h1>
        <p className="text-white/90 dark:text-muted-foreground text-sm md:text-base">
          Start your career journey with AI-powered predictions and personalized
          roadmaps
        </p>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Career Prediction Card */}
        <div
          onClick={() => setModalOpen(true)}
          className="group bg-card rounded-2xl p-8 border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Brain className="w-8 h-8 text-primary" strokeWidth={2.5} />
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Career Prediction
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Get AI-powered career recommendations based on your skills,
            education, and interests
          </p>
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Activity className="w-5 h-5" />
            <span>Start Prediction</span>
          </div>
        </div>

        {/* Roadmap Generation Card */}
        <div
          onClick={() => navigate("/dashboard/roadmaps")}
          className="group bg-card rounded-2xl p-8 border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Map className="w-8 h-8 text-primary" strokeWidth={2.5} />
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">My Roadmaps</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            View and manage your personalized career learning roadmaps and track
            your progress
          </p>
          <div className="flex items-center gap-2 text-primary font-semibold">
            <TrendingUp className="w-5 h-5" />
            <span>View Roadmaps</span>
          </div>
        </div>
        {/* Gap Analysis Card */}
        <div
          onClick={() => navigate("/dashboard/gap-analysis")}
          className="group bg-card rounded-2xl p-8 border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <GitCompareArrows className="w-8 h-8 text-primary" strokeWidth={2.5} />
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Gap Analysis</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Upload your resume and discover skill gaps for your target career with AI insights
          </p>
          <div className="flex items-center gap-2 text-primary font-semibold">
            <GitCompareArrows className="w-5 h-5" />
            <span>Analyze Skills</span>
          </div>
        </div>

        {/* ATS Score Card */}
        <div
          onClick={() => navigate("/dashboard/ats-score")}
          className="group bg-card rounded-2xl p-8 border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-primary" strokeWidth={2.5} />
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">ATS Score</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Evaluate your resume against Applicant Tracking Systems to optimize your chances
          </p>
          <div className="flex items-center gap-2 text-primary font-semibold">
            <FileCheck className="w-5 h-5" />
            <span>Check ATS Score</span>
          </div>
        </div>

        {/* Job Match Card */}
        <div
          onClick={() => navigate("/dashboard/job-match")}
          className="group bg-card rounded-2xl p-8 border-2 border-border hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Briefcase className="w-8 h-8 text-primary" strokeWidth={2.5} />
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Job Match</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Paste a job description and compare it with your resume to get a match percentage
          </p>
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Briefcase className="w-5 h-5" />
            <span>Match Resume</span>
          </div>
        </div>
      </div>



      {/* Career Prediction Modal */}
      <CareerPredictionModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default Dashboard;
