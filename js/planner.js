/* STUDY SPACE PLANNER SYSTEM */
console.log("planner.js loaded");

let plans = [];
let editingPlanId = null;
const PLANNER_STORAGE_KEY = "studySpacePlanner";
let currentWeekStart = getStartOfWeek(new Date());

/* START */
document.addEventListener("DOMContentLoaded", () => {
  loadPlans();
  setupPlannerButtons();
  setupPlanPanel();
  renderPlanner();
});

/* STORAGE */
function loadPlans() {
  const saved = localStorage.getItem(PLANNER_STORAGE_KEY);
  if (!saved) { plans = []; return; }
  try {
    const parsed = JSON.parse(saved);
    plans = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Could not load planner data:", error);
    plans = [];
  }
}
function savePlans() {
  localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(plans));
}

/* BUTTONS */
function setupPlannerButtons() {
  const addButton = document.getElementById("addPlanButton");
  const emptyButton = document.getElementById("emptyAddPlanButton");
  const previousButton = document.getElementById("previousWeekButton");
  const nextButton = document.getElementById("nextWeekButton");
  const todayButton = document.getElementById("todayButton");

  if (addButton) addButton.addEventListener("click", openNewPlanPanel);
  if (emptyButton) emptyButton.addEventListener("click", openNewPlanPanel);

  if (previousButton) {
    previousButton.addEventListener("click", () => {
      currentWeekStart = addDays(currentWeekStart, -7);
      renderPlanner();
    });
  }
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      currentWeekStart = addDays(currentWeekStart, 7);
      renderPlanner();
    });
  }
  if (todayButton) {
    todayButton.addEventListener("click", () => {
      currentWeekStart = getStartOfWeek(new Date());
      renderPlanner();
    });
  }
}

/* PANEL */
function setupPlanPanel() {
  const closeButton = document.getElementById("closePlanPanel");
  const cancelButton = document.getElementById("cancelPlanButton");
  const saveButton = document.getElementById("savePlanButton");
  const deleteButton = document.getElementById("deletePlanButton");

  if (closeButton) closeButton.addEventListener("click", closePlanPanel);
  if (cancelButton) cancelButton.addEventListener("click", closePlanPanel);
  if (saveButton) saveButton.addEventListener("click", saveCurrentPlan);
  if (deleteButton) deleteButton.addEventListener("click", deleteCurrentPlan);
}
/* OPEN NEW PLAN */
function openNewPlanPanel() {
  editingPlanId = null;
  clearPlanForm();
  const title = document.getElementById("planPanelTitle");
  const deleteButton = document.getElementById("deletePlanButton");
  if (title) title.textContent = "Add Plan";
  if (deleteButton) deleteButton.classList.remove("show");
  const dateInput = document.getElementById("planDate");
  if (dateInput) dateInput.value = formatInputDate(new Date());
  openPlanPanel();
}

/* OPEN EDIT PLAN */
function openEditPlan(planId) {
  const plan = plans.find(item => item.id === planId);
  if (!plan) return;
  editingPlanId = planId;
  document.getElementById("planPanelTitle").textContent = "Edit Plan";
  document.getElementById("planTitle").value = plan.title || "";
  document.getElementById("planDate").value = plan.date || "";
  document.getElementById("planSubject").value = plan.subject || "";
  document.getElementById("planStartTime").value = plan.startTime || "";
  document.getElementById("planEndTime").value = plan.endTime || "";
  document.getElementById("planNotes").value = plan.notes || "";
  document.getElementById("deletePlanButton").classList.add("show");
  openPlanPanel();
}

/* PANEL OPEN / CLOSE */
function openPlanPanel() {
  const overlay = document.getElementById("planPanelOverlay");
  if (overlay) overlay.classList.add("open");
}
function closePlanPanel() {
  const overlay = document.getElementById("planPanelOverlay");
  if (overlay) overlay.classList.remove("open");
  editingPlanId = null;
}

