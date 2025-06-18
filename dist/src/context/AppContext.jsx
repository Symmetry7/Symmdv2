import React, { createContext, useContext, useReducer, useEffect } from "react";

const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  currentPlatform: "codeforces",
  platforms: {
    codeforces: {
      problems: [],
      filteredProblems: [],
      userSolvedProblems: new Set(),
      tags: [
        "2-sat",
        "binary search",
        "bitmasks",
        "brute force",
        "chinese remainder theorem",
        "combinatorics",
        "constructive algorithms",
        "data structures",
        "dfs and similar",
        "divide and conquer",
        "dp",
        "dsu",
        "expression parsing",
        "fft",
        "flows",
        "games",
        "geometry",
        "graph matchings",
        "graphs",
        "greedy",
        "hashing",
        "implementation",
        "interactive",
        "math",
        "matrices",
        "meet-in-the-middle",
        "number theory",
        "probabilities",
        "schedules",
        "shortest paths",
        "sortings",
        "string suffix structures",
        "strings",
        "ternary search",
        "trees",
        "two pointers",
      ],
    },
    leetcode: {
      problems: [],
      filteredProblems: [],
      userSolvedProblems: new Set(),
      tags: [
        "array",
        "string",
        "hash-table",
        "dynamic-programming",
        "math",
        "sorting",
        "greedy",
        "depth-first-search",
        "database",
        "binary-search",
        "tree",
        "breadth-first-search",
        "matrix",
        "two-pointers",
        "binary-tree",
        "heap",
        "stack",
        "simulation",
        "graph",
        "prefix-sum",
        "sliding-window",
        "backtracking",
      ],
    },
    codechef: {
      problems: [],
      filteredProblems: [],
      userSolvedProblems: new Set(),
      tags: [
        "basic",
        "simple-math",
        "ad-hoc",
        "implementation",
        "greedy",
        "strings",
        "sorting",
        "searching",
        "data-structures",
        "dynamic-programming",
        "graphs",
        "number-theory",
        "combinatorics",
        "game-theory",
        "geometry",
        "bitwise-operations",
      ],
    },
  },
  selectedTags: [],
  tagOrder: {},
  currentProblem: null,
  userHandle: "",
  userHandles: {},
  filters: {
    codeforces: {
      problemType: "random",
      contestEra: "any",
      contestType: "any",
      minRating: 800,
      maxRating: 3500,
    },
    leetcode: {
      difficulty: "any",
      premium: "free",
    },
    codechef: {
      difficulty: "any",
      contestStatus: "any",
    },
  },
  isLoading: false,
  stats: {
    totalProblems: 0,
    filteredProblems: 0,
    solvedProblems: 0,
    lastUpdated: new Date().toLocaleDateString(),
  },
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };

    case "SET_PLATFORM":
      return { ...state, currentPlatform: action.payload };

    case "SET_PROBLEMS":
      return {
        ...state,
        platforms: {
          ...state.platforms,
          [action.platform]: {
            ...state.platforms[action.platform],
            problems: action.payload,
          },
        },
      };

    case "SET_FILTERED_PROBLEMS":
      return {
        ...state,
        platforms: {
          ...state.platforms,
          [state.currentPlatform]: {
            ...state.platforms[state.currentPlatform],
            filteredProblems: action.payload,
          },
        },
      };

    case "SET_SELECTED_TAGS":
      return { ...state, selectedTags: action.payload };

    case "SET_TAG_ORDER":
      return { ...state, tagOrder: { ...state.tagOrder, ...action.payload } };

    case "SET_CURRENT_PROBLEM":
      return { ...state, currentProblem: action.payload };

    case "SET_USER_HANDLE":
      return { ...state, userHandle: action.payload };

    case "SET_USER_HANDLES":
      return { ...state, userHandles: action.payload };

    case "SET_USER_SOLVED_PROBLEMS":
      return {
        ...state,
        platforms: {
          ...state.platforms,
          [action.platform]: {
            ...state.platforms[action.platform],
            userSolvedProblems: action.payload,
          },
        },
      };

    case "UPDATE_FILTER":
      return {
        ...state,
        filters: {
          ...state.filters,
          [state.currentPlatform]: {
            ...state.filters[state.currentPlatform],
            [action.field]: action.value,
          },
        },
      };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "UPDATE_STATS":
      return { ...state, stats: { ...state.stats, ...action.payload } };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
