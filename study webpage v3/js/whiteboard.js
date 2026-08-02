
/* =========================================================
   WHITEBOARD
   ========================================================= */
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

let whiteboardCtx = null;

let whiteboardInitialized = false;


/* =========================================================
   SETUP WHITEBOARD
   ========================================================= */

function setupWhiteboard() {

    const canvas =
        document.getElementById("whiteboardCanvas");

    if (!canvas) return;

    if (whiteboardInitialized) return;

    whiteboardInitialized = true;

    whiteboardCtx =
        canvas.getContext("2d");

    resizeWhiteboardCanvas();

    window.addEventListener(
        "resize",
        resizeWhiteboardCanvas
    );


    /* =========================
       TOOLS
       ========================= */

    document
        .querySelectorAll(".whiteboard-tool")
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


    /* =========================
       CANVAS POINTER EVENTS
       ========================= */

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


    /* =========================
       ZOOM
       ========================= */

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
        .getElementById("fitWhiteboard")
        ?.addEventListener(
            "click",
            fitWhiteboard
        );


    /* =========================
       GRID
       ========================= */

    document
        .getElementById("toggleGrid")
        ?.addEventListener(
            "click",
            toggleWhiteboardGrid
        );


    /* =========================
       UNDO / REDO
       ========================= */

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


    /* =========================
       FULLSCREEN
       ========================= */

    document
        .getElementById("whiteboardFullscreen")
        ?.addEventListener(
            "click",
            toggleWhiteboardFullscreen
        );


    /* =========================
       CLOSE
       ========================= */

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


    /* =========================
       TITLE
       ========================= */

    document
        .getElementById("whiteboardTitle")
        ?.addEventListener(
            "input",
            saveCurrentWhiteboard
        );

}


/* =========================================================
   CANVAS RESIZE
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


    const oldDrawing =
        canvas.width > 0 && canvas.height > 0
            ? canvas.toDataURL()
            : null;


    const rect =
        wrapper.getBoundingClientRect();


    const ratio =
        window.devicePixelRatio || 1;


    canvas.width =
        Math.max(1, rect.width * ratio);

    canvas.height =
        Math.max(1, rect.height * ratio);


    canvas.style.width =
        rect.width + "px";

    canvas.style.height =
        rect.height + "px";


    whiteboardCtx =
        canvas.getContext("2d");


    whiteboardCtx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );


    whiteboardCtx.lineCap =
        "round";

    whiteboardCtx.lineJoin =
        "round";


    /* Restore old drawing after resize */

    if (oldDrawing) {

        const image =
            new Image();

        image.onload = () => {

            whiteboardCtx.drawImage(
                image,
                0,
                0,
                rect.width,
                rect.height
            );

        };

        image.src =
            oldDrawing;

    }

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


    const canvas =
        document.getElementById(
            "whiteboardCanvas"
        );


    if (!canvas) return;


    if (
        tool === "pen" ||
        tool === "eraser"
    ) {

        canvas.style.cursor =
            "crosshair";

    }

    else if (
        tool === "text" ||
        tool === "sticky" ||
        tool === "shape" ||
        tool === "arrow"
    ) {

        canvas.style.cursor =
            "crosshair";

    }

    else if (tool === "delete") {

        canvas.style.cursor =
            "not-allowed";

    }

    else {

        canvas.style.cursor =
            "default";

    }

}


/* =========================================================
   CANVAS COORDINATES
   ========================================================= */

function getWhiteboardPosition(event) {

    const canvas =
        document.getElementById(
            "whiteboardCanvas"
        );

    const rect =
        canvas.getBoundingClientRect();


    return {

        x:
            (event.clientX - rect.left)
            / whiteboardZoom,

        y:
            (event.clientY - rect.top)
            / whiteboardZoom

    };

}


/* =========================================================
   POINTER DOWN
   ========================================================= */

function whiteboardPointerDown(event) {

    event.preventDefault();


    const position =
        getWhiteboardPosition(event);


    /* =========================
       DELETE
       ========================= */

    if (
        whiteboardTool === "delete"
    ) {

        const object =
            document
                .elementFromPoint(
                    event.clientX,
                    event.clientY
                )
                ?.closest(
                    ".whiteboard-object"
                );


        if (object) {

            object.remove();

            pushWhiteboardHistory();

            saveCurrentWhiteboard();

        }

        return;

    }


    /* =========================
       TEXT
       ========================= */

    if (
        whiteboardTool === "text"
    ) {

        createWhiteboardObject(
            "text",
            position.x,
            position.y
        );

        return;

    }


    /* =========================
       STICKY
       ========================= */

    if (
        whiteboardTool === "sticky"
    ) {

        createWhiteboardObject(
            "sticky",
            position.x,
            position.y
        );

        return;

    }


    /* =========================
       SHAPE
       ========================= */

    if (
        whiteboardTool === "shape"
    ) {

        createWhiteboardObject(
            "shape",
            position.x,
            position.y
        );

        return;

    }


    /* =========================
       ARROW
       ========================= */

    if (
        whiteboardTool === "arrow"
    ) {

        createWhiteboardObject(
            "arrow",
            position.x,
            position.y
        );

        return;

    }


    /* =========================
       PEN / ERASER
       ========================= */

    if (
        whiteboardTool === "pen" ||
        whiteboardTool === "eraser"
    ) {

        drawing = true;

        lastX =
            position.x;

        lastY =
            position.y;

        const canvas =
            document.getElementById(
                "whiteboardCanvas"
            );

        canvas.setPointerCapture(
            event.pointerId
        );

    }

}


