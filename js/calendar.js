// ===================================
// STUDY SPACE V4
// CALENDAR & STUDY BUDDY SYSTEM V5
// ===================================

console.log("CALENDAR & STUDY BUDDY V5 LOADED");


// ===================================
// GLOBAL STATE & CONSTANTS
// ===================================

let calendarEvents = [];
let currentDate = new Date();
let currentView = "month";
let editingEventId = null;

const STORAGE_KEY = "calendarEvents";
const BUDDY_POSITION_KEY = "calendarStudyBuddyPosition";


// ===================================
// INITIALIZATION
// ===================================

document.addEventListener("DOMContentLoaded", () => {

    loadEvents();

    setupViewSwitcher();
    setupNavigation();
    setupEventPanel();

    setupStudyBuddy();
    loadCalendarBuddy();

    renderCalendar();

});


// ===================================
// DATA STORAGE
// ===================================

function loadEvents() {

    if (typeof getUserData === "function") {

        calendarEvents = getUserData(STORAGE_KEY) || [];

    } else {

        try {

            calendarEvents =
                JSON.parse(
                    localStorage.getItem(STORAGE_KEY)
                ) || [];

        } catch (error) {

            console.warn("Could not load calendar events:", error);
            calendarEvents = [];

        }

    }

}


function saveEvents() {

    if (typeof saveUserData === "function") {

        saveUserData(
            STORAGE_KEY,
            calendarEvents
        );

    } else {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(calendarEvents)
        );

    }

}


// ===================================
// VIEW SWITCHER
// ===================================

function setupViewSwitcher() {

    const button =
        document.getElementById("viewButton");

    const dropdown =
        document.getElementById("viewDropdown");

    if (!button || !dropdown) {

        console.warn("Calendar view controls not found.");
        return;

    }


    button.onclick = (event) => {

        event.stopPropagation();
        dropdown.classList.toggle("show");

    };


    dropdown
        .querySelectorAll("button")
        .forEach(option => {

            option.onclick = (event) => {

                event.stopPropagation();

                currentView = option.dataset.view;

                button.textContent =
                    option.textContent.trim() + " ▾";

                dropdown.classList.remove("show");

                switchView();

            };

        });


    document.addEventListener("click", () => {

        dropdown.classList.remove("show");

    });

}


function switchView() {

    document
        .querySelectorAll(".calendar-view")
        .forEach(view => {

            view.classList.remove("active");

        });


    const selectedView =
        document.getElementById(currentView + "View");


    if (selectedView) {

        selectedView.classList.add("active");

    }


    renderCalendar();

}


// ===================================
// NAVIGATION
// ===================================

function setupNavigation() {

    const previousButton =
        document.getElementById("previousButton");

    const nextButton =
        document.getElementById("nextButton");

    const todayButton =
        document.getElementById("todayButton");


    if (previousButton) {

        previousButton.onclick = () => {

            if (currentView === "month") {

                currentDate =
                    new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() - 1,
                        1
                    );

            } else if (currentView === "week") {

                currentDate = new Date(currentDate);
                currentDate.setDate(currentDate.getDate() - 7);

            } else if (currentView === "day") {

                currentDate = new Date(currentDate);
                currentDate.setDate(currentDate.getDate() - 1);

            } else if (currentView === "year") {

                currentDate = new Date(currentDate);
                currentDate.setFullYear(currentDate.getFullYear() - 1);

            }

            renderCalendar();

        };

    }


    if (nextButton) {

        nextButton.onclick = () => {

            if (currentView === "month") {

                currentDate =
                    new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() + 1,
                        1
                    );

            } else if (currentView === "week") {

                currentDate = new Date(currentDate);
                currentDate.setDate(currentDate.getDate() + 7);

            } else if (currentView === "day") {

                currentDate = new Date(currentDate);
                currentDate.setDate(currentDate.getDate() + 1);

            } else if (currentView === "year") {

                currentDate = new Date(currentDate);
                currentDate.setFullYear(currentDate.getFullYear() + 1);

            }

            renderCalendar();

        };

    }


    if (todayButton) {

        todayButton.onclick = () => {

            currentDate = new Date();
            renderCalendar();

        };

    }

}


