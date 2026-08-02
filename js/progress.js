/* =========================================
STUDY SPACE
PROGRESS SYSTEM
========================================= */

console.log("progress.js loaded");

let exams = [];
let editingExamId = null;

const PROGRESS_STORAGE_KEY = "studySpaceProgress";

let selectedYear = "current";


/* =========================================
START
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  loadExams();

  setupProgressButtons();

  setupExamPanel();

  setupYearFilter();

  renderProgress();

});


/* =========================================
STORAGE
========================================= */

function loadExams() {

  const saved =
    localStorage.getItem(PROGRESS_STORAGE_KEY);

  if (!saved) {

    exams = [];

    return;

  }

  try {

    const parsed =
      JSON.parse(saved);

    exams =
      Array.isArray(parsed)
        ? parsed
        : [];

  } catch (error) {

    console.error(
      "Could not load progress data:",
      error
    );

    exams = [];

  }

}


function saveExams() {

  localStorage.setItem(
    PROGRESS_STORAGE_KEY,
    JSON.stringify(exams)
  );

}


/* =========================================
YEAR FILTER
========================================= */

function setupYearFilter() {

  const header =
    document.querySelector(".progress-header");

  if (!header) return;


  const existing =
    document.getElementById("progressYearFilter");

  if (existing) {

    existing.addEventListener(
      "change",
      handleYearChange
    );

    return;

  }


  const filterWrapper =
    document.createElement("div");

  filterWrapper.className =
    "progress-year-filter";


  const label =
    document.createElement("label");

  label.textContent =
    "View year";


  label.htmlFor =
    "progressYearFilter";


  const select =
    document.createElement("select");

  select.id =
    "progressYearFilter";


  filterWrapper.appendChild(label);

  filterWrapper.appendChild(select);


  header.appendChild(filterWrapper);


  select.addEventListener(
    "change",
    handleYearChange
  );


  populateYearFilter();

}


function populateYearFilter() {

  const select =
    document.getElementById(
      "progressYearFilter"
    );

  if (!select) return;


  const previousValue =
    select.value;


  select.innerHTML = "";


  const allOption =
    document.createElement("option");

  allOption.value =
    "all";

  allOption.textContent =
    "All Years";

  select.appendChild(
    allOption
  );


  const currentYear =
    new Date().getFullYear();


  const currentOption =
    document.createElement("option");

  currentOption.value =
    String(currentYear);

  currentOption.textContent =
    String(currentYear);

  select.appendChild(
    currentOption
  );


  const years = new Set();


  exams.forEach(exam => {

    if (!exam.date) return;


    const year =
      getExamYear(exam);


    if (year) {

      years.add(year);

    }

  });


  Array.from(years)

    .filter(
      year =>
        year !== String(currentYear)
    )

    .sort(
      (a, b) =>
        Number(b) - Number(a)
    )

    .forEach(year => {

      const option =
        document.createElement("option");

      option.value =
        year;

      option.textContent =
        year;

      select.appendChild(
        option
      );

    });


  if (
    previousValue &&
    Array.from(select.options)
      .some(
        option =>
          option.value === previousValue
      )
  ) {

    select.value =
      previousValue;

  } else {

    select.value =
      String(currentYear);

    selectedYear =
      String(currentYear);

  }

}


function handleYearChange(event) {

  selectedYear =
    event.target.value;

  renderProgress();

}


function getExamYear(exam) {

  if (!exam || !exam.date) {

    return null;

  }


  const date =
    new Date(
      exam.date + "T00:00:00"
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return null;

  }


  return String(
    date.getFullYear()
  );

}


function getVisibleExams() {

  if (selectedYear === "all") {

    return [...exams];

  }


  return exams.filter(
    exam =>
      getExamYear(exam) ===
      selectedYear
  );

}


/* =========================================
BUTTONS
========================================= */

function setupProgressButtons() {

  const addButton =
    document.getElementById(
      "addExamButton"
    );


  const emptyButton =
    document.getElementById(
      "emptyAddExamButton"
    );


  if (addButton) {

    addButton.addEventListener(
      "click",
      openNewExamPanel
    );

  }


  if (emptyButton) {

    emptyButton.addEventListener(
      "click",
      openNewExamPanel
    );

  }

}


/* =========================================
PANEL
========================================= */

