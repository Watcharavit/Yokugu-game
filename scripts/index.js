
const domRoomIdInput = document.getElementById('input-roomID');
const domNameCreateRoom = document.getElementById('input-create-name');
const domNameJoinRoom = document.getElementById('input-join-name');
const domStatusLoading = document.getElementById("current-status-text-loading");
const domStatusError = document.getElementById("current-status-text-error");
const domButtonCreateRoom = document.getElementById('btn-create-room');
const domButtonJoinRoom = document.getElementById('btn-join-room');

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
let operationLock = false;
async function createRoom() {
    if (operationLock) return;
    operationLock = true;
    domStatusLoading.classList.remove("hidden");
    domStatusError.classList.add("hidden");
    try {
        const playerName = domNameCreateRoom.value;
        if (!playerName.length) {
            domStatusError.innerText = "❌ Name must be at least 1 character long";
            domStatusError.classList.remove("hidden");
            return;
        }
        const sessionId = getRandomIdString();
        const playerId = getRandomIdString();
        const sessionDocRef = getSessionRef(sessionId);
        
        await sessionDocRef.set({
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
        });
        setSessionId(sessionId);
        setPlayerId(playerId);
        setIsRoomLeader(true);
        window.location = 'game-leader-opt.html';
    }
    catch {
        domStatusError.innerText = "❌ Something went wrong. Please try again!";
        domStatusError.classList.remove("hidden");
    }
    finally {
        operationLock = false;
        domStatusLoading.classList.add("hidden");
    }
}

async function joinRoom() {
    if (operationLock) return;
    operationLock = true;
    domStatusLoading.classList.remove("hidden");
    domStatusError.classList.add("hidden");
    try {
        const playerName = domNameJoinRoom.value;
        if (!playerName.length) {
            domStatusError.innerText = "❌ Name must be at least 1 character long";
            domStatusError.classList.remove("hidden");
            return;
        }
        const sessionId = domRoomIdInput.value;
        if (!/\d+/.test(sessionId)) {
            domStatusError.innerText = "❌ Room not found. Make sure your code is correct.";
            domStatusError.classList.remove("hidden");
            return;
        }

        const playerId = getRandomIdString();
        const sessionDocRef = getSessionRef(sessionId);
        const sessionSnapshot = await sessionDocRef.get();
        
        if (sessionSnapshot.exists()) {
            await sessionDocRef.child('players').child(playerId).set({
                name: playerName,
                health: 100,
                level: 0,
                color: generateRandomColor()
            });
            setSessionId(sessionId);
            setPlayerId(playerId);
            setIsRoomLeader(false);
            window.location = 'game-waiting.html';
        }
        else {
            domStatusError.innerText = "❌ Room not found. Make sure your code is correct.";
            domStatusError.classList.remove("hidden");
        }
    }
    catch {
        domStatusError.innerText = "❌ Something went wrong. Please try again!";
        domStatusError.classList.remove("hidden");
    }
    finally {
        operationLock = false;
        domStatusLoading.classList.add("hidden");
    }
}

domButtonCreateRoom.onclick = createRoom;
domButtonJoinRoom.onclick = joinRoom;