// ===================================
// MAIN RENDER
// ===================================

function renderCalendar() {
    updateTitle();

    if (currentView === "month") {
        renderMonth();

    } else if (currentView === "week") {
        renderWeek();

    } else if (currentView === "day") {
        renderDay();

    } else if (currentView === "year") {
        renderYear();

    }

    renderBottomCards()
}



// ===================================
// CALENDAR TITLE
// ===================================

function updateTitle() {

    const title =
        document.getElementById("calendarTitle");

    if (!title) return;


    if (currentView === "month") {

        title.textContent =
            currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric"
            });

    } else if (currentView === "week") {

        const days = getWeekDays();
        const first = days[0];
        const last = days[6];

        const firstMonth =
            first.toLocaleString("default", { month: "short" });

        const lastMonth =
            last.toLocaleString("default", { month: "short" });


        if (first.getFullYear() === last.getFullYear()) {

            if (first.getMonth() === last.getMonth()) {

                title.textContent =
                    `${firstMonth} ${first.getDate()}–${last.getDate()}, ${first.getFullYear()}`;

            } else {

                title.textContent =
                    `${firstMonth} ${first.getDate()} – ${lastMonth} ${last.getDate()}, ${first.getFullYear()}`;

            }

        } else {

            title.textContent =
                `${firstMonth} ${first.getDate()}, ${first.getFullYear()} – ${lastMonth} ${last.getDate()}, ${last.getFullYear()}`;

        }

    } else if (currentView === "day") {

        title.textContent =
            currentDate.toLocaleDateString("default", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            });

    } else if (currentView === "year") {

        title.textContent = currentDate.getFullYear();

    }

}


// ===================================
// MONTH VIEW
// ===================================

function renderMonth() {

    const grid =
        document.getElementById("monthGrid");

    if (!grid) return;


    grid.innerHTML = "";


    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Monday = first column
    const emptyDays = firstDay === 0 ? 6 : firstDay - 1;


    for (let i = 0; i < emptyDays; i++) {

        const emptyBox = document.createElement("div");
        emptyBox.className = "calendar-day empty-day";
        grid.appendChild(emptyBox);

    }


    for (let day = 1; day <= totalDays; day++) {

        const date =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const box = document.createElement("div");
        box.className = "calendar-day";

        box.innerHTML = `
            <div class="day-number">${day}</div>
            <div class="day-events"></div>
        `;


        if (date === formatDate(new Date())) {

            box.classList.add("today");

        }


        const eventArea = box.querySelector(".day-events");


        calendarEvents
            .filter(event => event.date === date)
            .forEach(event => {

                const tag = document.createElement("div");
                tag.className = "calendar-event-tag";
                tag.style.background = getEventColor(event.category);
                tag.textContent = getIcon(event.category) + " " + event.title;

                tag.onclick = (clickEvent) => {

                    clickEvent.stopPropagation();
                    editEvent(event.id);

                };

                eventArea.appendChild(tag);

            });


        box.onclick = () => {

            editingEventId = null;
            openEventPanel(date);

        };


        grid.appendChild(box);

    }

}


// ===================================
// WEEK VIEW HELPERS & RENDER
// ===================================

function getWeekStart(date) {

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const day = start.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;

    start.setDate(start.getDate() + mondayOffset);

    return start;

}


function getWeekDays() {

    const start = getWeekStart(currentDate);
    const days = [];

    for (let i = 0; i < 7; i++) {

        const day = new Date(start);
        day.setDate(start.getDate() + i);
        days.push(day);

    }

    return days;

}


