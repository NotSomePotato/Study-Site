let currentQuestionType;
let questionDisplay = document.getElementById('questionDisplay');
let timerDisplay = document.getElementById('timerDisplay');
let answerInput = document.getElementById('answerInput');
let resultDisplay = document.getElementById('resultDisplay');
let questionCountInput = document.getElementById('questionCount');
let questionCountSection = document.getElementById('questionCountSection');
let gameSection = document.getElementById('gameSection');
let resultsSection = document.getElementById('resultsSection');
let currentScoreDisplay = document.getElementById('currentScore');
let totalQuestionsDisplay = document.getElementById('totalQuestions');

let timer; 
let timeLeft; 
let totalQuestions;
let currentQuestionIndex = 0;
let currentScore = 0;
let correctAnswer;
let hasAnswered = false;
let questionLog = []; // Array to store question log
const powerArray = [8, 5, 4, 4, 3, 3]


// Start Game Event Listeners
questionCountInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        startGame();
    }
});
answerInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

function startGame() {
    totalQuestions = parseInt(questionCountInput.value);

    if (isNaN(totalQuestions) || totalQuestions < 1) {
        alert('Please enter a valid number of questions');
        return;
    }

    // Hide question count section, show game section
    questionCountSection.style.display = 'none';
    resultsSection.style.display = 'none';
    gameSection.style.display = 'block';

    // Reset game variables
    currentQuestionIndex = 0;
    currentScore = 0;
    questionLog = [];
    currentScoreDisplay.innerText = currentScore;
    totalQuestionsDisplay.innerText = totalQuestions;

    // Generate first question and start timer
    nextQuestion();
}

function generateQuestion() {
    const questionType = Math.floor(Math.random() * 3);
    timerDisplay.innerText = `[${questionType}]`;
    startTimer(5 * (questionType + 1));
    if (questionType === 0) {
        // Multiplication Question
        const num1 = Math.floor(Math.random() * 10 + 2);
        const num2 = Math.floor(Math.random() * 10 + 2);
        questionDisplay.innerText = `What is ${num1} x ${num2}?`;
        
        return num1 * num2;

    } else if (questionType === 1) {
        // Power Question
        const base = Math.floor(Math.random() * 19) + 2;
        // Check if the number is bigger than 7
        var exponent = 0
        if (base > 7) {
            var exponent = 2
        }
        else {
            var exponent = Math.floor(Math.random() * (powerArray[base - 2] - 1)) + 2;
        }
        
        questionDisplay.innerText = `What is ${base} raised to the power of ${exponent}?`;
        console.log(`What is ${base} raised to the power of ${exponent}?`);
        return Math.pow(base, exponent);

    } else {
        // Root Question
        // Power Question
        const base = Math.floor(Math.random() * 19) + 2;
        var exponent = 0
        // Check if the number is bigger than 7
        if (base > 7) {
            var exponent = 2
        }
        else {
            var exponent = Math.floor(Math.random() * (powerArray[base - 2] - 1)) + 2;
        }
        const finalNum = Math.pow(base, exponent)
        console.log(`What is the ${exponent}th root of ${finalNum}?`);
        questionDisplay.innerText = `What is the ${exponent}th root of ${finalNum}?`;
        
        return base;
    }
}

function checkAnswer() {
    if (hasAnswered) return;

    clearInterval(timer);
    const userAnswer = parseFloat(answerInput.value);
    
    let isCorrect = userAnswer === correctAnswer;
    
    if (isCorrect) {
        resultDisplay.innerText = "Correct!";
        currentScore++;
        currentScoreDisplay.innerText = currentScore;
    } else {
        resultDisplay.innerText = `Wrong! The correct answer was ${correctAnswer}.`;
    }

    // Log the question and answer
    questionLog.push({
        question: questionDisplay.innerText,
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect
    });

    answerInput.value = '';
    hasAnswered = true;

    setTimeout(nextQuestion, 1000);
}

function nextQuestion() {
    if (currentQuestionIndex >= totalQuestions) {
        endGame();
        return;
    }

    resultDisplay.innerText = '';
    hasAnswered = false;
    
    correctAnswer = generateQuestion();
    

    
    currentQuestionIndex++;
}

function startTimer(duration) {
    timeLeft = duration;
    timerDisplay.innerText = `[${timeLeft}]`;

    timer = setInterval(() => {
        timeLeft--;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            resultDisplay.innerText = `Time's up! The correct answer was ${correctAnswer}.`;
            hasAnswered = true;

            // Log the question and answer for timed out questions
            questionLog.push({
                question: questionDisplay.innerText,
                userAnswer: "Time's up",
                correctAnswer: correctAnswer,
                isCorrect: false
            });

            setTimeout(nextQuestion, 1000);
        } else {
            timerDisplay.innerText = `[${timeLeft}]`;
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    
    gameSection.style.display = 'none';
    questionCountSection.style.display = 'block';
    
    
    // Create and display the question log
    let logHTML = "<h2>Question Log:</h2><div class='question-log'>";
    
    questionLog.forEach((item, index) => {
        let color = item.isCorrect ? "green" : "red";
        
        logHTML += `<div class="log-item">
                    <span style="color: ${color}">${index + 1}.</span> ${item.question} | Your answer: ${item.userAnswer} | Correct answer: ${item.correctAnswer}</div>`;
    });
    
    logHTML += "</div>";

    // Display final score and log in results section
    document.getElementById('finalScore').innerHTML = `Your final score is ${currentScore} out of ${totalQuestions}`;
    document.getElementById('questionLog').innerHTML = logHTML;
    
    // Show results section
    resultsSection.style.display = 'block';
    
    // Add event listener to play again button
    document.getElementById('playAgain').addEventListener('click', playAgain);
}

// Add this line at the end of your existing code
document.getElementById('playAgain').addEventListener('click', playAgain);

