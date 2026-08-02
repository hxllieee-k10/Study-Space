// ===================================
// STUDY SPACE V3
// STUDY BUDDY PROFILE
// ===================================


console.log("STUDY BUDDY JS LOADED");




// ===================================
// LOAD PAGE
// ===================================


document.addEventListener(
"DOMContentLoaded",
function(){

    loadStudyBuddy();

    loadFriendship();

});








// ===================================
// LOAD BUDDY DATA
// ===================================


function loadStudyBuddy(){



    const buddy =
    getUserData("buddy")
    ||
    getData("buddy");





    if(!buddy){


        console.log(
        "No buddy found"
        );


        return;


    }







    console.log(
    "Loaded buddy:",
    buddy
    );








    // IMAGE


    const image =
    document.getElementById(
    "profileBuddyImage"
    );


    if(image){


        image.src =
        "../assets/buddies/" 
        +
        buddy.image
        +
        "?v="
        +
        Date.now();



        image.alt =
        buddy.animalName;


    }









    // NAME


    const name =
    document.getElementById(
    "profileBuddyName"
    );


    if(name){

        name.textContent =
        buddy.name;

    }









    // ANIMAL


    const animal =
    document.getElementById(
    "profileBuddyAnimal"
    );


    if(animal){

        animal.textContent =
        buddy.animalName;

    }









    // MBTI


    const mbti =
    document.getElementById(
    "profileMBTI"
    );


    if(mbti){

        mbti.textContent =
        buddy.mbti;

    }









    // PERSONALITY


    const personality =
    document.getElementById(
    "profilePersonality"
    );


    if(personality){

        personality.textContent =
        buddy.personality;

    }









    // DETAILS


    const bio =
    document.getElementById(
    "buddyBio"
    );


    if(bio){

        bio.textContent =
        buddy.bio
        ||
        "No bio added yet.";

    }






    const hobbies =
    document.getElementById(
    "buddyHobbies"
    );


    if(hobbies){


        hobbies.textContent =
        buddy.hobbies &&
        buddy.hobbies.length

        ?

        buddy.hobbies.join(", ")

        :

        "No hobbies added yet.";


    }








    const struggle =
    document.getElementById(
    "buddyStruggle"
    );


    if(struggle){

        struggle.textContent =
        buddy.struggling
        ||
        "Nothing added yet.";

    }








    const dreams =
    document.getElementById(
    "buddyDreams"
    );


    if(dreams){

        dreams.textContent =
        buddy.dreams
        ||
        "No dreams added yet.";

    }










    // MOTIVATION


    const motivation =
    document.getElementById(
    "buddyMotivation"
    );


    if(motivation){

        motivation.textContent =
        generateMotivation(buddy);

    }









    // REMINDER FROM PERSONALITY


    const reminder =
    document.getElementById(
    "buddyReminder"
    );


    if(reminder){


        reminder.textContent =
        buddy.studyReminder
        ||
        "Your buddy believes in you. Keep going ✨";


    }



}












// ===================================
// PERSONALITY MOTIVATION
// ===================================


function generateMotivation(buddy){



const motivation = {



INTJ:
"Your buddy believes in smart planning. Break big dreams into small strategies and keep moving forward 🧠",



INTP:
"Stay curious. Every question you ask brings you closer to discovering something new 🔎",



ENTJ:
"Set your goals high. Your buddy is cheering for every achievement you chase 🚀",



ENTP:
"Keep experimenting and exploring new ideas. Learning is an adventure ✨",



INFJ:
"Meaningful progress matters. Take small steps toward the dreams that inspire you 🌱",



INFP:
"Your imagination is your strength. Create, explore and learn at your own pace 🌷",



ENFJ:
"Your kindness makes you strong. Keep growing while supporting yourself and others 💛",



ENFP:
"Stay excited and curious. New experiences bring new opportunities 🌈",



ISTJ:
"Consistency creates success. One focused step every day makes a difference 📚",



ISFJ:
"Your patience and dedication will carry you far. Keep going gently 🌿",



ESTJ:
"Stay organised and determined. Your effort today builds your future ⭐",



ESFJ:
"Your positive energy helps you learn. Keep believing in yourself ☀️",



ISTP:
"Challenge yourself and solve problems one step at a time 🔧",



ISFP:
"Learn creatively and enjoy the journey. Your unique ideas matter 🎨",



ESTP:
"Take action and learn through experience. Your courage helps you grow 🔥",



ESFP:
"Bring your energy into learning. Make studying something enjoyable 🎵"



};




return motivation[buddy.mbti]
||
"Your buddy believes in you. Keep trying 🌱";



}









// ===================================
// EDIT BUTTON
// ===================================


function editBuddy(){


window.location.href =
"buddy-edit.html";


}









// ===================================
// FRIENDSHIP SYSTEM
// ===================================