function renderWeek() {

    const container =
        document.getElementById("weekContainer");

    if (!container) return;


    container.innerHTML = "";

    const days = getWeekDays();


    const header = document.createElement("div");
    header.className = "week-header";

    const corner = document.createElement("div");
    corner.className = "week-corner";
    header.appendChild(corner);


    days.forEach(day => {

        const headerDay = document.createElement("div");
        headerDay.className = "week-day-header";

        if (formatDate(day) === formatDate(new Date())) {

            headerDay.classList.add("today");

        }

        headerDay.innerHTML = `
            <span>
                ${day.toLocaleDateString("default", { weekday: "short" })}
            </span>
            <strong>${day.getDate()}</strong>
        `;

        header.appendChild(headerDay);

    });

    container.appendChild(header);


    const body = document.createElement("div");
    body.className = "week-body";


    for (let hour = 0; hour < 24; hour++) {

        const row = document.createElement("div");
        row.className = "week-row";

        const time = document.createElement("div");
        time.className = "week-time";
        time.textContent = formatHour(hour);
        row.appendChild(time);


        days.forEach(day => {

            const cell = document.createElement("div");
            cell.className = "week-cell";

            cell.onclick = () => {

                editingEventId = null;
                const date = formatDate(day);
                openEventPanel(date);

                const start = document.getElementById("eventStart");

                if (start) {

                    start.value = `${String(hour).padStart(2, "0")}:00`;

                }

            };

            row.appendChild(cell);

        });

        body.appendChild(row);

    }

    container.appendChild(body);

    renderWeekEvents();

}


function renderWeekEvents() {

    const container =
        document.getElementById("weekContainer");

    if (!container) return;


    const days = getWeekDays();
    const rows = container.querySelectorAll(".week-row");


    calendarEvents.forEach(event => {

        if (!event.date) return;


        const dayIndex =
            days.findIndex(day => formatDate(day) === event.date);

        if (dayIndex === -1) return;


        let hour = 0;

        if (event.start) {

            const parts = event.start.split(":");
            hour = parseInt(parts[0], 10);

            if (Number.isNaN(hour)) hour = 0;

        }

        hour = Math.max(0, Math.min(hour, 23));


        const row = rows[hour];
        if (!row) return;

        const cell = row.children[dayIndex + 1];
        if (!cell) return;


        const block = document.createElement("div");
        block.className = "week-event";
        block.style.background = getEventColor(event.category);
        block.textContent = getIcon(event.category) + " " + event.title;

        block.onclick = (clickEvent) => {

            clickEvent.stopPropagation();
            editEvent(event.id);

        };

        cell.appendChild(block);

    });

}


// ===================================
// DAY VIEW
// ===================================

function renderDay() {

    const container =
        document.getElementById("dayContainer");

    if (!container) return;


    container.innerHTML = "";

    const date = formatDate(currentDate);

    const dayEvents =
        calendarEvents.filter(event => event.date === date);

    const wrapper = document.createElement("div");
    wrapper.className = "day-schedule";


    for (let hour = 0; hour < 24; hour++) {

        const row = document.createElement("div");
        row.className = "day-row";

        row.innerHTML = `
            <div class="day-time">${formatHour(hour)}</div>
            <div class="day-slot"></div>
        `;

        const slot = row.querySelector(".day-slot");

        slot.onclick = () => {

            editingEventId = null;
            openEventPanel(date);

            const start = document.getElementById("eventStart");

            if (start) {

                start.value = `${String(hour).padStart(2, "0")}:00`;

            }

        };


        dayEvents
            .filter(event => {

                if (!event.start) return hour === 0;

                const eventHour = parseInt(event.start.split(":")[0], 10);

                return eventHour === hour;

            })
            .forEach(event => {

                const block = document.createElement("div");
                block.className = "day-event";
                block.style.background = getEventColor(event.category);

                const titleText = escapeHTML(event.title);
                const descText = escapeHTML(event.description);

                block.innerHTML = `
                    <strong>
                        ${getIcon(event.category)} ${titleText}
                    </strong>
                    ${
                        event.start
                            ? `<span>${event.start}${event.end ? ` – ${event.end}` : ""}</span>`
                            : ""
                    }
                    ${
                        descText ? `<small>${descText}</small>` : ""
                    }
                `;

                block.onclick = (clickEvent) => {

                    clickEvent.stopPropagation();
                    editEvent(event.id);

                };

                slot.appendChild(block);

            });

        wrapper.appendChild(row);

    }

    container.appendChild(wrapper);

}