/* =========================================================
   POINTER MOVE
   ========================================================= */

function whiteboardPointerMove(event) {

    if (!drawing) return;


    const position =
        getWhiteboardPosition(event);


    const x =
        position.x;

    const y =
        position.y;


    if (
        whiteboardTool === "eraser"
    ) {

        whiteboardCtx.lineWidth =
            30;

        whiteboardCtx.strokeStyle =
            "#faf8f3";

    }

    else {

        whiteboardCtx.lineWidth =
            3;

        whiteboardCtx.strokeStyle =
            "#6f4e37";

    }


    whiteboardCtx.lineCap =
        "round";


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


    lastX =
        x;

    lastY =
        y;

}


/* =========================================================
   POINTER UP
   ========================================================= */

function whiteboardPointerUp() {

    if (!drawing) return;


    drawing = false;


    pushWhiteboardHistory();

    saveCurrentWhiteboard();

}


/* =========================================================
   CREATE WHITEBOARD OBJECT
   ========================================================= */

function createWhiteboardObject(
    type,
    x,
    y
) {

    const objects =
        document.getElementById(
            "whiteboardObjects"
        );


    if (!objects) return;


    const object =
        document.createElement("div");


    object.classList.add(
        "whiteboard-object"
    );


    object.style.left =
        x + "px";

    object.style.top =
        y + "px";


    /* =========================
       TEXT
       ========================= */

    if (type === "text") {

        object.classList.add(
            "whiteboard-text-object"
        );

        object.contentEditable =
            "true";

        object.textContent =
            "Type something...";

    }


    /* =========================
       STICKY
       ========================= */

    if (type === "sticky") {

        object.classList.add(
            "whiteboard-sticky"
        );

        object.contentEditable =
            "true";

        object.textContent =
            "New idea...";

    }


    /* =========================
       SHAPE
       ========================= */

    if (type === "shape") {

        object.classList.add(
            "whiteboard-shape"
        );

    }


    /* =========================
       ARROW
       ========================= */

    if (type === "arrow") {

        object.classList.add(
            "whiteboard-arrow-object"
        );

        object.textContent =
            "→";

    }


    objects.appendChild(
        object
    );


    makeObjectDraggable(
        object
    );


    /* Save text changes */

    if (
        object.contentEditable ===
        "true"
    ) {

        object.addEventListener(
            "input",
            saveCurrentWhiteboard
        );

    }


    pushWhiteboardHistory();

    saveCurrentWhiteboard();


    /* Automatically focus text */

    if (
        object.contentEditable ===
        "true"
    ) {

        object.focus();

    }

}


/* =========================================================
   DRAG WHITEBOARD OBJECT
   ========================================================= */

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


            event.stopPropagation();


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
                (
                    event.clientX -
                    startX
                )
                / whiteboardZoom;


            const dy =
                (
                    event.clientY -
                    startY
                )
                / whiteboardZoom;


            object.style.left =
                (
                    originalLeft +
                    dx
                ) + "px";


            object.style.top =
                (
                    originalTop +
                    dy
                ) + "px";

        }
    );


    object.addEventListener(
        "pointerup",
        event => {

            if (!moving) return;


            moving = false;


            try {

                object.releasePointerCapture(
                    event.pointerId
                );

            } catch (error) {}


            pushWhiteboardHistory();

            saveCurrentWhiteboard();

        }
    );

}


/* =========================================================
   OPEN WHITEBOARD
   ========================================================= */