function setupExamPanel() {

  const closeButton =
    document.getElementById(
      "closeExamPanel"
    );


  const cancelButton =
    document.getElementById(
      "cancelExamButton"
    );


  const saveButton =
    document.getElementById(
      "saveExamButton"
    );


  const deleteButton =
    document.getElementById(
      "deleteExamButton"
    );


  const addSubjectButton =
    document.getElementById(
      "addSubjectButton"
    );


  if (closeButton) {

    closeButton.addEventListener(
      "click",
      closeExamPanel
    );

  }


  if (cancelButton) {

    cancelButton.addEventListener(
      "click",
      closeExamPanel
    );

  }


  if (saveButton) {

    saveButton.addEventListener(
      "click",
      saveCurrentExam
    );

  }


  if (deleteButton) {

    deleteButton.addEventListener(
      "click",
      deleteCurrentExam
    );

  }


  if (addSubjectButton) {

    addSubjectButton.addEventListener(
      "click",
      addSubjectInput
    );

  }

}


/* =========================================
OPEN NEW EXAM
========================================= */

function openNewExamPanel() {

  editingExamId = null;

  clearExamForm();


  const title =
    document.getElementById(
      "examPanelTitle"
    );


  const deleteButton =
    document.getElementById(
      "deleteExamButton"
    );


  if (title) {

    title.textContent =
      "Add Exam";

  }


  if (deleteButton) {

    deleteButton.classList.remove(
      "show"
    );

  }


  addSubjectInput();

  openExamPanel();

}


/* =========================================
OPEN EDIT EXAM
========================================= */

function openEditExam(examId) {

  const exam =
    exams.find(
      item =>
        item.id === examId
    );


  if (!exam) return;


  editingExamId =
    examId;


  document.getElementById(
    "examPanelTitle"
  ).textContent =
    "Edit Exam";


  document.getElementById(
    "examName"
  ).value =
    exam.name || "";


  document.getElementById(
    "examDate"
  ).value =
    exam.date || "";


  const subjectList =
    document.getElementById(
      "subjectInputList"
    );


  subjectList.innerHTML =
    "";


  exam.subjects.forEach(
    subject => {

      addSubjectInput(
        subject.name,
        subject.mark
      );

    }
  );


  document.getElementById(
    "deleteExamButton"
  ).classList.add(
    "show"
  );


  openExamPanel();

}


/* =========================================
PANEL OPEN / CLOSE
========================================= */

function openExamPanel() {

  const overlay =
    document.getElementById(
      "examPanelOverlay"
    );


  if (overlay) {

    overlay.classList.add(
      "open"
    );

  }

}


function closeExamPanel() {

  const overlay =
    document.getElementById(
      "examPanelOverlay"
    );


  if (overlay) {

    overlay.classList.remove(
      "open"
    );

  }


  editingExamId =
    null;

}


/* =========================================
CLEAR FORM
========================================= */

function clearExamForm() {

  const name =
    document.getElementById(
      "examName"
    );


  const date =
    document.getElementById(
      "examDate"
    );


  const list =
    document.getElementById(
      "subjectInputList"
    );


  if (name) {

    name.value =
      "";

  }


  if (date) {

    date.value =
      "";

  }


  if (list) {

    list.innerHTML =
      "";

  }

}


/* =========================================
SUBJECT INPUT
========================================= */

function addSubjectInput(
  subjectName = "",
  mark = ""
) {

  const list =
    document.getElementById(
      "subjectInputList"
    );


  if (!list) return;


  const row =
    document.createElement(
      "div"
    );


  row.className =
    "subject-input-row";


  const nameInput =
    document.createElement(
      "input"
    );


  nameInput.type =
    "text";


  nameInput.className =
    "subject-name-input";


  nameInput.placeholder =
    "Subject";


  nameInput.value =
    subjectName;


  const markInput =
    document.createElement(
      "input"
    );


  markInput.type =
    "text";


  markInput.className =
    "subject-mark-input";


  markInput.placeholder =
    "Mark";


  markInput.inputMode =
    "decimal";


  markInput.value =
    mark;


  const removeButton =
    document.createElement(
      "button"
    );


  removeButton.type =
    "button";


  removeButton.className =
    "remove-subject-button";


  removeButton.textContent =
    "-";


  removeButton.addEventListener(
    "click",
    () => {

      row.remove();

    }
  );


  row.appendChild(
    nameInput
  );


  row.appendChild(
    markInput
  );


  row.appendChild(
    removeButton
  );


  list.appendChild(
    row
  );

}


