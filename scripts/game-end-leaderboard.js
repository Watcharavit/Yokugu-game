const sessionId = getSessionId();
const playerId = getPlayerId();

const sessionRef = getSessionRef(sessionId);
const playerRef = sessionRef.child('players').child(playerId);

const domEntryTemplate = document.getElementById("leaderboard-entry-template");
const domLeaderboard = document.getElementById("leaderboard");

function renderPlayerEntry(player, rank) {
	const domEntry = domEntryTemplate.content.firstElementChild.cloneNode(true);
	const domRank = domEntry.querySelector(".leaderboard-entry-rank");
	const domName = domEntry.querySelector(".leaderboard-entry-username-name");
	const domLevel = domEntry.querySelector(".leaderboard-entry-scores-level");
	const domHealth = domEntry.querySelector(".leaderboard-entry-scores-hp");
	domRank.innerText = `${rank}`;
	domName.innerText = player.name;
	domLevel.innerText = (player.finished && player.health > 0) ? '🏁' : `${player.level + 1}`;
	domHealth.innerText = `${Math.max(player.health, 0)}`;
	if (rank === 1) domEntry.classList.add("leaderboard-entry-first");
	else if (rank === 2) domEntry.classList.add("leaderboard-entry-second");
	else if (rank === 3) domEntry.classList.add("leaderboard-entry-third");
	
	if (player.id === playerId) {
		domEntry.classList.add("leaderboard-entry-me");
	}

	domLeaderboard.appendChild(domEntry);

	
}

function loadPlayers() {
	sessionRef.child('players').get().then((snapshot) => {
		const players = snapshot.val();
		const sortedPlayers = Object.entries(players).map(([id, info]) => ({
			id,
			...info
		})).sort((a, b) => {
			if (b.level !== a.level) return b.level - a.level;
			else if (b.health !== a.health) return b.health - a.health;
			else return (a.name.toLowerCase() > b.name.toLowerCase());
		});
		const ranked = [];
		let currentRank = 1;
		ranked.push([sortedPlayers[0], currentRank]);
		for (let i = 1; i < sortedPlayers.length; i++) {
			const player = sortedPlayers[i];
			const lastPlayer = ranked[i - 1][0];
			if (player.level < lastPlayer.level) {
				currentRank = i + 1;
			}
			else {
				if (player.health < lastPlayer.health) {
					currentRank = i + 1;
				}
			}
			ranked.push([player, currentRank]);
		}
		ranked.forEach(([player, rank]) => {
			renderPlayerEntry(player, rank);
		});
	});
}
loadPlayers();