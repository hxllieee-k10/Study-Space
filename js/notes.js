/* =========================================================
   STUDY SPACE — NOTES SYSTEM
   ========================================================= */

"use strict";


/* =========================================================
   STORAGE
   ========================================================= */

const NOTES_STORAGE = "studySpace_notes_v1";
const FOLDERS_STORAGE = "studySpace_folders_v1";
const WHITEBOARDS_STORAGE = "studySpace_whiteboards_v1";


let notes = JSON.parse(localStorage.getItem(NOTES_STORAGE)) || [];
let folders = JSON.parse(localStorage.getItem(FOLDERS_STORAGE)) || [];
let whiteboards = JSON.parse(localStorage.getItem(WHITEBOARDS_STORAGE)) || [];


let currentFolderId = "root";
let currentNoteId = null;
let selectedTemplate = "blank";
let currentTemplateCategory = "all";

let noteHistory = [];
let noteHistoryIndex = -1;


/* =========================================================
   DEFAULT FOLDERS
   ========================================================= */

function createDefaultFolders() {

    if (folders.length > 0) return;

    const defaultSubjects = [
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Sejarah",
        "Moral",
        "Unsorted"
    ];

    folders = defaultSubjects.map((name, index) => ({
        id: "folder_" + Date.now() + "_" + index,
        name,
        parentId: "root",
        createdAt: Date.now()
    }));

    saveFolders();
}


/* =========================================================
   SAVE
   ========================================================= */

function saveNotes() {
    localStorage.setItem(NOTES_STORAGE, JSON.stringify(notes));
}

function saveFolders() {
    localStorage.setItem(FOLDERS_STORAGE, JSON.stringify(folders));
}

function saveWhiteboards() {
    localStorage.setItem(
        WHITEBOARDS_STORAGE,
        JSON.stringify(whiteboards)
    );
}


/* =========================================================
   HELPERS
   ========================================================= */

function uid(prefix) {

    return (
        prefix +
        "_" +
        Date.now() +
        "_" +
        Math.random().toString(36).slice(2, 8)
    );

}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function formatDate(timestamp) {

    if (!timestamp) return "";

    const date = new Date(timestamp);

    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

}


function getFolder(folderId) {

    return folders.find(folder => folder.id === folderId);

}


function getFolderPath(folderId) {

    const path = [];

    let current = getFolder(folderId);

    while (current) {

        path.unshift(current);

        current = getFolder(current.parentId);

    }

    return path;

}


function getChildFolders(parentId) {

    return folders.filter(
        folder => folder.parentId === parentId
    );

}


function getNotesInFolder(folderId) {

    return notes.filter(
        note => note.folderId === folderId
    );

}


/* =========================================================
   TEMPLATE DATA
   ========================================================= */

const templates = [

    {
        id: "blank",
        name: "Blank Note",
        category: "study",
        description: "Start completely from scratch."
    },

    {
        id: "class",
        name: "Class Notes",
        category: "study",
        description: "Organised notes for lessons."
    },

    {
        id: "revision",
        name: "Revision Sheet",
        category: "study",
        description: "Condense a topic for revision."
    },

    {
        id: "cornell",
        name: "Cornell Notes",
        category: "study",
        description: "Classic Cornell note layout."
    },

    {
        id: "chapter",
        name: "Chapter Summary",
        category: "study",
        description: "Summarise an entire chapter."
    },

    {
        id: "quick",
        name: "Quick Notes",
        category: "study",
        description: "Fast notes without the clutter."
    },

    {
        id: "guide",
        name: "Study Guide",
        category: "study",
        description: "Build a complete study guide."
    },

    {
        id: "concept",
        name: "Concept Map",
        category: "study",
        description: "Connect ideas together."
    },

    {
        id: "science",
        name: "Science Notes",
        category: "science",
        description: "Definitions, concepts and examples."
    },

    {
        id: "experiment",
        name: "Experiment / Practical",
        category: "science",
        description: "Includes procedure and drawing space."
    },

    {
        id: "formula",
        name: "Formula Sheet",
        category: "science",
        description: "Formula, variables, units and examples."
    },

    {
        id: "process",
        name: "Process / Cycle",
        category: "science",
        description: "Break down a process step by step."
    },

    {
        id: "compare",
        name: "Compare & Contrast",
        category: "science",
        description: "Compare two concepts."
    },

    {
        id: "diagram",
        name: "Diagram Notes",
        category: "science",
        description: "Large diagram and label area."
    },

    {
        id: "mathformula",
        name: "Maths Formula Bank",
        category: "maths",
        description: "Keep your important formulas together."
    },

    {
        id: "worked",
        name: "Worked Example",
        category: "maths",
        description: "Question → working → answer."
    },

    {
        id: "mistake",
        name: "Mistake Log",
        category: "maths",
        description: "Track mistakes and correct methods."
    },

    {
        id: "breakdown",
        name: "Question Breakdown",
        category: "maths",
        description: "Analyse what a question is asking."
    },

    {
        id: "essay",
        name: "SPM Essay Planner",
        category: "exam",
        description: "Plan your essay before writing."
    },

    {
        id: "analysis",
        name: "Question Analysis",
        category: "exam",
        description: "Break down an exam question."
    },

    {
        id: "flashcards",
        name: "Flashcards",
        category: "memory",
        description: "Question and answer cards."
    },

    {
        id: "active",
        name: "Active Recall",
        category: "memory",
        description: "Test what you remember."
    },

    {
        id: "feynman",
        name: "Feynman Technique",
        category: "memory",
        description: "Explain a concept simply."
    },

    {
        id: "forget",
        name: "Things I Keep Forgetting",
        category: "memory",
        description: "Keep track of recurring mistakes."
    },

    {
        id: "weekly",
        name: "Weekly Study",
        category: "planning",
        description: "Plan your study week."
    },

    {
        id: "checklist",
        name: "Chapter Checklist",
        category: "planning",
        description: "Track chapter completion."
    },

    {
        id: "countdown",
        name: "Exam Countdown",
        category: "planning",
        description: "Prepare for an upcoming exam."
    },

    {
        id: "brain",
        name: "Brain Dump",
        category: "creative",
        description: "Get everything out of your head."
    },

    {
        id: "mindmap",
        name: "Mind Map",
        category: "creative",
        description: "Connect ideas visually."
    },

    {
        id: "reading",
        name: "Reading Notes",
        category: "creative",
        description: "Notes for books and articles."
    },

    {
        id: "research",
        name: "Research Notes",
        category: "creative",
        description: "Collect information from sources."
    }

];


/* =========================================================
   TEMPLATE PREVIEW
   ========================================================= */

