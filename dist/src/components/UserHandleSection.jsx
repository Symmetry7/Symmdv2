import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Search, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useApp } from "../context/AppContext";

function UserHandleSection() {
  const { state, dispatch } = useApp();
  const [handleInput, setHandleInput] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const checkHandle = async () => {
    if (!handleInput.trim()) {
      setStatus({ type: "error", message: "Please enter a handle" });
      return;
    }

    setLoading(true);
    setStatus({ type: "loading", message: "Checking handle..." });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock success response
      const solvedCount = Math.floor(Math.random() * 500) + 50;
      dispatch({ type: "SET_USER_HANDLE", payload: handleInput });
      setStatus({
        type: "success",
        message: `Handle "${handleInput}" loaded! ${solvedCount} problems solved`,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: "Handle not found or error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      checkHandle();
    }
  };

  const getStatusIcon = () => {
    switch (status.type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-success-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-error-500" />;
      case "loading":
        return <Loader className="w-4 h-4 text-primary-500 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="glass dark:glass-dark rounded-2xl p-6 border border-white/20 dark:border-gray-700/20">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-3 mb-3">
              <User className="w-6 h-6 text-primary-500" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Connect Your Profile
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your solved problems and get personalized recommendations
            </p>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your handle (optional)"
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>
            <motion.button
              onClick={checkHandle}
              disabled={loading || !handleInput.trim()}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </motion.button>
          </div>

          {status.message && (
            <motion.div
              className={`mt-3 p-3 rounded-lg flex items-center gap-2 text-sm ${
                status.type === "success"
                  ? "bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400"
                  : status.type === "error"
                    ? "bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400"
                    : "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {getStatusIcon()}
              <span>{status.message}</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default UserHandleSection;
