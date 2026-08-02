// ===================================
// STUDY SPACE V3
// ACCOUNT SYSTEM
// ===================================



// ===================================
// CREATE ACCOUNT
// ===================================


function createAccount(){


    let nickname =
    document.getElementById("nickname").value.trim();


    let username =
    document.getElementById("username").value.trim();


    let email =
    document.getElementById("email").value.trim();


    let password =
    document.getElementById("password").value;


    let confirmPassword =
    document.getElementById("confirmPassword").value;


    let birthday =
    document.getElementById("birthday").value;




    // Empty check

    if(
        nickname === "" ||
        username === "" ||
        email === "" ||
        password === "" ||
        confirmPassword === "" ||
        birthday === ""
    ){

        showMessage(
            "Please complete all fields.",
            "error"
        );

        return;

    }







    // Password check

    if(password !== confirmPassword){


        showMessage(
            "Passwords do not match.",
            "error"
        );


        return;

    }








    // Age check


    let birthDate =
    new Date(birthday);


    let today =
    new Date();



    let age =
    today.getFullYear()
    -
    birthDate.getFullYear();



    let month =
    today.getMonth()
    -
    birthDate.getMonth();




    if(
        month < 0 ||
        (
            month === 0 &&
            today.getDate() < birthDate.getDate()
        )
    ){

        age--;

    }





    if(age < 13){


        showMessage(
            "You must be 13 or older.",
            "error"
        );


        return;

    }









    // Get users


    let users =
    getData("users") || [];






    // Duplicate email check


    let exists =
    users.some(
        user =>
        user.email === email
    );



    if(exists){


        showMessage(
            "Email already exists.",
            "error"
        );


        return;


    }








    // Create user object


    let user = {


        id:
        Date.now().toString(),


        nickname:nickname,


        username:username,


        email:email,


        password:password,


        birthday:birthday,



        created:
        new Date().toISOString()


    };









    // Save user


    users.push(user);



    saveData(
        "users",
        users
    );









    // Login immediately


    setCurrentUser({


        id:user.id,


        nickname:user.nickname,


        username:user.username,


        email:user.email


    });









    showMessage(
        "˙⋆✮ Creating your study space ✮⋆˙",
        "success"
    );







    setTimeout(()=>{


        window.location.href =
        "pages/avatar.html";


    },1000);



}









// ===================================
// LOGIN
// ===================================


function login(){



    let email =
    document.getElementById("email")
    .value
    .trim();



    let password =
    document.getElementById("password")
    .value;





    let users =
    getData("users") || [];






    let user =
    users.find(

        u =>
        u.email === email &&
        u.password === password

    );







    if(!user){


        showMessage(
            "Incorrect email or password.",
            "error"
        );


        return;


    }








    setCurrentUser({


        id:user.id,


        nickname:user.nickname,


        username:user.username,


        email:user.email


    });









    showMessage(
        "Welcome back (˶˃ ᵕ ˂˶)",
        "success"
    );








    setTimeout(()=>{



        const buddy =
        getUserData("buddy");




        if(buddy){



            window.location.href =
            "pages/dashboard.html";



        }


        else{



            window.location.href =
            "pages/avatar.html";



        }



    },800);



}









// ===================================
// SWITCH TO LOGIN
// ===================================


function showLogin(){



    document.getElementById(
        "formTitle"
    ).innerHTML =
    "Welcome back";






    document.getElementById(
        "birthdaySection"
    ).style.display =
    "none";







    document.getElementById(
        "confirmPassword"
    ).style.display =
    "none";







    document.getElementById(
        "mainButton"
    ).innerHTML =
    "Login";







    document.getElementById(
        "mainButton"
    ).onclick =
    login;








    document.getElementById(
        "switchButton"
    ).style.display =
    "none";



}









// ===================================
// MESSAGE HELPER
// ===================================


function showMessage(text,type){



    let message =
    document.getElementById("message");



    message.innerHTML =
    text;



    message.className =
    type;



}