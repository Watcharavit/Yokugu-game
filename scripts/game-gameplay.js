const sessionId = getSessionId();
const playerId = getPlayerId();

const sessionRef = getSessionRef(sessionId);
const playerRef = sessionRef.child('players').child(playerId);

const domLevelImage = document.getElementById('img-level-image');
const domHangmanText = document.getElementById('text-hangman-span');
const domUsedCharsText = document.getElementById('text-used-chars');
const domCharSubmitButton = document.getElementById('btn-submit-character');
const domCharInputField = document.getElementById('input-character-field');
const domLeaderboard = document.getElementById('leaderboard-area');

const navbarLogo = document.getElementById("nav-changable");
const roomIDstr = `Room ID : ${getSessionId()}`;
navbarLogo.innerText = roomIDstr ;
document.title = roomIDstr;

const statusBar = document.getElementById("status-hangman");
const countdownBar = document.getElementById("status-time");

function backupLevelProgress(word, hangmanChars, usedChars) {
	window.localStorage.setItem('@level_progress_backup', JSON.stringify({
		word,
		hangmanChars,
		usedChars
	}));
}

function loadBackedUpLevelProgress() {
	const value = window.localStorage.getItem('@level_progress_backup');
	return value ? JSON.parse(value) : null;
}

function decrementHealth() {
	playerRef.child('health').set(firebase.database.ServerValue.increment(-1));
}

function incrementLevel() {
	playerRef.child('level').set(firebase.database.ServerValue.increment(1));
}

async function loadWordInfo(word) {
	const wordRef = getWordRef(word);
	const snapshot = await wordRef.get();
	if (snapshot.exists()) {
		const val = snapshot.val();
		return [val.definition, val.imageUri];
	}
}

async function loadWordAndRenderLevel(word) {
	const [definition, imageUri] = await loadWordInfo(word);
	domLevelImage.src = imageUri;
	const definitionLower = definition.toLowerCase();
	let hangmanChars = Array.from(definition.replaceAll(/[a-zA-Z]/g, '_'));
	let usedChars = [];
	const backedUp = loadBackedUpLevelProgress();
	if (backedUp?.word === word) {
		hangmanChars = backedUp.hangmanChars;
		usedChars = backedUp.usedChars;
	}

	const checkTextAndUpdate = () => {
		if (!hangmanChars.includes('_')) {
			incrementLevel();
			backupLevelProgress(null, [], []);
			statusBar.innerText = `😁 Great job. The word was "${word}".`;
		}
		domUsedCharsText.innerText = usedChars.join(', ');
		domHangmanText.innerText = hangmanChars.join('');
	};

	checkTextAndUpdate();

	const checkChar = () => {
		const value = domCharInputField.value;

		if (value.length !== 1) return;

		const charLower = value[0].toLowerCase();
		domCharInputField.value = '';
		
		if (!(/[a-z]/.test(charLower))) {
			// TODO: this alert is just a placeholder
			statusBar.innerText = "⚠️ Please enter A-Z character!";
			return;
		}
		if (usedChars.includes(charLower)) {
			// TODO: this alert is just a placeholder
			statusBar.innerText = `❌ "${charLower}" is already used!`;
			return;
		}

		usedChars.push(charLower);
		domUsedCharsText.innerText = usedChars.join(', ');
		if (definitionLower.includes(charLower)) {
			for (const i in definition) {
				if (definitionLower[i] === charLower) {
					hangmanChars[i] = definition[i];
				}
			}
			backupLevelProgress(word, hangmanChars, usedChars);
			checkTextAndUpdate();
		}
		else {
			decrementHealth();
			// TODO: this alert is just a placeholder
			statusBar.innerText = `😢 Wrong character!`;
		}
	};
	domCharSubmitButton.onclick = checkChar;
	domCharInputField.onkeypress = (e) => {
		if (e.key === "Enter") {
			checkChar();
		}
	}
}

