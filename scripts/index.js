
const domRoomIdInput = document.getElementById('input-roomID');
const domNameCreateRoom = document.querySelector('#input-create-name');
const domNameJoinRoom = document.querySelector('#input-join-name');

/* Random Nav-Logo Text :P */
const navbarLogo = document.getElementById("nav-changable");
const randomText = [`อ ย า ก น อ น`,`ง่ ว ง แ ล้ ว`, `SyntaxError`
                    , `CORS !!`,`API LIMIT!!`,`Out of API quota..., again!!`];
function justForFun(){
    let randomNumber = Math.trunc(Math.random() * randomText.length)
    navbarLogo.innerText = randomText[randomNumber];
}
justForFun();


function getRandomIdString() {
    return Math.random().toString().substr(2, 8);
}

function generateRandomColor() {
    color = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
    return color;
	// return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
}

function createRoom() {
    const playerName = domNameCreateRoom.value;
    if (!playerName.length) return;
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
        setIsRoomLeader(true);
        window.location = 'game-leader-opt.html';
    });
}

function joinRoom() {
    const playerName = domNameJoinRoom.value;
    if (!playerName.length) return;

    const sessionId = domRoomIdInput.value;
    const playerId = getRandomIdString();
    const sessionDocRef = getSessionRef(sessionId);
    sessionDocRef.get().then((snapshot) => {
        if (snapshot.exists()) {
            sessionDocRef.child('players').child(playerId).set({
                name: playerName,
                health: 100,
                level: 0,
                color: generateRandomColor()
            }).then(() => {
                setSessionId(sessionId);
                setPlayerId(playerId);
                setIsRoomLeader(false);
                window.location = 'game-waiting.html';
            });
        }
        else {
            alert("Room not found. Make sure your code is correct.");
        }
    });
}

document.getElementById('btn-create-room').onclick = createRoom;
document.getElementById('btn-join-room').onclick = joinRoom;