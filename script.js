
const students = [
  "ACUPIDO GENESIS JOSH GALASINAO",
  "AGSINOD RANDOLF LIMBAUAN",
  "ALAMANI PRINCESS DIMPLE ANTOLIN",
  "ALIP JANE LOISE SILLDERA",
  "AMBATALI ANGELINE DOLIG",
  "ANGELES MARK BRYAN DRUJA",
  "ANGUI EMERALD VALIENTE",
  "ANTONIO JOHN PAUL BONSOL",
  "BARCELO CHRISTOPHER PAOLOS",
  "BAUTISTA FENDI ZALUN",
  "BUCAG RENZ ULAO",
  "BULLANDAY RICA MAY MARTIN",
  "CABANILLA ANNEDRIA JHEM RAMIREZ",
  "CARIAZO CRIZZEL JHOY BUDUAN",
  "CASTAÑEDA JAN OSIAS JARA",
  "DACAYANAN MARK IAN SORIANO",
  "DACAYANAN MARVIN SORIANO",
  "DEL ROSARIO IVY COSME",
  "DELA CRUZ BRIEL KIAN TERRENAL",
  "DELA CRUZ NEO SALADINO",
  "DELA PEÑA DASTINE",
  "DELA PEÑA MAIJOY TACPE",
  "DILAG SHAIRYL ROSE TIMBREZA",
  "DIOCARES MAR PAGUYO",
  "DOMINGO JENY MAE BALANCIO",
  "FERNANDEZ JEAN OBILLO",
  "GAMBOA CHRIS JERICHO",
  "GOROSPE NICOLE BALORIO",
  "IQUIN JANELLE ANQUE",
  "MABBAGU RICHMOND BULAUAN",
  "MABUTI ARVIN BIBAT",
  "MACALINAO PHIEJELYN HILARIO",
  "MAGBUAL JR. DARWIN PASION",
  "MARINDUQUE MELANIE JOICE VENTURA",
  "PASCUA JENA ZEA VIERNES",
  "PINTO AIZEL JHON DREI LLARDE",
  "PORTALES MARK JOSHUA SALADINO",
  "QUINTOS DAISY JANE A.",
  "RAMOS FRANCIS JB VIERNES",
  "RAMOS ROMAR OLEGNIO",
  "RESPICIO EDDIESON AGAG",
  "SALVADOR ELVIN JHUN ACEVEDA",
  "SAPON ANGEL DAVE GALANG",
  "SUBIDO JR. LEONARDO ARDIZAS",
  "TOMAS MARK ASSET BAUTISTA",
  "TULIAO LUISA PAULENE AGNO",
  "TUPAZ WEI AN JIA FLORANIA",
  "UMANDAL DEN MYKEL MAYO",
  "VICTORIO JILIAN LUIS",
  "VILLANUEVA LORENZ MAE DELA PEÑA"
];

const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const attendanceDate = document.getElementById("attendanceDate");

const totalStudents = document.getElementById("totalStudents");
const presentCount = document.getElementById("presentCount");
const absentCount = document.getElementById("absentCount");
const excuseCount = document.getElementById("excuseCount");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const emptyMessage = document.getElementById("emptyMessage");
const toast = document.getElementById("toast");

const STORAGE_PREFIX = "oop-attendance-storm-v1-";

let attendance = {};
let toastTimer;

totalStudents.textContent = students.length;

// Use today's date as the initial attendance date.
function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

attendanceDate.value = getToday();

