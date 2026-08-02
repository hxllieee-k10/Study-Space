// =====================================
// STUDY SPACE V3
// FOCUS MODE SIDEBAR
// =====================================

// =====================================
// COLLAPSE / EXPAND SIDEBAR
// =====================================


function toggleFocusSidebar(){

    const sidebar =
    document.getElementById("focusSidebar");


    sidebar.classList.toggle("collapsed");


    document.body.classList.toggle(
        "focus-collapsed"
    );


    const isCollapsed =
    sidebar.classList.contains("collapsed");


    localStorage.setItem(
        "focusSidebarCollapsed",
        isCollapsed
    );

}


// =====================================
// LOAD SIDEBAR STATE
// =====================================


window.addEventListener(
"DOMContentLoaded",
function(){



    const sidebar =
    document.getElementById("focusSidebar");



    if(!sidebar) return;



    const saved =
    localStorage.getItem(
        "focusSidebarCollapsed"
    );



    // default = collapsed

    if(saved === "false"){


        sidebar.classList.remove(
            "collapsed"
        );


    }



});



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



function openMusic(){

    window.location.href =
    "music.html";

}


function openBuddy(){

    window.location.href =
    "study-buddy.html";

}


function openSettings(){

    window.location.href =
    "settings.html";

}