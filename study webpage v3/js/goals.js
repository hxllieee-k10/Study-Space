/* =========================================
   STUDY SPACE V4 - GOALS SYSTEM
========================================= */

console.log("goals.js loaded");

/* =========================================
   VARIABLES
========================================= */

let goals = [];
let editingGoalId = null;

/* =========================================
   START
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadGoals();
    setupGoalButtons();
    setupGoalFilter();
    setupProgressSlider();
    setupGoalBuddy();
    renderGoals();
});

/* =========================================
   STORAGE
========================================= */

function loadGoals() {
    const saved = localStorage.getItem("studySpaceGoals");
    if (!saved) {
        goals = [];
        return;
    }

    try {
        goals = JSON.parse(saved);
        if (!Array.isArray(goals)) {
            goals = [];
        }
    } catch (error) {
        console.error("Could not load goals:", error);
        goals = [];
    }
}

function saveGoals() {
    localStorage.setItem("studySpaceGoals", JSON.stringify(goals));
}

/* =========================================
   BUTTONS
========================================= */

function setupGoalButtons() {
    const addButton = document.getElementById("addGoalButton");
    const emptyButton = document.getElementById("emptyAddGoalButton");
    const closeButton = document.getElementById("closeGoalPanel");
    const cancelButton = document.getElementById("cancelGoalButton");
    const saveButton = document.getElementById("saveGoalButton");
    const deleteButton = document.getElementById("deleteGoalButton");

    if (addButton) addButton.addEventListener("click", openNewGoalPanel);
    if (emptyButton) emptyButton.addEventListener("click", openNewGoalPanel);
    if (closeButton) closeButton.addEventListener("click", closeGoalPanel);
    if (cancelButton) cancelButton.addEventListener("click", closeGoalPanel);
    if (saveButton) saveButton.addEventListener("click", saveCurrentGoal);
    if (deleteButton) deleteButton.addEventListener("click", deleteCurrentGoal);
}

/* =========================================
   FILTER
========================================= */

function setupGoalFilter() {
    const filter = document.getElementById("goalFilter");
    if (!filter) return;

    filter.addEventListener("change", renderGoals);
}

/* =========================================
   PROGRESS SLIDER
========================================= */

function setupProgressSlider() {
    const slider = document.getElementById("goalProgress");
    const value = document.getElementById("goalProgressValue");

    if (!slider || !value) return;

    slider.addEventListener("input", () => {
        value.textContent = `${slider.value}%`;
    });
}

/* =========================================
   OPEN NEW GOAL
========================================= */

function openNewGoalPanel() {
    editingGoalId = null;
    clearGoalForm();

    const title = document.getElementById("goalPanelTitle");
    const deleteButton = document.getElementById("deleteGoalButton");

    if (title) title.textContent = "New Goal";
    if (deleteButton) deleteButton.classList.remove("show");

    openGoalPanel();
}

/* =========================================
   OPEN EDIT
========================================= */

function openEditGoal(goalId) {
    const goal = goals.find(item => item.id === goalId);
    if (!goal) return;

    editingGoalId = goalId;

    document.getElementById("goalPanelTitle").textContent = "Edit Goal";
    document.getElementById("goalTitle").value = goal.title;
    document.getElementById("goalDescription").value = goal.description || "";
    document.getElementById("goalCategory").value = goal.category;
    document.getElementById("goalDate").value = goal.date || "";
    document.getElementById("goalProgress").value = goal.progress;
    document.getElementById("goalProgressValue").textContent = `${goal.progress}%`;

    document.getElementById("deleteGoalButton").classList.add("show");

    openGoalPanel();
}

/* =========================================
   PANEL
========================================= */

function openGoalPanel() {
    const panel = document.getElementById("goalPanel");
    if (panel) {
        panel.classList.add("open");
    }
}

function closeGoalPanel() {
    const panel = document.getElementById("goalPanel");
    if (panel) {
        panel.classList.remove("open");
    }
    editingGoalId = null;
}

/* =========================================
   CLEAR FORM
========================================= */

function clearGoalForm() {
    document.getElementById("goalTitle").value = "";
    document.getElementById("goalDescription").value = "";
    document.getElementById("goalCategory").value = "study";
    document.getElementById("goalDate").value = "";
    document.getElementById("goalProgress").value = 0;
    document.getElementById("goalProgressValue").textContent = "0%";
}

/* =========================================
   SAVE
========================================= */

function saveCurrentGoal() {
    const title = document.getElementById("goalTitle").value.trim();
    const description = document.getElementById("goalDescription").value.trim();
    const category = document.getElementById("goalCategory").value;
    const date = document.getElementById("goalDate").value;
    const progress = Number(document.getElementById("goalProgress").value);

    if (!title) {
        alert("Please enter a goal name.");
        return;
    }

    if (editingGoalId) {
        const goal = goals.find(item => item.id === editingGoalId);
        if (goal) {
            goal.title = title;
            goal.description = description;
            goal.category = category;
            goal.date = date;
            goal.progress = progress;
            goal.completed = progress >= 100;
        }
    } else {
        const newGoal = {
            id: Date.now(),
            title: title,
            description: description,
            category: category,
            date: date,
            progress: progress,
            completed: progress >= 100,
            createdAt: new Date().toISOString()
        };
        goals.push(newGoal);
    }

    saveGoals();
    renderGoals();
    closeGoalPanel();
}