/* =========================================
SAVE EXAM
========================================= */

function saveCurrentExam() {

  const nameInput =
    document.getElementById(
      "examName"
    );


  const dateInput =
    document.getElementById(
      "examDate"
    );


  const examName =
    nameInput.value.trim();


  const examDate =
    dateInput.value;


  if (!examName) {

    alert(
      "Please enter an exam name."
    );

    return;

  }


  const rows =
    document.querySelectorAll(
      ".subject-input-row"
    );


  const subjects =
    [];


  rows.forEach(
    row => {

      const name =
        row.querySelector(
          ".subject-name-input"
        );


      const mark =
        row.querySelector(
          ".subject-mark-input"
        );


      if (!name || !mark) return;


      const subjectName =
        name.value.trim();


      const rawMark =
        mark.value.trim();


      if (!subjectName) return;


      let subjectMark =
        null;


      if (
        rawMark !== "" &&
        rawMark !== "-"
      ) {

        const number =
          Number(rawMark);


        if (
          !Number.isNaN(number) &&
          number >= 0 &&
          number <= 100
        ) {

          subjectMark =
            number;

        }

      }


      subjects.push({

        name:
          subjectName,

        mark:
          subjectMark

      });

    }
  );


  if (subjects.length === 0) {

    alert(
      "Please add at least one subject."
    );

    return;

  }


  const validMarks =
    subjects.filter(
      subject =>
        subject.mark !== null
    );


  if (validMarks.length === 0) {

    alert(
      "Please enter at least one valid mark."
    );

    return;

  }


  if (editingExamId) {

    const exam =
      exams.find(
        item =>
          item.id ===
          editingExamId
      );


    if (exam) {

      exam.name =
        examName;

      exam.date =
        examDate;

      exam.subjects =
        subjects;

    }

  } else {

    exams.push({

      id:
        Date.now(),

      name:
        examName,

      date:
        examDate,

      subjects:
        subjects,

      createdAt:
        new Date().toISOString()

    });

  }


  sortExams();

  saveExams();

  populateYearFilter();

  renderProgress();

  closeExamPanel();

}


/* =========================================
DELETE EXAM
========================================= */

function deleteCurrentExam() {

  if (!editingExamId) return;


  const confirmed =
    confirm(
      "Delete this exam?"
    );


  if (!confirmed) return;


  exams =
    exams.filter(
      exam =>
        exam.id !==
        editingExamId
    );


  saveExams();

  populateYearFilter();

  renderProgress();

  closeExamPanel();

}


/* =========================================
SORT EXAMS
========================================= */

function sortExams() {

  exams.sort(
    (a, b) => {

      if (!a.date) return 1;

      if (!b.date) return -1;

      return (
        new Date(a.date) -
        new Date(b.date)
      );

    }
  );

}


/* =========================================
RENDER EVERYTHING
========================================= */

function renderProgress() {

  const visibleExams =
    getVisibleExams();


  renderExamCards(
    visibleExams
  );


  renderSummary(
    visibleExams
  );


  renderSubjectAnalysis(
    visibleExams
  );


  renderTrend(
    visibleExams
  );

}


/* =========================================
EXAM CARDS
========================================= */

function renderExamCards(
  visibleExams
) {

  const grid =
    document.getElementById(
      "examGrid"
    );


  const empty =
    document.getElementById(
      "emptyExams"
    );


  if (!grid || !empty) return;


  grid.innerHTML =
    "";


  if (
    visibleExams.length === 0
  ) {

    empty.style.display =
      "block";

    return;

  }


  empty.style.display =
    "none";


  visibleExams.forEach(
    exam => {

      grid.appendChild(
        createExamCard(exam)
      );

    }
  );

}


/* =========================================
CREATE EXAM CARD
========================================= */

