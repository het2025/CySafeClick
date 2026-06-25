let currentQ = 0;
let userScores = [];
let categoryScores = {};
let quizQuestions = [];

document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for translator to initialize
    setTimeout(initQuiz, 500);
});

async function initQuiz() {
    const t = window.safeclickTranslator;
    quizQuestions = t.translate('SAFETY_SCORE.QUESTIONS');
    if (!Array.isArray(quizQuestions)) {
        console.error("Failed to load questions from translator.");
        return;
    }
    loadQuestion();
}

function loadQuestion() {
    const q = quizQuestions[currentQ];
    document.getElementById('progress-fill').style.width = `${((currentQ) / quizQuestions.length) * 100}%`;
    document.getElementById('question-text').textContent = q.Q;
    
    const optionsList = document.getElementById('options-list');
    optionsList.innerHTML = '';
    
    q.OPTIONS.forEach((opt, index) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.textContent = opt.TEXT;
        div.onclick = () => selectOption(index);
        optionsList.appendChild(div);
    });
}

function selectOption(index) {
    const q = quizQuestions[currentQ];
    const selected = q.OPTIONS[index];
    
    userScores.push(selected);
    
    // Track category scores
    if (!categoryScores[selected.CAT]) categoryScores[selected.CAT] = { total: 0, earned: 0 };
    categoryScores[selected.CAT].total += 10;
    categoryScores[selected.CAT].earned += selected.SCORE;

    currentQ++;
    if (currentQ < quizQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('quiz-page').style.display = 'none';
    document.getElementById('results-page').style.display = 'block';
    
    const t = window.safeclickTranslator;
    const totalScore = userScores.reduce((acc, curr) => acc + curr.SCORE, 0);
    document.getElementById('final-score').textContent = totalScore;
    
    let grade = 'D';
    if (totalScore >= 80) grade = 'A';
    else if (totalScore >= 60) grade = 'B';
    else if (totalScore >= 40) grade = 'C';
    
    document.getElementById('grade-text').textContent = `${t.translate('SAFETY_SCORE.GRADE')}: ${grade}`;
    
    const recList = document.getElementById('rec-list');
    userScores.forEach(s => {
        if (s.TIP) {
            const li = document.createElement('li');
            li.textContent = s.TIP;
            recList.appendChild(li);
        }
    });

    initChart();
}

function initChart() {
    const ctx = document.getElementById('scoreChart').getContext('2d');
    const labels = Object.keys(categoryScores);
    const data = labels.map(l => (categoryScores[l].earned / categoryScores[l].total) * 100);
    const t = window.safeclickTranslator;

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: t.translate('SAFETY_SCORE.TITLE') + ' %',
                data: data,
                backgroundColor: 'rgba(255, 153, 51, 0.2)',
                borderColor: '#FF9933',
                pointBackgroundColor: '#FF9933'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { display: false },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
}

// Language change listener to restart quiz
window.addEventListener('languageChanged', () => {
    location.reload(); // Simplest for quiz reset
});
