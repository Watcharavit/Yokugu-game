const sessionId = getSessionId();
const playerId = getPlayerId();
var selectedItem = [];
var randomCheck = false;
var clearCheck = true;
var allWords = [];
var gameWords = [];

const categories = ['daysInWeek','months','animals','family',
                    'foods','occupations','elecMach','places',
                    'transportation','sports','musicalInstru']

const wordInCategories = {
    daysInWeek : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    months : ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
    transportation : ['airport', 'ambulance', 'battery', 'bicycle', 'boat', 'bus', 'car', 'car wash', 
                        'carriage', 'engine', 'excavator', 'fire engine', 'freight car', 'helicopter', 'jeep',
                        'limousine', 'lorry', 'metro', 'minibus', 'motocross', 'motorbike', 'oil tanker', 'petrol', 'pushcart', 
                        'racing car', 'rickshaw', 'sedan', 'steamroller', 'subway', 'tank', 'taxi', 'trailer', 'train', 'tram', 
                        'tricycle', 'truck', 'van', 'waggon'],
    foods : ['egg', 'vegetables', 'fruits', 'grains', 'chicken', 'beef', 'pork', 'cereal', 'rice', 'fish', 'noodles', 'pizza', 'spaghetti', 
                        'sandwich', 'sushi', 'tempura', 'ramen', 'soup', 'meatball', 'hamburger'],
    family : ['father', 'mother', 'sister', 'brother', 'siblings', 'aunt', 'grandfather', 'grandmother', 'Husband', 'wife', 'niece', 'nephew', 
                'uncle', 'daughter', 'son', ',cousin', 'twins', 'granddaughter', 'grandson'],                    
    occupations : ['accountant', 'acrobat', 'Aactor', 'actress', 'adman', 'agriculturist', 'announcer', 'archeologist', 'architect', 'artist', 'astronomer', 
                'athlete', 'auditor', 'author', 'aviator', 'baker', 'banker', 'barber', 'barman', 'bartender', 'biologist', 'bookseller', 'butcher', 'carpenter', 
                'cashier', 'chef', 'chemist', 'dancer', 'designer', 'detective', 'diplomat', 'doctor', 'driver', 'editor', 'electrician', 'engineer', 'farmer', 
                'firefighter', 'fisherman', 'gardener', 'goldsmith', 'guide', 'hairdresser', 'hostess', 'interpreter', 'janitor', 'journalist', 'judge', 'laborer', 
                'lapidary', 'lawyer', 'magician', 'maid', 'masonry', 'mechanic', 'merchant', 'model', 'musician', 'navigator', 'nurse', 'oculist', 'officer',
                'painter', 'pharmacist', 'pilot', 'plumber', 'policeman', 'politician', 'postman', 'priest', 'programmer', 'sailor', 'salesman', 'scientist', 'sculptor', 
                'secretary', 'servant', 'shoemaker', 'singer', 'soldier', 'student', 'stylist', 'tailor', 'teacher', 'veterinarian', 
                'waiter', 'waitress', 'watcher', 'writer'],
    sports : ['archery', 'badminton', 'baseball', 'basketball', 'bowling', 'boxing', 'climbing', 'cycling', 'diving', 'fencing', 'football', 'golf.gymnastics', 
        'handball', 'high jump', 'hockey', 'horse racing', 'ice skating', 'judo', 'karate', 'kendo', 'long jump', 'rugby', 'running', 'pétanque', 'sailing', 
        'shooting', 'skiing', 'snooker', 'squash', 'swimming', 'table tennis', 'tae kwon do', 'tennis', 'volleyball', 'water polo', 'weightlifting', 'wrestling'],
    elecMach: ['air conditioner', 'battery', 'blender', 'bulb', 'CD-ROM', 'circuitry', 'clock', 'computer', 'earphones', 'electric razor', 'fan', 
                            'grinder', 'hair dryer', 'heater', 'lamp', 'lawn mower', 'loudspeaker', 'microphone', 'microwave', 'photocopy', 'plug', 'printer', 'projector', 'pump', 
                            'radio', 'record', 'refrigerator', 'remote control', 'scanner', 'speaker', 'telephone', 'television', 'Thermos', 'toaster', 'vacuum sweeper', 
                            'video recorder', 'washing machine'],
    musicalInstru : ['accordion', 'acoustic guitar', 'bagpipe', 'bass', 'bass drum', 'bassoon', 'brass', 'bugle', 'castanets', 'cello', 
                        'clappers', 'clarinet', 'cymbal', 'drum', 'fiddle', 'flute', 'French horn', 'gong', 'guitar', 'harmonica', 'harp', 'kettledrum', 'mandolin',
                        'maraca', 'oboe', 'organ', 'percussion', 'piano', 'piccolo', 'pipe organ', 'saxophone', 'tambourine', 'timpani', 'triangle', 'trumpet', 'tuba', 
                        'viola', 'violin', 'xylophone', 'zither'],
    animals : ['bird', 'cat', 'chick', 'cock', 'dog', 'duck', 'goat', 'goldfish', 'goose', 'hamster', 'hedgehog', 'hen', 
                'kitten', 'pig', 'piggy', 'puppy', 'rabbit', 'sheep', 'squirrel', 'turtle', 'cow', 'lion', 'tiger', 'snake', 
                'armadillo', 'baboon', 'badger', 'bear', 'beaver', 'bison', 'boar', 'bull', 'camel', 'cheetah', 'chipmunk', 'deer', 
                'elephant', 'fox', 'gazelle', 'gibbon', 'giraffe', 'gorilla', 'hare', 'hippopotamus', 'hyena', 'impala', 'jaguar', 
                'kangaroo', 'koala', 'leopard', 'llama', 'moose', 'orangutan', 'panda', 'panther', 'platypus', 'polar bear', 'porcupine', 
                'raccoon', 'rhinoceros', 'skunk', 'tapir', 'wildebeest', 'wolf', 'zebra', 'carp', 'clam', 'cockle', 'cod', 'crab', 
                'cuttlefish', 'dolphin', 'eel', 'flounder', 'herring', 'limpet', 'lobster', 'mackerel', 'mussel', 'octopus', 'otter', 
                'oyster', 'prawn', 'salmon', 'scallop', 'seal', 'shrimp', 'snail', 'squid', 'swordfish', 'trout', 'tuna', 'alligator', 
                'bullfrog', 'centipede', 'chameleon', 'cobra', 'crocodile', 'earthworm', 'frog', 'gecko', 'king cobra', 'lizard', 'millepede', 
                'newt', 'python', 'rattlesnake', 'salamander', 'skink', 'toad', 'tortoise'],
    places : ['airport', 'bakery', 'bank', 'barbershop', 'beach', 'bus station', 'cafeteria', 'capital', 'car park', 'church', 'cinema', 'city', 'coffee shop', 
                'college', 'continent', 'delicatessen', 'district', 'factory', 'filling station', 'grocery', 'harbour', 'hospital', 'hotel', 'lake', 'library', 
                'market', 'mosque', 'museum', 'nightclub', 'office', 'police station', 'post office', 'province', 'restaurant', 'school', 'sea', 'shopping center', 
                'slum', 'subway station', 'supermarket', 'swimming pool', 'television station', 'temple', 'theater', 'travel agency', 'university', 'village', 'zoo']
};


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
    clearCheck = false
}

