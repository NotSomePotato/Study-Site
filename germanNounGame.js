let score = 0;
let totalWords = 0;
let currentWordIndex = 0;
let resultsLog = [];
let correctWord = null;
let dictionary = [];
let unusedWords = [];
let wordCountSection = document.getElementById('wordCountSection');
let quizSection = document.getElementById('quizSection');
let resultSection = document.getElementById('resultSection');
let wordCountInput = document.getElementById('wordCountInput');
wordCountInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        startQuiz();
    }
});

// Fetch the dictionary from the NounList.json file
fetch('./NounList.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        dictionary = data;
        document.getElementById('startButton').disabled = false; // Enable start button
    })
    .catch(error => console.error("Error loading JSON file:", error));

document.getElementById('startButton').addEventListener('click', startQuiz);

function startQuiz() {
    const wordCount = parseInt(wordCountInput.value);

    if (isNaN(wordCount) || wordCount <= 0) {
        alert("Please enter a valid number of words.");
        return;
    }

    if (wordCount > dictionary.length) {
        alert(`There are only ${dictionary.length} words available. Please enter a smaller number.`);
        return;
    }

    score = 0;
    totalWords = wordCount;
    currentWordIndex = 0;
    resultsLog = [];
    unusedWords = [...dictionary]; // Create a copy of the dictionary
    wordCountSection.style.display = 'none';
    quizSection.style.display = 'block';

    showNextWord();
}


function showNextWord() {
    if (currentWordIndex >= totalWords) {
        showResults();
        return;
    }

    const randomIndex = Math.floor(Math.random() * unusedWords.length);
    correctWord = unusedWords[randomIndex];
    unusedWords.splice(randomIndex, 1); // Remove the used word from the array

    const options = generateOptions(correctWord.meaning);

    document.getElementById('wordDisplay').innerText = correctWord.word;

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    // Create buttons for meanings
    options.forEach((option) => {
        const button = document.createElement('button');
        button.innerText = option.meaning;
        button.classList.add("meaning-button");
        button.addEventListener('click', () => checkMeaning(option.isCorrect));
        optionsDiv.appendChild(button);
    });

    currentWordIndex++;
}


function generateOptions(correctMeaning) {
    const options = [];

    // Add the correct answer
    options.push({ meaning: correctMeaning, isCorrect: true });

    // Generate incorrect answers
    while (options.length < 4) {
        const randomIndex = Math.floor(Math.random() * dictionary.length);
        const randomMeaning = dictionary[randomIndex].meaning;

        if (!options.some(option => option.meaning === randomMeaning) && 
            unusedWords.some(word => word.meaning === randomMeaning)) {
            options.push({ meaning: randomMeaning, isCorrect: false });
        }
    }

    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
}


function checkMeaning(isCorrect) {
    const optionsDiv = document.getElementById('options');

    if (isCorrect) {
        document.getElementById('wordDisplay').innerHTML += ` <span class='correct'>Correct Meaning</span>`;
        showGenderButtons(); // Show gender buttons only if the meaning is correct
    } else {
        document.getElementById('wordDisplay').innerHTML += ` <span class='wrong'>Wrong Meaning</span>`;
        resultsLog.push({
            word: correctWord.word,
            meaningGuess: 'Wrong',
            genderGuess: 'N/A',
            actualMeaning: correctWord.meaning,
            actualGender: correctWord.gender,
            scoreAwarded: 0,
        });

        // Proceed to next word after a short delay
        setTimeout(showNextWord, 1000);
        return; // Exit the function early
    }
}

function showGenderButtons() {
    const optionsDiv = document.getElementById('options');

    // Clear existing buttons and add gender buttons
    optionsDiv.innerHTML = '';

    ["Masculine", "Feminine", "Neutral"].forEach((gender) => {
        const button = document.createElement('button');
        button.innerText = gender;
        button.classList.add(gender.toLowerCase());
        button.addEventListener('click', () => checkGender(gender));
        optionsDiv.appendChild(button);
    });
}

function checkGender(selectedGender) {
    let pointsAwarded;

    if (selectedGender === correctWord.gender) {
        document.getElementById('wordDisplay').innerHTML += ` <span class='correct'>Correct Gender</span>`;
        pointsAwarded = 1; // Full point for both correct meaning and gender
        score++;

        resultsLog.push({
            word: correctWord.word,
            meaningGuess: 'Correct',
            genderGuess: 'Correct',
            actualMeaning: correctWord.meaning,
            actualGender: correctWord.gender,
            scoreAwarded: pointsAwarded,
        });
        
    } else {
        document.getElementById('wordDisplay').innerHTML += ` <span class='wrong'>Wrong Gender</span>`;
        pointsAwarded = 0.5; // Half point for correct meaning but wrong gender
        score += 0.5;

        resultsLog.push({
            word: correctWord.word,
            meaningGuess: 'Correct',
            genderGuess: 'Wrong',
            actualMeaning: correctWord.meaning,
            actualGender: correctWord.gender,
            scoreAwarded: pointsAwarded,
        });
        
     }
     
     // Proceed to next word after a short delay
     setTimeout(showNextWord, 1000);
}

function showResults() {
    document.getElementById('finalScore').innerText = `${score} out of ${totalWords}`;
 
    const resultsLogUl = document.getElementById('resultsLog');
    resultsLogUl.innerHTML = '';
 
    resultsLog.forEach(entry => {
        const li = document.createElement('li');
        
        // Determine the class based on score awarded
        let scoreClass;
        if (entry.scoreAwarded === 1) {
            scoreClass = 'green';
        } else if (entry.scoreAwarded === 0.5) {
            scoreClass = 'orange';
        } else {
            scoreClass = 'red';
        }
 
        // Set inner HTML with colored word
        li.innerHTML = `<span class="${scoreClass}">${entry.word}</span>: Meaning - ${entry.actualMeaning} (${entry.meaningGuess}), Gender - ${entry.actualGender} (${entry.genderGuess}), Score Awarded - ${entry.scoreAwarded}`;
        
        resultsLogUl.appendChild(li);
    });
 
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = ""; // Clear all question-related buttons
    quizSection.style.display = 'none';
    resultSection.style.display = 'block';
    wordCountSection.style.display = 'block';
    // resultSection.classList.remove('hidden');
 }
 