// ===================================
// YEAR VIEW
// ===================================

function renderYear() {

    const grid = document.getElementById("yearGrid");

    if (!grid) return;

    grid.innerHTML = "";

    const months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    months.forEach((month, index) => {

        const card = document.createElement("div");
        card.className = "month-card";
        card.textContent = month;

        card.onclick = () => {

            currentView = "month";
            currentDate = new Date(currentDate.getFullYear(), index, 1);
            switchView();

        };

        grid.appendChild(card);

    });

}


// ===================================
// EVENT PANEL MANAGEMENT
// ===================================

function setupEventPanel() {

    const addButton = document.getElementById("addEventButton");
    const closeButton = document.getElementById("closeEventPanel");
    const cancelButton = document.getElementById("cancelEventButton");
    const saveButton = document.getElementById("saveEventButton");
    const deleteButton = document.getElementById("deleteEventButton");

    if (addButton) {

        addButton.onclick = () => {

            editingEventId = null;
            openEventPanel();

        };

    }

    if (closeButton) closeButton.onclick = closeEventPanel;
    if (cancelButton) cancelButton.onclick = closeEventPanel;
    if (saveButton) saveButton.onclick = saveEvent;
    if (deleteButton) deleteButton.onclick = deleteEvent;

}


function openEventPanel(date = "") {

    const panel = document.getElementById("eventPanel");

    if (!panel) return;

    if (!editingEventId) {

        resetPanel();

    }

    panel.classList.add("open");

    if (date) {

        const dateInput = document.getElementById("eventDate");

        if (dateInput) {

            dateInput.value = date;

        }

    }

}


function editEvent(id) {

    const event =
        calendarEvents.find(item => item.id === id);

    if (!event) return;

    editingEventId = id;

    const title = document.getElementById("eventPanelTitle");

    if (title) {

        title.textContent = "Edit Event";

    }

    const fields = {

        eventTitle: event.title || "",
        eventCategory: event.category || "personal",
        eventDate: event.date || "",
        eventStart: event.start || "",
        eventEnd: event.end || "",
        eventDescription: event.description || "",
        eventLocation: event.location || "",
        eventReminder: event.reminder || "none",
        eventRepeat: event.repeat || "none"

    };

    Object.entries(fields).forEach(([fieldId, value]) => {

        const element = document.getElementById(fieldId);

        if (element) {

            element.value = value;

        }

    });

    const deleteButton = document.getElementById("deleteEventButton");

    if (deleteButton) {

        deleteButton.classList.add("show");

    }

    const panel = document.getElementById("eventPanel");

    if (panel) {

        panel.classList.add("open");

    }

}


function saveEvent() {

    const titleInput = document.getElementById("eventTitle");
    const dateInput = document.getElementById("eventDate");

    if (!titleInput || !dateInput) return;

    const title = titleInput.value.trim();
    const date = dateInput.value;

    if (!title) {

        alert("Please enter an event title.");
        titleInput.focus();
        return;

    }

    if (!date) {

        alert("Please choose a date.");
        return;

    }

    const event = {

        id: editingEventId ? editingEventId : Date.now(),
        title: title,
        category: document.getElementById("eventCategory")?.value || "personal",
        date: date,
        start: document.getElementById("eventStart")?.value || "",
        end: document.getElementById("eventEnd")?.value || "",
        description: document.getElementById("eventDescription")?.value || "",
        location: document.getElementById("eventLocation")?.value || "",
        reminder: document.getElementById("eventReminder")?.value || "none",
        repeat: document.getElementById("eventRepeat")?.value || "none"

    };

    if (editingEventId) {

        const index =
            calendarEvents.findIndex(item => item.id === editingEventId);

        if (index !== -1) {

            calendarEvents[index] = event;

        }

    } else {

        calendarEvents.push(event);

    }

    saveEvents();
    closeEventPanel();
    renderCalendar();

}


