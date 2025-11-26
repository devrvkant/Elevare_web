import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { getUserInitials, getUserColor } from "../lib/userUtils";
import {
  Brain,
  Target,
  BarChart3,
  Briefcase,
  Rocket,
  TrendingUp,
  Sparkles,
  Linkedin,
} from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle";

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Get user initials and color for avatar
  const userInitials = getUserInitials(currentUser);
  const avatarColor = getUserColor(currentUser);

  const features = [
    {
      title: "AI-Powered Career Analysis",
      description:
        "Advanced machine learning algorithms analyze your skills, interests, and market trends to suggest the perfect career path.",
      icon: Brain,
      color: "from-violet-400 to-purple-400",
    },
    {
      title: "Personalized Learning Roadmap",
      description:
        "Get a custom learning path with resources, courses, and milestones tailored to your career goals.",
      icon: Target,
      color: "from-blue-400 to-indigo-400",
    },
    {
      title: "Skills Gap Analysis",
      description:
        "Identify exactly what skills you need to develop to reach your dream job and track your progress.",
      icon: BarChart3,
      color: "from-emerald-400 to-teal-400",
    },
    {
      title: "Industry Insights",
      description:
        "Stay updated with the latest industry trends, salary ranges, and job market demands.",
      icon: Briefcase,
      color: "from-amber-400 to-orange-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Elevare
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                About
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {!currentUser ? (
                <>
                  <button
                    onClick={() => navigate("/sign-in")}
                    className="text-muted-foreground hover:text-primary font-medium transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/sign-up")}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all font-medium shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all font-medium mr-3 cursor-pointer"
                  >
                    Dashboard
                  </button>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer ${avatarColor}`}
                    onClick={() => navigate("/dashboard/profile")}
                  >
                    {userInitials}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/30 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 leading-tight">
            Find Your{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Dream Career
            </span>
            <br />
            with AI
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Elevare uses cutting-edge AI to analyze your{" "}
            <span className="font-semibold text-primary">skills</span>,{" "}
            <span className="font-semibold text-purple-500">interests</span>,
            and <span className="font-semibold text-pink-500">aspirations</span>{" "}
            to guide you toward your perfect career path.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!currentUser ? (
              <>
                <button
                  onClick={() => navigate("/sign-up")}
                  className="px-8 py-4 text-lg font-semibold bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2 cursor-pointer"
                >
                  Start Your Journey <Rocket className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate("/sign-in")}
                  className="px-8 py-4 text-lg font-semibold border-2 border-border text-foreground rounded-full hover:border-primary hover:text-primary transition-all cursor-pointer"
                >
                  I have an account
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-4 text-lg font-semibold bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2 cursor-pointer"
              >
                Continue to Dashboard <TrendingUp className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-bold text-foreground mb-4">
              Why Choose Elevare?
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform offers everything you need to discover and
              pursue your ideal career path.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-background rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border hover:border-primary/50 hover:-translate-y-2"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                  ></div>
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-7 h-7 text-primary" />
                    </div>
                    <h4 className="text-xl font-bold text-foreground mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-24 bg-muted/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-foreground mb-4">
              How Elevare Works
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our three-step process makes career discovery simple and
              effective.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-6 shadow-lg shadow-primary/20">
                1
              </div>
              <h4 className="text-2xl font-bold text-foreground mb-4">
                Assess Your Profile
              </h4>
              <p className="text-muted-foreground text-lg">
                Complete our comprehensive assessment to understand your skills,
                interests, and career preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-6 shadow-lg shadow-primary/20">
                2
              </div>
              <h4 className="text-2xl font-bold text-foreground mb-4">
                Get AI Recommendations
              </h4>
              <p className="text-muted-foreground text-lg">
                Our AI analyzes your profile against thousands of career paths
                to find your perfect match.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-6 shadow-lg shadow-primary/20">
                3
              </div>
              <h4 className="text-2xl font-bold text-foreground mb-4">
                Follow Your Roadmap
              </h4>
              <p className="text-muted-foreground text-lg">
                Get a personalized learning roadmap with resources, courses, and
                milestones to achieve your goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-background border-t border-border">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-5"></div>
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 shadow-lg shadow-primary/20 mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Transform Your Career?
          </h3>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who have discovered their dream
            careers with Elevare's AI-powered guidance.
          </p>

          {!currentUser ? (
            <button
              onClick={() => navigate("/sign-up")}
              className="px-10 py-4 text-lg font-semibold bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2 mx-auto cursor-pointer"
            >
              Get Started for Free <Sparkles className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/dashboard")}
              className="px-10 py-4 text-lg font-semibold bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2 mx-auto cursor-pointer"
            >
              Continue Your Journey <Sparkles className="w-5 h-5" />
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="text-center md:text-left">
              <h4 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-3">
                Elevare
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Elevating careers through AI-powered insights and personalized
                guidance.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center">
              <h5 className="font-semibold text-foreground mb-4">Quick Links</h5>
              <div className="space-y-2">
                <a
                  href="#features"
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Features
                </a>
                <a
                  href="#about"
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  How It Works
                </a>
                {!currentUser && (
                  <button
                    onClick={() => navigate("/sign-up")}
                    className="block w-full text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>

            {/* Contact/Social */}
            <div className="text-center md:text-right">
              <h5 className="font-semibold text-foreground mb-4">Connect</h5>
              <p className="text-muted-foreground text-sm mb-3">
                Connect with the creators on LinkedIn
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://www.linkedin.com/in/ravikantjangir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-end gap-2 text-muted-foreground hover:text-primary transition-colors text-sm group"
                >
                  <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Ravikant Jangir</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/divyam-manchanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-end gap-2 text-muted-foreground hover:text-purple-600 transition-colors text-sm group"
                >
                  <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Divyam Manchanda</span>
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <p className="text-muted-foreground text-sm text-center md:text-left">
                © {new Date().getFullYear()} Elevare. All rights reserved.
              </p>

              {/* Made with love */}
              <p className="text-muted-foreground text-sm text-center flex items-center gap-2">
                Made with{" "}
                <span className="text-red-500 animate-pulse">❤️</span> by
                <span className="font-semibold text-primary">
                  Ravikant Jangir
                </span>{" "}
                &{" "}
                <span className="font-semibold text-purple-600">
                  Divyam Manchanda
                </span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
