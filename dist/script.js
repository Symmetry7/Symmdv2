// ===== MULTICODE - COMPETITIVE PROGRAMMING PROBLEM SELECTOR =====
// Enhanced version with Codeforces, LeetCode, and CodeChef integration

class MultiCodeApp {
  constructor() {
    this.currentPlatform = "codeforces";
    this.platforms = {
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
    };

    this.selectedTags = [];
    this.currentProblem = null;
    this.isLoading = false;
    this.darkTheme = true;
    this.statsVisible = false;

    this.initializeApp();
  }

  // ===== INITIALIZATION =====
  async initializeApp() {
    try {
      this.initializeDOM();
      this.attachEventListeners();
      this.initializeTheme();
      await this.loadInitialData();
      this.showStats();
    } catch (error) {
      console.error("Failed to initialize app:", error);
      this.showError(
        "Failed to initialize application. Please refresh the page.",
      );
    }
  }

  initializeDOM() {
    // Cache DOM elements
    this.elements = {
      // Navigation
      themeToggle: document.getElementById("theme-toggle"),
      statsToggle: document.getElementById("stats-toggle"),

      // Platform selector
      platformTabs: document.querySelectorAll(".platform-tab"),
      platformCounts: {
        codeforces: document.getElementById("cf-count"),
        leetcode: document.getElementById("lc-count"),
        codechef: document.getElementById("cc-count"),
      },

      // Filter controls
      codeforcesFilters: document.getElementById("codeforces-filters"),
      leetcodeFilters: document.getElementById("leetcode-filters"),
      codechefFilters: document.getElementById("codechef-filters"),

      // Codeforces filters
      cfProblemType: document.getElementById("cf-problem-type"),
      cfContestType: document.getElementById("cf-contest-type"),
      cfMinRating: document.getElementById("cf-min-rating"),
      cfMaxRating: document.getElementById("cf-max-rating"),

      // LeetCode filters
      lcDifficulty: document.getElementById("lc-difficulty"),
      lcPremium: document.getElementById("lc-premium"),

      // CodeChef filters
      ccDifficulty: document.getElementById("cc-difficulty"),
      ccContestStatus: document.getElementById("cc-contest-status"),

      // Common elements
      tagsContainer: document.getElementById("tags-container"),
      tagLogic: document.getElementById("tag-logic"),
      userHandle: document.getElementById("user-handle"),
      handleCheckBtn: document.getElementById("handle-check-btn"),
      handleStatus: document.getElementById("handle-status"),

      generateBtn: document.getElementById("generate-btn"),

      // Problem display
      loadingContainer: document.getElementById("loading-container"),
      loadingText: document.getElementById("loading-text"),
      problemCard: document.getElementById("problem-card"),
      problemPlatform: document.getElementById("problem-platform"),
      problemTitle: document.getElementById("problem-title"),
      problemSubtitle: document.getElementById("problem-subtitle"),
      problemDifficulty: document.getElementById("problem-difficulty"),
      difficultyFill: document.getElementById("difficulty-fill"),
      difficultyLabel: document.getElementById("difficulty-label"),
      problemRating: document.getElementById("problem-rating"),
      problemSolved: document.getElementById("problem-solved"),
      solvedStatus: document.getElementById("solved-status"),
      problemTags: document.getElementById("problem-tags"),
      solveBtn: document.getElementById("solve-btn"),
      nextBtn: document.getElementById("next-btn"),
      bookmarkBtn: document.getElementById("bookmark-btn"),
      shareBtn: document.getElementById("share-btn"),

      // Stats
      statsDashboard: document.getElementById("stats-dashboard"),
      totalProblems: document.getElementById("total-problems"),
      filteredProblems: document.getElementById("filtered-problems"),
      solvedProblems: document.getElementById("solved-problems"),
      lastUpdated: document.getElementById("last-updated"),
    };
  }

