import React from "react";
import { motion } from "framer-motion";
import {
  Settings,
  EyeOff,
  Eye,
  Calendar,
  Trophy,
  Layers,
  TrendingUp,
} from "lucide-react";
import { useApp } from "../context/AppContext";

function FilterSection({ showTags, setShowTags }) {
  const { state, dispatch } = useApp();
  const currentFilters = state.filters[state.currentPlatform];

  const updateFilter = (field, value) => {
    dispatch({ type: "UPDATE_FILTER", field, value });
  };

  const renderCodeforcesFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Layers className="w-4 h-4" />
          Problem Type
        </label>
        <select
          value={currentFilters.problemType}
          onChange={(e) => updateFilter("problemType", e.target.value)}
          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
        >
          <option value="random">Random (A-G)</option>
          <option value="A">A - Implementation</option>
          <option value="B">B - Math & Logic</option>
          <option value="C">C - Data Structures</option>
          <option value="D">D - Algorithms</option>
          <option value="E">E - Advanced</option>
          <option value="F">F - Expert</option>
          <option value="G">G - Master</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Calendar className="w-4 h-4" />
          Contest Era
        </label>
        <select
          value={currentFilters.contestEra}
          onChange={(e) => updateFilter("contestEra", e.target.value)}
          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
        >
          <option value="any">All Time</option>
          <option value="new">New Era (2021+)</option>
          <option value="old">Classic Era (Before 2021)</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Trophy className="w-4 h-4" />
          Contest Type
        </label>
        <select
          value={currentFilters.contestType}
          onChange={(e) => updateFilter("contestType", e.target.value)}
          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
        >
          <option value="any">Any Contest</option>
          <option value="Div. 1">Division 1</option>
          <option value="Div. 2">Division 2</option>
          <option value="Div. 3">Division 3</option>
          <option value="Educational">Educational</option>
          <option value="Global">Global Round</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <TrendingUp className="w-4 h-4" />
          Rating Range
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={currentFilters.minRating}
            onChange={(e) =>
              updateFilter("minRating", parseInt(e.target.value) || 800)
            }
            min="800"
            max="3500"
            step="100"
            className="flex-1 px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 text-center"
          />
          <span className="text-gray-500 dark:text-gray-400 font-medium">
            to
          </span>
          <input
            type="number"
            value={currentFilters.maxRating}
            onChange={(e) =>
              updateFilter("maxRating", parseInt(e.target.value) || 3500)
            }
            min="800"
            max="3500"
            step="100"
            className="flex-1 px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 text-center"
          />
        </div>
      </div>
    </div>
  );

  const renderLeetCodeFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Layers className="w-4 h-4" />
          Difficulty Level
        </label>
        <select
          value={currentFilters.difficulty}
          onChange={(e) => updateFilter("difficulty", e.target.value)}
          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
        >
          <option value="any">Any Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Trophy className="w-4 h-4" />
          Premium Access
        </label>
        <select
          value={currentFilters.premium}
          onChange={(e) => updateFilter("premium", e.target.value)}
          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
        >
          <option value="free">Free Only</option>
          <option value="any">Free & Premium</option>
          <option value="premium">Premium Only</option>
        </select>
      </div>
    </div>
  );

  const renderCodeChefFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Layers className="w-4 h-4" />
          Problem Difficulty
        </label>
        <select
          value={currentFilters.difficulty}
          onChange={(e) => updateFilter("difficulty", e.target.value)}
          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
        >
          <option value="any">Any Difficulty</option>
          <option value="beginner">Beginner</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="challenge">Challenge</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Calendar className="w-4 h-4" />
          Contest Status
        </label>
        <select
          value={currentFilters.contestStatus}
          onChange={(e) => updateFilter("contestStatus", e.target.value)}
          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
        >
          <option value="any">Any Status</option>
          <option value="practice">Practice</option>
          <option value="present">Active</option>
          <option value="past">Past</option>
        </select>
      </div>
    </div>
  );

  const renderFilters = () => {
    switch (state.currentPlatform) {
      case "codeforces":
        return renderCodeforcesFilters();
      case "leetcode":
        return renderLeetCodeFilters();
      case "codechef":
        return renderCodeChefFilters();
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 border-b border-white/20 dark:border-gray-700/20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-primary-500" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Filter Options
              </h3>
            </div>
            <motion.button
              onClick={() => setShowTags(!showTags)}
              className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showTags ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {showTags ? "Hide Tags" : "Show Tags"}
            </motion.button>
          </div>
        </div>

        {/* Filters Content */}
        <div className="p-6">{renderFilters()}</div>
      </div>
    </motion.div>
  );
}

export default FilterSection;
