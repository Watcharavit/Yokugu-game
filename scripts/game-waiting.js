const sessionId = getSessionId();
const playerId = getPlayerId();

const domPlayersList = document.getElementById('grid-players-list');
const domCodeText = document.getElementById("text-room-code");
const domStartButton = document.getElementById("btn-start-game");

function addPlayerToTable(player) {
    const playerNameText = document.createElement('span');
    playerNameText.innerText = player.name;
    domPlayersList.appendChild(playerNameText);
}

function loadPlayers() {
    const sessionRef = getSessionRef(sessionId);
    sessionRef.child('players').on('child_added', (snapshot) => {
        const data = snapshot.val();
        addPlayerToTable(data);
    })
}

function setCodeText() {
    domCodeText.innerText = `Room Code: ${sessionId}`;
}

function prepareStartButton() {
    const sessionRef = getSessionRef(sessionId);
    sessionRef.child('phase').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data === 2) {
            domStartButton.disabled = false;
        }
        else {
            domStartButton.disabled = true;
        }
    });
}

function startGame() {
    const sessionRef = getSessionRef(sessionId);
    sessionRef.child('phase').set(3).then(() => {
        window.location = 'game-gameplay.html';
    });
}
domStartButton.onclick = startGame;

loadPlayers();
setCodeText();
prepareStartButton();