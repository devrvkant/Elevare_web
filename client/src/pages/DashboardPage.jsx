import { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  ArrowRight,
  Brain,
  Map,
  Clock,
  Bookmark,
  Lightbulb,
  Target,
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <Sparkles className="w-5 h-5" />
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
      </div>

      {/* Bottom Section - Recent Activity & Quick Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Recent Activity
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted hover:bg-primary/10 transition-colors">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Ready to start?
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Begin your career journey by creating your first prediction
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Map className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Roadmaps Awaiting
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Generate personalized learning paths after your prediction
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Track Your Progress
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Monitor your career development journey in real-time
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Quick Tips</h3>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <Bookmark className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  Be Specific
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Provide detailed information about your skills and interests
                  for better predictions
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Bookmark className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  Multiple Skills
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  List all relevant skills to get comprehensive career
                  recommendations
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Bookmark className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  Explore Roadmaps
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Follow your personalized roadmap step-by-step for best results
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Career Prediction Modal */}
      <CareerPredictionModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default Dashboard;