function templatePreview(templateId) {

    let content = `
        <div class="template-preview-paper">
            <div class="template-preview-title">
                ${escapeHTML(
                    templates.find(t => t.id === templateId)?.name ||
                    "NOTE"
                )}
            </div>

            <div class="preview-line"></div>
            <div class="preview-line medium"></div>
            <div class="preview-line short"></div>
            <div class="preview-box"></div>
            <div class="preview-line medium"></div>
            <div class="preview-line"></div>
        </div>
    `;


    if (templateId === "cornell") {

        content = `
            <div class="template-preview-paper">
                <div class="template-preview-title">
                    CORNELL NOTES
                </div>

                <div class="preview-columns">

                    <div>
                        <div class="preview-box"></div>
                    </div>

                    <div>
                        <div class="preview-line"></div>
                        <div class="preview-line"></div>
                        <div class="preview-line short"></div>
                    </div>

                </div>

                <div class="preview-box"></div>
            </div>
        `;

    }


    if (templateId === "experiment") {

        content = `
            <div class="template-preview-paper">

                <div class="template-preview-title">
                    EXPERIMENT
                </div>

                <div class="preview-line"></div>

                <div class="preview-box"></div>

                <div class="preview-columns">

                    <div>
                        <div class="preview-line"></div>
                        <div class="preview-line short"></div>
                    </div>

                    <div>
                        <div class="preview-line"></div>
                        <div class="preview-line short"></div>
                    </div>

                </div>

                <div class="preview-box"></div>

            </div>
        `;

    }


    if (
        templateId === "concept" ||
        templateId === "mindmap"
    ) {

        content = `
            <div class="template-preview-paper">

                <div class="template-preview-title">
                    CONCEPT MAP
                </div>

                <div style="
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    height:75px;
                    gap:8px;
                ">

                    <div style="
                        border:1px solid #cbbca9;
                        padding:7px;
                        border-radius:4px;
                        font-size:7px;
                    ">
                        IDEA
                    </div>

                    <div style="font-size:10px;">
                        →
                    </div>

                    <div style="
                        border:1px solid #cbbca9;
                        padding:7px;
                        border-radius:4px;
                        font-size:7px;
                    ">
                        TOPIC
                    </div>

                </div>

            </div>
        `;

    }


    return content;

}


/* =========================================================
   RENDER FEATURED TEMPLATES
   ========================================================= */

function renderFeaturedTemplates() {

    const container =
        document.getElementById("featuredTemplates");

    if (!container) return;


    const featuredIds = [
        "blank",
        "class",
        "revision",
        "cornell"
    ];


    container.innerHTML = featuredIds
        .map(id => {

            const template =
                templates.find(item => item.id === id);

            return `
                <div
                    class="template-card"
                    data-template-id="${template.id}"
                >

                    <div class="template-preview">
                        ${templatePreview(template.id)}
                    </div>

                    <div class="template-info">

                        <h3>
                            ${escapeHTML(template.name)}
                        </h3>

                        <p>
                            ${escapeHTML(template.description)}
                        </p>

                    </div>

                </div>
            `;

        })
        .join("");


    container
        .querySelectorAll(".template-card")
        .forEach(card => {

            card.addEventListener("click", () => {

                openNewNoteModal(
                    card.dataset.templateId
                );

            });

        });

}


/* =========================================================
   RENDER ALL TEMPLATES
   ========================================================= */

function renderAllTemplates() {

    const container =
        document.getElementById("allTemplatesGrid");

    if (!container) return;


    const search =
        document
            .getElementById("templateSearch")
            ?.value
            .toLowerCase()
            .trim() || "";


    let filtered = templates.filter(template => {

        const matchesCategory =
            currentTemplateCategory === "all" ||
            template.category === currentTemplateCategory;

        const matchesSearch =
            !search ||
            template.name.toLowerCase().includes(search) ||
            template.description.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;

    });


    container.innerHTML = filtered
        .map(template => {

            return `
                <div
                    class="template-card"
                    data-template-id="${template.id}"
                >

                    <div class="template-preview">
                        ${templatePreview(template.id)}
                    </div>

                    <div class="template-info">

                        <h3>
                            ${escapeHTML(template.name)}
                        </h3>

                        <p>
                            ${escapeHTML(template.description)}
                        </p>

                    </div>

                </div>
            `;

        })
        .join("");


    container
        .querySelectorAll(".template-card")
        .forEach(card => {

            card.addEventListener("click", () => {

                closeModal("templateModal");

                openNewNoteModal(
                    card.dataset.templateId
                );

            });

        });

}


/* =========================================================
   FOLDERS
   ========================================================= */

function renderFolders() {

    const grid =
        document.getElementById("folderGrid");

    if (!grid) return;


    const children =
        getChildFolders(currentFolderId);


    if (children.length === 0) {

        grid.innerHTML = `
            <div style="
                color: var(--notes-muted);
                font-size: 13px;
                padding: 10px 0;
            ">
                No folders here yet.
            </div>
        `;

        return;

    }


    grid.innerHTML = children
        .map(folder => {

            const count =
                notes.filter(
                    note => note.folderId === folder.id
                ).length;


            return `
                <div
                    class="folder-card"
                    data-folder-id="${folder.id}"
                >

                    <button
                        class="folder-menu"
                        data-folder-menu="${folder.id}"
                    >
                        ⋯
                    </button>

                    <div class="folder-icon">
                        📁
                    </div>

                    <h3>
                        ${escapeHTML(folder.name)}
                    </h3>

                    <p>
                        ${count} note${count === 1 ? "" : "s"}
                    </p>

                </div>
            `;

        })
        .join("");


    grid
        .querySelectorAll(".folder-card")
        .forEach(card => {

            card.addEventListener("click", event => {

                if (
                    event.target.closest(".folder-menu")
                ) {
                    return;
                }

                currentFolderId =
                    card.dataset.folderId;

                renderAll();

            });

        });


    grid
        .querySelectorAll(".folder-menu")
        .forEach(button => {

            button.addEventListener("click", event => {

                event.stopPropagation();

                showFolderMenu(
                    button.dataset.folderMenu
                );

            });

        });

}


/* =========================================================
   FOLDER BREADCRUMBS
   ========================================================= */

function renderBreadcrumbs() {

    const container =
        document.getElementById("folderBreadcrumbs");

    if (!container) return;


    const path =
        currentFolderId === "root"
            ? []
            : getFolderPath(currentFolderId);


    let html = `
        <button data-folder-id="root">
            All Notes
        </button>
    `;


    path.forEach((folder, index) => {

        html += `
            <span class="crumb-separator">
                /
            </span>

            <button data-folder-id="${folder.id}">
                ${escapeHTML(folder.name)}
            </button>
        `;

    });


    container.innerHTML = html;


    container
        .querySelectorAll("button")
        .forEach(button => {

            button.addEventListener("click", () => {

                currentFolderId =
                    button.dataset.folderId;

                renderAll();

            });

        });

}


/* =========================================================
   FOLDER SELECTS
   ========================================================= */

function renderFolderSelects() {

    const selects = [
        document.getElementById("folderParent"),
        document.getElementById("newNoteFolder")
    ];


    selects.forEach(select => {

        if (!select) return;


        const options = [];


        function addFolders(parentId, depth) {

            folders
                .filter(folder =>
                    folder.parentId === parentId
                )
                .forEach(folder => {

                    options.push({
                        folder,
                        depth
                    });

                    addFolders(folder.id, depth + 1);

                });

        }


        addFolders("root", 0);


        select.innerHTML = options
            .map(({ folder, depth }) => {

                return `
                    <option value="${folder.id}">
                        ${"&nbsp;".repeat(depth * 4)}
                        ${escapeHTML(folder.name)}
                    </option>
                `;

            })
            .join("");


        if (
            select.id === "newNoteFolder" &&
            currentFolderId !== "root"
        ) {

            select.value = currentFolderId;

        }

    });

}


/* =========================================================
   FOLDER CREATION
   ========================================================= */

