import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, Wifi, WifiOff } from "lucide-react";

function NotificationBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info"); // 'info', 'warning', 'success'

  useEffect(() => {
    // Check if we should show API status notification
    const hasShownNotification = sessionStorage.getItem(
      "api-notification-shown",
    );

    if (!hasShownNotification) {
      setMessage(
        "Using mock data for demonstration. Real API integration available in production.",
      );
      setType("info");
      setShowBanner(true);
      sessionStorage.setItem("api-notification-shown", "true");
    }
  }, []);

  const closeBanner = () => {
    setShowBanner(false);
  };

  const getIcon = () => {
    switch (type) {
      case "warning":
        return <WifiOff className="w-5 h-5" />;
      case "success":
        return <Wifi className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "warning":
        return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200";
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200";
      default:
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200";
    }
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-16 left-0 right-0 z-40 mx-4 mt-2 p-4 rounded-xl border backdrop-blur-md ${getStyles()}`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getIcon()}
              <p className="text-sm font-medium">{message}</p>
            </div>
            <button
              onClick={closeBanner}
              className="ml-4 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default NotificationBanner;