function deleteEvent() {

    if (!editingEventId) return;

    const event =
        calendarEvents.find(item => item.id === editingEventId);

    if (!event) return;

    const confirmed = confirm(`Delete "${event.title}"?`);

    if (!confirmed) return;

    calendarEvents =
        calendarEvents.filter(item => item.id !== editingEventId);

    saveEvents();
    closeEventPanel();
    renderCalendar();

}


function closeEventPanel() {

    const panel = document.getElementById("eventPanel");

    if (panel) {

        panel.classList.remove("open");

    }

    resetPanel();

}


function resetPanel() {

    editingEventId = null;

    const title = document.getElementById("eventPanelTitle");

    if (title) {

        title.textContent = "New Event";

    }

    const deleteButton = document.getElementById("deleteEventButton");

    if (deleteButton) {

        deleteButton.classList.remove("show");

    }

    const panel = document.getElementById("eventPanel");

    if (!panel) return;

    panel.querySelectorAll("input, textarea").forEach(input => {

        input.value = "";

    });

    panel.querySelectorAll("select").forEach(select => {

        select.selectedIndex = 0;

    });

}


// ===================================
// STUDY BUDDY DRAG & POSITIONING
// ===================================

function setupStudyBuddy() {

    const buddy = document.getElementById("calendarStudyBuddy");

    if (!buddy) {

        console.warn("Study Buddy not found.");
        return;

    }

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;


    // Load Saved Position
    const saved = localStorage.getItem(BUDDY_POSITION_KEY);

    if (saved) {

        try {

            const position = JSON.parse(saved);

            if (
                typeof position.left === "number" &&
                typeof position.top === "number"
            ) {

                buddy.style.left = position.left + "px";
                buddy.style.top = position.top + "px";
                buddy.style.right = "auto";
                buddy.style.bottom = "auto";

            }

        } catch (error) {

            console.warn("Could not load Study Buddy position.");

        }

    }


    // Start Drag
    buddy.addEventListener("pointerdown", (event) => {

        event.preventDefault();

        dragging = true;

        const rect = buddy.getBoundingClientRect();

        startX = event.clientX;
        startY = event.clientY;
        startLeft = rect.left;
        startTop = rect.top;

        buddy.classList.add("dragging");
        buddy.setPointerCapture(event.pointerId);

    });


    // Dragging
    buddy.addEventListener("pointermove", (event) => {

        if (!dragging) return;

        event.preventDefault();

        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        let left = startLeft + deltaX;
        let top = startTop + deltaY;

        const maxLeft = window.innerWidth - buddy.offsetWidth;
        const maxTop = window.innerHeight - buddy.offsetHeight;

        left = Math.max(0, Math.min(left, maxLeft));
        top = Math.max(0, Math.min(top, maxTop));

        buddy.style.left = left + "px";
        buddy.style.top = top + "px";
        buddy.style.right = "auto";
        buddy.style.bottom = "auto";

    });


    // End Drag
    buddy.addEventListener("pointerup", (event) => {

        if (!dragging) return;

        dragging = false;

        buddy.classList.remove("dragging");

        try {

            buddy.releasePointerCapture(event.pointerId);

        } catch (error) {}

        saveStudyBuddyPosition();

    });


    // Cancel Drag
    buddy.addEventListener("pointercancel", () => {

        dragging = false;
        buddy.classList.remove("dragging");

    });


    // Handle Window Resize
    window.addEventListener("resize", () => {

        keepStudyBuddyOnScreen();
        saveStudyBuddyPosition();

    });

}