function openFolderModal() {

    renderFolderSelects();

    document
        .getElementById("folderName")
        .value = "";

    openModal("folderModal");

    setTimeout(() => {

        document
            .getElementById("folderName")
            ?.focus();

    }, 100);

}


function createFolder(name, parentId) {

    const folder = {

        id: uid("folder"),

        name: name.trim(),

        parentId:
            parentId || "root",

        createdAt: Date.now()

    };


    folders.push(folder);

    saveFolders();

    renderAll();

}


function showFolderMenu(folderId) {

    const folder =
        getFolder(folderId);

    if (!folder) return;


    const action =
        prompt(
            `Folder: ${folder.name}\n\nType one:\nrename\nmove\n delete`
        );


    if (!action) return;


    const normalized =
        action.trim().toLowerCase();


    if (normalized === "rename") {

        const newName =
            prompt(
                "New folder name:",
                folder.name
            );

        if (!newName?.trim()) return;

        folder.name =
            newName.trim();

        saveFolders();

        renderAll();

    }


    else if (normalized === "delete") {

        if (
            !confirm(
                `Delete "${folder.name}"?\n\nNotes inside it will be moved to Unsorted.`
            )
        ) {
            return;
        }


        const unsorted =
            folders.find(
                item =>
                    item.name === "Unsorted" &&
                    item.parentId === "root"
            );


        notes.forEach(note => {

            if (note.folderId === folderId) {

                note.folderId =
                    unsorted?.id || "root";

            }

        });


        folders =
            folders.filter(
                item => item.id !== folderId
            );


        saveFolders();
        saveNotes();

        currentFolderId = "root";

        renderAll();

    }


    else if (normalized === "move") {

        const target =
            prompt(
                "Enter the exact folder name to move this folder into:"
            );

        if (!target) return;


        const targetFolder =
            folders.find(
                item =>
                    item.name.toLowerCase() ===
                    target.toLowerCase()
            );


        if (!targetFolder) {

            alert("Folder not found.");

            return;

        }


        if (targetFolder.id === folder.id) {

            alert("A folder cannot be moved inside itself.");

            return;

        }


        folder.parentId =
            targetFolder.id;

        saveFolders();

        renderAll();

    }

}


/* =========================================================
   NOTES
   ========================================================= */

function renderNotes() {

    const grid =
        document.getElementById("recentNotesGrid");

    const empty =
        document.getElementById("emptyNotesState");


    if (!grid) return;


    const search =
        document
            .getElementById("notesSearch")
            ?.value
            .toLowerCase()
            .trim() || "";


    let visibleNotes;


    if (currentFolderId === "root") {

        visibleNotes =
            notes.slice();

    } else {

        visibleNotes =
            notes.filter(
                note =>
                    note.folderId === currentFolderId
            );

    }


    if (search) {

        visibleNotes =
            notes.filter(note => {

                const folder =
                    getFolder(note.folderId);

                const text =
                    (
                        note.title +
                        " " +
                        note.content +
                        " " +
                        (folder?.name || "")
                    ).toLowerCase();

                return text.includes(search);

            });

    }


    visibleNotes.sort(
        (a, b) =>
            (b.updatedAt || 0) -
            (a.updatedAt || 0)
    );


    if (visibleNotes.length === 0) {

        grid.innerHTML = "";

        empty?.classList.remove("hidden");

        return;

    }


    empty?.classList.add("hidden");


    grid.innerHTML =
        visibleNotes
            .slice(0, 12)
            .map(note => renderNoteCard(note))
            .join("");


    grid
        .querySelectorAll(".note-card")
        .forEach(card => {

            card.addEventListener("click", event => {

                if (
                    event.target.closest(".note-menu")
                ) {
                    return;
                }

                openNote(
                    card.dataset.noteId
                );

            });

        });


    grid
        .querySelectorAll(".note-menu")
        .forEach(button => {

            button.addEventListener("click", event => {

                event.stopPropagation();

                showNoteMenu(
                    button.dataset.noteId
                );

            });

        });

}


function renderNoteCard(note) {

    const folder =
        getFolder(note.folderId);


    const previewText =
        stripHTML(note.content)
            .slice(0, 240);


    return `
        <div
            class="note-card"
            data-note-id="${note.id}"
        >

            <button
                class="note-menu"
                data-note-id="${note.id}"
            >
                ⋯
            </button>


            <div class="note-preview">

                <div class="note-preview-paper">

                    <h4>
                        ${escapeHTML(note.title)}
                    </h4>

                    <p>
                        ${escapeHTML(
                            previewText ||
                            "Start writing your note..."
                        )}
                    </p>

                </div>

            </div>


            <div class="note-info">

                <h3>
                    ${escapeHTML(note.title)}
                </h3>

                <div class="note-meta">

                    <span>
                        ${escapeHTML(
                            folder?.name ||
                            "Unsorted"
                        )}
                    </span>

                    <span>
                        ${formatRelativeTime(
                            note.updatedAt
                        )}
                    </span>

                </div>

            </div>

        </div>
    `;

}


function stripHTML(html) {

    const temp =
        document.createElement("div");

    temp.innerHTML =
        html || "";

    return temp.textContent || "";

}


function formatRelativeTime(timestamp) {

    if (!timestamp) return "";

    const diff =
        Date.now() - timestamp;

    const minute =
        60 * 1000;

    const hour =
        minute * 60;

    const day =
        hour * 24;


    if (diff < minute) {

        return "Just now";

    }

    if (diff < hour) {

        return Math.floor(
            diff / minute
        ) + "m ago";

    }

    if (diff < day) {

        return Math.floor(
            diff / hour
        ) + "h ago";

    }

    if (diff < day * 7) {

        return Math.floor(
            diff / day
        ) + "d ago";

    }

    return formatDate(timestamp);

}


/* =========================================================
   NOTE MENU
   ========================================================= */

function showNoteMenu(noteId) {

    const note =
        notes.find(
            item => item.id === noteId
        );

    if (!note) return;


    const action =
        prompt(
            `Note: ${note.title}\n\nType one:\nrename\nmove\ndelete`
        );


    if (!action) return;


    const normalized =
        action.trim().toLowerCase();


    if (normalized === "rename") {

        const title =
            prompt(
                "New title:",
                note.title
            );


        if (!title?.trim()) return;


        note.title =
            title.trim();

        note.updatedAt =
            Date.now();

        saveNotes();

        renderNotes();

    }


    else if (normalized === "delete") {

        if (
            !confirm(
                `Delete "${note.title}"?`
            )
        ) {
            return;
        }


        notes =
            notes.filter(
                item => item.id !== noteId
            );


        saveNotes();

        renderNotes();

    }


    else if (normalized === "move") {

        const folderName =
            prompt(
                "Move to folder:"
            );


        if (!folderName) return;


        const target =
            folders.find(
                folder =>
                    folder.name.toLowerCase() ===
                    folderName.toLowerCase()
            );


        if (!target) {

            alert("Folder not found.");

            return;

        }


        note.folderId =
            target.id;

        note.updatedAt =
            Date.now();

        saveNotes();

        renderNotes();

    }

}


/* =========================================================
   NEW NOTE MODAL
   ========================================================= */

function openNewNoteModal(templateId = "blank") {

    selectedTemplate =
        templateId || "blank";


    document
        .getElementById("newNoteTitle")
        .value = "";


    renderFolderSelects();

    renderMiniTemplates();

    openModal("newNoteModal");


    setTimeout(() => {

        document
            .getElementById("newNoteTitle")
            ?.focus();

    }, 100);

}


