import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

function LoadingSpinner({ message = "Loading amazing problems..." }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner ring */}
        <motion.div
          className="absolute inset-2 w-12 h-12 border-4 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />

        {/* Center dot */}
        <motion.div
          className="absolute inset-6 w-4 h-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.p
        className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-400 text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {message}
      </motion.p>

      <div className="loading-dots mt-2">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </motion.div>
  );
}

export default LoadingSpinner;
