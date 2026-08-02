// =====================================
// STUDY SPACE V3
// SHARED SIDEBAR SYSTEM
// sidebar.js
// =====================================



// LOAD SIDEBAR COMPONENT

document.addEventListener(
    "DOMContentLoaded",
    function(){

        loadSidebar();

    }
);






function loadSidebar(){


    const sidebar =
    document.getElementById("sidebar");



    // stop if page has no sidebar

    if(!sidebar){

        return;

    }




    fetch("../components/sidebar.html")


    .then(function(response){


        return response.text();


    })


    .then(function(data){


        sidebar.innerHTML = data;



        updateThemeIcon();



    })


    .catch(function(error){


        console.error(
            "Sidebar loading failed:",
            error
        );


    });



}








// =====================================
// NAVIGATION
// =====================================


function goHome(){

    window.location.href =
    "dashboard.html";

}



function openPomodoro(){

    window.location.href =
    "pomodoro.html";

}



function openTasks(){

    window.location.href =
    "tasks.html";

}



function openCalendar(){

    window.location.href =
    "calendar.html";

}



function openPlanner(){

    window.location.href =
    "planner.html";

}



function openMusic(){

    window.location.href =
    "music.html";

}



function openNotes(){

    window.location.href =
    "notes.html";

}



function openBuddy(){

    window.location.href =
    "buddy.html";

}



function openGoals(){

    window.location.href =
    "goals.html";

}



// function openAchievements(){

 //   window.location.href =
//    "achievements.html";




function openProgress(){

    window.location.href =
    "progress.html";

}



function openSettings(){

    window.location.href =
    "settings.html";

}









// =====================================
// THEME ICON UPDATE
// =====================================


function updateThemeIcon(){


    const button =
    document.getElementById(
        "themeButton"
    );



    if(!button){

        return;

    }




    if(
        document.documentElement
        .classList
        .contains("dark")
    ){

        button.innerHTML =
        "☀ Light";


    }

    else{


        button.innerHTML =
        "☾ Dark";


    }



}