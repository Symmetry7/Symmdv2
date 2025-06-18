import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Code,
  Laptop,
  ChefHat,
  Zap,
  Search,
  User,
  Tags,
  ArrowUp,
  ArrowDown,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import apiServices from "../services/apiServices";
import UserHandleSection from "../components/UserHandleSection";
import PlatformTabs from "../components/PlatformTabs";
import FilterSection from "../components/FilterSection";
import TagInput from "../components/TagInput";
import ProblemCard from "../components/ProblemCard";
import LoadingSpinner from "../components/LoadingSpinner";

function HomePage() {
  const { state, dispatch } = useApp();
  const [showTags, setShowTags] = useState(true);

  useEffect(() => {
    // Load initial data when component mounts
    loadPlatformData();
  }, [state.currentPlatform]);

  const loadPlatformData = async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      let problemsData = { problems: [], count: 0 };

      console.log(`Loading ${state.currentPlatform} problems...`);

      switch (state.currentPlatform) {
        case "codeforces":
          problemsData = await apiServices.fetchCodeforcesProblems();
          break;
        case "leetcode":
          problemsData = await apiServices.fetchLeetCodeProblems();
          break;
        case "codechef":
          problemsData = await apiServices.fetchCodeChefProblems();
          break;
        default:
          console.warn("Unknown platform:", state.currentPlatform);
          problemsData = { problems: [], count: 0 };
      }

      if (problemsData && problemsData.problems) {
        dispatch({
          type: "SET_PROBLEMS",
          platform: state.currentPlatform,
          payload: problemsData.problems,
        });

        console.log(
          `Loaded ${problemsData.problems.length} problems for ${state.currentPlatform}`,
        );
        filterProblems(problemsData.problems);
      } else {
        console.warn("No problems data received for", state.currentPlatform);
        dispatch({
          type: "SET_PROBLEMS",
          platform: state.currentPlatform,
          payload: [],
        });
      }
    } catch (error) {
      console.error(`Error loading ${state.currentPlatform} data:`, error);

      // Ensure we still set empty array to prevent undefined errors
      dispatch({
        type: "SET_PROBLEMS",
        platform: state.currentPlatform,
        payload: [],
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const filterProblems = (problems = null) => {
    const problemsToFilter =
      problems || state.platforms[state.currentPlatform].problems;
    const filters = state.filters[state.currentPlatform];

    let filtered = problemsToFilter.filter((problem) => {
      // Platform-specific filtering logic
      if (state.currentPlatform === "codeforces") {
        const typeMatch =
          filters.problemType === "random" ||
          problem.index === filters.problemType;
        const ratingMatch =
          problem.rating >= filters.minRating &&
          problem.rating <= filters.maxRating;
        const eraMatch =
          filters.contestEra === "any" ||
          (filters.contestEra === "new" && problem.year >= 2021) ||
          (filters.contestEra === "old" && problem.year < 2021);

        if (!typeMatch || !ratingMatch || !eraMatch) return false;
      }

      // Tag filtering
      if (state.selectedTags.length > 0) {
        return state.selectedTags.some((selectedTag) =>
          problem.tags.some((problemTag) =>
            problemTag.toLowerCase().includes(selectedTag.toLowerCase()),
          ),
        );
      }

      return true;
    });

    dispatch({ type: "SET_FILTERED_PROBLEMS", payload: filtered });
    dispatch({
      type: "UPDATE_STATS",
      payload: {
        totalProblems: problemsToFilter.length,
        filteredProblems: filtered.length,
      },
    });
  };

  const generateProblem = () => {
    const problems = state.platforms[state.currentPlatform].filteredProblems;
    if (problems.length === 0) return;

    const randomIndex = Math.floor(Math.random() * problems.length);
    dispatch({ type: "SET_CURRENT_PROBLEM", payload: problems[randomIndex] });
  };

  useEffect(() => {
    filterProblems();
  }, [state.selectedTags, state.filters]);

  return (
    <div className="min-h-screen pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-primary-500 bg-clip-text text-transparent">
              Competitive Programming
            </span>
            <br />
            <span className="text-gray-800 dark:text-gray-200">
              Problem Generator
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Master algorithms across Codeforces, LeetCode, and CodeChef with our
            intelligent problem selector.
            <br />
            Filter by difficulty, topics, and contest era to find your perfect
            challenge.
          </motion.p>
        </motion.div>

        {/* User Handle Section */}
        <div className="mb-6">
          <UserHandleSection />
        </div>

        {/* Platform Tabs */}
        <div className="mb-6">
          <PlatformTabs />
        </div>

        {/* Filter Section */}
        <div className="mb-6">
          <FilterSection showTags={showTags} setShowTags={setShowTags} />
        </div>

        {/* Tags Input */}
        <AnimatePresence>
          {showTags && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Tags className="w-6 h-6 text-accent-500" />
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Algorithm Tags & Topics
                  </h3>
                </div>
                <TagInput />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate Button */}
        <motion.div
          className="flex flex-col items-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.button
            onClick={generateProblem}
            disabled={
              state.isLoading ||
              state.platforms[state.currentPlatform].filteredProblems.length ===
                0
            }
            className="group relative px-12 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold text-lg rounded-2xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-accent-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-3">
              <Zap className="w-6 h-6" />
              Generate Perfect Problem
            </div>
            <div className="absolute inset-0 -top-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
          </motion.button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {state.platforms[state.currentPlatform].filteredProblems.length}{" "}
              problems available
            </p>
          </div>
        </motion.div>

        {/* Problem Display */}
        <AnimatePresence mode="wait">
          {state.isLoading ? (
            <LoadingSpinner
              message={`Loading ${state.currentPlatform.charAt(0).toUpperCase() + state.currentPlatform.slice(1)} problems...`}
            />
          ) : state.currentProblem ? (
            <ProblemCard
              problem={state.currentProblem}
              onNextProblem={generateProblem}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-8">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Ready to Practice! 🚀
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Click "Generate Perfect Problem" to start your coding journey
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-500">
                  {state.platforms[state.currentPlatform].problems.length}{" "}
                  problems loaded from {state.currentPlatform}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default HomePage;
