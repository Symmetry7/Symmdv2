document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const problemTypeSelect = document.getElementById('problem-type');
    const contestTypeSelect = document.getElementById('contest-type');
    const tagsContainer = document.getElementById('tags-container');
    const minRatingInput = document.getElementById('min-rating');
    const maxRatingInput = document.getElementById('max-rating');
    const generateBtn = document.getElementById('generate-btn');
    const nextBtn = document.getElementById('next-btn');
    const loadingElement = document.getElementById('loading');
    const problemDisplay = document.getElementById('problem-display');
    const problemTitle = document.getElementById('problem-title');
    const problemTypeBadge = document.getElementById('problem-type-badge');
    const problemContestId = document.getElementById('problem-contest-id');
    const problemRating = document.getElementById('problem-rating');
    const problemSolvedCount = document.getElementById('problem-solved-count');
    const problemTagsContainer = document.getElementById('problem-tags');
    const problemLink = document.getElementById('problem-link');
    const totalProblemsElement = document.getElementById('total-problems');
    const filteredProblemsElement = document.getElementById('filtered-problems');
    const difficultyPointer = document.getElementById('difficulty-pointer');
    const difficultyBarFill = document.getElementById('difficulty-bar-fill');
    const lastUpdatedElement = document.getElementById('last-updated');
    const filterLogicType = document.getElementById('filter-logic-type');

    // New DOM elements for Codeforces handle feature
    const cfHandleInput = document.getElementById('cf-handle-input');
    const loadHandleBtn = document.getElementById('load-handle-btn');
    const handleStatusMessage = document.getElementById('handle-status-message');
    const problemSolvedStatus = document.getElementById('problem-solved-status');

    // Data variables
    let problems = [];
    let filteredProblems = [];
    let currentProblem = null;
    const contestNames = {}; // Cache for contest names
    let selectedTags = []; // Array to store selected tags
    let solvedProblemsByUser = new Set(); // Stores problem IDs (contestId-index) solved by the user

    // List of available tags
    const availableTags = [
        "2-sat", "binary search", "bitmasks", "brute force", "chinese remainder theorem",
        "combinatorics", "constructive algorithms", "data structures", "dfs and similar",
        "divide and conquer", "dp", "dsu", "expression parsing", "fft", "flows", "games",
        "geometry", "graph matchings", "graphs", "greedy", "hashing", "implementation",
        "interactive", "math", "matrices", "meet-in-the-middle", "number theory",
        "probabilities", "schedules", "shortest paths", "sortings", "string suffix structures",
        "strings", "ternary search", "trees", "two pointers"
    ];

    // --- Utility Functions ---

    // Format date as "Month Day, Year"
    function formatDate(date) {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Update last updated time (initially to current date)
    let lastUpdated = new Date();
    lastUpdatedElement.textContent = `Last Updated: ${formatDate(lastUpdated)}`;

    // Get formatted contest name
    function getFormattedContestName(contestId) {
        const name = contestNames[contestId] || `Contest ${contestId}`;

        if (name.includes('Educational Codeforces Round')) {
            return name.replace('Educational Codeforces Round', 'Edu. Round');
        }
        if (name.includes('Codeforces Round #') && name.includes('(Div. 2)')) {
            return name.replace('Codeforces Round #', 'Round #').replace(' (Div. 2)', '');
        }
        if (name.includes('Codeforces Round #') && name.includes('(Div. 1 + Div. 2)')) {
            return name.replace('Codeforces Round #', 'Round #').replace(' (Div. 1 + Div. 2)', '');
        }
        if (name.includes('Codeforces Global Round')) {
            return name.replace('Codeforces Global Round', 'Global Round');
        }
        if (name.length > 30) {
            return name.replace('Codeforces Round #', 'CF #');
        }
        return name;
    }

    // Update difficulty pointer position and color based on rating
    function updateDifficultyPointer(rating) {
        const pointerValueSpan = difficultyPointer.querySelector('.pointer-value');

        if (!rating) {
            difficultyPointer.style.left = '50%';
            difficultyPointer.style.borderTopColor = '#4a6bff';
            difficultyBarFill.style.width = '0%';
            pointerValueSpan.textContent = 'N/A'; // Show N/A if no rating
            return;
        }

        const minRatingVal = 800;
        const maxRatingVal = 3500;
        const normalizedRating = Math.min(maxRatingVal, Math.max(minRatingVal, rating));
        const percentage = ((normalizedRating - minRatingVal) / (maxRatingVal - minRatingVal)) * 100;

        difficultyPointer.style.left = `${percentage}%`;
        difficultyBarFill.style.width = `${percentage}%`;

        let color;
        let categoryText;

        // Determine color and category based on rating
        if (rating < 1200) {
            color = '#00b894'; // Newbie
            categoryText = 'Easy';
        } else if (rating < 1400) {
            color = '#00cec9'; // Pupil
            categoryText = 'Medium';
        } else if (rating < 1600) {
            color = '#0984e3'; // Specialist
            categoryText = 'Hard';
        } else if (rating < 1900) {
            color = '#6c5ce7'; // Expert
            categoryText = 'Very Hard';
        } else if (rating < 2100) {
            color = '#fd79a8'; // Candidate Master
            categoryText = 'Challenging';
        } else if (rating < 2300) {
            color = '#e17055'; // Master
            categoryText = 'Difficult';
        } else if (rating < 2400) { // International Master
            color = '#d63031'; // Using red for IM
            categoryText = 'Expert';
        } else { // Grandmaster+
            color = '#d63031'; // Grandmaster+ (same red as IM for now)
            categoryText = 'Master';
        }
        
        difficultyPointer.style.borderTopColor = color;
        pointerValueSpan.textContent = `Rating: ${rating} (${categoryText})`;
    }

    // --- Core Data Fetching Function ---

    async function fetchAllData() {
        loadingElement.classList.remove('hidden');
        problemDisplay.classList.add('hidden');
        loadingElement.querySelector('p').textContent = 'Fetching problem database...';

        try {
            // Fetch problems and statistics
            const problemsResponse = await fetch('https://codeforces.com/api/problemset.problems?lang=en');
            if (!problemsResponse.ok) throw new Error(`HTTP error! status: ${problemsResponse.status}`);
            const problemsData = await problemsResponse.json();

            if (problemsData.status !== 'OK') {
                throw new Error(problemsData.comment || 'Failed to fetch problems from Codeforces API.');
            }

            problems = problemsData.result.problems.filter(problem => {
                const isProgrammingProblem = problem.type === "PROGRAMMING";
                const isAG = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(problem.index);
                const hasRating = problem.rating !== undefined;
                // Heuristic: problems with rating <= 2100 are typically Div2 level
                // Adjusted to 2400 to include more challenging Div2 problems for G type problems.
                const isTypicalDiv2Rating = problem.rating && problem.rating <= 2400; 

                return isProgrammingProblem && isAG && hasRating && isTypicalDiv2Rating;
            });

            const problemStats = problemsData.result.problemStatistics || [];

            const solvedCountsMap = new Map();
            problemStats.forEach(stat => {
                solvedCountsMap.set(`${stat.contestId}-${stat.index}`, stat.solvedCount);
            });

            problems.forEach(problem => {
                problem.solvedCount = solvedCountsMap.get(`${problem.contestId}-${problem.index}`) || 0;
            });

            loadingElement.querySelector('p').textContent = 'Fetching contest names...';

            const contestListResponse = await fetch('https://codeforces.com/api/contest.list?lang=en');
            if (!contestListResponse.ok) throw new Error(`HTTP error! status: ${contestListResponse.status}`);
            const contestListData = await contestListResponse.json();

            if (contestListData.status === 'OK') {
                contestListData.result.forEach(contest => {
                    contestNames[contest.id] = contest.name;
                });
            } else {
                console.warn('Could not fetch contest list for names:', contestListData.comment);
            }

            lastUpdated = new Date();
            lastUpdatedElement.textContent = `Last Updated: ${formatDate(lastUpdated)}`;

            totalProblemsElement.textContent = problems.length;
            filterProblems();

            loadingElement.classList.add('hidden');
            problemDisplay.classList.remove('hidden');
            generateProblem();

        } catch (error) {
            console.error('Error fetching data:', error);
            loadingElement.querySelector('p').textContent = `Error: ${error.message}. Please try refreshing the page.`;
            problemDisplay.classList.add('hidden');
        }
    }

    // --- Problem Filtering and Display Functions ---

    function filterProblems() {
        const problemType = problemTypeSelect.value;
        const contestType = contestTypeSelect.value;
        
        const minRating = parseInt(minRatingInput.value) || 800;
        const maxRating = parseInt(maxRatingInput.value) || 3500;

        filteredProblems = problems.filter(problem => {
            const typeMatch = problemType === 'random' || problem.index === problemType;
            const ratingMatch = problem.rating && (problem.rating >= minRating && problem.rating <= maxRating);
            
            // Contest type filtering logic
            let contestTypeMatch = true;
            if (contestType !== 'any') {
                const contestName = contestNames[problem.contestId] || '';
                contestTypeMatch = contestName.toLowerCase().includes(contestType.toLowerCase());
            }

            // Tag filtering logic for multi-select (OR logic)
            let tagMatch = true;
            if (selectedTags.length > 0) {
                if (!problem.tags || problem.tags.length === 0) {
                    tagMatch = false; // Problem has no tags but user has selected tags
                } else {
                    // Check if problem has AT LEAST ONE of the selected tags
                    tagMatch = selectedTags.some(selectedTag =>
                        problem.tags.some(problemTag =>
                            problemTag.toLowerCase() === selectedTag.toLowerCase()
                        )
                    );
                }
            }

            return typeMatch && ratingMatch && contestTypeMatch && tagMatch; // Combine all matches
        });

        filteredProblemsElement.textContent = filteredProblems.length;
        return filteredProblems;
    }

    function generateProblem() {
        const currentFilteredProblems = filterProblems();
        if (currentFilteredProblems.length === 0) {
            problemTitle.textContent = 'No problems found with current filters.';
            problemTypeBadge.textContent = '?';
            problemTypeBadge.className = 'problem-type-badge';
            problemContestId.textContent = '';
            problemRating.textContent = 'N/A';
            problemSolvedCount.textContent = 'N/A';
            problemTagsContainer.innerHTML = '<span style="color: #888;">Adjust filters to find problems.</span>';
            problemLink.href = '#';
            updateDifficultyPointer(null);
            problemSolvedStatus.className = 'problem-solved-status'; // Clear previous classes
            problemSolvedStatus.textContent = ''; // Clear text
            return;
        }

        const randomIndex = Math.floor(Math.random() * currentFilteredProblems.length);
        currentProblem = currentFilteredProblems[randomIndex];

        problemTitle.textContent = currentProblem.name;
        problemTypeBadge.textContent = currentProblem.index;
        problemTypeBadge.className = `problem-type-badge problem-type-${currentProblem.index}`;
        problemContestId.textContent = `${getFormattedContestName(currentProblem.contestId)} / ID: ${currentProblem.contestId}${currentProblem.index}`;
        problemRating.textContent = `Rating: ${currentProblem.rating}`;
        problemSolvedCount.textContent = `Solved: ${currentProblem.solvedCount.toLocaleString()}`;
        problemLink.href = `https://codeforces.com/contest/${currentProblem.contestId}/problem/${currentProblem.index}`;

        problemTagsContainer.innerHTML = '';
        if (currentProblem.tags && currentProblem.tags.length > 0) {
            currentProblem.tags.forEach(tag => {
                const span = document.createElement('span');
                span.textContent = tag;
                problemTagsContainer.appendChild(span);
            });
        } else {
            const span = document.createElement('span');
            span.textContent = 'No tags available';
            problemTagsContainer.appendChild(span);
        }

        updateDifficultyPointer(currentProblem.rating);
        updateProblemSolvedStatus(); // Call new function to update solved status

        problemDisplay.classList.remove('animate__fadeInUp');
        void problemDisplay.offsetWidth; // Trigger reflow
        problemDisplay.classList.add('animate__fadeInUp');
    }

    // --- Codeforces Handle Logic ---
    async function fetchUserSubmissions(handle) {
        handleStatusMessage.textContent = 'Checking handle...';
        handleStatusMessage.className = 'status-message'; // Reset classes

        try {
            // Fetch submissions from Codeforces API for the given handle
            // We only need accepted submissions to mark problems as solved
            const response = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=100000`); // Fetch a large number of submissions
            const data = await response.json();

            if (data.status === 'OK') {
                solvedProblemsByUser.clear(); // Clear previous data
                data.result.forEach(submission => {
                    // Only consider accepted submissions
                    if (submission.verdict === 'OK' && submission.problem) {
                        const problemKey = `${submission.problem.contestId}-${submission.problem.index}`;
                        solvedProblemsByUser.add(problemKey);
                    }
                });
                handleStatusMessage.textContent = `Handle "${handle}" loaded. (${solvedProblemsByUser.size} problems solved)`;
                handleStatusMessage.classList.add('success');
                updateProblemSolvedStatus(); // Update status for currently displayed problem
            } else {
                throw new Error(data.comment || 'Failed to fetch user submissions.');
            }
        } catch (error) {
            console.error('Error fetching user submissions:', error);
            solvedProblemsByUser.clear(); // Clear solved problems on error
            handleStatusMessage.textContent = `Error: ${error.message}`;
            handleStatusMessage.classList.add('error');
            updateProblemSolvedStatus(); // Update status for currently displayed problem to reflect no handle loaded
        }
    }

    function updateProblemSolvedStatus() {
        if (!currentProblem || solvedProblemsByUser.size === 0) {
            problemSolvedStatus.textContent = 'Login to check solved status';
            problemSolvedStatus.className = 'problem-solved-status'; // Reset class
            return;
        }

        const problemKey = `${currentProblem.contestId}-${currentProblem.index}`;
        if (solvedProblemsByUser.has(problemKey)) {
            problemSolvedStatus.textContent = 'Solved';
            problemSolvedStatus.className = 'problem-solved-status solved';
        } else {
            problemSolvedStatus.textContent = 'Unsolved';
            problemSolvedStatus.className = 'problem-solved-status unsolved';
        }
    }

    // --- Tag Initialization and Event Listener ---

    function initializeTags() {
        tagsContainer.innerHTML = ''; // Clear existing tags
        availableTags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.textContent = tag;
            tagSpan.classList.add('tag-button');
            tagSpan.setAttribute('data-tag', tag.toLowerCase()); // Store tag value in data attribute
            tagsContainer.appendChild(tagSpan);
        });

        tagsContainer.addEventListener('click', function(event) {
            const clickedTag = event.target;
            if (clickedTag.classList.contains('tag-button')) {
                const tagValue = clickedTag.getAttribute('data-tag');
                
                if (clickedTag.classList.contains('selected')) {
                    // Deselect tag
                    clickedTag.classList.remove('selected');
                    selectedTags = selectedTags.filter(tag => tag !== tagValue);
                } else {
                    // Select tag
                    clickedTag.classList.add('selected');
                    selectedTags.push(tagValue);
                }
                filterProblems();
                if (problemDisplay.classList.contains('hidden') && filteredProblems.length > 0) {
                    generateProblem();
                } else if (currentProblem) { // If a problem is already displayed, re-check filters and update
                    generateProblem(); // Re-generate to ensure it still matches new filters, or get a new one
                }
            }
        });
    }

    // --- Event Listeners for Filters and Handle ---

    generateBtn.addEventListener('click', generateProblem);
    nextBtn.addEventListener('click', generateProblem);

    problemTypeSelect.addEventListener('change', () => {
        filterProblems();
        if (problemDisplay.classList.contains('hidden') && filteredProblems.length > 0) {
            generateProblem();
        }
    });
    contestTypeSelect.addEventListener('change', () => {
        filterProblems();
        if (problemDisplay.classList.contains('hidden') && filteredProblems.length > 0) {
            generateProblem();
        }
    });
    minRatingInput.addEventListener('input', () => {
        filterProblems();
        if (problemDisplay.classList.contains('hidden') && filteredProblems.length > 0) {
            generateProblem();
        }
    });
    maxRatingInput.addEventListener('input', () => {
        filterProblems();
        if (problemDisplay.classList.contains('hidden') && filteredProblems.length > 0) {
            generateProblem();
        }
    });

    // Event listener for Codeforces handle button
    loadHandleBtn.addEventListener('click', () => {
        const handle = cfHandleInput.value.trim();
        if (handle) {
            fetchUserSubmissions(handle);
        } else {
            handleStatusMessage.textContent = 'Please enter a Codeforces handle.';
            handleStatusMessage.classList.add('error');
            solvedProblemsByUser.clear(); // Clear previously loaded data if handle is empty
            updateProblemSolvedStatus(); // Update status for currently displayed problem
        }
    });

    // Initial calls
    initializeTags(); // Populate tag buttons
    fetchAllData(); // Fetch problem data
});