function subscribeToHpToDie() {
	playerRef.child('health').on('value', (snapshot) => {
		const hp = snapshot.val();
		if (hp <= 0) {
			// TODO: this alert is just a placeholder
			domCharInputField.disabled = true;
			statusBar.innerText = `😭 You died.`;
		}
	})
}

function subscribeToLevelAndRender(allWords) {
	playerRef.child('level').on('value', (snapshot) => {
		const level = snapshot.val();
		if (level >= allWords.length) {
			domCharInputField.disabled = true;
			playerRef.child('finished').set(true).then(() => {
				onFinished();
			});
			setTimeout(() => {
				statusBar.innerText = "🕐 Game is ending soon - tell your friends to hurry up!";
			}, 2000);
		}
		else {
			const word = allWords[level];
			loadWordAndRenderLevel(word);
		}
	});
}

let countdownInterval = null;

function subscribeToEndTime() {
	sessionRef.child('end_time').on('value', (snapshot) => {
		if (snapshot.exists()) {
			const end = snapshot.val();
			countdownBar.classList.remove('hidden');
			if (countdownInterval) clearInterval(countdownInterval);
			countdownInterval = setInterval(() => {
				const now = Date.now();
				if (now >= end) {
					backupLevelProgress(null, [], []);
					window.location = "game-end-leaderboard.html";
				}
				const difSec = Math.floor(((end - now) / 1000) % 60);
				navbarLogo.innerText = `🕐 ${difSec}`;
				countdownBar.innerText = `${difSec} seconds remaining!`;
			}, 1000);
		}
	});
}

function onFinished() {
	console.warn("Checking if every players has finished. This is an expensive operation and should be avoided.");
	sessionRef.child('phase').set(4);
	sessionRef.child('players').get().then((snapshot) => {
		if (snapshot.exists()) {
			const players = snapshot.val();
			let allFinished = true;
			for (const player of Object.values(players)) {
				if (!player.finished) {
					allFinished = false;
					break;
				}
			}
			if (allFinished) {
				// If everyone is finished, end the game now.
				sessionRef.child('end_time').set(Date.now());
			}
			else {
				// If end_time does not already exist, set it 60 sec into the future.
				const setTo = Date.now() + 60 * 1000;
				sessionRef.child('end_time').transaction(
					(existing) => (existing ? undefined : setTo)
				);
			}
		}
	});
}

function handleEachPlayer(playerRef) {
	const domContainer = document.createElement('div');
	domContainer.classList.add('leaderboard-entry');
	const domTextsContainer = document.createElement('div');
	domTextsContainer.classList.add('leaderboard-entry-texts');
	const domNameText = document.createElement('span');
	domTextsContainer.appendChild(domNameText);
	const domLevelText = document.createElement('span');
	domTextsContainer.appendChild(domLevelText);
	domContainer.appendChild(domTextsContainer);
	const domBarContainer = document.createElement('div');
	domBarContainer.classList.add('leaderboard-entry-bar');
	const domBar = document.createElement('div');
	domBar.classList.add('leaderboard-entry-bar-inner');
	domBarContainer.appendChild(domBar);
	domContainer.appendChild(domBarContainer);

	playerRef.on('value', (snapshot) => {
		const player = snapshot.val();
		domNameText.innerText = (playerRef.key === playerId) ? `${player.name} (You)` : player.name;
		domLevelText.innerText = player.finished ? 'FINISHED' : `LEVEL: ${player.level + 1}`;
		domBar.style.width = `${player.health}%`;
		domBar.style.backgroundColor = player.color;
	});
	domLeaderboard.appendChild(domContainer);
}


function loadAllPlayers() {
	handleEachPlayer(playerRef);
	sessionRef.child('players').on('child_added', (snapshot) => {
		const ref = snapshot.ref;
		if (ref.key !== playerId) handleEachPlayer(ref);
	});
}

function loadGame() {
	sessionRef.child('words').get().then((snapshot) => {
		if (snapshot.exists()) {
			const words = snapshot.val();
			subscribeToLevelAndRender(words);
		}
	});
	subscribeToEndTime();
	loadAllPlayers();
}

loadGame();