function createExamCard(exam) {

  const card =
    document.createElement(
      "article"
    );


  card.className =
    "exam-card";


  const average =
    calculateAverage(
      exam.subjects
    );


  const total =
    calculateTotal(
      exam.subjects
    );


  const gpa =
    calculateGPA(
      exam.subjects
    );


  const formattedDate =
    formatDate(
      exam.date
    );


  card.innerHTML = `

    <div class="exam-card-header">

      <div class="exam-card-title">

        <h3>
          ${escapeHTML(exam.name)}
        </h3>

        <p class="exam-card-date">
          ${formattedDate}
        </p>

      </div>

      <div class="exam-menu-wrapper">

        <button
          class="exam-menu-button"
          type="button">

          ...

        </button>

        <div class="exam-menu">

          <button
            type="button"
            class="edit-exam-button">

            Edit

          </button>

          <button
            type="button"
            class="delete-exam-card-button">

            Delete

          </button>

        </div>

      </div>

    </div>


    <div class="exam-subjects">

      ${exam.subjects.map(
        subject => `

          <div class="exam-subject-row">

            <span class="exam-subject-name">
              ${escapeHTML(subject.name)}
            </span>

            <span
              class="exam-subject-mark ${
                subject.mark === null
                  ? "missing"
                  : ""
              }">

              ${
                subject.mark === null
                  ? "-"
                  : subject.mark
              }

            </span>

          </div>

        `
      ).join("")}

    </div>


    <div class="exam-stats">

      <div class="exam-stat">

        <span class="exam-stat-label">
          Average
        </span>

        <span class="exam-stat-value">
          ${
            average === null
              ? "-"
              : average + "%"
          }
        </span>

      </div>


      <div class="exam-stat">

        <span class="exam-stat-label">
          GPA
        </span>

        <span class="exam-stat-value">
          ${
            gpa === null
              ? "-"
              : gpa
          }
        </span>

      </div>


      <div class="exam-stat">

        <span class="exam-stat-label">
          Total
        </span>

        <span class="exam-stat-value">
          ${
            total === null
              ? "-"
              : total
          }
        </span>

      </div>

    </div>

  `;


  const menuButton =
    card.querySelector(
      ".exam-menu-button"
    );


  const menu =
    card.querySelector(
      ".exam-menu"
    );


  menuButton.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      menu.classList.toggle(
        "show"
      );

    }
  );


  card
    .querySelector(
      ".edit-exam-button"
    )
    .addEventListener(
      "click",
      () => {

        openEditExam(
          exam.id
        );

      }
    );


  card
    .querySelector(
      ".delete-exam-card-button"
    )
    .addEventListener(
      "click",
      () => {

        deleteExam(
          exam.id
        );

      }
    );


  return card;

}


/* =========================================
DELETE FROM CARD
========================================= */

function deleteExam(examId) {

  const confirmed =
    confirm(
      "Delete this exam?"
    );


  if (!confirmed) return;


  exams =
    exams.filter(
      exam =>
        exam.id !==
        examId
    );


  saveExams();

  populateYearFilter();

  renderProgress();

}


/* =========================================
SUMMARY
========================================= */

