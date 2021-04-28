const sessionId = getSessionId();
const playerId = getPlayerId();

const domValidateWordButton = document.getElementById('btn-validate-word');
const domSubmitWordsButton = document.getElementById('btn-submit-words');
const domWordInput = document.getElementById('input-word');
const domWordsList = document.getElementById('grid-words-list');

let addedWords = [];

function addWord(word) {
    addedWords.push(word);
    const domContainer = document.createElement('div');
    const domText = document.createElement('span');
    domText.innerText = word;
    domContainer.appendChild(domText);
    domWordsList.appendChild(domContainer);
}

async function validateWord() {
    const word = domWordInput.value;
    fetch(`https://comp-eng-ess-final-project.herokuapp.com/validate_word`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            word,
        })
    }).then((result) => {
        console.log(result)
        if (result.ok) {
            domWordInput.value = '';
            addWord(word);
        }
        else {
            alert("Something went wrong. Make sure you enter a valid English word.");
        }
    });
}

function submitWords() {
    const sessionRef = getSessionRef(sessionId);
    sessionRef.child('words').set(addedWords).then(() => {
        sessionRef.child('phase').set(2).then(() => {
            window.location = 'game-waiting.html';
        });
    });
}

domValidateWordButton.onclick = validateWord;
domSubmitWordsButton.onclick = submitWords;
domWordInput.onkeypress = (e) => {
    if (e.key === "Enter") {
        validateWord();
    }
}
