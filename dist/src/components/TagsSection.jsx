import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tags, ArrowUp, ArrowDown, X, RotateCcw } from "lucide-react";
import { useApp } from "../context/AppContext";

function TagsSection() {
  const { state, dispatch } = useApp();
  const [draggedTag, setDraggedTag] = useState(null);

  const currentTags = state.platforms[state.currentPlatform].tags;
  const selectedTags = state.selectedTags;
  const tagOrder = state.tagOrder;

  // Sort tags by order (higher numbers first), then alphabetically
  const sortedTags = [...currentTags].sort((a, b) => {
    const orderA = tagOrder[a] || 0;
    const orderB = tagOrder[b] || 0;
    if (orderA !== orderB) return orderB - orderA;
    return a.localeCompare(b);
  });

  const toggleTag = (tag) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    dispatch({ type: "SET_SELECTED_TAGS", payload: newSelectedTags });
  };

  const adjustTagOrder = (tag, direction) => {
    const currentOrder = tagOrder[tag] || 0;
    const newOrder =
      direction === "up" ? currentOrder + 1 : Math.max(0, currentOrder - 1);

    dispatch({
      type: "SET_TAG_ORDER",
      payload: { [tag]: newOrder },
    });
  };

  const clearAllTags = () => {
    dispatch({ type: "SET_SELECTED_TAGS", payload: [] });
  };

  const resetTagOrder = () => {
    dispatch({ type: "SET_TAG_ORDER", payload: {} });
  };

  const getTagPriorityColor = (tag) => {
    const order = tagOrder[tag] || 0;
    if (order === 0) return "";
    if (order <= 2) return "ring-2 ring-yellow-400";
    if (order <= 4) return "ring-2 ring-orange-400";
    return "ring-2 ring-red-400";
  };

  const getTagPriorityText = (tag) => {
    const order = tagOrder[tag] || 0;
    if (order === 0) return "";
    if (order <= 2) return "Low Priority";
    if (order <= 4) return "Medium Priority";
    return "High Priority";
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent-500/10 to-primary-500/10 border-b border-white/20 dark:border-gray-700/20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tags className="w-6 h-6 text-accent-500" />
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Algorithm Tags & Topics
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Select topics and adjust priority with ↑/↓ buttons
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {selectedTags.length > 0 && (
                <span className="px-3 py-1 bg-primary-500 text-white rounded-lg text-sm font-medium">
                  {selectedTags.length} selected
                </span>
              )}
              <motion.button
                onClick={resetTagOrder}
                className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-4 h-4" />
                Reset Order
              </motion.button>
              <motion.button
                onClick={clearAllTags}
                className="flex items-center gap-2 px-3 py-2 bg-error-500 text-white rounded-lg text-sm font-medium hover:bg-error-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-4 h-4" />
                Clear All
              </motion.button>
            </div>
          </div>
        </div>

        {/* Tags Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {sortedTags.map((tag, index) => {
                const isSelected = selectedTags.includes(tag);
                const order = tagOrder[tag] || 0;
                const priorityColor = getTagPriorityColor(tag);
                const priorityText = getTagPriorityText(tag);

                return (
                  <motion.div
                    key={tag}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.02,
                      layout: { duration: 0.3 },
                    }}
                    className={`group relative ${priorityColor}`}
                  >
                    <div
                      className={`relative p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white border-primary-400 shadow-lg"
                          : "bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-300/50 dark:border-gray-600/50 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {/* Priority indicator */}
                      {order > 0 && (
                        <div
                          className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                            order <= 2
                              ? "bg-yellow-500"
                              : order <= 4
                                ? "bg-orange-500"
                                : "bg-red-500"
                          }`}
                        >
                          {order}
                        </div>
                      )}

                      <div className="text-sm font-medium mb-2">{tag}</div>

                      {/* Priority controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              adjustTagOrder(tag, "up");
                            }}
                            className={`p-1 rounded transition-colors ${
                              isSelected
                                ? "hover:bg-white/20"
                                : "hover:bg-primary-100 dark:hover:bg-primary-800"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ArrowUp className="w-3 h-3" />
                          </motion.button>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              adjustTagOrder(tag, "down");
                            }}
                            className={`p-1 rounded transition-colors ${
                              isSelected
                                ? "hover:bg-white/20"
                                : "hover:bg-primary-100 dark:hover:bg-primary-800"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ArrowDown className="w-3 h-3" />
                          </motion.button>
                        </div>

                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-white rounded-full"
                          />
                        )}
                      </div>

                      {/* Priority text tooltip */}
                      {priorityText && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          {priorityText}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {selectedTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800"
            >
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-primary-700 dark:text-primary-300">
                  Selected Tags ({selectedTags.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary-500 text-white rounded text-xs font-medium"
                    >
                      {tag}
                      {tagOrder[tag] > 0 && (
                        <span className="ml-1 opacity-75">
                          ({tagOrder[tag]})
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default TagsSection;
