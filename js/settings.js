/* =========================================================
   STUDY SPACE — SETTINGS JAVASCRIPT
   ========================================================= */

const SETTINGS_STORAGE_KEY = "studySpaceSettings";

const DEFAULT_SETTINGS = {
    darkMode: false,
    notifications: true,
    studyReminders: true,
    waterReminder: false,
    waterInterval: 60,
    buddyReminders: true,
    buddyMessages: true,
    sound: true,
    autoSave: true
};

let settings = { ...DEFAULT_SETTINGS };
let waterReminderTimer = null;
let saveStatusTimer = null;

/* =========================================================
   LOAD / SAVE
   ========================================================= */

function loadSettings() {
    try {
        const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            settings = { ...DEFAULT_SETTINGS, ...parsed };
        }
    } catch (error) {
        console.error("Could not load settings:", error);
        settings = { ...DEFAULT_SETTINGS };
    }
}

function saveSettings() {
    localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(settings)
    );
    showSaveStatus();
}

/* =========================================================
   DOM ELEMENTS
   ========================================================= */

function getSettingElements() {
    return {
        darkMode: document.getElementById("darkModeToggle"),
        notifications: document.getElementById("notificationsToggle"),
        studyReminders: document.getElementById("studyReminderToggle"),
        waterReminder: document.getElementById("waterReminderToggle"),
        waterInterval: document.getElementById("waterInterval"),
        buddyReminders: document.getElementById("buddyReminderToggle"),
        buddyMessages: document.getElementById("buddyMessageToggle"),
        sound: document.getElementById("soundToggle"),
        autoSave: document.getElementById("autoSaveToggle")
    };
}

/* =========================================================
   APPLY SETTINGS
   ========================================================= */

function applySettings() {
    const elements = getSettingElements();

    if (elements.darkMode) {
        elements.darkMode.checked = settings.darkMode;
    }

    if (elements.notifications) {
        elements.notifications.checked = settings.notifications;
    }

    if (elements.studyReminders) {
        elements.studyReminders.checked = settings.studyReminders;
    }

    if (elements.waterReminder) {
        elements.waterReminder.checked = settings.waterReminder;
    }

    if (elements.waterInterval) {
        elements.waterInterval.value = String(settings.waterInterval);
    }

    if (elements.buddyReminders) {
        elements.buddyReminders.checked = settings.buddyReminders;
    }

    if (elements.buddyMessages) {
        elements.buddyMessages.checked = settings.buddyMessages;
    }

    if (elements.sound) {
        elements.sound.checked = settings.sound;
    }

    if (elements.autoSave) {
        elements.autoSave.checked = settings.autoSave;
    }

    applyDarkMode();
    updateWaterReminderUI();
}

/* =========================================================
   DARK MODE
   ========================================================= */

function applyDarkMode() {
    const enabled = Boolean(settings.darkMode);

    document.body.classList.toggle("dark-mode", enabled);
    document.documentElement.classList.toggle("dark-mode", enabled);

    localStorage.setItem(
        "studySpaceDarkMode",
        enabled ? "true" : "false"
    );
}

/* =========================================================
   WATER REMINDER UI
   ========================================================= */

function updateWaterReminderUI() {
    const row = document.getElementById("waterIntervalRow");

    if (!row) return;

    row.style.opacity = settings.waterReminder ? "1" : "0.5";
    row.style.pointerEvents = settings.waterReminder
        ? "auto"
        : "none";
}

/* =========================================================
   WATER REMINDER
   ========================================================= */

function startWaterReminder() {
    stopWaterReminder();

    if (!settings.waterReminder) return;
    if (!settings.notifications) return;

    const interval = Number(settings.waterInterval);

    if (!interval || interval <= 0) return;

    waterReminderTimer = setInterval(
        showWaterReminder,
        interval * 60 * 1000
    );
}

function stopWaterReminder() {
    if (waterReminderTimer) {
        clearInterval(waterReminderTimer);
        waterReminderTimer = null;
    }
}

/* =========================================================
   SHOW WATER REMINDER
   ========================================================= */

function showWaterReminder() {
    if (!settings.waterReminder) return;
    if (!settings.notifications) return;

    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {
        new Notification("Study Space 💧", {
            body: "Time for a quick water break!"
        });
    }

    showWaterReminderMessage();
}

