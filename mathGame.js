let currentQuestionType;
let questionDisplay = document.getElementById('questionDisplay');
let answerInput = document.getElementById('answerInput');
let resultDisplay = document.getElementById('resultDisplay');

function generateQuestion() {
    const questionType = Math.floor(Math.random() * 3); // Randomly choose a question type
    currentQuestionType = questionType;

    if (questionType === 0) {
        // Multiplication Question
        const num1 = Math.floor(Math.random() * 13); // Random number from 0 to 12
        const num2 = Math.floor(Math.random() * 13);
        questionDisplay.innerText = `What is ${num1} x ${num2}?`;
        
        return num1 * num2; // Return the correct answer

    } else if (questionType === 1) {
        // Power Question
        const base = Math.floor(Math.random() * 7); // Base from 0 to 6
        const exponent = Math.floor(Math.random() * 7); // Exponent from 0 to 6
        questionDisplay.innerText = `What is ${base} raised to the power of ${exponent}?`;
        
        return Math.pow(base, exponent); // Return the correct answer

    } else {
        // Root Question
        const rootNumber = Math.floor(Math.random() * 401); // Random number from 0 to 400
        const rootBase = Math.floor(Math.random() * 21) + 2; // Root base from 2 to 20
        questionDisplay.innerText = `What is the ${rootBase}th root of ${rootNumber}?`;
        
        return Math.round(Math.pow(rootNumber, 1 / rootBase)); // Return rounded answer
    }
}

let correctAnswer = generateQuestion();

document.getElementById('submitAnswer').onclick = function() {
    const userAnswer = parseFloat(answerInput.value);
    
    if (userAnswer === correctAnswer) {
        resultDisplay.innerText = "Correct!";
    } else {
        resultDisplay.innerText = `Wrong! The correct answer was ${correctAnswer}.`;
    }

    answerInput.value = ''; // Clear input field after submission
};

document.getElementById('nextQuestion').onclick = function() {
    resultDisplay.innerText = ''; // Clear previous result display
    correctAnswer = generateQuestion(); // Generate new question
};

// Initial call to generate a question on page load
generateQuestion();
