import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  MessageCircle,
  Search,
  Filter,
  Trophy,
  Target,
  Check,
  X,
  Globe,
  Github,
  Linkedin,
  Star,
} from "lucide-react";

function CommunityPage() {
  const [activeTab, setActiveTab] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    // Load community data
    const savedFriends = localStorage.getItem("symmdiv2-friends");
    const savedRequests = localStorage.getItem("symmdiv2-friend-requests");

    if (savedFriends) {
      setFriends(JSON.parse(savedFriends));
    }

    if (savedRequests) {
      setFriendRequests(JSON.parse(savedRequests));
    }

    // Mock community data
    setAllUsers([
      {
        id: "user1",
        displayName: "CodeMaster",
        email: "codemaster@example.com",
        photoURL:
          "https://ui-avatars.com/api/?name=CodeMaster&background=3b82f6&color=fff",
        bio: "Competitive programmer with 5+ years of experience",
        handles: { codeforces: "codemaster", leetcode: "codemaster123" },
        socialLinks: { github: "https://github.com/codemaster" },
        stats: { contestsWon: 15, problemsSolved: 1250, rating: 2100 },
        isOnline: true,
        lastSeen: null,
      },
      {
        id: "user2",
        displayName: "AlgoExpert",
        email: "algo@example.com",
        photoURL:
          "https://ui-avatars.com/api/?name=AlgoExpert&background=10b981&color=fff",
        bio: "Algorithm enthusiast and contest creator",
        handles: { codeforces: "algoexpert", codechef: "algo_expert" },
        socialLinks: { linkedin: "https://linkedin.com/in/algoexpert" },
        stats: { contestsWon: 8, problemsSolved: 890, rating: 1850 },
        isOnline: false,
        lastSeen: "2 hours ago",
      },
      {
        id: "user3",
        displayName: "DebugNinja",
        email: "debug@example.com",
        photoURL:
          "https://ui-avatars.com/api/?name=DebugNinja&background=f59e0b&color=fff",
        bio: "Debugging problems faster than creating them",
        handles: { leetcode: "debugninja", codechef: "debug_ninja" },
        socialLinks: {
          github: "https://github.com/debugninja",
          website: "https://debugninja.dev",
        },
        stats: { contestsWon: 12, problemsSolved: 675, rating: 1920 },
        isOnline: true,
        lastSeen: null,
      },
      {
        id: "user4",
        displayName: "DataStructurePro",
        email: "dspro@example.com",
        photoURL:
          "https://ui-avatars.com/api/?name=DataStructurePro&background=8b5cf6&color=fff",
        bio: "Specializing in advanced data structures and algorithms",
        handles: { codeforces: "dspro", leetcode: "datastructurepro" },
        stats: { contestsWon: 20, problemsSolved: 1500, rating: 2350 },
        isOnline: false,
        lastSeen: "1 day ago",
      },
    ]);

    // Set suggestions (users not yet friends)
    setSuggestions([
      {
        id: "user1",
        displayName: "CodeMaster",
        photoURL:
          "https://ui-avatars.com/api/?name=CodeMaster&background=3b82f6&color=fff",
        bio: "Competitive programmer with 5+ years of experience",
        mutualFriends: 3,
        rating: 2100,
      },
      {
        id: "user2",
        displayName: "AlgoExpert",
        photoURL:
          "https://ui-avatars.com/api/?name=AlgoExpert&background=10b981&color=fff",
        bio: "Algorithm enthusiast and contest creator",
        mutualFriends: 1,
        rating: 1850,
      },
    ]);
  }, []);

  const tabs = [
    { id: "friends", label: "Friends", count: friends.length },
    { id: "requests", label: "Requests", count: friendRequests.length },
    { id: "discover", label: "Discover", count: suggestions.length },
    { id: "leaderboard", label: "Leaderboard", count: allUsers.length },
  ];

  const sendFriendRequest = (userId) => {
    const newRequest = {
      id: `req_${Date.now()}`,
      fromUserId: "current_user",
      toUserId: userId,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const updatedRequests = [...friendRequests, newRequest];
    setFriendRequests(updatedRequests);
    localStorage.setItem(
      "symmdiv2-friend-requests",
      JSON.stringify(updatedRequests),
    );

    // Remove from suggestions
    setSuggestions((prev) => prev.filter((user) => user.id !== userId));
  };

  const acceptFriendRequest = (requestId) => {
    const request = friendRequests.find((req) => req.id === requestId);
    if (request) {
      const newFriend = allUsers.find((user) => user.id === request.fromUserId);
      if (newFriend) {
        const updatedFriends = [
          ...friends,
          { ...newFriend, friendsSince: new Date().toISOString() },
        ];
        setFriends(updatedFriends);
        localStorage.setItem(
          "symmdiv2-friends",
          JSON.stringify(updatedFriends),
        );
      }

      const updatedRequests = friendRequests.filter(
        (req) => req.id !== requestId,
      );
      setFriendRequests(updatedRequests);
      localStorage.setItem(
        "symmdiv2-friend-requests",
        JSON.stringify(updatedRequests),
      );
    }
  };

  const rejectFriendRequest = (requestId) => {
    const updatedRequests = friendRequests.filter(
      (req) => req.id !== requestId,
    );
    setFriendRequests(updatedRequests);
    localStorage.setItem(
      "symmdiv2-friend-requests",
      JSON.stringify(updatedRequests),
    );
  };

  const filteredData = () => {
    const query = searchQuery.toLowerCase();
    switch (activeTab) {
      case "friends":
        return friends.filter(
          (friend) =>
            friend.displayName.toLowerCase().includes(query) ||
            friend.email.toLowerCase().includes(query),
        );
      case "discover":
        return suggestions.filter((user) =>
          user.displayName.toLowerCase().includes(query),
        );
      case "leaderboard":
        return allUsers
          .filter((user) => user.displayName.toLowerCase().includes(query))
          .sort((a, b) => (b.stats?.rating || 0) - (a.stats?.rating || 0));
      default:
        return [];
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 2400) return "text-red-500";
    if (rating >= 2100) return "text-orange-500";
    if (rating >= 1900) return "text-purple-500";
    if (rating >= 1600) return "text-blue-500";
    if (rating >= 1400) return "text-green-500";
    return "text-gray-500";
  };

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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Community
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with fellow competitive programmers
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
            />
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

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Friends Tab */}
            {activeTab === "friends" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData().map((friend) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <img
                          src={friend.photoURL}
                          alt={friend.displayName}
                          className="w-12 h-12 rounded-full"
                        />
                        {friend.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {friend.displayName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {friend.isOnline
                            ? "Online"
                            : `Last seen ${friend.lastSeen}`}
                        </p>
                      </div>
                    </div>

                    {friend.bio && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {friend.bio}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </button>
                      <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
                        View Profile
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Friend Requests Tab */}
            {activeTab === "requests" && (
              <div className="space-y-4">
                {friendRequests.map((request) => {
                  const user = allUsers.find(
                    (u) => u.id === request.fromUserId,
                  );
                  if (!user) return null;

                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">
                              {user.displayName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Wants to be your friend
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => acceptFriendRequest(request.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => rejectFriendRequest(request.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Decline
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {friendRequests.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      No friend requests
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500">
                      You're all caught up!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Discover Tab */}
            {activeTab === "discover" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData().map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {user.displayName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.mutualFriends} mutual friends
                        </p>
                      </div>
                      <div
                        className={`text-right ${getRatingColor(user.rating)}`}
                      >
                        <p className="font-bold">{user.rating}</p>
                        <p className="text-xs">Rating</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {user.bio}
                    </p>

                    <button
                      onClick={() => sendFriendRequest(user.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      Add Friend
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === "leaderboard" && (
              <div className="space-y-4">
                {filteredData().map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6"
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                                ? "bg-gray-400"
                                : index === 2
                                  ? "bg-amber-600"
                                  : "bg-gray-500"
                          }`}
                        >
                          {index < 3 ? <Star className="w-4 h-4" /> : index + 1}
                        </div>

                        <div className="relative">
                          <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="w-12 h-12 rounded-full"
                          />
                          {user.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-white">
                            {user.displayName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.bio}
                          </p>
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p
                            className={`font-bold ${getRatingColor(user.stats?.rating)}`}
                          >
                            {user.stats?.rating || 0}
                          </p>
                          <p className="text-xs text-gray-500">Rating</p>
                        </div>
                        <div>
                          <p className="font-bold text-green-500">
                            {user.stats?.problemsSolved || 0}
                          </p>
                          <p className="text-xs text-gray-500">Problems</p>
                        </div>
                        <div>
                          <p className="font-bold text-purple-500">
                            {user.stats?.contestsWon || 0}
                          </p>
                          <p className="text-xs text-gray-500">Contests Won</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {user.socialLinks?.github && (
                          <a
                            href={user.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {user.socialLinks?.linkedin && (
                          <a
                            href={user.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {user.socialLinks?.website && (
                          <a
                            href={user.socialLinks.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Globe className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CommunityPage;
