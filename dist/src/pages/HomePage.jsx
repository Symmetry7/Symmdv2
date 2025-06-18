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
import UserHandleSection from "../components/UserHandleSection";
import PlatformTabs from "../components/PlatformTabs";
import FilterSection from "../components/FilterSection";
import TagsSection from "../components/TagsSection";
import ProblemCard from "../components/ProblemCard";
import LoadingSpinner from "../components/LoadingSpinner";

function HomePage() {
  const { state, dispatch } = useApp();
  const [showTags, setShowTags] = useState(true);

  useEffect(() => {
    // Load initial data when component mounts
    loadPlatformData();
  }, [state.currentPlatform]);

  useEffect(() => {
    // Listen for next problem events
    const handleNextProblem = () => generateProblem();
    window.addEventListener("generateNextProblem", handleNextProblem);
    return () =>
      window.removeEventListener("generateNextProblem", handleNextProblem);
  }, []);

  const loadPlatformData = async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Simulate API calls with mock data for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockProblems = generateMockProblems(state.currentPlatform);
      dispatch({
        type: "SET_PROBLEMS",
        platform: state.currentPlatform,
        payload: mockProblems,
      });

      filterProblems(mockProblems);
    } catch (error) {
      console.error("Error loading platform data:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const generateMockProblems = (platform) => {
    const problems = [];
    const count =
      platform === "codeforces" ? 500 : platform === "leetcode" ? 300 : 200;

    for (let i = 1; i <= count; i++) {
      const problem = {
        id: i,
        platform,
        title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Problem ${i}`,
        rating: 800 + Math.floor(Math.random() * 2000),
        solvedCount: Math.floor(Math.random() * 50000) + 1000,
        tags: getRandomTags(platform),
        url: `https://${platform}.com/problem/${i}`,
      };

      if (platform === "codeforces") {
        problem.index = ["A", "B", "C", "D", "E", "F", "G"][
          Math.floor(Math.random() * 7)
        ];
        problem.contestId = 1000 + Math.floor(Math.random() * 1000);
        problem.contestName = `Codeforces Round #${problem.contestId}`;
        problem.year = 2018 + Math.floor(Math.random() * 7);
      } else if (platform === "leetcode") {
        problem.difficulty = ["Easy", "Medium", "Hard"][
          Math.floor(Math.random() * 3)
        ];
        problem.isPremium = Math.random() < 0.3;
      } else if (platform === "codechef") {
        problem.difficulty = [
          "beginner",
          "easy",
          "medium",
          "hard",
          "challenge",
        ][Math.floor(Math.random() * 5)];
        problem.contestStatus = ["practice", "past", "present"][
          Math.floor(Math.random() * 3)
        ];
      }

      problems.push(problem);
    }

    return problems;
  };

  const getRandomTags = (platform) => {
    const allTags = state.platforms[platform].tags;
    const count = 1 + Math.floor(Math.random() * 4);
    return allTags.sort(() => 0.5 - Math.random()).slice(0, count);
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
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
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
        <UserHandleSection />

        {/* Platform Tabs */}
        <PlatformTabs />

        {/* Filter Section */}
        <FilterSection showTags={showTags} setShowTags={setShowTags} />

        {/* Tags Section */}
        <AnimatePresence>{showTags && <TagsSection />}</AnimatePresence>

        {/* Generate Button */}
        <motion.div
          className="flex flex-col items-center gap-6 mb-12"
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
            <LoadingSpinner />
          ) : state.currentProblem ? (
            <ProblemCard problem={state.currentProblem} />
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default HomePage;
