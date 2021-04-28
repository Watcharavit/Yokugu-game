// to see which categories are chosen

// var selectedItem ={
//     daysInWeek : false,
//     months : false,
// }


function selected(id){
    // var idString = String(id)
    var element = document.getElementById(id)
    element.classList.toggle("press")
    // selectedItem.daysInWeek = !selectedItem.daysInWeek
    // console.log(selectedItem)
}

// เก็บcategories ไว้เป็น object แล้วถ้าclick ก็true+เปลี่ยนสี อีกรอบก็false+recolor