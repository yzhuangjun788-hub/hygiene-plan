// ---------- STATE ----------
let state = JSON.parse(localStorage.getItem("state")) || {
  xp: 0,
  level: 1,
  habits: [],
  days: {},
  customGoals: []
};

const BASE_HABITS = [
  { name: "Shower 🚿", xp: 20 },
  { name: "Brush Teeth 🦷", xp: 15 },
  { name: "Deodorant 🧴", xp: 10 }
];

// ---------- INIT ----------
function init() {
  if (state.habits.length === 0) {
    state.habits = [...BASE_HABITS];
  }
  render();
}
init();

// ---------- RENDER ----------
function render() {
  renderHabits();
  renderXP();
  renderCalendar();
  renderPlan();
  save();
}

function renderHabits() {
  habitList.innerHTML = "";
  state.habits.forEach((h, i) => {
    const div = document.createElement("div");
    div.className = "habit";
    div.innerHTML = `
      <span>${h.name}</span>
      <button onclick="completeHabit(${i})">+${h.xp} XP</button>
    `;
    habitList.appendChild(div);
  });
}

function renderXP() {
  const levelXP = state.level * 100;
  const pct = Math.min(100, (state.xp / levelXP) * 100);
  xpFill.style.width = pct + "%";
  xpText.innerText = `XP: ${state.xp} / ${levelXP}`;
  levelText.innerText = `Level ${state.level}`;
}

function renderCalendar() {
  calendar.innerHTML = "";
  const today = new Date();
  const todayKey = today.toISOString().slice(0,10);

  for (let i = 1; i <= 30; i++) {
    const key = todayKey.slice(0,8) + String(i).padStart(2,"0");
    const div = document.createElement("div");
    div.className = "day";

    if (state.days[key]) div.classList.add("good");
    if (i === today.getDate()) div.classList.add("today");

    div.innerText = i + (state.days[key] ? "🔥" : "");
    calendar.appendChild(div);
  }
}

function renderPlan() {
  planList.innerHTML = "";
  [...state.habits, ...state.customGoals].forEach(h => {
    const li = document.createElement("div");
    li.innerText = h.name || h;
    planList.appendChild(li);
  });
}

// ---------- ACTIONS ----------
function completeHabit(i) {
  state.xp += state.habits[i].xp;
  checkLevelUp();
  render();
}

function completeDay() {
  const key = new Date().toISOString().slice(0,10);
  state.days[key] = true;
  render();
}

function addCustomGoal() {
  if (customGoal.value.trim()) {
    state.customGoals.push(customGoal.value);
    customGoal.value = "";
    render();
  }
}

function checkLevelUp() {
  if (state.xp >= state.level * 100) {
    state.level++;
  }
}

function save() {
  localStorage.setItem("state", JSON.stringify(state));
}

// ---------- QUEST ----------
const quests = [
  "Complete 3 habits",
  "Shower before noon",
  "Reflect today"
];
dailyQuest.innerText = quests[Math.floor(Math.random()*quests.length)];

function completeQuest() {
  state.xp += 30;
  checkLevelUp();
  render();
}

// =========================
// LIGHT / DARK MODE TOGGLE
// =========================
const toggleThemeBtn = document.getElementById("toggleTheme");

// Set default theme
document.body.dataset.theme = "dark";

toggleThemeBtn.addEventListener("click", () => {
  const isDark = document.body.dataset.theme === "dark";
  
  if (isDark) {
    document.body.dataset.theme = "light";
    document.documentElement.style.setProperty("--bg-color", "#f9fafb");
    document.documentElement.style.setProperty("--bg-gradient", "linear-gradient(180deg, #ffffff, #e0e0e0)");
    document.documentElement.style.setProperty("--text-color", "#111827");
    document.documentElement.style.setProperty("--card-bg", "#ffffff");
    document.documentElement.style.setProperty("--habit-bg", "#e5e7eb");
    document.documentElement.style.setProperty("--habit-done-bg", "#a7f3d0");
  } else {
    document.body.dataset.theme = "dark";
    document.documentElement.style.setProperty("--bg-color", "#1f2933");
    document.documentElement.style.setProperty("--bg-gradient", "linear-gradient(180deg, #1f2933, #111827)");
    document.documentElement.style.setProperty("--text-color", "#f9fafb");
    document.documentElement.style.setProperty("--card-bg", "#1f2937");
    document.documentElement.style.setProperty("--habit-bg", "#374151");
    document.documentElement.style.setProperty("--habit-done-bg", "#065f46");
  }
});
