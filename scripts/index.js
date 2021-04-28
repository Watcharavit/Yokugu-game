
const domRoomIdInput = document.getElementById('input-roomID');
const domNameCreateRoom = document.querySelector('#input-create-name');
const domNameJoinRoom = document.querySelector('#input-join-name');


function getRandomIdString() {
    return Math.random().toString().substr(2, 8);
}

function generateRandomColor() {
	return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
}

function createRoom() {
    const playerName = domNameCreateRoom.value;
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
                color: generateRandomColor()
            }
        },
        words: [

        ]
    }).then(() => {
        setSessionId(sessionId);
        setPlayerId(playerId);
        window.location = 'game-leader-opt.html';
    });
}

function joinRoom() {
    const sessionId = domRoomIdInput.value;
    const playerName = domNameJoinRoom.value;
    const playerId = getRandomIdString();
    const sessionDocRef = getSessionRef(sessionId);
    sessionDocRef.child('players').child(playerId).set({
        name: playerName,
        health: 100,
        level: 0,
        color: generateRandomColor()
    }).then(() => {
        setSessionId(sessionId);
        setPlayerId(playerId);
        window.location = 'game-waiting.html';
    });
}

document.getElementById('btn-create-room').onclick = createRoom;
document.getElementById('btn-join-room').onclick = joinRoom;