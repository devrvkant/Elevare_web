import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

const SignInPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Elevare
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600">
            Sign in to continue your career journey
          </p>
        </div>

        {/* Clerk SignIn Component with custom styling */}
        <div className="w-full flex justify-center">
          <SignIn
            routing="path"
            path="/sign-in/*"
            afterSignInUrl="/dashboard"
            redirectUrl="/dashboard"
            signUpUrl="/sign-up"
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all",
                card: "bg-white rounded-2xl shadow-2xl border border-gray-100 w-full mx-auto",
                rootBox: "w-full flex justify-center",
                socialButtonsBlockButton:
                  "border-2 border-gray-200 hover:border-indigo-300 transition-all",
                formFieldInput:
                  "border-2 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg",
                footerActionLink:
                  "text-indigo-600 hover:text-indigo-700 font-semibold",
              },
            }}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/sign-up")}
              className="text-indigo-600 hover:text-indigo-700 font-semibold underline"
            >
              Sign up for free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