/* =========================================
   DELETE
========================================= */

function deleteCurrentGoal() {
    if (!editingGoalId) return;

    const confirmed = confirm("Delete this goal?");
    if (!confirmed) return;

    goals = goals.filter(goal => goal.id !== editingGoalId);

    saveGoals();
    renderGoals();
    closeGoalPanel();
}

/* =========================================
   COMPLETE
========================================= */

function toggleGoalComplete(goalId) {
    const goal = goals.find(item => item.id === goalId);
    if (!goal) return;

    goal.completed = !goal.completed;
    goal.progress = goal.completed ? 100 : 0;

    saveGoals();
    renderGoals();
}

/* =========================================
   RENDER
========================================= */

function renderGoals() {
    const grid = document.getElementById("goalsGrid");
    const empty = document.getElementById("emptyGoals");

    if (!grid || !empty) return;

    const filterElement = document.getElementById("goalFilter");
    const filter = filterElement ? filterElement.value : "all";

    let visibleGoals = [...goals];

    if (filter === "active") {
        visibleGoals = visibleGoals.filter(goal => !goal.completed);
    }

    if (filter === "completed") {
        visibleGoals = visibleGoals.filter(goal => goal.completed);
    }

    grid.innerHTML = "";

    if (visibleGoals.length === 0) {
        empty.style.display = "block";
    } else {
        empty.style.display = "none";
        visibleGoals.forEach(goal => {
            grid.appendChild(createGoalCard(goal));
        });
    }

    updateSummary();
}

/* =========================================
   CREATE CARD
========================================= */

function createGoalCard(goal) {
    const card = document.createElement("article");
    card.className = "goal-card";

    if (goal.completed) {
        card.classList.add("completed");
    }

    const categoryNames = {
        study: "📚 Study",
        personal: "⭐ Personal",
        health: "🌱 Health",
        hobby: "🎨 Hobby",
        other: "📌 Other"
    };

    let targetText = "No target date";

    if (goal.date) {
        const date = new Date(goal.date + "T00:00:00");
        targetText = `📅 ${date.toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric"
        })}`;
    }

    card.innerHTML = `
        <div class="goal-card-top">
            <span class="goal-category">
                ${categoryNames[goal.category] || "📌 Other"}
            </span>
            <button class="goal-menu" title="Edit goal">⋯</button>
        </div>

        <h3>${escapeHTML(goal.title)}</h3>

        ${
            goal.description
                ? `<p class="goal-description">${escapeHTML(goal.description)}</p>`
                : ""
        }

        <div class="goal-progress-header">
            <span>Progress</span>
            <strong>${goal.progress}%</strong>
        </div>

        <div class="goal-progress-bar">
            <div class="goal-progress-fill" style="width:${goal.progress}%"></div>
        </div>

        <div class="goal-card-bottom">
            <span class="goal-target">${targetText}</span>
            <button class="goal-complete-button">
                ${goal.completed ? "↩ Reopen" : "✓ Complete"}
            </button>
        </div>
    `;

    const menu = card.querySelector(".goal-menu");
    menu.addEventListener("click", () => openEditGoal(goal.id));

    const completeButton = card.querySelector(".goal-complete-button");
    completeButton.addEventListener("click", () => toggleGoalComplete(goal.id));

    return card;
}

/* =========================================
   SUMMARY
========================================= */

function updateSummary() {
    const total = goals.length;
    const completed = goals.filter(goal => goal.completed).length;
    const active = total - completed;

    const totalElement = document.getElementById("totalGoals");
    const activeElement = document.getElementById("activeGoals");
    const completedElement = document.getElementById("completedGoals");

    if (totalElement) totalElement.textContent = total;
    if (activeElement) activeElement.textContent = active;
    if (completedElement) completedElement.textContent = completed;
}

/* =========================================
   HTML SAFETY
========================================= */

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

/* =========================================
   DRAGGABLE STUDY BUDDY
========================================= */

