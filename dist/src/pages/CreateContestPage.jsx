import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Search,
  Code,
  Clock,
  Users,
  Trophy,
  Save,
  Play,
  Eye,
  EyeOff,
  Calendar,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiServices from "../services/apiServices";

function CreateContestPage() {
  const navigate = useNavigate();
  const [contest, setContest] = useState({
    title: "",
    description: "",
    duration: 120, // minutes
    startTime: "",
    isPublic: true,
    password: "",
    maxParticipants: 100,
    platforms: ["codeforces"],
  });
  const [problems, setProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("codeforces");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const searchTimeoutRef = useRef(null);

  const platforms = [
    { id: "codeforces", name: "Codeforces", color: "bg-blue-500" },
    { id: "leetcode", name: "LeetCode", color: "bg-orange-500" },
    { id: "codechef", name: "CodeChef", color: "bg-amber-600" },
  ];

  const difficulties = [
    { id: "easy", name: "Easy", color: "text-green-500" },
    { id: "medium", name: "Medium", color: "text-yellow-500" },
    { id: "hard", name: "Hard", color: "text-red-500" },
  ];

  const handleContestChange = (field, value) => {
    setContest((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const searchProblems = async (query, platform) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      // Get problems from API service
      let platformData;
      switch (platform) {
        case "codeforces":
          platformData = await apiServices.fetchCodeforcesProblems();
          break;
        case "leetcode":
          platformData = await apiServices.fetchLeetCodeProblems();
          break;
        case "codechef":
          platformData = await apiServices.fetchCodeChefProblems();
          break;
        default:
          platformData = { problems: [] };
      }

      // Filter problems based on search query
      const filtered = platformData.problems
        .filter((problem) => {
          const searchText = query.toLowerCase();
          const titleMatch = problem.title.toLowerCase().includes(searchText);
          const idMatch = problem.id
            .toString()
            .toLowerCase()
            .includes(searchText);
          const tagsMatch = problem.tags?.some((tag) =>
            tag.toLowerCase().includes(searchText),
          );

          return titleMatch || idMatch || tagsMatch;
        })
        .slice(0, 20); // Limit results

      setSearchResults(filtered);
    } catch (error) {
      console.error("Error searching problems:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchProblems(value, selectedPlatform);
    }, 500);
  };

  const addProblem = (problem) => {
    if (
      !problems.find(
        (p) => p.id === problem.id && p.platform === problem.platform,
      )
    ) {
      setProblems((prev) => [...prev, { ...problem, order: prev.length + 1 }]);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const removeProblem = (problemId, platform) => {
    setProblems((prev) =>
      prev
        .filter((p) => !(p.id === problemId && p.platform === platform))
        .map((p, index) => ({ ...p, order: index + 1 })),
    );
  };

  const reorderProblems = (fromIndex, toIndex) => {
    const newProblems = [...problems];
    const [movedProblem] = newProblems.splice(fromIndex, 1);
    newProblems.splice(toIndex, 0, movedProblem);

    // Update order numbers
    setProblems(newProblems.map((p, index) => ({ ...p, order: index + 1 })));
  };

  const getDifficultyFromRating = (rating) => {
    if (!rating) return "medium";
    if (rating < 1200) return "easy";
    if (rating < 1800) return "medium";
    return "hard";
  };

  const validateContest = () => {
    if (!contest.title.trim()) return "Contest title is required";
    if (problems.length === 0) return "At least one problem is required";
    if (!contest.startTime) return "Start time is required";
    return null;
  };

  const saveContest = (isDraft = true) => {
    const validation = validateContest();
    if (!isDraft && validation) {
      alert(validation);
      return;
    }

    const contestData = {
      ...contest,
      problems,
      createdAt: new Date().toISOString(),
      status: isDraft ? "draft" : "scheduled",
      id: Date.now(), // Simple ID generation
    };

    // Save to localStorage (in real app, this would be an API call)
    const savedContests = JSON.parse(
      localStorage.getItem("symmdiv2-contests") || "[]",
    );
    savedContests.push(contestData);
    localStorage.setItem("symmdiv2-contests", JSON.stringify(savedContests));

    if (isDraft) {
      alert("Contest saved as draft!");
    } else {
      alert("Contest created successfully!");
      navigate("/contests");
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Create Virtual Contest
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Set up a competitive programming contest with problems from
              multiple platforms
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {showPreview ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {showPreview ? "Hide Preview" : "Preview"}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contest Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <motion.div
              className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Contest Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contest Title *
                  </label>
                  <input
                    type="text"
                    value={contest.title}
                    onChange={(e) =>
                      handleContestChange("title", e.target.value)
                    }
                    placeholder="Enter contest title..."
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={contest.description}
                    onChange={(e) =>
                      handleContestChange("description", e.target.value)
                    }
                    placeholder="Describe your contest..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      value={contest.duration}
                      onChange={(e) =>
                        handleContestChange(
                          "duration",
                          parseInt(e.target.value),
                        )
                      }
                      min="30"
                      max="480"
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={contest.startTime}
                      onChange={(e) =>
                        handleContestChange("startTime", e.target.value)
                      }
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      value={contest.maxParticipants}
                      onChange={(e) =>
                        handleContestChange(
                          "maxParticipants",
                          parseInt(e.target.value),
                        )
                      }
                      min="1"
                      max="1000"
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contest Password (Optional)
                    </label>
                    <input
                      type="text"
                      value={contest.password}
                      onChange={(e) =>
                        handleContestChange("password", e.target.value)
                      }
                      placeholder="Leave empty for public contest"
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={contest.isPublic}
                    onChange={(e) =>
                      handleContestChange("isPublic", e.target.checked)
                    }
                    className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                  />
                  <label
                    htmlFor="isPublic"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Make contest public (visible in contest list)
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Problem Management */}
            <motion.div
              className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Problems ({problems.length})
              </h2>

              {/* Search Interface */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="Search by problem ID, title, or tags..."
                      className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    />
                  </div>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                  >
                    {platforms.map((platform) => (
                      <option key={platform.id} value={platform.id}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Results */}
                <AnimatePresence>
                  {searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
                    >
                      {searchResults.map((problem, index) => (
                        <motion.div
                          key={`${problem.platform}-${problem.id}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => addProblem(problem)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                                  {problem.id}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded ${
                                    difficulties.find(
                                      (d) =>
                                        d.id ===
                                        getDifficultyFromRating(problem.rating),
                                    )?.color || "text-gray-500"
                                  }`}
                                >
                                  {problem.rating || "N/A"}
                                </span>
                              </div>
                              <p className="font-medium text-gray-800 dark:text-white line-clamp-1">
                                {problem.title}
                              </p>
                              {problem.tags && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {problem.tags.slice(0, 3).map((tag) => (
                                    <span
                                      key={tag}
                                      className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Plus className="w-5 h-5 text-green-500" />
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {isSearching && (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Searching problems...
                    </p>
                  </div>
                )}
              </div>

              {/* Selected Problems */}
              <div className="space-y-3">
                <AnimatePresence>
                  {problems.map((problem, index) => (
                    <motion.div
                      key={`${problem.platform}-${problem.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                    >
                      <div className="text-lg font-bold text-gray-600 dark:text-gray-400 w-8">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`w-2 h-2 rounded-full ${platforms.find((p) => p.id === problem.platform)?.color}`}
                          ></span>
                          <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                            {problem.id}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              difficulties.find(
                                (d) =>
                                  d.id ===
                                  getDifficultyFromRating(problem.rating),
                              )?.color || "text-gray-500"
                            }`}
                          >
                            {problem.rating || "N/A"}
                          </span>
                        </div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {problem.title}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          removeProblem(problem.id, problem.platform)
                        }
                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {problems.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>
                      No problems added yet. Search and add problems to your
                      contest.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="sticky top-24"
                >
                  <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Contest Preview
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white">
                          {contest.title || "Untitled Contest"}
                        </h4>
                        {contest.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {contest.description}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            Duration:
                          </span>
                          <p className="font-medium">
                            {Math.floor(contest.duration / 60)}h{" "}
                            {contest.duration % 60}m
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            Problems:
                          </span>
                          <p className="font-medium">{problems.length}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            Max Participants:
                          </span>
                          <p className="font-medium">
                            {contest.maxParticipants}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            Visibility:
                          </span>
                          <p className="font-medium">
                            {contest.isPublic ? "Public" : "Private"}
                          </p>
                        </div>
                      </div>

                      {contest.startTime && (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            Start Time:
                          </span>
                          <p className="font-medium">
                            {new Date(contest.startTime).toLocaleString()}
                          </p>
                        </div>
                      )}

                      {problems.length > 0 && (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            Problem List:
                          </span>
                          <div className="mt-2 space-y-1">
                            {problems.map((problem, index) => (
                              <div
                                key={`${problem.platform}-${problem.id}`}
                                className="text-sm"
                              >
                                <span className="font-mono text-gray-600 dark:text-gray-400">
                                  {String.fromCharCode(65 + index)}.{" "}
                                  {problem.id}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex items-center justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <button
            onClick={() => navigate("/contests")}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => saveContest(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
          >
            <Save className="w-5 h-5" />
            Save Draft
          </button>
          <button
            onClick={() => saveContest(false)}
            disabled={
              !contest.title || problems.length === 0 || !contest.startTime
            }
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200"
          >
            <Trophy className="w-5 h-5" />
            Create Contest
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default CreateContestPage;
