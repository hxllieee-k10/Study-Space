console.log("BUDDY EDIT JS LOADED");


let currentBuddy = null;



document.addEventListener(
"DOMContentLoaded",
()=>{

loadEditBuddy();

});





function loadEditBuddy(){


currentBuddy =
getUserData("buddy");



if(!currentBuddy){

document.getElementById(
"editMessage"
).textContent =
"No buddy found.";

return;

}




document.getElementById(
"editBuddyImage"
).src =
"../assets/buddies/" + currentBuddy.image;




document.getElementById(
"editBuddyAnimal"
).textContent =
currentBuddy.animalName;



document.getElementById(
"editBuddyName"
).value =
currentBuddy.name;



document.getElementById(
"editMBTI"
).value =
currentBuddy.mbti;



document.getElementById(
"editPersonality"
).value =
currentBuddy.personality;



document.getElementById(
"editBio"
).value =
currentBuddy.bio || "";



document.getElementById(
"editBirthday"
).value =
currentBuddy.birthday || "";



document.getElementById(
"editAge"
).value =
currentBuddy.age || "";



document.getElementById(
"editHobbies"
).value =
currentBuddy.hobbies
?
currentBuddy.hobbies.join(", ")
:
"";



document.getElementById(
"editStruggle"
).value =
currentBuddy.struggling || "";



document.getElementById(
"editDreams"
).value =
currentBuddy.dreams || "";


}







function saveBuddyEdit(){



const updatedBuddy = {


...currentBuddy,


name:
document.getElementById(
"editBuddyName"
).value.trim(),



mbti:
document.getElementById(
"editMBTI"
).value,



personality:
document.getElementById(
"editPersonality"
).value,



bio:
document.getElementById(
"editBio"
).value,



birthday:
document.getElementById(
"editBirthday"
).value,



age:
document.getElementById(
"editAge"
).value,



hobbies:
document.getElementById(
"editHobbies"
).value
.split(",")
.map(
x=>x.trim()
)
.filter(
x=>x
),



struggling:
document.getElementById(
"editStruggle"
).value,



dreams:
document.getElementById(
"editDreams"
).value



};





saveUserData(
"buddy",
updatedBuddy
);



document.getElementById(
"editMessage"
).textContent =
"Buddy updated ฅ^>⩊<^ ฅ";



setTimeout(
()=>{

window.location.href =
"study-buddy.html";

},
1000
);


}







function changeAvatar(){



// remember we are editing

localStorage.setItem(
"editingBuddy",
"true"
);



window.location.href =
"avatar.html";


}