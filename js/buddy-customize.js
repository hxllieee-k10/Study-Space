// ===================================
// STUDY SPACE V3
// BUDDY CUSTOMIZE JS
// ===================================


console.log("buddy-customize.js loaded");



let selectedAnimal = null;






// ===================================
// PERSONALITY DATABASE
// ===================================


const buddyPersonalities = {


Caring:{

description:
"Your buddy cares about your feelings and checks on you often.",

reminder:
"Remember to take care of yourself too. Drink some water and keep going ☕"

},



Playful:{

description:
"Your buddy keeps studying fun with jokes and cheerful energy.",

reminder:
"Your exam is approaching faster than my patience. Go study!"

},



Strict:{

description:
"Your buddy keeps you disciplined and helps you stay focused.",

reminder:
"Stop negotiating with yourself. Sit down and study. You have one job. Open the book and use the brain I know you have"

},



Funny:{

description:
"Your buddy uses humour to make stressful study days easier.",

reminder:
"Your textbook called. It's asking if you're ghosting it."
},



Motivational:{

description:
"Your buddy pushes you to chase your dreams.",

reminder:
"Future you will thank you for studying today "

},



Calm:{

description:
"Your buddy creates a peaceful and relaxing study environment.",

reminder:
"Slow progress is still progress. Take your time 🌙 CHILL"

},



Protective:{

description:
"Your buddy looks after you and reminds you to balance work and rest.",

reminder:
"As your self-appointed bodyguard against procrastination, I'm ordering you to study."

},



Cheerful:{

description:
"Your buddy brings positive energy into every study session.",

reminder:
"Keep smiling! You are doing better than you think ✨"

},


Flirty:{ 

description:
"Your buddy is charming, playful and likes giving cute little compliments while you study.",

reminder:
"Let's study for 25 minutes, then you get 5 minutes of my full attention"

},



LZZ:{

description:
"Your buddy is a LauZhunZhun",

reminder:
"use logic.<|°ᴗ°|>"

},



sa:{

    description:
    "Your buddy is a Siti Aminah",

reminder:
"mingbaima? bumingbai, idoncare bacause u L-A-Z-Y"}

};









// ===================================
// LOAD PAGE
// ===================================


document.addEventListener(
"DOMContentLoaded",
function(){


loadSelectedBuddy();


});









// ===================================
// LOAD SELECTED AVATAR
// ===================================


function loadSelectedBuddy(){



const saved =
localStorage.getItem(
"selectedBuddy"
);



console.log(
"selectedBuddy:",
saved
);





if(!saved){


document.getElementById("message").textContent =
"No avatar selected. Please return to choose your buddy.";


return;


}






selectedAnimal =
JSON.parse(saved);





console.log(
"Loaded:",
selectedAnimal
);






const image =
document.getElementById(
"buddyImage"
);



const name =
document.getElementById(
"animalName"
);







if(image){


image.src =
"../assets/buddies/" + selectedAnimal.image;



image.alt =
selectedAnimal.name;



}








if(name){


name.textContent =
selectedAnimal.name;



}



}











// ===================================
// SHOW PERSONALITY
// ===================================


function showBuddyPersonality(){



const type =
document.getElementById(
"buddyPersonality"
).value;





const box =
document.getElementById(
"personalityResult"
);





if(type===""){


box.innerHTML =
"Choose your buddy personality ";


return;


}






const personality =
buddyPersonalities[type];





box.innerHTML = `


<h3>
${type}
</h3>


<p>
${personality.description}
</p>


<p>
<b>Example reminder:</b><br>

${personality.reminder}

</p>


`;



}











// ===================================
// CREATE BUDDY
// ===================================


function createBuddy(){





// reload selected avatar safety


if(!selectedAnimal){


const saved =
localStorage.getItem(
"selectedBuddy"
);



if(saved){


selectedAnimal =
JSON.parse(saved);


}


}








if(!selectedAnimal){


document.getElementById("message").textContent =
"Please choose an avatar first.";


return;


}









const name =
document
.getElementById("buddyName")
.value
.trim();





const mbti =
document
.getElementById("buddyMBTI")
.value;






const personalityType =
document
.getElementById("buddyPersonality")
.value;









if(
name === "" ||
mbti === "" ||
personalityType === ""

){


document.getElementById("message").textContent =
"Please complete your buddy profile ☕";


return;


}









const personality =
buddyPersonalities[
personalityType
];










const buddy = {



animal:
selectedAnimal.id,



animalName:
selectedAnimal.name,



image:
selectedAnimal.image,



name:
name,



mbti:
mbti,



personality:
personalityType,



personalityDescription:
personality.description,



studyReminder:
personality.reminder



};








console.log(
"Saving buddy:",
buddy
);








// save user specific


saveUserData(
"buddy",
buddy
);

if(!localStorage.getItem("buddyCreated")){

localStorage.setItem(
"buddyCreated",
new Date().toISOString()
);

}





// backup


saveData(
"buddy",
buddy
);








document.getElementById("message").textContent =
`${name} is ready to study with you ✨`;








setTimeout(
function(){


window.location.href =
"dashboard.html";


},
1000
);



}