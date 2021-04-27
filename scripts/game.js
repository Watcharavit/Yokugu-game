const sessionId = getSessionId();
const playerId = getPlayerId();

const sessionRef = getSessionRef(sessionId);
const playerRef = sessionRef.child('players').child(playerId);

const domLevelImage = document.getElementById('img-level-image');
const domHangmanText = document.getElementById('text-hangman-span');
const domUsedCharsText = document.getElementById('text-used-chars');
const domCharSubmitButton = document.getElementById('btn-submit-character');
const domCharInputField = document.getElementById('input-character-field');

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
	domHangmanText.innerText = hangmanChars.join('');
	domCharSubmitButton.onclick = () => {
		const char = domCharInputField.value[0];
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

function loadGame() {
	sessionRef.child('words').get().then((snapshot) => {
		if (snapshot.exists()) {
			const words = snapshot.val();
			subscribeToLevelAndRender(words);
		}
	});
}

loadGame();