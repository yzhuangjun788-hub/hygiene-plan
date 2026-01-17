// --- Storage for completed days, tasks, and badges ---
let completedDays = JSON.parse(localStorage.getItem('completedDays') || '[]');
let dayTasks = JSON.parse(localStorage.getItem('dayTasks') || '{}');
let earnedBadges = JSON.parse(localStorage.getItem('earnedBadges') || '[]');

// --- Checklist logic ---
const checklist = document.getElementById('checklist');

checklist.addEventListener('change', () => {
  const allDone = Array.from(checklist.querySelectorAll('input')).every(cb => cb.checked);
  const today = new Date().toISOString().split('T')[0];

  // Save tasks for today
  const tasks = Array.from(checklist.querySelectorAll('input')).map(cb => ({
    name: cb.dataset.task,
    done: cb.checked
  }));
  dayTasks[today] = tasks;
  localStorage.setItem('dayTasks', JSON.stringify(dayTasks));

  if (allDone && !completedDays.includes(today)) {
    completedDays.push(today);
    localStorage.setItem('completedDays', JSON.stringify(completedDays));
    checkBadges();
  }

  renderCalendar();
  renderBadges();
});

// --- Calendar rendering ---
const calendar = document.getElementById('calendar');
const dayDetails = document.getElementById('dayDetails');

function renderCalendar() {
  calendar.innerHTML = '';
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month+1, 0).getDate();

  for (let i=1; i<=daysInMonth; i++) {
    const dayDate = new Date(year, month, i).toISOString().split('T')[0];
    const div = document.createElement('div');
    div.textContent = i;
    div.className = 'calendar-day';
    if (completedDays.includes(dayDate)) div.classList.add('completed');

    div.addEventListener('click', () => {
      const tasks = dayTasks[dayDate] || [];
      if (tasks.length === 0) {
        dayDetails.textContent = "No data for this day.";
      } else {
        dayDetails.innerHTML = tasks.map(t => 
          `${t.done ? "✅" : "❌"} ${t.name}`
        ).join('<br>');
      }
    });

    calendar.appendChild(div);
  }
}

// --- Badges logic ---
const badgeList = [
  { id: 1, name: 'First Completion', requirement: 1 },
  { id: 2, name: '7-Day Streak', requirement: 7 },
  { id: 3, name: '14-Day Streak', requirement: 14 },
];

function checkBadges() {
  badgeList.forEach(b => {
    if (!earnedBadges.includes(b.id) && completedDays.length >= b.requirement) {
      earnedBadges.push(b.id);
      localStorage.setItem('earnedBadges', JSON.stringify(earnedBadges));
    }
  });
}

function renderBadges() {
  const badgesDiv = document.getElementById('badges');
  badgesDiv.innerHTML = '';
  earnedBadges.forEach(id => {
    const badge = badgeList.find(b => b.id === id);
    const div = document.createElement('div');
    div.className = 'badge';
    div.textContent = badge.name;
    badgesDiv.appendChild(div);
  });
}

// --- Generate new hygiene plan (multiple choice) ---
const generateBtn = document.getElementById('generatePlanBtn');
generateBtn.addEventListener('click', () => {
  // Multiple choice questions
  const wakeUp = prompt("Choose your wake-up time:\n1) 6:00  2) 7:00  3) 8:00");
  const sleep = prompt("Choose your sleep time:\n1) 22:00  2) 23:00  3) 24:00");
  const exercise = prompt("Do you exercise daily?\n1) Yes  2) No");
  const workFromHome = prompt("Do you work from home?\n1) Yes  2) No");

  const newTasks = ["Brush teeth", "Wash face"];
  if (exercise === '1') newTasks.push("Shower after exercise");
  if (workFromHome === '2') newTasks.push("Change clothes for work");
  newTasks.push("Skincare");

  checklist.innerHTML = '';
  newTasks.forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `<input type="checkbox" data-task="${task}"> ${task}`;
    checklist.appendChild(li);
  });

  alert("Your new daily hygiene plan has been generated!");
});

// --- Chicken Soup Card ---
const chickenSoupP = document.getElementById('chickenSoup');
const newQuoteBtn = document.getElementById('newQuoteBtn');

const chickenSoupQuotes = [
  "Every day is a fresh start. 🌞",
  "Believe in yourself and all that you are.",
  "Small steps every day lead to big results.",
  "Take care of your body, it's the only place you have to live.",
  "Happiness is homemade.",
  "Consistency is the key to success.",
];

function showRandomQuote() {
  const quote = chickenSoupQuotes[Math.floor(Math.random() * chickenSoupQuotes.length)];
  chickenSoupP.textContent = quote;
}

newQuoteBtn.addEventListener('click', showRandomQuote);
showRandomQuote();

// --- Theme switching ---
const themeBtn = document.getElementById('themeBtn');
let themes = ['light', 'dark', 'green'];
let currentTheme = 0;

themeBtn.addEventListener('click', () => {
  currentTheme = (currentTheme + 1) % themes.length;
  document.body.className = themes[currentTheme];
});

// --- Initial render ---
renderCalendar();
renderBadges();
