const firebaseConfig = {
    apiKey: "AIzaSyBA6Qh_wABtwrP5grXUi9OFVyGednWt0hg",
    authDomain: "comp-eng-ess-final-project.firebaseapp.com",
    databaseURL: "https://comp-eng-ess-final-project-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "comp-eng-ess-final-project",
    storageBucket: "comp-eng-ess-final-project.appspot.com",
    messagingSenderId: "896782023796",
    appId: "1:896782023796:web:5678042d526da0325be521"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const sessionsDb = database.ref('sessions');
const wordsDb = database.ref('words');

function setSessionId(value) {
    window.localStorage.setItem('@session_id', value);
}
function setPlayerId(value) {
    window.localStorage.setItem('@player_id', value);
}
function setIsRoomLeader(value) {
    return window.localStorage.setItem('@is_room_leader', JSON.stringify(value));
}
function getSessionId() {
    return window.localStorage.getItem('@session_id');
}
function getPlayerId() {
    return window.localStorage.getItem('@player_id');
}
function getIsRoomLeader() {
    const v = window.localStorage.getItem('@is_room_leader');
    return v ? JSON.parse(v) : false;
}

function getSessionRef(sessionId) {
    return sessionsDb.child(sessionId);
}
function getWordRef(word) {
    return wordsDb.child(word);
}