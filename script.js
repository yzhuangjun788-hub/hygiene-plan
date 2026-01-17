// Simple storage
let completedDays = JSON.parse(localStorage.getItem('completedDays') || '[]');
let earnedBadges = JSON.parse(localStorage.getItem('earnedBadges') || '[]');

// Checklist logic
const checklist = document.getElementById('checklist');
checklist.addEventListener('change', () => {
  const allDone = Array.from(checklist.querySelectorAll('input')).every(cb => cb.checked);
  if (allDone) {
    const today = new Date().toISOString().split('T')[0];
    if (!completedDays.includes(today)) {
      completedDays.push(today);
      localStorage.setItem('completedDays', JSON.stringify(completedDays));
      checkBadges();
      renderCalendar();
      renderBadges();
    }
  }
});

// Calendar logic
function renderCalendar() {
  const calendar = document.getElementById('calendar');
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
    calendar.appendChild(div);
  }
}

// Badges logic
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

// Initial render
renderCalendar();
renderBadges();