function renderSummary(
  visibleExams
) {

  const overallAverage =
    document.getElementById(
      "overallAverage"
    );


  const currentGPA =
    document.getElementById(
      "currentGPA"
    );


  const totalMarks =
    document.getElementById(
      "totalMarks"
    );


  const totalSubjects =
    document.getElementById(
      "totalSubjects"
    );


  const examCount =
    document.getElementById(
      "examCount"
    );


  const averageChange =
    document.getElementById(
      "averageChange"
    );


  const gpaChange =
    document.getElementById(
      "gpaChange"
    );


  const biggestImprovement =
    document.getElementById(
      "biggestImprovement"
    );


  const improvementPercentage =
    document.getElementById(
      "improvementPercentage"
    );


  const biggestDrop =
    document.getElementById(
      "biggestDrop"
    );


  const dropPercentage =
    document.getElementById(
      "dropPercentage"
    );


  if (examCount) {

    examCount.textContent =
      visibleExams.length;

  }


  if (
    visibleExams.length === 0
  ) {

    setText(
      overallAverage,
      "-"
    );

    setText(
      currentGPA,
      "-"
    );

    setText(
      totalMarks,
      "-"
    );

    setText(
      totalSubjects,
      "No results yet"
    );

    setText(
      averageChange,
      "No comparison yet"
    );

    setText(
      gpaChange,
      "No comparison yet"
    );

    setText(
      biggestImprovement,
      "-"
    );

    setText(
      improvementPercentage,
      "No comparison yet"
    );

    setText(
      biggestDrop,
      "-"
    );

    setText(
      dropPercentage,
      "No comparison yet"
    );

    return;

  }


  const current =
    visibleExams[
      visibleExams.length - 1
    ];


  const currentAverage =
    calculateAverage(
      current.subjects
    );


  const currentGPAValue =
    calculateGPA(
      current.subjects
    );


  const currentTotal =
    calculateTotal(
      current.subjects
    );


  setText(
    overallAverage,
    currentAverage === null
      ? "-"
      : currentAverage + "%"
  );


  setText(
    currentGPA,
    currentGPAValue === null
      ? "-"
      : currentGPAValue
  );


  setText(
    totalMarks,
    currentTotal === null
      ? "-"
      : currentTotal
  );


  const validSubjectCount =
    current.subjects.filter(
      subject =>
        subject.mark !== null
    ).length;


  setText(
    totalSubjects,
    validSubjectCount +
      " subjects counted"
  );


  if (
    visibleExams.length >= 2
  ) {

    const previous =
      visibleExams[
        visibleExams.length - 2
      ];


    const previousAverage =
      calculateAverage(
        previous.subjects
      );


    const previousGPA =
      calculateGPA(
        previous.subjects
      );


    if (
      currentAverage !== null &&
      previousAverage !== null
    ) {

      const difference =
        currentAverage -
        previousAverage;


      setText(
        averageChange,
        formatDifference(
          difference,
          "%"
        )
      );

    }


    if (
      currentGPAValue !== null &&
      previousGPA !== null
    ) {

      const difference =
        currentGPAValue -
        previousGPA;


      setText(
        gpaChange,
        formatDifference(
          difference,
          ""
        )
      );

    }

  } else {

    setText(
      averageChange,
      "No comparison yet"
    );

    setText(
      gpaChange,
      "No comparison yet"
    );

  }


  renderBiggestChanges(
    visibleExams,
    biggestImprovement,
    improvementPercentage,
    biggestDrop,
    dropPercentage
  );

}


/* =========================================
BIGGEST CHANGES
========================================= */

function renderBiggestChanges(
  visibleExams,
  improvementElement,
  improvementPercentageElement,
  dropElement,
  dropPercentageElement
) {

  if (
    visibleExams.length < 2
  ) {

    setText(
      improvementElement,
      "-"
    );

    setText(
      improvementPercentageElement,
      "No comparison yet"
    );

    setText(
      dropElement,
      "-"
    );

    setText(
      dropPercentageElement,
      "No comparison yet"
    );

    return;

  }


  const previous =
    visibleExams[
      visibleExams.length - 2
    ];


  const current =
    visibleExams[
      visibleExams.length - 1
    ];


  const changes =
    compareSubjects(
      previous,
      current
    );


  if (changes.length === 0) {

    setText(
      improvementElement,
      "-"
    );

    setText(
      improvementPercentageElement,
      "No matching subjects"
    );

    setText(
      dropElement,
      "-"
    );

    setText(
      dropPercentageElement,
      "No matching subjects"
    );

    return;

  }


  const improvements =
    changes.filter(
      item =>
        item.percentageChange > 0
    );


  const drops =
    changes.filter(
      item =>
        item.percentageChange < 0
    );


  if (
    improvements.length > 0
  ) {

    const biggest =
      improvements.reduce(
        (best, item) =>
          item.percentageChange >
          best.percentageChange
            ? item
            : best
      );


    setText(
      improvementElement,
      biggest.subject
    );


    setText(
      improvementPercentageElement,
      "+" +
      formatNumber(
        biggest.percentageChange
      ) +
      "%"
    );

  } else {

    setText(
      improvementElement,
      "-"
    );

    setText(
      improvementPercentageElement,
      "No improvement"
    );

  }


  if (drops.length > 0) {

    const biggest =
      drops.reduce(
        (worst, item) =>
          item.percentageChange <
          worst.percentageChange
            ? item
            : worst
      );


    setText(
      dropElement,
      biggest.subject
    );


    setText(
      dropPercentageElement,
      formatNumber(
        biggest.percentageChange
      ) +
      "%"
    );

  } else {

    setText(
      dropElement,
      "-"
    );

    setText(
      dropPercentageElement,
      "No drop"
    );

  }

}


