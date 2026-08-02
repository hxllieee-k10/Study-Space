// ===================================
// STUDY SPACE V4
// DASHBOARD SYSTEM
// ===================================

console.log("DASHBOARD JS LOADED");


document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadDashboard();

    }
);


// ===================================
// LOAD DASHBOARD
// ===================================

function loadDashboard() {

    loadUser();

    loadBuddy();

    loadDashboardGoals();

    loadDashboardTasks();
     loadDashboardTodos();
    loadStats();
    
       const addTaskButton =
        document.getElementById(
            "dashboardAddTaskButton"
        );

    if (addTaskButton) {

        addTaskButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "tasks.html";

            }
        );

    }

    document.body.classList.remove(
        "loading"
    );

}


// ===================================
// USER
// ===================================

function loadUser() {

    const user =
        getCurrentUser();


    const name =
        document.getElementById(
            "userName"
        );


    if (!name) return;


    if (user) {

        name.textContent =
            user.nickname || "Student";

    }

    else {

        name.textContent =
            "Student";

    }

}


// ===================================
// STUDY BUDDY
// ===================================

function loadBuddy() {

    const buddy =
        getUserData(
            "buddy"
        );


    console.log(
        "Loaded buddy:",
        buddy
    );


    const image =
        document.getElementById(
            "buddyImage"
        );


    const name =
        document.getElementById(
            "buddyName"
        );


    const personality =
        document.getElementById(
            "buddyPersonality"
        );


    const note =
        document.getElementById(
            "buddyMessage"
        );


    if (!buddy) {

        if (name) {

            name.textContent =
                "No buddy yet";

        }


        if (personality) {

            personality.textContent =
                "Choose your study buddy";

        }


        if (note) {

            note.textContent =
                "Let's find your perfect study companion ☕";

        }


        return;

    }


    // IMAGE

    if (image) {

        image.src =
            "../assets/buddies/" +
            (buddy.image || "cat.png");

    }


    // NAME

    if (name) {

        name.textContent =
            buddy.name ||
            "Mochi";

    }


    // PERSONALITY

    if (personality) {

        personality.textContent =
            (buddy.personality || "Friendly") +
            (
                buddy.mbti
                    ? " • " + buddy.mbti
                    : ""
            );

    }


    // NOTE

    if (note) {

        note.textContent =
            buddy.note ||
            generateBuddyMessage(
                buddy.personality
            );

    }

}


// ===================================
// BUDDY MESSAGE
// ===================================

function generateBuddyMessage(type) {

    const messages = {

        Caring:
            "Remember to take care of yourself too ☕",

        Playful:
            "Your textbook misses you 📚",

        Strict:
            "Stop scrolling. Start studying 💪",

        Funny:
            "Your homework is waiting for you 😭",

        Motivational:
            "Future you will thank you ⭐",

        Calm:
            "Small progress is still progress 🌙",

        Protective:
            "Remember to rest while working 💛",

        Cheerful:
            "You are doing great today ✨",

        Flirty:
            "Study first, rewards later 😌"

    };


    return (
        messages[type] ||
        "Ready to study together ☕"
    );

}


// ===================================
// DASHBOARD GOALS
// ===================================

function loadDashboardGoals() {

    const currentGoal =
        document.getElementById(
            "currentGoal"
        );


    if (!currentGoal) return;


    /*
       Goals page stores everything here:
       "studySpaceGoals"
    */

    const savedGoals =
        localStorage.getItem(
            "studySpaceGoals"
        );


    if (!savedGoals) {

        currentGoal.textContent =
            "No goal yet";

        return;

    }


    let goals = [];


    try {

        goals =
            JSON.parse(
                savedGoals
            );

    }

    catch (error) {

        console.error(
            "Could not load dashboard goals:",
            error
        );

        currentGoal.textContent =
            "No goal yet";

        return;

    }


    if (!Array.isArray(goals) || goals.length === 0) {

        currentGoal.textContent =
            "No goal yet";

        return;

    }


    /*
       Only use active goals.
    */

    const activeGoals =
        goals.filter(
            goal =>
                !goal.completed
        );


    /*
       If every goal is completed.
    */

    if (activeGoals.length === 0) {

        currentGoal.textContent =
            "All goals completed 🎉";

        return;

    }


    /*
       Sort active goals.

       Goals with a target date come first.
       The nearest target date becomes the
       Dashboard's current goal.

       If two goals have no date, their
       creation order is preserved.
    */

    activeGoals.sort(
        (a, b) => {

            if (a.date && b.date) {

                return (
                    new Date(a.date) -
                    new Date(b.date)
                );

            }


            if (a.date && !b.date) {

                return -1;

            }


            if (!a.date && b.date) {

                return 1;

            }


            return (
                (a.createdAt || "") >
                (b.createdAt || "")
            )
                ? 1
                : -1;

        }
    );


    const goal =
        activeGoals[0];


    /*
       Display the goal title and progress.
    */

    currentGoal.textContent =
        `${goal.title} — ${goal.progress || 0}%`;

}