function saveStudyBuddyPosition() {

    const buddy = document.getElementById("calendarStudyBuddy");

    if (!buddy) return;

    const rect = buddy.getBoundingClientRect();

    localStorage.setItem(
        BUDDY_POSITION_KEY,
        JSON.stringify({
            left: rect.left,
            top: rect.top
        })
    );

}


function keepStudyBuddyOnScreen() {

    const buddy = document.getElementById("calendarStudyBuddy");

    if (!buddy) return;

    const rect = buddy.getBoundingClientRect();

    const maxLeft = window.innerWidth - buddy.offsetWidth;
    const maxTop = window.innerHeight - buddy.offsetHeight;

    const left = Math.max(0, Math.min(rect.left, maxLeft));
    const top = Math.max(0, Math.min(rect.top, maxTop));

    buddy.style.left = left + "px";
    buddy.style.top = top + "px";
    buddy.style.right = "auto";
    buddy.style.bottom = "auto";

}


// ===================================
// LOAD CHOSEN STUDY BUDDY AVATAR
// ===================================

function loadCalendarBuddy() {

    const image = document.getElementById("calendarBuddyImage");

    if (!image) {

        console.warn("calendarBuddyImage not found.");
        return;

    }

    let savedBuddy = null;

    try {

        const saved = localStorage.getItem("selectedBuddy");

        if (saved) {

            savedBuddy = JSON.parse(saved);

        }

    } catch (error) {

        console.warn("Could not load selected buddy.");

    }

    if (!savedBuddy) {

        image.src = "../assets/buddy.png";
        return;

    }

    if (savedBuddy.image) {

        image.src = "../assets/buddies/" + savedBuddy.image;

    } else {

        image.src = "../assets/buddy.png";

    }

    image.onerror = () => {

        console.warn("Could not find buddy image:", savedBuddy.image);
        image.src = "../assets/buddy.png";

    };

}


// ===================================
// FORMATTING & ICON HELPERS
// ===================================

function formatDate(date) {

    const d = new Date(date);

    return (
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0")
    );

}


function formatHour(hour) {

    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour > 12) return `${hour - 12} PM`;

    return `${hour} AM`;

}


function getIcon(type) {

    return {
        study: "📚",
        assignment: "📝",
        birthday: "🎂",
        countdown: "⏳",
        personal: "⭐",
        holiday: "🌴"
    }[type] || "📌";

}


function getEventColor(type) {

    return {
        study: "#8b6848",
        assignment: "#d98b45",
        birthday: "#d66b8f",
        countdown: "#5b9bd5",
        personal: "#70a96b",
        holiday: "#9b7ed8"
    }[type] || "#a67c52";

}


function escapeHTML(str) {

    if (!str) return "";

    return str.replace(
        /[&<>"']/g,
        match => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[match])
    );

}

// ===================================
// BOTTOM INFORMATION CARDS
// ===================================

function renderBottomCards() {
    renderUpcomingEvents();
    renderBirthdays();
    renderCountdowns();
}


// ===================================
// UPCOMING EVENTS
// ===================================

function renderUpcomingEvents() {
    const container = document.getElementById("upcomingEvents");

    if (!container) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = calendarEvents
        .filter(event => {
            if (!event.date) return false;

            // Birthdays and countdowns have their own cards
            if (
                event.category === "birthday" ||
                event.category === "countdown"
            ) {
                return false;
            }

            const eventDate = parseLocalDate(event.date);

            return eventDate >= today;
        })
        .sort((a, b) => {
            const dateA = parseLocalDate(a.date);
            const dateB = parseLocalDate(b.date);

            return dateA - dateB;
        })
        .slice(0, 5);

    container.innerHTML = "";

    if (upcoming.length === 0) {
        container.innerHTML =
            `<p class="empty">No upcoming events</p>`;
        return;
    }

    upcoming.forEach(event => {
        const item = document.createElement("div");
        item.className = "bottom-event";

        const eventDate = parseLocalDate(event.date);

        item.innerHTML = `
            <div class="bottom-event-icon">
                ${getIcon(event.category)}
            </div>

            <div class="bottom-event-info">
                <strong>${escapeHTML(event.title)}</strong>
                <span>
                    ${formatFriendlyDate(eventDate)}
                    ${event.start ? ` · ${event.start}` : ""}
                </span>
            </div>
        `;

        item.onclick = () => {
            editEvent(event.id);
        };

        container.appendChild(item);
    });
}


