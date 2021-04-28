var selectedItem = []

function selected(id){
    var element = document.getElementById(id)
    element.classList.toggle("press")
    if(selectedItem.indexOf(id) == -1){
        selectedItem.push(id)
    }
    else{
        selectedItem = selectedItem.filter(v => v !== id); 
    }
    console.log(selectedItem)
}
