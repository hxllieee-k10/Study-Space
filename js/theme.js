// =====================================
// STUDY SPACE V3
// THEME SYSTEM
// =====================================



document.addEventListener(
"DOMContentLoaded",
function(){

    applySavedTheme();

    updateThemeIcon();

});







function toggleTheme(){


    const isDark =
    document.body.classList.contains("dark");



    if(isDark){


        document.body.classList.remove("dark");

        document.documentElement.classList.remove("dark");


        localStorage.setItem(
            "theme",
            "light"
        );


    }else{


        document.body.classList.add("dark");

        document.documentElement.classList.add("dark");


        localStorage.setItem(
            "theme",
            "dark"
        );


    }



    updateThemeIcon();


}







function applySavedTheme(){


    const saved =
    localStorage.getItem("theme");



    if(saved === "dark"){


        document.body.classList.add("dark");

        document.documentElement.classList.add("dark");


    }else{


        document.body.classList.remove("dark");

        document.documentElement.classList.remove("dark");


    }



}








function updateThemeIcon(){



    const button =
    document.getElementById(
        "themeButton"
    );



    if(!button){

        return;

    }




    if(
        document.body.classList.contains("dark")
    ){


        button.innerHTML =
        "☀ Theme";


    }else{


        button.innerHTML =
        "⏾ Theme";


    }


}