function openWhiteboard() {

    const existing =
        whiteboards.length > 0
            ? whiteboards[0]
            : null;


    const whiteboard =
        existing || {

            id:
                uid("whiteboard"),

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


    const title =
        document.getElementById(
            "whiteboardTitle"
        );


    if (title) {

        title.value =
            whiteboard.title;

    }


    const screen =
        document.getElementById(
            "whiteboardScreen"
        );


    if (!screen) return;


    screen.classList.remove(
        "hidden"
    );


    document.body.classList.add(
        "whiteboard-open"
    );


    /* Reset */

    whiteboardZoom =
        1;

    updateZoomLabel();


    setWhiteboardTool(
        "select"
    );


    /* Restore saved content */

    restoreWhiteboard(
        whiteboard
    );


    /* Start history fresh */

    whiteboardHistory = [];

    whiteboardHistoryIndex = -1;


    pushWhiteboardHistory();

}


/* =========================================================
   RESTORE WHITEBOARD
   ========================================================= */

function restoreWhiteboard(
    whiteboard
) {

    const objects =
        document.getElementById(
            "whiteboardObjects"
        );


    const canvas =
        document.getElementById(
            "whiteboardCanvas"
        );


    if (!objects || !canvas) return;


    objects.innerHTML = "";


    /* =========================
       RESTORE OBJECTS
       ========================= */

    if (
        Array.isArray(
            whiteboard.objects
        )
    ) {

        whiteboard.objects.forEach(
            data => {

                const object =
                    document.createElement(
                        "div"
                    );


                object.className =
                    data.className ||
                    "whiteboard-object";


                object.style.left =
                    data.left || "0px";


                object.style.top =
                    data.top || "0px";


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


                if (
                    object.contentEditable ===
                    "true"
                ) {

                    object.addEventListener(
                        "input",
                        saveCurrentWhiteboard
                    );

                }

            }
        );

    }


    /* =========================
       RESTORE DRAWING
       ========================= */

    whiteboardCtx.clearRect(
        0,
        0,
        canvas.clientWidth,
        canvas.clientHeight
    );


    if (
        whiteboard.drawing
    ) {

        const image =
            new Image();


        image.onload = () => {

            whiteboardCtx.drawImage(
                image,
                0,
                0,
                canvas.clientWidth,
                canvas.clientHeight
            );

        };


        image.src =
            whiteboard.drawing;

    }

}


/* =========================================================
   SAVE WHITEBOARD
   ========================================================= */

function saveCurrentWhiteboard() {

    if (
        !whiteboardCurrentId
    ) {

        return;

    }


    const whiteboard =
        whiteboards.find(
            item =>
                item.id ===
                whiteboardCurrentId
        );


    if (!whiteboard) return;


    const title =
        document.getElementById(
            "whiteboardTitle"
        );


    whiteboard.title =
        title?.value.trim() ||
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


/* =========================================================
   SAVE CANVAS DRAWING
   ========================================================= */

function saveWhiteboardCanvas() {

    if (
        !whiteboardCurrentId
    ) {

        return;

    }


    const whiteboard =
        whiteboards.find(
            item =>
                item.id ===
                whiteboardCurrentId
        );


    const canvas =
        document.getElementById(
            "whiteboardCanvas"
        );


    if (!whiteboard || !canvas)
        return;


    whiteboard.drawing =
        canvas.toDataURL(
            "image/png"
        );

}


/* =========================================================
   HISTORY SNAPSHOT
   ========================================================= */

function createWhiteboardSnapshot() {

    const canvas =
        document.getElementById(
            "whiteboardCanvas"
        );


    if (!canvas) return null;


    return {

        drawing:
            canvas.toDataURL(
                "image/png"
            ),

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
                    object.textContent,

                contentEditable:
                    object.contentEditable ===
                    "true"

            }))

    };

}


/* =========================================================
   PUSH HISTORY
   ========================================================= */

function pushWhiteboardHistory() {

    const snapshot =
        createWhiteboardSnapshot();


    if (!snapshot) return;


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
        whiteboardHistory.length >
        30
    ) {

        whiteboardHistory.shift();

        whiteboardHistoryIndex--;

    }

}


/* =========================================================
   RESTORE HISTORY SNAPSHOT
   ========================================================= */

function restoreWhiteboardSnapshot(
    snapshot
) {

    if (!snapshot) return;


    const objects =
        document.getElementById(
            "whiteboardObjects"
        );


    const canvas =
        document.getElementById(
            "whiteboardCanvas"
        );


    if (!objects || !canvas)
        return;


    objects.innerHTML = "";


    /* =========================
       OBJECTS
       ========================= */

    snapshot.objects.forEach(
        data => {

            const object =
                document.createElement(
                    "div"
                );


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


            if (
                object.contentEditable ===
                "true"
            ) {

                object.addEventListener(
                    "input",
                    saveCurrentWhiteboard
                );

            }

        }
    );


    /* =========================
       DRAWING
       ========================= */

    whiteboardCtx.clearRect(
        0,
        0,
        canvas.clientWidth,
        canvas.clientHeight
    );


    if (
        snapshot.drawing
    ) {

        const image =
            new Image();


        image.onload = () => {

            whiteboardCtx.drawImage(
                image,
                0,
                0,
                canvas.clientWidth,
                canvas.clientHeight
            );

        };


        image.src =
            snapshot.drawing;

    }


    saveCurrentWhiteboard();

}