function loadFriendship(){



const created =
localStorage.getItem(
"buddyCreated"
);



let days = 0;



if(created){


const start =
new Date(created);


const today =
new Date();



days =
Math.floor(
(today-start)
/
(1000*60*60*24)
);



}






let studyMinutes =
getUserData(
"studyMinutes"
)
||
0;






let hours =
Math.floor(
studyMinutes / 60
);



let minutes =
studyMinutes % 60;







let closeness =
Math.min(

Math.floor(
days * 2
+
studyMinutes / 20
),

100

);

const daysBox =
document.getElementById(
"friendshipDays"
);


if(daysBox){

daysBox.textContent =
days + " days";

}






const timeBox =
document.getElementById(
"studyTime"
);


if(timeBox){

timeBox.textContent =
hours
+
"h "
+
minutes
+
"min";

}







const percent =
document.getElementById(
"closenessPercent"
);


if(percent){

percent.textContent =
closeness + "%";

}








const bar =
document.getElementById(
"friendshipProgress"
);


if(bar){

bar.style.width =
closeness + "%";

}








let level =
"New Friend 🌱";



if(closeness >= 30){

level =
"Good Friends 🌿";

}



if(closeness >= 60){

level =
"Close Friends 🌳";

}



if(closeness >= 85){

level =
"Best Friends ⭐";

}








const levelBox =
document.getElementById(
"friendshipLevel"
);


if(levelBox){

levelB// ===================================
// STUDY SPACE V3
// STUDY BUDDY PROFILE
// ===================================


console.log("STUDY BUDDY JS LOADED");




// ===================================
// LOAD PAGE
// ===================================


document.addEventListener(
"DOMContentLoaded",
function(){

    loadStudyBuddy();

    loadFriendship();

});







// ===================================
// LOAD BUDDY DATA
// ===================================


function loadStudyBuddy(){


const buddy =
getUserData("buddy");



console.log(
"Loaded buddy:",
buddy
);




if(!buddy){

console.log(
"No buddy found"
);

return;

}






// IMAGE

const image =
document.getElementById(
"profileBuddyImage"
);


if(image){


image.src =
"../assets/buddies/" 
+
buddy.image
+
"?v="
+
Date.now();


}








// NAME

const name =
document.getElementById(
"profileBuddyName"
);


if(name){

name.textContent =
buddy.name;

}








// ANIMAL

const animal =
document.getElementById(
"profileBuddyAnimal"
);


if(animal){

animal.textContent =
buddy.animalName;

}









// MBTI

const mbti =
document.getElementById(
"profileMBTI"
);


if(mbti){

mbti.textContent =
buddy.mbti;

}








// PERSONALITY

const personality =
document.getElementById(
"profilePersonality"
);


if(personality){

personality.textContent =
buddy.personality;

}









// DETAILS


const bio =
document.getElementById(
"buddyBio"
);


if(bio){

bio.textContent =
buddy.bio
||
"No bio added yet.";

}







const hobbies =
document.getElementById(
"buddyHobbies"
);


if(hobbies){

hobbies.textContent =
buddy.hobbies &&
buddy.hobbies.length

?

buddy.hobbies.join(", ")

:

"No hobbies added yet.";

}







const struggle =
document.getElementById(
"buddyStruggle"
);


if(struggle){

struggle.textContent =
buddy.struggling
||
"Nothing added yet.";

}







const dreams =
document.getElementById(
"buddyDreams"
);


if(dreams){

dreams.textContent =
buddy.dreams
||
"No dreams added yet.";

}








// MOTIVATION

const motivation =
document.getElementById(
"buddyMotivation"
);


if(motivation){

motivation.textContent =
generateMotivation(buddy);

}








// PERSONALITY REMINDER

const reminder =
document.getElementById(
"buddyReminder"
);


if(reminder){

reminder.textContent =
buddy.studyReminder
||
"Your buddy believes in you ✨";

}



}









// ===================================
// MOTIVATION SYSTEM
// ===================================


function generateMotivation(buddy){


const messages = {


Caring:
"Your buddy cares about your feelings. Take care of yourself while chasing your goals 🌱",



Playful:
"Learning does not have to be boring. Let's make today fun 🎮",



Strict:
"Discipline creates results. Time to focus and get things done 💪",



Funny:
"Your textbook misses you. Stop avoiding it 📚",



Motivational:
"Every small effort today builds your future ⭐",



Calm:
"Slow progress is still progress. Keep moving peacefully 🌙",



Protective:
"Remember to rest too. Balance is important 💛",



Cheerful:
"Keep smiling! You are doing better than you think ✨",



Flirty:
"Study hard. I might be impressed later 😌",



LZZ:
"Logic analysis complete: studying is the optimal choice 🤖"



};



return messages[buddy.personality]
||
"Your buddy believes in you 🌱";


}











// ===================================
// FRIENDSHIP SYSTEM
// ===================================


function loadFriendship(){


let created =
localStorage.getItem(
"buddyCreated"
);



let days = 0;



if(created){


let start =
new Date(created);


let today =
new Date();



days =
Math.floor(
(today-start)
/(1000*60*60*24)
);


}




let studyMinutes =
getUserData("studyMinutes")
||
0;




let hours =
Math.floor(
studyMinutes/60
);



let minutes =
studyMinutes%60;





let closeness =
Math.min(
Math.floor(
days*2 +
studyMinutes/20
),
100
);





document.getElementById(
"friendshipDays"
).textContent =
days+" days";




document.getElementById(
"studyTime"
).textContent =
hours+"h "
+
minutes
+
"min";




document.getElementById(
"closenessPercent"
).textContent =
closeness+"%";




document.getElementById(
"friendshipProgress"
).style.width =
closeness+"%";





let level =
"New Friend 🌱";



if(closeness>=30)

level =
"Good Friends 🌿";



if(closeness>=60)

level =
"Close Friends 🌳";



if(closeness>=85)

level =
"Best Friends ⭐";





document.getElementById(
"friendshipLevel"
).textContent =
level;



}


// ===================================
// EDIT BUTTON
// ===================================


function editBuddy(){


window.location.href =
"buddy-edit.html";


}ox.textContent =
level;

}



}