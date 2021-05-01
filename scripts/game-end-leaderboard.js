const sessionId = getSessionId();
const playerId = getPlayerId();

const sessionRef = getSessionRef(sessionId);
const playerRef = sessionRef.child('players').child(playerId);

const domEntryTemplate = document.getElementById("leaderboard-entry-template");
const domLeaderboard = document.getElementById("leaderboard");

function renderPlayerEntry(player, rank) {
	const domEntry = domEntryTemplate.content.cloneNode(true);
	const domRank = domEntry.querySelector(".leaderboard-entry-rank");
	const domName = domEntry.querySelector(".leaderboard-entry-username");
	const domLevel = domEntry.querySelector(".leaderboard-entry-scores-level");
	const domHealth = domEntry.querySelector(".leaderboard-entry-scores-hp");
	domRank.innerText = `${rank + 1}`;
	domName.innerText = player.name;
	domLevel.innerText = player.finished ? '🏁' : `${player.level + 1}`;
	domHealth.innerText = `${player.health}`;
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
			else return b.health - a.health;
		});
		sortedPlayers.forEach((player, rank) => {
			renderPlayerEntry(player, rank);
		});
	});
}
loadPlayers();