function renderMiniTemplates() {

    const container =
        document.getElementById(
            "newNoteTemplates"
        );


    if (!container) return;


    const selected =
        selectedTemplate;


    const choices = [
        "blank",
        "class",
        "revision",
        "cornell",
        "experiment",
        "worked",
        "mistake",
        "mindmap"
    ];


    container.innerHTML =
        choices.map(id => {

            const template =
                templates.find(
                    item => item.id === id
                );


            return `
                <button
                    type="button"
                    class="mini-template ${
                        selected === id
                            ? "selected"
                            : ""
                    }"
                    data-mini-template="${id}"
                >

                    <strong>
                        ${escapeHTML(template.name)}
                    </strong>

                    <span>
                        ${escapeHTML(template.description)}
                    </span>

                </button>
            `;

        }).join("");


    container
        .querySelectorAll(".mini-template")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    selectedTemplate =
                        button.dataset.miniTemplate;

                    renderMiniTemplates();

                }
            );

        });

}


/* =========================================================
   CREATE NOTE
   ========================================================= */

function createNote(title, folderId, templateId) {

    const template =
        templates.find(
            item => item.id === templateId
        );


    const note = {

        id: uid("note"),

        title:
            title.trim() ||
            template?.name ||
            "Untitled Note",

        folderId:
            folderId ||
            currentFolderId !== "root"
                ? folderId || currentFolderId
                : getDefaultFolderId(),

        template:
            templateId,

        content:
            createTemplateContent(
                templateId
            ),

        createdAt:
            Date.now(),

        updatedAt:
            Date.now()

    };


    notes.unshift(note);

    saveNotes();

    closeModal("newNoteModal");

    renderAll();

    openNote(note.id);

}


/* =========================================================
   DEFAULT FOLDER
   ========================================================= */

function getDefaultFolderId() {

    const unsorted =
        folders.find(
            folder =>
                folder.name === "Unsorted" &&
                folder.parentId === "root"
        );


    return unsorted?.id || "root";

}


/* =========================================================
   TEMPLATE CONTENT
   ========================================================= */

function createTemplateContent(templateId) {

    switch (templateId) {

        case "blank":

            return `
                <div
                    class="note-block heading"
                    contenteditable="true"
                >
                    Start writing
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                >
                    Click here and begin your note...
                </div>
            `;


        case "class":

            return `
                <div
                    class="note-block heading"
                    contenteditable="true"
                >
                    Class Notes
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                >
                    Topic:
                </div>

                <hr class="note-divider">

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Key Concepts
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                >
                    Write your lesson notes here...
                </div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Examples
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                >
                    Add examples here...
                </div>
            `;


        case "revision":

            return `
                <div
                    class="note-block heading"
                    contenteditable="true"
                >
                    Revision Sheet
                </div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Topic
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                >
                    __________________________
                </div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Key Facts
                </div>

                <div
                    class="note-block bullet"
                    contenteditable="true"
                >
                    •
                </div>

                <div
                    class="note-block bullet"
                    contenteditable="true"
                >
                    •
                </div>

                <div
                    class="note-block bullet"
                    contenteditable="true"
                >
                    •
                </div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Remember
                </div>

                <div class="note-quote">
                    Add your most important reminder here.
                </div>
            `;


        case "cornell":

            return `
                <div
                    class="note-block heading"
                    contenteditable="true"
                >
                    Cornell Notes
                </div>

                <div
                    style="
                        display:grid;
                        grid-template-columns:180px 1fr;
                        border:1px solid #ddd2c5;
                        min-height:500px;
                    "
                >

                    <div
                        contenteditable="true"
                        style="
                            border-right:1px solid #ddd2c5;
                            padding:20px;
                            font-size:14px;
                        "
                    >
                        Cues / Questions
                    </div>

                    <div
                        contenteditable="true"
                        style="
                            padding:20px;
                            line-height:1.8;
                        "
                    >
                        Notes
                    </div>

                </div>

                <div
                    contenteditable="true"
                    style="
                        border:1px solid #ddd2c5;
                        border-top:none;
                        min-height:130px;
                        padding:20px;
                    "
                >
                    Summary
                </div>
            `;


        case "experiment":

            return `
                <div class="practical-page">

                    <div
                        class="practical-title"
                        contenteditable="true"
                    >
                        Experiment / Practical
                    </div>

                    <div
                        class="practical-subtitle"
                        contenteditable="true"
                    >
                        Subject / Chapter:
                    </div>


                    <div class="practical-section">

                        <h3>Aim</h3>

                        <div
                            class="practical-box"
                            contenteditable="true"
                        ></div>

                    </div>


                    <div class="practical-section">

                        <h3>Hypothesis</h3>

                        <div
                            class="practical-box"
                            contenteditable="true"
                        ></div>

                    </div>


                    <div class="practical-section">

                        <h3>Variables</h3>

                        <div class="practical-two-column">

                            <div
                                class="practical-box"
                                contenteditable="true"
                            >
                                <strong>Manipulated:</strong>
                            </div>

                            <div
                                class="practical-box"
                                contenteditable="true"
                            >
                                <strong>Responding:</strong>
                            </div>

                        </div>

                        <br>

                        <div
                            class="practical-box"
                            contenteditable="true"
                        >
                            <strong>Constant:</strong>
                        </div>

                    </div>


                    <div class="practical-section">

                        <h3>Apparatus</h3>

                        <div
                            class="practical-box"
                            contenteditable="true"
                        ></div>

                    </div>


                    <!-- IMPORTANT:
                         LARGE PROCEDURE AREA
                    -->

                    <div class="practical-section">

                        <h3>Procedure</h3>

                        <div
                            class="practical-box procedure-box"
                            contenteditable="true"
                        >
                            <div>
                                1.
                            </div>

                            <div>
                                2.
                            </div>

                            <div>
                                3.
                            </div>

                        </div>

                    </div>


                    <!-- IMPORTANT:
                         DEDICATED DRAWING AREA
                    -->

                    <div class="practical-section">

                        <h3>Diagram</h3>

                        <div
                            class="practical-box diagram-box"
                            contenteditable="true"
                        >

                            <span class="diagram-label">
                                Draw your experiment setup here
                            </span>

                        </div>

                    </div>


                    <div class="practical-section">

                        <h3>Results</h3>

                        <div
                            class="practical-box"
                            contenteditable="true"
                            style="min-height:180px;"
                        ></div>

                    </div>


                    <div class="practical-section">

                        <h3>Conclusion</h3>

                        <div
                            class="practical-box"
                            contenteditable="true"
                            style="min-height:120px;"
                        ></div>

                    </div>

                </div>
            `;


        case "formula":
        case "mathformula":

            return `
                <div
                    class="note-block heading"
                    contenteditable="true"
                >
                    Formula Bank
                </div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Topic
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                >
                    Formula:
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                >
                    Variables:
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                >
                    Units:
                </div>

                <hr class="note-divider">

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Example
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                >
                    Work through an example here...
                </div>
            `;


        case "worked":

            return `
                <div
                    class="note-block heading"
                    contenteditable="true"
                >
                    Worked Example
                </div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Question
                </div>

                <div
                    class="practical-box"
                    contenteditable="true"
                ></div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Step 1
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                ></div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Step 2
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                ></div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Final Answer
                </div>

                <div class="note-quote">
                    Answer:
                </div>
            `;


        case "mistake":

            return `
                <div
                    class="note-block heading"
                    contenteditable="true"
                >
                    Mistake Log
                </div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Topic
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                ></div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Question
                </div>

                <div
                    class="practical-box"
                    contenteditable="true"
                ></div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    What Went Wrong?
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                ></div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Correct Method
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                ></div>

                <div class="note-quote">
                    Remember:
                </div>
            `;


        case "active":

            return `
                <div
                    class="note-block heading"
                    contenteditable="true"
                >
                    Active Recall
                </div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Topic
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                ></div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Without Looking...
                </div>

                <div
                    class="practical-box"
                    contenteditable="true"
                    style="min-height:350px;"
                ></div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    What Did I Miss?
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                ></div>
            `;


        case "feynman":

            return `
                <div
                    class="note-block heading"
                    contenteditable="true"
                >
                    Feynman Technique
                </div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    1. Choose a Concept
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                ></div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    2. Explain It Simply
                </div>

                <div
                    class="practical-box"
                    contenteditable="true"
                    style="min-height:260px;"
                ></div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    3. Where Did I Get Stuck?
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                ></div>
            `;


        case "essay":

            return `
                <div
                    class="note-block heading"
                    contenteditable="true"
                >
                    SPM Essay Planner
                </div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Question
                </div>

                <div
                    class="practical-box"
                    contenteditable="true"
                ></div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Introduction
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                ></div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Point 1
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                >
                    Fact → Explanation → Example
                </div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Point 2
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                >
                    Fact → Explanation → Example
                </div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Conclusion
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                ></div>
            `;


        case "flashcards":

            return `
                <div
                    class="note-block heading"
                    contenteditable="true"
                >
                    Flashcards
                </div>

                <div
                    style="
                        display:grid;
                        grid-template-columns:1fr 1fr;
                        gap:15px;
                    "
                >

                    ${Array.from(
                        { length: 6 },
                        (_, index) => `
                            <div
                                style="
                                    border:1px solid #ddd2c5;
                                    border-radius:10px;
                                    padding:25px;
                                    min-height:120px;
                                "
                                contenteditable="true"
                            >
                                Card ${index + 1}
                            </div>
                        `
                    ).join("")}

                </div>
            `;


        case "weekly":

            return `
                <div
                    class="note-block heading"
                    contenteditable="true"
                >
                    Weekly Study
                </div>

                ${[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                ].map(day => `
                    <div
                        class="note-block text"
                        contenteditable="true"
                    >
                        <strong>${day}</strong>
                        — 
                    </div>
                `).join("")}

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Weekly Goal
                </div>
            `;


        case "checklist":

            return `
                <div
                    class="note-block heading"
                    contenteditable="true"
                >
                    Chapter Checklist
                </div>

                ${[
                    "Read chapter",
                    "Make notes",
                    "Memorise definitions",
                    "Practise questions",
                    "Check mistakes",
                    "Active recall",
                    "Past paper"
                ].map(item => `
                    <div
                        class="note-block checklist"
                        contenteditable="true"
                    >
                        □ ${item}
                    </div>
                `).join("")}
            `;


        case "brain":

            return `
                <div
                    class="note-block heading"
                    contenteditable="true"
                >
                    Brain Dump
                </div>

                <div
                    class="practical-box"
                    contenteditable="true"
                    style="min-height:700px;"
                >
                    Put everything here...
                </div>
            `;


        case "mindmap":

            return `
                <div
                    class="note-block heading"
                    contenteditable="true"
                >
                    Mind Map
                </div>

                <div
                    class="practical-box"
                    style="
                        min-height:600px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                    "
                >

                    <div
                        style="
                            border:2px solid #6f4e37;
                            border-radius:50%;
                            width:130px;
                            height:130px;
                            display:grid;
                            place-items:center;
                        "
                        contenteditable="true"
                    >
                        MAIN TOPIC
                    </div>

                </div>
            `;


        case "reading":

            return `
                <div
                    class="note-block heading"
                    contenteditable="true"
                >
                    Reading Notes
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                >
                    Book / Article:
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                >
                    Author:
                </div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    Key Ideas
                </div>

                <div
                    class="practical-box"
                    contenteditable="true"
                ></div>

                <div
                    class="note-block subheading"
                    contenteditable="true"
                >
                    My Thoughts
                </div>

                <div
                    class="practical-box"
                    contenteditable="true"
                ></div>
            `;


        default:

            return `
                <div
                    class="note-block heading"
                    contenteditable="true"
                >
                    ${escapeHTML(
                        templates.find(
                            t => t.id === templateId
                        )?.name || "New Note"
                    )}
                </div>

                <div
                    class="note-block text"
                    contenteditable="true"
                >
                    Start writing...
                </div>
            `;

    }

}


