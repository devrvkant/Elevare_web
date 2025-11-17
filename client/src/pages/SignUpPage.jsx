import { SignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

const SignUpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 left-1/4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 hover:from-purple-700 hover:to-indigo-700 transition-all"
          >
            Elevare
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Start your journey
          </h1>
          <p className="text-gray-600">
            Create your account and discover your dream career
          </p>
        </div>

        {/* Clerk SignUp Component with custom styling */}
        <div className="w-full flex justify-center">
          <SignUp
            routing="path"
            path="/sign-up"
            redirectUrl="/dashboard"
            signInUrl="/sign-in"
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all",
                card: "bg-white rounded-2xl shadow-2xl border border-gray-100 w-full mx-auto",
                rootBox: "w-full flex justify-center",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border-2 border-gray-200 hover:border-purple-300 transition-all",
                formFieldInput:
                  "border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg",
                footerActionLink:
                  "text-purple-600 hover:text-purple-700 font-semibold",
              },
            }}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/sign-in")}
              className="text-purple-600 hover:text-purple-700 font-semibold underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
