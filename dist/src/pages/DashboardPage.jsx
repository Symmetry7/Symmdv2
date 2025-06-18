import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  TrendingUp,
  Target,
  Trophy,
  Clock,
  Plus,
  Code,
  Users,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

function DashboardPage() {
  const { state } = useApp();
  const [userHandles, setUserHandles] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingContests, setUpcomingContests] = useState([]);

  useEffect(() => {
    // Load user handles from localStorage
    const savedHandles = localStorage.getItem("symmdiv2-handles");
    if (savedHandles) {
      setUserHandles(JSON.parse(savedHandles));
    }

    // Load actual recent activity from localStorage
    const savedActivity = localStorage.getItem("symmdiv2-activity");
    if (savedActivity) {
      setRecentActivity(JSON.parse(savedActivity));
    } else {
      // Show sample activity for new users
      setRecentActivity([
        {
          type: "contest_created",
          name: "Welcome Contest",
          participants: 1,
          time: "Just now",
        },
      ]);
    }

    // Load user's contests as upcoming activities
    const savedContests = localStorage.getItem("symmdiv2-contests");
    if (savedContests) {
      const userContests = JSON.parse(savedContests);
      const activeContests = userContests.filter(
        (contest) => contest.status === "active" || contest.status === "draft",
      );
      setUpcomingContests(
        activeContests.map((contest) => ({
          name: contest.title,
          platform: "custom",
          time: contest.status === "active" ? "Ready to start" : "Draft",
          duration: contest.duration,
        })),
      );
    } else {
      setUpcomingContests([]);
    }
  }, []);

  const quickActions = [
    {
      title: "Generate Problem",
      description: "Get a random problem based on your preferences",
      icon: Code,
      color: "from-blue-500 to-blue-600",
      link: "/generator",
    },
    {
      title: "Create Contest",
      description: "Set up a virtual contest for you and your friends",
      icon: Trophy,
      color: "from-purple-500 to-purple-600",
      link: "/contests/create",
    },
    {
      title: "Join Contest",
      description: "Participate in ongoing virtual contests",
      icon: Users,
      color: "from-green-500 to-green-600",
      link: "/contests",
    },
    {
      title: "View Stats",
      description: "Track your progress and performance",
      icon: BarChart3,
      color: "from-orange-500 to-orange-600",
      link: "/stats",
    },
  ];

  const statsCards = [
    {
      title: "Contests Created",
      value: (() => {
        const saved = localStorage.getItem("symmdiv2-contests");
        return saved ? JSON.parse(saved).length : 0;
      })(),
      icon: Trophy,
      color: "text-purple-500",
      change: "Total created",
    },
    {
      title: "Active Contests",
      value: (() => {
        const saved = localStorage.getItem("symmdiv2-contests");
        if (!saved) return 0;
        return JSON.parse(saved).filter((c) => c.status === "active").length;
      })(),
      icon: Target,
      color: "text-green-500",
      change: "Ready to start",
    },
    {
      title: "Connected Platforms",
      value: Object.keys(userHandles).length,
      icon: TrendingUp,
      color: "text-blue-500",
      change: "Platforms linked",
    },
    {
      title: "Days Active",
      value: (() => {
        const joined = localStorage.getItem("symmdiv2-joined-date");
        if (!joined) {
          localStorage.setItem(
            "symmdiv2-joined-date",
            new Date().toISOString(),
          );
          return 1;
        }
        const daysDiff = Math.floor(
          (new Date() - new Date(joined)) / (1000 * 60 * 60 * 24),
        );
        return Math.max(1, daysDiff);
      })(),
      icon: Clock,
      color: "text-orange-500",
      change: "Since joining",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                  Welcome back! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Ready to level up your competitive programming skills today?
                </p>
                {Object.keys(userHandles).length > 0 && (
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Connected accounts:
                    </span>
                    {Object.entries(userHandles).map(([platform, handle]) => (
                      <span
                        key={platform}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium capitalize"
                      >
                        {platform}: {handle}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <Zap className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                >
                  <Link to={action.link}>
                    <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Your Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                  className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.change}
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity & Upcoming Contests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {activity.type === "problem_solved"
                        ? "Solved: "
                        : "Created: "}
                      {activity.problem || activity.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {activity.platform && `${activity.platform} • `}
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-primary-500 hover:text-primary-600 font-medium">
              View All Activity
            </button>
          </motion.div>

          {/* Upcoming Contests */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
              Upcoming Contests
            </h3>
            <div className="space-y-4">
              {upcomingContests.map((contest, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {contest.name}
                    </h4>
                    <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded capitalize">
                      {contest.platform}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {contest.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {contest.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/contests">
              <button className="w-full mt-4 py-2 text-sm text-primary-500 hover:text-primary-600 font-medium">
                View All Contests
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
