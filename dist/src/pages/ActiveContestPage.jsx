import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  Trophy,
  CheckCircle,
  ExternalLink,
  Flag,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

function ActiveContestPage() {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds
  const [submissions, setSubmissions] = useState({});
  const [showTags, setShowTags] = useState({});

  useEffect(() => {
    // Mock contest data - in real app, fetch from API/localStorage
    const mockContest = {
      id: contestId,
      title: "Weekly Practice Contest #15",
      creator: "CodeMaster",
      duration: "2h",
      problems: [
        {
          id: "A",
          title: "Theatre Square",
          platform: "codeforces",
          url: "https://codeforces.com/problem/1/A",
          rating: 1000,
          tags: ["math", "implementation"],
          solved: false,
          attempts: 0,
        },
        {
          id: "B",
          title: "Two Sum",
          platform: "leetcode",
          url: "https://leetcode.com/problems/two-sum/",
          difficulty: "Easy",
          tags: ["array", "hash-table"],
          solved: false,
          attempts: 0,
        },
        {
          id: "C",
          title: "Chef and Strings",
          platform: "codechef",
          url: "https://www.codechef.com/problems/CHEFSTR1",
          difficulty: "Easy",
          tags: ["basic", "implementation"],
          solved: false,
          attempts: 0,
        },
        {
          id: "D",
          title: "Binary Search",
          platform: "codeforces",
          url: "https://codeforces.com/problem/702/B",
          rating: 1200,
          tags: ["binary search", "data structures"],
          solved: false,
          attempts: 0,
        },
        {
          id: "E",
          title: "Longest Substring",
          platform: "leetcode",
          url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
          difficulty: "Medium",
          tags: ["string", "sliding-window"],
          solved: false,
          attempts: 0,
        },
      ],
    };

    setContest(mockContest);

    // Load saved progress
    const savedProgress = localStorage.getItem(`contest-${contestId}-progress`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setSubmissions(progress.submissions || {});
      setCurrentProblem(progress.currentProblem || 0);
      setTimeLeft(progress.timeLeft || 7200);
    }
  }, [contestId]);

  useEffect(() => {
    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          // Contest ended - redirect to results
          navigate(`/contests/${contestId}/results`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [contestId, navigate]);

  useEffect(() => {
    // Save progress
    if (contest) {
      const progress = {
        submissions,
        currentProblem,
        timeLeft,
        lastUpdate: Date.now(),
      };
      localStorage.setItem(
        `contest-${contestId}-progress`,
        JSON.stringify(progress),
      );
    }
  }, [contestId, submissions, currentProblem, timeLeft, contest]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = (problemId, problemUrl) => {
    // Redirect to the platform's submit page
    window.open(problemUrl, "_blank");

    // Mark as attempted
    setSubmissions((prev) => ({
      ...prev,
      [problemId]: {
        ...prev[problemId],
        attempts: (prev[problemId]?.attempts || 0) + 1,
        lastAttempt: Date.now(),
      },
    }));
  };

  const markAsSolved = (problemId) => {
    setSubmissions((prev) => ({
      ...prev,
      [problemId]: {
        ...prev[problemId],
        solved: true,
        solvedAt: Date.now(),
      },
    }));
  };

  const toggleTags = (problemId) => {
    setShowTags((prev) => ({
      ...prev,
      [problemId]: !prev[problemId],
    }));
  };

  const getPlatformColor = (platform) => {
    const colors = {
      codeforces:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      leetcode:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      codechef:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    };
    return (
      colors[platform] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    );
  };

  const getDifficultyColor = (difficulty, rating) => {
    if (rating) {
      if (rating <= 1000) return "text-green-500";
      if (rating <= 1400) return "text-yellow-500";
      if (rating <= 1800) return "text-orange-500";
      return "text-red-500";
    }

    const colors = {
      Easy: "text-green-500",
      Medium: "text-yellow-500",
      Hard: "text-red-500",
    };
    return colors[difficulty] || "text-gray-500";
  };

  if (!contest) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading contest...</p>
        </div>
      </div>
    );
  }

  const solvedCount = Object.values(submissions).filter(
    (sub) => sub?.solved,
  ).length;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/contests")}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                    {contest.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Created by {contest.creator} • {contest.problems.length}{" "}
                    problems
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-primary-500" />
                  <span className="text-2xl font-mono font-bold text-primary-500">
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {solvedCount}/{contest.problems.length} solved
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Problem List Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                Problems
              </h3>
              <div className="space-y-3">
                {contest.problems.map((problem, index) => (
                  <button
                    key={problem.id}
                    onClick={() => setCurrentProblem(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      index === currentProblem
                        ? "bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-500"
                        : "bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-lg">{problem.id}</span>
                      {submissions[problem.id]?.solved && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white mb-1">
                      {problem.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded capitalize ${getPlatformColor(problem.platform)}`}
                      >
                        {problem.platform}
                      </span>
                      {submissions[problem.id]?.attempts > 0 && (
                        <span className="text-xs text-gray-500">
                          {submissions[problem.id].attempts} attempts
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Current Problem */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProblem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-8"
              >
                {contest.problems[currentProblem] && (
                  <>
                    {/* Problem Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                            {contest.problems[currentProblem].id}.{" "}
                            {contest.problems[currentProblem].title}
                          </h2>
                          {submissions[contest.problems[currentProblem].id]
                            ?.solved && (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          )}
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <span
                            className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${getPlatformColor(contest.problems[currentProblem].platform)}`}
                          >
                            {contest.problems[currentProblem].platform}
                          </span>

                          {contest.problems[currentProblem].rating && (
                            <span
                              className={`font-bold ${getDifficultyColor(null, contest.problems[currentProblem].rating)}`}
                            >
                              {contest.problems[currentProblem].rating}
                            </span>
                          )}

                          {contest.problems[currentProblem].difficulty && (
                            <span
                              className={`font-bold ${getDifficultyColor(contest.problems[currentProblem].difficulty)}`}
                            >
                              {contest.problems[currentProblem].difficulty}
                            </span>
                          )}

                          {submissions[contest.problems[currentProblem].id]
                            ?.attempts > 0 && (
                            <span className="text-sm text-gray-500">
                              {
                                submissions[contest.problems[currentProblem].id]
                                  .attempts
                              }{" "}
                              attempts
                            </span>
                          )}
                        </div>

                        {/* Tags */}
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Tags:
                            </span>
                            <button
                              onClick={() =>
                                toggleTags(contest.problems[currentProblem].id)
                              }
                              className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 transition-colors"
                            >
                              {showTags[contest.problems[currentProblem].id] ? (
                                <>
                                  <EyeOff className="w-4 h-4" />
                                  Hide
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4" />
                                  Show
                                </>
                              )}
                            </button>
                          </div>

                          {showTags[contest.problems[currentProblem].id] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex flex-wrap gap-2"
                            >
                              {contest.problems[currentProblem].tags.map(
                                (tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 text-primary-700 dark:text-primary-300 rounded-md text-xs font-medium"
                                  >
                                    {tag}
                                  </span>
                                ),
                              )}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Problem Actions */}
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() =>
                          handleSubmit(
                            contest.problems[currentProblem].id,
                            contest.problems[currentProblem].url,
                          )
                        }
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-lg font-medium transition-all duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Submit Solution
                      </button>

                      <button
                        onClick={() =>
                          markAsSolved(contest.problems[currentProblem].id)
                        }
                        disabled={
                          submissions[contest.problems[currentProblem].id]
                            ?.solved
                        }
                        className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                      >
                        <Flag className="w-4 h-4" />
                        Mark as Solved
                      </button>

                      <a
                        href={contest.problems[currentProblem].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Problem
                      </a>
                    </div>

                    {/* Problem Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() =>
                          setCurrentProblem(Math.max(0, currentProblem - 1))
                        }
                        disabled={currentProblem === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                      >
                        ← Previous
                      </button>

                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {currentProblem + 1} of {contest.problems.length}
                      </span>

                      <button
                        onClick={() =>
                          setCurrentProblem(
                            Math.min(
                              contest.problems.length - 1,
                              currentProblem + 1,
                            ),
                          )
                        }
                        disabled={
                          currentProblem === contest.problems.length - 1
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                      >
                        Next →
                      </button>
                    </div>

                    {/* Contest Instructions */}
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-800 dark:text-yellow-200">
                          <p className="font-medium mb-1">
                            Contest Instructions:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>
                              Click "Submit Solution" to open the problem on the
                              original platform
                            </li>
                            <li>
                              Solve the problem on the platform and submit your
                              code
                            </li>
                            <li>
                              Return here and click "Mark as Solved" when you
                              successfully submit
                            </li>
                            <li>Your progress is automatically saved</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ActiveContestPage;