/* =========================================================
   OPEN NOTE
   ========================================================= */

function openNote(noteId) {

    const note =
        notes.find(
            item => item.id === noteId
        );


    if (!note) return;


    currentNoteId =
        noteId;


    document
        .getElementById("editorTitle")
        .value =
        note.title;


    document
        .getElementById("noteCanvas")
        .innerHTML =
        note.content;


    document
        .getElementById("editorScreen")
        .classList.remove("hidden");


    document.body.classList.add(
        "notes-editor-open"
    );


    noteHistory = [
        note.content
    ];

    noteHistoryIndex = 0;


    setupEditorEvents();

}


/* =========================================================
   EDITOR EVENTS
   ========================================================= */

let editorEventsBound = false;


function setupEditorEvents() {

    const canvas =
        document.getElementById("noteCanvas");


    if (!canvas) return;


    canvas
        .querySelectorAll("[contenteditable='true']")
        .forEach(element => {

            element.addEventListener(
                "input",
                handleEditorInput
            );

        });


    if (!editorEventsBound) {

        document
            .getElementById("editorTitle")
            ?.addEventListener(
                "input",
                saveCurrentNote
            );


        document
            .getElementById("fullscreenEditorBtn")
            ?.addEventListener(
                "click",
                toggleEditorFullscreen
            );


        document
            .getElementById("closeEditor")
            ?.addEventListener(
                "click",
                closeEditor
            );


        document
            .getElementById("doneEditingBtn")
            ?.addEventListener(
                "click",
                closeEditor
            );


        document
            .getElementById("undoBtn")
            ?.addEventListener(
                "click",
                undoNote
            );


        document
            .getElementById("redoBtn")
            ?.addEventListener(
                "click",
                redoNote
            );


        document
            .querySelectorAll(
                "[data-editor-tool]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        insertEditorTool(
                            button.dataset.editorTool
                        );

                    }
                );

            });


        editorEventsBound = true;

    }

}


function handleEditorInput() {

    const canvas =
        document.getElementById("noteCanvas");


    if (!canvas) return;


    saveCurrentNote();


    const latest =
        canvas.innerHTML;


    if (
        noteHistory[noteHistoryIndex] !==
        latest
    ) {

        noteHistory =
            noteHistory.slice(
                0,
                noteHistoryIndex + 1
            );

        noteHistory.push(latest);

        noteHistoryIndex++;

    }

}


/* =========================================================
   SAVE CURRENT NOTE
   ========================================================= */

