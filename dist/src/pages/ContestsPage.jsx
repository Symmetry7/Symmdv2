import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trophy,
  Users,
  Clock,
  Calendar,
  Play,
  Settings,
  Code,
  Search,
  Filter,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

function ContestsPage() {
  const [activeTab, setActiveTab] = useState("my");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [contests, setContests] = useState({
    my: [],
    community: [],
    completed: [],
  });

  useEffect(() => {
    // Load user's contests from localStorage
    const savedContests = localStorage.getItem("symmdiv2-contests");
    const userContests = savedContests ? JSON.parse(savedContests) : [];

    // Mock contest data - focus on user-created contests
    setContests({
      my: [
        {
          id: "contest-1",
          title: "My Daily Practice",
          creator: "You",
          participants: 1,
          createdAt: "2024-01-15",
          duration: "2h",
          problems: 5,
          platforms: ["codeforces"],
          difficulty: "Medium",
          status: "draft",
          description: "Personal practice contest for graph problems",
        },
        {
          id: "contest-2",
          title: "Weekly DP Challenge",
          creator: "You",
          participants: 3,
          createdAt: "2024-01-14",
          duration: "3h",
          problems: 8,
          platforms: ["codeforces", "leetcode"],
          difficulty: "Hard",
          status: "active",
          description: "Dynamic programming focused contest",
        },
        ...userContests,
      ],
      community: [
        {
          id: "community-1",
          title: "Beginner Friendly Contest",
          creator: "CommunityModerator",
          participants: 45,
          createdAt: "2024-01-13",
          duration: "2h",
          problems: 6,
          platforms: ["leetcode"],
          difficulty: "Easy",
          status: "active",
          description: "Perfect for beginners to competitive programming",
        },
        {
          id: "community-2",
          title: "Math Problems Galore",
          creator: "MathExpert",
          participants: 67,
          createdAt: "2024-01-12",
          duration: "2.5h",
          problems: 7,
          platforms: ["codeforces", "codechef"],
          difficulty: "Medium",
          status: "active",
          description: "Mathematical problem solving contest",
        },
      ],
      completed: [
        {
          id: "completed-1",
          title: "Graph Theory Challenge",
          creator: "GraphGuru",
          participants: 156,
          completedAt: "2024-01-10",
          duration: "3h",
          problems: 6,
          platforms: ["codeforces", "codechef"],
          difficulty: "Hard",
          status: "completed",
          description: "Advanced graph algorithms and data structures",
          myRank: 23,
          totalParticipants: 156,
        },
      ],
    });
  }, []);

  const tabs = [
    { id: "my", label: "My Contests", count: contests.my.length },
    { id: "community", label: "Community", count: contests.community.length },
    { id: "completed", label: "Completed", count: contests.completed.length },
  ];

  const platformColors = {
    codeforces:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    leetcode:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    codechef:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  };

  const difficultyColors = {
    Easy: "text-green-500",
    Medium: "text-yellow-500",
    Hard: "text-orange-500",
    Expert: "text-red-500",
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "running":
        return <Play className="w-4 h-4 text-green-500" />;
      case "scheduled":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "finished":
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case "draft":
        return <Settings className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const filteredContests = contests[activeTab].filter((contest) => {
    const matchesSearch =
      contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contest.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform =
      filterPlatform === "all" || contest.platforms.includes(filterPlatform);
    return matchesSearch && matchesPlatform;
  });

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
              Virtual Contests
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and participate in competitive programming contests
            </p>
          </div>
          <Link to="/contests/create">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              Create Contest
            </motion.button>
          </Link>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contests by name or creator..."
                className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              >
                <option value="all">All Platforms</option>
                <option value="codeforces">Codeforces</option>
                <option value="leetcode">LeetCode</option>
                <option value="codechef">CodeChef</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      activeTab === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Contest List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {filteredContests.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No contests found
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  {activeTab === "my"
                    ? "Create your first contest to get started!"
                    : "Try adjusting your search or filters."}
                </p>
              </div>
            ) : (
              filteredContests.map((contest, index) => (
                <motion.div
                  key={contest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Contest Header */}
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusIcon(contest.status)}
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                          {contest.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${difficultyColors[contest.difficulty]}`}
                        >
                          {contest.difficulty}
                        </span>
                      </div>

                      {/* Contest Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Creator
                          </p>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {contest.creator}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Participants
                          </p>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <span className="font-medium text-gray-800 dark:text-white">
                              {contest.participants}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Duration
                          </p>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <span className="font-medium text-gray-800 dark:text-white">
                              {contest.duration}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Problems
                          </p>
                          <div className="flex items-center gap-1">
                            <Code className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <span className="font-medium text-gray-800 dark:text-white">
                              {contest.problems}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Platforms */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Platforms:
                        </span>
                        {contest.platforms.map((platform) => (
                          <span
                            key={platform}
                            className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${platformColors[platform]}`}
                          >
                            {platform}
                          </span>
                        ))}
                      </div>

                      {/* Time Info */}
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {contest.createdAt && (
                          <p>
                            📅 Created:{" "}
                            {new Date(contest.createdAt).toLocaleDateString()}
                          </p>
                        )}
                        {contest.completedAt && (
                          <p>
                            ✅ Completed:{" "}
                            {new Date(contest.completedAt).toLocaleDateString()}
                          </p>
                        )}
                        {contest.description && (
                          <p className="mt-2 text-gray-700 dark:text-gray-300">
                            {contest.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-6">
                      {contest.status === "active" && (
                        <Link to={`/contests/${contest.id}/participate`}>
                          <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors">
                            Start Contest
                          </button>
                        </Link>
                      )}
                      {contest.status === "draft" && activeTab === "my" && (
                        <div className="flex gap-2">
                          <Link to={`/contests/create?edit=${contest.id}`}>
                            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => {
                              // Start the contest
                              const updatedContests = { ...contests };
                              const contestIndex = updatedContests.my.findIndex(
                                (c) => c.id === contest.id,
                              );
                              if (contestIndex !== -1) {
                                updatedContests.my[contestIndex].status =
                                  "active";
                                setContests(updatedContests);
                              }
                            }}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                          >
                            Start
                          </button>
                        </div>
                      )}
                      {contest.status === "completed" && (
                        <div className="text-right">
                          {contest.myRank && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              Your rank: #{contest.myRank}/
                              {contest.totalParticipants}
                            </p>
                          )}
                          <button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
                            View Results
                          </button>
                        </div>
                      )}
                      {activeTab === "community" &&
                        contest.status === "active" && (
                          <Link to={`/contests/${contest.id}/participate`}>
                            <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors">
                              Join Contest
                            </button>
                          </Link>
                        )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ContestsPage;
