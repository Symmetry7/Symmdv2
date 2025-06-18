import React from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Target, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";

function StatsPage() {
  const { state } = useApp();

  const statsCards = [
    {
      title: "Total Problems",
      value: state.stats.totalProblems,
      icon: BarChart3,
      color: "from-blue-500 to-blue-600",
      description: "Available across all platforms",
    },
    {
      title: "Filtered Results",
      value: state.stats.filteredProblems,
      icon: Target,
      color: "from-purple-500 to-purple-600",
      description: "Matching your current filters",
    },
    {
      title: "Problems Solved",
      value: state.stats.solvedProblems,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      description: "Based on connected handle",
    },
    {
      title: "Last Updated",
      value: state.stats.lastUpdated,
      icon: Clock,
      color: "from-orange-500 to-orange-600",
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

        {/* Platform Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Platform Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(state.platforms).map(([platform, data]) => (
              <div
                key={platform}
                className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
              >
                <h3 className="font-semibold text-gray-800 dark:text-white capitalize mb-2">
                  {platform}
                </h3>
                <p className="text-2xl font-bold text-primary-500">
                  {data.problems.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Problems
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default StatsPage;
