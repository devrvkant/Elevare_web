import { useNavigate } from "react-router";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: "AI-Powered Career Analysis",
      description:
        "Advanced machine learning algorithms analyze your skills, interests, and market trends to suggest the perfect career path.",
      icon: "🧠",
      color: "from-purple-400 to-pink-400",
    },
    {
      title: "Personalized Learning Roadmap",
      description:
        "Get a custom learning path with resources, courses, and milestones tailored to your career goals.",
      icon: "🎯",
      color: "from-blue-400 to-indigo-400",
    },
    {
      title: "Skills Gap Analysis",
      description:
        "Identify exactly what skills you need to develop to reach your dream job and track your progress.",
      icon: "📊",
      color: "from-green-400 to-teal-400",
    },
    {
      title: "Industry Insights",
      description:
        "Stay updated with the latest industry trends, salary ranges, and job market demands.",
      icon: "💼",
      color: "from-yellow-400 to-orange-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Elevare
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              >
                About
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <SignedOut>
                <button
                  onClick={() => navigate("/sign-in")}
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/sign-up")}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl"
                >
                  Get Started
                </button>
              </SignedOut>
              <SignedIn>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all font-medium mr-3"
                >
                  Dashboard
                </button>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Find Your{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Dream Career
            </span>
            <br />
            with AI
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Elevare uses cutting-edge AI to analyze your{" "}
            <span className="font-semibold text-indigo-600">skills</span>,{" "}
            <span className="font-semibold text-purple-600">interests</span>,
            and <span className="font-semibold text-pink-600">aspirations</span>{" "}
            to guide you toward your perfect career path.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignedOut>
              <button
                onClick={() => navigate("/sign-up")}
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl"
              >
                Start Your Journey 🚀
              </button>
              <button
                onClick={() => navigate("/sign-in")}
                className="px-8 py-4 text-lg font-semibold border-2 border-gray-300 text-gray-700 rounded-full hover:border-indigo-600 hover:text-indigo-600 transition-all"
              >
                I have an account
              </button>
            </SignedOut>

            <SignedIn>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-2xl"
              >
                Continue to Dashboard 📊
              </button>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Elevare?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform offers everything you need to discover and
              pursue your ideal career path.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-transparent hover:-translate-y-2"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                ></div>
                <div className="relative">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              How Elevare Works
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our three-step process makes career discovery simple and
              effective.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                Assess Your Profile
              </h4>
              <p className="text-gray-600 text-lg">
                Complete our comprehensive assessment to understand your skills,
                interests, and career preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                Get AI Recommendations
              </h4>
              <p className="text-gray-600 text-lg">
                Our AI analyzes your profile against thousands of career paths
                to find your perfect match.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                Follow Your Roadmap
              </h4>
              <p className="text-gray-600 text-lg">
                Get a personalized learning roadmap with resources, courses, and
                milestones to achieve your goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h3>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who have discovered their dream
            careers with Elevare's AI-powered guidance.
          </p>

          <SignedOut>
            <button
              onClick={() => navigate("/sign-up")}
              className="px-10 py-4 text-lg font-semibold bg-white text-indigo-600 rounded-full hover:bg-gray-50 transition-all transform hover:scale-105 shadow-2xl"
            >
              Get Started for Free ✨
            </button>
          </SignedOut>

          <SignedIn>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-10 py-4 text-lg font-semibold bg-white text-indigo-600 rounded-full hover:bg-gray-50 transition-all transform hover:scale-105 shadow-2xl"
            >
              Continue Your Journey ✨
            </button>
          </SignedIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Elevare
            </h4>
            <p className="text-gray-400 mb-6">
              Elevating careers through AI-powered insights
            </p>
            <p className="text-gray-500">
              © {new Date().getFullYear()} Elevare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
