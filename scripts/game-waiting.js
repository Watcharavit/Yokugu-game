const sessionId = getSessionId();
const playerId = getPlayerId();

const domPlayersList = document.getElementById('grid-players-list');
const domCodeText = document.getElementById("text-room-code");
const domStartButton = document.getElementById("btn-start-game");
const domWaitText = document.getElementById("text-wait-start");

function addPlayerToTable(player, id) {
    const playerNameText = document.createElement('span');
    playerNameText.innerText = (id === playerId) ? `${player.name} (You)` : player.name;
    domPlayersList.appendChild(playerNameText);
}

function loadPlayers() {
    const sessionRef = getSessionRef(sessionId);
    sessionRef.child('players').on('child_added', (snapshot) => {
        const data = snapshot.val();
        const id = snapshot.ref.key;
        addPlayerToTable(data, id);
    });
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
        else if (data === 3) {
            window.location = 'game-gameplay.html';
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

if (getIsRoomLeader()) {
    domStartButton.onclick = startGame;
    domWaitText.remove();
}
else {
    domStartButton.remove();
}

loadPlayers();
setCodeText();
prepareStartButton();