const sessionId = getSessionId();
const playerId = getPlayerId();

const domValidateWordButton = document.getElementById('btn-validate-word');
const domSubmitWordsButton = document.getElementById('btn-submit-words');
const domWordInput = document.getElementById('input-word');
const domWordsList = document.getElementById('grid-words-list');
const domCurrentStatusLoading = document.getElementById('current-status-text-loading');
const domCurrentStatusAccepted = document.getElementById('current-status-text-accepted');
const domCurrentStatusRejected = document.getElementById('current-status-text-rejected');

let addedWords = new Set();

function addWord(word) {
    addedWords.add(word);
    const domContainer = document.createElement('div');
    domContainer.classList.add('added-word-container');
    const domText = document.createElement('span');
    const domRemoveButton = document.createElement('button');
    domRemoveButton.innerText = '✖';
    domText.innerText = word;
    domContainer.appendChild(domText);
    domContainer.appendChild(domRemoveButton);
    domRemoveButton.onclick = () => {
        addedWords.delete(word);
        domContainer.remove();
    };
    domWordsList.appendChild(domContainer);
}


function clearStatus() {
    domCurrentStatusLoading.classList.replace('visible', 'hidden');
    domCurrentStatusAccepted.classList.replace('visible', 'hidden');
    domCurrentStatusRejected.classList.replace('visible', 'hidden');
}

let validateLock = false;
async function validateWord() {

    const word = domWordInput.value.toLowerCase();
    if (!word.length) return;

    if (validateLock) return;
    validateLock = true;

    clearStatus();
    domCurrentStatusLoading.classList.replace('hidden', 'visible');

    fetch(`https://comp-eng-ess-final-project.herokuapp.com/validate_word`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            word,
        })
    }).then((result) => {
        if (result.ok) {
            domWordInput.value = '';
            if (!addedWords.has(word)) addWord(word);
            clearStatus();
            domCurrentStatusAccepted.classList.replace('hidden', 'visible');
        }
        else {
            clearStatus();
            domCurrentStatusRejected.classList.replace('hidden', 'visible');
        }
    }).finally(() => {
        validateLock = false;
    });
}

function submitWords() {
    const sessionRef = getSessionRef(sessionId);
    sessionRef.child('words').set([...addedWords]).then(() => {
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