/* CLEAR FORM */
function clearPlanForm() {
  const title = document.getElementById("planTitle");
  const date = document.getElementById("planDate");
  const subject = document.getElementById("planSubject");
  const startTime = document.getElementById("planStartTime");
  const endTime = document.getElementById("planEndTime");
  const notes = document.getElementById("planNotes");
  if (title) title.value = "";
  if (date) date.value = "";
  if (subject) subject.value = "";
  if (startTime) startTime.value = "";
  if (endTime) endTime.value = "";
  if (notes) notes.value = "";
}

/* SAVE PLAN */
function saveCurrentPlan() {
  const titleInput = document.getElementById("planTitle");
  const dateInput = document.getElementById("planDate");
  const subjectInput = document.getElementById("planSubject");
  const startInput = document.getElementById("planStartTime");
  const endInput = document.getElementById("planEndTime");
  const notesInput = document.getElementById("planNotes");

  const title = titleInput.value.trim();
  const date = dateInput.value;
  const subject = subjectInput.value.trim();
  const startTime = startInput.value;
  const endTime = endInput.value;
  const notes = notesInput.value.trim();

  if (!title) { alert("Please enter a plan title."); return; }
  if (!date) { alert("Please choose a date."); return; }
  if (startTime && endTime && startTime >= endTime) {
    alert("The end time must be after the start time."); return;
  }

  if (editingPlanId) {
    const plan = plans.find(item => item.id === editingPlanId);
    if (plan) {
      plan.title = title;
      plan.date = date;
      plan.subject = subject;
      plan.startTime = startTime;
      plan.endTime = endTime;
      plan.notes = notes;
    }
  } else {
    plans.push({
      id: Date.now(),
      title,
      date,
      subject,
      startTime,
      endTime,
      notes,
      createdAt: new Date().toISOString()
    });
  }

  sortPlans();
  savePlans();
  renderPlanner();
  closePlanPanel();
}
/* DELETE PLAN */
function deleteCurrentPlan() {
  if (!editingPlanId) return;
  const confirmed = confirm("Delete this plan?");
  if (!confirmed) return;
  plans = plans.filter(plan => plan.id !== editingPlanId);
  savePlans();
  renderPlanner();
  closePlanPanel();
}

/* SORT */
function sortPlans() {
  plans.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return (a.startTime || "").localeCompare(b.startTime || "");
  });
}

/* RENDER PLANNER */
function renderPlanner() {
  renderWeekTitle();
  renderWeek();
  renderWeeklyOverview();
}

/* WEEK TITLE */
function renderWeekTitle() {
  const title = document.getElementById("weekTitle");
  const range = document.getElementById("weekDateRange");
  const weekEnd = addDays(currentWeekStart, 6);
  if (title) title.textContent = isCurrentWeek() ? "This Week" : "Study Week";
  if (range) range.textContent = formatDateRange(currentWeekStart, weekEnd);
}

/* WEEK GRID */
function renderWeek() {
  const week = document.getElementById("plannerWeek");
  if (!week) return;
  week.innerHTML = "";
  for (let i = 0; i < 7; i++) {
    const date = addDays(currentWeekStart, i);
    week.appendChild(createDayColumn(date));
  }
}

/* CREATE DAY */
function createDayColumn(date) {
  const column = document.createElement("div");
  column.className = "planner-day";
  if (isSameDate(date, new Date())) column.classList.add("today");

  const header = document.createElement("div");
  header.className = "planner-day-header";
  const dayName = document.createElement("p");
  dayName.className = "planner-day-name";
  dayName.textContent = date.toLocaleDateString(undefined, { weekday: "short" });
  const dayNumber = document.createElement("p");
  dayNumber.className = "planner-day-number";
  dayNumber.textContent = date.getDate();
  header.appendChild(dayName);
  header.appendChild(dayNumber);

  const content = document.createElement("div");
  content.className = "planner-day-content";
  const dateString = formatInputDate(date);
  const dayPlans = plans.filter(plan => plan.date === dateString);

  if (dayPlans.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-day";
    empty.textContent = "No plans";
    content.appendChild(empty);
  } else {
    dayPlans.forEach(plan => content.appendChild(createPlanCard(plan)));
  }

  column.appendChild(header);
  column.appendChild(content);
  column.addEventListener("dblclick", () => openNewPlanPanelForDate(dateString));
  return column;
}

