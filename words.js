const domWordsTextarea = document.getElementById('words-textarea');

const sessionId = getSessionId();
const playerId = getPlayerId();

function submitWords() {
    const words = domWordsTextarea.value.split(';').map(w => w.trim());
    const sessionRef = getSessionRef(sessionId);
    sessionRef.child('words').set(words).then(() => {
        window.location = 'game.html';
    });
}

document.getElementById('submit-words-button').onclick = submitWords;