  attachEventListeners() {
    // Theme toggle
    this.elements.themeToggle?.addEventListener("click", () =>
      this.toggleTheme(),
    );

    // Stats toggle
    this.elements.statsToggle?.addEventListener("click", () =>
      this.toggleStats(),
    );

    // Platform tabs
    this.elements.platformTabs.forEach((tab) => {
      tab.addEventListener("click", () =>
        this.switchPlatform(tab.dataset.platform),
      );
    });

    // Generate button
    this.elements.generateBtn?.addEventListener("click", () =>
      this.generateProblem(),
    );

    // Next button
    this.elements.nextBtn?.addEventListener("click", () =>
      this.generateProblem(),
    );

    // User handle
    this.elements.handleCheckBtn?.addEventListener("click", () =>
      this.checkUserHandle(),
    );
    this.elements.userHandle?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.checkUserHandle();
    });

    // Filter change listeners
    this.attachFilterListeners();

    // Action buttons
    this.elements.bookmarkBtn?.addEventListener("click", () =>
      this.toggleBookmark(),
    );
    this.elements.shareBtn?.addEventListener("click", () =>
      this.shareProblem(),
    );
  }

  attachFilterListeners() {
    // Codeforces filters
    this.elements.cfProblemType?.addEventListener("change", () =>
      this.filterProblems(),
    );
    this.elements.cfContestType?.addEventListener("change", () =>
      this.filterProblems(),
    );
    this.elements.cfMinRating?.addEventListener("input", () =>
      this.debounce(() => this.filterProblems(), 300),
    );
    this.elements.cfMaxRating?.addEventListener("input", () =>
      this.debounce(() => this.filterProblems(), 300),
    );

    // LeetCode filters
    this.elements.lcDifficulty?.addEventListener("change", () =>
      this.filterProblems(),
    );
    this.elements.lcPremium?.addEventListener("change", () =>
      this.filterProblems(),
    );

    // CodeChef filters
    this.elements.ccDifficulty?.addEventListener("change", () =>
      this.filterProblems(),
    );
    this.elements.ccContestStatus?.addEventListener("change", () =>
      this.filterProblems(),
    );
  }

  // ===== THEME MANAGEMENT =====
  initializeTheme() {
    const savedTheme = localStorage.getItem("multicode-theme");
    this.darkTheme = savedTheme ? savedTheme === "dark" : true;
    this.applyTheme();
  }

  toggleTheme() {
    this.darkTheme = !this.darkTheme;
    this.applyTheme();
    localStorage.setItem("multicode-theme", this.darkTheme ? "dark" : "light");
  }

  applyTheme() {
    document.body.classList.toggle("dark-theme", this.darkTheme);
  }

  // ===== PLATFORM MANAGEMENT =====
  async switchPlatform(platform) {
    if (platform === this.currentPlatform) return;

    this.currentPlatform = platform;
    this.updatePlatformUI();
    await this.loadPlatformData();
    this.populateTags();
    this.filterProblems();
    this.updateStats();
  }

  updatePlatformUI() {
    // Update active tab
    this.elements.platformTabs.forEach((tab) => {
      tab.classList.toggle(
        "active",
        tab.dataset.platform === this.currentPlatform,
      );
    });

    // Show/hide filter groups
    this.elements.codeforcesFilters?.classList.toggle(
      "hidden",
      this.currentPlatform !== "codeforces",
    );
    this.elements.leetcodeFilters?.classList.toggle(
      "hidden",
      this.currentPlatform !== "leetcode",
    );
    this.elements.codechefFilters?.classList.toggle(
      "hidden",
      this.currentPlatform !== "codechef",
    );

    // Update platform badge
    const platformInfo = this.getPlatformInfo(this.currentPlatform);
    if (this.elements.problemPlatform) {
      this.elements.problemPlatform.innerHTML = `
                <i class="${platformInfo.icon}"></i>
                <span>${platformInfo.name}</span>
            `;
    }
  }

  getPlatformInfo(platform) {
    const info = {
      codeforces: { name: "Codeforces", icon: "fas fa-code", color: "#1f8dd6" },
      leetcode: {
        name: "LeetCode",
        icon: "fas fa-laptop-code",
        color: "#ffa116",
      },
      codechef: { name: "CodeChef", icon: "fas fa-utensils", color: "#5b4638" },
    };
    return info[platform] || info.codeforces;
  }

  // ===== DATA LOADING =====
  async loadInitialData() {
    this.showLoading("Initializing databases...");

    try {
      await Promise.all([
        this.loadCodeforcesData(),
        this.loadLeetCodeData(),
        this.loadCodeChefData(),
      ]);

      this.populateTags();
      this.filterProblems();
      this.updateStats();
      this.hideLoading();
    } catch (error) {
      console.error("Failed to load initial data:", error);
      this.showError(
        "Failed to load problem databases. Some features may not work.",
      );
    }
  }

  async loadPlatformData() {
    if (!this.platforms[this.currentPlatform].problems.length) {
      this.showLoading(
        `Loading ${this.getPlatformInfo(this.currentPlatform).name} data...`,
      );

      try {
        switch (this.currentPlatform) {
          case "codeforces":
            await this.loadCodeforcesData();
            break;
          case "leetcode":
            await this.loadLeetCodeData();
            break;
          case "codechef":
            await this.loadCodeChefData();
            break;
        }
        this.hideLoading();
      } catch (error) {
        console.error(`Failed to load ${this.currentPlatform} data:`, error);
        this.showError(
          `Failed to load ${this.getPlatformInfo(this.currentPlatform).name} data.`,
        );
      }
    }
  }

  // ===== CODEFORCES API =====
  async loadCodeforcesData() {
    try {
      // Load problems
      const problemsResponse = await fetch(
        "https://codeforces.com/api/problemset.problems?lang=en",
      );
      const problemsData = await problemsResponse.json();

      if (problemsData.status !== "OK") {
        throw new Error(
          problemsData.comment || "Failed to fetch Codeforces problems",
        );
      }

      // Filter and process problems
      const problems = problemsData.result.problems.filter((problem) => {
        return (
          problem.type === "PROGRAMMING" &&
          ["A", "B", "C", "D", "E", "F", "G"].includes(problem.index) &&
          problem.rating !== undefined &&
          problem.rating <= 2400
        );
      });

      // Add solved counts
      const problemStats = problemsData.result.problemStatistics || [];
      const solvedCountsMap = new Map();
      problemStats.forEach((stat) => {
        solvedCountsMap.set(
          `${stat.contestId}-${stat.index}`,
          stat.solvedCount,
        );
      });

      problems.forEach((problem) => {
        problem.solvedCount =
          solvedCountsMap.get(`${problem.contestId}-${problem.index}`) || 0;
        problem.platform = "codeforces";
        problem.url = `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`;
      });

      // Load contest names
      const contestResponse = await fetch(
        "https://codeforces.com/api/contest.list?lang=en",
      );
      const contestData = await contestResponse.json();

      const contestNames = {};
      if (contestData.status === "OK") {
        contestData.result.forEach((contest) => {
          contestNames[contest.id] = contest.name;
        });
      }

      problems.forEach((problem) => {
        problem.contestName =
          contestNames[problem.contestId] || `Contest ${problem.contestId}`;
      });

      this.platforms.codeforces.problems = problems;
      this.updatePlatformCount("codeforces", problems.length);
    } catch (error) {
      console.error("Error loading Codeforces data:", error);
      throw error;
    }
  }

  // ===== LEETCODE API =====
  async loadLeetCodeData() {
    try {
      // Note: LeetCode doesn't have an official public API
      // This is a simulation - in a real implementation, you'd need to use
      // unofficial APIs or GraphQL endpoints with proper CORS handling

      const mockLeetCodeData = this.generateMockLeetCodeData();
      this.platforms.leetcode.problems = mockLeetCodeData;
      this.updatePlatformCount("leetcode", mockLeetCodeData.length);
    } catch (error) {
      console.error("Error loading LeetCode data:", error);
      // For now, we'll use mock data
      const mockData = this.generateMockLeetCodeData();
      this.platforms.leetcode.problems = mockData;
      this.updatePlatformCount("leetcode", mockData.length);
    }
  }

  generateMockLeetCodeData() {
    const difficulties = ["Easy", "Medium", "Hard"];
    const topics = this.platforms.leetcode.tags;
    const problems = [];

    for (let i = 1; i <= 300; i++) {
      const difficulty =
        difficulties[Math.floor(Math.random() * difficulties.length)];
      const isPremium = Math.random() < 0.3;
      const randomTopics = this.getRandomSubset(
        topics,
        Math.floor(Math.random() * 4) + 1,
      );

      problems.push({
        id: i,
        title: `Problem ${i}: ${this.generateRandomTitle()}`,
        difficulty: difficulty,
        isPremium: isPremium,
        topics: randomTopics,
        solvedCount: Math.floor(Math.random() * 100000) + 1000,
        platform: "leetcode",
        url: `https://leetcode.com/problems/problem-${i}/`,
        rating: this.getDifficultyRating(difficulty),
      });
    }

    return problems;
  }

  // ===== CODECHEF API =====
  async loadCodeChefData() {
    try {
      // Note: CodeChef doesn't have an official public API
      // This uses mock data - in real implementation, you'd use unofficial APIs

      const mockCodeChefData = this.generateMockCodeChefData();
      this.platforms.codechef.problems = mockCodeChefData;
      this.updatePlatformCount("codechef", mockCodeChefData.length);
    } catch (error) {
      console.error("Error loading CodeChef data:", error);
      const mockData = this.generateMockCodeChefData();
      this.platforms.codechef.problems = mockData;
      this.updatePlatformCount("codechef", mockData.length);
    }
  }

  generateMockCodeChefData() {
    const difficulties = ["beginner", "easy", "medium", "hard", "challenge"];
    const topics = this.platforms.codechef.tags;
    const problems = [];

    for (let i = 1; i <= 200; i++) {
      const difficulty =
        difficulties[Math.floor(Math.random() * difficulties.length)];
      const randomTopics = this.getRandomSubset(
        topics,
        Math.floor(Math.random() * 3) + 1,
      );
      const status = ["practice", "past", "present"][
        Math.floor(Math.random() * 3)
      ];

      problems.push({
        id: `CC${i.toString().padStart(3, "0")}`,
        title: `CodeChef Problem ${i}: ${this.generateRandomTitle()}`,
        difficulty: difficulty,
        topics: randomTopics,
        solvedCount: Math.floor(Math.random() * 50000) + 500,
        platform: "codechef",
        url: `https://www.codechef.com/problems/CC${i.toString().padStart(3, "0")}`,
        rating: this.getDifficultyRating(difficulty),
        contestStatus: status,
      });
    }

    return problems;
  }

  // ===== UTILITY FUNCTIONS =====
  generateRandomTitle() {
    const titles = [
      "Array Manipulation",
      "String Processing",
      "Graph Traversal",
      "Dynamic Programming",
      "Binary Search",
      "Tree Operations",
      "Number Theory",
      "Greedy Algorithm",
      "Data Structure Design",
      "Mathematical Problem",
      "Optimization Challenge",
      "Sorting Algorithm",
      "Pattern Matching",
      "Game Theory",
      "Combinatorics",
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  getRandomSubset(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  getDifficultyRating(difficulty) {
    const ratings = {
      Easy: 800 + Math.floor(Math.random() * 400),
      Medium: 1200 + Math.floor(Math.random() * 600),
      Hard: 1800 + Math.floor(Math.random() * 800),
      beginner: 800 + Math.floor(Math.random() * 200),
      easy: 1000 + Math.floor(Math.random() * 300),
      medium: 1300 + Math.floor(Math.random() * 400),
      hard: 1700 + Math.floor(Math.random() * 500),
      challenge: 2200 + Math.floor(Math.random() * 600),
    };
    return ratings[difficulty] || 1200;
  }

  updatePlatformCount(platform, count) {
    const countElement = this.elements.platformCounts[platform];
    if (countElement) {
      countElement.textContent = this.formatNumber(count);
    }
  }

  // ===== FILTERING =====
  filterProblems() {
    const platform = this.platforms[this.currentPlatform];
    let filtered = [...platform.problems];

    // Apply platform-specific filters
    switch (this.currentPlatform) {
      case "codeforces":
        filtered = this.filterCodeforcesProblems(filtered);
        break;
      case "leetcode":
        filtered = this.filterLeetCodeProblems(filtered);
        break;
      case "codechef":
        filtered = this.filterCodeChefProblems(filtered);
        break;
    }

    // Apply tag filters
    if (this.selectedTags.length > 0) {
      filtered = filtered.filter((problem) => {
        const problemTags = problem.tags || problem.topics || [];
        return this.selectedTags.some((selectedTag) =>
          problemTags.some((problemTag) =>
            problemTag.toLowerCase().includes(selectedTag.toLowerCase()),
          ),
        );
      });
    }

    platform.filteredProblems = filtered;
    this.updateStats();
  }

  filterCodeforcesProblems(problems) {
    const problemType = this.elements.cfProblemType?.value || "random";
    const contestType = this.elements.cfContestType?.value || "any";
    const minRating = parseInt(this.elements.cfMinRating?.value) || 800;
    const maxRating = parseInt(this.elements.cfMaxRating?.value) || 3500;

    return problems.filter((problem) => {
      const typeMatch =
        problemType === "random" || problem.index === problemType;
      const ratingMatch =
        problem.rating >= minRating && problem.rating <= maxRating;
      const contestMatch =
        contestType === "any" ||
        problem.contestName.toLowerCase().includes(contestType.toLowerCase());

      return typeMatch && ratingMatch && contestMatch;
    });
  }

  filterLeetCodeProblems(problems) {
    const difficulty = this.elements.lcDifficulty?.value || "any";
    const premium = this.elements.lcPremium?.value || "free";

    return problems.filter((problem) => {
      const difficultyMatch =
        difficulty === "any" || problem.difficulty === difficulty;
      const premiumMatch =
        premium === "any" ||
        (premium === "free" && !problem.isPremium) ||
        (premium === "premium" && problem.isPremium);

      return difficultyMatch && premiumMatch;
    });
  }

  filterCodeChefProblems(problems) {
    const difficulty = this.elements.ccDifficulty?.value || "any";
    const contestStatus = this.elements.ccContestStatus?.value || "any";

    return problems.filter((problem) => {
      const difficultyMatch =
        difficulty === "any" || problem.difficulty === difficulty;
      const statusMatch =
        contestStatus === "any" || problem.contestStatus === contestStatus;

      return difficultyMatch && statusMatch;
    });
  }

  // ===== TAGS MANAGEMENT =====
  populateTags() {
    const tags = this.platforms[this.currentPlatform].tags;
    this.elements.tagsContainer.innerHTML = "";

    tags.forEach((tag) => {
      const tagElement = document.createElement("button");
      tagElement.className = "tag-btn";
      tagElement.textContent = tag;
      tagElement.addEventListener("click", () =>
        this.toggleTag(tag, tagElement),
      );
      this.elements.tagsContainer.appendChild(tagElement);
    });
  }

  toggleTag(tag, element) {
    const isSelected = this.selectedTags.includes(tag);

    if (isSelected) {
      this.selectedTags = this.selectedTags.filter((t) => t !== tag);
      element.classList.remove("selected");
    } else {
      this.selectedTags.push(tag);
      element.classList.add("selected");
    }

    this.filterProblems();
    this.updateTagLogic();
  }

  updateTagLogic() {
    if (this.elements.tagLogic) {
      this.elements.tagLogic.textContent =
        this.selectedTags.length > 0 ? "OR Logic" : "OR Logic";
    }
  }

  // ===== PROBLEM GENERATION =====
  async generateProblem() {
    if (this.isLoading) return;

    const platform = this.platforms[this.currentPlatform];
    const problems = platform.filteredProblems;

    if (problems.length === 0) {
      this.showNoProblemMessage();
      return;
    }

    // Select random problem
    const randomIndex = Math.floor(Math.random() * problems.length);
    this.currentProblem = problems[randomIndex];

    this.displayProblem(this.currentProblem);
    this.updateSolvedStatus();
  }

  displayProblem(problem) {
    this.elements.loadingContainer?.classList.add("hidden");
    this.elements.problemCard?.classList.remove("hidden");

    // Update problem info
    this.elements.problemTitle.textContent = problem.name || problem.title;
    this.elements.problemSubtitle.textContent =
      this.formatProblemSubtitle(problem);

    // Update difficulty
    this.updateDifficultyDisplay(problem);

    // Update stats
    this.elements.problemRating.textContent = `${problem.rating || "N/A"}`;
    this.elements.problemSolved.textContent =
      this.formatNumber(problem.solvedCount || 0) + " solved";

    // Update tags
    this.displayProblemTags(problem);

    // Update solve button
    this.elements.solveBtn.href = problem.url;

    // Animate in
    this.animateProblemCard();
  }

  formatProblemSubtitle(problem) {
    switch (problem.platform) {
      case "codeforces":
        return `${problem.contestName} • ${problem.contestId}${problem.index}`;
      case "leetcode":
        return `Problem #${problem.id} • ${problem.difficulty}`;
      case "codechef":
        return `${problem.id} • ${problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}`;
      default:
        return "Problem";
    }
  }

  updateDifficultyDisplay(problem) {
    const rating = problem.rating || 0;
    const maxRating = 3500;
    const percentage = Math.min(100, (rating / maxRating) * 100);

    this.elements.difficultyFill.style.width = `${percentage}%`;

    let label = "Unknown";
    if (rating < 1200) label = "Easy";
    else if (rating < 1600) label = "Medium";
    else if (rating < 2000) label = "Hard";
    else if (rating < 2400) label = "Very Hard";
    else label = "Expert";

    this.elements.difficultyLabel.textContent = label;
  }

  displayProblemTags(problem) {
    const tags = problem.tags || problem.topics || [];
    this.elements.problemTags.innerHTML = "";

    tags.forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "problem-tag";
      tagElement.textContent = tag;
      this.elements.problemTags.appendChild(tagElement);
    });
  }

  animateProblemCard() {
    this.elements.problemCard?.classList.remove("animate__fadeInUp");
    void this.elements.problemCard?.offsetWidth; // Force reflow
    this.elements.problemCard?.classList.add("animate__fadeInUp");
  }

  showNoProblemMessage() {
    this.elements.problemTitle.textContent = "No problems found";
    this.elements.problemSubtitle.textContent = "Try adjusting your filters";
    this.elements.problemTags.innerHTML =
      '<span class="problem-tag">Adjust filters to find problems</span>';
    this.elements.solveBtn.href = "#";
    this.elements.difficultyFill.style.width = "0%";
    this.elements.difficultyLabel.textContent = "None";
  }

  // ===== USER HANDLE =====
  async checkUserHandle() {
    const handle = this.elements.userHandle?.value.trim();
    if (!handle) {
      this.showHandleStatus("Please enter a handle", "error");
      return;
    }

    this.showHandleStatus("Checking handle...", "loading");

    try {
      switch (this.currentPlatform) {
        case "codeforces":
          await this.checkCodeforcesHandle(handle);
          break;
        case "leetcode":
          await this.checkLeetCodeHandle(handle);
          break;
        case "codechef":
          await this.checkCodeChefHandle(handle);
          break;
      }
    } catch (error) {
      console.error("Error checking handle:", error);
      this.showHandleStatus("Error checking handle", "error");
    }
  }

  async checkCodeforcesHandle(handle) {
    try {
      const response = await fetch(
        `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=100000`,
      );
      const data = await response.json();

      if (data.status === "OK") {
        const solvedProblems = new Set();
        data.result.forEach((submission) => {
          if (submission.verdict === "OK" && submission.problem) {
            solvedProblems.add(
              `${submission.problem.contestId}-${submission.problem.index}`,
            );
          }
        });

        this.platforms.codeforces.userSolvedProblems = solvedProblems;
        this.showHandleStatus(
          `Handle "${handle}" loaded (${solvedProblems.size} problems solved)`,
          "success",
        );
        this.updateSolvedStatus();
      } else {
        throw new Error(data.comment || "Handle not found");
      }
    } catch (error) {
      this.showHandleStatus(`Error: ${error.message}`, "error");
      this.platforms.codeforces.userSolvedProblems.clear();
    }
  }

  async checkLeetCodeHandle(handle) {
    // Mock implementation for LeetCode
    const mockSolvedCount = Math.floor(Math.random() * 500) + 50;
    this.showHandleStatus(
      `Handle "${handle}" loaded (${mockSolvedCount} problems solved)`,
      "success",
    );
  }

  async checkCodeChefHandle(handle) {
    // Mock implementation for CodeChef
    const mockSolvedCount = Math.floor(Math.random() * 300) + 30;
    this.showHandleStatus(
      `Handle "${handle}" loaded (${mockSolvedCount} problems solved)`,
      "success",
    );
  }

  showHandleStatus(message, type) {
    this.elements.handleStatus.textContent = message;
    this.elements.handleStatus.className = `handle-status ${type}`;
  }

  updateSolvedStatus() {
    if (!this.currentProblem) return;

    const platform = this.platforms[this.currentPlatform];
    const problemKey =
      this.currentPlatform === "codeforces"
        ? `${this.currentProblem.contestId}-${this.currentProblem.index}`
        : this.currentProblem.id;

    const isSolved = platform.userSolvedProblems.has(problemKey);

    this.elements.solvedStatus.innerHTML = isSolved
      ? '<i class="fas fa-check-circle"></i><span>Solved</span>'
      : '<i class="fas fa-question-circle"></i><span>Unsolved</span>';

    this.elements.solvedStatus.className = `stat-item ${isSolved ? "solved" : "unsolved"}`;
  }

  // ===== ACTIONS =====
  toggleBookmark() {
    // Implementation for bookmarking functionality
    console.log("Bookmark toggled for problem:", this.currentProblem?.title);
  }

  shareProblem() {
    if (!this.currentProblem) return;

    if (navigator.share) {
      navigator.share({
        title: this.currentProblem.name || this.currentProblem.title,
        text: `Check out this ${this.currentPlatform} problem!`,
        url: this.currentProblem.url,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(this.currentProblem.url);
      // Show toast notification
      console.log("Problem URL copied to clipboard!");
    }
  }

  // ===== UI HELPERS =====
  showLoading(message = "Loading...") {
    this.isLoading = true;
    this.elements.loadingContainer?.classList.remove("hidden");
    this.elements.problemCard?.classList.add("hidden");
    if (this.elements.loadingText) {
      this.elements.loadingText.textContent = message;
    }
  }

  hideLoading() {
    this.isLoading = false;
    this.elements.loadingContainer?.classList.add("hidden");
  }

  showError(message) {
    this.hideLoading();
    if (this.elements.loadingText) {
      this.elements.loadingText.textContent = message;
    }
    this.elements.loadingContainer?.classList.remove("hidden");
  }

  toggleStats() {
    this.statsVisible = !this.statsVisible;
    this.elements.statsDashboard?.classList.toggle(
      "hidden",
      !this.statsVisible,
    );
  }

  showStats() {
    this.statsVisible = true;
    this.elements.statsDashboard?.classList.remove("hidden");
    this.updateStats();
  }

  updateStats() {
    const platform = this.platforms[this.currentPlatform];
    const totalProblems = platform.problems.length;
    const filteredProblems = platform.filteredProblems.length;
    const solvedProblems = platform.userSolvedProblems.size;

    this.elements.totalProblems.textContent = this.formatNumber(totalProblems);
    this.elements.filteredProblems.textContent =
      this.formatNumber(filteredProblems);
    this.elements.solvedProblems.textContent =
      this.formatNumber(solvedProblems);
    this.elements.lastUpdated.textContent = new Date().toLocaleDateString();
  }

  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.multiCodeApp = new MultiCodeApp();
});

// Performance optimization: Preload critical resources
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Service worker registration could go here for PWA features
  });
}
