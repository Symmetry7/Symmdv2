import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Code,
  Trophy,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import GoogleAuthButton from "../components/GoogleAuthButton";

function LoginPage() {
  const navigate = useNavigate();
  const [showHandleSetup, setShowHandleSetup] = useState(false);
  const [user, setUser] = useState(null);
  const [handles, setHandles] = useState({
    codeforces: "",
    leetcode: "",
    codechef: "",
  });

  const features = [
    {
      icon: Code,
      title: "Smart Problem Generation",
      description:
        "Get personalized problems based on your skill level and preferences across multiple platforms",
    },
    {
      icon: Trophy,
      title: "Virtual Contests",
      description:
        "Create and participate in custom contests with your friends or practice alone",
    },
    {
      icon: Users,
      title: "Multi-Platform Support",
      description:
        "Connect your Codeforces, LeetCode, and CodeChef accounts for comprehensive tracking",
    },
  ];

  const platforms = [
    {
      id: "codeforces",
      name: "Codeforces",
      placeholder: "Enter your Codeforces handle",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "leetcode",
      name: "LeetCode",
      placeholder: "Enter your LeetCode username",
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "codechef",
      name: "CodeChef",
      placeholder: "Enter your CodeChef handle",
      color: "from-amber-500 to-amber-600",
    },
  ];

  const handleGoogleSignIn = (userData) => {
    setUser(userData);
    setShowHandleSetup(true);
  };

  const handleSignInError = (error) => {
    console.error("Sign in error:", error);
    // You can show a toast or error message here
  };

  const handleInputChange = (platform, value) => {
    setHandles((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const handleCompleteSetup = () => {
    // Save handles to localStorage
    const validHandles = {};
    Object.entries(handles).forEach(([platform, handle]) => {
      if (handle.trim()) {
        validHandles[platform] = handle.trim();
      }
    });

    localStorage.setItem("symmdiv2-handles", JSON.stringify(validHandles));
    localStorage.setItem("symmdiv2-onboarded", "true");

    // Navigate to dashboard
    navigate("/dashboard");
  };

  const handleSkip = () => {
    localStorage.setItem("symmdiv2-onboarded", "true");
    navigate("/dashboard");
  };

  if (showHandleSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500/20 to-pink-500/20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <motion.div
            className="max-w-2xl w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-4">
                Welcome, {user?.displayName}!
              </h1>
              <p className="text-gray-300 text-lg">
                Let's connect your competitive programming accounts to get
                started
              </p>
            </div>

            <div className="glass dark:glass-dark rounded-2xl border border-white/20 p-8">
              <div className="space-y-6">
                {platforms.map((platform) => (
                  <div key={platform.id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      {platform.name} Handle (Optional)
                    </label>
                    <input
                      type="text"
                      value={handles[platform.id]}
                      onChange={(e) =>
                        handleInputChange(platform.id, e.target.value)
                      }
                      placeholder={platform.placeholder}
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-white placeholder-gray-400"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleSkip}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Skip for now
                </button>
                <button
                  onClick={handleCompleteSetup}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-lg font-medium transition-all duration-200"
                >
                  Complete Setup
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500/20 to-pink-500/20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Section - Branding & Features */}
        <div className="flex-1 flex items-center justify-center p-12">
          <motion.div
            className="max-w-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold">Symm</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                  Div2+
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Master Competitive
              <span className="block bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Programming
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8">
              Practice smarter with personalized problems, create virtual
              contests, and track your progress across all major platforms.
            </p>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  >
                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Section - Login Form */}
        <div className="flex-1 flex items-center justify-center p-12">
          <motion.div
            className="max-w-md w-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="glass dark:glass-dark rounded-2xl border border-white/20 p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                <p className="text-gray-400">
                  Sign in to continue your coding journey
                </p>
              </div>

              <GoogleAuthButton
                onSuccess={handleGoogleSignIn}
                onError={handleSignInError}
                className="mb-6"
              />

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800 text-gray-400">
                    Why SymmDiv2+?
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Multi-platform problem sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Virtual contest creation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Progress tracking & analytics</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700 text-center">
                <p className="text-xs text-gray-500">
                  By signing in, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
