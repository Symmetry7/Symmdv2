document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const problemTypeSelect = document.getElementById('problem-type');
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

    // Data variables
    let problems = [];
    let filteredProblems = [];
    let currentProblem = null;
    const contestNames = {}; // Cache for contest names

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
        const minRating = parseInt(minRatingInput.value) || 800;
        const maxRating = parseInt(maxRatingInput.value) || 3500;

        filteredProblems = problems.filter(problem => {
            const typeMatch = problemType === 'random' || problem.index === problemType;
            const ratingMatch = problem.rating && (problem.rating >= minRating && problem.rating <= maxRating);
            return typeMatch && ratingMatch;
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
            return;
        }

        const randomIndex = Math.floor(Math.random() * currentFilteredProblems.length);
        currentProblem = currentFilteredProblems[randomIndex];

        problemTitle.textContent = currentProblem.name;
        problemTypeBadge.textContent = currentProblem.index;
        problemTypeBadge.className = `problem-type-badge problem-type-${currentProblem.index}`;
        problemContestId.textContent = `${getFormattedContestName(currentProblem.contestId)} / ID: ${currentProblem.contestId}${currentProblem.index}`;
        problemRating.textContent = `Rating: ${currentProblem.rating}`; // Display rating here, pointer adds category
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

        problemDisplay.classList.remove('animate__fadeInUp');
        void problemDisplay.offsetWidth;
        problemDisplay.classList.add('animate__fadeInUp');
    }

    // --- Event Listeners ---

    generateBtn.addEventListener('click', generateProblem);
    nextBtn.addEventListener('click', generateProblem);

    problemTypeSelect.addEventListener('change', () => {
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

    // Initial data fetch when the page loads
    fetchAllData();
});