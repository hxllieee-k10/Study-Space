// ===================================
// STUDY SPACE V3
// AVATAR SELECT SYSTEM
// ===================================


console.log("avatar.js loaded");


let selectedBuddy = null;




// ===================================
// LOAD PAGE
// ===================================


document.addEventListener(
"DOMContentLoaded",
()=>{


loadBuddyGrid();


});








// ===================================
// LOAD BUDDY CARDS
// ===================================


function loadBuddyGrid(){


const grid =
document.getElementById("buddyGrid");



if(!grid){

console.log("No buddy grid");

return;

}



grid.innerHTML = "";



buddies.forEach((buddy)=>{


const card =
document.createElement("div");



card.className =
"buddy-card";



card.dataset.id =
buddy.id;





card.innerHTML = `

<img src="../assets/buddies/${buddy.image}">


<h3>
${buddy.name}
</h3>


<p>
${buddy.description}
</p>

`;






card.onclick = ()=>{


selectBuddy(
buddy,
card
);


};





grid.appendChild(card);



});



restoreSelectedBuddy();



}

// ===================================
// SELECT AVATAR
// ===================================


function selectBuddy(
buddy,
card
){



console.log(
"Chosen buddy:",
buddy
);



selectedBuddy = buddy;




document
.querySelectorAll(".buddy-card")
.forEach(card=>{


card.classList.remove(
"selected"
);


});





card.classList.add(
"selected"
);






// save temporary avatar choice


localStorage.setItem(
"selectedBuddy",
JSON.stringify(buddy)
);





console.log(
"Saved avatar:",
localStorage.getItem(
"selectedBuddy"
)
);










// ===================================
// EDIT MODE
// ===================================


const editing =
localStorage.getItem(
"editingBuddy"
);





if(editing === "true"){



const oldBuddy =
getUserData("buddy");





if(oldBuddy){



const updatedBuddy = {


...oldBuddy,


animal:
buddy.id,


animalName:
buddy.name,


image:
buddy.image



};





saveUserData(
"buddy",
updatedBuddy
);



}






// remove edit flag


localStorage.removeItem(
"editingBuddy"
);





// RETURN DIRECTLY TO EDIT PAGE


window.location.href =
"buddy-edit.html";



return;



}









// ===================================
// NORMAL CREATION MODE
// ===================================


window.location.href =
"buddy-customize.html";



}









// ===================================
// RESTORE SELECTED
// ===================================


function restoreSelectedBuddy(){



const saved =
localStorage.getItem(
"selectedBuddy"
);



if(!saved){

return;

}





selectedBuddy =
JSON.parse(saved);





document
.querySelectorAll(".buddy-card")
.forEach(card=>{


if(
card.dataset.id === selectedBuddy.id
){


card.classList.add(
"selected"
);


}


});



}










// ===================================
// CONTINUE BUTTON
// ===================================


function continueCustomize(){



if(!selectedBuddy){



alert(
"Please choose a Study Buddy first"
);



return;


}





localStorage.setItem(

"selectedBuddy",

JSON.stringify(selectedBuddy)

);





window.location.href =
"buddy-customize.html";



}