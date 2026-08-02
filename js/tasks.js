/* =========================================================
   STUDY SPACE — TASKS JAVASCRIPT
   ========================================================= */

/* =========================================================
   STORAGE
   ========================================================= */
const TODO_STORAGE_KEY = "studySpaceTodos";
const TASK_STORAGE_KEY = "studySpaceTasks";

/* =========================================================
   DATA
   ========================================================= */
let todos = {
    today: [],
    tomorrow: []
};
let tasks = [];
let editingTaskId = null;

/* =========================================================
   DOM ELEMENTS
   ========================================================= */
// Todo
const todayTodoList = document.getElementById("todayTodoList");
const tomorrowTodoList = document.getElementById("tomorrowTodoList");
const todayTodoInput = document.getElementById("todayTodoInput");
const tomorrowTodoInput = document.getElementById("tomorrowTodoInput");

// Tasks
const taskList = document.getElementById("taskList");
const addTaskButton = document.getElementById("addTaskButton");

// Side panel
const taskPanel = document.getElementById("taskPanel");
const taskPanelOverlay = document.getElementById("taskPanelOverlay");
const closeTaskPanel = document.getElementById("closeTaskPanel");
const cancelTaskButton = document.getElementById("cancelTaskButton");

// Form
const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const taskDuration = document.getElementById("taskDuration");
const taskDurationUnit = document.getElementById("taskDurationUnit");
const taskPriority = document.getElementById("taskPriority");
const taskDueDate = document.getElementById("taskDueDate");
const taskDescription = document.getElementById("taskDescription");

// Panel text
const panelLabel = document.getElementById("panelLabel");
const panelTitle = document.getElementById("panelTitle");
const saveTaskButton = document.getElementById("saveTaskButton");

/* =========================================================
   INITIALIZE
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    loadTodos();
    loadTasks();
    renderTodos();
    renderTasks();
    setupTodoInputs();
    setupTaskPanel();
    setDefaultTaskDate();
});

/* =========================================================
   TODO STORAGE
   ========================================================= */
function loadTodos() {
    try {
        const savedTodos = localStorage.getItem(TODO_STORAGE_KEY);
        if (!savedTodos) return;
        const parsedTodos = JSON.parse(savedTodos);
        if (parsedTodos && typeof parsedTodos === "object") {
            todos.today = Array.isArray(parsedTodos.today) ? parsedTodos.today : [];
            todos.tomorrow = Array.isArray(parsedTodos.tomorrow) ? parsedTodos.tomorrow : [];
        }
    } catch (error) {
        console.error("Could not load todos:", error);
        todos = { today: [], tomorrow: [] };
    }
}

function saveTodos() {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

/* =========================================================
   TODO INPUTS
   ========================================================= */
function setupTodoInputs() {
    todayTodoInput.addEventListener("keydown", function (event) {
        if (event.key !== "Enter") return;
        event.preventDefault();
        addTodo("today");
    });

    tomorrowTodoInput.addEventListener("keydown", function (event) {
        if (event.key !== "Enter") return;
        event.preventDefault();
        addTodo("tomorrow");
    });
}

/* =========================================================
   ADD TODO
   ========================================================= */
function addTodo(day) {
    const input = day === "today" ? todayTodoInput : tomorrowTodoInput;
    const text = input.value.trim();
    if (!text) return;

    const todo = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 8),
        text: text,
        completed: false
    };

    todos[day].push(todo);
    saveTodos();
    renderTodos();

    input.value = "";
    input.focus();
}

/* =========================================================
   RENDER TODOS
   ========================================================= */
