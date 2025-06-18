import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import NotificationBanner from "./components/NotificationBanner";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import ContestsPage from "./pages/ContestsPage";
import CreateContestPage from "./pages/CreateContestPage";
import StatsPage from "./pages/StatsPage";
import BackgroundElements from "./components/BackgroundElements";
import { AppProvider } from "./context/AppContext";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem("symmdiv2-theme");
    if (saved) {
      setDarkMode(saved === "dark");
    } else {
      // Check system preference
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    // Check if user has completed onboarding
    const savedHandles = localStorage.getItem("symmdiv2-handles");
    const hasOnboarded = localStorage.getItem("symmdiv2-onboarded");
    setHasCompletedOnboarding(!!savedHandles || !!hasOnboarded);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("symmdiv2-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const isOnboardingRoute = location.pathname === "/onboarding";
  const shouldShowNavbar = hasCompletedOnboarding && !isOnboardingRoute;

  // Debug logging for development
  useEffect(() => {
    console.log("Current route:", location.pathname);
    console.log("Has completed onboarding:", hasCompletedOnboarding);
    console.log("Should show navbar:", shouldShowNavbar);
  }, [location.pathname, hasCompletedOnboarding, shouldShowNavbar]);

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
        {shouldShowNavbar && (
          <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
        )}
        {shouldShowNavbar && <NotificationBanner />}

        <main className="relative z-10">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Onboarding Route */}
              <Route
                path="/onboarding"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <OnboardingPage />
                  </motion.div>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  hasCompletedOnboarding ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <DashboardPage />
                    </motion.div>
                  ) : (
                    <Navigate to="/onboarding" replace />
                  )
                }
              />

              <Route
                path="/generator"
                element={
                  hasCompletedOnboarding ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <HomePage />
                    </motion.div>
                  ) : (
                    <Navigate to="/onboarding" replace />
                  )
                }
              />

              <Route
                path="/contests"
                element={
                  hasCompletedOnboarding ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ContestsPage />
                    </motion.div>
                  ) : (
                    <Navigate to="/onboarding" replace />
                  )
                }
              />

              <Route
                path="/contests/create"
                element={
                  hasCompletedOnboarding ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CreateContestPage />
                    </motion.div>
                  ) : (
                    <Navigate to="/onboarding" replace />
                  )
                }
              />

              <Route
                path="/stats"
                element={
                  hasCompletedOnboarding ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <StatsPage />
                    </motion.div>
                  ) : (
                    <Navigate to="/onboarding" replace />
                  )
                }
              />

              {/* Default Route */}
              <Route
                path="/"
                element={
                  <Navigate
                    to={hasCompletedOnboarding ? "/dashboard" : "/onboarding"}
                    replace
                  />
                }
              />

              {/* Catch-all route for 404s */}
              <Route
                path="*"
                element={
                  <Navigate
                    to={hasCompletedOnboarding ? "/dashboard" : "/onboarding"}
                    replace
                  />
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