/* =========================================
SUBJECT ANALYSIS
========================================= */

function renderSubjectAnalysis(
  visibleExams
) {

  const container =
    document.getElementById(
      "subjectAnalysis"
    );


  if (!container) return;


  if (
    visibleExams.length < 2
  ) {

    container.innerHTML = `

      <div class="empty-analysis">

        <h3>
          No comparison available
        </h3>

        <p>
          Add at least two exams with matching subjects to compare your results.
        </p>

      </div>

    `;

    return;

  }


  const previous =
    visibleExams[
      visibleExams.length - 2
    ];


  const current =
    visibleExams[
      visibleExams.length - 1
    ];


  const changes =
    compareSubjects(
      previous,
      current
    );


  if (
    changes.length === 0
  ) {

    container.innerHTML = `

      <div class="empty-analysis">

        <h3>
          No matching subjects
        </h3>

        <p>
          The latest two exams do not contain subjects with marks in both exams.
        </p>

      </div>

    `;

    return;

  }


  container.innerHTML = `

    <div class="subject-analysis-row subject-analysis-header">

      <span>
        Subject
      </span>

      <span>
        Previous
      </span>

      <span>
        Current
      </span>

      <span>
        Change
      </span>

    </div>

  `;


  changes.forEach(
    change => {

      const row =
        document.createElement(
          "div"
        );


      row.className =
        "subject-analysis-row";


      const changeClass =
        change.percentageChange > 0
          ? "improved"
          : change.percentageChange < 0
            ? "dropped"
            : "neutral";


      const changeText =
        change.percentageChange > 0
          ? "+" +
            formatNumber(
              change.percentageChange
            ) +
            "%"
          : formatNumber(
              change.percentageChange
            ) +
            "%";


      const status =
        change.percentageChange > 0
          ? "Improved"
          : change.percentageChange < 0
            ? "Dropped"
            : "No change";


      row.innerHTML = `

        <span class="analysis-subject">

          ${escapeHTML(
            change.subject
          )}

        </span>


        <span class="analysis-mark">

          ${change.previous}

        </span>


        <span class="analysis-mark">

          ${change.current}

        </span>


        <span>

          <span
            class="analysis-change ${changeClass}">

            ${changeText}

          </span>

          <span
            class="analysis-status ${changeClass}">

            ${status}

          </span>

        </span>

      `;


      container.appendChild(
        row
      );

    }
  );

}


/* =========================================
COMPARE SUBJECTS
========================================= */

function compareSubjects(
  previousExam,
  currentExam
) {

  const previousMap =
    new Map();


  previousExam.subjects.forEach(
    subject => {

      if (
        subject.mark !== null
      ) {

        previousMap.set(
          normalizeSubjectName(
            subject.name
          ),
          subject
        );

      }

    }
  );


  const results =
    [];


  currentExam.subjects.forEach(
    subject => {

      if (
        subject.mark === null
      ) {

        return;

      }


      const key =
        normalizeSubjectName(
          subject.name
        );


      const previous =
        previousMap.get(
          key
        );


      if (
        !previous ||
        previous.mark === null
      ) {

        return;

      }


      const difference =
        subject.mark -
        previous.mark;


      let percentageChange =
        0;


      if (
        previous.mark !== 0
      ) {

        percentageChange =
          (
            difference /
            previous.mark
          ) *
          100;

      }


      results.push({

        subject:
          subject.name,

        previous:
          previous.mark,

        current:
          subject.mark,

        difference:
          difference,

        percentageChange:
          percentageChange

      });

    }
  );


  return results;

}


/* =========================================
TREND
========================================= */