function renderTodos() {
    renderTodoList(todayTodoList, todos.today, "today");
    renderTodoList(tomorrowTodoList, todos.tomorrow, "tomorrow");
}
function renderTodoList(
    container,
    todoArray,
    day
) {

    container.innerHTML = "";


    todoArray.forEach(todo => {

        const todoItem =
            document.createElement("div");

        todoItem.className = "todo-item";


        /* Completed class */

        if (todo.completed) {

            todoItem.classList.add(
                "completed"
            );

        }


        /* =========================================
           CHECKBOX
        ========================================== */

        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className =
            "todo-checkbox";

        checkbox.checked =
            Boolean(todo.completed);

        checkbox.setAttribute(
            "aria-label",
            "Mark todo as complete"
        );


        checkbox.addEventListener(
            "change",
            () => {

                todo.completed =
                    checkbox.checked;

                saveTodos();

                renderTodos();

            }
        );


        /* =========================================
           TODO TEXT
        ========================================== */

        const todoText =
            document.createElement("span");

        todoText.className =
            "todo-item-text";

        todoText.textContent =
            todo.text;


        /* =========================================
           DELETE "-"
        ========================================== */

        const deleteButton =
            document.createElement("button");

        deleteButton.type =
            "button";

        deleteButton.className =
            "todo-delete";

        deleteButton.textContent =
            "−";

        deleteButton.setAttribute(
            "aria-label",
            "Delete todo"
        );


        deleteButton.addEventListener(
            "click",
            () => {

                deleteTodo(
                    day,
                    todo.id
                );

            }
        );


        /* =========================================
           BUILD TODO
        ========================================== */

        todoItem.appendChild(
            checkbox
        );

        todoItem.appendChild(
            todoText
        );

        todoItem.appendChild(
            deleteButton
        );


        container.appendChild(
            todoItem
        );

    });

}

/* =========================================================
   DELETE TODO
   ========================================================= */
function deleteTodo(day, todoId) {
    todos[day] = todos[day].filter(todo => todo.id !== todoId);
    saveTodos();
    renderTodos();
}

/* =========================================================
   TASK STORAGE
   ========================================================= */
function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(TASK_STORAGE_KEY);
        if (!savedTasks) return;
        const parsedTasks = JSON.parse(savedTasks);
        if (Array.isArray(parsedTasks)) {
            tasks = parsedTasks;
        }
    } catch (error) {
        console.error("Could not load tasks:", error);
        tasks = [];
    }
}

function saveTasks() {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
}

/* =========================================================
   TASK PANEL
   ========================================================= */
function setupTaskPanel() {
    addTaskButton.addEventListener("click", () => {
        openAddTaskPanel();
    });
    closeTaskPanel.addEventListener("click", closePanel);
    cancelTaskButton.addEventListener("click", closePanel);
    taskPanelOverlay.addEventListener("click", closePanel);
    taskForm.addEventListener("submit", handleTaskSubmit);
}

/* =========================================================
   OPEN ADD TASK PANEL
   ========================================================= */
function openAddTaskPanel() {
    editingTaskId = null;
    resetTaskForm();
    panelLabel.textContent = "NEW TASK";
    panelTitle.textContent = "Add Task";
    saveTaskButton.textContent = "Add Task";

    taskPanel.classList.add("open");
    taskPanelOverlay.classList.add("open");
    taskPanel.setAttribute("aria-hidden", "false");

    setDefaultTaskDate();
    setTimeout(() => {
        taskName.focus();
    }, 250);
}

/* =========================================================
   OPEN EDIT TASK PANEL
   ========================================================= */
function openEditTaskPanel(taskId) {
    const task = tasks.find(item => item.id === taskId);
    if (!task) return;

    editingTaskId = taskId;
    taskName.value = task.name || "";
    taskDate.value = task.date || "";
    taskTime.value = task.time || "";
    taskDuration.value = task.duration || "";
    taskDurationUnit.value = task.durationUnit || "minutes";
    taskPriority.value = task.priority || "medium";
    taskDueDate.value = task.dueDate || "";
    taskDescription.value = task.description || "";

    panelLabel.textContent = "EDIT TASK";
    panelTitle.textContent = "Edit Task";
    saveTaskButton.textContent = "Save Changes";

    taskPanel.classList.add("open");
    taskPanelOverlay.classList.add("open");
    taskPanel.setAttribute("aria-hidden", "false");

    setTimeout(() => {
        taskName.focus();
    }, 250);
}