/* =========================================================
   WATER POPUP
   ========================================================= */

function showWaterReminderMessage() {
    const existing = document.getElementById(
        "waterReminderPopup"
    );

    if (existing) {
        existing.remove();
    }

    const popup = document.createElement("div");
    popup.id = "waterReminderPopup";

    popup.innerHTML = `
        <div class="water-reminder-content">
            <strong>Water break 💧</strong>
            <p>Take a moment to drink some water.</p>
            <button type="button" id="closeWaterReminder">
                Okay
            </button>
        </div>
    `;

    document.body.appendChild(popup);

    document
        .getElementById("closeWaterReminder")
        ?.addEventListener("click", () => {
            popup.remove();
        });
}

/* =========================================================
   NOTIFICATION PERMISSION
   ========================================================= */

async function requestNotificationPermission() {
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
        try {
            await Notification.requestPermission();
        } catch (error) {
            console.error(
                "Notification permission error:",
                error
            );
        }
    }
}

/* =========================================================
   SETTINGS EVENTS
   ========================================================= */

function setupSettingsEvents() {
    const elements = getSettingElements();

    /* DARK MODE */

    elements.darkMode?.addEventListener("change", () => {
        settings.darkMode = elements.darkMode.checked;

        applyDarkMode();
        saveSettings();
    });

    /* NOTIFICATIONS */

    elements.notifications?.addEventListener(
        "change",
        async () => {
            settings.notifications =
                elements.notifications.checked;

            if (settings.notifications) {
                await requestNotificationPermission();
            }

            startWaterReminder();
            saveSettings();
        }
    );

    /* STUDY REMINDERS */

    elements.studyReminders?.addEventListener(
        "change",
        () => {
            settings.studyReminders =
                elements.studyReminders.checked;

            saveSettings();
        }
    );

    /* WATER REMINDER */

    elements.waterReminder?.addEventListener(
        "change",
        async () => {
            settings.waterReminder =
                elements.waterReminder.checked;

            if (settings.waterReminder) {
                await requestNotificationPermission();
            }

            updateWaterReminderUI();
            startWaterReminder();
            saveSettings();
        }
    );

    /* WATER INTERVAL */

    elements.waterInterval?.addEventListener(
        "change",
        () => {
            settings.waterInterval =
                Number(elements.waterInterval.value);

            startWaterReminder();
            saveSettings();
        }
    );

    /* BUDDY REMINDERS */

    elements.buddyReminders?.addEventListener(
        "change",
        () => {
            settings.buddyReminders =
                elements.buddyReminders.checked;

            saveSettings();
        }
    );

    /* BUDDY MESSAGES */

    elements.buddyMessages?.addEventListener(
        "change",
        () => {
            settings.buddyMessages =
                elements.buddyMessages.checked;

            saveSettings();
        }
    );

    /* SOUND */

    elements.sound?.addEventListener(
        "change",
        () => {
            settings.sound =
                elements.sound.checked;

            saveSettings();
        }
    );

    /* AUTO SAVE */

    elements.autoSave?.addEventListener(
        "change",
        () => {
            settings.autoSave =
                elements.autoSave.checked;

            saveSettings();
        }
    );

    /* RESET */

    document
        .getElementById("resetSettingsButton")
        ?.addEventListener("click", resetSettings);
}

/* =========================================================
   RESET SETTINGS
   ========================================================= */

function resetSettings() {
    const confirmed = confirm(
        "Reset all Study Space settings?"
    );

    if (!confirmed) return;

    settings = { ...DEFAULT_SETTINGS };

    saveSettings();
    applySettings();
    startWaterReminder();
}

/* =========================================================
   SAVE STATUS
   ========================================================= */

function showSaveStatus() {
    const status = document.getElementById(
        "settingsSaveStatus"
    );

    if (!status) return;

    status.classList.add("visible");

    clearTimeout(saveStatusTimer);

    saveStatusTimer = setTimeout(() => {
        status.classList.remove("visible");
    }, 1200);
}

/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    applySettings();
    setupSettingsEvents();
    startWaterReminder();
});