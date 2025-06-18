import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import NotificationBanner from "./components/NotificationBanner";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import ContestsPage from "./pages/ContestsPage";
import CreateContestPage from "./pages/CreateContestPage";
import ActiveContestPage from "./pages/ActiveContestPage";
import ProfilePage from "./pages/ProfilePage";
import CommunityPage from "./pages/CommunityPage";
import StatsPage from "./pages/StatsPage";
import BackgroundElements from "./components/BackgroundElements";
import { AppProvider } from "./context/AppContext";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem("symmdiv2-theme");
    if (saved) {
      setDarkMode(saved === "dark");
    } else {
      // Check system preference
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    // Check authentication status
    const savedUser = localStorage.getItem("symmdiv2-user");
    const hasOnboarded = localStorage.getItem("symmdiv2-onboarded");

    if (savedUser && hasOnboarded) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("symmdiv2-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("symmdiv2-user");
    localStorage.removeItem("symmdiv2-onboarded");
    localStorage.removeItem("symmdiv2-handles");
    setUser(null);
    setIsAuthenticated(false);
  };

  const isLoginRoute = location.pathname === "/login";
  const shouldShowNavbar = isAuthenticated && !isLoginRoute;

  // Debug logging for development
  useEffect(() => {
    console.log("Current route:", location.pathname);
    console.log("Is authenticated:", isAuthenticated);
    console.log("Should show navbar:", shouldShowNavbar);
  }, [location.pathname, isAuthenticated, shouldShowNavbar]);

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
          <Navbar
            darkMode={darkMode}
            toggleTheme={toggleTheme}
            user={user}
            onLogout={handleLogout}
          />
        )}
        {shouldShowNavbar && <NotificationBanner />}

        <main className="relative z-10">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Login Route */}
              <Route
                path="/login"
                element={
                  !isAuthenticated ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <LoginPage />
                    </motion.div>
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                }
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  isAuthenticated ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <DashboardPage />
                    </motion.div>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/generator"
                element={
                  isAuthenticated ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <HomePage />
                    </motion.div>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/contests"
                element={
                  isAuthenticated ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ContestsPage />
                    </motion.div>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/contests/create"
                element={
                  isAuthenticated ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CreateContestPage />
                    </motion.div>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/contests/:contestId/participate"
                element={
                  isAuthenticated ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ActiveContestPage />
                    </motion.div>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/profile"
                element={
                  isAuthenticated ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProfilePage />
                    </motion.div>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/community"
                element={
                  isAuthenticated ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CommunityPage />
                    </motion.div>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/stats"
                element={
                  isAuthenticated ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <StatsPage />
                    </motion.div>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* Default Route */}
              <Route
                path="/"
                element={
                  <Navigate
                    to={isAuthenticated ? "/dashboard" : "/login"}
                    replace
                  />
                }
              />

              {/* Catch-all route for 404s */}
              <Route
                path="*"
                element={
                  <Navigate
                    to={isAuthenticated ? "/dashboard" : "/login"}
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