let saveTimer = null;


function saveCurrentNote() {

    if (!currentNoteId) return;


    const note =
        notes.find(
            item => item.id === currentNoteId
        );


    if (!note) return;


    note.title =
        document
            .getElementById("editorTitle")
            .value
            .trim() ||
        "Untitled Note";


    note.content =
        document
            .getElementById("noteCanvas")
            .innerHTML;


    note.updatedAt =
        Date.now();


    document
        .getElementById("saveStatus")
        .textContent =
        "Saving...";


    clearTimeout(saveTimer);


    saveTimer =
        setTimeout(() => {

            saveNotes();

            document
                .getElementById("saveStatus")
                .textContent =
                "Saved";

        }, 350);

}


/* =========================================================
   CLOSE EDITOR
   ========================================================= */

function closeEditor() {

    saveCurrentNote();

    currentNoteId = null;

    document
        .getElementById("editorScreen")
        .classList.add("hidden");

    document.body.classList.remove(
        "notes-editor-open"
    );

    renderAll();

}


/* =========================================================
   EDITOR TOOLS
   ========================================================= */

function insertEditorTool(tool) {

    const canvas =
        document.getElementById("noteCanvas");


    if (!canvas) return;


    let html = "";


    switch (tool) {

        case "heading":

            html = `
                <div
                    class="note-block heading"
                    contenteditable="true"
                >
                    Heading
                </div>
            `;

            break;


        case "text":

            html = `
                <div
                    class="note-block text"
                    contenteditable="true"
                >
                    Start writing...
                </div>
            `;

            break;


        case "bullet":

            html = `
                <div
                    class="note-block bullet"
                    contenteditable="true"
                >
                    • New point
                </div>
            `;

            break;


        case "checklist":

            html = `
                <div
                    class="note-block checklist"
                    contenteditable="true"
                >
                    □ New task
                </div>
            `;

            break;


        case "divider":

            html = `
                <hr class="note-divider">
            `;

            break;


        case "quote":

            html = `
                <div
                    class="note-quote"
                    contenteditable="true"
                >
                    Important reminder...
                </div>
            `;

            break;

    }


    canvas.insertAdjacentHTML(
        "beforeend",
        html
    );


    setupEditorEvents();

    saveCurrentNote();

}


/* =========================================================
   UNDO / REDO
   ========================================================= */

function undoNote() {

    if (noteHistoryIndex <= 0) return;


    noteHistoryIndex--;

    const canvas =
        document.getElementById("noteCanvas");


    canvas.innerHTML =
        noteHistory[noteHistoryIndex];


    setupEditorEvents();

    saveCurrentNote();

}


function redoNote() {

    if (
        noteHistoryIndex >=
        noteHistory.length - 1
    ) {
        return;
    }


    noteHistoryIndex++;


    const canvas =
        document.getElementById("noteCanvas");


    canvas.innerHTML =
        noteHistory[noteHistoryIndex];


    setupEditorEvents();

    saveCurrentNote();

}


/* =========================================================
   FULLSCREEN EDITOR
   ========================================================= */

async function toggleEditorFullscreen() {

    const editor =
        document.getElementById(
            "editorScreen"
        );


    if (!document.fullscreenElement) {

        try {

            await editor.requestFullscreen();

        } catch (error) {

            editor.classList.toggle(
                "fake-fullscreen"
            );

        }

    } else {

        await document.exitFullscreen();

    }

}


/* =========================================================
   WHITEBOARD
   ========================================================= */

let whiteboardCurrentId = null;

let whiteboardTool = "select";

let whiteboardZoom = 1;

let whiteboardHistory = [];

let whiteboardHistoryIndex = -1;

let drawing = false;

let lastX = 0;

let lastY = 0;


const whiteboardCanvas =
    document.getElementById(
        "whiteboardCanvas"
    );


let whiteboardCtx = null;


function setupWhiteboard() {

    const canvas =
        document.getElementById(
            "whiteboardCanvas"
        );


    if (!canvas) return;


    whiteboardCtx =
        canvas.getContext("2d");


    resizeWhiteboardCanvas();


    window.addEventListener(
        "resize",
        resizeWhiteboardCanvas
    );


    canvas.addEventListener(
        "pointerdown",
        whiteboardPointerDown
    );


    canvas.addEventListener(
        "pointermove",
        whiteboardPointerMove
    );


    canvas.addEventListener(
        "pointerup",
        whiteboardPointerUp
    );


    canvas.addEventListener(
        "pointercancel",
        whiteboardPointerUp
    );


    document
        .querySelectorAll(
            ".whiteboard-tool"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    setWhiteboardTool(
                        button.dataset.tool
                    );

                }
            );

        });


    document
        .getElementById("zoomIn")
        ?.addEventListener(
            "click",
            () => changeWhiteboardZoom(0.1)
        );


    document
        .getElementById("zoomOut")
        ?.addEventListener(
            "click",
            () => changeWhiteboardZoom(-0.1)
        );


    document
        .getElementById("toggleGrid")
        ?.addEventListener(
            "click",
            () => {

                document
                    .querySelector(
                        ".whiteboard-canvas-wrapper"
                    )
                    .classList.toggle(
                        "grid-enabled"
                    );

            }
        );


    document
        .getElementById("fitWhiteboard")
        ?.addEventListener(
            "click",
            () => {

                whiteboardZoom = 1;

                updateZoomLabel();

            }
        );


    document
        .getElementById("whiteboardUndo")
        ?.addEventListener(
            "click",
            undoWhiteboard
        );


    document
        .getElementById("whiteboardRedo")
        ?.addEventListener(
            "click",
            redoWhiteboard
        );


    document
        .getElementById("whiteboardFullscreen")
        ?.addEventListener(
            "click",
            toggleWhiteboardFullscreen
        );


    document
        .getElementById("closeWhiteboard")
        ?.addEventListener(
            "click",
            closeWhiteboard
        );


    document
        .getElementById("whiteboardDone")
        ?.addEventListener(
            "click",
            closeWhiteboard
        );


    document
        .getElementById("whiteboardTitle")
        ?.addEventListener(
            "input",
            saveCurrentWhiteboard
        );

}


/* =========================================================
   RESIZE CANVAS
   ========================================================= */

function resizeWhiteboardCanvas() {

    const canvas =
        document.getElementById(
            "whiteboardCanvas"
        );


    const wrapper =
        document.querySelector(
            ".whiteboard-canvas-wrapper"
        );


    if (!canvas || !wrapper) return;


    const rect =
        wrapper.getBoundingClientRect();


    const ratio =
        window.devicePixelRatio || 1;


    canvas.width =
        rect.width * ratio;

    canvas.height =
        rect.height * ratio;

    canvas.style.width =
        rect.width + "px";

    canvas.style.height =
        rect.height + "px";


    whiteboardCtx =
        canvas.getContext("2d");


    whiteboardCtx.scale(
        ratio,
        ratio
    );

}


/* =========================================================
   WHITEBOARD TOOL
   ========================================================= */

function setWhiteboardTool(tool) {

    whiteboardTool =
        tool;


    document
        .querySelectorAll(
            ".whiteboard-tool"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.tool === tool
            );

        });

}


/* =========================================================
   WHITEBOARD DRAWING
   ========================================================= */

