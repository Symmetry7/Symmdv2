import React from "react";
import { motion } from "framer-motion";
import { Code, Laptop, ChefHat } from "lucide-react";
import { useApp } from "../context/AppContext";

function PlatformTabs() {
  const { state, dispatch } = useApp();

  const platforms = [
    {
      id: "codeforces",
      name: "Codeforces",
      icon: Code,
      color: "from-blue-500 to-blue-600",
      description: "Algorithmic contests",
      count: state.platforms.codeforces.problems.length,
    },
    {
      id: "leetcode",
      name: "LeetCode",
      icon: Laptop,
      color: "from-orange-500 to-orange-600",
      description: "Technical interviews",
      count: state.platforms.leetcode.problems.length,
    },
    {
      id: "codechef",
      name: "CodeChef",
      icon: ChefHat,
      color: "from-amber-600 to-amber-700",
      description: "Programming contests",
      count: state.platforms.codechef.problems.length,
    },
  ];

  const handlePlatformChange = (platformId) => {
    dispatch({ type: "SET_PLATFORM", payload: platformId });
  };

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.6 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Choose Platform
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select your preferred competitive programming platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const isActive = state.currentPlatform === platform.id;

          return (
            <motion.button
              key={platform.id}
              onClick={() => handlePlatformChange(platform.id)}
              className={`relative p-6 rounded-2xl text-left transition-all duration-300 group overflow-hidden ${
                isActive
                  ? "ring-4 ring-primary-500 shadow-2xl"
                  : "hover:shadow-xl glass dark:glass-dark border border-white/20 dark:border-gray-700/20"
              }`}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background gradient for active state */}
              {isActive && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${platform.color}`}
                  layoutId="activePlatform"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Hover effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isActive
                        ? "bg-white/20"
                        : `bg-gradient-to-br ${platform.color}`
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isActive ? "text-white" : "text-white"
                      }`}
                    />
                  </div>
                  <div
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {platform.count > 0 ? `${platform.count}` : "0"} problems
                  </div>
                </div>

                <h3
                  className={`text-xl font-bold mb-2 ${
                    isActive ? "text-white" : "text-gray-800 dark:text-white"
                  }`}
                >
                  {platform.name}
                </h3>

                <p
                  className={`text-sm ${
                    isActive
                      ? "text-white/80"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {platform.description}
                </p>
              </div>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute top-4 right-4 w-3 h-3 bg-white rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default PlatformTabs;
