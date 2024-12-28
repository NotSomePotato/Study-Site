let score = 0;
let totalWords = 0;
let currentWordIndex = 0;
let resultsLog = [];
let correctWord = null;
let dictionary = [];
let unusedWords = [];
let listNames = [];
let wordLists = [];
let wordCountSection = document.getElementById('wordCountSection');
let quizSection = document.getElementById('quizSection');
let resultSection = document.getElementById('resultSection');
let wordCountInput = document.getElementById('wordCountInput');

wordCountInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        startQuiz();
    }
});

function readJSONFile() {
    fetch('NounList.json')
        .then(response => response.json())
        .then(data => {
            listNames = Object.keys(data);
            wordLists = Object.values(data);
            createCheckboxes(listNames);
        })
        .catch(error => console.error('Error:', error));
}

function createCheckboxes(names) {
    const wordCountSection = document.getElementById('wordCountSection');
    
    // Create a container for checkboxes
    const checkboxContainer = document.createElement('div');
    checkboxContainer.id = 'checkboxContainer';
    checkboxContainer.style.display = 'flex';
    checkboxContainer.style.flexWrap = 'wrap';
    
    names.forEach((name, index) => {
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.style.width = '30%';
        checkboxWrapper.style.marginBottom = '15px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = name;
        checkbox.name = name;
        checkbox.checked = true

        const label = document.createElement('label');
        label.htmlFor = name;
        label.appendChild(document.createTextNode(`${formatListName(name)} (${wordLists[index].length})`));
        
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label);
        
        checkboxContainer.appendChild(checkboxWrapper);
        
    });
    
    // Insert the checkbox container before the first child of wordCountSection
    wordCountSection.insertBefore(checkboxContainer, wordCountSection.firstChild);
}
// Function to format list names
function formatListName(name) {
    var newname = name.replace(/([0-9])/g, ' $1 ')
    return newname.replace(/([A-Z])/g, ' $1').trim();
}

// Call the function to read the JSON file when the page loads
document.addEventListener('DOMContentLoaded', readJSONFile);


function startQuiz() {
    const wordCount = parseInt(wordCountInput.value);

    if (isNaN(wordCount) || wordCount <= 0) {
        alert("Please enter a valid number of words.");
        return;
    }

    // Clear the dictionary before adding new words
    dictionary = [];

    // Get all checkboxes
    const checkboxes = document.querySelectorAll('#checkboxContainer input[type="checkbox"]');

    // Iterate through checkboxes
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            // Add the corresponding word list to the dictionary
            dictionary = dictionary.concat(wordLists[index]);
        }
    });

    if (wordCount > dictionary.length) {
        alert(`There are only ${dictionary.length} words available. Please enter a smaller number.`);
        return;
    }
    // alert(`Count: ${dictionary.length}`);
    score = 0;
    totalWords = wordCount;
    currentWordIndex = 0;
    resultsLog = [];
    unusedWords = [...dictionary]; // Create a copy of the dictionary
    wordCountSection.style.display = 'none';
    quizSection.style.display = 'block';
    resultSection.style.display = 'none';

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
        button.addEventListener('click', () => checkMeaning(option));
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


function checkMeaning(option) {
    const optionsDiv = document.getElementById('options');

    if (option.isCorrect) {
        document.getElementById('wordDisplay').innerHTML += ` <span class='correct'>Correct Meaning</span>`;
        showGenderButtons(); // Show gender buttons only if the meaning is correct
    } else {
        document.getElementById('wordDisplay').innerHTML += ` <span class='wrong'>Wrong Meaning</span>`;
        resultsLog.push({
            word: correctWord.word,
            meaningGuess: `Wrong - ${option.meaning}`,
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
            genderGuess: `Wrong - ${selectedGender}`,
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
 