/* =========================================================
   CLOSE PANEL
   ========================================================= */
function closePanel() {
    editingTaskId = null;
    taskPanel.classList.remove("open");
    taskPanelOverlay.classList.remove("open");
    taskPanel.setAttribute("aria-hidden", "true");
    resetTaskForm();
}

/* =========================================================
   RESET FORM
   ========================================================= */
function resetTaskForm() {
    taskForm.reset();
    taskDurationUnit.value = "minutes";
    taskPriority.value = "medium";
}

/* =========================================================
   DEFAULT DATE
   ========================================================= */
function setDefaultTaskDate() {
    if (!taskDate.value) {
        taskDate.value = getTodayDate();
    }
}

/* =========================================================
   GET TODAY DATE
   ========================================================= */
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/* =========================================================
   TASK SUBMISSION
   ========================================================= */
function handleTaskSubmit(event) {
    event.preventDefault();
    const name = taskName.value.trim();
    if (!name) {
        taskName.focus();
        return;
    }

    const taskData = {
        name: name,
        date: taskDate.value,
        time: taskTime.value,
        duration: taskDuration.value,
        durationUnit: taskDurationUnit.value,
        priority: taskPriority.value,
        dueDate: taskDueDate.value,
        description: taskDescription.value.trim()
    };

    /* EDITING EXISTING TASK */
    if (editingTaskId) {
        const taskIndex = tasks.findIndex(task => task.id === editingTaskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                ...taskData
            };
        }
    }
    /* ADDING NEW TASK */
   else {
    const newTask = {
        id:
            Date.now().toString() +
            Math.random()
                .toString(36)
                .substring(2, 8),

        completed: false,

        ...taskData
    };

    tasks.push(newTask);   // ← ADD THIS

    saveTasks();
    renderTasks();
    closePanel();
}
}
/* =========================================================
   RENDER TASKS
   ========================================================= */
function renderTasks() {
    taskList.innerHTML = "";
    if (tasks.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-task-state";
        const message = document.createElement("p");
        message.textContent = "No tasks yet. Add your first task.";
        empty.appendChild(message);
        taskList.appendChild(empty);
        return;
    }

    /* Sort by due date */
    const sortedTasks = [...tasks].sort((a, b) => {
        const dateA = a.dueDate || a.date || "9999-12-31";
        const dateB = b.dueDate || b.date || "9999-12-31";
        return dateA.localeCompare(dateB);
    });

    sortedTasks.forEach(task => {
        const card = createTaskCard(task);
        taskList.appendChild(card);
    });
}

/* =========================================================
   CREATE TASK CARD
   ========================================================= */