function renderTrend(
  visibleExams
) {

  const chart =
    document.getElementById(
      "trendChart"
    );


  if (!chart) return;


  chart.innerHTML =
    "";


  if (
    visibleExams.length === 0
  ) {

    chart.innerHTML = `

      <div class="empty-chart">

        <p>
          Add exam results to see your academic trend.
        </p>

      </div>

    `;

    return;

  }


  const validExams =
    visibleExams

      .map(
        exam => ({

          exam:
            exam,

          average:
            calculateAverage(
              exam.subjects
            )

        })
      )

      .filter(
        item =>
          item.average !== null
      );


  if (
    validExams.length === 0
  ) {

    chart.innerHTML = `

      <div class="empty-chart">

        <p>
          Add valid marks to see your academic trend.
        </p>

      </div>

    `;

    return;

  }


  const line =
    document.createElement(
      "div"
    );


  line.className =
    "trend-line";


  validExams.forEach(
    (item, index) => {

      const point =
        document.createElement(
          "div"
        );


      point.className =
        "trend-point";


      const x =
        validExams.length === 1
          ? 50
          : (
              index /
              (
                validExams.length -
                1
              )
            ) *
            100;


      const y =
        item.average;


      point.style.left =
        x + "%";


      point.style.bottom =
        y + "%";


      point.title =
        item.exam.name +
        ": " +
        item.average +
        "%";


      const label =
        document.createElement(
          "span"
        );


      label.className =
        "trend-label";


      label.textContent =
        item.exam.name;


      label.style.left =
        x + "%";


      point.appendChild(
        label
      );


      line.appendChild(
        point
      );

    }
  );


  chart.appendChild(
    line
  );

}


/* =========================================
CALCULATIONS
========================================= */

function calculateAverage(
  subjects
) {

  const valid =
    subjects.filter(
      subject =>
        subject.mark !== null
    );


  if (
    valid.length === 0
  ) {

    return null;

  }


  const total =
    valid.reduce(
      (sum, subject) =>
        sum + subject.mark,
      0
    );


  return formatNumber(
    total / valid.length
  );

}


function calculateTotal(
  subjects
) {

  const valid =
    subjects.filter(
      subject =>
        subject.mark !== null
    );


  if (
    valid.length === 0
  ) {

    return null;

  }


  return valid.reduce(
    (sum, subject) =>
      sum + subject.mark,
    0
  );

}


/* =========================================
GPA
========================================= */

function calculateGPA(
  subjects
) {

  const valid =
    subjects.filter(
      subject =>
        subject.mark !== null
    );


  if (
    valid.length === 0
  ) {

    return null;

  }


  const gradePoints =
    valid.map(
      subject =>
        getGradePoint(
          subject.mark
        )
    );


  const total =
    gradePoints.reduce(
      (sum, point) =>
        sum + point,
      0
    );


  return formatNumber(
    total /
    gradePoints.length,
    2
  );

}


function getGradePoint(
  mark
) {

  if (mark >= 90) return 4.00;

  if (mark >= 80) return 4.00;

  if (mark >= 75) return 3.67;

  if (mark >= 70) return 3.33;

  if (mark >= 65) return 3.00;

  if (mark >= 60) return 2.67;

  if (mark >= 55) return 2.33;

  if (mark >= 50) return 2.00;

  if (mark >= 45) return 1.67;

  if (mark >= 40) return 1.00;

  return 0.00;

}


/* =========================================
HELPERS
========================================= */

function normalizeSubjectName(
  name
) {

  return name
    .trim()
    .toLowerCase()
    .replace(
      /\s+/g,
      " "
    );

}


function formatNumber(
  number,
  decimals = 1
) {

  return Number(
    number.toFixed(
      decimals
    )
  );

}


function formatDifference(
  difference,
  suffix
) {

  const rounded =
    formatNumber(
      difference
    );


  if (rounded > 0) {

    return "+" +
      rounded +
      suffix;

  }


  if (rounded < 0) {

    return rounded +
      suffix;

  }


  return "No change";

}


function formatDate(
  dateString
) {

  if (!dateString) {

    return "No date";

  }


  const date =
    new Date(
      dateString +
      "T00:00:00"
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "No date";

  }


  return date.toLocaleDateString(
    undefined,
    {
      day:
        "numeric",

      month:
        "short",

      year:
        "numeric"
    }
  );

}


function setText(
  element,
  value
) {

  if (element) {

    element.textContent =
      value;

  }

}


function escapeHTML(
  text
) {

  const div =
    document.createElement(
      "div"
    );


  div.textContent =
    text;


  return div.innerHTML;

}


/* =========================================
CLOSE MENUS
========================================= */

document.addEventListener(
  "click",
  () => {

    document
      .querySelectorAll(
        ".exam-menu.show"
      )
      .forEach(
        menu =>
          menu.classList.remove(
            "show"
          )
      );

  }
);