/* =========================================================
   UNDO
   ========================================================= */

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


/* =========================================================
   REDO
   ========================================================= */

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
   ZOOM
   ========================================================= */

function changeWhiteboardZoom(
    amount
) {

    whiteboardZoom =
        Math.max(
            0.5,
            Math.min(
                2,
                whiteboardZoom + amount
            )
        );


    applyWhiteboardZoom();

}


/* =========================================================
   APPLY ZOOM
   ========================================================= */

function applyWhiteboardZoom() {

    const wrapper =
        document.querySelector(
            ".whiteboard-canvas-wrapper"
        );


    if (!wrapper) return;


    const canvas =
        document.getElementById(
            "whiteboardCanvas"
        );


    const objects =
        document.getElementById(
            "whiteboardObjects"
        );


    if (canvas) {

        canvas.style.transform =
            `scale(${whiteboardZoom})`;

        canvas.style.transformOrigin =
            "top left";

    }


    if (objects) {

        objects.style.transform =
            `scale(${whiteboardZoom})`;

        objects.style.transformOrigin =
            "top left";

    }


    updateZoomLabel();

}


/* =========================================================
   ZOOM LABEL
   ========================================================= */

function updateZoomLabel() {

    const label =
        document.getElementById(
            "zoomValue"
        );


    if (!label) return;


    label.textContent =
        Math.round(
            whiteboardZoom * 100
        ) + "%";

}


/* =========================================================
   FIT WHITEBOARD
   ========================================================= */

function fitWhiteboard() {

    whiteboardZoom =
        1;


    applyWhiteboardZoom();

}


/* =========================================================
   GRID
   ========================================================= */

function toggleWhiteboardGrid() {

    const wrapper =
        document.querySelector(
            ".whiteboard-canvas-wrapper"
        );


    if (!wrapper) return;


    wrapper.classList.toggle(
        "grid-enabled"
    );

}


/* =========================================================
   FULLSCREEN
   ========================================================= */

async function toggleWhiteboardFullscreen() {

    const screen =
        document.getElementById(
            "whiteboardScreen"
        );


    if (!screen) return;


    if (
        !document.fullscreenElement
    ) {

        try {

            await screen.requestFullscreen();

        }

        catch (error) {

            screen.classList.toggle(
                "fake-fullscreen"
            );

        }

    }

    else {

        try {

            await document.exitFullscreen();

        }

        catch (error) {}

    }

}


/* =========================================================
   CLOSE WHITEBOARD
   ========================================================= */

function closeWhiteboard() {

    saveCurrentWhiteboard();


    whiteboardCurrentId =
        null;


    drawing =
        false;


    document.body.classList.remove(
        "whiteboard-open"
    );


    const screen =
        document.getElementById(
            "whiteboardScreen"
        );


    if (screen) {

        screen.classList.add(
            "hidden"
        );

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

let whiteboardGridEnabled = false;
let whiteboardInitialized = false;


/* =========================================================
   GET WHITEBOARD ELEMENTS
   ========================================================= */

function getWhiteboardCanvas() {
    return document.getElementById("whiteboardCanvas");
}

function getWhiteboardObjects() {
    return document.getElementById("whiteboardObjects");
}

function getWhiteboardWrapper() {
    return document.querySelector(
        ".whiteboard-canvas-wrapper"
    );
}


/* =========================================================
   SETUP WHITEBOARD
   ========================================================= */

function setupWhiteboard() {

    const canvas = getWhiteboardCanvas();

    if (!canvas) return;

    if (whiteboardInitialized) return;

    whiteboardInitialized = true;

    resizeWhiteboardCanvas();

    window.addEventListener(
        "resize",
        resizeWhiteboardCanvas
    );


    /* =========================
       TOOLS
       ========================= */

    document
        .querySelectorAll(".whiteboard-tool")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    setWhiteboardTool(
                        button.dataset.tool
                    );

                }
            );

        });


    /* =========================
       CANVAS POINTER EVENTS
       ========================= */

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

    canvas.addEventListener(
        "pointerleave",
        whiteboardPointerUp
    );


    /* =========================
       ZOOM
       ========================= */

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


    /* =========================
       FIT
       ========================= */

    document
        .getElementById("fitWhiteboard")
        ?.addEventListener(
            "click",
            fitWhiteboard
        );


    /* =========================
       GRID
       ========================= */

    document
        .getElementById("toggleGrid")
        ?.addEventListener(
            "click",
            toggleWhiteboardGrid
        );


    /* =========================
       UNDO / REDO
       ========================= */

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


    /* =========================
       FULLSCREEN
       ========================= */

    document
        .getElementById("whiteboardFullscreen")
        ?.addEventListener(
            "click",
            toggleWhiteboardFullscreen
        );


    /* =========================
       CLOSE
       ========================= */

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


    /* =========================
       TITLE
       ========================= */

    document
        .getElementById("whiteboardTitle")
        ?.addEventListener(
            "input",
            saveCurrentWhiteboard
        );


    updateZoomLabel();
}


