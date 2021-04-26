


const domRoomIdInput = document.getElementById('room-id-input');
const domNameInput = document.getElementById('name-input');

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

document.getElementById('create-room-button').onclick = createRoom;
document.getElementById('join-room-button').onclick = joinRoom;