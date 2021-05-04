const sessionId = getSessionId();
const playerId = getPlayerId();

const sessionRef = getSessionRef(sessionId);

const domValidateWordButton = document.getElementById('btn-validate-word');
const domSubmitWordsButton = document.getElementById('btn-submit-words');
const domWordInput = document.getElementById('input-word');
const domWordsList = document.getElementById('grid-words-list');
const domCurrentStatusLoading = document.getElementById('current-status-text-loading');
const domCurrentStatusAccepted = document.getElementById('current-status-text-accepted');
const domCurrentStatusRejected = document.getElementById('current-status-text-rejected');
const domCurrentStatusRequired = document.getElementById('current-status-text-required');
const domCurrentStatusError = document.getElementById('current-status-text-error');
const domRemovedWord = document.getElementById('text-removed-word');
const domUndoButton = document.getElementById('btn-undo-delete');


let addedWords = new Set();
let deletedWords = [];
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
    domRemoveButton.onclick = (e) => {
        e.preventDefault();
        deletedWords.push(word);
        addedWords.delete(word);
        domUndoButton.classList.replace("hidden", "visible");
        domRemovedWord.innerText = `"${word}" removed.`;
        domContainer.remove();
    };
    domWordsList.appendChild(domContainer);
}

function undoDelete() {
    if (deletedWords.length > 0) {
        const word = deletedWords.pop();
        addWord(word);
        if (deletedWords.length > 0) {
            domRemovedWord.innerText = `"${deletedWords[deletedWords.length - 1]}" removed.`;
        }
        else {
            domUndoButton.classList.replace("visible", "hidden");
        }
    }
    
}


function clearStatus() {
    domCurrentStatusLoading.classList.replace('visible', 'hidden');
    domCurrentStatusAccepted.classList.replace('visible', 'hidden');
    domCurrentStatusRejected.classList.replace('visible', 'hidden');
    domCurrentStatusRequired.classList.replace('visible', 'hidden');
    domCurrentStatusError.classList.replace('visible', 'hidden');
}

let validateLock = false;
async function validateWord() {
    const word = domWordInput.value.toLowerCase();
    if (!word.length) return;

    if (validateLock) return;
    validateLock = true;

    clearStatus();
    domCurrentStatusLoading.classList.replace('hidden', 'visible');

    try {
        const res = await fetch(`https://comp-eng-ess-final-project.herokuapp.com/validate_word`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                word,
            })
        });
        if (res.ok) {
            domWordInput.value = '';
            if (!addedWords.has(word)) addWord(word);
            clearStatus();
            domCurrentStatusAccepted.classList.replace('hidden', 'visible');
        }
        else {
            clearStatus();
            domCurrentStatusRejected.classList.replace('hidden', 'visible');
        }
    }
    catch {
        clearStatus();
        domCurrentStatusRejected.classList.replace('hidden', 'visible');
    }
    finally {
        validateLock = false;
    }
}

async function submitWords() {
    if (addedWords.size == 0) {
        clearStatus();
        domCurrentStatusRequired.classList.replace('hidden', 'visible');
    }
    else {
        try {
            clearStatus();
            domCurrentStatusLoading.classList.replace('hidden', 'visible');
            await sessionRef.update({
                words: [...addedWords],
                phase: 2
            });
            clearStatus();
            window.location = 'game-waiting.html';
        }
        catch {
            clearStatus();
            domCurrentStatusError.classList.replace('hidden', 'visible');
        }
    }
}

function loadAdded() {
    sessionRef.child('words').get().then((snapshot) => {
        if (snapshot.exists()) {
            const existingWords = snapshot.val();
            for (w of existingWords) {
                addWord(w);
            }
        }
    });
}

domValidateWordButton.onclick = validateWord;
domSubmitWordsButton.onclick = submitWords;
domUndoButton.onclick = undoDelete;
domWordInput.onkeypress = (e) => {
    if (e.key === "Enter") {
        validateWord();
    }
}
loadAdded();