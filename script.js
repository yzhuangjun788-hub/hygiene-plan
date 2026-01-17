/* ---------- STORAGE ---------- */
let completedDays = JSON.parse(localStorage.getItem("completedDays") || "[]");
let dayTasks = JSON.parse(localStorage.getItem("dayTasks") || "{}");
let earnedBadges = JSON.parse(localStorage.getItem("earnedBadges") || "[]");

/* ---------- CHECKLIST ---------- */
const checklist = document.getElementById("checklist");

checklist.addEventListener("change", () => {
  const today = new Date().toISOString().split("T")[0];

  const tasks = [...checklist.querySelectorAll("input")].map(cb => ({
    name: cb.dataset.task,
    done: cb.checked
  }));

  dayTasks[today] = tasks;
  localStorage.setItem("dayTasks", JSON.stringify(dayTasks));

  if (tasks.every(t => t.done) && !completedDays.includes(today)) {
    completedDays.push(today);
    localStorage.setItem("completedDays", JSON.stringify(completedDays));
    checkBadges();
  }

  renderCalendar();
  renderBadges();
});

/* ---------- CALENDAR ---------- */
const calendar = document.getElementById("calendar");
const dayDetails = document.getElementById("dayDetails");

function renderCalendar() {
  calendar.innerHTML = "";
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = new Date(year, month, d).toISOString().split("T")[0];
    const div = document.createElement("div");
    div.textContent = d;
    div.className = "calendar-day";

    if (completedDays.includes(dateStr)) {
      div.classList.add("completed");
    }

    div.onclick = () => {
      const tasks = dayTasks[dateStr];
      if (!tasks) {
        dayDetails.textContent = "No data for this day.";
      } else {
        dayDetails.innerHTML = tasks
          .map(t => `${t.done ? "✅" : "❌"} ${t.name}`)
          .join("<br>");
      }
    };

    calendar.appendChild(div);
  }
}

/* ---------- BADGES ---------- */
const badgeList = [
  { id: 1, name: "First Day!" },
  { id: 7, name: "7-Day Streak!" },
  { id: 14, name: "14-Day Legend!" }
];

function checkBadges() {
  badgeList.forEach(b => {
    if (completedDays.length >= b.id && !earnedBadges.includes(b.id)) {
      earnedBadges.push(b.id);
      localStorage.setItem("earnedBadges", JSON.stringify(earnedBadges));
    }
  });
}

function renderBadges() {
  const box = document.getElementById("badges");
  box.innerHTML = "";
  earnedBadges.forEach(id => {
    const badge = badgeList.find(b => b.id === id);
    const div = document.createElement("div");
    div.className = "badge";
    div.textContent = badge.name;
    box.appendChild(div);
  });
}

/* ---------- CHICKEN SOUP ---------- */
const soups = [
  "Small steps still move you forward.",
  "Taking care of yourself is productive.",
  "Consistency beats motivation.",
  "You showed up today. That matters.",
  "Your future self thanks you."
];

const soupText = document.getElementById("chickenSoup");
document.getElementById("newQuoteBtn").onclick = () => {
  soupText.textContent = soups[Math.floor(Math.random() * soups.length)];
};
soupText.textContent = soups[0];

/* ---------- THEME SWITCH ---------- */
const themes = ["light", "dark", "green"];
let themeIndex = themes.indexOf(localStorage.getItem("theme")) || 0;

document.body.className = themes[themeIndex];

document.getElementById("themeBtn").onclick = () => {
  themeIndex = (themeIndex + 1) % themes.length;
  document.body.className = themes[themeIndex];
  localStorage.setItem("theme", themes[themeIndex]);
};

/* ---------- INIT ---------- */
renderCalendar();
renderBadges();
