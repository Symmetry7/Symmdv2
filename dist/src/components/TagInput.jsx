import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";

function TagInput() {
  const { state, dispatch } = useApp();
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const currentTags = state.platforms[state.currentPlatform].tags;
  const selectedTags = state.selectedTags;

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = currentTags
        .filter(
          (tag) =>
            tag.toLowerCase().includes(inputValue.toLowerCase()) &&
            !selectedTags.includes(tag),
        )
        .slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, currentTags, selectedTags]);

  const addTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      dispatch({
        type: "SET_SELECTED_TAGS",
        payload: [...selectedTags, tag],
      });
    }
    setInputValue("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTag = (tagToRemove) => {
    dispatch({
      type: "SET_SELECTED_TAGS",
      payload: selectedTags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (suggestions.length > 0) {
        addTag(suggestions[0]);
      }
    } else if (
      e.key === "Backspace" &&
      !inputValue &&
      selectedTags.length > 0
    ) {
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  };

  const clearAllTags = () => {
    dispatch({ type: "SET_SELECTED_TAGS", payload: [] });
  };

  return (
    <div className="space-y-4">
      {/* Selected Tags */}
      <AnimatePresence>
        {selectedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {selectedTags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium"
              >
                <span className="text-sm">{tag}</span>
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
            <motion.button
              onClick={clearAllTags}
              className="flex items-center gap-1 px-3 py-2 bg-red-500/80 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-3 h-3" />
              <span className="text-sm">Clear All</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Field */}
      <div className="relative">
        <div className="flex items-center gap-2 p-4 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all duration-200">
          <Plus className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type to add algorithm tags... (e.g., dp, graphs, math)"
            className="flex-1 bg-transparent outline-none placeholder-gray-400 text-gray-800 dark:text-white"
          />
          {inputValue && (
            <motion.button
              onClick={() => suggestions.length > 0 && addTag(suggestions[0])}
              className="px-3 py-1 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add
            </motion.button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto"
            >
              {suggestions.map((tag, index) => (
                <motion.button
                  key={tag}
                  onClick={() => addTag(tag)}
                  className="w-full px-4 py-3 text-left hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {tag.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-800 dark:text-white font-medium">
                      {tag}
                    </span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helper Text */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {selectedTags.length === 0
          ? "Start typing to add algorithm topics like 'dynamic programming', 'graphs', 'greedy'..."
          : `${selectedTags.length} tag${selectedTags.length !== 1 ? "s" : ""} selected. Keep typing to add more!`}
      </p>
    </div>
  );
}

export default TagInput;