/* PLAN CARD */
function createPlanCard(plan) {
  const card = document.createElement("article");
  card.className = "plan-card";
  const title = document.createElement("h3");
  title.className = "plan-card-title";
  title.textContent = plan.title;
  const time = document.createElement("p");
  time.className = "plan-card-time";
  time.textContent = formatTimeRange(plan.startTime, plan.endTime);
  const subject = document.createElement("p");
  subject.className = "plan-card-subject";
  subject.textContent = plan.subject || "Study plan";

  card.appendChild(title);
  if (plan.startTime || plan.endTime) card.appendChild(time);
  card.appendChild(subject);
  card.addEventListener("click", () => openEditPlan(plan.id));
  return card;
}

/* OPEN PANEL FOR DATE */
function openNewPlanPanelForDate(date) {
  openNewPlanPanel();
  const dateInput = document.getElementById("planDate");
  if (dateInput) dateInput.value = date;
}

/* WEEKLY OVERVIEW */
function renderWeeklyOverview() {
  const list = document.getElementById("weeklyPlanList");
  const empty = document.getElementById("emptyPlans");
  if (!list || !empty) return;
  list.innerHTML = "";
  const weekEnd = addDays(currentWeekStart, 6);
  const weekPlans = plans.filter(plan => {
    if (!plan.date) return false;
    const date = parseInputDate(plan.date);
    return date >= currentWeekStart && date <= weekEnd;
  });

  if (weekPlans.length === 0) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";
  weekPlans.forEach(plan => list.appendChild(createWeeklyPlanItem(plan)));
}

/* WEEKLY PLAN ITEM */
function createWeeklyPlanItem(plan) {
  const item = document.createElement("article");
  item.className = "weekly-plan-item";
  const date = document.createElement("div");
  date.className = "weekly-plan-date";
  date.textContent = formatShortDate(plan.date);
  const info = document.createElement("div");
  info.className = "weekly-plan-info";
  const title = document.createElement("h3");
  title.textContent = plan.title;
  const details = document.createElement("p");
  details.textContent = plan.subject || "Study plan";
  info.appendChild(title);
  info.appendChild(details);
  const time = document.createElement("div");
  time.className = "weekly-plan-time";
  time.textContent = formatTimeRange(plan.startTime, plan.endTime);

  item.appendChild(date);
  item.appendChild(info);
  item.appendChild(time);
  item.addEventListener("click", () => openEditPlan(plan.id));
  return item;
}

/* DATE HELPERS */
function getStartOfWeek(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  const day = result.getDay();
  const difference = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + difference);
  return result;
}
function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}
function parseInputDate(dateString) {
  return new Date(dateString + "T00:00:00");
}
function formatInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}
function isSameDate(first, second) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}
function isCurrentWeek() {
  const current = getStartOfWeek(new Date());
  return isSameDate(currentWeekStart, current);
}
/* FORMATTING */
function formatDateRange(start, end) {
  const startText = start.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  const endText = end.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  return startText + " - " + endText;
}

function formatShortDate(dateString) {
  const date = parseInputDate(dateString);
  return date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

function formatTimeRange(start, end) {
  if (!start && !end) return "";
  if (start && end) return formatTime(start) + " - " + formatTime(end);
  if (start) return formatTime(start);
  return formatTime(end);
}

function formatTime(timeString) {
  if (!timeString) return "";
  const parts = timeString.split(":");
  let hour = Number(parts[0]);
  const minutes = parts[1];
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return hour + ":" + minutes + " " + suffix;
}