/* =========================================================
   OPEN WHITEBOARD
   ========================================================= */

function openWhiteboard() {

    const screen =
        document.getElementById(
            "whiteboardScreen"
        );

    if (!screen) return;


    let whiteboard =
        whiteboards[0];


    if (!whiteboard) {

        whiteboard = {

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

        whiteboards.push(
            whiteboard
        );

        saveWhiteboards();

    }


    whiteboardCurrentId =
        whiteboard.id;


    const title =
        document.getElementById(
            "whiteboardTitle"
        );

    if (title) {

        title.value =
            whiteboard.title ||
            "Untitled Whiteboard";

    }


    screen.classList.remove(
        "hidden"
    );


    document.body.classList.add(
        "whiteboard-open"
    );


    /* Let the browser finish displaying
       the screen before measuring canvas */

    requestAnimationFrame(() => {

        resizeWhiteboardCanvas();

        restoreWhiteboard(
            whiteboard
        );

        createInitialWhiteboardHistory();

    });

}


/* =========================================================
   RESIZE CANVAS
   ========================================================= */

function resizeWhiteboardCanvas() {

    const canvas =
        getWhiteboardCanvas();

    const wrapper =
        getWhiteboardWrapper();

    if (!canvas || !wrapper) return;


    const rect =
        wrapper.getBoundingClientRect();


    if (
        rect.width <= 0 ||
        rect.height <= 0
    ) {
        return;
    }


    const ratio =
        window.devicePixelRatio || 1;


    /*
       Save existing drawing before resizing.
    */

    let oldDrawing = null;

    if (
        canvas.width > 0 &&
        canvas.height > 0
    ) {

        try {

            oldDrawing =
                canvas.toDataURL();

        } catch (error) {

            oldDrawing = null;

        }

    }


    canvas.width =
        Math.floor(
            rect.width * ratio
        );

    canvas.height =
        Math.floor(
            rect.height * ratio
        );


    canvas.style.width =
        rect.width + "px";

    canvas.style.height =
        rect.height + "px";


    const ctx =
        canvas.getContext("2d");


    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );


    /*
       Restore old drawing.
    */

    if (oldDrawing) {

        const image =
            new Image();

        image.onload = () => {

            ctx.drawImage(
                image,
                0,
                0,
                rect.width,
                rect.height
            );

        };

        image.src =
            oldDrawing;

    }

}


/* =========================================================
   SELECT TOOL
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


    const canvas =
        getWhiteboardCanvas();


    if (!canvas) return;


    if (
        tool === "pen" ||
        tool === "eraser"
    ) {

        canvas.style.cursor =
            "crosshair";

    }

    else if (
        tool === "text" ||
        tool === "sticky" ||
        tool === "shape" ||
        tool === "arrow"
    ) {

        canvas.style.cursor =
            "crosshair";

    }

    else if (
        tool === "delete"
    ) {

        canvas.style.cursor =
            "not-allowed";

    }

    else {

        canvas.style.cursor =
            "default";

    }

}


/* =========================================================
   CANVAS POINTER DOWN
   ========================================================= */

function whiteboardPointerDown(event) {

    const canvas =
        getWhiteboardCanvas();

    if (!canvas) return;


    /*
       Drawing tools
    */

    if (
        whiteboardTool === "pen" ||
        whiteboardTool === "eraser"
    ) {

        drawing = true;

        const point =
            getCanvasPoint(
                event,
                canvas
            );

        lastX =
            point.x;

        lastY =
            point.y;


        canvas.setPointerCapture(
            event.pointerId
        );

        return;

    }


    /*
       Text
    */

    if (
        whiteboardTool === "text"
    ) {

        const point =
            getCanvasPoint(
                event,
                canvas
            );

        createWhiteboardObject(
            "text",
            point.x,
            point.y
        );

        return;

    }


    /*
       Sticky
    */

    if (
        whiteboardTool === "sticky"
    ) {

        const point =
            getCanvasPoint(
                event,
                canvas
            );

        createWhiteboardObject(
            "sticky",
            point.x,
            point.y
        );

        return;

    }


    /*
       Shape
    */

    if (
        whiteboardTool === "shape"
    ) {

        const point =
            getCanvasPoint(
                event,
                canvas
            );

        createWhiteboardObject(
            "shape",
            point.x,
            point.y
        );

        return;

    }


    /*
       Arrow
    */

    if (
        whiteboardTool === "arrow"
    ) {

        const point =
            getCanvasPoint(
                event,
                canvas
            );

        createWhiteboardObject(
            "arrow",
            point.x,
            point.y
        );

        return;

    }

}


