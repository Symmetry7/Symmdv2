import React from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Star,
  Users,
  CheckCircle,
  Clock,
  Code,
  Monitor,
  UtensilsCrossed,
  Bookmark,
  Share2,
} from "lucide-react";

function ProblemCard({ problem, compact = false }) {
  if (!problem) return null;

  const platformIcons = {
    codeforces: { icon: Code, color: "text-blue-500", bg: "bg-blue-500" },
    leetcode: { icon: Monitor, color: "text-orange-500", bg: "bg-orange-500" },
    codechef: {
      icon: UtensilsCrossed,
      color: "text-amber-600",
      bg: "bg-amber-600",
    },
  };

  const PlatformIcon = platformIcons[problem.platform]?.icon || Code;
  const platformColor =
    platformIcons[problem.platform]?.color || "text-blue-500";
  const platformBg = platformIcons[problem.platform]?.bg || "bg-blue-500";

  const getDifficultyColor = (rating) => {
    if (!rating) return "bg-gray-500";
    if (rating < 1200) return "bg-green-500";
    if (rating < 1600) return "bg-blue-500";
    if (rating < 2000) return "bg-purple-500";
    if (rating < 2400) return "bg-orange-500";
    return "bg-red-500";
  };

  const getDifficultyLabel = (rating) => {
    if (!rating) return "Unrated";
    if (rating < 1200) return "Easy";
    if (rating < 1600) return "Medium";
    if (rating < 2000) return "Hard";
    if (rating < 2400) return "Very Hard";
    return "Expert";
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  if (compact) {
    return (
      <motion.div
        className="glass dark:glass-dark rounded-xl border border-white/20 dark:border-gray-700/20 p-4 hover:shadow-lg transition-all duration-300 problem-card"
        whileHover={{ y: -2 }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 ${platformBg} rounded-lg flex items-center justify-center`}
            >
              <PlatformIcon className="w-4 h-4 text-white" />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {problem.platform}
            </div>
          </div>
          <div
            className={`px-2 py-1 rounded-md text-xs font-medium text-white ${getDifficultyColor(problem.rating)}`}
          >
            {problem.rating || "N/A"}
          </div>
        </div>

        <h3 className="font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
          {problem.title || problem.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {formatNumber(problem.solvedCount || 0)}
            </div>
          </div>
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-primary-500 text-white rounded-lg text-xs font-medium hover:bg-primary-600 transition-colors"
          >
            Solve
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 border-b border-white/20 dark:border-gray-700/20 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 ${platformBg} rounded-xl flex items-center justify-center`}
              >
                <PlatformIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                    {problem.platform}
                  </span>
                  {problem.contestId && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Contest {problem.contestId}
                      </span>
                    </>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {problem.title || problem.name}
                </h2>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div
                className={`px-4 py-2 rounded-xl text-white font-bold ${getDifficultyColor(problem.rating)}`}
              >
                {problem.rating ? `${problem.rating} pts` : "Unrated"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {getDifficultyLabel(problem.rating)}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-white/20 dark:border-gray-700/20">
          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <div className="font-semibold text-gray-800 dark:text-white">
                  {problem.rating || "N/A"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Rating
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary-500" />
              <div>
                <div className="font-semibold text-gray-800 dark:text-white">
                  {formatNumber(problem.solvedCount || 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Solved
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success-500" />
              <div>
                <div className="font-semibold text-gray-800 dark:text-white">
                  Unsolved
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Status
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {problem.tags && problem.tags.length > 0 && (
          <div className="p-6 border-b border-white/20 dark:border-gray-700/20">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {problem.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6">
          <div className="flex items-center gap-4">
            <motion.a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-5 h-5" />
              Solve Problem
            </motion.a>

            <motion.button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("generateNextProblem"))
              }
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
              Next Problem
            </motion.button>

            <motion.button
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bookmark className="w-4 h-4" />
              Bookmark
            </motion.button>

            <motion.button
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-4 h-4" />
              Share
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProblemCard;
