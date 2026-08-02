// ===================================
// STUDY SPACE V3
// USER STORAGE SYSTEM FIXED
// ===================================



// ===================================
// NORMAL STORAGE
// ===================================


// Save normal data

function saveData(key, value){


    localStorage.setItem(

        key,

        JSON.stringify(value)

    );


}






// Get normal data

function getData(key){


    const data =
    localStorage.getItem(key);



    if(!data){

        return null;

    }





    try{


        return JSON.parse(data);


    }

    catch(error){


        console.error(
            "Storage data corrupted:",
            key
        );


        return null;


    }


}







// Remove data

function removeData(key){


    localStorage.removeItem(key);


}







// Clear everything

function clearData(){


    localStorage.clear();


}









// ===================================
// USER SYSTEM
// ===================================



const USER_KEY =
"studyspace_currentUser";








// Get currently logged in user

function getCurrentUser(){


    return getData(
        USER_KEY
    );


}









// Set logged in user

function setCurrentUser(user){


    saveData(

        USER_KEY,

        user

    );


}









// Logout

function logout(){


    removeData(
        USER_KEY
    );


    window.location.href =
    "../index.html";


}












// ===================================
// PERSONAL USER DATA
// ===================================



// Save data for current user

function saveUserData(
section,
value
){



    const user =
    getCurrentUser();




    if(!user){


        console.warn(
            "No logged in user"
        );


        return;


    }







    const key =

    "user_"

    +

    user.id

    +

    "_"

    +

    section;







    saveData(

        key,

        value

    );



}











// Get personal user data

function getUserData(
section
){



    const user =
    getCurrentUser();




    if(!user){


        return null;


    }








    const key =

    "user_"

    +

    user.id

    +

    "_"

    +

    section;







    return getData(
        key
    );



}












// Delete personal user data

function deleteUserData(
section
){



    const user =
    getCurrentUser();




    if(!user){


        return;


    }







    const key =

    "user_"

    +

    user.id

    +

    "_"

    +

    section;








    removeData(
        key
    );


}









// ===================================
// DEBUG
// ===================================


function debugStorage(){


    console.log(
        "Current User:",
        getCurrentUser()
    );



    console.log(
        "Tasks:",
        getUserData("tasks")
    );



    console.log(
        "Todos:",
        getUserData("todos")
    );


}