function whiteboardPointerDown(event) {

    if (
        whiteboardTool !== "pen" &&
        whiteboardTool !== "eraser"
    ) {

        if (
            whiteboardTool === "text" ||
            whiteboardTool === "sticky" ||
            whiteboardTool === "shape"
        ) {

            createWhiteboardObject(
                whiteboardTool,
                event.clientX,
                event.clientY
            );

        }

        return;

    }


    drawing = true;

    lastX = event.offsetX;

    lastY = event.offsetY;

}


function whiteboardPointerMove(event) {

    if (!drawing) return;


    const x =
        event.offsetX;

    const y =
        event.offsetY;


    whiteboardCtx.lineWidth =
        whiteboardTool === "eraser"
            ? 20
            : 3;


    whiteboardCtx.lineCap =
        "round";


    whiteboardCtx.strokeStyle =
        whiteboardTool === "eraser"
            ? "#faf8f3"
            : "#6f4e37";


    whiteboardCtx.beginPath();

    whiteboardCtx.moveTo(
        lastX,
        lastY
    );

    whiteboardCtx.lineTo(
        x,
        y
    );

    whiteboardCtx.stroke();


    lastX = x;
    lastY = y;


    saveWhiteboardCanvas();
}


function whiteboardPointerUp() {

    if (!drawing) return;

    drawing = false;

    pushWhiteboardHistory();

}


/* =========================================================
   WHITEBOARD OBJECTS
   ========================================================= */

function createWhiteboardObject(
    type,
    clientX,
    clientY
) {

    const wrapper =
        document.querySelector(
            ".whiteboard-canvas-wrapper"
        );


    const objects =
        document.getElementById(
            "whiteboardObjects"
        );


    if (!wrapper || !objects) return;


    const rect =
        wrapper.getBoundingClientRect();


    const x =
        clientX -
        rect.left;

    const y =
        clientY -
        rect.top;


    const object =
        document.createElement("div");


    object.classList.add(
        "whiteboard-object"
    );


    object.style.left =
        x + "px";

    object.style.top =
        y + "px";


    if (type === "text") {

        object.classList.add(
            "whiteboard-text-object"
        );

        object.contentEditable =
            "true";

        object.textContent =
            "Type something...";

    }


    if (type === "sticky") {

        object.classList.add(
            "whiteboard-sticky"
        );

        object.contentEditable =
            "true";

        object.textContent =
            "New idea...";

    }


    if (type === "shape") {

        object.classList.add(
            "whiteboard-shape"
        );

    }


    objects.appendChild(object);


    makeObjectDraggable(object);


    pushWhiteboardHistory();

    saveCurrentWhiteboard();

}


function makeObjectDraggable(object) {

    let moving = false;

    let startX = 0;

    let startY = 0;

    let originalLeft = 0;

    let originalTop = 0;


    object.addEventListener(
        "pointerdown",
        event => {

            if (
                whiteboardTool !==
                "select"
            ) {
                return;
            }


            moving = true;

            startX =
                event.clientX;

            startY =
                event.clientY;


            originalLeft =
                parseFloat(
                    object.style.left
                ) || 0;

            originalTop =
                parseFloat(
                    object.style.top
                ) || 0;


            object.setPointerCapture(
                event.pointerId
            );

        }
    );


    object.addEventListener(
        "pointermove",
        event => {

            if (!moving) return;


            const dx =
                event.clientX -
                startX;

            const dy =
                event.clientY -
                startY;


            object.style.left =
                originalLeft + dx + "px";

            object.style.top =
                originalTop + dy + "px";

        }
    );


    object.addEventListener(
        "pointerup",
        () => {

            if (!moving) return;

            moving = false;

            pushWhiteboardHistory();

            saveCurrentWhiteboard();

        }
    );

}


/* =========================================================
   WHITEBOARD SAVE
   ========================================================= */

function openWhiteboard() {

    const existing =
        whiteboards[0];


    const whiteboard = existing || {

        id: uid("whiteboard"),

        title:
            "Untitled Whiteboard",

        folderId:
            currentFolderId,

        createdAt:
            Date.now(),

        updatedAt:
            Date.now(),

        objects: [],

        drawing: null

    };


    if (!existing) {

        whiteboards.push(
            whiteboard
        );

        saveWhiteboards();

    }


    whiteboardCurrentId =
        whiteboard.id;


    document
        .getElementById("whiteboardTitle")
        .value =
        whiteboard.title;


    document
        .getElementById("whiteboardScreen")
        .classList.remove("hidden");


    restoreWhiteboard(
        whiteboard
    );

}


function restoreWhiteboard(whiteboard) {

    const objects =
        document.getElementById(
            "whiteboardObjects"
        );


    if (!objects) return;


    objects.innerHTML = "";


    if (whiteboard.objects) {

        whiteboard.objects.forEach(data => {

            const object =
                document.createElement("div");


            object.className =
                data.className;


            object.style.left =
                data.left;

            object.style.top =
                data.top;

            object.textContent =
                data.text || "";


            if (
                data.contentEditable
            ) {

                object.contentEditable =
                    "true";

            }


            objects.appendChild(
                object
            );


            makeObjectDraggable(
                object
            );

        });

    }


    if (
        whiteboard.drawing
    ) {

        const image =
            new Image();


        image.onload = () => {

            whiteboardCtx.clearRect(
                0,
                0,
                whiteboardCanvas.width,
                whiteboardCanvas.height
            );

            whiteboardCtx.drawImage(
                image,
                0,
                0
            );

        };


        image.src =
            whiteboard.drawing;

    }

}


function saveCurrentWhiteboard() {

    if (!whiteboardCurrentId)
        return;


    const whiteboard =
        whiteboards.find(
            item =>
                item.id ===
                whiteboardCurrentId
        );


    if (!whiteboard) return;


    whiteboard.title =
        document
            .getElementById(
                "whiteboardTitle"
            )
            .value
            .trim() ||
        "Untitled Whiteboard";


    whiteboard.updatedAt =
        Date.now();


    whiteboard.objects =
        Array.from(
            document.querySelectorAll(
                ".whiteboard-object"
            )
        ).map(object => ({

            className:
                object.className,

            left:
                object.style.left,

            top:
                object.style.top,

            text:
                object.textContent,

            contentEditable:
                object.contentEditable ===
                "true"

        }));


    saveWhiteboardCanvas();

    saveWhiteboards();


    const status =
        document.getElementById(
            "whiteboardSaveStatus"
        );


    if (status) {

        status.textContent =
            "Saved";

    }

}


function saveWhiteboardCanvas() {

    if (!whiteboardCurrentId)
        return;


    const whiteboard =
        whiteboards.find(
            item =>
                item.id ===
                whiteboardCurrentId
        );


    if (!whiteboard) return;


    whiteboard.drawing =
        document
            .getElementById(
                "whiteboardCanvas"
            )
            .toDataURL();

}


/* =========================================================
   WHITEBOARD HISTORY
   ========================================================= */

function pushWhiteboardHistory() {

    const canvas =
        document.getElementById(
            "whiteboardCanvas"
        );


    if (!canvas) return;


    const snapshot = {

        drawing:
            canvas.toDataURL(),

        objects:
            Array.from(
                document.querySelectorAll(
                    ".whiteboard-object"
                )
            ).map(object => ({

                className:
                    object.className,

                left:
                    object.style.left,

                top:
                    object.style.top,

                text:
                    object.textContent

            }))

    };


    whiteboardHistory =
        whiteboardHistory.slice(
            0,
            whiteboardHistoryIndex + 1
        );


    whiteboardHistory.push(
        snapshot
    );


    whiteboardHistoryIndex++;


    if (
        whiteboardHistory.length > 30
    ) {

        whiteboardHistory.shift();

        whiteboardHistoryIndex--;

    }

}