function storageKey() {
  return STORAGE_PREFIX + attendanceDate.value;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function saveAttendance() {
  try {
    localStorage.setItem(
      storageKey(),
      JSON.stringify(attendance)
    );
  } catch (error) {
    showToast("Unable to save attendance in this browser.");
  }
}

function loadAttendance() {
  try {
    const saved = localStorage.getItem(storageKey());
    attendance = saved ? JSON.parse(saved) : {};

    if (
      !attendance ||
      typeof attendance !== "object" ||
      Array.isArray(attendance)
    ) {
      attendance = {};
    }
  } catch (error) {
    attendance = {};
    showToast("Could not load saved attendance.");
  }

  renderList();
  updateStats();
}

function updateStats() {
  let present = 0;
  let absent = 0;
  let excuse = 0;

  Object.values(attendance).forEach(status => {
    if (status === "present") present++;
    if (status === "absent") absent++;
    if (status === "excuse") excuse++;
  });

  presentCount.textContent = present;
  absentCount.textContent = absent;
  excuseCount.textContent = excuse;

  const marked = present + absent + excuse;
  const percentage = students.length
    ? Math.round((marked / students.length) * 100)
    : 0;

  progressText.textContent = `${percentage}%`;
  progressFill.style.width = `${percentage}%`;
}

function setStatus(index, status) {
  attendance[index] = status;
  saveAttendance();
  renderList();
  updateStats();
}

function updateClearButton() {
  clearSearch.hidden = searchInput.value.length === 0;
}

function renderList() {
  const query = searchInput.value.trim().toLowerCase();

  studentList.innerHTML = "";

  let visibleCount = 0;

  students.forEach((name, index) => {
    if (!name.toLowerCase().includes(query)) {
      return;
    }

    visibleCount++;

    const status = attendance[index] || "";
    const row = document.createElement("div");

    row.className = `student-row ${status}`;

    const info = document.createElement("div");
    info.className = "student-info";

    const number = document.createElement("span");
    number.className = "student-number";
    number.textContent = index + 1;

    const dot = document.createElement("span");
    dot.className = "status-dot";

    const studentName = document.createElement("span");
    studentName.className = "student-name";
    studentName.textContent = name;

    info.append(number, dot, studentName);

    const controls = document.createElement("div");
    controls.className = "student-controls";

    const buttons = [
      {
        label: "Present",
        status: "present",
        className: "present-btn"
      },
      {
        label: "Absent",
        status: "absent",
        className: "absent-btn"
      },
      {
        label: "Excuse",
        status: "excuse",
        className: "excuse-btn"
      }
    ];

    buttons.forEach(item => {
      const button = document.createElement("button");

      button.type = "button";
      button.textContent = item.label;
      button.className = `status-btn ${item.className}`;

      if (status === item.status) {
        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");
      } else {
        button.setAttribute("aria-pressed", "false");
      }

      button.addEventListener("click", () => {
        setStatus(index, item.status);
      });

      controls.appendChild(button);
    });

    row.append(info, controls);
    studentList.appendChild(row);
  });

  emptyMessage.hidden = visibleCount !== 0;
}

searchInput.addEventListener("input", () => {
  updateClearButton();
  renderList();
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  updateClearButton();
  renderList();
  searchInput.focus();
});

attendanceDate.addEventListener("change", () => {
  if (!attendanceDate.value) {
    attendanceDate.value = getToday();
  }

  loadAttendance();
  showToast("Attendance date changed.");
});

document.getElementById("finishBtn").addEventListener("click", () => {
  saveAttendance();

  const present = Object.values(attendance)
    .filter(status => status === "present").length;

  const absent = Object.values(attendance)
    .filter(status => status === "absent").length;

  const excuse = Object.values(attendance)
    .filter(status => status === "excuse").length;

  const unmarked = students.length - present - absent - excuse;

  const date = attendanceDate.value || getToday();

  alert(
    `ATTENDANCE SUMMARY\n\n` +
    `Date: ${date}\n` +
    `Total Students: ${students.length}\n\n` +
    `Present: ${present}\n` +
    `Absent: ${absent}\n` +
    `Excuse: ${excuse}\n` +
    `Unmarked: ${unmarked}\n\n` +
    `Attendance saved successfully!`
  );
});

document.getElementById("resetBtn").addEventListener("click", () => {
  const confirmed = confirm(
    "Are you sure you want to reset attendance for this date?"
  );

  if (!confirmed) return;

  attendance = {};
  saveAttendance();
  renderList();
  updateStats();

  showToast("Attendance has been reset.");
});

document.getElementById("pdfBtn").addEventListener("click", () => {
  saveAttendance();

  const date = attendanceDate.value || getToday();

  const counts = {
    present: 0,
    absent: 0,
    excuse: 0,
    unmarked: 0
  };

  const rows = students.map((name, index) => {
    const status = attendance[index] || "unmarked";

    counts[status]++;

    return `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHTML(name)}</td>
        <td>${status.toUpperCase()}</td>
      </tr>
    `;
  }).join("");

  const report = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Attendance Report - ${date}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #111;
          padding: 25px;
        }

        h1, h2, p {
          text-align: center;
        }

        h1 {
          font-size: 23px;
        }

        .summary {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 12px;
          margin: 25px 0;
        }

        .summary div {
          border: 1px solid #aaa;
          padding: 10px;
          min-width: 90px;
          text-align: center;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th, td {
          border: 1px solid #aaa;
          padding: 8px;
          text-align: left;
          font-size: 12px;
        }

        th {
          background: #e9eef5;
        }

        @media print {
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <h1>ATTENDANCE CHECKER</h1>
      <h2>Object Oriented Programming</h2>
      <p>Instructor: Jomar Balmores</p>
      <p>Attendance Date: ${escapeHTML(date)}</p>

      <div class="summary">
        <div><strong>Total</strong><br>${students.length}</div>
        <div><strong>Present</strong><br>${counts.present}</div>
        <div><strong>Absent</strong><br>${counts.absent}</div>
        <div><strong>Excuse</strong><br>${counts.excuse}</div>
        <div><strong>Unmarked</strong><br>${counts.unmarked}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Student Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    showToast("Please allow pop-ups to export the PDF.");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(report);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
});

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

// Initial setup
updateClearButton();
loadAttendance();
