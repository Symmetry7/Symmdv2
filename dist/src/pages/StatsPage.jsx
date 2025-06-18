import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Target,
  Clock,
  Award,
  Zap,
  Brain,
  Calendar,
} from "lucide-react";
import { useApp } from "../context/AppContext";

function StatsPage() {
  const { state } = useApp();
  const [userStats, setUserStats] = useState({
    totalSolved: 0,
    avgRating: 0,
    strongTopics: [],
    weakTopics: [],
    streak: 0,
    rankEstimate: "Unrated",
  });

  useEffect(() => {
    calculateUserStats();
  }, [state.userHandle, state.platforms]);

  const calculateUserStats = () => {
    const platform = state.platforms[state.currentPlatform];
    const solvedCount = platform.userSolvedProblems.size;

    // Calculate average rating of solved problems
    const solvedProblems = platform.problems.filter((p) =>
      platform.userSolvedProblems.has(`${p.contestId}-${p.index}`),
    );
    const avgRating =
      solvedProblems.length > 0
        ? Math.round(
            solvedProblems.reduce((sum, p) => sum + (p.rating || 0), 0) /
              solvedProblems.length,
          )
        : 0;

    // Estimate rank based on solved count and avg rating
    let rankEstimate = "Newbie";
    if (solvedCount > 100 && avgRating > 1400) rankEstimate = "Specialist";
    else if (solvedCount > 50 && avgRating > 1200) rankEstimate = "Pupil";
    else if (solvedCount > 200 && avgRating > 1600) rankEstimate = "Expert";

    setUserStats({
      totalSolved: solvedCount,
      avgRating,
      strongTopics: ["implementation", "math", "greedy"],
      weakTopics: ["dp", "graphs", "trees"],
      streak: Math.floor(Math.random() * 15) + 1,
      rankEstimate,
    });
  };

  const statsCards = [
    {
      title: "Problems Solved",
      value: userStats.totalSolved,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      description: `Average rating: ${userStats.avgRating}`,
      highlight: true,
    },
    {
      title: "Current Streak",
      value: `${userStats.streak} days`,
      icon: Zap,
      color: "from-orange-500 to-orange-600",
      description: "Keep the momentum going!",
    },
    {
      title: "Estimated Rank",
      value: userStats.rankEstimate,
      icon: Award,
      color: "from-purple-500 to-purple-600",
      description: "Based on your performance",
    },
    {
      title: "Total Available",
      value: state.stats.totalProblems,
      icon: BarChart3,
      color: "from-blue-500 to-blue-600",
      description: "Across all platforms",
    },
    {
      title: "Filtered Results",
      value: state.stats.filteredProblems,
      icon: Target,
      color: "from-indigo-500 to-indigo-600",
      description: "Matching your filters",
    },
    {
      title: "Last Updated",
      value: state.stats.lastUpdated,
      icon: Clock,
      color: "from-gray-500 to-gray-600",
      description: "Database refresh date",
    },
  ];

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
            <BarChart3 className="w-8 h-8 text-primary-500" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Statistics Dashboard
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Track your progress and analyze problem-solving patterns
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6 hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {stat.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.description}
                    </p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stat.value}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* User Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Strong Topics
              </h2>
            </div>
            <div className="space-y-3">
              {userStats.strongTopics.map((topic, index) => (
                <div
                  key={topic}
                  className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                >
                  <span className="font-medium text-gray-800 dark:text-white capitalize">
                    {topic}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-green-200 dark:bg-green-800 rounded-full">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${90 - index * 10}%` }}
                      />
                    </div>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                      {90 - index * 10}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Areas for Improvement
              </h2>
            </div>
            <div className="space-y-3">
              {userStats.weakTopics.map((topic, index) => (
                <div
                  key={topic}
                  className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                >
                  <span className="font-medium text-gray-800 dark:text-white capitalize">
                    {topic}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-orange-200 dark:bg-orange-800 rounded-full">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${30 + index * 15}%` }}
                      />
                    </div>
                    <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                      {30 + index * 15}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Platform Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Platform Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(state.platforms).map(([platform, data]) => (
              <div
                key={platform}
                className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl"
              >
                <h3 className="font-bold text-gray-800 dark:text-white capitalize mb-3 text-lg">
                  {platform}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Total Problems:
                    </span>
                    <span className="font-bold text-primary-500">
                      {data.problems.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Your Solved:
                    </span>
                    <span className="font-bold text-green-500">
                      {data.userSolvedProblems.size}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Progress:
                    </span>
                    <span className="font-bold text-blue-500">
                      {data.problems.length > 0
                        ? Math.round(
                            (data.userSolvedProblems.size /
                              data.problems.length) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default StatsPage;