function random(){
    clearAllGreen();
    selectedItem = [];
    randomCheck = false;
    while(selectedItem.length<3){
        let i = Math.floor(Math.random()*11);
        var addedItem = categories[i];
        if(selectedItem.indexOf(addedItem)==-1){
            selected(addedItem);
        }
    }
    randomCheck = true;
    clearCheck = false;
}

function clearAllGreen(){
    for(i=0 ; i<selectedItem.length;i++){
        var element = document.getElementById(selectedItem[i]);
        element.classList.toggle("press");
    }
}

function clear(){
    if(clearCheck==false){
        clearAllGreen();
        selectedItem = [];
        clearCheck = true;
    }
}

function start(){
    if(selectedItem.length==0){
        random();
    }
    for(i=0;i<selectedItem.length;i++){
        allWords.push(...wordInCategories[selectedItem[i]]);
    }
    while(gameWords.length<10){
        let i = Math.floor(Math.random()*allWords.length);
        var addedWords = allWords[i];
        if(gameWords.indexOf(addedWords)==-1){
            gameWords.push(addedWords);
            
        }
    }
    for(j=0;j<10;j++){
        validateWord(gameWords[j]);
    }
    submitWords();
}


async function validateWord(inputWord) {
    const word = inputWord;//แหล่งที่มา
    fetch(`https://comp-eng-ess-final-project.herokuapp.com/validate_word`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            word,
        })
    }).then((result) => {
        if (result.ok){
            alert("Something went wrong. Make sure you enter a valid English word."+":   " + inputWord);
        }
    });
}

function submitWords() {
    const sessionRef = getSessionRef(sessionId);
    sessionRef.child('words').set(gameWords).then(() => {
        sessionRef.child('phase').set(2).then(() => {
            window.location = 'game-waiting.html';
        });
    });
}