/* =========================================================
   CANVAS POINTER MOVE
   ========================================================= */

function whiteboardPointerMove(event) {

    if (!drawing) return;


    const canvas =
        getWhiteboardCanvas();

    if (!canvas) return;


    const point =
        getCanvasPoint(
            event,
            canvas
        );


    const ctx =
        canvas.getContext("2d");


    ctx.save();


    ctx.lineWidth =
        whiteboardTool === "eraser"
            ? 25
            : 3;


    ctx.lineCap =
        "round";

    ctx.lineJoin =
        "round";


    if (
        whiteboardTool === "eraser"
    ) {

        ctx.globalCompositeOperation =
            "destination-out";

    }

    else {

        ctx.globalCompositeOperation =
            "source-over";

        ctx.strokeStyle =
            "#6f4e37";

    }


    ctx.beginPath();

    ctx.moveTo(
        lastX,
        lastY
    );

    ctx.lineTo(
        point.x,
        point.y
    );

    ctx.stroke();


    ctx.restore();


    lastX =
        point.x;

    lastY =
        point.y;

}


/* =========================================================
   CANVAS POINTER UP
   ========================================================= */

function whiteboardPointerUp(event) {

    if (!drawing) return;


    drawing = false;


    const canvas =
        getWhiteboardCanvas();


    if (
        canvas &&
        canvas.hasPointerCapture(
            event.pointerId
        )
    ) {

        canvas.releasePointerCapture(
            event.pointerId
        );

    }


    pushWhiteboardHistory();

    saveCurrentWhiteboard();

}


/* =========================================================
   CANVAS COORDINATES
   ========================================================= */

function getCanvasPoint(
    event,
    canvas
) {

    const rect =
        canvas.getBoundingClientRect();


    return {

        x:
            event.clientX -
            rect.left,

        y:
            event.clientY -
            rect.top

    };

}


/* =========================================================
   CREATE OBJECT
   ========================================================= */

function createWhiteboardObject(
    type,
    x,
    y
) {

    const objects =
        getWhiteboardObjects();


    if (!objects) return;


    const object =
        document.createElement("div");


    object.classList.add(
        "whiteboard-object"
    );


    object.style.left =
        x + "px";

    object.style.top =
        y + "px";


    object.dataset.type =
        type;


    /* =========================
       TEXT
       ========================= */

    if (
        type === "text"
    ) {

        object.classList.add(
            "whiteboard-text-object"
        );

        object.contentEditable =
            "true";

        object.textContent =
            "Type something...";

    }


    /* =========================
       STICKY
       ========================= */

    if (
        type === "sticky"
    ) {

        object.classList.add(
            "whiteboard-sticky"
        );

        object.contentEditable =
            "true";

        object.textContent =
            "New idea...";

    }


    /* =========================
       SHAPE
       ========================= */

    if (
        type === "shape"
    ) {

        object.classList.add(
            "whiteboard-shape"
        );

    }


    /* =========================
       ARROW
       ========================= */

    if (
        type === "arrow"
    ) {

        object.classList.add(
            "whiteboard-arrow"
        );

    }


    objects.appendChild(
        object
    );


    makeObjectDraggable(
        object
    );


    makeObjectSelectable(
        object
    );


    /*
       Focus text immediately.
    */

    if (
        type === "text" ||
        type === "sticky"
    ) {

        setTimeout(() => {

            object.focus();

            document.execCommand(
                "selectAll",
                false,
                null
            );

        }, 0);

    }


    pushWhiteboardHistory();

    saveCurrentWhiteboard();

}


/* =========================================================
   OBJECT DRAGGING
   ========================================================= */

