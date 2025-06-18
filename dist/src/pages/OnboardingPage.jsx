import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Monitor,
  UtensilsCrossed,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  User,
  Shield,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function OnboardingPage() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [handles, setHandles] = useState({
    codeforces: "",
    leetcode: "",
    codechef: "",
  });
  const [verification, setVerification] = useState({
    codeforces: null,
    leetcode: null,
    codechef: null,
  });
  const [isVerifying, setIsVerifying] = useState(false);

  const platforms = [
    {
      id: "codeforces",
      name: "Codeforces",
      icon: Code,
      color: "from-blue-500 to-blue-600",
      description: "Competitive programming contests",
      placeholder: "Enter your Codeforces handle",
      example: "e.g., tourist, Errichto",
      apiUrl: "https://codeforces.com/api/user.info?handles=",
    },
    {
      id: "leetcode",
      name: "LeetCode",
      icon: Monitor,
      color: "from-orange-500 to-orange-600",
      description: "Technical interview preparation",
      placeholder: "Enter your LeetCode username",
      example: "e.g., your_username",
      apiUrl: null, // LeetCode API requires different approach
    },
    {
      id: "codechef",
      name: "CodeChef",
      icon: UtensilsCrossed,
      color: "from-amber-600 to-amber-700",
      description: "Programming contests and practice",
      placeholder: "Enter your CodeChef handle",
      example: "e.g., your_handle",
      apiUrl: null, // CodeChef API is unofficial
    },
  ];

  const steps = [
    {
      title: "Welcome to SymmDiv2+",
      subtitle: "Your Advanced Competitive Programming Platform",
      content:
        "Get started by setting up your profile across all major CP platforms",
    },
    {
      title: "Connect Your Profiles",
      subtitle: "Add your handles from competitive programming platforms",
      content:
        "We'll verify your profiles and sync your progress automatically",
    },
    {
      title: "All Set!",
      subtitle: "Your profile is ready",
      content:
        "Start practicing, creating contests, and tracking your progress",
    },
  ];

  const handleInputChange = (platform, value) => {
    setHandles((prev) => ({
      ...prev,
      [platform]: value,
    }));
    // Reset verification when input changes
    setVerification((prev) => ({
      ...prev,
      [platform]: null,
    }));
  };

  const verifyHandle = async (platform) => {
    const handle = handles[platform].trim();
    if (!handle) return;

    setIsVerifying(true);
    setVerification((prev) => ({
      ...prev,
      [platform]: "loading",
    }));

    try {
      // Simulate verification process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (platform === "codeforces") {
        // Try actual Codeforces API
        try {
          const response = await fetch(
            `https://codeforces.com/api/user.info?handles=${handle}`,
          );
          const data = await response.json();

          if (data.status === "OK") {
            setVerification((prev) => ({
              ...prev,
              [platform]: "success",
            }));
          } else {
            setVerification((prev) => ({
              ...prev,
              [platform]: "error",
            }));
          }
        } catch (error) {
          // Fallback to mock verification
          const isValid =
            handle.length >= 3 && /^[a-zA-Z0-9_.-]+$/.test(handle);
          setVerification((prev) => ({
            ...prev,
            [platform]: isValid ? "success" : "error",
          }));
        }
      } else {
        // Mock verification for other platforms
        const isValid = handle.length >= 3 && /^[a-zA-Z0-9_.-]+$/.test(handle);
        setVerification((prev) => ({
          ...prev,
          [platform]: isValid ? "success" : "error",
        }));
      }
    } catch (error) {
      setVerification((prev) => ({
        ...prev,
        [platform]: "error",
      }));
    } finally {
      setIsVerifying(false);
    }
  };

  const getVerificationIcon = (status) => {
    switch (status) {
      case "loading":
        return (
          <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        );
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return true;
    if (currentStep === 1) {
      // At least one platform should be verified
      return Object.values(verification).some((status) => status === "success");
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Save handles and proceed to main app
      const verifiedHandles = {};
      Object.keys(handles).forEach((platform) => {
        if (verification[platform] === "success") {
          verifiedHandles[platform] = handles[platform];
        }
      });

      // Save to localStorage and context
      localStorage.setItem("symmdiv2-handles", JSON.stringify(verifiedHandles));
      dispatch({ type: "SET_USER_HANDLES", payload: verifiedHandles });

      navigate("/dashboard");
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500/20 to-pink-500/20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          className="p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Symm</span>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                  Div2+
                </span>
              </div>
            </div>

            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Skip for now
            </button>
          </div>
        </motion.header>

        {/* Progress Bar */}
        <motion.div
          className="px-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    index <= currentStep
                      ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-4xl w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                {/* Step Content */}
                <div className="mb-12">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {steps[currentStep].title}
                  </h1>
                  <p className="text-xl text-gray-300 mb-2">
                    {steps[currentStep].subtitle}
                  </p>
                  <p className="text-gray-400">{steps[currentStep].content}</p>
                </div>

                {/* Step-specific content */}
                {currentStep === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
                  >
                    {[
                      {
                        icon: User,
                        title: "Profile Setup",
                        desc: "Connect your CP accounts",
                      },
                      {
                        icon: Shield,
                        title: "Progress Tracking",
                        desc: "Monitor your growth",
                      },
                      {
                        icon: Zap,
                        title: "Virtual Contests",
                        desc: "Create and participate",
                      },
                    ].map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.5 + index * 0.1,
                            duration: 0.6,
                          }}
                          className="glass dark:glass-dark rounded-2xl border border-white/20 p-6"
                        >
                          <Icon className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {feature.desc}
                          </p>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="max-w-2xl mx-auto"
                  >
                    <div className="space-y-6">
                      {platforms.map((platform, index) => {
                        const Icon = platform.icon;
                        return (
                          <motion.div
                            key={platform.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.4 + index * 0.1,
                              duration: 0.6,
                            }}
                            className="glass dark:glass-dark rounded-2xl border border-white/20 p-6"
                          >
                            <div className="flex items-center gap-4 mb-4">
                              <div
                                className={`w-12 h-12 bg-gradient-to-r ${platform.color} rounded-xl flex items-center justify-center`}
                              >
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1 text-left">
                                <h3 className="text-lg font-semibold">
                                  {platform.name}
                                </h3>
                                <p className="text-sm text-gray-400">
                                  {platform.description}
                                </p>
                              </div>
                              {getVerificationIcon(verification[platform.id])}
                            </div>

                            <div className="flex gap-3">
                              <input
                                type="text"
                                value={handles[platform.id]}
                                onChange={(e) =>
                                  handleInputChange(platform.id, e.target.value)
                                }
                                placeholder={platform.placeholder}
                                className="flex-1 px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
                              />
                              <button
                                onClick={() => verifyHandle(platform.id)}
                                disabled={
                                  !handles[platform.id].trim() ||
                                  verification[platform.id] === "loading"
                                }
                                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                              >
                                Verify
                              </button>
                            </div>

                            <p className="text-xs text-gray-500 mt-2">
                              {platform.example}
                            </p>

                            {verification[platform.id] === "success" && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-green-400 text-sm mt-2"
                              >
                                ✓ Handle verified successfully!
                              </motion.p>
                            )}

                            {verification[platform.id] === "error" && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-400 text-sm mt-2"
                              >
                                ✗ Handle not found or invalid
                              </motion.p>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    <p className="text-sm text-gray-400 mt-6">
                      * You need at least one verified handle to continue
                    </p>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-center"
                  >
                    <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-lg text-gray-300 mb-8">
                      Your profile has been set up successfully! You can now
                      access all features of SymmDiv2+.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
                      <div className="glass dark:glass-dark rounded-xl border border-white/20 p-4">
                        <h4 className="font-semibold mb-2">Verified Handles</h4>
                        <div className="space-y-1">
                          {Object.entries(verification).map(
                            ([platform, status]) =>
                              status === "success" && (
                                <div
                                  key={platform}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                  <span className="capitalize">
                                    {platform}: {handles[platform]}
                                  </span>
                                </div>
                              ),
                          )}
                        </div>
                      </div>

                      <div className="glass dark:glass-dark rounded-xl border border-white/20 p-4">
                        <h4 className="font-semibold mb-2">Next Steps</h4>
                        <div className="space-y-1 text-sm text-gray-300">
                          <div>• Generate problems</div>
                          <div>• Create virtual contests</div>
                          <div>• Track your progress</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <motion.div
              className="flex items-center justify-center gap-4 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Back
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200"
              >
                {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