function restoreWhiteboardSnapshot(
    snapshot
) {

    const objects =
        document.getElementById(
            "whiteboardObjects"
        );


    objects.innerHTML = "";


    snapshot.objects.forEach(data => {

        const object =
            document.createElement("div");


        object.className =
            data.className;


        object.style.left =
            data.left;

        object.style.top =
            data.top;

        object.textContent =
            data.text;


        if (
            data.className.includes(
                "text-object"
            ) ||
            data.className.includes(
                "sticky"
            )
        ) {

            object.contentEditable =
                "true";

        }


        objects.appendChild(
            object
        );

        makeObjectDraggable(
            object
        );

    });


    const image =
        new Image();


    image.onload = () => {

        whiteboardCtx.clearRect(
            0,
            0,
            whiteboardCanvas.width,
            whiteboardCanvas.height
        );

        whiteboardCtx.drawImage(
            image,
            0,
            0
        );

    };


    image.src =
        snapshot.drawing;


    saveCurrentWhiteboard();

}


function undoWhiteboard() {

    if (
        whiteboardHistoryIndex <= 0
    ) {
        return;
    }


    whiteboardHistoryIndex--;


    restoreWhiteboardSnapshot(
        whiteboardHistory[
            whiteboardHistoryIndex
        ]
    );

}


function redoWhiteboard() {

    if (
        whiteboardHistoryIndex >=
        whiteboardHistory.length - 1
    ) {
        return;
    }


    whiteboardHistoryIndex++;


    restoreWhiteboardSnapshot(
        whiteboardHistory[
            whiteboardHistoryIndex
        ]
    );

}


/* =========================================================
   WHITEBOARD ZOOM
   ========================================================= */

function changeWhiteboardZoom(amount) {

    whiteboardZoom =
        Math.max(
            0.5,
            Math.min(
                2,
                whiteboardZoom + amount
            )
        );


    updateZoomLabel();

}


function updateZoomLabel() {

    document
        .getElementById(
            "zoomValue"
        )
        .textContent =
        Math.round(
            whiteboardZoom * 100
        ) + "%";

}


async function toggleWhiteboardFullscreen() {

    const screen =
        document.getElementById(
            "whiteboardScreen"
        );


    if (!document.fullscreenElement) {

        try {

            await screen.requestFullscreen();

        } catch (error) {

            screen.classList.toggle(
                "fake-fullscreen"
            );

        }

    } else {

        await document.exitFullscreen();

    }

}


function closeWhiteboard() {

    saveCurrentWhiteboard();

    whiteboardCurrentId =
        null;

    document
        .getElementById(
            "whiteboardScreen"
        )
        .classList.add("hidden");

}


/* =========================================================
   MODALS
   ========================================================= */

function openModal(id) {

    document
        .getElementById(id)
        ?.classList.remove("hidden");

}


function closeModal(id) {

    document
        .getElementById(id)
        ?.classList.add("hidden");

}


document
    .querySelectorAll(
        "[data-close-modal]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const modal =
                    button.closest(
                        ".modal-overlay"
                    );

                if (modal) {

                    modal.classList.add(
                        "hidden"
                    );

                }

            }
        );

    });


/* =========================================================
   MAIN EVENT SETUP
   ========================================================= */

function setupNotesEvents() {

    document
        .getElementById("newFolderBtn")
        ?.addEventListener(
            "click",
            openFolderModal
        );


    document
        .getElementById("newNoteTopBtn")
        ?.addEventListener(
            "click",
            () => openNewNoteModal("blank")
        );


    document
        .getElementById("emptyCreateBtn")
        ?.addEventListener(
            "click",
            () => openNewNoteModal("blank")
        );


    document
        .getElementById("viewTemplatesBtn")
        ?.addEventListener(
            "click",
            () => {

                renderAllTemplates();

                openModal(
                    "templateModal"
                );

            }
        );


    document
        .getElementById("openWhiteboardBtn")
        ?.addEventListener(
            "click",
            openWhiteboard
        );


    document
        .getElementById("viewAllNotesBtn")
        ?.addEventListener(
            "click",
            () => {

                currentFolderId =
                    "root";

                renderAll();

            }
        );


    document
        .getElementById("notesSearch")
        ?.addEventListener(
            "input",
            () => {

                const value =
                    document
                        .getElementById(
                            "notesSearch"
                        )
                        .value;


                document
                    .getElementById(
                        "clearSearch"
                    )
                    .classList.toggle(
                        "visible",
                        value.length > 0
                    );


                renderNotes();

            }
        );


    document
        .getElementById("clearSearch")
        ?.addEventListener(
            "click",
            () => {

                const input =
                    document.getElementById(
                        "notesSearch"
                    );


                input.value = "";

                input.focus();

                document
                    .getElementById(
                        "clearSearch"
                    )
                    .classList.remove(
                        "visible"
                    );

                renderNotes();

            }
        );


    document
        .getElementById("folderForm")
        ?.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    document
                        .getElementById(
                            "folderName"
                        )
                        .value;


                const parentId =
                    document
                        .getElementById(
                            "folderParent"
                        )
                        .value;


                if (!name.trim()) return;


                createFolder(
                    name,
                    parentId
                );


                closeModal(
                    "folderModal"
                );

            }
        );


    document
        .getElementById("newNoteForm")
        ?.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const title =
                    document
                        .getElementById(
                            "newNoteTitle"
                        )
                        .value;
                const folderId =
                    document
                        .getElementById(
                            "newNoteFolder"
                        )
                        .value;
                createNote(
                    title,
                    folderId,
                    selectedTemplate
                );
            }
        );
    document
        .getElementById("templateSearch")
        ?.addEventListener(
            "input",
            renderAllTemplates
        );
    document
        .querySelectorAll(
            ".template-category"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    currentTemplateCategory =
                        button.dataset.category;
                    document
                        .querySelectorAll(
                            ".template-category"
                        )
                        .forEach(item => {
                            item.classList.toggle(
                                "active",
                                item === button
                            );
                        });
                    renderAllTemplates();
                }
            );
        });
}
/* =========================================================
   RENDER EVERYTHING
   ========================================================= */
function renderAll() {
    renderFolders();
    renderBreadcrumbs();
    renderNotes();
    renderFolderSelects();
    renderFeaturedTemplates();
}

/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */
document.addEventListener(
    "keydown",
    event => {
        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "n"
        ) {
            event.preventDefault();
            openNewNoteModal("blank");
        }
        if ( event.key === "Escape"
        ) {
            const modals =document.querySelectorAll(
                    ".modal-overlay:not(.hidden)");
            modals.forEach(modal => {
                modal.classList.add(
                    "hidden"
                );
            });
        }
    }
);
/* =========================================================
   INITIALISE
   ========================================================= */
document.addEventListener(
    "DOMContentLoaded",() => {
        createDefaultFolders();
        setupNotesEvents();
        setupWhiteboard();
        renderAll();
    }
);