function makeObjectDraggable(
    object
) {

    let moving = false;

    let startX = 0;
    let startY = 0;

    let originalLeft = 0;
    let originalTop = 0;


    object.addEventListener(
        "pointerdown",
        event => {

            /*
               Delete tool gets priority.
            */

            if (
                whiteboardTool ===
                "delete"
            ) {

                event.preventDefault();
                event.stopPropagation();

                object.remove();

                pushWhiteboardHistory();

                saveCurrentWhiteboard();

                return;

            }


            /*
               Only select tool drags.
            */

            if (
                whiteboardTool !==
                "select"
            ) {

                return;

            }


            event.preventDefault();
            event.stopPropagation();


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
                originalLeft +
                dx + "px";

            object.style.top =
                originalTop +
                dy + "px";

        }
    );


    object.addEventListener(
        "pointerup",
        event => {

            if (!moving) return;


            moving = false;


            if (
                object.hasPointerCapture(
                    event.pointerId
                )
            ) {

                object.releasePointerCapture(
                    event.pointerId
                );

            }


            pushWhiteboardHistory();

            saveCurrentWhiteboard();

        }
    );


    object.addEventListener(
        "pointercancel",
        () => {

            moving = false;

        }
    );

}


/* =========================================================
   OBJECT SELECTION
   ========================================================= */

function makeObjectSelectable(
    object
) {

    object.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            if (
                whiteboardTool ===
                "delete"
            ) {

                object.remove();

                pushWhiteboardHistory();

                saveCurrentWhiteboard();

            }

        }
    );


    /*
       Save text/sticky changes.
    */

    object.addEventListener(
        "input",
        () => {

            if (
                object.contentEditable ===
                "true"
            ) {

                saveCurrentWhiteboard();

            }

        }
    );

}


/* =========================================================
   RESTORE WHITEBOARD
   ========================================================= */

function restoreWhiteboard(
    whiteboard
) {

    const objects =
        getWhiteboardObjects();

    const canvas =
        getWhiteboardCanvas();


    if (!objects || !canvas)
        return;


    objects.innerHTML = "";


    /*
       Clear canvas first.
    */

    const ctx =
        canvas.getContext("2d");


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
       Restore objects
    */

    if (
        Array.isArray(
            whiteboard.objects
        )
    ) {

        whiteboard.objects.forEach(
            data => {

                const object =
                    document.createElement(
                        "div"
                    );


                object.className =
                    data.className ||
                    "whiteboard-object";


                object.style.left =
                    data.left ||
                    "0px";

                object.style.top =
                    data.top ||
                    "0px";


                object.dataset.type =
                    data.type ||
                    "";


                object.textContent =
                    data.text ||
                    "";


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

                makeObjectSelectable(
                    object
                );

            }
        );

    }


    /*
       Restore drawing
    */

    if (
        whiteboard.drawing
    ) {

        const image =
            new Image();


        image.onload = () => {

            const rect =
                canvas.getBoundingClientRect();


            ctx.drawImage(
                image,
                0,
                0,
                rect.width,
                rect.height
            );

        };


        image.src =
            whiteboard.drawing;

    }


    setWhiteboardTool(
        "select"
    );

}


/* =========================================================
   SAVE WHITEBOARD
   ========================================================= */