// ===================================
// DASHBOARD TASK PREVIEW
// ===================================

function loadDashboardTasks() {

    const list =
        document.getElementById(
            "taskList"
        );

    if (!list) return;


    // Get the SAME tasks used by Tasks page
    const savedTasks =
        localStorage.getItem(
            "studySpaceTasks"
        );


    let tasks = [];


    try {

        tasks =
            savedTasks
                ? JSON.parse(savedTasks)
                : [];

    } catch (error) {

        console.error(
            "Could not load dashboard tasks:",
            error
        );

        tasks = [];

    }


    // Only unfinished tasks
    const unfinished =
        tasks.filter(
            task =>
                !task.completed
        );


    list.innerHTML = "";


    if (unfinished.length === 0) {

        list.innerHTML =
            `
            <p>
                No tasks today ☕
            </p>
            `;

        return;

    }


    // Show first 3 tasks
    unfinished
        .slice(0, 3)
        .forEach(
            task => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "dashboard-task";


                item.innerHTML =
                    `
                    <h3>
                        ${task.name || "Untitled Task"}
                    </h3>

                    <p>
                        📅
                        ${
                            task.dueDate ||
                            task.date ||
                            "No date"
                        }

                        ${
                            task.time
                                ? `<br>⏰ ${task.time}`
                                : ""
                        }
                    </p>
                    `;


                list.appendChild(
                    item
                );// ===================================
// DASHBOARD TASK PREVIEW
// ===================================

function loadDashboardTasks() {

    const list =
        document.getElementById(
            "taskList"
        );

    if (!list) return;


    // Get the SAME tasks used by Tasks page
    const savedTasks =
        localStorage.getItem(
            "studySpaceTasks"
        );


    let tasks = [];


    try {

        tasks =
            savedTasks
                ? JSON.parse(savedTasks)
                : [];

    } catch (error) {

        console.error(
            "Could not load dashboard tasks:",
            error
        );

        tasks = [];

    }


    // Only unfinished tasks
    const unfinished =
        tasks.filter(
            task =>
                !task.completed
        );


    list.innerHTML = "";


    if (unfinished.length === 0) {

        list.innerHTML =
            `
            <p>
                No tasks today ☕
            </p>
            `;

        return;

    }


    // Show first 3 tasks
    unfinished
        .slice(0, 3)
        .forEach(
            task => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "dashboard-task";


                item.innerHTML =
                    `
                    <h3>
                        ${task.name || "Untitled Task"}
                    </h3>

                    <p>
                        📅
                        ${
                            task.dueDate ||
                            task.date ||
                            "No date"
                        }

                        ${
                            task.time
                                ? `<br>⏰ ${task.time}`
                                : ""
                        }
                    </p>
                    `;


                list.appendChild(
                    item
                );

            }
        );

}

            }
        );

}
// ===================================
// DASHBOARD TODO PREVIEW
// ===================================

function loadDashboardTodos() {

    const list =
        document.getElementById(
            "dashboardTodoList"
        );

    if (!list) return;


    const savedTodos =
        localStorage.getItem(
            "studySpaceTodos"
        );


    let todos = {
        today: [],
        tomorrow: []
    };


    try {

        if (savedTodos) {

            const parsed =
                JSON.parse(savedTodos);

            if (parsed) {
                todos = parsed;
            }

        }

    } catch (error) {

        console.error(
            "Could not load dashboard todos:",
            error
        );

    }


    const todayTodos =
        Array.isArray(todos.today)
            ? todos.today
            : [];


    list.innerHTML = "";


    if (todayTodos.length === 0) {

        list.innerHTML =
            `<p>No todos for today ☕</p>`;

        return;

    }


    todayTodos.forEach(todo => {

        const item =
            document.createElement("div");

        item.className =
            "dashboard-todo";


        if (todo.completed) {

            item.classList.add(
                "completed"
            );

        }


        item.innerHTML = `
            <input
                type="checkbox"
                ${todo.completed ? "checked" : ""}
                disabled
            >

            <span>
                ${todo.text}
            </span>
        `;


        list.appendChild(item);

    });

}
// ===================================
// STATS
// ===================================

function loadStats() {

    const stats =
        getUserData(
            "stats"
        ) || {

            streak: 0,

            focus: 0,

            level: 1

        };


    const streak =
        document.getElementById(
            "streak"
        );


    const focus =
        document.getElementById(
            "focusTime"
        );


    const level =
        document.getElementById(
            "level"
        );


    if (streak) {

        streak.textContent =
            stats.streak || 0;

    }


    if (focus) {

        focus.textContent =
            stats.focus || 0;

    }


    if (level) {

        level.textContent =
            stats.level || 1;

    }

}

