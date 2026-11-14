/* ==========================================================
   IT 3203 Project Milestone 2 - Quiz JavaScript Logic
   Handles: Timer, DOM reading, grading, feedback, and reset.
   ========================================================== */

// Correct Answer Key Definition
const answerKey = {
    q1: ["http", "hypertext transfer protocol"],
    q2: ["udp", "quic"],
    q3: "HTTP/0.9",
    q4: "no-memory",
    q5: "4xx",
    q6: "multiplexing",
    q7: "TLS",
    q8: "user-agent",
    q9: ["cookies", "jwt", "url-params"], // Multi-select correct choices
    q10: ["keep-alive", "host-header"]     // Multi-select correct choices
};

// Timer Variables
let totalSeconds = 600; // 10 minutes limit
let timerInterval = null;
let secondsElapsed = 0;

// Start the timer when the page loads
function startTimer() {
    const timerDisplay = document.getElementById("timer-display");
    
    timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! Submitting your quiz automatically.");
            gradeQuiz(true); // Auto-submit on timeout
            return;
        }

        totalSeconds--;
        secondsElapsed++;
        
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

// Format time spent string
function getFormattedTime(totalSecs) {
    let mins = Math.floor(totalSecs / 60);
    let secs = totalSecs % 60;
    return `${mins} minutes and ${secs} seconds`;
}

// Main Grading Function
function gradeQuiz(isTimeout = false) {
    // Stop the timer upon submission
    clearInterval(timerInterval);

    let score = 0;
    let totalQuestions = 10;

    // --- Question 1: Textbox ---
    let q1Val = document.getElementById("q1").value.trim().toLowerCase();
    let q1Correct = answerKey.q1.some(ans => q1Val.includes(ans));
    if (q1Correct) score++;
    showFeedback("q1", q1Correct, "Correct! Hypertext Transfer Protocol.");

    // --- Question 2: Textbox ---
    let q2Val = document.getElementById("q2").value.trim().toLowerCase();
    let q2Correct = answerKey.q2.some(ans => q2Val === ans);
    if (q2Correct) score++;
    showFeedback("q2", q2Correct, "Correct! UDP / QUIC transport protocol.");

    // --- Questions 3 to 8: Single-Choice Radios ---
    for (let i = 3; i <= 8; i++) {
        let selectedRadio = document.querySelector(`input[name="q${i}"]:checked`);
        let qId = `q${i}`;
        let isCorrect = selectedRadio && selectedRadio.value === answerKey[qId];
        if (isCorrect) score++;
        showFeedback(qId, isCorrect, `Correct answer was: <strong>${answerKey[qId]}</strong>`);
    }

    // --- Question 9: Checkboxes (Multi-select) ---
    let q9Checked = Array.from(document.querySelectorAll('input[name="q9"]:checked')).map(el => el.value);
    let q9Correct = q9Checked.length === answerKey.q9.length && answerKey.q9.every(val => q9Checked.includes(val));
    if (q9Correct) score++;
    showFeedback("q9", q9Correct, "Correct choices: Browser Cookies, JSON Web Tokens (JWT), and URL Query Parameters.");

    // --- Question 10: Checkboxes (Multi-select) ---
    let q10Checked = Array.from(document.querySelectorAll('input[name="q10"]:checked')).map(el => el.value);
    let q10Correct = q10Checked.length === answerKey.q10.length && answerKey.q10.every(val => q10Checked.includes(val));
    if (q10Correct) score++;
    showFeedback("q10", q10Correct, "Correct choices: Persistent Keep-Alive Connections and Host Headers.");

    // --- Calculate Pass / Fail (70% passing threshold = 7/10) ---
    let percentage = (score / totalQuestions) * 100;
    let passed = score >= 7;
    let timeSpentStr = getFormattedTime(secondsElapsed);

    // --- Display Results Summary Panel ---
    let resultsBox = document.getElementById("quiz-results");
    resultsBox.style.display = "block";
    resultsBox.className = passed ? "result-pass" : "result-fail";

    resultsBox.innerHTML = `
        <h2 style="margin-top: 0; color: ${passed ? '#27ae60' : '#e74c3c'};">
            Result: ${passed ? 'PASSED 🎉' : 'FAILED ❌'}
        </h2>
        <p><strong>Total Score:</strong> ${score} / ${totalQuestions} (${percentage}%)</p>
        <p><strong>Passing Requirement:</strong> 70% or higher</p>
        <p><strong>Time Spent:</strong> ${timeSpentStr}</p>
        <p><em>Review your individual question feedback highlighted below in green or red.</em></p>
    `;

    // Scroll smoothly to results top
    resultsBox.scrollIntoView({ behavior: 'smooth' });

    // Disable submit button after grading until reset
    document.getElementById("submit-quiz-btn").disabled = true;
}

// Helper to display per-question feedback boxes
function showFeedback(qId, isCorrect, explanationText) {
    let feedbackDiv = document.getElementById(`${qId}-feedback`);
    feedbackDiv.style.display = "block";
    feedbackDiv.className = `question-feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
    feedbackDiv.innerHTML = isCorrect ? `✅ Correct!` : `❌ Incorrect. ${explanationText}`;
}

// Reset / Retake Quiz Function
function resetQuiz() {
    // Reset form inputs
    document.getElementById("http-quiz-form").reset();

    // Hide results panel
    let resultsBox = document.getElementById("quiz-results");
    resultsBox.style.display = "none";
    resultsBox.className = "";
    resultsBox.innerHTML = "";

    // Hide all individual feedback boxes
    let feedbacks = document.querySelectorAll(".question-feedback");
    feedbacks.forEach(el => {
        el.style.display = "none";
        el.innerHTML = "";
    });

    // Re-enable submit button
    document.getElementById("submit-quiz-btn").disabled = false;

    // Reset timer variables and restart clock
    clearInterval(timerInterval);
    totalSeconds = 600;
    secondsElapsed = 0;
    document.getElementById("timer-display").textContent = "10:00";
    startTimer();
}

// Event Listeners on DOM load
document.addEventListener("DOMContentLoaded", () => {
    startTimer();

    document.getElementById("submit-quiz-btn").addEventListener("click", () => {
        gradeQuiz(false);
    });

    document.getElementById("reset-quiz-btn").addEventListener("click", () => {
        resetQuiz();
    });
});
