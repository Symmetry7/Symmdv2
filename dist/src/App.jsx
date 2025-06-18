import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import NotificationBanner from "./components/NotificationBanner";
import HomePage from "./pages/HomePage";
import PracticePage from "./pages/PracticePage";
import StatsPage from "./pages/StatsPage";
import BackgroundElements from "./components/BackgroundElements";
import { AppProvider } from "./context/AppContext";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("symmdiv2-theme");
    if (saved) {
      setDarkMode(saved === "dark");
    } else {
      // Check system preference
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("symmdiv2-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <AppProvider>
      <div
        className={`min-h-screen transition-all duration-500 ${
          darkMode
            ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
            : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"
        }`}
      >
        <BackgroundElements />
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
        <NotificationBanner />

        <main className="relative z-10">
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <HomePage />
                  </motion.div>
                }
              />
              <Route
                path="/practice"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PracticePage />
                  </motion.div>
                }
              />
              <Route
                path="/stats"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <StatsPage />
                  </motion.div>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
