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
	// else we're fucked
}

async function loadWordAndRenderLevel(word) {
	const [definition, imageUri] = await loadWordInfo(word);
	domLevelImage.src = imageUri;
	let hangmanChars = Array.from(definition.replaceAll(/\w/g, '_'));
	let usedChars = [];
	domUsedCharsText.innerText = '';
	domHangmanText.innerText = hangmanChars.join('');
	checkText = () => {
		const value = domCharInputField.value;
		if (value.length !== 1) return;
		const char = value[0];
		domCharInputField.value = '';
		if (usedChars.includes(char)) {
			// TODO: this alert is just a placeholder
			alert('already used');
		}
		else {
			usedChars.push(char);
			domUsedCharsText.innerText = usedChars.join(', ');
			if (definition.includes(char)) {
				for (const i in definition) {
					if (definition[i] === char) {
						hangmanChars[i] = char;
					}
				}
				domHangmanText.innerText = hangmanChars.join('');
				if (!hangmanChars.includes('_')) {
					alert(`greate job. the word was "${word}".`);
					incrementLevel();
				}
			}
			else {
				decrementHealth();
				// TODO: this alert is just a placeholder
				alert('wrong. minus 1 hp');
			}
		}
	};
	domCharSubmitButton.onclick = checkText;
	domCharInputField.onkeypress = (e) => {
		if (e.key === "Enter") {
			checkText();
		}
	}
}

function subscribeToHpToDie() {
	playerRef.child('health').on('value', (snapshot) => {
		const hp = snapshot.val();
		if (hp === 0) {
			// TODO: this alert is just a placeholder
			alert('you die loser');
		}
	})
}

function subscribeToLevelAndRender(allWords) {
	playerRef.child('level').on('value', (snapshot) => {
		const level = snapshot.val();
		if (level >= allWords.length) {
			// TODO: this alert is just a placeholder
			alert('you win congrats');
		}
		else {
			const word = allWords[level];
			loadWordAndRenderLevel(word);
		}
	});
}

function createLeaderboardEntry(playerRef) {
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
		domNameText.innerText = player.name;
		domLevelText.innerText = `level: ${player.level}`;
		domBar.style.width = `${player.health}%`;
		domBar.style.backgroundColor = player.color;
	});
	domLeaderboard.appendChild(domContainer);
}

function loadLeaderboard() {
	sessionRef.child('players').on('child_added', (snapshot) => {
		createLeaderboardEntry(snapshot.ref);
	});
}

function loadGame() {
	sessionRef.child('words').get().then((snapshot) => {
		if (snapshot.exists()) {
			const words = snapshot.val();
			subscribeToLevelAndRender(words);
		}
	});
}

loadGame();
loadLeaderboard();