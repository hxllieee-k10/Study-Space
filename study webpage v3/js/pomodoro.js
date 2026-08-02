// =====================================
// STUDY SPACE V3
// POMODORO SYSTEM + STUDY TRACKING
// =====================================


let timer;

let totalSeconds = 25 * 60;

let remainingSeconds = totalSeconds;

let isRunning = false;


// track time inside current session

let sessionStartSeconds = remainingSeconds;





// =====================================
// PAGE LOAD
// =====================================


window.onload = function(){


    startClock();

    loadBuddy();

    updateTimerDisplay();


};







// =====================================
// REAL CLOCK
// =====================================


function startClock(){


    updateClock();


    setInterval(
        updateClock,
        1000
    );


}



function updateClock(){


    const now =
    new Date();



    let hours =
    now.getHours();



    let minutes =
    now.getMinutes();



    let seconds =
    now.getSeconds();



    let ampm =
    hours >= 12 ? "PM":"AM";



    hours =
    hours % 12 || 12;



    minutes =
    String(minutes)
    .padStart(2,"0");



    seconds =
    String(seconds)
    .padStart(2,"0");



    document.getElementById(
        "realClock"
    ).textContent =
    `${hours}:${minutes}:${seconds} ${ampm}`;




    document.getElementById(
        "dateText"
    ).textContent =
    now.toLocaleDateString(
        "en-MY",
        {
            weekday:"long",
            day:"numeric",
            month:"long",
            year:"numeric"
        }
    );


}









// =====================================
// TIMER DISPLAY
// =====================================


function updateTimerDisplay(){


    let minutes =
    Math.floor(
        remainingSeconds / 60
    );


    let seconds =
    remainingSeconds % 60;



    document.getElementById(
        "timer"
    ).textContent =

    `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;


}









// =====================================
// START
// =====================================


function startTimer(){


    if(isRunning)
    return;



    isRunning = true;



    sessionStartSeconds =
    remainingSeconds;



    document.getElementById(
        "clockMode"
    ).textContent =
    "Focus Mode";





    timer =
    setInterval(()=>{



        if(remainingSeconds <= 0){


            finishSession();

            return;


        }




        remainingSeconds--;



        updateTimerDisplay();



    },1000);



}









// =====================================
// SAVE STUDY TIME
// =====================================


function saveStudiedMinutes(){



    let studiedSeconds =
    sessionStartSeconds -
    remainingSeconds;



    let studiedMinutes =
    Math.floor(
        studiedSeconds / 60
    );



    if(studiedMinutes <= 0)
    return;




    let current =
    getUserData(
        "studyMinutes"
    )
    ||
    0;




    current += studiedMinutes;




    saveUserData(
        "studyMinutes",
        current
    );



    console.log(
        "Study time saved:",
        current,
        "minutes"
    );



}









// =====================================
// PAUSE
// =====================================


function pauseTimer(){


    clearInterval(timer);


    isRunning=false;



    saveStudiedMinutes();



    document.getElementById(
        "clockMode"
    ).textContent =
    "Paused";


}









// =====================================
// RESET
// =====================================


function resetTimer(){



    clearInterval(timer);



    isRunning=false;



    remainingSeconds =
    totalSeconds;



    sessionStartSeconds =
    remainingSeconds;



    updateTimerDisplay();



    document.getElementById(
        "clockMode"
    ).textContent =
    "Ready";


}









// =====================================
// CHANGE DURATION
// =====================================


function setDuration(minutes){



    pauseTimer();



    totalSeconds =
    minutes * 60;



    remainingSeconds =
    totalSeconds;



    sessionStartSeconds =
    remainingSeconds;



    updateTimerDisplay();


}









// =====================================
// FINISH SESSION
// =====================================


function finishSession(){



    clearInterval(timer);



    isRunning=false;



    saveStudiedMinutes();




    document.getElementById(
        "clockMode"
    ).textContent =
    "Session Complete";




    document.getElementById(
        "buddyReminder"
    ).textContent =
    "Amazing work! Your buddy is proud ☕";


}









// =====================================
// LOAD BUDDY IMAGE
// =====================================


function loadBuddy(){



const buddy =
getUserData("buddy");



if(!buddy)
return;



const image =
document.getElementById(
"focusBuddyImage"
);



if(image){


image.src =
"../assets/buddies/"
+
buddy.image;


}



}









// =====================================
// BUDDY REMINDER
// =====================================


function generateReminder(buddy){


const messages=[


`${buddy.name} is ready to focus ☕`,


"Small progress is still progress 🌱",


"Stay focused, you are doing great ✨",


"Your buddy believes in you 🐾"


];



return messages[
Math.floor(
Math.random()*messages.length
)
];


}