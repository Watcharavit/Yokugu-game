var selectedItem = [];
var randomCheck = false;
// var showYesNo = false;
const categories = ['daysInWeek','month','animals','family','drinks',
                    'foods','occupations','elecMach','places','plants',
                    'transportation','sports','musicalInstru']

function selected(id){
    if(randomCheck === false){
        var element = document.getElementById(id);
        element.classList.toggle("press");
        if(selectedItem.indexOf(id) == -1){ // not in selectedItem
            selectedItem.push(id);
        }else{ // in selectedItem
            selectedItem = selectedItem.filter(v => v !== id); 
        }
    }else{
        randomCheck = false;
        clearAllGreen();
        selectedItem = [];
        selected(id);
    }
}

function random(){
    clearAllGreen();
    selectedItem = [];
    randomCheck = false;
    while(selectedItem.length<3){
        let i = Math.floor(Math.random()*13);
        var addedItem = categories[i];
        if(selectedItem.indexOf(addedItem)==-1){
            selected(addedItem);
        }
    }
    randomCheck = true;
}

function clearAllGreen(){
    for(i=0 ; i<selectedItem.length;i++){
        var element = document.getElementById(selectedItem[i]);
        element.classList.toggle("press");
    }
}

// function randomWithGreen(){ //makes random button green
//     var element= document.getElementById("random");
//     element.classList.toggle("press");
// }

// show yes and no button to confirm
// function YesNoDiv(){
//     var showYesNoButton = document.getElementById("clear-categories-button");
//     if(showYesNoButton.style.display ==="block"){
//         showYesNoButton.style.display = "none";
//         showYesNo = false;
//     }else{
//         showYesNoButton.style.display = "block";
//         showYesNo = true;
//     }
// }


async function validateWord() {
    const word = 'words';//แหล่งที่มา
    fetch(`https:/5/comp-eng-ess-final-project.herokuapp.com/validate_word`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            word,
        })
    }).then((result) => {
        if (result.ok) {
            domWordInput.value = '';
            if (!addedWords.includes(word)) addWord(word);
        }
        else {
            alert("Something went wrong. Make sure you enter a valid English word.");
        }
    });
}

function submitWords() {
    const sessionRef = getSessionRef(sessionId);
    sessionRef.child('words').set(addedWords).then(() => {
        sessionRef.child('phase').set(2).then(() => {
            window.location = 'game-waiting.html';
        });
    });
}