// ===================================
// BIRTHDAYS
// ===================================

function renderBirthdays() {
    const container = document.getElementById("birthdayList");

    if (!container) return;

    const birthdays = calendarEvents
        .filter(event => event.category === "birthday")
        .sort((a, b) => {
            return getNextBirthday(a.date) - getNextBirthday(b.date);
        });

    container.innerHTML = "";

    if (birthdays.length === 0) {
        container.innerHTML =
            `<p class="empty">No birthdays</p>`;
        return;
    }

    birthdays.forEach(event => {
        const item = document.createElement("div");
        item.className = "bottom-event";

        const nextDate = getNextBirthday(event.date);

        item.innerHTML = `
            <div class="bottom-event-icon">
                🎂
            </div>

            <div class="bottom-event-info">
                <strong>${escapeHTML(event.title)}</strong>
                <span>${formatFriendlyDate(nextDate)}</span>
            </div>
        `;

        item.onclick = () => {
            editEvent(event.id);
        };

        container.appendChild(item);
    });
}


// ===================================
// COUNTDOWNS
// ===================================

function renderCountdowns() {
    const container = document.getElementById("countdownList");

    if (!container) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const countdowns = calendarEvents
        .filter(event => event.category === "countdown")
        .map(event => {
            const targetDate = parseLocalDate(event.date);

            const difference =
                targetDate.getTime() - today.getTime();

            const daysLeft =
                Math.ceil(difference / (1000 * 60 * 60 * 24));

            return {
                ...event,
                targetDate,
                daysLeft
            };
        })
        .filter(event => event.daysLeft >= 0)
        .sort((a, b) => a.targetDate - b.targetDate);

    container.innerHTML = "";

    if (countdowns.length === 0) {
        container.innerHTML =
            `<p class="empty">No countdowns</p>`;
        return;
    }

    countdowns.forEach(event => {
        const item = document.createElement("div");
        item.className = "bottom-event";

        let countdownText;

        if (event.daysLeft === 0) {
            countdownText = "Today!";
        } else if (event.daysLeft === 1) {
            countdownText = "1 day left";
        } else {
            countdownText = `${event.daysLeft} days left`;
        }

        item.innerHTML = `
            <div class="bottom-event-icon">
                ⏳
            </div>

            <div class="bottom-event-info">
                <strong>${escapeHTML(event.title)}</strong>
                <span>
                    ${countdownText} · ${formatFriendlyDate(event.targetDate)}
                </span>
            </div>
        `;

        item.onclick = () => {
            editEvent(event.id);
        };

        container.appendChild(item);
    });
}


// ===================================
// DATE HELPERS
// ===================================

function parseLocalDate(dateString) {
    const [year, month, day] =
        dateString.split("-").map(Number);

    return new Date(year, month - 1, day);
}


function formatFriendlyDate(date) {
    return date.toLocaleDateString("default", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


// ===================================
// NEXT BIRTHDAY
// ===================================

function getNextBirthday(dateString) {
    const original = parseLocalDate(dateString);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let nextBirthday = new Date(
        today.getFullYear(),
        original.getMonth(),
        original.getDate()
    );

    if (nextBirthday < today) {
        nextBirthday.setFullYear(
            today.getFullYear() + 1
        );
    }

    return nextBirthday;
}