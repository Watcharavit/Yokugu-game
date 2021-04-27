
const domRoomIdInput = document.getElementById('input-roomID');
const domNameInput = document.getElementById('input-name');

function getRandomIdString() {
    return Math.random().toString().substr(2, 8);
}

function createRoom() {
    const playerName = domNameInput.value;
    const sessionId = getRandomIdString();
    const playerId = getRandomIdString();
    const sessionDocRef = getSessionRef(sessionId);
    
    sessionDocRef.set({
        phase: 1,
        players: {
            [playerId]: {
                name: playerName,
                health: 100,
                level: 0,
            }
        },
        words: [

        ]
    }).then(() => {
        setSessionId(sessionId);
        setPlayerId(playerId);
        window.location = 'words.html';
    });
}

function joinRoom() {
    const sessionId = domRoomIdInput.value;
    const playerName = domNameInput.value;
    const playerId = getRandomIdString();
    const sessionDocRef = getSessionRef(sessionId);
    sessionDocRef.child('players').child(playerId).set({
        name: playerName,
        health: 100,
        level: 0,
    }).then(() => {
        setSessionId(sessionId);
        setPlayerId(playerId);
        window.location = 'game.html';
    });
}

document.getElementById('btn-create-room').onclick = createRoom;
document.getElementById('btn-join-room').onclick = joinRoom;