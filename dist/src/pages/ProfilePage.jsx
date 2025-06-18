import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Edit,
  Save,
  Camera,
  Globe,
  Github,
  Linkedin,
  Trophy,
  Target,
  Code,
} from "lucide-react";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    handles: {
      codeforces: "",
      leetcode: "",
      codechef: "",
    },
    socialLinks: {
      github: "",
      linkedin: "",
      website: "",
    },
    preferences: {
      publicProfile: true,
      showStats: true,
      allowFriendRequests: true,
    },
  });

  useEffect(() => {
    // Load user data
    const savedUser = localStorage.getItem("symmdiv2-user");
    const savedHandles = localStorage.getItem("symmdiv2-handles");
    const savedProfile = localStorage.getItem("symmdiv2-profile");

    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);

      const profile = savedProfile ? JSON.parse(savedProfile) : {};
      const handles = savedHandles ? JSON.parse(savedHandles) : {};

      setFormData({
        displayName: userData.displayName || "",
        bio: profile.bio || "",
        handles: {
          codeforces: handles.codeforces || "",
          leetcode: handles.leetcode || "",
          codechef: handles.codechef || "",
        },
        socialLinks: profile.socialLinks || {
          github: "",
          linkedin: "",
          website: "",
        },
        preferences: profile.preferences || {
          publicProfile: true,
          showStats: true,
          allowFriendRequests: true,
        },
      });
    }
  }, []);

  const handleSave = () => {
    // Save profile data
    const profileData = {
      bio: formData.bio,
      socialLinks: formData.socialLinks,
      preferences: formData.preferences,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem("symmdiv2-profile", JSON.stringify(profileData));
    localStorage.setItem("symmdiv2-handles", JSON.stringify(formData.handles));

    // Update user display name if changed
    if (user && formData.displayName !== user.displayName) {
      const updatedUser = { ...user, displayName: formData.displayName };
      localStorage.setItem("symmdiv2-user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }

    setEditing(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Profile Settings
            </h1>
            <button
              onClick={() => (editing ? handleSave() : setEditing(true))}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-lg font-medium transition-all duration-200"
            >
              {editing ? (
                <Save className="w-4 h-4" />
              ) : (
                <Edit className="w-4 h-4" />
              )}
              {editing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6 text-center">
              <div className="relative mb-4">
                <img
                  src={
                    user.photoURL ||
                    "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(user.displayName || "User") +
                      "&background=6366f1&color=fff"
                  }
                  alt={user.displayName || "User"}
                  className="w-24 h-24 rounded-full mx-auto border-4 border-primary-500"
                />
                {editing && (
                  <button className="absolute bottom-0 right-1/2 transform translate-x-12 bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-full transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {user.displayName || "User"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {user.email}
              </p>

              {formData.bio && (
                <p className="text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                  {formData.bio}
                </p>
              )}

              <div className="mt-4 flex justify-center gap-2">
                {formData.socialLinks.github && (
                  <a
                    href={formData.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {formData.socialLinks.linkedin && (
                  <a
                    href={formData.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {formData.socialLinks.website && (
                  <a
                    href={formData.socialLinks.website}
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

          {/* Profile Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  Basic Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) =>
                        handleInputChange("displayName", e.target.value)
                      }
                      disabled={!editing}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      disabled={!editing}
                      rows={3}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Competitive Programming Handles */}
              <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  Programming Handles
                </h3>

                <div className="space-y-4">
                  {Object.entries(formData.handles).map(
                    ([platform, handle]) => (
                      <div key={platform}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                          {platform} Handle
                        </label>
                        <input
                          type="text"
                          value={handle}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "handles",
                              platform,
                              e.target.value,
                            )
                          }
                          disabled={!editing}
                          placeholder={`Your ${platform} username`}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  Social Links
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      GitHub Profile
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks.github}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "socialLinks",
                          "github",
                          e.target.value,
                        )
                      }
                      disabled={!editing}
                      placeholder="https://github.com/username"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "socialLinks",
                          "linkedin",
                          e.target.value,
                        )
                      }
                      disabled={!editing}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Personal Website
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks.website}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "socialLinks",
                          "website",
                          e.target.value,
                        )
                      }
                      disabled={!editing}
                      placeholder="https://your-website.com"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-gray-700/20 p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  Privacy Settings
                </h3>

                <div className="space-y-4">
                  {Object.entries(formData.preferences).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "preferences",
                            key,
                            e.target.checked,
                          )
                        }
                        disabled={!editing}
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