function setupGoalBuddy() {
    const buddy = document.getElementById("goalsStudyBuddy");

    if (!buddy) {
        console.warn("Goals buddy container not found.");
        return;
    }

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    buddy.style.touchAction = "none";
    buddy.addEventListener("pointerdown", startDrag);

    function startDrag(event) {
        if (event.target.closest("button, a, input, select, textarea")) {
            return;
        }

        dragging = true;
        const rect = buddy.getBoundingClientRect();

        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        buddy.style.left = `${rect.left}px`;
        buddy.style.top = `${rect.top}px`;
        buddy.style.right = "auto";
        buddy.style.bottom = "auto";

        buddy.setPointerCapture(event.pointerId);
        buddy.classList.add("dragging");
        event.preventDefault();
    }

    buddy.addEventListener("pointermove", dragBuddy);

    function dragBuddy(event) {
        if (!dragging) return;

        let x = event.clientX - offsetX;
        let y = event.clientY - offsetY;

        const maxX = window.innerWidth - buddy.offsetWidth;
        const maxY = window.innerHeight - buddy.offsetHeight;

        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        buddy.style.left = `${x}px`;
        buddy.style.top = `${y}px`;
    }

    buddy.addEventListener("pointerup", stopDrag);
    buddy.addEventListener("pointercancel", stopDrag);

    function stopDrag(event) {
        if (!dragging) return;

        dragging = false;
        buddy.classList.remove("dragging");

        try {
            buddy.releasePointerCapture(event.pointerId);
        } catch (error) {
            /* Pointer capture may already have been released. */
        }

        saveBuddyPosition();
    }

    loadGoalBuddyImage();
    loadBuddyPosition();
}

/* =========================================
   LOAD SAVED BUDDY IMAGE
========================================= */

function loadGoalBuddyImage() {
    const buddy = document.getElementById("goalsStudyBuddy");
    if (!buddy) {
        console.warn("Goals buddy container not found.");
        return;
    }

    const image = buddy.querySelector("img");
    if (!image) {
        console.warn("No buddy image found inside goalsStudyBuddy.");
        return;
    }

    /* =========================================
       GET SAVED BUDDY
    ========================================= */

    let savedBuddy = null;
    const possibleKeys = [
        "selectedBuddy",
        "studySpaceBuddy",
        "selectedAnimal",
        "buddy",
        "studyBuddy",
        "avatar"
    ];

    for (const key of possibleKeys) {
        const saved = localStorage.getItem(key);
        if (!saved) continue;

        try {
            const parsed = JSON.parse(saved);
            if (typeof parsed === "string") {
                savedBuddy = parsed;
            } else if (parsed && typeof parsed === "object") {
                savedBuddy =
                    parsed.id ||
                    parsed.animal ||
                    parsed.buddy ||
                    parsed.type ||
                    parsed.name ||
                    parsed.selectedBuddy ||
                    parsed.selectedAnimal;
            }
        } catch {
            savedBuddy = saved;
        }

        if (savedBuddy) break;
    }

    if (!savedBuddy) {
        console.warn("No saved buddy selection found.");
        return;
    }

    /* =========================================
       NORMALISE ID
    ========================================= */

    const buddyId = String(savedBuddy).toLowerCase().trim();
    console.log("Saved buddy:", buddyId);

    /* =========================================
       YOUR BUDDY LIST
    ========================================= */

    const buddies = [
        { id: "cat", image: "cat.png" },
        { id: "dog", image: "dog.png" },
        { id: "penguin", image: "penguin.png" },
        { id: "whale", image: "whale.png" },
        { id: "rabbit", image: "rabbit.png" },
        { id: "panda", image: "panda.png" },
        { id: "bear", image: "bear.png" },
        { id: "fox", image: "fox.png" },
        { id: "owl", image: "owl.png" },
        { id: "turtle", image: "turtle.png" },
        { id: "dolphin", image: "dolphin.png" },
        { id: "shark", image: "shark.png" },
        { id: "frog", image: "frog.png" },
        { id: "koala", image: "koala.png" },
        { id: "lion", image: "lion.png" },
        { id: "deer", image: "deer.png" },
        { id: "pig", image: "pig.png" },
        { id: "hamster", image: "hamster.png" },
        { id: "seal", image: "seal.png" },
        { id: "duck", image: "duck.png" }
    ];

    /* =========================================
       FIND BUDDY
    ========================================= */

    const selectedBuddy = buddies.find(item => item.id === buddyId);

    if (!selectedBuddy) {
        console.warn("Unknown saved buddy:", savedBuddy);
        return;
    }

    /* =========================================
       IMAGE PATH
    ========================================= */

    image.src = `../assets/buddies/${selectedBuddy.image}`;
    image.alt = `${selectedBuddy.id} study buddy`;

    image.onerror = () => {
        console.error("Buddy image could not be loaded:", image.src);
    };

    image.onload = () => {
        console.log("Buddy image loaded:", image.src);
    };
}

/* =========================================
   SAVE BUDDY POSITION
========================================= */

function saveBuddyPosition() {
    const buddy = document.getElementById("goalsStudyBuddy");
    if (!buddy) return;

    localStorage.setItem(
        "goalsBuddyPosition",
        JSON.stringify({
            left: buddy.style.left,
            top: buddy.style.top
        })
    );
}

/* =========================================
   LOAD BUDDY POSITION
========================================= */

function loadBuddyPosition() {
    const buddy = document.getElementById("goalsStudyBuddy");
    if (!buddy) return;

    const saved = localStorage.getItem("goalsBuddyPosition");
    if (!saved) return;

    try {
        const position = JSON.parse(saved);
        if (position.left && position.top) {
            buddy.style.left = position.left;
            buddy.style.top = position.top;
            buddy.style.right = "auto";
            buddy.style.bottom = "auto";
        }
    } catch (error) {
        console.error("Could not load buddy position:", error);
    }
}