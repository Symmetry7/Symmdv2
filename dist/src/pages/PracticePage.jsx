import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Code,
  Monitor,
  UtensilsCrossed,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import ProblemCard from "../components/ProblemCard";

function PracticePage() {
  const { state, dispatch } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("A");
  const [selectedPlatform, setSelectedPlatform] = useState("codeforces");
  const [practiceProblems, setPracticeProblems] = useState([]);

  const difficultyCategories = {
    codeforces: [
      {
        id: "A",
        name: "Implementation & Logic",
        description: "Basic implementation, simple math, and logical thinking",
        color: "from-green-500 to-emerald-500",
        icon: "🎯",
        ratingRange: "800-1200",
      },
      {
        id: "B",
        name: "Mathematical & Greedy",
        description: "Number theory, combinatorics, and greedy algorithms",
        color: "from-blue-500 to-cyan-500",
        icon: "🧮",
        ratingRange: "900-1400",
      },
      {
        id: "C",
        name: "Data Structures",
        description: "Arrays, strings, basic data structures manipulation",
        color: "from-purple-500 to-violet-500",
        icon: "🏗️",
        ratingRange: "1000-1600",
      },
      {
        id: "D",
        name: "Algorithms & DP",
        description:
          "Dynamic programming, graph algorithms, advanced techniques",
        color: "from-orange-500 to-red-500",
        icon: "🚀",
        ratingRange: "1200-1900",
      },
      {
        id: "E",
        name: "Advanced Algorithms",
        description: "Complex DP, advanced graph theory, data structures",
        color: "from-red-500 to-pink-500",
        icon: "⚡",
        ratingRange: "1400-2100",
      },
      {
        id: "F",
        name: "Expert Level",
        description: "Advanced mathematics, complex algorithms",
        color: "from-pink-500 to-rose-500",
        icon: "🔥",
        ratingRange: "1600-2300",
      },
      {
        id: "G",
        name: "Master Level",
        description: "Cutting-edge algorithms, research-level problems",
        color: "from-gray-700 to-gray-900",
        icon: "💎",
        ratingRange: "1800-2500",
      },
    ],
    leetcode: [
      {
        id: "Easy",
        name: "Easy Problems",
        description: "Fundamental algorithms and data structures",
        color: "from-green-500 to-emerald-500",
        icon: "🌱",
        ratingRange: "Easy",
      },
      {
        id: "Medium",
        name: "Medium Problems",
        description: "Intermediate algorithms and problem-solving",
        color: "from-yellow-500 to-orange-500",
        icon: "🌟",
        ratingRange: "Medium",
      },
      {
        id: "Hard",
        name: "Hard Problems",
        description: "Advanced algorithms and complex problem-solving",
        color: "from-red-500 to-pink-500",
        icon: "🔥",
        ratingRange: "Hard",
      },
    ],
    codechef: [
      {
        id: "beginner",
        name: "Beginner",
        description: "Basic programming concepts and simple logic",
        color: "from-green-500 to-emerald-500",
        icon: "🌱",
        ratingRange: "Beginner",
      },
      {
        id: "easy",
        name: "Easy",
        description: "Simple algorithms and data structures",
        color: "from-blue-500 to-cyan-500",
        icon: "🎯",
        ratingRange: "Easy",
      },
      {
        id: "medium",
        name: "Medium",
        description: "Intermediate problem-solving skills",
        color: "from-purple-500 to-violet-500",
        icon: "⚡",
        ratingRange: "Medium",
      },
      {
        id: "hard",
        name: "Hard",
        description: "Advanced algorithms and techniques",
        color: "from-orange-500 to-red-500",
        icon: "🔥",
        ratingRange: "Hard",
      },
      {
        id: "challenge",
        name: "Challenge",
        description: "Expert-level competitive programming",
        color: "from-red-500 to-pink-500",
        icon: "💎",
        ratingRange: "Challenge",
      },
    ],
  };

  const platformIcons = {
    codeforces: { icon: Code, color: "text-blue-500" },
    leetcode: { icon: Monitor, color: "text-orange-500" },
    codechef: { icon: UtensilsCrossed, color: "text-amber-600" },
  };

  useEffect(() => {
    loadPracticeProblems();
  }, [selectedCategory, selectedPlatform]);

  const loadPracticeProblems = () => {
    // Filter problems based on selected category and platform
    const allProblems = state.platforms[selectedPlatform].problems;

    let filtered = allProblems.filter((problem) => {
      if (selectedPlatform === "codeforces") {
        return problem.index === selectedCategory;
      } else if (selectedPlatform === "leetcode") {
        return problem.difficulty === selectedCategory;
      } else if (selectedPlatform === "codechef") {
        return problem.difficulty === selectedCategory;
      }
      return false;
    });

    // Sort by difficulty (rating) or solved count
    filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));

    setPracticeProblems(filtered);
  };

  const currentCategories = difficultyCategories[selectedPlatform] || [];
  const PlatformIcon = platformIcons[selectedPlatform]?.icon || Code;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="w-8 h-8 text-primary-500" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Practice Arena
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Focus on your weak areas and strengthen your problem-solving skills
            <br />
            Choose a platform and difficulty category to practice targeted
            problems
          </p>
        </motion.div>

        {/* Platform Selection */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
            Select Platform
          </h2>
          <div className="flex justify-center gap-4">
            {Object.keys(difficultyCategories).map((platform) => {
              const Icon = platformIcons[platform]?.icon || Code;
              const isSelected = selectedPlatform === platform;

              return (
                <motion.button
                  key={platform}
                  onClick={() => {
                    setSelectedPlatform(platform);
                    setSelectedCategory(difficultyCategories[platform][0].id);
                  }}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    isSelected
                      ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="capitalize">{platform}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Category Grid */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Choose Your Focus Area
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentCategories.map((category) => {
              const isSelected = selectedCategory === category.id;

              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative p-6 rounded-2xl text-left transition-all duration-300 overflow-hidden group ${
                    isSelected
                      ? "ring-4 ring-primary-500 shadow-2xl"
                      : "hover:shadow-xl"
                  }`}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.color} ${
                      isSelected
                        ? "opacity-100"
                        : "opacity-80 group-hover:opacity-90"
                    }`}
                  />

                  <div className="relative z-10 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-3xl">{category.icon}</div>
                      <div className="text-sm font-mono bg-white/20 px-2 py-1 rounded">
                        {category.ratingRange}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90 leading-relaxed">
                      {category.description}
                    </p>

                    {isSelected && (
                      <motion.div
                        className="absolute top-2 right-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <CheckCircle className="w-6 h-6 text-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Practice Problems */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Practice Problems
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <PlatformIcon
                className={`w-4 h-4 ${platformIcons[selectedPlatform]?.color}`}
              />
              <span className="capitalize">{selectedPlatform}</span>
              <span>•</span>
              <span>{practiceProblems.length} problems</span>
            </div>
          </div>

          {practiceProblems.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No problems available for this category yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Try selecting a different platform or category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {practiceProblems.slice(0, 20).map((problem, index) => (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <ProblemCard problem={problem} compact />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default PracticePage;
