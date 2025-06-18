import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  Users,
  Minimize2,
  Maximize2,
  Smile,
  Paperclip,
  MoreVertical,
} from "lucide-react";

function ChatComponent({ contestId, isVisible, onToggle }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("symmdiv2-user") || "{}");

  useEffect(() => {
    // Load chat messages for this contest
    const savedMessages = localStorage.getItem(`chat-${contestId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    // Mock participants data
    setParticipants([
      {
        id: "current_user",
        displayName: currentUser.displayName || "You",
        photoURL:
          currentUser.photoURL ||
          "https://ui-avatars.com/api/?name=You&background=6366f1&color=fff",
        isOnline: true,
      },
      {
        id: "user1",
        displayName: "CodeMaster",
        photoURL:
          "https://ui-avatars.com/api/?name=CodeMaster&background=3b82f6&color=fff",
        isOnline: true,
      },
      {
        id: "user2",
        displayName: "AlgoExpert",
        photoURL:
          "https://ui-avatars.com/api/?name=AlgoExpert&background=10b981&color=fff",
        isOnline: false,
      },
    ]);

    // Load existing messages or create welcome message
    if (!savedMessages) {
      const welcomeMessage = {
        id: "welcome",
        userId: "system",
        displayName: "Contest Bot",
        photoURL:
          "https://ui-avatars.com/api/?name=Bot&background=8b5cf6&color=fff",
        message: "Welcome to the contest! Good luck to all participants! 🚀",
        timestamp: Date.now(),
        type: "system",
      };
      setMessages([welcomeMessage]);
    }
  }, [contestId]);

  useEffect(() => {
    // Save messages to localStorage
    if (messages.length > 0) {
      localStorage.setItem(`chat-${contestId}`, JSON.stringify(messages));
    }
  }, [messages, contestId]);

  useEffect(() => {
    // Auto scroll to bottom
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: `msg_${Date.now()}`,
      userId: "current_user",
      displayName: currentUser.displayName || "You",
      photoURL:
        currentUser.photoURL ||
        "https://ui-avatars.com/api/?name=You&background=6366f1&color=fff",
      message: newMessage.trim(),
      timestamp: Date.now(),
      type: "user",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Mock response from other user (for demo)
    if (Math.random() > 0.7) {
      setTimeout(
        () => {
          const responses = [
            "Good luck!",
            "This problem is tricky!",
            "Anyone solved problem B yet?",
            "Great contest so far!",
            "Need a hint on problem A",
            "Time's running out! 😅",
          ];

          const mockResponse = {
            id: `msg_${Date.now() + 1}`,
            userId: "user1",
            displayName: "CodeMaster",
            photoURL:
              "https://ui-avatars.com/api/?name=CodeMaster&background=3b82f6&color=fff",
            message: responses[Math.floor(Math.random() * responses.length)],
            timestamp: Date.now() + 1000,
            type: "user",
          };

          setMessages((prev) => [...prev, mockResponse]);
        },
        2000 + Math.random() * 3000,
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-4 bottom-4 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
    >
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5" />
            <div>
              <h3 className="font-semibold">Contest Chat</h3>
              <p className="text-xs opacity-90">
                {participants.length} participants
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 400 }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            {/* Participants List */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Online
                </span>
              </div>
              <div className="flex gap-2">
                {participants.map((participant) => (
                  <div key={participant.id} className="relative">
                    <img
                      src={participant.photoURL}
                      alt={participant.displayName}
                      className="w-8 h-8 rounded-full"
                      title={participant.displayName}
                    />
                    {participant.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.userId === "current_user" ? "flex-row-reverse" : ""}`}
                >
                  <img
                    src={message.photoURL}
                    alt={message.displayName}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />

                  <div
                    className={`flex-1 ${message.userId === "current_user" ? "text-right" : ""}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-medium ${
                          message.type === "system"
                            ? "text-purple-500"
                            : message.userId === "current_user"
                              ? "text-primary-500"
                              : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {message.displayName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>

                    <div
                      className={`inline-block px-3 py-2 rounded-lg text-sm ${
                        message.type === "system"
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
                          : message.userId === "current_user"
                            ? "bg-primary-500 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {message.message}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-3 py-2 pr-10 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <Smile className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <button className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  Contest rules apply to chat
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ChatComponent;