function saveCurrentWhiteboard() {

    if (
        !whiteboardCurrentId
    ) {
        return;
    }


    const whiteboard =
        whiteboards.find(
            item =>
                item.id ===
                whiteboardCurrentId
        );


    if (!whiteboard) return;


    const title =
        document.getElementById(
            "whiteboardTitle"
        );


    whiteboard.title =
        title?.value.trim() ||
        "Untitled Whiteboard";


    whiteboard.updatedAt =
        Date.now();


    /*
       Save objects
    */

    whiteboard.objects =
        Array.from(
            document.querySelectorAll(
                ".whiteboard-object"
            )
        ).map(
            object => ({

                className:
                    object.className,

                left:
                    object.style.left,

                top:
                    object.style.top,

                text:
                    object.textContent,

                type:
                    object.dataset.type ||
                    "",

                contentEditable:
                    object.contentEditable ===
                    "true"

            })
        );


    /*
       Save drawing
    */

    const canvas =
        getWhiteboardCanvas();


    if (canvas) {

        whiteboard.drawing =
            canvas.toDataURL();

    }


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


/* =========================================================
   HISTORY SNAPSHOT
   ========================================================= */

function getWhiteboardSnapshot() {

    const canvas =
        getWhiteboardCanvas();


    return {

        drawing:
            canvas
                ? canvas.toDataURL()
                : null,

        objects:
            Array.from(
                document.querySelectorAll(
                    ".whiteboard-object"
                )
            ).map(
                object => ({

                    className:
                        object.className,

                    left:
                        object.style.left,

                    top:
                        object.style.top,

                    text:
                        object.textContent,

                    type:
                        object.dataset.type ||
                        "",

                    contentEditable:
                        object.contentEditable ===
                        "true"

                })
            )

    };

}


/* =========================================================
   PUSH HISTORY
   ========================================================= */

function pushWhiteboardHistory() {

    const snapshot =
        getWhiteboardSnapshot();


    whiteboardHistory =
        whiteboardHistory.slice(
            0,
            whiteboardHistoryIndex + 1
        );


    whiteboardHistory.push(
        snapshot
    );


    whiteboardHistoryIndex++;


    /*
       Keep maximum 30 states.
    */

    if (
        whiteboardHistory.length >
        30
    ) {

        whiteboardHistory.shift();

        whiteboardHistoryIndex--;

    }

}


/* =========================================================
   INITIAL HISTORY
   ========================================================= */

function createInitialWhiteboardHistory() {

    whiteboardHistory = [];

    whiteboardHistoryIndex = -1;


    pushWhiteboardHistory();

}


/* =========================================================
   RESTORE HISTORY SNAPSHOT
   ========================================================= */

function restoreWhiteboardSnapshot(
    snapshot
) {

    if (!snapshot) return;


    const objects =
        getWhiteboardObjects();

    const canvas =
        getWhiteboardCanvas();


    if (!objects || !canvas)
        return;


    objects.innerHTML = "";


    /*
       Restore objects
    */

    snapshot.objects.forEach(
        data => {

            const object =
                document.createElement(
                    "div"
                );


            object.className =
                data.className ||
                "whiteboard-object";


            object.style.left =
                data.left ||
                "0px";

            object.style.top =
                data.top ||
                "0px";


            object.dataset.type =
                data.type ||
                "";


            object.textContent =
                data.text ||
                "";


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

            makeObjectSelectable(
                object
            );

        }
    );


    /*
       Restore canvas
    */

    const ctx =
        canvas.getContext("2d");


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    if (
        snapshot.drawing
    ) {

        const image =
            new Image();


        image.onload = () => {

            const rect =
                canvas.getBoundingClientRect();


            ctx.drawImage(
                image,
                0,
                0,
                rect.width,
                rect.height
            );

        };


        image.src =
            snapshot.drawing;

    }


    saveCurrentWhiteboard();

}


/* =========================================================
   UNDO
   ========================================================= */

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


/* =========================================================
   REDO
   ========================================================= */

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
   ZOOM
   ========================================================= */

function changeWhiteboardZoom(
    amount
) {

    whiteboardZoom =
        Math.max(
            0.5,
            Math.min(
                2,
                whiteboardZoom +
                amount
            )
        );


    applyWhiteboardZoom();

    updateZoomLabel();

}


/* =========================================================
   APPLY ZOOM
   ========================================================= */

function applyWhiteboardZoom() {

    const canvas =
        getWhiteboardCanvas();

    const objects =
        getWhiteboardObjects();


    if (canvas) {

        canvas.style.transform =
            `scale(${whiteboardZoom})`;

        canvas.style.transformOrigin =
            "top left";

    }


    if (objects) {

        objects.style.transform =
            `scale(${whiteboardZoom})`;

        objects.style.transformOrigin =
            "top left";

    }

}


/* =========================================================
   ZOOM LABEL
   ========================================================= */

function updateZoomLabel() {

    const label =
        document.getElementById(
            "zoomValue"
        );


    if (!label) return;


    label.textContent =
        Math.round(
            whiteboardZoom * 100
        ) + "%";

}


/* =========================================================
   FIT WHITEBOARD
   ========================================================= */

function fitWhiteboard() {

    whiteboardZoom =
        1;


    applyWhiteboardZoom();

    updateZoomLabel();

}


/* =========================================================
   GRID
   ========================================================= */

function toggleWhiteboardGrid() {

    const wrapper =
        getWhiteboardWrapper();


    if (!wrapper) return;


    whiteboardGridEnabled =
        !whiteboardGridEnabled;


    wrapper.classList.toggle(
        "grid-enabled",
        whiteboardGridEnabled
    );

}


/* =========================================================
   FULLSCREEN
   ========================================================= */

async function toggleWhiteboardFullscreen() {

    const screen =
        document.getElementById(
            "whiteboardScreen"
        );


    if (!screen) return;


    if (
        !document.fullscreenElement
    ) {

        try {

            await screen.requestFullscreen();

        }

        catch (error) {

            screen.classList.toggle(
                "fake-fullscreen"
            );

        }

    }

    else {

        try {

            await document.exitFullscreen();

        }

        catch (error) {

            screen.classList.remove(
                "fake-fullscreen"
            );

        }

    }

}


/* =========================================================
   CLOSE WHITEBOARD
   ========================================================= */

function closeWhiteboard() {

    saveCurrentWhiteboard();


    whiteboardCurrentId =
        null;


    drawing =
        false;


    document
        .getElementById(
            "whiteboardScreen"
        )
        ?.classList.add(
            "hidden"
        );


    document.body.classList.remove(
        "whiteboard-open"
    );


    whiteboardHistory = [];

    whiteboardHistoryIndex =
        -1;

}