function createTaskCard(task) {
    const card = document.createElement("article");
    card.className = "task-card";

    /* Completed task */
    if (task.completed) {
        card.classList.add("completed");
    }

    /* =========================================
       HEADER
    ========================================== */
    const header = document.createElement("div");
    header.className = "task-card-header";

    /* =========================================
       LEFT SIDE
    ========================================== */
    const mainRow = document.createElement("div");
    mainRow.className = "task-main-row";

    /* =========================================
       TASK CHECKBOX
    ========================================== */
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = Boolean(task.completed);
    checkbox.setAttribute("aria-label", "Mark task as complete");

    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
    });

    /* =========================================
       TASK TITLE
    ========================================== */
    const title = document.createElement("h3");
    title.className = "task-card-title";
    title.textContent = task.name;

    mainRow.appendChild(checkbox);
    mainRow.appendChild(title);

    /* =========================================
       THREE DOT MENU
    ========================================== */
    const menuWrapper = document.createElement("div");
    menuWrapper.className = "task-menu-wrapper";

    const menuButton = document.createElement("button");
    menuButton.type = "button";
    menuButton.className = "task-menu-button";
    menuButton.textContent = "⋮";
    menuButton.setAttribute("aria-label", "Task options");

    const menu = document.createElement("div");
    menu.className = "task-menu";

    /* =========================================
       EDIT BUTTON
    ========================================== */
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";

    editButton.addEventListener("click", event => {
        event.stopPropagation();
        closeAllTaskMenus();
        openEditTaskPanel(task.id);
    });

    /* =========================================
       DELETE BUTTON
    ========================================== */
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "task-menu-delete";

    deleteButton.addEventListener("click", event => {
        event.stopPropagation();
        closeAllTaskMenus();
        deleteTask(task.id);
    });

    menu.appendChild(editButton);
    menu.appendChild(deleteButton);

    menuButton.addEventListener("click", event => {
        event.stopPropagation();
        closeAllTaskMenus(menu);
        menu.classList.toggle("open");
    });

    menuWrapper.appendChild(menuButton);
    menuWrapper.appendChild(menu);

    header.appendChild(mainRow);
    header.appendChild(menuWrapper);

    /* =========================================
       DETAILS
    ========================================== */
    const details = document.createElement("div");
    details.className = "task-details";

    /* DATE */
    if (task.date) {
        details.appendChild(createDetail("Date: " + formatDate(task.date)));
    }

    /* TIME */
    if (task.time) {
        details.appendChild(createDetail("Time: " + formatTime(task.time)));
    }

    /* DURATION */
    if (task.duration) {
        details.appendChild(createDetail("Duration: " + task.duration + " " + task.durationUnit));
    }

    /* DUE DATE */
    if (task.dueDate) {
        details.appendChild(createDetail("Due: " + formatDate(task.dueDate)));
    }

    /* PRIORITY */
    if (task.priority) {
        const priority = document.createElement("span");
        priority.className = "task-detail task-priority";

        if (task.priority === "high") {
            priority.classList.add("task-priority-high");
        } else if (task.priority === "medium") {
            priority.classList.add("task-priority-medium");
        } else {
            priority.classList.add("task-priority-low");
        }

        priority.textContent = "Priority: " + capitalize(task.priority);
        details.appendChild(priority);
    }

    /* =========================================
       DESCRIPTION
    ========================================== */
    let descriptionElement = null;

    if (task.description) {
        descriptionElement = document.createElement("p");
        descriptionElement.className = "task-description";
        descriptionElement.textContent = task.description;
    }

    /* =========================================
       BUILD CARD
    ========================================== */
    card.appendChild(header);

    if (details.children.length > 0) {
        card.appendChild(details);
    }

    if (descriptionElement) {
        card.appendChild(descriptionElement);
    }

    return card;
}

/* =========================================================
   CREATE DETAIL
   ========================================================= */
function createDetail(text) {
    const detail = document.createElement("span");
    detail.className = "task-detail";
    detail.textContent = text;
    return detail;
}

/* =========================================================
   DELETE TASK
   ========================================================= */
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

/* =========================================================
   CLOSE ALL TASK MENUS
   ========================================================= */
function closeAllTaskMenus(except = null) {
    document.querySelectorAll(".task-menu.open").forEach(menu => {
        if (menu !== except) {
            menu.classList.remove("open");
        }
    });
}

/* =========================================================
   CLICK OUTSIDE MENU
   ========================================================= */
document.addEventListener("click", () => {
    closeAllTaskMenus();
});

/* =========================================================
   ESCAPE KEY
   ========================================================= */
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeAllTaskMenus();
        if (taskPanel.classList.contains("open")) {
            closePanel();
        }
    }
});

/* =========================================================
   FORMAT DATE
   ========================================================= */
function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

/* ===============do==========================================
   FORMAT TIME
   ========================================================= */
function formatTime(timeString) {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));
    return date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit"
    });
}

/* =========================================================
   CAPITALIZE
   ========================================================= */
function capitalize(text) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
}s