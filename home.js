var showAboutUs = false
var showHowTo = false





function showHome(){

}

function aboutUs(){
    if(showAboutUs == false){
        document.getElementById("about-us").innerHTML = "We are student from Chulalongkorn University"
    }
    else{
        document.getElementById("about-us").innerHTML = ""
    }
    showAboutUs = !showAboutUs
}

function howTo(){
    if(showHowTo == false){
        document.getElementById("how-to").innerHTML = "We are student from Chulalongkorn University"
    }
    else{
        document.getElementById("how-to").innerHTML = ""
    }
    showHowTo = !showHowTo
}